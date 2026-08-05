// One-off asset pipeline for bramleylodge.ie — NOT needed to serve the site.
// Usage: node tools/build-images.mjs
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = path.join(ROOT, 'july-photos');
const OUT = path.join(ROOT, 'assets', 'img');
const BRAND = path.join(ROOT, 'assets', 'img', 'brand');

// slug -> { file, hero?: bool }  (hero also gets a 2000w derivative)
const PHOTOS = {
  // interiors
  'orangery-room':        { file: 'DSC09388.jpg', hero: true },
  'orangery-room-tall':   { file: 'DSC09389.jpg' },
  'set-table-tall':       { file: 'DSC09450.jpg' },
  'set-table-dishes':     { file: 'DSC09452.jpg' },
  'evening-table-spread': { file: 'DSC09464.jpg' },
  'evening-table':        { file: 'DSC09465.jpg', hero: true },
  'orangery-mural':       { file: 'DSC09508.jpg' },
  // bar & spirits
  'bar-menu-marble':      { file: 'DSC09394.jpg' },
  'bar-two-pints':        { file: 'DSC09400.jpg' },
  'bar-glassware':        { file: 'DSC09413.jpg' },
  'bar-spirit-shelves':   { file: 'DSC09425.jpg' },
  // cocktails
  'mojito-closeup':       { file: 'DSC09476.jpg' },
  'mojito-on-bar':        { file: 'DSC09484.jpg' },
  'spritz-at-tap':        { file: 'DSC09487.jpg' },
  'cocktail-trio':        { file: 'DSC09494.jpg' },
  'martini-spritz':       { file: 'DSC09499.jpg' },
  'pornstar-martini':     { file: 'DSC09501.jpg' },
  // coffee & bakery
  'cake-counter':         { file: 'DSC09405.jpg' },
  'barista-chalkboards':  { file: 'DSC09407.jpg' },
  'coffee-machine':       { file: 'DSC09411.jpg' },
  'steaming-milk':        { file: 'DSC09503.jpg' },
  'cappuccino-counter':   { file: 'DSC09504.jpg' },
  // food
  'curry-bowl-topdown':   { file: 'DSC09429.jpg' },
  'curry-skewer-bowl':    { file: 'DSC09448.jpg' },
  'king-prawns':          { file: 'DSC09434.jpg' },
  'king-prawns-plated':   { file: 'DSC09457.jpg' },
  'poke-salad':           { file: 'DSC09438.jpg' },
  'poke-bowl':            { file: 'DSC09443.jpg' },
  'chicken-skewer-salad': { file: 'DSC09467.jpg' },
  'ravioli':              { file: 'DSC09475.jpg' },
  // dessert
  'dessert-cake-tall':    { file: 'DSC09514.jpg' },
  'dessert-cake':         { file: 'DSC09521.jpg' },
  // aerials
  'aerial-terrace':       { file: 'DJI_20260722151308_0005_D.jpg' },
  'aerial-carpark':       { file: 'DJI_20260722151457_0008_D.jpg' },
  'aerial-estuary':       { file: 'DJI_20260722151549_0009_D.jpg', hero: true },
};

const WIDTHS = [480, 800, 1200, 1600];
const FORMATS = [
  ['avif', { quality: 60, effort: 4 }],
  ['webp', { quality: 72 }],
  ['jpg',  { quality: 72, mozjpeg: true, progressive: true }],
];

const manifest = {};

async function photos() {
  await mkdir(OUT, { recursive: true });
  const jobs = [];
  for (const [slug, cfg] of Object.entries(PHOTOS)) {
    const src = path.join(SRC, cfg.file);
    const meta = await sharp(src).metadata();
    let widths = WIDTHS.filter((w) => w <= meta.width);
    if (widths.at(-1) !== meta.width && meta.width < 1600) widths.push(meta.width);
    if (cfg.hero && meta.width >= 2000) widths.push(2000);
    manifest[slug] = { src: cfg.file, width: meta.width, height: meta.height, widths };
    for (const w of widths) {
      for (const [ext, opts] of FORMATS) {
        jobs.push(async () => {
          const s = sharp(src).rotate().resize({ width: w });
          if (ext === 'avif') s.avif(opts);
          if (ext === 'webp') s.webp(opts);
          if (ext === 'jpg') s.jpeg(opts);
          await s.toFile(path.join(OUT, `${slug}-${w}.${ext}`));
        });
      }
    }
  }
  // small concurrency pool
  let i = 0;
  async function worker() { while (i < jobs.length) await jobs[i++](); }
  await Promise.all(Array.from({ length: 6 }, worker));
  await writeFile(path.join(ROOT, 'tools', 'image-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`photos: ${jobs.length} derivatives written`);
}

// Recolour every non-green (charcoal) pixel of the logo to cream, keeping alpha.
async function creamVariant(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const CREAM = [246, 242, 233]; // #F6F2E9
  for (let p = 0; p < data.length; p += 4) {
    const [r, g, b, a] = [data[p], data[p + 1], data[p + 2], data[p + 3]];
    if (a === 0) continue;
    const greenish = g > r + 12 && g > b + 12;
    if (!greenish) {
      // keep a hint of the hand-drawn texture via original luminance
      const lum = (r + g + b) / (3 * 255);
      const t = 0.85 + 0.15 * lum;
      data[p] = Math.round(CREAM[0] * t);
      data[p + 1] = Math.round(CREAM[1] * t);
      data[p + 2] = Math.round(CREAM[2] * t);
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png();
}

async function logo() {
  await mkdir(BRAND, { recursive: true });
  const src = path.join(ROOT, 'logo.PNG');
  const trimmed = await sharp(src).trim().toBuffer();

  // full lockup, charcoal (for cream backgrounds) — 2x header ≈ 560w
  await sharp(trimmed).resize({ width: 560 }).png({ palette: true }).toFile(path.join(BRAND, 'logo-ink-560.png'));
  await sharp(trimmed).resize({ width: 560 }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(BRAND, 'logo-ink-560.webp'));

  // cream recolour (for dark backgrounds)
  const cream = await (await creamVariant(trimmed)).toBuffer();
  await sharp(cream).resize({ width: 560 }).png({ palette: true }).toFile(path.join(BRAND, 'logo-cream-560.png'));
  await sharp(cream).resize({ width: 560 }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(BRAND, 'logo-cream-560.webp'));
  // larger cream for the hero lockup (2x of ~420 display)
  await sharp(cream).resize({ width: 840 }).png({ palette: true }).toFile(path.join(BRAND, 'logo-cream-840.png'));
  await sharp(cream).resize({ width: 840 }).webp({ quality: 88, alphaQuality: 90 }).toFile(path.join(BRAND, 'logo-cream-840.webp'));

  // apple-only crop (favicon / motif). Apple sits centre-top of the 1536x1024 canvas.
  const appleBox = await sharp(src)
    .extract({ left: 560, top: 30, width: 440, height: 560 })
    .toBuffer();
  const appleRegion = await sharp(appleBox).trim().toBuffer();
  const m = await sharp(appleRegion).metadata();
  const size = Math.max(m.width, m.height);
  const pad = Math.round(size * 0.08);
  const square = await sharp(appleRegion)
    .extend({
      top: pad + Math.floor((size - m.height) / 2), bottom: pad + Math.ceil((size - m.height) / 2),
      left: pad + Math.floor((size - m.width) / 2), right: pad + Math.ceil((size - m.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp(square).resize(512, 512).png().toFile(path.join(ROOT, 'icon-512.png'));
  await sharp(square).resize(192, 192).png().toFile(path.join(ROOT, 'icon-192.png'));
  await sharp(square).resize(64, 64).png().toFile(path.join(BRAND, 'apple-64.png'));
  await sharp(square).resize(160, 160).png().toFile(path.join(BRAND, 'apple-160.png'));
  // apple-touch-icon wants an opaque background
  await sharp(square).resize(150, 150).flatten({ background: '#F6F2E9' })
    .extend({ top: 15, bottom: 15, left: 15, right: 15, background: '#F6F2E9' })
    .png().toFile(path.join(ROOT, 'apple-touch-icon.png'));
  await sharp(square).resize(32, 32).png().toFile(path.join(ROOT, 'favicon-32.png'));
  console.log('logo derivatives written');
}

// 1200x630 og images: photo cover + deep-green gradient + cream logo lockup.
async function og(name, photoFile, logoBuf) {
  const W = 1200, H = 630;
  const photo = await sharp(path.join(SRC, photoFile)).rotate().resize(W, H, { fit: 'cover' }).toBuffer();
  const shade = Buffer.from(
    `<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
       <stop offset="0" stop-color="#12251C" stop-opacity="0.92"/>
       <stop offset="0.45" stop-color="#12251C" stop-opacity="0.35"/>
       <stop offset="1" stop-color="#12251C" stop-opacity="0.05"/>
     </linearGradient></defs>
     <rect width="${W}" height="${H}" fill="url(#g)"/>
     <rect x="60" y="${H - 78}" width="72" height="3" fill="#B58A4C"/></svg>`
  );
  const logoSm = await sharp(logoBuf).resize({ width: 300 }).toBuffer();
  const lm = await sharp(logoSm).metadata();
  await sharp(photo)
    .composite([
      { input: shade, left: 0, top: 0 },
      { input: logoSm, left: 60, top: H - 110 - lm.height },
    ])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, `og-${name}.jpg`));
}

async function ogs() {
  const trimmed = await sharp(path.join(ROOT, 'logo.PNG')).trim().toBuffer();
  const cream = await (await creamVariant(trimmed)).toBuffer();
  await og('home', 'DSC09429.jpg', cream);
  await og('breakfast', 'DSC09504.jpg', cream);
  await og('lunch-dinner', 'DSC09434.jpg', cream);
  await og('orangery', 'DSC09465.jpg', cream);
  console.log('og images written');
}

const only = process.argv[2];
if (!only || only === 'logo') await logo();
if (!only || only === 'og') await ogs();
if (!only || only === 'photos') await photos();
console.log('done');
