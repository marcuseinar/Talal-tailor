/**
 * Renders a candidate into a real, multi-page A4 CV.
 *
 * The same function serves both seeded personas and applications submitted
 * through the candidate portal, so a brand new applicant gets a formatted CV
 * even if they never uploaded one.
 */
import { PdfDocument, A4 } from './writer.js';
import { PDF_THEME as T } from './theme.js';
import { measure } from './text.js';

const MARGIN = 44;
const HEADER_H = 132;
const COL_GAP = 26;
const MAIN_W = 322;
const SIDE_X = MARGIN + MAIN_W + COL_GAP;
const SIDE_W = A4.width - SIDE_X - MARGIN;
const BOTTOM = A4.height - 54;

const LINK_LABELS = {
  portfolio: 'Portfolio',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  website: 'Website',
  dribbble: 'Dribbble'
};

/** Tracks the y cursor across both columns and spills onto new pages. */
class Flow {
  constructor(doc, { photo, name } = {}) {
    this.doc = doc;
    this.photo = photo;
    this.name = name;
    this.pageIndex = 0;
    this.page = null;
    this.mainY = 0;
    this.sideY = 0;
    this.newPage(true);
  }

  newPage(first = false) {
    this.page = this.doc.addPage();
    this.pageIndex += 1;
    if (first) {
      this.mainY = HEADER_H + 42;
      this.sideY = HEADER_H + 42;
    } else {
      this.page.rect(0, 0, A4.width, 6, { fill: T.brand });
      this.mainY = MARGIN + 28;
      this.sideY = MARGIN + 28;
    }
    return this.page;
  }

  /** Start a fresh page if `height` will not fit in the main column. */
  ensureMain(height) {
    if (this.mainY + height <= BOTTOM) return;
    this.newPage();
  }
}

function sectionHeading(page, label, x, y, width) {
  page.text(label.toUpperCase(), x, y, {
    face: 'bold',
    size: 8.5,
    color: T.accent,
    charSpacing: 0.55
  });
  page.line(x, y + 6.5, x + width, y + 6.5, { color: T.rule, width: 0.8 });
  return y + 20;
}

function drawHeader(page, candidate, photoName) {
  page.rect(0, 0, A4.width, HEADER_H, { fill: T.brand });
  page.rect(0, HEADER_H - 4, A4.width, 4, { fill: T.accent });

  const hasPhoto = Boolean(photoName);
  const photoR = 38;
  const photoCx = A4.width - MARGIN - photoR;
  const textRight = hasPhoto ? photoCx - photoR - 22 : A4.width - MARGIN;
  const textWidth = textRight - MARGIN;

  if (hasPhoto) {
    page.save();
    page.clipCircle(photoCx, HEADER_H / 2 - 4, photoR);
    page.image(photoName, photoCx - photoR, HEADER_H / 2 - 4 - photoR, photoR * 2, photoR * 2);
    page.restore();
  }

  const fullName = `${candidate.firstName} ${candidate.lastName}`;
  let nameSize = 25;
  while (measure(fullName, 'bold', nameSize) > textWidth && nameSize > 15) nameSize -= 0.5;
  page.text(fullName, MARGIN, 56, { face: 'bold', size: nameSize, color: T.white });

  page.paragraph(candidate.headline ?? '', MARGIN, 76, {
    width: textWidth,
    size: 10,
    lineHeight: 1.35,
    color: T.brandSoft,
    maxLines: 2
  });

  const contact = [candidate.location, candidate.email, candidate.phone].filter(Boolean).join('   ·   ');
  page.text(contact, MARGIN, HEADER_H - 22, { size: 8.5, color: T.brandSoft });
}

function drawExperience(flow, candidate) {
  const entries = candidate.experience ?? [];
  if (!entries.length) return;
  flow.ensureMain(60);
  flow.mainY = sectionHeading(flow.page, 'Experience', MARGIN, flow.mainY, MAIN_W);

  entries.forEach((entry, index) => {
    const periodW = measure(entry.period ?? '', 'regular', 8.5);
    const roleW = MAIN_W - periodW - 12;
    const bulletHeight = (entry.bullets ?? []).reduce(
      (sum, b) =>
        sum + flow.page.measureParagraph(b, { width: MAIN_W - 12, size: 9, lineHeight: 1.4 }) + 3,
      0
    );
    flow.ensureMain(34 + bulletHeight + 10);

    flow.page.text(entry.role, MARGIN, flow.mainY, {
      face: 'bold',
      size: 10.5,
      color: T.ink
    });
    if (entry.period) {
      flow.page.textRight(entry.period, MARGIN + MAIN_W, flow.mainY, {
        size: 8.5,
        color: T.muted
      });
    }
    flow.mainY += 13;

    const org = [entry.company, entry.location].filter(Boolean).join(' · ');
    flow.page.text(org, MARGIN, flow.mainY, { size: 9, color: T.accent, face: 'italic' });
    flow.mainY += 13;

    for (const bullet of entry.bullets ?? []) {
      flow.page.text('•', MARGIN + 1, flow.mainY, { size: 9, color: T.faint });
      const next = flow.page.paragraph(bullet, MARGIN + 12, flow.mainY, {
        width: MAIN_W - 12,
        size: 9,
        lineHeight: 1.45,
        color: T.body
      });
      flow.mainY = next + 3;
    }
    flow.mainY += index === entries.length - 1 ? 8 : 12;
    void roleW;
  });
}

function drawEducation(flow, candidate) {
  const entries = candidate.education ?? [];
  if (!entries.length) return;
  flow.ensureMain(50);
  flow.mainY = sectionHeading(flow.page, 'Education', MARGIN, flow.mainY, MAIN_W);
  for (const entry of entries) {
    flow.ensureMain(28);
    flow.page.text(entry.degree, MARGIN, flow.mainY, { face: 'bold', size: 10, color: T.ink });
    if (entry.period) {
      flow.page.textRight(entry.period, MARGIN + MAIN_W, flow.mainY, { size: 8.5, color: T.muted });
    }
    flow.mainY += 12;
    flow.page.text(entry.school, MARGIN, flow.mainY, { size: 9, color: T.body });
    flow.mainY += 18;
  }
}

/** Side column blocks stack independently of the main column. */
function sidePanel(flow, title, draw, estimate) {
  if (flow.sideY + estimate > BOTTOM) return; // side content is supplementary
  flow.sideY = sectionHeading(flow.page, title, SIDE_X, flow.sideY, SIDE_W);
  draw();
  flow.sideY += 14;
}

function drawSideColumn(flow, candidate) {
  const page = flow.page;

  const details = [
    ['Location', candidate.location],
    ['Notice period', candidate.noticePeriod],
    ['Salary expectation', candidate.salaryExpectation],
    ['Work permit', candidate.workPermit]
  ].filter(([, v]) => v);

  if (details.length) {
    sidePanel(
      flow,
      'Details',
      () => {
        for (const [label, value] of details) {
          page.text(label, SIDE_X, flow.sideY, { size: 7.5, color: T.faint, charSpacing: 0.25 });
          flow.sideY += 10;
          flow.sideY = page.paragraph(value, SIDE_X, flow.sideY, {
            width: SIDE_W,
            size: 9,
            lineHeight: 1.35,
            color: T.body
          });
          flow.sideY += 7;
        }
      },
      details.length * 30
    );
  }

  const skills = candidate.skills ?? [];
  if (skills.length) {
    sidePanel(
      flow,
      'Skills',
      () => {
        // Simple chip wrapping.
        let x = SIDE_X;
        let rowTop = flow.sideY - 8;
        for (const skill of skills) {
          const w = measure(skill, 'regular', 8) + 12;
          if (x + w > SIDE_X + SIDE_W) {
            x = SIDE_X;
            rowTop += 18;
          }
          page.rect(x, rowTop, w, 14, { fill: T.panel, radius: 7 });
          page.text(skill, x + 6, rowTop + 10, { size: 8, color: T.brand });
          x += w + 4;
        }
        flow.sideY = rowTop + 22;
      },
      skills.length * 9
    );
  }

  const languages = candidate.languages ?? [];
  if (languages.length) {
    sidePanel(
      flow,
      'Languages',
      () => {
        for (const lang of languages) {
          page.text(lang.name, SIDE_X, flow.sideY, { size: 9, color: T.body });
          page.textRight(lang.level, SIDE_X + SIDE_W, flow.sideY, { size: 8.5, color: T.muted });
          flow.sideY += 13;
        }
      },
      languages.length * 13 + 10
    );
  }

  const links = Object.entries(candidate.links ?? {}).filter(([, v]) => v);
  if (links.length) {
    sidePanel(
      flow,
      'Links',
      () => {
        for (const [label, value] of links) {
          page.text(LINK_LABELS[label] ?? label, SIDE_X, flow.sideY, {
            size: 7.5,
            color: T.faint,
            charSpacing: 0.25
          });
          flow.sideY += 10;
          page.text(value, SIDE_X, flow.sideY, { size: 8.5, color: T.brand });
          page.link(`https://${String(value).replace(/^https?:\/\//, '')}`, SIDE_X, flow.sideY - 8, SIDE_W, 11);
          flow.sideY += 14;
        }
      },
      links.length * 24
    );
  }
}

function drawFooters(doc, candidate, reference) {
  doc.pages.forEach((page, i) => {
    const y = A4.height - 32;
    page.line(MARGIN, y - 12, A4.width - MARGIN, y - 12, { color: T.rule, width: 0.6 });
    page.text(
      `${candidate.firstName} ${candidate.lastName} · CV${reference ? ` · ${reference}` : ''}`,
      MARGIN,
      y,
      { size: 7.5, color: T.faint }
    );
    page.textRight(`Page ${i + 1} of ${doc.pages.length}`, A4.width - MARGIN, y, {
      size: 7.5,
      color: T.faint
    });
  });
}

/**
 * Build the CV.
 *
 * @param {object} candidate  persona or submitted application
 * @param {object} [options]
 * @param {{bytes: Uint8Array, width: number, height: number}} [options.photo] JPEG for the header
 * @param {string} [options.reference] application reference printed in the footer
 * @returns {Uint8Array}
 */
export function buildCvPdf(candidate, { photo, reference } = {}) {
  const doc = new PdfDocument({
    title: `${candidate.firstName} ${candidate.lastName} — CV`,
    author: `${candidate.firstName} ${candidate.lastName}`,
    subject: candidate.headline ?? 'Curriculum vitae'
  });

  const flow = new Flow(doc);
  const photoName = photo ? doc.addJpeg(photo.bytes, photo.width, photo.height) : null;
  drawHeader(flow.page, candidate, photoName);

  if (candidate.summary) {
    flow.mainY = sectionHeading(flow.page, 'Profile', MARGIN, flow.mainY, MAIN_W);
    flow.mainY = flow.page.paragraph(candidate.summary, MARGIN, flow.mainY, {
      width: MAIN_W,
      size: 9.5,
      lineHeight: 1.5,
      color: T.body
    });
    flow.mainY += 16;
  }

  drawSideColumn(flow, candidate);
  drawExperience(flow, candidate);
  drawEducation(flow, candidate);
  drawFooters(doc, candidate, reference);

  return doc.toBytes();
}

/** `amira-haddad-cv.pdf` */
export function cvFilename(candidate) {
  const slug = `${candidate.firstName}-${candidate.lastName}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}-cv.pdf`;
}
