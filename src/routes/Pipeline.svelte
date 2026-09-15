<script>
  /**
   * Kanban board over the active stages.
   *
   * Drag and drop for the mouse, plus a per-card stage select so the board is
   * fully operable from the keyboard — a board you can only drag is a board
   * half the team cannot use.
   */
  import { ats } from '../lib/store/ats.svelte.js';
  import { STAGES, ACTIVE_STAGE_IDS, STAGE_BY_ID } from '../lib/store/schema.js';
  import { matchesQuery, pluralise } from '../lib/format.js';
  import PageHeader from '../components/PageHeader.svelte';
  import Avatar from '../components/Avatar.svelte';
  import Rating from '../components/Rating.svelte';
  import Icon from '../components/Icon.svelte';

  let jobFilter = $state('all');
  let search = $state('');
  let dragging = $state(null);
  let over = $state(null);

  const columns = $derived(
    ACTIVE_STAGE_IDS.map((id) => ({
      stage: STAGE_BY_ID[id],
      candidates: ats.candidates
        .filter((c) => c.stage === id)
        .filter((c) => jobFilter === 'all' || c.jobId === jobFilter)
        .filter((c) => matchesQuery(c, search))
        .sort((a, b) => (b.lastActivityAt ?? '').localeCompare(a.lastActivityAt ?? ''))
    }))
  );

  const closed = $derived(
    ['hired', 'rejected'].map((id) => ({
      stage: STAGE_BY_ID[id],
      candidates: ats.candidates
        .filter((c) => c.stage === id)
        .filter((c) => jobFilter === 'all' || c.jobId === jobFilter)
        .filter((c) => matchesQuery(c, search))
    }))
  );

  async function drop(stageId) {
    const id = dragging;
    dragging = null;
    over = null;
    if (id) await ats.moveStage(id, stageId);
  }
</script>

<PageHeader
  title="Pipeline"
  count={ats.activeCount}
  description="Everyone currently in process. Drag a card between columns, or use the stage menu on the card."
>
  {#snippet actions()}
    <label class="sr-only" for="pipeline-job">Filter by role</label>
    <select id="pipeline-job" class="select select--sm" bind:value={jobFilter}>
      <option value="all">All roles</option>
      {#each ats.jobs as job (job.id)}<option value={job.id}>{job.title}</option>{/each}
    </select>
    <label class="search">
      <Icon name="search" size={15} />
      <input
        id="pipeline-search"
        class="search-input"
        type="search"
        bind:value={search}
        placeholder="Filter board…"
        aria-label="Filter the board"
      />
    </label>
  {/snippet}
</PageHeader>

<div class="board" role="list">
  {#each columns as column (column.stage.id)}
    <section
      class="column"
      class:over={over === column.stage.id}
      role="listitem"
      style="--tone: var(--tone-{column.stage.tone}); --wash: var(--tone-{column.stage.tone}-wash);"
      ondragover={(e) => {
        e.preventDefault();
        over = column.stage.id;
      }}
      ondragleave={() => over === column.stage.id && (over = null)}
      ondrop={(e) => {
        e.preventDefault();
        drop(column.stage.id);
      }}
    >
      <header>
        <span class="col-title">
          <span class="dot"></span>{column.stage.label}
        </span>
        <span class="col-count numeric">{column.candidates.length}</span>
      </header>
      <p class="col-hint">{column.stage.hint}</p>

      <div class="cards">
        {#each column.candidates as candidate (candidate.id)}
          {@const rating = ats.rating(candidate)}
          {@const days = ats.daysInStage(candidate)}
          <article
            class="card-item"
            class:lifting={dragging === candidate.id}
            draggable="true"
            ondragstart={(e) => {
              dragging = candidate.id;
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', candidate.id);
            }}
            ondragend={() => {
              dragging = null;
              over = null;
            }}
          >
            <a class="card-main" href="#/candidates/{candidate.id}">
              <Avatar {candidate} size={30} />
              <span class="card-who">
                <strong>{candidate.name}</strong>
                <small>{ats.jobTitle(candidate.jobId)}</small>
              </span>
              {#if candidate.starred}
                <span class="starred" aria-label="Starred"><Icon name="star" size={13} filled /></span>
              {/if}
            </a>

            {#if candidate.tags?.length}
              <ul class="card-tags">
                {#each candidate.tags.slice(0, 2) as tag (tag)}<li class="chip">{tag}</li>{/each}
              </ul>
            {/if}

            <footer class="card-foot">
              {#if rating != null}
                <Rating value={rating} size={11} />
              {:else}
                <span class="muted">Not scored</span>
              {/if}
              <span class="muted" title="Days in this stage">{pluralise(days, 'day')}</span>
            </footer>

            <label class="move">
              <span class="sr-only">Move {candidate.name} to another stage</span>
              <select
                class="move-select"
                value={candidate.stage}
                onchange={(e) => ats.moveStage(candidate.id, e.currentTarget.value)}
              >
                {#each STAGES as stage (stage.id)}
                  <option value={stage.id}>{stage.label}</option>
                {/each}
              </select>
            </label>
          </article>
        {:else}
          <p class="empty-col">Nothing here yet.</p>
        {/each}
      </div>
    </section>
  {/each}
</div>

<section class="closed">
  {#each closed as group (group.stage.id)}
    <div
      class="closed-col"
      style="--tone: var(--tone-{group.stage.tone}); --wash: var(--tone-{group.stage.tone}-wash);"
      ondragover={(e) => e.preventDefault()}
      ondrop={(e) => {
        e.preventDefault();
        drop(group.stage.id);
      }}
      role="group"
      aria-label={group.stage.label}
    >
      <header>
        <span class="col-title"><span class="dot"></span>{group.stage.label}</span>
        <span class="col-count numeric">{group.candidates.length}</span>
      </header>
      <ul class="closed-list">
        {#each group.candidates as candidate (candidate.id)}
          <li>
            <a href="#/candidates/{candidate.id}">
              <Avatar {candidate} size={24} />
              <span>{candidate.name}</span>
              <small>{candidate.rejectionReason ?? ats.jobTitle(candidate.jobId)}</small>
            </a>
          </li>
        {:else}
          <li class="empty-col">None.</li>
        {/each}
      </ul>
    </div>
  {/each}
</section>

<style>
  .search {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 5px 10px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--ink-4);
  }
  .search:focus-within {
    border-color: var(--brand);
  }
  .search-input {
    border: 0;
    background: none;
    outline: none;
    font-size: 13px;
    inline-size: 150px;
    color: var(--ink);
  }
  .search-input::-webkit-search-cancel-button {
    display: none;
  }

  .board {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(196px, 1fr);
    gap: 12px;
    padding: 0 clamp(16px, 3vw, 28px);
    overflow-x: auto;
    align-items: start;
    padding-block-end: 8px;
  }

  .column {
    background: var(--surface-2);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    padding: 12px 10px;
    min-block-size: 180px;
    transition: background 0.14s ease, border-color 0.14s ease;
  }
  .column.over {
    border-color: var(--tone);
    background: var(--wash);
  }
  .column header,
  .closed-col header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .col-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12.5px;
    font-weight: 700;
    color: var(--ink);
  }
  .dot {
    inline-size: 7px;
    block-size: 7px;
    border-radius: 50%;
    background: var(--tone);
  }
  .col-count {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ink-4);
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--surface-3);
  }
  .col-hint {
    margin-block: 4px 10px;
    font-size: 11px;
    color: var(--ink-4);
    line-height: 1.35;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .card-item {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    padding: 9px 10px 8px;
    cursor: grab;
    box-shadow: var(--shadow-sm);
  }
  .card-item:active {
    cursor: grabbing;
  }
  .lifting {
    opacity: 0.45;
  }
  .card-main {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
  }
  .card-who {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
    flex: 1;
  }
  .card-who strong {
    font-size: 12.8px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-who small {
    font-size: 10.5px;
    color: var(--ink-4);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .starred {
    color: var(--accent);
    flex: none;
  }
  .card-tags {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin: 8px 0 0;
    padding: 0;
  }
  .card-tags .chip {
    font-size: 10px;
    padding: 1px 6px;
  }
  .card-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-block-start: 8px;
  }
  .muted {
    font-size: 10.5px;
    color: var(--ink-4);
  }

  .move {
    display: block;
    margin-block-start: 7px;
  }
  .move-select {
    inline-size: 100%;
    padding: 3px 6px;
    border: 1px solid var(--line);
    border-radius: 4px;
    background: var(--surface-2);
    color: var(--ink-3);
    font-size: 10.5px;
    cursor: pointer;
  }
  .move-select:hover {
    border-color: var(--line-strong);
    color: var(--ink);
  }

  .empty-col {
    font-size: 11.5px;
    color: var(--ink-4);
    padding: 10px 2px;
  }

  .closed {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
    margin: 18px clamp(16px, 3vw, 28px) 40px;
  }
  .closed-col {
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius);
    padding: 12px 14px;
    background: var(--surface);
  }
  .closed-list {
    list-style: none;
    margin: 10px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .closed-list a {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 5px 6px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: inherit;
  }
  .closed-list a:hover {
    background: var(--surface-2);
  }
  .closed-list span {
    font-size: 12.5px;
    font-weight: 500;
  }
  .closed-list small {
    margin-inline-start: auto;
    font-size: 11px;
    color: var(--ink-4);
    text-align: end;
  }
</style>
