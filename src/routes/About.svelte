<script>
  /** What is real, what is faked, and the controls for the demo data. */
  import { ats } from '../lib/store/ats.svelte.js';
  import { theme } from '../lib/theme.svelte.js';
  import { AVATAR_CREDIT } from '../lib/data/avatars.js';
  import { saveFile, downloadsAvailable } from '../lib/downloads.js';
  import PageHeader from '../components/PageHeader.svelte';
  import Mascot from '../components/Mascot.svelte';
  import Icon from '../components/Icon.svelte';
  import Modal from '../components/Modal.svelte';
  import { toast } from '../components/Toasts.svelte';

  let confirmReset = $state(false);
  let hostedDownloads = $state(null);

  $effect(() => {
    downloadsAvailable().then((v) => (hostedDownloads = v));
  });

  const REAL = [
    ['Applications', 'The form validates, accepts a PDF and a photo, and writes a candidate record that shows up in the inbox straight away.'],
    ['CV PDFs', 'Generated in the browser by a PDF writer in this repo — real page objects, real fonts, real link annotations. No library.'],
    ['Pipeline', 'Drag and drop, bulk triage, stage history. Every change appends to an audit trail.'],
    ['Scorecards', 'Five criteria, averaged per review and across reviews, feeding the candidate score and the funnel.'],
    ['Email', 'Templates with merge fields, rendered against the real candidate record and logged to the timeline.'],
    ['Search', 'Full-text across names, skills, tags and locations, plus a ⌘K switcher.'],
    ['Storage', 'A pluggable adapter. Browser storage today; the REST adapter in src/lib/store/adapters.js is the seam for a real backend.']
  ];

  const MOCK = [
    ['The company', 'Helio does not exist. Neither do any of the candidates, their employers or their referees.'],
    ['Sending email', 'Nothing leaves the browser. "Send" writes the message to the activity log.'],
    ['Accounts', 'No sign-in. Everyone who opens the link is Talal.'],
    ['Sharing', 'Data lives in your browser, so two people opening the link see their own copy.']
  ];

  async function exportData() {
    const result = await saveFile({
      filename: 'talal-tailor-export.json',
      data: ats.exportJson(),
      mime: 'application/json'
    });
    if (result.status === 'saved') toast('Workspace exported.', { tone: 'success' });
    else if (result.status === 'declined') toast('Export cancelled.');
    else toast(result.reason ?? 'Could not export.', { tone: 'error' });
  }

  async function reset() {
    await ats.resetDemo();
    confirmReset = false;
  }
</script>

<PageHeader title="About this demo" description="A proof of concept, built to be poked at." />

<div class="wrap">
  <section class="card intro">
    <div class="intro-copy">
      <h2>Talal Tailor</h2>
      <p>
        An applicant tracking system built with Svelte — a candidate portal on one side, a hiring
        workspace on the other, one dataset between them. It exists to show what the workflow feels
        like end to end, so the parts that matter are genuinely implemented rather than drawn.
      </p>
      <p class="thin">
        Built as a proof of concept. Everything below is honest about which half you are looking at.
      </p>
    </div>
    <Mascot say="أنا أفضل من تيم تيلور" size={190} alt="Talal, the mascot" />
  </section>

  <div class="cols">
    <section class="card pad">
      <h3><span class="tick"><Icon name="check" size={13} /></span> Really works</h3>
      <dl>
        {#each REAL as [term, detail] (term)}
          <div><dt>{term}</dt><dd>{detail}</dd></div>
        {/each}
      </dl>
    </section>

    <section class="card pad">
      <h3><span class="cross"><Icon name="x" size={13} /></span> Faked, deliberately</h3>
      <dl>
        {#each MOCK as [term, detail] (term)}
          <div><dt>{term}</dt><dd>{detail}</dd></div>
        {/each}
      </dl>
    </section>
  </div>

  <section class="card pad">
    <h3>Your data</h3>
    <p class="thin">
      Storage: <strong>{ats.storage.label}</strong>. {ats.storage.description}
      {#if hostedDownloads === true}
        Downloads go through the host's save dialog.
      {:else if hostedDownloads === false}
        Downloads use the browser's own save.
      {/if}
    </p>
    <div class="row">
      <button class="btn btn--sm" type="button" onclick={exportData}>
        <Icon name="download" size={14} /> Export everything as JSON
      </button>
      <button class="btn btn--sm btn--danger" type="button" onclick={() => (confirmReset = true)}>
        <Icon name="refresh" size={14} /> Reset demo data
      </button>
    </div>
  </section>

  <section class="card pad">
    <h3>Appearance</h3>
    <div class="row" role="group" aria-label="Theme">
      {#each [['system', 'Match system'], ['light', 'Light'], ['dark', 'Dark']] as [value, label] (value)}
        <button
          type="button"
          class="btn btn--sm"
          class:btn--primary={theme.preference === value}
          aria-pressed={theme.preference === value}
          onclick={() => theme.set(value)}
        >
          {label}
        </button>
      {/each}
    </div>
  </section>

  <section class="card pad">
    <h3>Credits</h3>
    <ul class="credits">
      <li>
        Candidate avatars: <strong>{AVATAR_CREDIT.style}</strong> by {AVATAR_CREDIT.author}, released
        under
        <a href={AVATAR_CREDIT.licenceUrl} target="_blank" rel="noopener noreferrer">{AVATAR_CREDIT.licence}</a>
        (public domain), via {AVATAR_CREDIT.via}. Illustrations rather than photographs on purpose —
        the people are invented, so their faces should be too.
      </li>
      <li>Typefaces: Archivo and Instrument Serif; Cairo for Arabic. All open licence.</li>
      <li>Built with Svelte 5 and Vite. No UI framework, no chart library, no PDF library.</li>
    </ul>
  </section>
</div>

<Modal
  open={confirmReset}
  title="Reset demo data?"
  subtitle="Everything you have changed goes back to the seeded pipeline."
  onclose={() => (confirmReset = false)}
  width="420px"
>
  <p class="thin">
    Any applications you submitted, notes you wrote and stage changes you made will be discarded.
    The 16 seeded candidates come back exactly as they started.
  </p>
  {#snippet footer()}
    <button class="btn btn--sm" type="button" onclick={() => (confirmReset = false)}>Cancel</button>
    <button class="btn btn--sm btn--danger" type="button" onclick={reset}>Reset</button>
  {/snippet}
</Modal>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 0 clamp(16px, 3vw, 28px) 48px;
    max-inline-size: 960px;
  }
  .intro {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 24px 26px;
    background: var(--surface);
    overflow: hidden;
  }
  .intro-copy {
    flex: 1;
    min-inline-size: 0;
  }
  h2 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 32px;
  }
  .intro p {
    margin-block-start: 12px;
    font-size: 14px;
    line-height: 1.65;
    color: var(--ink-2);
    max-inline-size: 60ch;
  }
  .pad {
    padding: 17px 19px;
  }
  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-4);
    margin-block-end: 13px;
  }
  .tick,
  .cross {
    display: grid;
    place-items: center;
    inline-size: 20px;
    block-size: 20px;
    border-radius: 50%;
  }
  .tick {
    background: var(--good-wash);
    color: var(--good);
  }
  .cross {
    background: var(--bad-wash);
    color: var(--bad);
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 14px;
    align-items: start;
  }
  dl {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  dt {
    font-size: 13px;
    font-weight: 600;
  }
  dd {
    margin: 3px 0 0;
    font-size: 12.8px;
    line-height: 1.55;
    color: var(--ink-3);
  }
  .thin {
    font-size: 12.8px;
    line-height: 1.6;
    color: var(--ink-3);
  }
  .thin strong {
    color: var(--ink);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-block-start: 13px;
  }
  .credits {
    margin: 0;
    padding-inline-start: 17px;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .credits li {
    font-size: 12.8px;
    line-height: 1.6;
    color: var(--ink-3);
  }
  @media (max-width: 720px) {
    .intro {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
