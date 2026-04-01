import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * En desarrollo: "/" (URLs absolutas desde la raíz del dev server).
 * En build: "./" (rutas relativas) → funciona en `vite preview`, GitHub Pages
 * (https://usuario.github.io/repo/) y no hace falta configurar el nombre del repo.
 */
export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "./",
  plugins: [react()],
}));
