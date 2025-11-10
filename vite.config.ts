import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src", 
  build: {
    outDir: "../dist", 
    rollupOptions: {
      input: {
        feed: resolve(__dirname, "src/html/feed.html"),
        login: resolve(__dirname, "src/html/login.html"),
        register: resolve(__dirname, "src/html/register.html"),
        profile: resolve(__dirname, "src/html/profile.html"),
        myPosts: resolve(__dirname, "src/html/post.html"),
        edit: resolve(__dirname, "src/html/edit.html"), 
      },
    },
  },
});


