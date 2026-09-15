/**
 * Saving generated files.
 *
 * Two paths, because the app runs in two very different places:
 *
 *  1. The published Artifact host sandboxes the frame and blocks anchor
 *     downloads outright, but grants a `downloads` capability that shows the
 *     viewer a confirmation and writes the file for real.
 *  2. Anywhere else (local dev, GitHub Pages, a plain static host) the
 *     ordinary object-URL anchor works fine.
 *
 * `saveFile` tries the capability first and falls back, so callers never have
 * to care which one they are in.
 */

let capabilityPromise;

function getCapability() {
  if (capabilityPromise === undefined) {
    const use = globalThis.claude?.use;
    capabilityPromise = typeof use === 'function'
      ? Promise.resolve(use.call(globalThis.claude, 'downloads')).catch(() => null)
      : Promise.resolve(null);
  }
  return capabilityPromise;
}

/** True when the host will actually write files for us. */
export async function downloadsAvailable() {
  return Boolean(await getCapability());
}

/**
 * @param {object} file
 * @param {string} file.filename  suggested name, extension required
 * @param {Uint8Array|Blob|string} file.data
 * @param {string} [file.mime]
 * @returns {Promise<{status: 'saved'|'declined'|'failed', reason?: string}>}
 */
export async function saveFile({ filename, data, mime = 'application/octet-stream' }) {
  const downloads = await getCapability();

  // When the host owns saving, it owns the outcome too. Falling back to an
  // anchor here would be worse than useless: the same sandbox that provides
  // this capability blocks anchor downloads silently, so the fallback would
  // "succeed" without writing anything.
  if (downloads?.save) {
    try {
      const payload = data instanceof Blob ? data : new Blob([data], { type: mime });
      await downloads.save({ filename, data: payload });
      return { status: 'saved' };
    } catch (error) {
      if (error?.code === 'declined') return { status: 'declined' };
      if (error?.code === 'rate_limited') {
        return { status: 'failed', reason: 'A save prompt is already open — finish that one first.' };
      }
      return { status: 'failed', reason: error?.message ?? 'The host could not save that file.' };
    }
  }

  try {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return { status: 'saved' };
  } catch (error) {
    return { status: 'failed', reason: error?.message ?? 'Download blocked by the browser.' };
  }
}

/** Read a picked file as a data: URI, with a size guard. */
export function readFileAsDataUrl(file, maxBytes) {
  return new Promise((resolve, reject) => {
    if (maxBytes && file.size > maxBytes) {
      reject(new Error(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is ${(maxBytes / 1024 / 1024).toFixed(0)} MB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });
}
