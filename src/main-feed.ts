import { fetchAllPosts, renderPosts, createPost } from "./api/feed";
import { getToken } from "./utils/storage";

// --- CHECK TOKEN ---
const token = getToken();
if (!token) {
  console.warn("No token found. Redirecting to login...");
  window.location.href = "./login.html"; 
}

// --- DOM ELEMENTS ---
const feedContainer = document.getElementById("feedContainer") as HTMLDivElement | null;
const postForm = document.getElementById("postForm") as HTMLFormElement | null;
const titleInput = document.getElementById("title") as HTMLInputElement | null;
const bodyInput = document.getElementById("body") as HTMLTextAreaElement | null;

// --- LOAD FEED ---
document.addEventListener("DOMContentLoaded", async () => {
  if (!feedContainer) {
    console.error("Could not find #feedContainer in the DOM.");
    return;
  }

  try {
    const posts = await fetchAllPosts();
    renderPosts(posts, feedContainer);
  } catch (error) {
    console.error("Error while fetching posts:", error);
    feedContainer.innerHTML = `<p style="color:red">Failed to load posts. Please log in again.</p>`;
  }
});

// --- CREATE NEW POST ---
if (postForm && titleInput && bodyInput && feedContainer) {
  postForm.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title || !body) {
      alert("Please fill in both the title and content before submitting.");
      return;
    }

    try {
      await createPost(title, body);
      console.log("Post created successfully!");

      const posts = await fetchAllPosts();
      renderPosts(posts, feedContainer);

      postForm.reset();
    } catch (error) {
      console.error("Error creating post:", error);
      const formError = document.createElement("p");
      formError.style.color = "red";
      formError.textContent =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while creating the post.";
      postForm.appendChild(formError);
    }
  });
} else {
  console.warn("Missing one or more DOM elements for post creation.");
}
