import { SOCIAL_URL, API_KEY } from "../api/config";
import type { Post, User } from "../types/post";
import { getToken, getUser } from "../utils/storage";

/**
 * Fetches all posts from the API.
 * @async
 * @returns {Promise<Post[]>} A list of all posts from the API.
 * @throws {Error} Throws an error if no token is found or fetching fails.
 */
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

/**
 * Creates a new post on the API.
 * @async
 * @param {string} title - The title of the post.
 * @param {string} body - The content/body of the post.
 * @param {string} [imageUrl] - Optional image URL for the post.
 * @returns {Promise<Post>} The created post object.
 * @throws {Error} Throws an error if creation fails or token is missing.
 */
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

/**
 * Deletes a post by its ID.
 * @async
 * @param {string} postId - The ID of the post to delete.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the token is missing or deletion fails.
 */
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
      (post as any).owner?.name || (post as any).author?.name || "Unknown";

    const createdDate = post.created ?? post.published ?? "";
    const mediaUrl = (post as any).media?.url;

    // --- HTML for card ---
    card.innerHTML = `
      <div class="post-link">
        <h2>${post.title}</h2>
        ${
          mediaUrl
            ? `<img src="${mediaUrl}" alt="${post.title}" class="post-image">`
            : ""
        }
        <p>${post.body}</p>
      </div>
      <small>
        By <a href="/html/profile.html?name=${ownerName}" class="author-link">${ownerName}</a>
      </small><br>
      <small>
        ${
          createdDate
            ? `Created: ${new Date(createdDate).toLocaleString()}`
            : ""
        }
      </small>
    `;

    card.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.closest(".author-link")) return;
      window.location.href = `/html/post.html?id=${post.id}`;
    });

    if (currentUser && (post as any).owner?.id === currentUser.id) {
      const actions = document.createElement("div");
      actions.className = "post-actions";
      actions.innerHTML = `
        <button class="edit-btn" data-id="${post.id}">Edit</button>
        <button class="delete-btn" data-id="${post.id}">Delete</button>
      `;
      card.appendChild(actions);
    }

    container.appendChild(card);
  });
}