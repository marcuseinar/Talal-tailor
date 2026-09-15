<script>
  /** Post-submit confirmation, plus the demo-only peek at the other side. */
  import { ats } from '../../lib/store/ats.svelte.js';
  import PublicHeader from '../../components/PublicHeader.svelte';
  import Avatar from '../../components/Avatar.svelte';
  import Icon from '../../components/Icon.svelte';
  import NotFound from '../NotFound.svelte';
  import { formatDate } from '../../lib/format.js';

  let { params } = $props();
  const candidate = $derived(ats.candidate(params.id));
</script>

{#if !candidate}
  <NotFound />
{:else}
  <PublicHeader />

  <main id="main" class="page">
    <div class="card panel">
      <span class="tick" aria-hidden="true"><Icon name="check" size={22} /></span>
      <h1>Application sent, {candidate.firstName}.</h1>
      <p class="lede">
        We have your application for <strong>{ats.jobTitle(candidate.jobId)}</strong>. A confirmation
        is on its way to <strong>{candidate.email}</strong>.
      </p>

      <dl class="receipt">
        <div><dt>Reference</dt><dd class="numeric">{candidate.reference}</dd></div>
        <div><dt>Submitted</dt><dd>{formatDate(candidate.appliedAt)}</dd></div>
        <div><dt>CV</dt><dd>{candidate.cv?.filename ?? 'Attached'}</dd></div>
      </dl>

      <section class="next">
        <h2>What happens next</h2>
        <ol>
          <li><strong>Within 5 working days</strong> — the hiring team reviews your CV and you hear back either way.</li>
          <li><strong>A 30-minute intro call</strong> — your background, the role, and your questions.</li>
          <li><strong>Team interview and a short case</strong> — paid if it runs beyond two hours.</li>
        </ol>
        <p class="small">
          Change of heart, a competing offer, a typo in your CV? Reply to the confirmation email and
          a human will pick it up.
        </p>
      </section>
    </div>

    <aside class="card peek">
      <p class="eyebrow">Demo only</p>
      <h2>Your application, from the other side</h2>
      <p>This is the record the hiring team now sees in their inbox.</p>
      <a class="preview" href="#/candidates/{candidate.id}">
        <Avatar {candidate} size={40} />
        <span>
          <strong>{candidate.name}</strong>
          <small>{candidate.headline}</small>
        </span>
        <Icon name="arrowRight" size={16} />
      </a>
      <a class="btn btn--sm" href="#/inbox"><Icon name="inbox" size={14} /> Open the hiring inbox</a>
    </aside>
  </main>
{/if}

<style>
  .page {
    max-inline-size: 960px;
    margin-inline: auto;
    padding-inline: clamp(16px, 4vw, 40px);
    padding-block: clamp(30px, 6vw, 60px) 72px;
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 22px;
    align-items: start;
  }
  .panel {
    padding: clamp(22px, 4vw, 36px);
  }
  .tick {
    display: grid;
    place-items: center;
    inline-size: 44px;
    block-size: 44px;
    border-radius: 50%;
    background: var(--good-wash);
    color: var(--good);
    margin-block-end: 16px;
  }
  h1 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(26px, 4vw, 38px);
    line-height: 1.1;
  }
  .lede {
    margin-block-start: 12px;
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--ink-2);
    max-inline-size: 52ch;
  }
  .lede strong {
    color: var(--ink);
    font-weight: 600;
  }
  .receipt {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 32px;
    margin: 22px 0 0;
    padding: 14px 16px;
    border-radius: var(--radius);
    background: var(--surface-2);
    border: 1px solid var(--line);
  }
  .receipt dt {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-4);
  }
  .receipt dd {
    margin: 3px 0 0;
    font-size: 13.5px;
    font-weight: 600;
  }
  .next {
    margin-block-start: 26px;
  }
  .next h2 {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
  }
  ol {
    margin: 12px 0 0;
    padding-inline-start: 20px;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  li {
    font-size: 13.5px;
    line-height: 1.55;
    color: var(--ink-2);
  }
  li strong {
    color: var(--ink);
  }
  .small {
    margin-block-start: 16px;
    font-size: 12.5px;
    color: var(--ink-4);
    max-inline-size: 56ch;
  }

  .peek {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--surface-2);
    border-style: dashed;
  }
  .peek h2 {
    font-size: 15px;
  }
  .peek > p {
    font-size: 12.5px;
    color: var(--ink-3);
  }
  .preview {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    text-decoration: none;
    color: inherit;
  }
  .preview:hover {
    border-color: var(--brand);
  }
  .preview span {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-inline-size: 0;
  }
  .preview strong {
    font-size: 13.5px;
  }
  .preview small {
    font-size: 11.5px;
    color: var(--ink-4);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 800px) {
    .page {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
