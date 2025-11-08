import { fetchAllPosts, renderPosts, createPost, deletePost } from "./api/feed";
import { getToken } from "./utils/storage";
import { SOCIAL_URL, API_KEY } from "./api/config";

// --- CHECK TOKEN ---
const token = getToken();
if (!token) {
  console.warn("No token found. Redirecting to login...");
  window.location.href = "./login.html"; 
}

const feedContainer = document.getElementById("feedContainer") as HTMLDivElement | null;
const postForm = document.getElementById("postForm") as HTMLFormElement | null;
const titleInput = document.getElementById("title") as HTMLInputElement | null;
const bodyInput = document.getElementById("body") as HTMLTextAreaElement | null;
const imageInput = document.getElementById("imageUrl") as HTMLInputElement | null;

// --- SEARCH ELEMENTS ---
const searchInput = document.getElementById("profileSearch") as HTMLInputElement | null;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement | null;

async function loadAndRenderFeed() {
  if (!feedContainer) return;

  try {
    const posts = await fetchAllPosts();
    renderPosts(posts, feedContainer);
  } catch (error) {
    console.error(error);
    if (feedContainer) feedContainer.innerHTML = `<p style="color:red">Failed to load posts.</p>`;
  }
}

// --- CREATE NEW POST ---
if (postForm && titleInput && bodyInput && feedContainer) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    const imageUrl = imageInput?.value.trim();

    if (!title || !body) return alert("Please fill in both title and content before submitting.");

    try {
      await createPost(title, body, imageUrl);
      await loadAndRenderFeed();
      postForm.reset();
    } catch (err) {
      console.error(err);
    }
  });
}

// --- EVENT DELEGATION FOR EDIT/DELETE ---
if (feedContainer) {
  feedContainer.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (!target.dataset.id) return;

    const id = target.dataset.id;

    if (target.classList.contains("edit-btn")) {
      window.location.href = `/edit.html?id=${id}`;
    }

    if (target.classList.contains("delete-btn")) {
      await deletePost(id);
      const card = target.closest(".post-card");
      if (card) card.remove();
    }
  });
}

// --- SEARCH PROFILES ---
if (searchInput && searchBtn && feedContainer) {
  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`${SOCIAL_URL}/profiles/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!res.ok) throw new Error("Failed to search profiles");

      const data = await res.json();
      const profiles = data.data;

      feedContainer.innerHTML = "";

      if (profiles.length === 0) {
        feedContainer.innerHTML = "<p>No profiles found.</p>";
        return;
      }

      profiles.forEach((profile: any) => {
        const card = document.createElement("div");
        card.className = "profile-card";
        card.innerHTML = `
          <img src="${profile.avatar?.url}" alt="${profile.name}" class="avatar">
          <h3>${profile.name}</h3>
          <p>${profile.bio || ""}</p>
        `;
        card.addEventListener("click", () => {
          window.location.href = `/profile.html?name=${profile.name}`;
        });
        feedContainer.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      feedContainer.innerHTML = "<p style='color:red'>Search failed. Try again.</p>";
    }
  });
}

document.addEventListener("DOMContentLoaded", loadAndRenderFeed);
