/**
 * Domain vocabulary for the ATS.
 *
 * Kept free of UI concerns so the same definitions can back a server
 * implementation later — the storage adapters validate against these.
 */

/** Ordered pipeline. `terminal` stages sit outside the funnel. */
export const STAGES = [
  { id: 'inbox', label: 'Inbox', short: 'New', hint: 'Applied, not yet reviewed', tone: 'slate' },
  { id: 'screening', label: 'Screening', short: 'Screen', hint: 'CV reviewed, intro call booked', tone: 'sky' },
  { id: 'interview', label: 'Interview', short: 'Interview', hint: 'Meeting the hiring team', tone: 'violet' },
  { id: 'case', label: 'Case study', short: 'Case', hint: 'Working session or take-home', tone: 'amber' },
  { id: 'offer', label: 'Offer', short: 'Offer', hint: 'Terms out, awaiting signature', tone: 'emerald' },
  { id: 'hired', label: 'Hired', short: 'Hired', hint: 'Signed and starting', tone: 'green', terminal: true },
  { id: 'rejected', label: 'Rejected', short: 'Rejected', hint: 'Not moving forward', tone: 'rose', terminal: true }
];

export const STAGE_IDS = STAGES.map((s) => s.id);
export const ACTIVE_STAGE_IDS = STAGES.filter((s) => !s.terminal).map((s) => s.id);
/** @type {Record<string, typeof STAGES[number]>} */
export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s]));

export function stageIndex(id) {
  return STAGE_IDS.indexOf(id);
}

/** Where the application came from — drives the source analytics. */
export const SOURCES = [
  'Careers site',
  'LinkedIn',
  'Referral',
  'Sourced',
  'Job board',
  'Event'
];

/** Structured interview criteria. Scorecards average over these. */
export const SCORECARD_CRITERIA = [
  { id: 'craft', label: 'Role craft', hint: 'Depth in the core skill of the role' },
  { id: 'problem', label: 'Problem solving', hint: 'How they break down the unfamiliar' },
  { id: 'communication', label: 'Communication', hint: 'Clarity, listening, disagreement' },
  { id: 'ownership', label: 'Ownership', hint: 'Follows through past the interesting part' },
  { id: 'collaboration', label: 'Collaboration', hint: 'Makes the people around them better' }
];

export const RATING_LABELS = {
  1: 'Strong no',
  2: 'No',
  3: 'Mixed',
  4: 'Yes',
  5: 'Strong yes'
};

/** Reasons offered when rejecting — kept short so the stats stay useful. */
export const REJECTION_REASONS = [
  'Experience not a match',
  'Stronger candidates in process',
  'Compensation mismatch',
  'Location / work permit',
  'Withdrew',
  'Timing — revisit later'
];

export const ACTIVITY_TYPES = {
  applied: { label: 'Applied', icon: 'inbox' },
  stage: { label: 'Stage change', icon: 'arrow' },
  note: { label: 'Note', icon: 'note' },
  scorecard: { label: 'Scorecard', icon: 'star' },
  email: { label: 'Email', icon: 'mail' },
  rejected: { label: 'Rejected', icon: 'x' },
  hired: { label: 'Hired', icon: 'check' },
  attachment: { label: 'Attachment', icon: 'paperclip' }
};

/** Average of the filled-in criteria, or null when a scorecard is blank. */
export function scorecardAverage(scorecard) {
  if (!scorecard?.criteria) return null;
  const values = SCORECARD_CRITERIA.map((c) => scorecard.criteria[c.id]).filter(
    (v) => typeof v === 'number' && v > 0
  );
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Mean scorecard rating across every review on a candidate. */
export function candidateRating(candidate) {
  const averages = (candidate?.scorecards ?? []).map(scorecardAverage).filter((v) => v != null);
  if (!averages.length) return null;
  return averages.reduce((a, b) => a + b, 0) / averages.length;
}

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const ACCEPTED_CV_TYPES = ['application/pdf'];
export const ACCEPTED_PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
