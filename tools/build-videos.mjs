// One-off video compression for the social band — NOT needed to serve the site.
// Usage: node tools/build-videos.mjs
import ffmpeg from 'ffmpeg-static';
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = path.join(ROOT, 'July '); // trailing space is real
const OUT = path.join(ROOT, 'assets', 'video');
mkdirSync(OUT, { recursive: true });

const REELS = [
  ['Bramley Lodge bar mohito reel.mp4', 'reel-mojito'],
  ['Coffe cake reel.mp4', 'reel-coffee-cake'],
  ['PMartini edit .mp4', 'reel-pmartini'], // trailing space in name is real
];

function run(args) {
  return execFileSync(ffmpeg, args, { stdio: ['ignore', 'pipe', 'pipe'] });
}

for (const [file, slug] of REELS) {
  const src = path.join(SRC, file);
  const out = path.join(OUT, `${slug}.mp4`);
  // portrait reels: cap the short side at 720, keep aspect, cap 30fps, strip audio
  for (const crf of [28, 31, 34]) {
    run([
      '-y', '-i', src,
      '-vf', "scale='if(gt(iw,ih),-2,min(720,iw))':'if(gt(iw,ih),min(720,ih),-2)',fps=30",
      '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf),
      '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart',
      out,
    ]);
    const kb = Math.round(statSync(out).size / 1024);
    console.log(`${slug}.mp4 crf${crf} ${kb}KB`);
    if (kb <= 4096) break;
  }
  // poster frame ~1s in
  run(['-y', '-ss', '1', '-i', src, '-frames:v', '1',
    '-vf', "scale='if(gt(iw,ih),-2,min(720,iw))':'if(gt(iw,ih),min(720,ih),-2)'",
    '-q:v', '4', path.join(OUT, `${slug}-poster.jpg`)]);
}
console.log('videos done');
