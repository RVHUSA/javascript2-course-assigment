import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        feed: resolve(__dirname, "src/html/feed.html"),
        login: resolve(__dirname, "src/html/login.html"),
        register: resolve(__dirname, "src/html/register.html"),
        profile: resolve(__dirname, "src/html/profile.html"),
        singlePost: resolve(__dirname, "src/html/post.html"),
        edit: resolve(__dirname, "src/html/edit.html"),
      },
    },
  },
  plugins: [
    {
      name: "copy-feed-to-index",
      closeBundle() {
                copyFileSync("dist/html/feed.html", "dist/index.html");
      },
    },
  ],
});
