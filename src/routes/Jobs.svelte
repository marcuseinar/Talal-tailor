<script>
  /** Requisitions, each with the shape of its own pipeline. */
  import { ats } from '../lib/store/ats.svelte.js';
  import { STAGES, ACTIVE_STAGE_IDS, STAGE_BY_ID } from '../lib/store/schema.js';
  import { formatDate } from '../lib/format.js';
  import PageHeader from '../components/PageHeader.svelte';
  import Icon from '../components/Icon.svelte';

  const daysOpen = (iso) => Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);

  const rows = $derived(
    ats.jobs.map((job) => {
      const people = ats.candidates.filter((c) => c.jobId === job.id);
      const byStage = Object.fromEntries(
        STAGES.map((s) => [s.id, people.filter((c) => c.stage === s.id).length])
      );
      const active = people.filter((c) => !STAGE_BY_ID[c.stage]?.terminal).length;
      return { job, people, byStage, active, hired: byStage.hired ?? 0 };
    })
  );
</script>

<PageHeader
  title="Jobs"
  count={ats.jobs.length}
  description="Open requisitions and the shape of each pipeline."
>
  {#snippet actions()}
    <a class="btn btn--sm" href="#/apply"><Icon name="external" size={14} /> View careers page</a>
  {/snippet}
</PageHeader>

<div class="grid">
  {#each rows as row (row.job.id)}
    {@const max = Math.max(1, ...ACTIVE_STAGE_IDS.map((id) => row.byStage[id] ?? 0))}
    <article class="card job">
      <header>
        <div>
          <h2>{row.job.title}</h2>
          <p class="sub">
            {row.job.department} · {row.job.location} · {row.job.workplace}
          </p>
        </div>
        <span class="openings numeric" title="Openings">{row.job.openings}×</span>
      </header>

      <p class="summary">{row.job.summary}</p>

      <div class="funnel" role="img" aria-label="Pipeline for {row.job.title}">
        {#each ACTIVE_STAGE_IDS as id (id)}
          {@const count = row.byStage[id] ?? 0}
          <div class="fcol" style="--tone: var(--tone-{STAGE_BY_ID[id].tone});">
            <span class="fbar" style="--h: {(count / max) * 100}%"></span>
            <span class="fnum numeric">{count}</span>
            <span class="flabel">{STAGE_BY_ID[id].short}</span>
          </div>
        {/each}
      </div>

      <dl class="stats">
        <div><dt>In process</dt><dd class="numeric">{row.active}</dd></div>
        <div><dt>Total applied</dt><dd class="numeric">{row.people.length}</dd></div>
        <div><dt>Hired</dt><dd class="numeric">{row.hired}</dd></div>
        <div><dt>Open</dt><dd class="numeric">{daysOpen(row.job.publishedAt)} days</dd></div>
      </dl>

      <footer>
        <span class="thin">Owner {row.job.owner} · recruiter {row.job.recruiter} · closes {formatDate(row.job.closesAt)}</span>
        <a class="btn btn--sm" href="#/apply/{row.job.id}">Open posting <Icon name="arrowRight" size={13} /></a>
      </footer>
    </article>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 14px;
    padding: 0 clamp(16px, 3vw, 28px) 40px;
  }
  .job {
    display: flex;
    flex-direction: column;
    gap: 13px;
    padding: 17px 19px;
  }
  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  h2 {
    font-size: 16px;
  }
  .sub {
    margin-block-start: 3px;
    font-size: 12px;
    color: var(--ink-4);
  }
  .openings {
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--brand-wash);
    color: var(--brand);
    font-size: 12px;
    font-weight: 700;
  }
  .summary {
    font-size: 13px;
    line-height: 1.55;
    color: var(--ink-3);
  }

  .funnel {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    align-items: end;
    block-size: 92px;
    padding: 10px 10px 0;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    border: 1px solid var(--line);
  }
  .fcol {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
    block-size: 100%;
  }
  .fbar {
    inline-size: 100%;
    max-inline-size: 30px;
    block-size: var(--h);
    min-block-size: 3px;
    border-radius: 3px 3px 0 0;
    background: var(--tone);
    opacity: 0.85;
  }
  .fnum {
    font-size: 11px;
    font-weight: 700;
    color: var(--ink-2);
  }
  .flabel {
    font-size: 9.5px;
    color: var(--ink-4);
    white-space: nowrap;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 0;
  }
  .stats dt {
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink-4);
  }
  .stats dd {
    margin: 2px 0 0;
    font-size: 16px;
    font-weight: 600;
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-block-start: auto;
    padding-block-start: 12px;
    border-block-start: 1px solid var(--line);
  }
  .thin {
    font-size: 11.5px;
    color: var(--ink-4);
  }
</style>
