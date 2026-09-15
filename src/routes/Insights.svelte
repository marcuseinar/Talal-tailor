<script>
  /**
   * Funnel, sources and ageing.
   *
   * Charts are hand-drawn SVG against one shared scale — small enough that a
   * charting library would be more code than the charts.
   */
  import { ats } from '../lib/store/ats.svelte.js';
  import { STAGE_BY_ID, ACTIVE_STAGE_IDS } from '../lib/store/schema.js';
  import { pluralise } from '../lib/format.js';
  import PageHeader from '../components/PageHeader.svelte';
  import Avatar from '../components/Avatar.svelte';
  import Icon from '../components/Icon.svelte';

  const funnel = $derived(ats.funnel);
  const maxReached = $derived(Math.max(1, ...funnel.map((f) => f.reached)));
  const sources = $derived(ats.sourceBreakdown);
  const maxSource = $derived(Math.max(1, ...sources.map((s) => s.count)));

  const hired = $derived(ats.candidates.filter((c) => c.stage === 'hired').length);
  const rejected = $derived(ats.candidates.filter((c) => c.stage === 'rejected').length);
  const scored = $derived(ats.candidates.filter((c) => (c.scorecards?.length ?? 0) > 0).length);

  /** Anyone sitting in one stage longer than the role's SLA. */
  const stalled = $derived(
    ats.candidates
      .filter((c) => !STAGE_BY_ID[c.stage]?.terminal)
      .map((c) => ({ candidate: c, days: ats.daysInStage(c) }))
      .filter((x) => x.days >= 7)
      .sort((a, b) => b.days - a.days)
      .slice(0, 6)
  );

  const avgDaysByStage = $derived(
    ACTIVE_STAGE_IDS.map((id) => {
      const people = ats.candidates.filter((c) => c.stage === id);
      const avg = people.length
        ? people.reduce((sum, c) => sum + ats.daysInStage(c), 0) / people.length
        : 0;
      return { stage: STAGE_BY_ID[id], avg, count: people.length };
    })
  );
</script>

<PageHeader title="Insights" description="Where the pipeline is working, and where people are waiting." />

<div class="grid">
  <section class="card pad tiles">
    {#each [['Applications', ats.candidates.length], ['In process', ats.activeCount], ['Hired', hired], ['Rejected', rejected], ['Scored', scored]] as [label, value] (label)}
      <div class="tile">
        <span class="tile-n numeric">{value}</span>
        <span class="tile-l">{label}</span>
      </div>
    {/each}
  </section>

  <section class="card pad">
    <h2>Funnel</h2>
    <p class="thin">Everyone who reached each stage, including those who have since moved on or been rejected.</p>
    <ul class="funnel">
      {#each funnel as step, i (step.stage.id)}
        {@const prev = i > 0 ? funnel[i - 1].reached : null}
        {@const rate = prev ? Math.round((step.reached / prev) * 100) : null}
        <li style="--tone: var(--tone-{step.stage.tone}); --wash: var(--tone-{step.stage.tone}-wash);">
          <span class="fname">{step.stage.label}</span>
          <span class="ftrack">
            <span class="ffill" style="inline-size: {(step.reached / maxReached) * 100}%"></span>
          </span>
          <span class="fcount numeric">{step.reached}</span>
          <span class="frate numeric">{rate == null ? '—' : `${rate}%`}</span>
        </li>
      {/each}
    </ul>
  </section>

  <section class="card pad">
    <h2>Where candidates come from</h2>
    <ul class="sources">
      {#each sources as item (item.source)}
        <li>
          <span class="sname">{item.source}</span>
          <span class="strack">
            <span class="sfill" style="inline-size: {(item.count / maxSource) * 100}%"></span>
          </span>
          <span class="snum numeric">{item.count}</span>
        </li>
      {/each}
    </ul>
  </section>

  <section class="card pad">
    <h2>Average time in stage</h2>
    <p class="thin">For people currently sitting in each stage.</p>
    <div class="ageing">
      {#each avgDaysByStage as row (row.stage.id)}
        {@const worst = Math.max(1, ...avgDaysByStage.map((r) => r.avg))}
        <div class="acol" style="--tone: var(--tone-{row.stage.tone});">
          <span class="anum numeric">{row.avg ? Math.round(row.avg) : '–'}</span>
          <span class="abar" style="--h: {(row.avg / worst) * 100}%"></span>
          <span class="alabel">{row.stage.short}</span>
          <span class="acount numeric">{row.count}</span>
        </div>
      {/each}
    </div>
    <p class="thin legend">Days (top) · candidates in stage (bottom)</p>
  </section>

  <section class="card pad wide">
    <h2>Waiting longest</h2>
    {#if stalled.length}
      <ul class="stalled">
        {#each stalled as item (item.candidate.id)}
          <li>
            <a href="#/candidates/{item.candidate.id}">
              <Avatar candidate={item.candidate} size={30} />
              <span class="sw">
                <strong>{item.candidate.name}</strong>
                <small>{STAGE_BY_ID[item.candidate.stage].label} · {ats.jobTitle(item.candidate.jobId)}</small>
              </span>
              <span class="days numeric" data-hot={item.days >= 14}>{pluralise(item.days, 'day')}</span>
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="thin">Nobody has been waiting more than a week. Rare and worth enjoying.</p>
    {/if}
  </section>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
    gap: 14px;
    padding: 0 clamp(16px, 3vw, 28px) 40px;
    align-items: start;
  }
  .pad {
    padding: 17px 19px;
  }
  .wide {
    grid-column: 1 / -1;
  }
  h2 {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-4);
  }
  .thin {
    margin-block-start: 6px;
    font-size: 12px;
    color: var(--ink-4);
    line-height: 1.5;
  }

  .tiles {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 10px;
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding: 4px 2px;
  }
  .tile-n {
    font-size: 27px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .tile-l {
    font-size: 11.5px;
    color: var(--ink-4);
  }

  .funnel,
  .sources,
  .stalled {
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
  .funnel li {
    display: grid;
    grid-template-columns: 86px minmax(0, 1fr) 24px 40px;
    align-items: center;
    gap: 10px;
  }
  .fname {
    font-size: 12.5px;
    color: var(--ink-2);
  }
  .ftrack {
    block-size: 14px;
    border-radius: 4px;
    background: var(--surface-3);
    overflow: hidden;
  }
  .ffill {
    display: block;
    block-size: 100%;
    border-radius: 4px;
    background: var(--tone);
    opacity: 0.85;
    min-inline-size: 3px;
  }
  .fcount {
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
    text-align: end;
  }
  .frate {
    font-size: 11.5px;
    color: var(--ink-4);
    text-align: end;
  }

  .sources li {
    display: grid;
    grid-template-columns: 92px minmax(0, 1fr) 26px;
    align-items: center;
    gap: 10px;
  }
  .sname {
    font-size: 12.5px;
    color: var(--ink-2);
  }
  .strack {
    block-size: 8px;
    border-radius: 4px;
    background: var(--surface-3);
  }
  .sfill {
    display: block;
    block-size: 100%;
    border-radius: 4px;
    background: var(--accent);
    min-inline-size: 3px;
  }
  .snum {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-3);
    text-align: end;
  }

  .ageing {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-block-start: 14px;
    block-size: 140px;
  }
  .acol {
    display: grid;
    grid-template-rows: auto 1fr auto auto;
    align-items: end;
    justify-items: center;
    gap: 4px;
  }
  .anum {
    font-size: 13px;
    font-weight: 600;
  }
  .abar {
    inline-size: 100%;
    max-inline-size: 34px;
    block-size: var(--h);
    min-block-size: 3px;
    border-radius: 3px 3px 0 0;
    background: var(--tone);
    opacity: 0.85;
    align-self: end;
  }
  .alabel {
    font-size: 10px;
    color: var(--ink-3);
  }
  .acount {
    font-size: 10px;
    color: var(--ink-4);
  }
  .legend {
    text-align: center;
  }

  .stalled {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 6px;
  }
  .stalled a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 9px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: inherit;
  }
  .stalled a:hover {
    background: var(--surface-2);
  }
  .sw {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-inline-size: 0;
  }
  .sw strong {
    font-size: 13px;
    font-weight: 500;
  }
  .sw small {
    font-size: 11px;
    color: var(--ink-4);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .days {
    font-size: 11.5px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--warn-wash);
    color: var(--warn);
    white-space: nowrap;
  }
  .days[data-hot='true'] {
    background: var(--bad-wash);
    color: var(--bad);
  }
</style>
