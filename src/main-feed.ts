import { fetchAllPosts, renderPosts, createPost, deletePost } from "./api/feed";
import { getToken } from "./utils/storage";

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

// Event delegation for edit/delete
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

document.addEventListener("DOMContentLoaded", loadAndRenderFeed);
