/**
 * Builds the initial dataset.
 *
 * Personas carry the facts (who they are, what stage they reached, who said
 * what about them). The activity timeline is *derived* from those facts here,
 * so the seed stays readable and every candidate gets a plausible, internally
 * consistent history. Once seeded the log is append-only — the app adds to it,
 * this file never runs again unless the demo is reset.
 */
import { PERSONAS } from './personas.js';
import { JOBS, JOBS_BY_ID, COMPANY } from './jobs.js';
import { STAGE_IDS, STAGE_BY_ID, stageIndex } from '../store/schema.js';

export const SEED_VERSION = 3;

let counter = 0;
const uid = (prefix) => `${prefix}-${(counter++).toString(36)}`;

/** Deterministic pseudo-random in [0,1) so the demo looks the same every time. */
function hashed(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const addDays = (iso, days) => {
  const d = new Date(`${iso.slice(0, 10)}T09:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
};

/**
 * Reconstruct a plausible timeline: applied, then one stage transition per
 * stage actually reached, interleaved with the scorecards and notes that
 * belong to those stages.
 */
function buildActivity(person) {
  /** @type {{id:string,type:string,at:string,actor:string,title:string,detail?:string,meta?:object}[]} */
  const events = [];
  const applied = addDays(person.appliedAt, 0);

  events.push({
    id: uid('ev'),
    type: 'applied',
    at: applied,
    actor: `${person.firstName} ${person.lastName}`,
    title: `Applied for ${JOBS_BY_ID[person.jobId]?.title ?? 'a role'}`,
    detail: `Source: ${person.source}${person.referredBy ? ` — referred by ${person.referredBy}` : ''}`
  });

  events.push({
    id: uid('ev'),
    type: 'attachment',
    at: applied,
    actor: `${person.firstName} ${person.lastName}`,
    title: 'CV attached',
    detail: 'cv.pdf'
  });

  const reached =
    person.stage === 'rejected' || person.stage === 'hired'
      ? STAGE_IDS.slice(1, stageIndex(furthestNonTerminal(person)) + 1)
      : STAGE_IDS.slice(1, stageIndex(person.stage) + 1);

  const cards = person.scorecards ?? [];

  // Walk the funnel forwards, keeping each move strictly before the scorecard
  // written at that stage — a review cannot predate the interview it reviews.
  let last = applied;
  for (const stage of reached) {
    const ownCard = cards.find((c) => c.stage === stage);
    let at = addDays(last, 2 + Math.round(hashed(person.id + stage) * 3));
    if (ownCard && at >= addDays(ownCard.date, 0)) at = addDays(ownCard.date, -1);
    if (at <= last) at = addDays(last, 1);

    events.push({
      id: uid('ev'),
      type: 'stage',
      at,
      actor: stage === 'screening' ? 'Saga Wikström' : 'Talal',
      title: `Moved to ${STAGE_BY_ID[stage].label}`,
      meta: { to: stage }
    });
    last = ownCard ? addDays(ownCard.date, 0) : at;
  }

  for (const card of person.scorecards ?? []) {
    events.push({
      id: uid('ev'),
      type: 'scorecard',
      at: addDays(card.date, 0),
      actor: card.author,
      title: `Scorecard — ${STAGE_BY_ID[card.stage]?.label ?? card.stage}`,
      detail: card.comment,
      meta: { scorecardId: card.id }
    });
  }

  for (const note of person.notes ?? []) {
    events.push({
      id: uid('ev'),
      type: 'note',
      at: note.at,
      actor: note.author,
      title: 'Note added',
      detail: note.body,
      meta: { noteId: note.id }
    });
  }

  if (person.stage === 'rejected') {
    events.push({
      id: uid('ev'),
      type: 'rejected',
      at: addDays(last, 3),
      actor: 'Talal',
      title: 'Rejected',
      detail: person.rejectionReason
    });
  }

  if (person.stage === 'hired') {
    events.push({
      id: uid('ev'),
      type: 'hired',
      at: addDays(last, 5),
      actor: 'Talal',
      title: 'Offer accepted',
      detail: person.startDate ? `Starting ${person.startDate}` : undefined
    });
  }

  return events.sort((a, b) => a.at.localeCompare(b.at));
}

/** How far a now-terminal candidate got before hire/rejection. */
function furthestNonTerminal(person) {
  if (person.stage === 'hired') return 'offer';
  const lastCard = (person.scorecards ?? []).at(-1);
  return lastCard?.stage ?? 'screening';
}

/** Turn a persona into the record shape the app works with. */
function toCandidate(person) {
  const activity = buildActivity(person);
  return {
    ...person,
    name: `${person.firstName} ${person.lastName}`,
    seeded: true,
    photo: null, // seeded candidates render from the bundled avatar set
    cv: { kind: 'generated', filename: null, uploadedAt: person.appliedAt },
    activity,
    lastActivityAt: activity.at(-1)?.at ?? addDays(person.appliedAt, 0),
    stageEnteredAt: activity.filter((e) => e.type === 'stage').at(-1)?.at ?? addDays(person.appliedAt, 0),
    reference: `HEL-${person.appliedAt.slice(0, 4)}-${String(
      1000 + Math.round(hashed(person.id) * 8999)
    )}`
  };
}

export function buildSeedState() {
  counter = 0;
  return {
    company: COMPANY,
    jobs: JOBS.map((job) => ({ ...job })),
    candidates: PERSONAS.map(toCandidate),
    meta: {
      seedVersion: SEED_VERSION,
      seededAt: new Date().toISOString(),
      currentUser: { name: 'Talal', role: 'Hiring manager', initials: 'T' }
    }
  };
}
