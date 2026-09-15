/**
 * Browser-side image helpers for the PDF generator.
 *
 * PDF can embed JPEG bytes verbatim through the DCTDecode filter, so the
 * cheapest path from "any image the browser can display" to "image in a PDF"
 * is: draw it to a canvas, ask for a JPEG, hand the bytes over untouched.
 */

/** Decode any browser-loadable source (data URI, blob URL, http URL). */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

/**
 * Square, centre-cropped JPEG suitable for embedding.
 *
 * @param {string} src
 * @param {object} [options]
 * @param {number} [options.size] output edge in pixels
 * @param {number} [options.quality] 0-1 JPEG quality
 * @param {string} [options.background] painted under the image; JPEG has no alpha
 * @returns {Promise<{bytes: Uint8Array, width: number, height: number}|null>}
 */
export async function rasterizeToJpeg(src, { size = 320, quality = 0.85, background = '#ffffff' } = {}) {
  if (!src || typeof document === 'undefined') return null;
  try {
    const img = await loadImage(src);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);

    // Cover-fit: fill the square, cropping the long edge.
    //
    // An SVG without width/height attributes has no intrinsic size, and the
    // browser reports the 300x150 replaced-element default instead — cropping
    // against that mangles the image. Scale those to the destination rect and
    // let the viewBox's own preserveAspectRatio do the fitting.
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const vector = /^data:image\/svg\+xml/i.test(src) || !nw || !nh;
    if (vector) {
      ctx.drawImage(img, 0, 0, size, size);
    } else {
      const edge = Math.min(nw, nh);
      ctx.drawImage(img, (nw - edge) / 2, (nh - edge) / 2, edge, edge, 0, 0, size, size);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const bytes = dataUrlToBytes(dataUrl);
    return bytes ? { bytes, width: size, height: size } : null;
  } catch {
    // A photo is a nice-to-have; a CV without one is still a CV.
    return null;
  }
}

/** Decode the base64 payload of a data: URI into bytes. */
export function dataUrlToBytes(dataUrl) {
  const comma = String(dataUrl ?? '').indexOf(',');
  if (comma < 0) return null;
  const meta = dataUrl.slice(0, comma);
  const payload = dataUrl.slice(comma + 1);
  try {
    if (!meta.includes('base64')) return new TextEncoder().encode(decodeURIComponent(payload));
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

/** Bytes -> data: URI, for handing generated files to <img>/<iframe>/downloads. */
export function bytesToDataUrl(bytes, mime = 'application/pdf') {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

/** Shrink an uploaded photo so it never bloats stored records. */
export async function normalisePhoto(src, { size = 512, quality = 0.86 } = {}) {
  const jpeg = await rasterizeToJpeg(src, { size, quality });
  return jpeg ? bytesToDataUrl(jpeg.bytes, 'image/jpeg') : src;
}
