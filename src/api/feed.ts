import { SOCIAL_URL, API_KEY } from "../api/config";
import type { Post, User } from "../types/post";
import { getToken, getUser } from "../utils/storage";

// --- FETCH ALL POSTS ---
export async function fetchAllPosts(): Promise<Post[]> {
  const token = getToken();
  if (!token) throw new Error("No auth token found. Please log in.");

  const response = await fetch(`${SOCIAL_URL}/posts?_author=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts. Please try again.");
  }

  const data = await response.json();

  return Array.isArray(data.data) ? data.data : [];
}

// --- CREATE NEW POST ---
export async function createPost(
  title: string,
  body: string,
  imageUrl?: string
): Promise<Post> {
  const token = getToken();
  if (!token) throw new Error("No auth token found. Please log in.");

  const postData: Record<string, any> = { title, body };
  if (imageUrl) {
    postData.media = { url: imageUrl, alt: title };
  }

  const response = await fetch(`${SOCIAL_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.errors?.[0]?.message || "Failed to create post. Please try again."
    );
  }

  return data.data ?? data;
}

// --- DELETE POST ---
export async function deletePost(postId: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("No auth token found.");

  const confirmed = confirm("Are you sure you want to delete this post?");
  if (!confirmed) return;

  const response = await fetch(`${SOCIAL_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) throw new Error("Failed to delete post.");
  alert("Post deleted successfully!");
}

// --- RENDER POSTS ---
export function renderPosts(posts: Post[], container: HTMLDivElement): void {
  container.innerHTML = "";

  if (!posts.length) {
    container.innerHTML = "<p>No posts available.</p>";
    return;
  }

  const currentUser: User | null = getUser();

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.dataset.postId = post.id;

    const ownerName =
      (post as any).owner?.name ||
      (post as any).author?.name ||
      "Unknown";

    const createdDate = post.created ?? post.published ?? "";
    const mediaUrl = (post as any).media?.url;

    card.innerHTML = `
      <a href="/post.html?id=${post.id}" class="post-link">
        <h2>${post.title}</h2>
        ${
          mediaUrl
            ? `<img src="${mediaUrl}" alt="${post.title}" class="post-image">`
            : ""
        }
        <p>${post.body}</p>
      </a>
      <small>By <strong>${ownerName}</strong></small><br>
      <small>${
        createdDate
          ? `Created: ${new Date(createdDate).toLocaleString()}`
          : ""
      }</small>
    `;

    // Delete and edit for owner
    if (currentUser && (post as any).owner?.id === currentUser.id) {
      const actions = document.createElement("div");
      actions.className = "post-actions";
      actions.innerHTML = `
        <button class="edit-btn" data-id="${post.id}"> Edit</button>
        <button class="delete-btn" data-id="${post.id}"> Delete</button>
      `;
      card.appendChild(actions);
    }

    container.appendChild(card);
  });
}

