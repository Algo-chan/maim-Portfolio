# Muhammad Abdulfgefar — Portfolio

Single-page developer portfolio: original code, original assets, honest content.
Structure and motion follow the layout of a minimal developer-portfolio pattern
(header → giant-type hero → about → featured work → CTA → footer) — nothing was
copied from any other site.

## Stack

- **Astro** (static pages + one on-demand API route) + **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **GSAP + ScrollTrigger** for load/scroll animation
- **Lenis** for smooth scrolling
- **Astro image optimization** — local PNGs ship as responsive WebP/AVIF
- **@astrojs/vercel** adapter + **Resend** + **Zod** for the contact endpoint
- All copy lives in typed data files under `src/data/` — no hard-coded copy in components

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static pages + serverless function in dist/
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
| `src/data/footer.ts`  | Footer email + social URLs and the live-clock time zone       |

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
- `RESEND_API_KEY` — Resend API key (server-only, never `PUBLIC_`)
- `CONTACT_TO_EMAIL` — inbox that receives contact-form messages
- `CONTACT_FROM_EMAIL` — optional verified Resend sender; falls back to the
  sandbox sender `onboarding@resend.dev` (which only delivers to your own
  Resend account address)

## Contact endpoint

`POST /api/contact` (`src/pages/api/contact.ts`, `prerender = false`) validates
the request with Zod (email format, message 10–2000 chars), ignores submissions
that fill the hidden honeypot, rate-limits to 3 requests per IP per 10 minutes,
and sends via Resend with the visitor's address as `Reply-To`. It returns
`{ ok: true }` or `{ ok: false, error }`, and no secrets ever reach the client.

## Motion notes

- Load sequence: header fade → masked per-letter name reveal → rule sweep →
  tagline/status → tech-strip stagger.
- Scroll: word-by-word About reveal, per-row project stagger, drifting ghost
  "Featured Work" heading, masked CTA line reveal.
- Footer: a **curtain reveal** — the page lifts off a fixed footer with a light
  parallax on the footer content, then the message flow (email → textarea →
  send) animates open. Every duration/ease lives in the shared `MOTION` config
  in `src/lib/motion.ts`.
- Footer portrait: a **flashlight reveal** — a grayscale photo with a soft,
  cursor-tracked colour spotlight (touch devices get a self-drifting path).
  Tune it in `MOTION.footer.spotlight`: `radiusFactor` (spot size as a fraction
  of the photo's width), the `#000 55% → transparent 100%` stops in
  `Footer.astro`'s `<style>` (softness), and `driftDuration` (seconds per loop).
  Layered on top is a subtle **3D depth tilt** (desktop only) — the photo leans
  toward the cursor with a moving sheen and a shadow that shifts opposite. Tune
  it in `MOTION.footer.tilt`: `maxAngle` (degrees), `maxScale`, `lift`
  (translateZ, px), `sheenOpacity`, `shadowShift`, `shadowY`, and the
  `moveDuration`/`returnDuration` (+ eases). Both effects share one pointer
  tracker on `.photo-hit`, so the spotlight stays accurate as the photo tilts.

- Desktop hover on a project row shows a preview image trailing the cursor.
- Everything respects `prefers-reduced-motion`. When motion is reduced, or the
  footer is taller than the viewport, the footer falls back to a plain static
  footer — and content stays visible if JavaScript fails to load.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **Add New Project** → import the repo. Astro is auto-detected and
   the included `@astrojs/vercel` adapter deploys the static pages plus the
   `/api/contact` function — no framework overrides needed.
3. Set `SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (and optionally
   `PUBLIC_GA_ID`, `CONTACT_FROM_EMAIL`) under **Settings → Environment
   Variables**, then deploy.
4. Verify a sender domain in Resend before using `CONTACT_FROM_EMAIL`; until
   then the sandbox sender only delivers to your own account address.
