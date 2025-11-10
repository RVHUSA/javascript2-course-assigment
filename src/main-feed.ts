import { fetchAllPosts, renderPosts, createPost, deletePost } from "./api/feed";
import { getToken } from "./utils/storage";
import { SOCIAL_URL, API_KEY } from "./api/config";

// --- CHECK TOKEN ---
const token = getToken();
if (!token) {
  console.warn("No token found. Redirecting to login...");
  window.location.href = "/html/login.html"; 
}

// --- ELEMENT REFERENCES ---
const feedContainer = document.getElementById("feedContainer") as HTMLDivElement | null;
const postForm = document.getElementById("postForm") as HTMLFormElement | null;
const titleInput = document.getElementById("title") as HTMLInputElement | null;
const bodyInput = document.getElementById("body") as HTMLTextAreaElement | null;
const imageInput = document.getElementById("imageUrl") as HTMLInputElement | null;

// --- SEARCH ELEMENTS ---
const searchInput = document.getElementById("postSearch") as HTMLInputElement | null;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement | null;

// --- LOAD AND RENDER FEED ---
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
      alert("Failed to create post. Try again.");
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
      window.location.href = `/html/edit.html?id=${id}`;
    }

    if (target.classList.contains("delete-btn")) {
      const confirmDelete = confirm("Are you sure you want to delete this post?");
      if (!confirmDelete) return;

      try {
        await deletePost(id);
        const card = target.closest(".post-card");
        if (card) card.remove();
      } catch (err) {
        console.error(err);
        alert("Failed to delete post. Try again.");
      }
    }
  });
}

// --- SEARCH POSTS ---
if (searchInput && searchBtn && feedContainer) {
  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    try {
      const res = await fetch(`${SOCIAL_URL}/posts/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!res.ok) throw new Error("Failed to search posts");

      const data = await res.json();
      const posts = data.data ?? [];

      feedContainer.innerHTML = "";

      if (posts.length === 0) {
        feedContainer.innerHTML = "<p>No posts found.</p>";
        return;
      }

      // Render posts
      renderPosts(posts, feedContainer);

    } catch (err) {
      console.error(err);
      feedContainer.innerHTML = "<p style='color:red'>Search failed. Try again.</p>";
    }
  });
}

// --- INITIAL LOAD ---
document.addEventListener("DOMContentLoaded", loadAndRenderFeed);
