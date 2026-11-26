// NusaStat — "Indonesia in Numbers" (Node 22, standard library only).
//
// The program hands the site in: it checks the entry the way the scorer
// will, then copies app/ and screenshots/ from beside this file to /output
// and writes /output/dossier.json with the vendored make.fun library.
//
// Checks it runs before writing anything:
//   - app/index.html exists, is a regular file and is at most 1 MiB;
//   - screenshots/ holds 3 or 4 images, each at most 256 KiB, each a whole
//     PNG or JPEG whose long side is at most 1280 px and short side at
//     least 360 px (read from the image headers, never guessed);
//   - app/ stays inside the scorer's caps (993 files, 16 MiB).
// The dossier is byte for byte what buildDossier writes from the same
// files, so a second run over the same tree writes identical bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');
const shotsDir = join(here, 'screenshots');

const MAX_SHOT_BYTES = 262144;
const MAX_LONG_SIDE = 1280;
const MIN_SHORT_SIDE = 360;

function fail(message) {
  throw new Error(`nusastat main.ts: ${message}`);
}

function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function jpegSize(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let off = 2;
  while (off + 9 < buf.length) {
    if (buf[off] !== 0xff) return null;
    const marker = buf[off + 1];
    if (marker === 0xd9 || marker === 0xda) return null;
    const len = buf.readUInt16BE(off + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
    }
    off += 2 + len;
  }
  return null;
}

function checkShots() {
  if (!existsSync(shotsDir)) fail('screenshots/ is missing');
  const names = readdirSync(shotsDir).filter((n) => !n.startsWith('.')).sort();
  if (names.length < 3 || names.length > 4) fail(`screenshots/ holds ${names.length} images, need 3 or 4`);
  for (const name of names) {
    if (!/^[A-Za-z0-9._-]{1,128}$/.test(name) || name.startsWith('-')) fail(`bad screenshot name: ${name}`);
    const path = join(shotsDir, name);
    const st = statSync(path);
    if (!st.isFile()) fail(`screenshot is not a regular file: ${name}`);
    if (st.size > MAX_SHOT_BYTES) fail(`screenshot over 256 KiB: ${name} (${st.size} bytes)`);
    const buf = readFileSync(path);
    const size = pngSize(buf) ?? jpegSize(buf);
    if (!size) fail(`screenshot is not a whole PNG or JPEG: ${name}`);
    const long = Math.max(size.width, size.height);
    const short = Math.min(size.width, size.height);
    if (long > MAX_LONG_SIDE) fail(`screenshot long side over 1280: ${name} (${size.width}x${size.height})`);
    if (short < MIN_SHORT_SIDE) fail(`screenshot short side under 360: ${name} (${size.width}x${size.height})`);
  }
  return names;
}

function checkApp() {
  const index = join(appDir, 'index.html');
  if (!existsSync(index) || !statSync(index).isFile()) fail('app/index.html is missing');
  if (statSync(index).size > 1048576) fail('app/index.html is over 1 MiB');
  let files = 0;
  let bytes = 0;
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      const st = statSync(path);
      if (st.isDirectory()) walk(path);
      else if (st.isFile()) { files += 1; bytes += st.size; }
      else fail(`app/ holds a non-file entry: ${path}`);
    }
  };
  walk(appDir);
  if (files > 993) fail(`app/ holds ${files} files, cap is 993`);
  if (bytes > 16777216) fail(`app/ is ${bytes} bytes, cap is 16 MiB`);
  return { files, bytes };
}

const shots = checkShots();
const appInfo = checkApp();

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

console.log(`nusastat: app ${appInfo.files} files / ${appInfo.bytes} bytes; screenshots: ${shots.join(', ')}; dossier written to ${out}/dossier.json`);
