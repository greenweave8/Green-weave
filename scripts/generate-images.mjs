import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "images", "products");
mkdirSync(outDir, { recursive: true });

const garments = {
  tee: 'M175 225 L185 155 Q188 140 203 143 L255 180 Q280 192 300 192 Q320 192 345 180 L397 143 Q412 140 415 155 L425 225 L390 262 L364 242 L366 500 L234 500 L236 242 L210 262 Z',
  hoodie: 'M170 250 L178 168 Q180 148 200 150 L258 196 Q282 205 300 205 Q318 205 342 196 L400 150 Q420 148 422 168 L430 250 L400 282 L372 264 L374 500 L226 500 L228 264 L200 282 Z M210 350 Q222 380 250 388 Q278 382 300 388 Q322 382 350 388 Q378 380 390 350 Q400 410 400 450 L200 450 Q200 410 210 350 Z',
  shirt: 'M172 240 L182 170 Q186 152 204 156 L252 190 L282 212 Q286 214 290 212 L322 182 L396 156 Q414 152 418 170 L428 240 L394 272 L368 252 L368 500 L232 500 L232 252 L206 272 Z',
  leggings: 'M180 210 L220 215 L240 500 L210 505 L200 330 L180 500 L152 500 Z M420 210 L380 215 L360 500 L390 505 L400 330 L420 500 L448 500 Z M300 180 Q258 185 252 224 L252 320 L348 320 L348 224 Q342 185 300 180 Z',
  tote: 'M220 240 L230 160 Q232 148 245 148 L355 148 Q368 148 370 160 L380 240 L378 520 L222 520 Z M268 148 Q268 118 300 118 Q332 118 332 148',
  blazer: 'M168 238 L176 168 Q179 150 196 154 L234 200 L280 226 L280 500 L234 500 L234 320 L196 300 L178 372 Q176 390 170 392 Z M432 238 L424 168 Q421 150 404 154 L366 200 L320 226 L320 500 L366 500 L366 320 L404 300 L422 372 Q424 390 430 392 Z',
  chinos: 'M178 215 L242 220 L252 500 L216 500 L206 330 L180 370 Q177 380 174 378 Z M422 215 L358 220 L348 500 L384 500 L394 330 L420 370 Q423 380 426 378 Z M300 180 Q250 185 244 240 L244 330 L356 330 L356 240 Q350 185 300 180 Z',
  tank: 'M190 230 L196 160 L258 175 L300 200 Q342 175 L404 160 L410 230 L382 260 L356 520 L244 520 L218 260 Z',
  runtee: 'M176 228 L182 158 Q185 142 200 145 L252 178 L300 190 L348 178 L400 145 Q415 142 418 158 L424 228 L392 262 L368 244 L370 500 L230 500 L232 244 L208 262 Z',
  jeans: 'M176 212 L236 218 L248 500 L212 500 L202 326 L180 366 Q178 378 174 376 Z M424 212 L364 218 L352 500 L388 500 L398 326 L420 366 Q422 378 426 376 Z M260 218 Q262 300 300 300 Q338 300 340 218',
  beanie: 'M192 230 L206 150 Q210 132 232 138 L300 152 L368 138 Q390 132 394 150 L408 230 Q386 254 300 256 Q214 254 192 230 Z M206 198 Q222 220 300 222 Q378 220 394 198 L396 240 Q360 272 300 272 Q240 272 204 240 Z',
  polo: 'M172 232 L180 162 Q182 148 198 150 L300 168 L402 150 Q418 148 420 162 L428 232 L394 266 L370 248 L370 500 L230 500 L230 248 L206 266 Z',
};

const specs = [
  { slug: "tee-mist", g: "tee", bg: ["#e9f5fb", "#ffffff"], garment: "#0e2333", accent: "#7fb8d8", label: "Classic Tee" },
  { slug: "hoodie-seafoam", g: "hoodie", bg: ["#dff4e7", "#f4fbf7"], garment: "#2c6e58", accent: "#2c6e58", label: "Sweatshirt" },
  { slug: "shirt-mist", g: "shirt", bg: ["#cfe7f5", "#eef7fc"], garment: "#3a5a72", accent: "#3a5a72", label: "Linen Shirt" },
  { slug: "leggings-forest", g: "leggings", bg: ["#dff4e7", "#ffffff"], garment: "#0e5a3b", accent: "#0e5a3b", label: "Leggings" },
  { slug: "tote-seafoam", g: "tote", bg: ["#f0faf4", "#e2f5e9"], garment: "#2c6e58", accent: "#0e8a5b", label: "Tote" },
  { slug: "blazer-mist", g: "blazer", bg: ["#e9f5fb", "#fbfdfe"], garment: "#37566d", accent: "#37566d", label: "Blazer" },
  { slug: "chinos-forest", g: "chinos", bg: ["#eef8f2", "#ffffff"], garment: "#4a6e5a", accent: "#4a6e5a", label: "Chinos" },
  { slug: "tank-seafoam", g: "tank", bg: ["#dff4e7", "#f6fcf8"], garment: "#7fb8d8", accent: "#0e8a5b", label: "Tank Top" },
  { slug: "runtee-mist", g: "runtee", bg: ["#e4f2fb", "#fbfdff"], garment: "#0e2333", accent: "#f2746d", label: "Running Tee" },
  { slug: "jeans-seafoam", g: "jeans", bg: ["#e7f6f0", "#ffffff"], garment: "#3d6b8a", accent: "#3d6b8a", label: "Boyfriend Jeans" },
  { slug: "beanie-forest", g: "beanie", bg: ["#eef7f1", "#fbfefc"], garment: "#0e5a3b", accent: "#0e5a3b", label: "Beanie" },
  { slug: "polo-mist", g: "polo", bg: ["#e9f5fb", "#fbfdff"], garment: "#255b86", accent: "#255b86", label: "Merino Polo" },
];

function svg({ bg, garment, accent, label, g }) {
  const body = garments[g];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bg[0]}"/>
      <stop offset="1" stop-color="${bg[1]}"/>
    </linearGradient>
    <radialGradient id="shine" cx="0.5" cy="0.3" r="0.75">
      <stop offset="0" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="0.55" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="600" height="700" fill="url(#bg)"/>
  <text x="40" y="52" font-family="Georgia, serif" font-size="22" letter-spacing="3" fill="${garment}">greenweave</text>
  <ellipse cx="300" cy="560" rx="150" ry="18" fill="rgba(18,60,80,0.12)"/>
  <g transform="translate(86,60)">
    <path d="${body}" fill="${garment}"/>
    <path d="${body}" fill="url(#shine)"/>
    <ellipse cx="395" cy="92" rx="54" ry="24" fill="${accent}" transform="rotate(-12 395 92)"/>
  </g>
  <rect x="120" y="612" width="360" height="2" fill="${garment}" opacity="0.25"/>
  <text x="300" y="650" text-anchor="middle" font-family="system-ui, sans-serif" font-size="26" font-weight="600" fill="${garment}" letter-spacing="2">${label}</text>
</svg>`;
}

for (const spec of specs) {
  writeFileSync(join(outDir, `${spec.slug}.svg`), svg(spec));
  console.log("wrote", spec.slug);
}