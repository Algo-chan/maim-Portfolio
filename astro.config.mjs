// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

export default defineConfig({
  site: env.SITE_URL || undefined,
  vite: {
    plugins: [tailwindcss()],
  },
});
