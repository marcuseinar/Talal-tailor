/**
 * Bundles the Vite output into a single self-contained HTML file for the
 * Artifact host.
 *
 * Two things that host needs and an ordinary build does not give it:
 *  - one file, because a sandboxed frame is the least fragile place to resolve
 *    exactly zero relative asset URLs;
 *  - body-level content, because the host wraps what it is given in its own
 *    <!doctype>/<head>/<body> skeleton, so a full document would nest.
 *
 * Google Fonts links are kept — that host allows them — and everything else is
 * inlined.
 *
 * Run with: npm run build:artifact
 */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const outDir = join(root, 'dist-artifact');
const outFile = join(outDir, 'index.html');

const html = await readFile(join(dist, 'index.html'), 'utf8');

/** Pull the inner HTML of <head> and <body> out of the built document. */
const section = (name) => html.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))?.[1] ?? '';
let head = section('head');
const body = section('body');

const assetText = (src) => readFile(join(dist, src.replace(/^\.?\//, '')), 'utf8');

// Inline local stylesheets; leave the font host alone.
const localCss = [...head.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/gi)].filter(
  ([tag]) => !/https?:\/\//.test(tag)
);
for (const [tag] of localCss) {
  const href = tag.match(/href="([^"]+)"/)?.[1];
  head = head.replace(tag, href ? `<style>\n${await assetText(href)}\n</style>` : '');
}

// Inline the module bundle. `</script>` inside a string literal would close the
// tag early, so neutralise the sequence — JS reads the escape identically.
let scripts = '';
for (const [tag] of [...head.matchAll(/<script[^>]*src="[^"]+"[^>]*><\/script>/gi)]) {
  const src = tag.match(/src="([^"]+)"/)?.[1];
  head = head.replace(tag, '');
  if (src) {
    const code = (await assetText(src)).replaceAll('</script', '<\\/script');
    scripts += `<script type="module">\n${code}\n</script>\n`;
  }
}

// The host supplies charset and viewport itself.
head = head
  .replace(/<meta\s+charset[^>]*>/gi, '')
  .replace(/<meta\s+name="viewport"[^>]*>/gi, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const out = `${head}\n${body.trim()}\n${scripts}`;

await mkdir(outDir, { recursive: true });
await writeFile(outFile, out, 'utf8');

const { size } = await stat(outFile);
const checks = [
  ['no <html> wrapper', !/<html/i.test(out)],
  ['no <head> wrapper', !/<head[\s>]/i.test(out)],
  ['no <body> wrapper', !/<body[\s>]/i.test(out)],
  ['has a <title>', /<title>/i.test(out)],
  ['has the mount point', /id="app"/.test(out)],
  ['no local asset refs left', !/(src|href)="\.?\/?assets\//.test(out)],
  ['under the 16 MB page cap', size < 16 * 1024 * 1024]
];

let ok = true;
for (const [label, pass] of checks) {
  if (!pass) ok = false;
  console.log(`  ${pass ? '✓' : '✗'} ${label}`);
}
console.log(`\n${outFile} — ${(size / 1024).toFixed(0)} KB`);
if (!ok) {
  console.error('\nArtifact bundle failed its checks.');
  process.exit(1);
}
