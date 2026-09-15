<script>
  /**
   * On-screen rendition of the generated CV. Deliberately mirrors the PDF
   * layout in src/lib/pdf/cv.js so the preview and the download are the same
   * document — and so the preview works everywhere, including hosts that
   * sandbox embedded PDF viewers.
   */
  import Avatar from './Avatar.svelte';

  let { candidate } = $props();

  const links = $derived(Object.entries(candidate.links ?? {}).filter(([, v]) => v));
  const LABELS = { portfolio: 'Portfolio', github: 'GitHub', linkedin: 'LinkedIn', website: 'Website' };
</script>

<article class="sheet" aria-label="CV preview">
  <header>
    <div class="who">
      <h1>{candidate.name}</h1>
      {#if candidate.headline}<p class="headline">{candidate.headline}</p>{/if}
      <p class="contact">
        {[candidate.location, candidate.email, candidate.phone].filter(Boolean).join('   ·   ')}
      </p>
    </div>
    <Avatar {candidate} size={78} />
  </header>

  <div class="body">
    <div class="main">
      {#if candidate.summary}
        <section>
          <h2>Profile</h2>
          <p class="prose">{candidate.summary}</p>
        </section>
      {/if}

      {#if candidate.experience?.length}
        <section>
          <h2>Experience</h2>
          {#each candidate.experience as job (job.role + job.company)}
            <div class="entry">
              <div class="entry-head">
                <h3>{job.role}</h3>
                <span class="period numeric">{job.period}</span>
              </div>
              <p class="org">{[job.company, job.location].filter(Boolean).join(' · ')}</p>
              {#if job.bullets?.length}
                <ul>
                  {#each job.bullets as bullet (bullet)}<li>{bullet}</li>{/each}
                </ul>
              {/if}
            </div>
          {/each}
        </section>
      {/if}

      {#if candidate.education?.length}
        <section>
          <h2>Education</h2>
          {#each candidate.education as item (item.degree + item.school)}
            <div class="entry">
              <div class="entry-head">
                <h3>{item.degree}</h3>
                <span class="period numeric">{item.period}</span>
              </div>
              <p class="org plain">{item.school}</p>
            </div>
          {/each}
        </section>
      {/if}
    </div>

    <aside>
      <section>
        <h2>Details</h2>
        <dl>
          {#each [['Location', candidate.location], ['Notice period', candidate.noticePeriod], ['Salary expectation', candidate.salaryExpectation], ['Work permit', candidate.workPermit]] as [label, value] (label)}
            {#if value}
              <dt>{label}</dt>
              <dd>{value}</dd>
            {/if}
          {/each}
        </dl>
      </section>

      {#if candidate.skills?.length}
        <section>
          <h2>Skills</h2>
          <ul class="chips">
            {#each candidate.skills as skill (skill)}<li class="chip">{skill}</li>{/each}
          </ul>
        </section>
      {/if}

      {#if candidate.languages?.length}
        <section>
          <h2>Languages</h2>
          <dl class="rows">
            {#each candidate.languages as lang (lang.name)}
              <dt>{lang.name}</dt>
              <dd>{lang.level}</dd>
            {/each}
          </dl>
        </section>
      {/if}

      {#if links.length}
        <section>
          <h2>Links</h2>
          <dl>
            {#each links as [key, value] (key)}
              <dt>{LABELS[key] ?? key}</dt>
              <dd><a href={'https://' + String(value).replace(/^https?:\/\//, '')} target="_blank" rel="noopener noreferrer">{value}</a></dd>
            {/each}
          </dl>
        </section>
      {/if}
    </aside>
  </div>

  <footer>
    <span>{candidate.name} · CV{candidate.reference ? ` · ${candidate.reference}` : ''}</span>
    <span>Page 1 of 1</span>
  </footer>
</article>

<style>
  .sheet {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    overflow: hidden;
    container-type: inline-size;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 22px 26px;
    background: var(--brand);
    color: #fff;
    border-block-end: 4px solid var(--accent);
  }
  :global(:root[data-theme='dark']) header,
  :global(:root:not([data-theme='light'])) header {
    background: #0e2c36;
  }
  .who {
    min-inline-size: 0;
  }
  h1 {
    font-size: clamp(20px, 4cqi, 27px);
    letter-spacing: -0.02em;
  }
  .headline {
    margin-block-start: 5px;
    font-size: 13px;
    color: #a9d3de;
  }
  .contact {
    margin-block-start: 12px;
    font-size: 11.5px;
    color: #8fc4d1;
  }

  .body {
    display: grid;
    grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
    gap: 30px;
    padding: 24px 26px 8px;
  }
  @container (max-width: 620px) {
    .body {
      grid-template-columns: 1fr;
      gap: 6px;
    }
  }

  section {
    margin-block-end: 20px;
  }
  h2 {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--accent);
    padding-block-end: 5px;
    border-block-end: 1px solid var(--line);
    margin-block-end: 12px;
  }
  .prose {
    font-size: 13px;
    line-height: 1.6;
    color: var(--ink-2);
  }
  .entry {
    margin-block-end: 15px;
  }
  .entry-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }
  h3 {
    font-size: 14px;
    font-weight: 600;
  }
  .period {
    font-size: 11.5px;
    color: var(--ink-3);
    white-space: nowrap;
  }
  .org {
    margin-block-start: 2px;
    font-size: 12.5px;
    font-style: italic;
    color: var(--accent);
  }
  .org.plain {
    font-style: normal;
    color: var(--ink-2);
  }
  ul {
    margin: 7px 0 0;
    padding-inline-start: 17px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  li {
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--ink-2);
  }
  li::marker {
    color: var(--ink-4);
  }

  dl {
    display: flex;
    flex-direction: column;
    gap: 9px;
    margin: 0;
  }
  dl.rows {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 5px 10px;
    align-items: baseline;
  }
  dt {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-4);
  }
  dl.rows dt {
    font-size: 12.5px;
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
    color: var(--ink-2);
  }
  dd {
    margin: 2px 0 0;
    font-size: 12.5px;
    color: var(--ink);
    overflow-wrap: anywhere;
  }
  dl.rows dd {
    margin: 0;
    text-align: end;
    color: var(--ink-3);
    font-size: 12px;
  }

  .chips {
    list-style: none;
    margin: 0;
    padding: 0;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;
  }
  .chips .chip {
    background: var(--brand-wash);
    color: var(--brand);
    font-size: 11px;
  }

  footer {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 26px 14px;
    margin-block-start: 6px;
    border-block-start: 1px solid var(--line);
    font-size: 10.5px;
    color: var(--ink-4);
  }
</style>
