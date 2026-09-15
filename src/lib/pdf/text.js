/**
 * Text encoding and measurement for the standard PDF fonts.
 *
 * PDF's built-in Helvetica family is encoded with WinAnsiEncoding — a
 * single-byte, Latin-1-ish table. Everything here converts JavaScript strings
 * into those bytes and measures them against the baked AFM widths so the
 * layout engine can wrap lines properly instead of guessing.
 */
import METRICS from '../fonts/helvetica-metrics.js';

/** @typedef {'regular'|'bold'|'italic'|'boldItalic'} Face */

const ENCODING = METRICS.encoding;
const FALLBACK = METRICS.fallbackByte;

/**
 * Characters WinAnsi cannot represent, mapped to a readable stand-in rather
 * than a question mark. Em dashes, ellipses, curly quotes, bullets and the
 * euro sign are all in WinAnsi already and need no entry here.
 */
const TRANSLITERATE = {
  '\u2192': '->',
  '\u2190': '<-',
  '\u2265': '>=',
  '\u2264': '<=',
  '\u2248': '~',
  '\u00a0': ' ',
  '\u2009': ' ',
  '\u202f': ' ',
  '\u200b': ''
};

/** @returns {number[]} WinAnsi byte codes for `text`. */
export function toWinAnsiBytes(text) {
  const bytes = [];
  for (const char of String(text ?? '')) {
    const replacement = TRANSLITERATE[char];
    const source = replacement !== undefined ? replacement : char;
    for (const c of source) {
      const byte = ENCODING[c.codePointAt(0)];
      bytes.push(byte === undefined ? FALLBACK : byte);
    }
  }
  return bytes;
}

/**
 * A PDF literal string: bytes wrapped in parentheses with the three
 * structural characters escaped. Returned as a latin-1 JS string, which the
 * writer turns back into bytes one-for-one.
 */
export function pdfString(text) {
  let out = '(';
  for (const byte of toWinAnsiBytes(text)) {
    if (byte === 0x28 || byte === 0x29 || byte === 0x5c) out += '\\';
    out += String.fromCharCode(byte);
  }
  return out + ')';
}

/**
 * A PDF *text string* for metadata and annotations: UTF-16BE with a byte-order
 * mark, written as hex. Unlike WinAnsi literals this carries any character, so
 * titles keep their dashes and diacritics in a reader's document properties.
 */
export function pdfTextString(text) {
  let hex = 'FEFF';
  for (const char of String(text ?? '')) {
    const cp = char.codePointAt(0);
    if (cp > 0xffff) {
      const v = cp - 0x10000;
      hex += (0xd800 + (v >> 10)).toString(16).padStart(4, '0').toUpperCase();
      hex += (0xdc00 + (v & 0x3ff)).toString(16).padStart(4, '0').toUpperCase();
    } else {
      hex += cp.toString(16).padStart(4, '0').toUpperCase();
    }
  }
  return `<${hex}>`;
}

/** Width of `text` in points at `size`, for the given face. */
export function measure(text, face, size) {
  const widths = METRICS.fonts[face].widths;
  let total = 0;
  for (const byte of toWinAnsiBytes(text)) total += widths[byte] || 0;
  return (total / METRICS.unitsPerEm) * size;
}

/**
 * Greedy word wrap. Words longer than the line box are broken mid-word so a
 * long URL can never push the layout out of the margins.
 */
export function wrap(text, face, size, maxWidth) {
  const paragraphs = String(text ?? '').split('\n');
  /** @type {string[]} */
  const lines = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push('');
      continue;
    }
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (measure(candidate, face, size) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      if (measure(word, face, size) <= maxWidth) {
        line = word;
      } else {
        // Hard-break an oversized token.
        let chunk = '';
        for (const char of word) {
          if (measure(chunk + char, face, size) > maxWidth && chunk) {
            lines.push(chunk);
            chunk = char;
          } else {
            chunk += char;
          }
        }
        line = chunk;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

/** Shorten to fit, appending an ellipsis. Used for table cells and headers. */
export function truncate(text, face, size, maxWidth) {
  if (measure(text, face, size) <= maxWidth) return text;
  const ellipsis = '…';
  let out = '';
  for (const char of String(text)) {
    if (measure(out + char + ellipsis, face, size) > maxWidth) break;
    out += char;
  }
  return out.trimEnd() + ellipsis;
}

export const FONT_FACES = /** @type {Face[]} */ (Object.keys(METRICS.fonts));
export const FACE_BASE_FONT = Object.fromEntries(
  Object.entries(METRICS.fonts).map(([face, data]) => [face, data.baseFont])
);
export { METRICS };
