import { SOCIAL_URL, API_KEY } from "../api/config";
import { getToken } from "../utils/storage";
import type { Post } from "../types/post";

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  const postContainer = document.getElementById("postContainer")!;
  const postActions = document.getElementById("postActions")!;
  const editBtn = document.getElementById("editBtn") as HTMLButtonElement;
  const deleteBtn = document.getElementById("deleteBtn") as HTMLButtonElement;

  if (!postId) {
    postContainer.textContent = "No post ID provided.";
    return;
  }

  try {
    const response = await fetch(`${SOCIAL_URL}/posts/${postId}`, {
      headers: {
        "X-Noroff-API-Key": API_KEY,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) throw new Error("Failed to load post.");
    const data = await response.json();
    const post: Post = data.data ?? data;

    // --- SHOW POST ---
    const mediaHTML = post.media?.[0]?.url
      ? `<img src="${post.media[0].url}" alt="${post.media[0].alt ?? post.title}">`
      : "";

    postContainer.innerHTML = `
      <article class="post">
        <h2>${post.title}</h2>
        ${mediaHTML}
        <p>${post.body}</p>
      </article>
    `;

    // --- SHOW BUTTONS IF USER IS LOGGED IN ---
    if (token) {
      postActions.classList.remove("hidden");

      editBtn.addEventListener("click", () => {
        window.location.href = `/edit.html?id=${postId}`;
      });

      deleteBtn.addEventListener("click", async () => {
        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
          const delResponse = await fetch(`${SOCIAL_URL}/posts/${postId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": API_KEY,
            },
          });

          if (!delResponse.ok) throw new Error("Failed to delete post.");

          alert("Post deleted successfully.");
          window.location.href = "/feed.html";
        } catch (error) {
          console.error("Error deleting post:", error);
          alert("Could not delete post. Try again.");
        }
      });
    }
  } catch (error) {
    console.error("Error loading post:", error);
    postContainer.textContent = "Could not load post details.";
  }
});
