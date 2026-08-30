// Screenshot a localhost URL with headless Chrome/Edge (no npm deps).
// Usage: node screenshot.mjs http://localhost:3000 [label]
// Saves to ./temporary screenshots/screenshot-N[-label].png (auto-incremented).
// Env:  SHOT_SIZE=1504,678  (CSS viewport; default = the reference capture 1880x847 ÷ 1.25 DPR)
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const [url = 'http://localhost:3000', label] = process.argv.slice(2);

if (!/^https?:\/\//i.test(url)) {
  console.error('Refusing to screenshot a non-http URL. Start `node serve.mjs` and pass http://localhost:3000');
  process.exit(1);
}

const dir = resolve('temporary screenshots');
mkdirSync(dir, { recursive: true });

const next =
  readdirSync(dir)
    .map((f) => /^screenshot-(\d+)/.exec(f)?.[1])
    .filter(Boolean)
    .map(Number)
    .reduce((a, b) => Math.max(a, b), 0) + 1;

const out = join(dir, `screenshot-${next}${label ? `-${label.replace(/[^\w-]+/g, '_')}` : ''}.png`);

const candidates = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const browser = candidates.find(existsSync);
if (!browser) {
  console.error('No Chrome or Edge found in the usual install paths.');
  process.exit(1);
}

const size = process.env.SHOT_SIZE || '1504,678';
const profile = join(tmpdir(), 'mw-shot-profile');

const result = spawnSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${profile}`,
    `--window-size=${size}`,
    '--virtual-time-budget=10000',
    `--screenshot=${out}`,
    url,
  ],
  { stdio: 'ignore' }
);

if (result.status !== 0 || !existsSync(out)) {
  console.error(`Screenshot failed (exit ${result.status}).`);
  process.exit(1);
}
console.log(out);
