/**
 * Fetches a candidate avatar per persona from the DiceBear HTTP API and writes
 * optimised SVGs into src/assets/avatars/.
 *
 * Style: "Notionists" by Zoish — CC0 1.0 (public domain). No attribution is
 * required; we credit it in the README and the in-app about panel anyway.
 *
 * Run with: npm run gen:avatars
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { PERSONAS } from '../src/lib/data/personas.js';

const OUT = new URL('../src/assets/avatars/', import.meta.url);
const STYLE = 'notionists';
const BACKGROUNDS = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf', 'c8e6c9', 'fde2b3'];

/**
 * Strip the RDF metadata block, collapse whitespace (roughly 20% smaller) and
 * add an intrinsic size. DiceBear ships viewBox-only SVGs, which a <canvas>
 * measures as the 300x150 default — that silently mis-crops the photo the PDF
 * generator rasterises out of them.
 */
function optimise(svg) {
  return svg
    .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
    .replace(/>\s+</g, '><')
    .replace(/^<svg /, '<svg width="512" height="512" ')
    .trim();
}

await mkdir(OUT, { recursive: true });

let total = 0;
for (const [i, person] of PERSONAS.entries()) {
  const params = new URLSearchParams({
    seed: person.avatarSeed,
    backgroundColor: BACKGROUNDS[i % BACKGROUNDS.length],
    radius: '50',
    scale: '105'
  });
  const url = `https://api.dicebear.com/9.x/${STYLE}/svg?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${person.id}: ${res.status} ${res.statusText}`);
  const svg = optimise(await res.text());
  await writeFile(new URL(`${person.id}.svg`, OUT), svg, 'utf8');
  total += svg.length;
  process.stdout.write(`  ${person.id.padEnd(24)} ${(svg.length / 1024).toFixed(1)} KB\n`);
}
console.log(`\n${PERSONAS.length} avatars, ${(total / 1024).toFixed(0)} KB total`);
