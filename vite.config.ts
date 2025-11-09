import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",       
  build: {
    outDir: "../dist", 
    rollupOptions: {
      input: {
        login: resolve(__dirname, "src/html/login.html"),
        register: resolve(__dirname, "src/html/register.html"),
        feed: resolve(__dirname, "src/html/feed.html"),
        profile: resolve(__dirname, "src/html/profile.html"),
        post: resolve(__dirname, "src/html/post.html"),
        myPosts: resolve(__dirname, "src/html/myPosts.html"),
        edit: resolve(__dirname, "src/html/edit.html"),
      },
    },
  },
});
