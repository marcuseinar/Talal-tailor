/**
 * Generate and hand over a candidate's CV.
 *
 * Seeded candidates have no PDF on disk — theirs is built on demand from the
 * same record the profile page renders, so the download always matches what is
 * on screen. Candidates who uploaded their own PDF get their original bytes
 * back untouched.
 */
import { buildCvPdf, cvFilename } from './pdf/cv.js';
import { rasterizeToJpeg, dataUrlToBytes } from './pdf/raster.js';
import { avatarDataUrl } from './data/avatars.js';
import { saveFile } from './downloads.js';

/** @returns {Promise<{bytes: Uint8Array, filename: string, generated: boolean}>} */
export async function buildCandidateCv(candidate) {
  if (candidate.cv?.kind === 'upload' && candidate.cv.dataUrl) {
    const bytes = dataUrlToBytes(candidate.cv.dataUrl);
    if (bytes) {
      return { bytes, filename: candidate.cv.filename || cvFilename(candidate), generated: false };
    }
  }

  const source = candidate.photo ?? avatarDataUrl(candidate.id);
  const photo = source ? await rasterizeToJpeg(source, { size: 300 }) : null;
  const bytes = buildCvPdf(candidate, { photo, reference: candidate.reference });
  return { bytes, filename: cvFilename(candidate), generated: true };
}

/** Build, then offer it to the viewer. Returns the save outcome for the UI. */
export async function downloadCandidateCv(candidate) {
  const { bytes, filename } = await buildCandidateCv(candidate);
  return saveFile({ filename, data: bytes, mime: 'application/pdf' });
}
