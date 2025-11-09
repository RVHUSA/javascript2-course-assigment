import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Lag dirname fra import.meta.url
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "src", 
  build: {
    outDir: "../dist", 
    rollupOptions: {
      input: {
        feed: resolve(__dirname, "src/html/feed.html"),
        login: resolve(__dirname, "src/html/login.html"),
        register: resolve(__dirname, "src/html/register.html"),
        edit: resolve(__dirname, "src/html/edit.html"),
        post: resolve(__dirname, "src/html/post.html"),
        profile: resolve(__dirname, "src/html/profile.html"),
      },
    },
  },
});
