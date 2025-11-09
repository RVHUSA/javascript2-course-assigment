import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "index.html",
        login: "src/html/login.html",
        register: "src/html/register.html",
        post: "src/html/post.html",
        edit: "src/html/edit.html",
      },
    },
  },
});
