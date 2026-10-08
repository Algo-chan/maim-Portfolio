# Muhammad Abdulfgefar — Portfolio

Single-page developer portfolio: original code, original assets, honest content.
Structure and motion follow the layout of a minimal developer-portfolio pattern
(header → giant-type hero → about → featured work → CTA → footer) — nothing was
copied from any other site.

## Stack

- **Astro** (static output) + **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **GSAP + ScrollTrigger** for load/scroll animation
- **Lenis** for smooth scrolling
- **Astro image optimization** — local PNGs ship as responsive WebP/AVIF
- All copy lives in typed data files under `src/data/` — no hard-coded copy in components

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the production build
npm run check      # astro check (types + lint diagnostics)
npm run placeholders  # regenerate the placeholder project images
```

## Editing your content

| File                  | What it controls                                              |
| --------------------- | ------------------------------------------------------------- |
| `src/data/site.ts`    | Name, location, tagline, email, social links, availability    |
| `src/data/skills.ts`  | The 5 tech-strip items (label + icon key)                     |
| `src/data/about.ts`   | About headline, paragraphs, and the "Now" sidebar             |
| `src/data/projects.ts`| Featured work: names, descriptions, tags, links, images       |
| `src/data/cta.ts`     | Call-to-action headline and body copy                         |

Anything marked `[EDIT ME]` (on the page or in a data file) is a placeholder
waiting for your real data — including project links, stacks, and the tech strip
list. There are deliberately **no** invented years of experience, employers, or
metrics anywhere in this project.

## Replacing the placeholder images

The four project images in `src/assets/projects/` are generated abstract
graphics (`npm run placeholders`). Drop in real screenshots with the **same file
names** (or update the imports at the top of `src/data/projects.ts`), keep them
roughly 16:10, and rebuild — Astro handles responsive WebP/AVIF automatically.

## Environment variables

Copy `.env.example` to `.env`:

- `SITE_URL` — canonical URL of the deployed site (used for canonical/OG tags)
- `PUBLIC_GA_ID` — optional Google Analytics 4 ID; analytics stay off if empty

## Motion notes

- Load sequence: header fade → masked per-letter name reveal → rule sweep →
  tagline/status → tech-strip stagger.
- Scroll: word-by-word About reveal, per-row project stagger, drifting ghost
  "Featured Work" heading, masked CTA line reveal.
- Desktop hover on a project row shows a preview image trailing the cursor.
- Everything respects `prefers-reduced-motion`, and content stays visible if
  JavaScript fails to load.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **Add New Project** → import the repo. Astro is auto-detected —
   no framework overrides needed.
3. Set `SITE_URL` (and optionally `PUBLIC_GA_ID`) under
   **Settings → Environment Variables**, then deploy.
