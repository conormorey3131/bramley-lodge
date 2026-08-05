// One-off QA screenshots — NOT needed to serve the site.
// Usage: node tools/screenshot.mjs <outdir> [--nojs]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] || 'shots';
const NOJS = process.argv.includes('--nojs');
mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:8321';
const PAGES = [
  ['home', '/'],
  ['menus', '/menus/'],
  ['breakfast', '/menus/breakfast/'],
  ['lunch-dinner', '/menus/lunch-dinner/'],
  ['orangery', '/menus/orangery-evening/'],
  ['gallery', '/gallery/'],
  ['about', '/about/'],
  ['careers', '/careers/'],
  ['contact', '/contact/'],
  ['404', '/404.html'],
];
const WIDTHS = NOJS ? [390, 1280] : [390, 768, 1280, 1600];

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
});
const page = await browser.newPage();
if (NOJS) await page.setJavaScriptEnabled(false);

for (const [name, path] of PAGES) {
  for (const w of WIDTHS) {
    await page.setViewport({ width: w, height: w < 500 ? 844 : 900, deviceScaleFactor: 1 });
    await page.goto(BASE + path, { waitUntil: NOJS ? 'load' : 'networkidle0', timeout: 30000 });
    // scroll through the page so IntersectionObserver reveals fire, then return to top
    if (!NOJS) await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const t = setInterval(() => {
          y += 450;
          window.scrollTo({ top: y, behavior: 'instant' });
          if (y >= document.documentElement.scrollHeight) {
            clearInterval(t);
            setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); res(); }, 400);
          }
        }, 90);
      });
    });
    await new Promise((r) => setTimeout(r, 1000)); // let reveals/fonts settle
    await page.screenshot({ path: `${OUT}/${name}-${w}.png`, fullPage: true });
  }
  console.log(name, 'done');
}
await browser.close();
