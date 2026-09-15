<script>
  /**
   * One candidate, everything about them.
   *
   * Tabs cover the CV, structured scorecards, the audit trail and notes; the
   * rail holds the actions that change state. Every action writes to the
   * timeline, which is the record the team argues from later.
   */
  import { ats } from '../lib/store/ats.svelte.js';
  import {
    STAGES,
    STAGE_BY_ID,
    SCORECARD_CRITERIA,
    RATING_LABELS,
    REJECTION_REASONS,
    ACTIVITY_TYPES,
    scorecardAverage
  } from '../lib/store/schema.js';
  import { formatDate, formatDateTime, relativeTime, pluralise } from '../lib/format.js';
  import { downloadCandidateCv } from '../lib/cv-download.js';
  import { templatesForStage, renderTemplate, templateContext } from '../lib/email/templates.js';
  import Avatar from '../components/Avatar.svelte';
  import StageBadge from '../components/StageBadge.svelte';
  import Rating from '../components/Rating.svelte';
  import Icon from '../components/Icon.svelte';
  import Modal from '../components/Modal.svelte';
  import CvDocument from '../components/CvDocument.svelte';
  import NotFound from './NotFound.svelte';
  import { toast } from '../components/Toasts.svelte';

  let { params } = $props();

  const candidate = $derived(ats.candidate(params.id));
  const job = $derived(candidate ? ats.job(candidate.jobId) : null);
  const rating = $derived(candidate ? ats.rating(candidate) : null);

  let tab = $state('cv');
  let noteDraft = $state('');
  let downloading = $state(false);

  // Scorecard composer
  let scoring = $state(false);
  let scores = $state({});
  let scoreComment = $state('');

  // Email composer
  let emailing = $state(false);
  let templateId = $state('acknowledge');
  let subject = $state('');
  let body = $state('');

  // Rejection
  let rejecting = $state(false);
  let rejectReason = $state(REJECTION_REASONS[1]);

  // Opening a candidate from the inbox is what marks them read.
  $effect(() => {
    if (candidate?.unread) ats.markRead(candidate.id);
  });

  const timeline = $derived(
    [...(candidate?.activity ?? [])].sort((a, b) => b.at.localeCompare(a.at))
  );

  const context = $derived(
    candidate
      ? templateContext(candidate, {
          jobTitle: ats.jobTitle(candidate.jobId),
          company: ats.company?.name ?? 'Helio',
          recruiter: ats.meta.currentUser?.name ?? 'Talal',
          stageLabel: STAGE_BY_ID[candidate.stage]?.label ?? ''
        })
      : {}
  );

  function openEmail() {
    const list = templatesForStage(candidate.stage);
    applyTemplate(list[0].id);
    emailing = true;
  }

  function applyTemplate(id) {
    const template = templatesForStage(candidate.stage).find((t) => t.id === id);
    if (!template) return;
    templateId = id;
    subject = renderTemplate(template.subject, context);
    body = renderTemplate(template.body, context);
  }

  async function sendEmail() {
    await ats.logEmail(candidate.id, { subject, body, template: templateId });
    emailing = false;
    toast(`Email logged to ${candidate.email}. (Nothing was actually sent — this is a demo.)`);
  }

  function openScorecard() {
    scores = Object.fromEntries(SCORECARD_CRITERIA.map((c) => [c.id, 0]));
    scoreComment = '';
    scoring = true;
  }

  async function saveScorecard() {
    await ats.addScorecard(candidate.id, {
      stage: candidate.stage,
      criteria: { ...scores },
      comment: scoreComment
    });
    scoring = false;
    tab = 'scorecards';
    toast('Scorecard saved.', { tone: 'success' });
  }

  async function addNote() {
    if (!noteDraft.trim()) return;
    await ats.addNote(candidate.id, noteDraft);
    noteDraft = '';
    toast('Note added.', { tone: 'success' });
  }

  async function download() {
    downloading = true;
    try {
      const result = await downloadCandidateCv(candidate);
      if (result.status === 'saved') toast('CV downloaded.', { tone: 'success' });
      else if (result.status === 'declined') toast('Download cancelled.');
      else toast(result.reason ?? 'Could not save the file.', { tone: 'error' });
    } catch (error) {
      toast(`Could not build the CV: ${error.message}`, { tone: 'error' });
    } finally {
      downloading = false;
    }
  }

  async function confirmReject() {
    await ats.moveStage(candidate.id, 'rejected', { reason: rejectReason });
    rejecting = false;
  }

  const draftAverage = $derived.by(() => {
    const values = Object.values(scores).filter((v) => v > 0);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  });

  const TABS = [
    { id: 'cv', label: 'CV' },
    { id: 'application', label: 'Application' },
    { id: 'scorecards', label: 'Scorecards' },
    { id: 'activity', label: 'Activity' },
    { id: 'notes', label: 'Notes' }
  ];
</script>

{#if !candidate}
  <NotFound />
{:else}
  <div class="detail">
    <header class="hero">
      <a class="back" href="#/inbox"><Icon name="arrowLeft" size={14} /> Inbox</a>

      <div class="identity">
        <Avatar {candidate} size={66} ring />
        <div class="names">
          <h1>{candidate.name}</h1>
          <p class="headline">{candidate.headline}</p>
          <div class="meta">
            <StageBadge stage={candidate.stage} />
            <span class="sep">·</span>
            <a href="#/jobs">{ats.jobTitle(candidate.jobId)}</a>
            <span class="sep">·</span>
            <span>{pluralise(ats.daysInStage(candidate), 'day')} in stage</span>
            {#if rating != null}
              <span class="sep">·</span>
              <Rating value={rating} size={13} showNumber />
            {/if}
          </div>
        </div>

        <div class="hero-actions">
          <button
            class="btn btn--sm"
            type="button"
            onclick={() => ats.toggleStar(candidate.id)}
            aria-pressed={candidate.starred}
          >
            <Icon name="star" size={14} filled={candidate.starred} />
            {candidate.starred ? 'Starred' : 'Star'}
          </button>
          <button class="btn btn--sm" type="button" onclick={openEmail}>
            <Icon name="mail" size={14} /> Email
          </button>
          <button class="btn btn--primary btn--sm" type="button" onclick={download} disabled={downloading}>
            <Icon name="download" size={14} />
            {downloading ? 'Building…' : 'Download CV'}
          </button>
        </div>
      </div>
    </header>

    <div class="body">
      <main class="main">
        <div class="tabs" role="tablist" aria-label="Candidate sections">
          {#each TABS as item (item.id)}
            {@const n =
              item.id === 'scorecards'
                ? candidate.scorecards?.length
                : item.id === 'notes'
                  ? candidate.notes?.length
                  : item.id === 'activity'
                    ? timeline.length
                    : 0}
            <button
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              class="tab"
              class:on={tab === item.id}
              onclick={() => (tab = item.id)}
            >
              {item.label}{#if n}<span class="tab-n numeric">{n}</span>{/if}
            </button>
          {/each}
        </div>

        {#if tab === 'cv'}
          {#if candidate.cv?.kind === 'upload'}
            <div class="attachment">
              <span class="attachment-icon"><Icon name="file" size={18} /></span>
              <div>
                <strong>{candidate.cv.filename}</strong>
                <span>Uploaded {formatDate(candidate.cv.uploadedAt)} · the applicant's own file</span>
              </div>
              <button class="btn btn--sm" type="button" onclick={download}>
                <Icon name="download" size={14} /> Download
              </button>
            </div>
          {/if}
          {#if candidate.experience?.length || candidate.summary}
            <CvDocument {candidate} />
          {:else}
            <p class="thin">
              This applicant submitted a PDF rather than a structured profile. Download it above to
              read it.
            </p>
          {/if}
        {:else if tab === 'application'}
          <div class="panels">
            {#if candidate.coverLetter}
              <section class="card pad">
                <h2>Cover note</h2>
                <p class="letter">{candidate.coverLetter}</p>
              </section>
            {/if}
            <section class="card pad">
              <h2>Application details</h2>
              <dl class="pairs">
                <div><dt>Applied for</dt><dd>{ats.jobTitle(candidate.jobId)}</dd></div>
                <div><dt>Applied on</dt><dd>{formatDate(candidate.appliedAt)}</dd></div>
                <div><dt>Source</dt><dd>{candidate.source}</dd></div>
                {#if candidate.referredBy}
                  <div><dt>Referred by</dt><dd>{candidate.referredBy}</dd></div>
                {/if}
                <div><dt>Reference</dt><dd class="numeric">{candidate.reference}</dd></div>
                {#if candidate.pronouns}<div><dt>Pronouns</dt><dd>{candidate.pronouns}</dd></div>{/if}
              </dl>
            </section>
          </div>
        {:else if tab === 'scorecards'}
          <div class="stack">
            <div class="stack-head">
              <p class="thin">
                Structured reviews across {SCORECARD_CRITERIA.length} criteria. The candidate's overall
                score is the mean of every scorecard.
              </p>
              <button class="btn btn--sm btn--primary" type="button" onclick={openScorecard}>
                <Icon name="plus" size={14} /> Add scorecard
              </button>
            </div>

            {#each [...(candidate.scorecards ?? [])].reverse() as card (card.id)}
              {@const avg = scorecardAverage(card)}
              <article class="card pad scorecard">
                <header>
                  <div>
                    <strong>{card.author}</strong>
                    <span class="thin">
                      {STAGE_BY_ID[card.stage]?.label ?? card.stage} · {formatDate(card.date)}
                    </span>
                  </div>
                  <span class="verdict" data-strong={avg >= 4}>
                    <Rating value={avg} size={13} />
                    <strong class="numeric">{avg?.toFixed(1)}</strong>
                  </span>
                </header>
                <ul class="criteria">
                  {#each SCORECARD_CRITERIA as criterion (criterion.id)}
                    {@const value = card.criteria?.[criterion.id]}
                    <li>
                      <span>{criterion.label}</span>
                      <span class="bar" aria-hidden="true">
                        <span style="inline-size: {((value ?? 0) / 5) * 100}%"></span>
                      </span>
                      <span class="value numeric" title={RATING_LABELS[value]}>{value ?? '—'}</span>
                    </li>
                  {/each}
                </ul>
                {#if card.comment}<p class="comment">{card.comment}</p>{/if}
              </article>
            {:else}
              <p class="thin empty">No scorecards yet. Add one after the next conversation.</p>
            {/each}
          </div>
        {:else if tab === 'activity'}
          <ol class="timeline">
            {#each timeline as event (event.id)}
              <li>
                <span class="tl-dot" data-type={event.type}>
                  <Icon name={ACTIVITY_TYPES[event.type]?.icon ?? 'note'} size={12} />
                </span>
                <div class="tl-body">
                  <div class="tl-head">
                    <strong>{event.title}</strong>
                    <time datetime={event.at} title={formatDateTime(event.at)}>{relativeTime(event.at)}</time>
                  </div>
                  <p class="tl-actor">{event.actor}</p>
                  {#if event.detail}<p class="tl-detail">{event.detail}</p>{/if}
                </div>
              </li>
            {/each}
          </ol>
        {:else if tab === 'notes'}
          <div class="stack">
            <form
              class="card pad note-form"
              onsubmit={(e) => {
                e.preventDefault();
                addNote();
              }}
            >
              <label class="field-label" for="note">Add a note</label>
              <textarea
                id="note"
                class="textarea"
                bind:value={noteDraft}
                rows="3"
                placeholder="What did you learn? What should the next person know?"
              ></textarea>
              <div class="note-actions">
                <span class="thin">Notes are visible to everyone on the hiring team.</span>
                <button class="btn btn--sm btn--primary" type="submit" disabled={!noteDraft.trim()}>
                  Save note
                </button>
              </div>
            </form>

            {#each [...(candidate.notes ?? [])].reverse() as note (note.id)}
              <article class="card pad note">
                <header>
                  <strong>{note.author}</strong>
                  <time datetime={note.at}>{relativeTime(note.at)}</time>
                </header>
                <p>{note.body}</p>
              </article>
            {:else}
              <p class="thin empty">No notes yet.</p>
            {/each}
          </div>
        {/if}
      </main>

      <aside class="rail">
        <section class="card pad">
          <h2>Move to stage</h2>
          <ol class="stepper">
            {#each STAGES.filter((s) => !s.terminal) as stage (stage.id)}
              {@const active = stage.id === candidate.stage}
              <li>
                <button
                  type="button"
                  class="step"
                  class:on={active}
                  style="--tone: var(--tone-{stage.tone}); --wash: var(--tone-{stage.tone}-wash);"
                  aria-current={active ? 'step' : undefined}
                  onclick={() => ats.moveStage(candidate.id, stage.id)}
                >
                  <span class="step-dot"></span>
                  <span class="step-label">{stage.label}</span>
                  {#if active}<Icon name="check" size={13} />{/if}
                </button>
              </li>
            {/each}
          </ol>
          <div class="terminal-actions">
            <button
              class="btn btn--sm"
              type="button"
              onclick={() => ats.moveStage(candidate.id, 'hired')}
              disabled={candidate.stage === 'hired'}
            >
              <Icon name="check" size={14} /> Mark hired
            </button>
            <button
              class="btn btn--sm btn--danger"
              type="button"
              onclick={() => (rejecting = true)}
              disabled={candidate.stage === 'rejected'}
            >
              <Icon name="x" size={14} /> Reject
            </button>
          </div>
          {#if candidate.stage === 'rejected' && candidate.rejectionReason}
            <p class="thin reason">Reason: {candidate.rejectionReason}</p>
          {/if}
        </section>

        <section class="card pad">
          <h2>Contact</h2>
          <ul class="contact">
            <li>
              <Icon name="mail" size={14} />
              <a href="mailto:{candidate.email}">{candidate.email}</a>
            </li>
            {#if candidate.phone}
              <li><Icon name="phone" size={14} /><a href="tel:{candidate.phone}">{candidate.phone}</a></li>
            {/if}
            {#if candidate.location}
              <li><Icon name="location" size={14} /><span>{candidate.location}</span></li>
            {/if}
            {#each Object.entries(candidate.links ?? {}).filter(([, v]) => v) as [key, value] (key)}
              <li>
                <Icon name="link" size={14} />
                <a href={'https://' + String(value).replace(/^https?:\/\//, '')} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              </li>
            {/each}
          </ul>
        </section>

        <section class="card pad">
          <h2>Practicalities</h2>
          <dl class="pairs tight">
            {#each [['Salary expectation', candidate.salaryExpectation], ['Notice period', candidate.noticePeriod], ['Work permit', candidate.workPermit]] as [label, value] (label)}
              {#if value}<div><dt>{label}</dt><dd>{value}</dd></div>{/if}
            {/each}
          </dl>
          {#if job}
            <p class="thin budget">Budget for this role: {job.salary}</p>
          {/if}
        </section>

        {#if candidate.tags?.length}
          <section class="card pad">
            <h2>Tags</h2>
            <ul class="taglist">
              {#each candidate.tags as tag (tag)}<li class="chip">{tag}</li>{/each}
            </ul>
          </section>
        {/if}
      </aside>
    </div>
  </div>

  <!-- Scorecard composer -->
  <Modal
    open={scoring}
    title="Scorecard — {STAGE_BY_ID[candidate.stage]?.label}"
    subtitle="Score what you actually observed. Leave anything you did not assess at zero."
    onclose={() => (scoring = false)}
    width="520px"
  >
    <ul class="score-form">
      {#each SCORECARD_CRITERIA as criterion (criterion.id)}
        <li>
          <div>
            <strong>{criterion.label}</strong>
            <span class="thin">{criterion.hint}</span>
          </div>
          <Rating
            value={scores[criterion.id]}
            name={criterion.label}
            size={19}
            onchange={(v) => (scores = { ...scores, [criterion.id]: v })}
          />
        </li>
      {/each}
    </ul>
    <div class="field score-comment">
      <label for="score-comment">Comment</label>
      <textarea
        id="score-comment"
        class="textarea"
        bind:value={scoreComment}
        rows="3"
        placeholder="The specific thing that moved your score."
      ></textarea>
    </div>
    {#snippet footer()}
      <span class="draft-avg thin">
        {draftAverage ? `Average ${draftAverage.toFixed(1)} — ${RATING_LABELS[Math.round(draftAverage)]}` : 'Nothing scored yet'}
      </span>
      <button class="btn btn--sm" type="button" onclick={() => (scoring = false)}>Cancel</button>
      <button class="btn btn--sm btn--primary" type="button" onclick={saveScorecard} disabled={!draftAverage}>
        Save scorecard
      </button>
    {/snippet}
  </Modal>

  <!-- Email composer -->
  <Modal
    open={emailing}
    title="Email {candidate.firstName}"
    subtitle="Templates fill in from the candidate record. Nothing leaves the browser in this demo."
    onclose={() => (emailing = false)}
    width="620px"
  >
    <div class="field">
      <label for="template">Template</label>
      <select id="template" class="select" value={templateId} onchange={(e) => applyTemplate(e.currentTarget.value)}>
        {#each templatesForStage(candidate.stage) as template (template.id)}
          <option value={template.id}>{template.name}</option>
        {/each}
      </select>
    </div>
    <div class="field">
      <label for="email-to">To</label>
      <input id="email-to" class="input" value={candidate.email} readonly />
    </div>
    <div class="field">
      <label for="email-subject">Subject</label>
      <input id="email-subject" class="input" bind:value={subject} />
    </div>
    <div class="field">
      <label for="email-body">Message</label>
      <textarea id="email-body" class="textarea" bind:value={body} rows="12"></textarea>
    </div>
    {#snippet footer()}
      <button class="btn btn--sm" type="button" onclick={() => (emailing = false)}>Cancel</button>
      <button class="btn btn--sm btn--primary" type="button" onclick={sendEmail}>
        <Icon name="mail" size={14} /> Send and log
      </button>
    {/snippet}
  </Modal>

  <!-- Rejection -->
  <Modal
    open={rejecting}
    title="Reject {candidate.name}"
    subtitle="Recorded on the timeline and counted in the funnel."
    onclose={() => (rejecting = false)}
    width="440px"
  >
    <div class="field">
      <label for="reject-one">Reason</label>
      <select id="reject-one" class="select" bind:value={rejectReason}>
        {#each REJECTION_REASONS as reason (reason)}<option value={reason}>{reason}</option>{/each}
      </select>
    </div>
    {#snippet footer()}
      <button class="btn btn--sm" type="button" onclick={() => (rejecting = false)}>Cancel</button>
      <button class="btn btn--sm btn--danger" type="button" onclick={confirmReject}>Reject</button>
    {/snippet}
  </Modal>
{/if}

<style>
  .hero {
    padding: 16px clamp(16px, 3vw, 28px) 18px;
    border-block-end: 1px solid var(--line);
    background: var(--surface);
  }
  .back {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    color: var(--ink-3);
    text-decoration: none;
  }
  .back:hover {
    color: var(--brand);
  }
  .identity {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-block-start: 14px;
    flex-wrap: wrap;
  }
  .names {
    flex: 1;
    min-inline-size: 220px;
  }
  h1 {
    font-size: 24px;
  }
  .headline {
    margin-block-start: 3px;
    font-size: 13.5px;
    color: var(--ink-3);
  }
  .meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-block-start: 10px;
    font-size: 12.5px;
    color: var(--ink-3);
  }
  .sep {
    color: var(--line-strong);
  }
  .hero-actions {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
  }

  .body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 20px;
    padding: 18px clamp(16px, 3vw, 28px) 48px;
    align-items: start;
  }
  .main {
    min-inline-size: 0;
  }

  .tabs {
    display: flex;
    gap: 2px;
    margin-block-end: 16px;
    border-block-end: 1px solid var(--line);
    overflow-x: auto;
  }
  .tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 0;
    border-block-end: 2px solid transparent;
    background: none;
    color: var(--ink-3);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
  }
  .tab:hover {
    color: var(--ink);
  }
  .tab.on {
    color: var(--brand);
    border-block-end-color: var(--brand);
    font-weight: 600;
  }
  .tab-n {
    font-size: 10.5px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--surface-3);
    color: var(--ink-4);
  }

  .pad {
    padding: 16px 18px;
  }
  .card h2 {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-4);
    margin-block-end: 11px;
  }
  .thin {
    font-size: 12.5px;
    color: var(--ink-4);
    line-height: 1.5;
  }
  .empty {
    padding: 22px 2px;
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .stack-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }
  .stack-head .thin {
    max-inline-size: 52ch;
  }
  .panels {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .letter {
    font-size: 13.5px;
    line-height: 1.65;
    color: var(--ink-2);
    white-space: pre-wrap;
    max-inline-size: 66ch;
  }

  .attachment {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    margin-block-end: 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
  }
  .attachment-icon {
    display: grid;
    place-items: center;
    inline-size: 36px;
    block-size: 36px;
    border-radius: 8px;
    background: var(--brand-wash);
    color: var(--brand);
  }
  .attachment div {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }
  .attachment strong {
    font-size: 13px;
  }
  .attachment span {
    font-size: 11.5px;
    color: var(--ink-4);
  }

  .pairs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 13px;
    margin: 0;
  }
  .pairs.tight {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .pairs dt {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink-4);
  }
  .pairs dd {
    margin: 3px 0 0;
    font-size: 13px;
    color: var(--ink);
  }
  .budget {
    margin-block-start: 12px;
    padding-block-start: 10px;
    border-block-start: 1px solid var(--line);
  }

  .scorecard header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-block-end: 12px;
  }
  .scorecard header strong {
    font-size: 13.5px;
    display: block;
  }
  .verdict {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 3px 9px;
    border-radius: 999px;
    background: var(--surface-3);
  }
  .verdict[data-strong='true'] {
    background: var(--good-wash);
    color: var(--good);
  }
  .verdict strong {
    font-size: 13px;
  }
  .criteria {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .criteria li {
    display: grid;
    grid-template-columns: minmax(96px, 150px) 1fr 22px;
    align-items: center;
    gap: 10px;
    font-size: 12.5px;
    color: var(--ink-2);
  }
  .bar {
    block-size: 6px;
    border-radius: 3px;
    background: var(--surface-3);
    overflow: hidden;
  }
  .bar span {
    display: block;
    block-size: 100%;
    background: var(--brand);
    border-radius: 3px;
  }
  .value {
    text-align: end;
    font-weight: 600;
    color: var(--ink-3);
  }
  .comment {
    margin-block-start: 12px;
    padding-block-start: 11px;
    border-block-start: 1px solid var(--line);
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink-2);
  }

  .timeline {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .timeline li {
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr);
    gap: 12px;
    padding-block-end: 16px;
    position: relative;
  }
  .timeline li:not(:last-child)::before {
    content: '';
    position: absolute;
    inset-block: 26px 0;
    inset-inline-start: 12.5px;
    inline-size: 1px;
    background: var(--line);
  }
  .tl-dot {
    display: grid;
    place-items: center;
    inline-size: 26px;
    block-size: 26px;
    border-radius: 50%;
    background: var(--surface-3);
    color: var(--ink-3);
    z-index: 1;
  }
  .tl-dot[data-type='applied'],
  .tl-dot[data-type='hired'] {
    background: var(--good-wash);
    color: var(--good);
  }
  .tl-dot[data-type='rejected'] {
    background: var(--bad-wash);
    color: var(--bad);
  }
  .tl-dot[data-type='scorecard'] {
    background: var(--accent-wash);
    color: var(--accent);
  }
  .tl-dot[data-type='stage'] {
    background: var(--brand-wash);
    color: var(--brand);
  }
  .tl-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  .tl-head strong {
    font-size: 13.3px;
  }
  .tl-head time {
    font-size: 11.5px;
    color: var(--ink-4);
    white-space: nowrap;
  }
  .tl-actor {
    font-size: 11.5px;
    color: var(--ink-4);
  }
  .tl-detail {
    margin-block-start: 6px;
    padding: 9px 11px;
    border-radius: var(--radius-sm);
    background: var(--surface);
    border: 1px solid var(--line);
    font-size: 12.5px;
    line-height: 1.55;
    color: var(--ink-2);
    white-space: pre-wrap;
  }

  .note-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .note-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .note header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-block-end: 7px;
  }
  .note header strong {
    font-size: 13px;
  }
  .note header time {
    font-size: 11.5px;
    color: var(--ink-4);
  }
  .note p {
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink-2);
    white-space: pre-wrap;
  }

  .rail {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: sticky;
    top: calc(var(--header-h) + 14px + env(safe-area-inset-top, 0px));
  }
  .stepper {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .step {
    inline-size: 100%;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 9px;
    border: 0;
    border-radius: var(--radius-sm);
    background: none;
    color: var(--ink-2);
    font-size: 13px;
    cursor: pointer;
    text-align: start;
  }
  .step:hover {
    background: var(--surface-2);
  }
  .step.on {
    background: var(--wash);
    color: var(--tone);
    font-weight: 600;
  }
  .step-dot {
    inline-size: 8px;
    block-size: 8px;
    border-radius: 50%;
    background: var(--tone);
    opacity: 0.45;
    flex: none;
  }
  .step.on .step-dot {
    opacity: 1;
  }
  .step-label {
    flex: 1;
  }
  .terminal-actions {
    display: flex;
    gap: 7px;
    margin-block-start: 12px;
    padding-block-start: 12px;
    border-block-start: 1px solid var(--line);
  }
  .terminal-actions .btn {
    flex: 1;
  }
  .reason {
    margin-block-start: 10px;
  }

  .contact {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .contact li {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 12.8px;
    color: var(--ink-3);
    min-inline-size: 0;
  }
  .contact a,
  .contact span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .taglist {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 0;
    padding: 0;
  }

  .score-form {
    list-style: none;
    margin: 0 0 16px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 13px;
  }
  .score-form li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .score-form strong {
    display: block;
    font-size: 13.2px;
  }
  .score-comment {
    margin-block-start: 4px;
  }
  .draft-avg {
    margin-inline-end: auto;
  }

  @media (max-width: 980px) {
    .body {
      grid-template-columns: minmax(0, 1fr);
    }
    .rail {
      position: static;
    }
  }
</style>
