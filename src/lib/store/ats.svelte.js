/**
 * The application store.
 *
 * One reactive object holds the whole pipeline; every mutation goes through a
 * named action so that (a) the activity log always gets written and (b) the
 * persistence call happens in exactly one place per entity.
 */
import { createDefaultAdapter } from './adapters.js';
import { buildSeedState, SEED_VERSION } from '../data/seed.js';
import { STAGE_IDS, STAGE_BY_ID, candidateRating, stageIndex } from './schema.js';

const now = () => new Date().toISOString();
let idCounter = 0;
const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;

/** `Amira Haddad` -> `amira-haddad`, deduped against existing ids. */
function slugify(name, taken = new Set()) {
  const base =
    String(name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'candidate';
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export function createAtsStore(adapter = createDefaultAdapter()) {
  let candidates = $state([]);
  let jobs = $state([]);
  let company = $state(null);
  let meta = $state({});
  let ready = $state(false);
  let notice = $state(null);

  /** Persist one candidate; surfaces storage failures without losing the edit. */
  async function persist(candidate) {
    try {
      await adapter.putCandidate($state.snapshot(candidate));
    } catch (err) {
      notice = { tone: 'error', message: err.message };
    }
  }

  function find(id) {
    return candidates.find((c) => c.id === id) ?? null;
  }

  /** Append to a candidate's audit trail. Every mutation funnels through here. */
  function log(candidate, event) {
    const entry = {
      id: newId('ev'),
      at: now(),
      actor: meta.currentUser?.name ?? 'Talal',
      ...event
    };
    candidate.activity = [...(candidate.activity ?? []), entry];
    candidate.lastActivityAt = entry.at;
    return entry;
  }

  function hydrate(state) {
    candidates = state.candidates ?? [];
    jobs = state.jobs ?? [];
    company = state.company ?? null;
    meta = state.meta ?? {};
  }

  return {
    // ---- reactive reads -------------------------------------------------
    get candidates() {
      return candidates;
    },
    get jobs() {
      return jobs;
    },
    get company() {
      return company;
    },
    get meta() {
      return meta;
    },
    get ready() {
      return ready;
    },
    get notice() {
      return notice;
    },
    set notice(value) {
      notice = value;
    },
    get storage() {
      return { id: adapter.id, label: adapter.label, description: adapter.description, persistent: adapter.persistent };
    },

    // ---- selectors ------------------------------------------------------
    candidate: find,
    job: (id) => jobs.find((j) => j.id === id) ?? null,
    jobTitle(id) {
      return jobs.find((j) => j.id === id)?.title ?? 'Unassigned';
    },
    inStage(stage) {
      return candidates.filter((c) => c.stage === stage);
    },
    get unreadCount() {
      return candidates.filter((c) => c.unread).length;
    },
    get activeCount() {
      return candidates.filter((c) => !STAGE_BY_ID[c.stage]?.terminal).length;
    },
    rating: candidateRating,

    /** Funnel counts plus conversion between consecutive stages. */
    get funnel() {
      return STAGE_IDS.filter((id) => !STAGE_BY_ID[id].terminal).map((id, i, arr) => {
        // "Reached this stage" = currently here, or further along, or hired.
        const reached = candidates.filter((c) => {
          if (c.stage === 'hired') return true;
          if (c.stage === 'rejected') {
            const deepest = (c.activity ?? [])
              .filter((e) => e.type === 'stage')
              .map((e) => stageIndex(e.meta?.to))
              .reduce((a, b) => Math.max(a, b), 0);
            return deepest >= stageIndex(id);
          }
          return stageIndex(c.stage) >= stageIndex(id);
        }).length;
        return { stage: STAGE_BY_ID[id], reached, isLast: i === arr.length - 1 };
      });
    },

    get sourceBreakdown() {
      const counts = new Map();
      for (const c of candidates) counts.set(c.source, (counts.get(c.source) ?? 0) + 1);
      return [...counts.entries()]
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);
    },

    /** Days the candidate has been sitting in their current stage. */
    daysInStage(candidate) {
      const from = candidate.stageEnteredAt ?? candidate.appliedAt;
      const ms = Date.now() - new Date(from).getTime();
      return Math.max(0, Math.floor(ms / 86_400_000));
    },

    // ---- lifecycle ------------------------------------------------------
    async init() {
      let stored = null;
      try {
        stored = await adapter.load();
      } catch {
        stored = null;
      }
      if (!stored || stored.meta?.seedVersion !== SEED_VERSION) {
        const seed = buildSeedState();
        hydrate(seed);
        try {
          await adapter.replaceAll($state.snapshot(seed));
        } catch {
          /* demo still works in memory */
        }
      } else {
        hydrate(stored);
      }
      ready = true;

      // Another tab changed something — pick it up.
      return adapter.subscribe?.((next) => {
        if (next) hydrate(next);
      });
    },

    async resetDemo() {
      const seed = buildSeedState();
      hydrate(seed);
      await adapter.replaceAll($state.snapshot(seed));
      notice = { tone: 'success', message: 'Demo data reset.' };
    },

    // ---- mutations ------------------------------------------------------

    /** Candidate-portal submission. Returns the created record. */
    async submitApplication(input) {
      const taken = new Set(candidates.map((c) => c.id));
      const name = `${input.firstName} ${input.lastName}`.trim();
      const id = slugify(name, taken);
      const at = now();
      const candidate = {
        id,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        name,
        headline: input.headline?.trim() || 'New applicant',
        email: input.email.trim(),
        phone: input.phone?.trim() || '',
        location: input.location?.trim() || '',
        pronouns: input.pronouns?.trim() || '',
        jobId: input.jobId,
        stage: 'inbox',
        source: 'Careers site',
        appliedAt: at.slice(0, 10),
        starred: false,
        unread: true,
        seeded: false,
        tags: [],
        links: input.links ?? {},
        summary: input.summary?.trim() || '',
        coverLetter: input.coverLetter?.trim() || '',
        salaryExpectation: input.salaryExpectation?.trim() || '',
        noticePeriod: input.noticePeriod?.trim() || '',
        workPermit: input.workPermit?.trim() || '',
        skills: input.skills ?? [],
        languages: [],
        experience: [],
        education: [],
        scorecards: [],
        notes: [],
        photo: input.photo ?? null,
        cv: input.cv ?? { kind: 'generated', filename: null, uploadedAt: at },
        reference: `HEL-${at.slice(0, 4)}-${String(Math.floor(1000 + Math.random() * 8999))}`,
        stageEnteredAt: at,
        lastActivityAt: at,
        activity: []
      };

      log(candidate, {
        type: 'applied',
        actor: name,
        at,
        title: `Applied for ${this.jobTitle(input.jobId)}`,
        detail: 'Source: Careers site'
      });
      if (input.cv?.kind === 'upload') {
        log(candidate, {
          type: 'attachment',
          actor: name,
          at,
          title: 'CV uploaded',
          detail: input.cv.filename
        });
      }
      if (input.photo) {
        log(candidate, { type: 'attachment', actor: name, at, title: 'Photo uploaded' });
      }

      candidates = [candidate, ...candidates];
      await persist(candidate);
      return candidate;
    },

    async moveStage(id, stage, { reason } = {}) {
      const candidate = find(id);
      if (!candidate || candidate.stage === stage) return;
      const from = candidate.stage;
      candidate.stage = stage;
      candidate.stageEnteredAt = now();
      candidate.unread = false;
      if (stage === 'rejected') {
        candidate.rejectionReason = reason ?? 'Stronger candidates in process';
        log(candidate, { type: 'rejected', title: 'Rejected', detail: candidate.rejectionReason });
      } else if (stage === 'hired') {
        log(candidate, { type: 'hired', title: 'Offer accepted' });
      } else {
        log(candidate, {
          type: 'stage',
          title: `Moved to ${STAGE_BY_ID[stage].label}`,
          detail: `From ${STAGE_BY_ID[from]?.label ?? from}`,
          meta: { to: stage, from }
        });
      }
      await persist(candidate);
    },

    async bulkMove(ids, stage, options) {
      for (const id of ids) await this.moveStage(id, stage, options);
      notice = {
        tone: 'success',
        message: `${ids.length} candidate${ids.length === 1 ? '' : 's'} moved to ${STAGE_BY_ID[stage].label}.`
      };
    },

    async addNote(id, body) {
      const candidate = find(id);
      if (!candidate || !body.trim()) return;
      const note = {
        id: newId('n'),
        author: meta.currentUser?.name ?? 'Talal',
        at: now(),
        body: body.trim()
      };
      candidate.notes = [...(candidate.notes ?? []), note];
      log(candidate, { type: 'note', title: 'Note added', detail: note.body, meta: { noteId: note.id } });
      await persist(candidate);
      return note;
    },

    async addScorecard(id, { stage, criteria, comment }) {
      const candidate = find(id);
      if (!candidate) return;
      const card = {
        id: newId('sc'),
        author: meta.currentUser?.name ?? 'Talal',
        stage: stage ?? candidate.stage,
        date: now().slice(0, 10),
        criteria,
        comment: comment?.trim() ?? ''
      };
      candidate.scorecards = [...(candidate.scorecards ?? []), card];
      log(candidate, {
        type: 'scorecard',
        title: `Scorecard — ${STAGE_BY_ID[card.stage]?.label ?? card.stage}`,
        detail: card.comment,
        meta: { scorecardId: card.id }
      });
      await persist(candidate);
      return card;
    },

    async logEmail(id, { subject, body, template }) {
      const candidate = find(id);
      if (!candidate) return;
      log(candidate, {
        type: 'email',
        title: `Email sent — ${subject}`,
        detail: body,
        meta: { template }
      });
      await persist(candidate);
    },

    async toggleStar(id) {
      const candidate = find(id);
      if (!candidate) return;
      candidate.starred = !candidate.starred;
      await persist(candidate);
    },

    async markRead(id, value = true) {
      const candidate = find(id);
      if (!candidate || candidate.unread === !value) return;
      candidate.unread = !value;
      await persist(candidate);
    },

    async setTags(id, tags) {
      const candidate = find(id);
      if (!candidate) return;
      candidate.tags = tags;
      await persist(candidate);
    },

    async removeCandidate(id) {
      candidates = candidates.filter((c) => c.id !== id);
      await adapter.removeCandidate(id);
      notice = { tone: 'success', message: 'Candidate deleted.' };
    },

    /** Everything the workspace holds, for the GDPR-style export button. */
    exportJson() {
      return JSON.stringify(
        {
          exportedAt: now(),
          company: $state.snapshot(company),
          jobs: $state.snapshot(jobs),
          candidates: $state.snapshot(candidates)
        },
        null,
        2
      );
    }
  };
}

/** The instance the app uses. Tests and future backends build their own. */
export const ats = createAtsStore();
