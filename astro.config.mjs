// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

// Normalize SITE_URL so a bare domain ("example.com") or a stray trailing
// slash can never crash the build. Malformed values are ignored instead of
// failing the deployment (Astro throws "[config] site: Invalid url" otherwise).
function resolveSite(raw) {
  const value = (raw ?? "").trim();
  if (!value) return undefined;
  const candidates = /^https?:\/\//i.test(value) ? [value] : [`https://${value}`, value];
  for (const candidate of candidates) {
    try {
      return new URL(candidate).origin;
    } catch {
      // try the next candidate
    }
  }
  return undefined;
}

export default defineConfig({
  site: resolveSite(env.SITE_URL),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
