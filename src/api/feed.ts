import { SOCIAL_URL, API_KEY } from "./config";
import type { Post } from "../types/post";
import { getToken } from "../utils/storage";

// --- FETCH ALL POSTS ---
export async function fetchAllPosts(): Promise<Post[]> {
  const token = getToken();
  if (!token) throw new Error("No auth token found. Please log in.");

  const response = await fetch(`${SOCIAL_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch posts:", response.status, response.statusText);
    throw new Error("Failed to fetch posts. Please try again.");
  }

  const data = await response.json();
  
  return data.data ?? [];
}

// --- CREATE NEW POST ---
export async function createPost(title: string, body: string): Promise<Post> {
  const token = getToken();
  if (!token) throw new Error("No auth token found. Please log in.");

  const response = await fetch(`${SOCIAL_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify({ title, body }),
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

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <small>By ${post.owner?.name ?? "Unknown"}</small>
    `;
    container.appendChild(card);
  });
}
