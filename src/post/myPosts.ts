import { SOCIAL_URL, API_KEY } from "../api/config";
import type { Post, User } from "../types/post";
import { getToken, getUser } from "../utils/storage";

// --- FETCH MY POSTS ---
export async function fetchMyPosts(): Promise<Post[]> {
  const token = getToken();
  const user: User | null = getUser();

  if (!token || !user) {
    throw new Error("No auth token or user info found. Please log in.");
  }

  const response = await fetch(
    `${SOCIAL_URL}/profiles/${encodeURIComponent(user.name)}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch your posts:", response.status, response.statusText);
    throw new Error("Failed to fetch your posts. Please try again.");
  }

  const data = await response.json();
  return data.data ?? [];
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

  if (!response.ok) {
    const data = await response.json();
    console.error("Failed to delete post:", data);
    throw new Error(data.errors?.[0]?.message || "Failed to delete post.");
  }

  alert("Post deleted successfully!");
  await loadAndRenderMyPosts();
}

// --- CREATE NEW POST ---
export async function createPost(title: string, body: string, imageUrl?: string): Promise<Post> {
  const token = getToken();
  if (!token) throw new Error("No auth token found. Please log in.");

  const postData: any = { title, body };
  if (imageUrl) postData.media = { url: imageUrl, alt: title };

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
    console.error("Failed to create post:", data);
    throw new Error(data.errors?.[0]?.message || "Failed to create post. Please try again.");
  }

  return data.data ?? data;
}

// --- RENDER POSTS ---
export function renderPosts(posts: Post[], container: HTMLDivElement) {
  container.innerHTML = "";

  if (!posts.length) {
    container.innerHTML = "<p>No posts available.</p>";
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";

    const ownerName = post.owner?.name ?? "You";
    const createdDate = post.created ?? post.published ?? "";
    const mediaHTML = post.media?.url
      ? `<img src="${post.media.url}" alt="${post.media.alt ?? "Post image"}" class="post-image">`
      : "";

    card.innerHTML = `
    <a href="/post.html?id=${post.id}" class="post-link">
    <h2>${post.title}</h2>
    ${mediaHTML}
    </a>
    <p>${post.body}</p>
    <small>By ${ownerName}</small>
    <small>${createdDate ? `Created: ${new Date(createdDate).toLocaleString()}` : ""}</small>
    <div class="post-actions">
      <button class="edit-btn" data-id="${post.id}"> Edit</button>
      <button class="delete-btn" data-id="${post.id}"> Delete</button>
    </div>
  `;

    container.appendChild(card);
  });

  // Event Listeners for buttons
  const editButtons = container.querySelectorAll(".edit-btn");
  const deleteButtons = container.querySelectorAll(".delete-btn");

  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = (e.target as HTMLButtonElement).dataset.id;
      if (id) {
        window.location.href = `/edit.html?id=${id}`;
      }
    });
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = (e.target as HTMLButtonElement).dataset.id;
      if (id) {
        await deletePost(id);
      }
    });
  });
}

// --- LOAD & RENDER MY POSTS ---
export async function loadAndRenderMyPosts() {
  const feedContainer = document.getElementById("feedContainer") as HTMLDivElement | null;
  if (!feedContainer) return;

  try {
    const posts = await fetchMyPosts();
    renderPosts(posts, feedContainer);
  } catch (error) {
    console.error("Error fetching your posts:", error);
    feedContainer.innerHTML = `<p style="color:red">Could not load your posts. Please log in again.</p>`;
  }
}

// --- HANDLE FORM SUBMISSION ---
export function initPostForm() {
  const postForm = document.getElementById("postForm") as HTMLFormElement | null;
  const feedContainer = document.getElementById("feedContainer") as HTMLDivElement | null;
  const titleInput = document.getElementById("title") as HTMLInputElement | null;
  const bodyInput = document.getElementById("body") as HTMLTextAreaElement | null;
  const imageInput = document.getElementById("imageUrl") as HTMLInputElement | null;

  if (!postForm || !titleInput || !bodyInput || !feedContainer) return;

  postForm.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    const imageUrl = imageInput?.value.trim();

    if (!title || !body) {
      alert("Please fill in both the title and content before submitting.");
      return;
    }

    try {
      await createPost(title, body, imageUrl);
      await loadAndRenderMyPosts();
      postForm.reset();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadAndRenderMyPosts();
  initPostForm();
});
