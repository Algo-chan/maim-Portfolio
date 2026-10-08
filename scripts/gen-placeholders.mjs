/**
 * Generates original abstract placeholder images for the featured work section.
 * Run: npm run placeholders
 *
 * [EDIT ME] Replace src/assets/projects/*.png with real screenshots of your
 * projects (any size), then rebuild. The build pipeline handles WebP/AVIF.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "assets",
  "projects",
);

const W = 1600;
const H = 1000;

const wrap = (defs, body) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${defs}</defs>
  ${body}
</svg>`;

const scenes = [
  {
    file: "fcn-care.png",
    svg: wrap(
      `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="#0d3b36"/>
         <stop offset="0.55" stop-color="#146156"/>
         <stop offset="1" stop-color="#2f9e7f"/>
       </linearGradient>
       <radialGradient id="glow" cx="0.75" cy="0.2" r="0.8">
         <stop offset="0" stop-color="#8ee8c6" stop-opacity="0.55"/>
         <stop offset="1" stop-color="#8ee8c6" stop-opacity="0"/>
       </radialGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <rect width="${W}" height="${H}" fill="url(#glow)"/>
       <g fill="#eafff6" opacity="0.92">
         <rect x="665" y="250" width="270" height="90" rx="24"/>
         <rect x="755" y="160" width="90" height="270" rx="24"/>
       </g>
       <g fill="none" stroke="#eafff6" stroke-opacity="0.22" stroke-width="2">
         <circle cx="300" cy="740" r="120"/>
         <circle cx="300" cy="740" r="180"/>
         <circle cx="1340" cy="300" r="150"/>
       </g>
       <g fill="#eafff6" fill-opacity="0.35">
         <circle cx="300" cy="740" r="14"/>
         <circle cx="1340" cy="300" r="14"/>
         <circle cx="1180" cy="820" r="9"/>
       </g>`,
    ),
  },
  {
    file: "local-connect.png",
    svg: wrap(
      `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="#181b52"/>
         <stop offset="0.5" stop-color="#3b3fa8"/>
         <stop offset="1" stop-color="#7f6cf0"/>
       </linearGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <g stroke="#dcd9ff" stroke-opacity="0.28" stroke-width="2">
         ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 200}" y1="0" x2="${i * 200}" y2="${H}"/>`).join("")}
         ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 200}" x2="${W}" y2="${i * 200}"/>`).join("")}
       </g>
       <g stroke="#fff" stroke-width="6" stroke-linecap="round">
         <line x1="480" y1="640" x2="800" y2="380"/>
         <line x1="800" y1="380" x2="1120" y2="620"/>
         <line x1="480" y1="640" x2="760" y2="820"/>
       </g>
       <g fill="#fff">
         <circle cx="480" cy="640" r="46"/>
         <circle cx="1120" cy="620" r="46"/>
         <circle cx="760" cy="820" r="34"/>
       </g>
       <g fill="#181b52">
         <circle cx="800" cy="380" r="58"/>
       </g>
       <circle cx="800" cy="380" r="58" fill="none" stroke="#fff" stroke-width="8"/>`,
    ),
  },
  {
    file: "gold-bot.png",
    svg: wrap(
      `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="#12110d"/>
         <stop offset="1" stop-color="#2a2519"/>
       </linearGradient>
       <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
         <stop offset="0" stop-color="#8f6a14"/>
         <stop offset="0.5" stop-color="#e8bf5c"/>
         <stop offset="1" stop-color="#c9973a"/>
       </linearGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <g stroke="#fff" stroke-opacity="0.07" stroke-width="2">
         ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${140 * i}" x2="${W}" y2="${140 * i}"/>`).join("")}
       </g>
       <polyline
         points="80,780 260,700 420,740 580,560 740,610 900,430 1060,470 1220,300 1400,340 1540,180"
         fill="none" stroke="url(#gold)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
       <g fill="#e8bf5c">
         <circle cx="580" cy="560" r="16"/>
         <circle cx="900" cy="430" r="16"/>
         <circle cx="1220" cy="300" r="16"/>
         <circle cx="1540" cy="180" r="22"/>
       </g>
       <g fill="#e8bf5c" fill-opacity="0.16">
         <rect x="80" y="820" width="1460" height="100" rx="16"/>
       </g>`,
    ),
  },
  {
    file: "mahad.png",
    svg: wrap(
      `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="#8a3f22"/>
         <stop offset="0.6" stop-color="#c96f3e"/>
         <stop offset="1" stop-color="#e8b06a"/>
       </linearGradient>`,
      `<rect width="${W}" height="${H}" fill="url(#bg)"/>
       <circle cx="1280" cy="250" r="140" fill="#ffe9c4" fill-opacity="0.85"/>
       <g fill="none" stroke="#fff5e3" stroke-opacity="0.75" stroke-width="26">
         <path d="M330 840 V560 a150 150 0 0 1 300 0 V840"/>
         <path d="M720 840 V560 a150 150 0 0 1 300 0 V840"/>
         <path d="M1110 840 V560 a150 150 0 0 1 300 0 V840"/>
       </g>
       <g fill="#fff5e3" fill-opacity="0.9">
         <rect x="60" y="874" width="1480" height="34" rx="17"/>
         <rect x="330" y="450" width="300" height="30" rx="15"/>
         <rect x="720" y="450" width="300" height="30" rx="15"/>
         <rect x="1110" y="450" width="300" height="30" rx="15"/>
       </g>`,
    ),
  },
];

await mkdir(OUT_DIR, { recursive: true });

for (const scene of scenes) {
  const target = path.join(OUT_DIR, scene.file);
  await sharp(Buffer.from(scene.svg)).png({ compressionLevel: 9 }).toFile(target);
  console.log(`✓ ${path.relative(process.cwd(), target)}`);
}

console.log("Done. Rebuild to regenerate optimized WebP/AVIF outputs.");
