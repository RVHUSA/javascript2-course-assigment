import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src", 
  build: {
    outDir: "../dist", 
    rollupOptions: {
      input: {
        feed: resolve(__dirname, "public/feed.html"),
        login: resolve(__dirname, "public/login.html"),
        register: resolve(__dirname, "public/register.html"),
        profile: resolve(__dirname, "public/profile.html"),
        myPosts: resolve(__dirname, "public/post.html"),
        edit: resolve(__dirname, "public/edit.html"), 
      },
    },
  },
});


