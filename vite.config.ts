import { defineConfig } from "vite";

export default defineConfig({
  root: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "public/index.html",
        feed: "public/feed.html",
        login: "public/login.html",
        register: "public/register.html",
        profile: "public/profile.html",
        post: "public/post.html",
        edit: "public/edit.html",
        myPosts: "public/myPosts.html"
      }
    }
  }
});
