<script>
  /** Public careers page — the list of open roles. */
  import { ats } from '../../lib/store/ats.svelte.js';
  import PublicHeader from '../../components/PublicHeader.svelte';
  import Icon from '../../components/Icon.svelte';

  let filter = $state('All');

  const departments = $derived(['All', ...new Set(ats.jobs.map((j) => j.department))]);
  const visible = $derived(
    filter === 'All' ? ats.jobs : ats.jobs.filter((j) => j.department === filter)
  );

  const applicantsFor = (jobId) => ats.candidates.filter((c) => c.jobId === jobId).length;
</script>

<PublicHeader />

<main id="main" class="page">
  <section class="intro">
    <p class="eyebrow">{ats.company?.tagline}</p>
    <h1>Come build the grid<br />that has to work.</h1>
    <p class="lede">{ats.company?.about}</p>
    <ul class="facts">
      <li><strong class="numeric">{ats.jobs.length}</strong> open roles</li>
      <li><strong class="numeric">84</strong> people</li>
      <li><strong>{ats.company?.locations?.join(' · ')}</strong></li>
    </ul>
  </section>

  <section class="roles" aria-labelledby="roles-heading">
    <div class="roles-head">
      <h2 id="roles-heading">Open roles</h2>
      <div class="filters" role="group" aria-label="Filter by department">
        {#each departments as dept (dept)}
          <button
            type="button"
            class="filter"
            class:on={filter === dept}
            aria-pressed={filter === dept}
            onclick={() => (filter = dept)}
          >
            {dept}
          </button>
        {/each}
      </div>
    </div>

    <ul class="list">
      {#each visible as job (job.id)}
        <li>
          <a class="role" href="#/apply/{job.id}">
            <div class="role-main">
              <h3>{job.title}</h3>
              <p class="summary">{job.summary}</p>
              <ul class="tags">
                {#each job.tags as tag (tag)}<li class="chip">{tag}</li>{/each}
              </ul>
            </div>
            <dl class="role-meta">
              <div><dt>Team</dt><dd>{job.department}</dd></div>
              <div><dt>Location</dt><dd>{job.location}</dd></div>
              <div><dt>Applicants</dt><dd class="numeric">{applicantsFor(job.id)}</dd></div>
            </dl>
            <span class="go" aria-hidden="true"><Icon name="arrowRight" size={17} /></span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
</main>

<style>
  .page {
    max-inline-size: 1000px;
    margin-inline: auto;
    padding-inline: clamp(16px, 4vw, 40px);
    padding-block: clamp(30px, 6vw, 60px) 72px;
  }

  .intro {
    max-inline-size: 62ch;
  }
  h1 {
    margin-block-start: 12px;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(32px, 6vw, 54px);
    line-height: 1.05;
  }
  .lede {
    margin-block-start: 16px;
    font-size: 15px;
    line-height: 1.65;
    color: var(--ink-2);
  }
  .facts {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 26px;
    margin: 22px 0 0;
    padding: 0;
    font-size: 13px;
    color: var(--ink-3);
  }
  .facts strong {
    color: var(--ink);
    font-weight: 600;
    margin-inline-end: 4px;
  }

  .roles {
    margin-block-start: clamp(34px, 6vw, 56px);
  }
  .roles-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-block-end: 12px;
    border-block-end: 1px solid var(--line);
  }
  h2 {
    font-size: 17px;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .filter {
    padding: 4px 11px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--surface);
    color: var(--ink-3);
    font-size: 12.5px;
    cursor: pointer;
  }
  .filter:hover {
    border-color: var(--line-strong);
    color: var(--ink);
  }
  .filter.on {
    background: var(--brand);
    border-color: var(--brand);
    color: var(--brand-ink);
    font-weight: 500;
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .role {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 24px;
    padding: 20px 4px;
    border-block-end: 1px solid var(--line);
    text-decoration: none;
    color: inherit;
    transition: background 0.14s ease;
  }
  .role:hover {
    background: var(--surface-2);
  }
  h3 {
    font-size: 17px;
  }
  .summary {
    margin-block-start: 5px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--ink-3);
    max-inline-size: 58ch;
  }
  .tags {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 10px 0 0;
    padding: 0;
  }
  .role-meta {
    display: flex;
    gap: 22px;
    margin: 0;
  }
  .role-meta dt {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-4);
  }
  .role-meta dd {
    margin: 3px 0 0;
    font-size: 13px;
    color: var(--ink-2);
    white-space: nowrap;
  }
  .go {
    color: var(--ink-4);
  }
  .role:hover .go {
    color: var(--brand);
  }

  @media (max-width: 760px) {
    .role {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 14px;
    }
    .role-meta {
      grid-column: 1 / -1;
      flex-wrap: wrap;
      gap: 12px 20px;
    }
  }
</style>
