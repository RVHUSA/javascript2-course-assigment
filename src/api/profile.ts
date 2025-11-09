import { SOCIAL_URL, API_KEY } from "../api/config";
import { getToken, getUser } from "../utils/storage";
import type { Post } from "../types/post";

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  const currentUser = getUser();

  const params = new URLSearchParams(window.location.search);
  const profileName = params.get("name") || currentUser?.name;

  const profileContainer = document.querySelector(".profile-container") as HTMLElement;
  const profileAvatar = document.getElementById("profileAvatar") as HTMLImageElement;
  const profileNameEl = document.getElementById("profileName")!;
  const profileBio = document.getElementById("profileBio")!;
  const followBtn = document.getElementById("followBtn") as HTMLButtonElement;
  const postsContainer = document.getElementById("userPostsContainer") as HTMLDivElement;

  if (!token || !profileName) {
    profileContainer.innerHTML = `<p>Please log in to view profiles.</p>`;
    return;
  }

  try {
    // --- GET profile info ---
    const profileResponse = await fetch(
      `${SOCIAL_URL}/profiles/${profileName}?_followers=true&_following=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    if (!profileResponse.ok) throw new Error("Failed to load profile");
    const profileData = await profileResponse.json();
    const profile = profileData.data;

    // --- GET users post---
    const postsResponse = await fetch(`${SOCIAL_URL}/profiles/${profileName}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const postsData = await postsResponse.json();
    const posts: Post[] = postsData.data ?? [];

    // --- Show profile ---
    profileAvatar.src = profile.avatar?.url;
    profileNameEl.textContent = profile.name;
    profileBio.textContent = profile.bio || "No bio provided.";

    const statsContainer = document.createElement("div");
    statsContainer.className = "profile-stats-inline";

    const postsStat = document.createElement("div");
    postsStat.className = "stat-item";
    postsStat.innerHTML = `<strong>${posts.length}</strong><span>Posts</span>`;

    const followersStat = document.createElement("div");
    followersStat.className = "stat-item";
    followersStat.innerHTML = `<strong>${profile.followers?.length || 0}</strong><span>Followers</span>`;

    const followingStat = document.createElement("div");
    followingStat.className = "stat-item";
    followingStat.innerHTML = `<strong>${profile.following?.length || 0}</strong><span>Following</span>`;

    statsContainer.append(postsStat, followersStat, followingStat);
    profileNameEl.insertAdjacentElement("afterend", statsContainer);

    // --- Follow/Unfollow button ---
    if (profile.name !== currentUser?.name) {
      followBtn.classList.remove("hidden");

      let isFollowing = profile.followers?.some(
        (f: any) => f.name === currentUser?.name
      );

      followBtn.textContent = isFollowing ? "Unfollow" : "Follow";

      followBtn.addEventListener("click", async () => {
        const action = isFollowing ? "unfollow" : "follow";

        try {
          const res = await fetch(`${SOCIAL_URL}/profiles/${profileName}/${action}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          });

          if (!res.ok) {
            const data = await res.json();
            console.error("Follow/unfollow error:", data);
            alert("Something went wrong. Try again.");
            return;
          }

          // Profile update after handeling
          const updatedRes = await fetch(
            `${SOCIAL_URL}/profiles/${profileName}?_followers=true&_following=true`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
              },
            }
          );

          const updatedProfile = (await updatedRes.json()).data;

          followersStat.querySelector("strong")!.textContent = updatedProfile.followers?.length ?? "0";
          followingStat.querySelector("strong")!.textContent = updatedProfile.following?.length ?? "0";

          isFollowing = updatedProfile.followers?.some(
            (f: any) => f.name === currentUser?.name
          );
          followBtn.textContent = isFollowing ? "Unfollow" : "Follow";
        } catch (error) {
          console.error("Follow/unfollow failed:", error);
        }
      });
    } else {
      followBtn.style.display = "none";
    }

    postsContainer.innerHTML = "";

    if (posts.length === 0) {
      postsContainer.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "post-card";
      card.innerHTML = `
        ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt || post.title}">` : ""}
        <h4>${post.title}</h4>
        <p>${post.body}</p>
      `;

      card.addEventListener("click", () => {
        window.location.href = `/post.html?id=${post.id}`;
      });

      postsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading profile:", error);
    profileContainer.innerHTML = `<p>Could not load profile. Try again later.</p>`;
  }
});
