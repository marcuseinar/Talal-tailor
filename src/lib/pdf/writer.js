/**
 * A very small PDF writer — enough to lay out a CV and nothing more.
 *
 * Why hand-rolled: the standard 14 fonts need no embedding, so a complete
 * two-page CV comes out around 6 KB with no runtime dependency. Everything is
 * uncompressed, which keeps the file inspectable and the code short.
 *
 * Coordinates are exposed top-left origin, y growing downwards, because that
 * is how the layout code thinks. They are flipped on the way into the content
 * stream.
 */
import { pdfString, pdfTextString, measure, wrap, truncate, FACE_BASE_FONT, METRICS } from './text.js';

export const A4 = { width: 595.28, height: 841.89 };
export const LETTER = { width: 612, height: 792 };

/** '#1c2b3a' | 'rgb(…)' | [r,g,b] 0-255 -> PDF's 0-1 triplet. */
function toRgb(color) {
  if (Array.isArray(color)) return color.map((c) => c / 255);
  const hex = String(color).replace('#', '');
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  const n = parseInt(full, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const fmt = (n) => (Math.round(n * 1000) / 1000).toString();
const rgbOp = (color, op) => `${toRgb(color).map(fmt).join(' ')} ${op}`;

/** Magic constant for approximating a quarter circle with a cubic bezier. */
const KAPPA = 0.5522847498;

class PdfPage {
  /** @param {PdfDocument} doc */
  constructor(doc, size) {
    this.doc = doc;
    this.size = size;
    /** @type {string[]} */
    this.ops = [];
    /** @type {{rect: number[], url: string}[]} */
    this.links = [];
    /** @type {Set<string>} */
    this.faces = new Set();
    /** @type {Set<string>} */
    this.images = new Set();
  }

  /** Flip a top-left y into PDF space. */
  fy(y) {
    return this.size.height - y;
  }

  save() {
    this.ops.push('q');
    return this;
  }

  restore() {
    this.ops.push('Q');
    return this;
  }

  /**
   * Draw a single line of text. `y` is the text baseline measured from the top
   * of the page.
   */
  text(value, x, y, { face = 'regular', size = 10, color = '#000000', charSpacing = 0 } = {}) {
    if (value == null || value === '') return this;
    this.faces.add(face);
    // Character spacing lives in the graphics state, so it is scoped with q/Q
    // rather than reset by hand.
    const spacing = charSpacing ? `${fmt(charSpacing)} Tc ` : '';
    this.ops.push(
      `q BT ${rgbOp(color, 'rg')} ${spacing}/F_${face} ${fmt(size)} Tf ` +
        `${fmt(x)} ${fmt(this.fy(y))} Td ${pdfString(value)} Tj ET Q`
    );
    return this;
  }

  /** Right-aligned convenience wrapper. */
  textRight(value, right, y, opts = {}) {
    const width = measure(value, opts.face ?? 'regular', opts.size ?? 10);
    return this.text(value, right - width, y, opts);
  }

  /** Centred convenience wrapper. */
  textCenter(value, centerX, y, opts = {}) {
    const width = measure(value, opts.face ?? 'regular', opts.size ?? 10);
    return this.text(value, centerX - width / 2, y, opts);
  }

  /**
   * Word-wrapped block. Returns the y of the next free baseline so callers can
   * chain blocks down the page.
   */
  paragraph(value, x, y, { width, face = 'regular', size = 10, lineHeight = 1.4, color = '#000000', maxLines } = {}) {
    let lines = wrap(value, face, size, width);
    if (maxLines && lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = truncate(lines[maxLines - 1] + '…', face, size, width);
    }
    const step = size * lineHeight;
    lines.forEach((line, i) => this.text(line, x, y + i * step, { face, size, color }));
    return y + lines.length * step;
  }

  /** Height a paragraph would occupy, without drawing it. */
  measureParagraph(value, { width, face = 'regular', size = 10, lineHeight = 1.4 }) {
    return wrap(value, face, size, width).length * size * lineHeight;
  }

  rect(x, y, w, h, { fill, stroke, lineWidth = 0.75, radius = 0 } = {}) {
    if (!fill && !stroke) return this;
    const ops = [];
    if (fill) ops.push(rgbOp(fill, 'rg'));
    if (stroke) ops.push(`${rgbOp(stroke, 'RG')} ${fmt(lineWidth)} w`);
    const top = this.fy(y);
    const bottom = this.fy(y + h);
    if (radius > 0) {
      const r = Math.min(radius, w / 2, h / 2);
      const k = r * KAPPA;
      ops.push(
        `${fmt(x + r)} ${fmt(top)} m`,
        `${fmt(x + w - r)} ${fmt(top)} l`,
        `${fmt(x + w - r + k)} ${fmt(top)} ${fmt(x + w)} ${fmt(top - r + k)} ${fmt(x + w)} ${fmt(top - r)} c`,
        `${fmt(x + w)} ${fmt(bottom + r)} l`,
        `${fmt(x + w)} ${fmt(bottom + r - k)} ${fmt(x + w - r + k)} ${fmt(bottom)} ${fmt(x + w - r)} ${fmt(bottom)} c`,
        `${fmt(x + r)} ${fmt(bottom)} l`,
        `${fmt(x + r - k)} ${fmt(bottom)} ${fmt(x)} ${fmt(bottom + r - k)} ${fmt(x)} ${fmt(bottom + r)} c`,
        `${fmt(x)} ${fmt(top - r)} l`,
        `${fmt(x)} ${fmt(top - r + k)} ${fmt(x + r - k)} ${fmt(top)} ${fmt(x + r)} ${fmt(top)} c`,
        'h'
      );
    } else {
      ops.push(`${fmt(x)} ${fmt(bottom)} ${fmt(w)} ${fmt(h)} re`);
    }
    ops.push(fill && stroke ? 'B' : fill ? 'f' : 'S');
    this.ops.push(ops.join(' '));
    return this;
  }

  line(x1, y1, x2, y2, { color = '#000000', width = 0.75, dash } = {}) {
    const dashOp = dash ? `[${dash.join(' ')}] 0 d ` : '';
    this.ops.push(
      `q ${dashOp}${rgbOp(color, 'RG')} ${fmt(width)} w ${fmt(x1)} ${fmt(this.fy(y1))} m ` +
        `${fmt(x2)} ${fmt(this.fy(y2))} l S Q`
    );
    return this;
  }

  /** Clip subsequent drawing to a circle. Pair with `restore()`. */
  clipCircle(cx, cy, r) {
    const y = this.fy(cy);
    const k = r * KAPPA;
    this.ops.push(
      `q ${fmt(cx - r)} ${fmt(y)} m ` +
        `${fmt(cx - r)} ${fmt(y + k)} ${fmt(cx - k)} ${fmt(y + r)} ${fmt(cx)} ${fmt(y + r)} c ` +
        `${fmt(cx + k)} ${fmt(y + r)} ${fmt(cx + r)} ${fmt(y + k)} ${fmt(cx + r)} ${fmt(y)} c ` +
        `${fmt(cx + r)} ${fmt(y - k)} ${fmt(cx + k)} ${fmt(y - r)} ${fmt(cx)} ${fmt(y - r)} c ` +
        `${fmt(cx - k)} ${fmt(y - r)} ${fmt(cx - r)} ${fmt(y - k)} ${fmt(cx - r)} ${fmt(y)} c ` +
        'h W n'
    );
    return this;
  }

  /** Place a previously registered image. `name` comes from doc.addJpeg(). */
  image(name, x, y, w, h) {
    if (!name) return this;
    this.images.add(name);
    this.ops.push(
      `q ${fmt(w)} 0 0 ${fmt(h)} ${fmt(x)} ${fmt(this.fy(y + h))} cm /${name} Do Q`
    );
    return this;
  }

  /** Clickable region. PDF readers render these as link annotations. */
  link(url, x, y, w, h) {
    if (!url) return this;
    this.links.push({ url, rect: [x, this.fy(y + h), x + w, this.fy(y)] });
    return this;
  }

  content() {
    return this.ops.join('\n');
  }
}

export class PdfDocument {
  constructor({ size = A4, title = '', author = '', subject = '', creator = 'Talal Tailor' } = {}) {
    this.size = size;
    this.info = { title, author, subject, creator };
    /** @type {PdfPage[]} */
    this.pages = [];
    /** @type {Map<string, {bytes: Uint8Array, width: number, height: number}>} */
    this.imageStore = new Map();
    this.imageCounter = 0;
  }

  addPage(size = this.size) {
    const page = new PdfPage(this, size);
    this.pages.push(page);
    return page;
  }

  /**
   * Register raw JPEG bytes. JPEG passes straight through as a DCTDecode
   * stream, so no decoding happens here.
   */
  addJpeg(bytes, width, height) {
    const name = `Im${this.imageCounter++}`;
    this.imageStore.set(name, { bytes, width, height });
    return name;
  }

  /** @returns {Uint8Array} the complete file */
  toBytes() {
    /** @type {(string|Uint8Array)[][]} objects, 1-indexed by position */
    const objects = [];
    const ref = (n) => `${n} 0 R`;
    const push = (body) => {
      objects.push(body);
      return objects.length; // object number
    };

    const catalogNum = push(null); // placeholder, filled once we know the pages
    const pagesNum = push(null);

    // Fonts — one object per face actually used anywhere in the document.
    const usedFaces = new Set();
    for (const page of this.pages) for (const f of page.faces) usedFaces.add(f);
    /** @type {Record<string, number>} */
    const fontNums = {};
    for (const face of usedFaces) {
      fontNums[face] = push(
        `<< /Type /Font /Subtype /Type1 /BaseFont /${FACE_BASE_FONT[face]} ` +
          `/Encoding /WinAnsiEncoding >>`
      );
    }

    // Images.
    const usedImages = new Set();
    for (const page of this.pages) for (const n of page.images) usedImages.add(n);
    /** @type {Record<string, number>} */
    const imageNums = {};
    for (const name of usedImages) {
      const img = this.imageStore.get(name);
      if (!img) continue;
      imageNums[name] = push({
        dict:
          `<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} ` +
          `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode ` +
          `/Length ${img.bytes.length} >>`,
        stream: img.bytes
      });
    }

    const pageNums = [];
    for (const page of this.pages) {
      const contentNum = push({ dict: null, stream: page.content() });

      const annotNums = page.links.map(({ url, rect }) =>
        push(
          `<< /Type /Annot /Subtype /Link /Border [0 0 0] ` +
            `/Rect [${rect.map(fmt).join(' ')}] ` +
            `/A << /S /URI /URI ${pdfString(url)} >> >>`
        )
      );

      const fontRes = [...page.faces].map((f) => `/F_${f} ${ref(fontNums[f])}`).join(' ');
      const imageRes = [...page.images]
        .filter((n) => imageNums[n])
        .map((n) => `/${n} ${ref(imageNums[n])}`)
        .join(' ');

      pageNums.push(
        push(
          `<< /Type /Page /Parent ${ref(pagesNum)} ` +
            `/MediaBox [0 0 ${fmt(page.size.width)} ${fmt(page.size.height)}] ` +
            `/Resources << /ProcSet [/PDF /Text /ImageC] ` +
            (fontRes ? `/Font << ${fontRes} >> ` : '') +
            (imageRes ? `/XObject << ${imageRes} >> ` : '') +
            `>> ` +
            (annotNums.length ? `/Annots [${annotNums.map(ref).join(' ')}] ` : '') +
            `/Contents ${ref(contentNum)} >>`
        )
      );
    }

    const infoNum = push(
      `<< /Title ${pdfTextString(this.info.title)} /Author ${pdfTextString(this.info.author)} ` +
        `/Subject ${pdfTextString(this.info.subject)} /Creator ${pdfTextString(this.info.creator)} ` +
        `/Producer ${pdfTextString('Talal Tailor PDF writer')} >>`
    );

    objects[catalogNum - 1] = `<< /Type /Catalog /Pages ${ref(pagesNum)} >>`;
    objects[pagesNum - 1] =
      `<< /Type /Pages /Kids [${pageNums.map(ref).join(' ')}] /Count ${pageNums.length} >>`;

    return assemble(objects, catalogNum, infoNum);
  }
}

/** Serialise the object list with a cross-reference table. */
function assemble(objects, catalogNum, infoNum) {
  /** @type {Uint8Array[]} */
  const chunks = [];
  let offset = 0;
  const write = (data) => {
    const bytes = typeof data === 'string' ? latin1(data) : data;
    chunks.push(bytes);
    offset += bytes.length;
  };

  write('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');

  const offsets = [0];
  objects.forEach((body, i) => {
    offsets[i + 1] = offset;
    write(`${i + 1} 0 obj\n`);
    if (body && typeof body === 'object' && 'stream' in body) {
      const stream = typeof body.stream === 'string' ? latin1(body.stream) : body.stream;
      write(body.dict ?? `<< /Length ${stream.length} >>`);
      write('\nstream\n');
      write(stream);
      write('\nendstream');
    } else {
      write(String(body));
    }
    write('\nendobj\n');
  });

  const xrefOffset = offset;
  const count = objects.length + 1;
  let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let i = 1; i < count; i++) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  write(xref);
  write(
    `trailer\n<< /Size ${count} /Root ${catalogNum} 0 R /Info ${infoNum} 0 R >>\n` +
      `startxref\n${xrefOffset}\n%%EOF\n`
  );

  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const chunk of chunks) {
    out.set(chunk, pos);
    pos += chunk.length;
  }
  return out;
}

/** JS string (already latin-1 safe) -> bytes, one char per byte. */
function latin1(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 0xff;
  return out;
}

export { measure, wrap, truncate, METRICS };
