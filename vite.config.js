import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Rutas relativas: funciona en GitHub Pages tanto en subruta
  // (usuario.github.io/messox-web/) como en dominio propio (messox.com).
  base: "./",
  plugins: [tailwindcss()],
});
