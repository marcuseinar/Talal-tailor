/**
 * Candidate avatars.
 *
 * Style: "Notionists" by Zoish, licensed CC0 1.0 (public domain) and served
 * through DiceBear. Fetched once into src/assets/avatars/ by
 * `npm run gen:avatars` so the app has no runtime dependency on an image host
 * — which also matters because the deployed page runs under a strict CSP.
 *
 * They are illustrations rather than photographs on purpose: the personas are
 * invented, and attaching a real person's face to a fabricated CV is not a
 * thing a demo should do.
 */
const files = import.meta.glob('../../assets/avatars/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default'
});

/** @type {Record<string, string>} candidate id -> inline SVG markup */
export const AVATAR_SVG = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.split('/').pop().replace('.svg', ''), svg])
);

const dataUrlCache = new Map();

/** A data: URI for the avatar — used by <img> and by canvas rasterisation. */
export function avatarDataUrl(id) {
  if (!AVATAR_SVG[id]) return null;
  if (!dataUrlCache.has(id)) {
    dataUrlCache.set(id, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(AVATAR_SVG[id])}`);
  }
  return dataUrlCache.get(id);
}

export const AVATAR_CREDIT = {
  style: 'Notionists',
  author: 'Zoish',
  licence: 'CC0 1.0',
  licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  via: 'DiceBear'
};
