import { SOCIAL_URL, API_KEY } from "../api/config";
import { getToken } from "../utils/storage";
import type { Post } from "../types/post";

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();

  if (!token) {
    alert("You must be logged in to edit a post.");
    window.location.href = "/account/login.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    alert("No post ID provided.");
    window.location.href = "/myPosts.html";
    return;
  }

  const titleInput = document.querySelector<HTMLInputElement>("#title");
  const bodyInput = document.querySelector<HTMLTextAreaElement>("#body");
  const imageInput = document.querySelector<HTMLInputElement>("#image");
  const form = document.querySelector<HTMLFormElement>("#editForm");
  const cancelBtn = document.querySelector<HTMLButtonElement>("#cancelBtn");

  if (!titleInput || !bodyInput || !imageInput || !form || !cancelBtn) {
    console.error(" Missing form elements in edit.html");
    return;
  }

  // Fetch the existing post
  try {
    const response = await fetch(`${SOCIAL_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    console.log("Fetching post:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to load post:", errorData);
      alert(`Could not load post (status ${response.status}).`);
      return;
    }

    const data = await response.json();
    const post: Post = data.data ?? data;

    console.log("Loaded post data:", post);

    // Fill in form fields 
    titleInput.value = post.title ?? "";
    bodyInput.value = post.body ?? "";
    imageInput.value = post.media?.url ?? "";

  } catch (error) {
    console.error("Error fetching post:", error);
    alert("Could not load post details.");
    return;
  }

  // Handle form submission (update post)
  form.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const updatedPost = {
      title: titleInput.value.trim(),
      body: bodyInput.value.trim(),
      media: imageInput.value.trim()
        ? { url: imageInput.value.trim(), alt: titleInput.value.trim() }
        : undefined,
    };

    console.log("Updating post:", updatedPost);

    try {
      const response = await fetch(`${SOCIAL_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update post:", errorData);
        throw new Error(errorData.errors?.[0]?.message || "Update failed");
      }

      alert("Post updated successfully!");
      window.location.href = "/feed.html";
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Could not update post. Please try again.");
    }
  });

  cancelBtn.addEventListener("click", () => {
    window.location.href = "/feed.html";
  });
});
