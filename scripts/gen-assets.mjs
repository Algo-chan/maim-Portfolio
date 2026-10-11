/**
 * Generate static brand & social assets:
 *   - public/og.png              (Open Graph / social card, 1200x630)
 *   - public/favicon.ico         (32x32 fallback)
 *   - public/apple-touch-icon.png (180x180)
 *   - public/icon-192.png / public/icon-512.png (PWA icons)
 *
 * Run:   npm run assets
 * Sharp (librsvg) rasterizes the SVGs below. Text falls back to the nearest
 * available geometric sans on your system (Century Gothic / Arial) if the
 * "Futura Now Headline" webfont is not installed locally.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
mkdirSync(publicDir, { recursive: true });

/* ------------------------------------------------------------------ */
/* Theme tokens — keep in sync with the site's colors                   */
/* ------------------------------------------------------------------ */
const THEME = {
  bg: "#fbfaf6", // page base (white, warm)
  ink: "#16150f", // brand near-black
  gold: "#bd8f2c", // brand accent
  gray: "#5a5a5d", // subtitle
  muted: "#9f9f9f", // bottom line
  cardBg: "#1c1c1c", // favicon tile
  accent: "#990900", // monogram accent
};

const FONT_STACK = `"Futura Now Headline","Century Gothic","PingFang SC","Hiragino Sans GB",Arial,sans-serif`;

/* ------------------------------------------------------------------ */
/* Favicon tile (shared by every rasterized favicon size)               */
/* ------------------------------------------------------------------ */
function faviconSvg({ size }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="15" fill="${THEME.cardBg}"/>
  <path d="M20 45 V19 M44 45 V19" fill="none" stroke="#ffffff" stroke-width="7.2"
        stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20 19 L32 38 L44 19" fill="none" stroke="${THEME.accent}" stroke-width="7.2"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

async function renderPng(svg, outPath) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
  console.log("  wrote", outPath, `(${(readFileSync(outPath).length / 1024).toFixed(1)} KB)`);
}

async function renderPngBuffer(svg) {
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

/* Standard ICO container wrapping a 32x32 PNG payload. */
function toIco(pngBuffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // count: 1 image
  const entry = Buffer.alloc(16);
  entry[0] = 32; // width
  entry[1] = 32; // height
  entry[2] = 0; // palette
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuffer.length, 8); // bytes in resource
  entry.writeUInt32LE(22, 12); // offset (6 header + 16 entry)
  return Buffer.concat([header, entry, pngBuffer]);
}

/* ------------------------------------------------------------------ */
/* Open Graph image                                                     */
/* ------------------------------------------------------------------ */
function ogSvg({ hasPhoto }) {
  const photoHref = hasPhoto
    ? `href="data:image/jpeg;base64,${readFileSync(
        path.join(root, "src", "assets", "profile.jpg")
      ).toString("base64")}"`
    : "";

  const photoBlock = hasPhoto
    ? `<image ${photoHref} width="370" height="370" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>`
    : `<circle cx="928" cy="315" r="185" fill="#eae6da" clip-path="url(#photoClip)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.55" stop-color="${THEME.bg}"/>
      <stop offset="1" stop-color="#f0eddf"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.74" cy="0.5" r="0.52">
      <stop offset="0" stop-color="${THEME.gold}" stop-opacity="0.16"/>
      <stop offset="0.7" stop-color="${THEME.gold}" stop-opacity="0.035"/>
      <stop offset="1" stop-color="${THEME.gold}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2.5" cy="2.5" r="1.15" fill="${THEME.ink}" opacity="0.055"/>
    </pattern>
    <clipPath id="photoClip">
      <circle cx="928" cy="315" r="185"/>
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- Big name -->
  <text x="88" y="292" font-family='${FONT_STACK}' font-size="150" font-weight="700" letter-spacing="2"
        fill="${THEME.ink}">MUHAMMAD</text>

  <!-- Subtitle -->
  <text x="92" y="368" font-family='${FONT_STACK}' font-size="43" font-weight="400"
        fill="${THEME.gray}">Full Stack Developer · Founder of FCN</text>

  <!-- Bottom line (60px safe-area bottom edge at 570) -->
  <text x="92" y="548" font-family='${FONT_STACK}' font-size="29" font-weight="400"
        fill="${THEME.muted}">Dire Dawa, Ethiopia · [EDIT ME: domain]</text>

  <!-- Profile photo, circular, anchored right within the safe area -->
  <g>
    ${photoBlock}
    <circle cx="928" cy="315" r="185" fill="none" stroke="${THEME.gold}" stroke-width="7"/>
    <circle cx="928" cy="315" r="200" fill="none" stroke="${THEME.ink}" stroke-opacity="0.14" stroke-width="1.5"/>
  </g>
</svg>`;
}

/* ------------------------------------------------------------------ */
/* Build everything                                                     */
/* ------------------------------------------------------------------ */
async function main() {
  console.log("Generating social preview + favicon assets…");

  const hasPhoto = (() => {
    try {
      readFileSync(path.join(root, "src", "assets", "profile.jpg"));
      return true;
    } catch {
      return false;
    }
  })();
  console.log(
    hasPhoto
      ? "  profile photo: src/assets/profile.jpg found"
      : "  profile photo: src/assets/profile.jpg NOT found — using a placeholder circle. Drop the image there and re-run `npm run assets`."
  );

  console.log("→ public/og.png");
  await sharp(Buffer.from(ogSvg({ hasPhoto })))
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "og.png"));
  const ogSize = readFileSync(path.join(publicDir, "og.png")).length / 1024;
  console.log(`    wrote public/og.png (${ogSize.toFixed(1)} KB)`);
  if (ogSize > 300) {
    console.warn("    ⚠ og.png is over 300 KB — consider lowering the dot density or photo size.");
  }

  console.log("→ favicon sizes");
  await Promise.all([
    renderPng(faviconSvg({ size: 180 }), path.join(publicDir, "apple-touch-icon.png")),
    renderPng(faviconSvg({ size: 192 }), path.join(publicDir, "icon-192.png")),
    renderPng(faviconSvg({ size: 512 }), path.join(publicDir, "icon-512.png")),
  ]);

  // 32x32 PNG wrapped in a real .ico container
  const faviconPng = await renderPngBuffer(faviconSvg({ size: 32 }));
  writeFileSync(path.join(publicDir, "favicon.ico"), toIco(faviconPng));
  console.log(`  wrote public/favicon.ico (${(faviconPng.length / 1024).toFixed(1)} KB)`);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});