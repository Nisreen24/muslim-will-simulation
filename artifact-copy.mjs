// Builds a wrapper-free copy of index.html for publishing as a Claude Artifact
// (the Artifact host supplies <html>/<head>/<body>; body classes move to a wrapper div).
// Usage: node artifact-copy.mjs [out-path]   → default: ./temporary screenshots/muslim-will-sim.html
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const out = resolve(process.argv[2] || 'temporary screenshots/muslim-will-sim.html');
let h = readFileSync('index.html', 'utf8');

h = h
  .replace(/^<!DOCTYPE html>\s*/i, '')
  .replace(/<html lang="en">\s*/, '')
  .replace(/<head>\s*/, '')
  .replace(/<meta charset="utf-8">\s*/, '')
  .replace(/<meta name="viewport"[^>]*>\s*/, '')
  .replace(/<title>[^<]*<\/title>/, '<title>Muslim Will Simulation</title>')
  .replace(/<\/head>\s*/, '')
  .replace(/<body class="([^"]*)">/, '<style>body{margin:0;background:#F5F3EE}</style>\n<div id="app-root" class="$1">')
  .replace(/<\/body>\s*<\/html>\s*$/, '</div>\n');

const leftovers = ['<!DOCTYPE', '<html', '<head>', '</head>', '<body', '</body>', '</html>'].filter((t) => h.includes(t));
if (leftovers.length) {
  console.error('Leftover wrapper tags:', leftovers.join(', '));
  process.exit(1);
}
writeFileSync(out, h);
console.log(out);
