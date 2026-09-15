<script>
  /**
   * The hiring inbox: every application, filterable, with bulk triage.
   * Defaults to unreviewed applications because that is the job to be done.
   */
  import { ats } from '../lib/store/ats.svelte.js';
  import { STAGES, STAGE_BY_ID, REJECTION_REASONS } from '../lib/store/schema.js';
  import { matchesQuery } from '../lib/format.js';
  import PageHeader from '../components/PageHeader.svelte';
  import CandidateRow from '../components/CandidateRow.svelte';
  import EmptyState from '../components/EmptyState.svelte';
  import Icon from '../components/Icon.svelte';
  import Modal from '../components/Modal.svelte';

  const VIEWS = [
    { id: 'all', label: 'All applications' },
    { id: 'new', label: 'New' },
    { id: 'active', label: 'In process' },
    { id: 'starred', label: 'Starred' }
  ];

  let view = $state('all');
  let jobFilter = $state('all');
  let sourceFilter = $state('all');
  let search = $state('');
  let sort = $state('recent');
  let selected = $state(new Set());
  let rejecting = $state(false);
  let rejectReason = $state(REJECTION_REASONS[1]);

  const sources = $derived(['all', ...new Set(ats.candidates.map((c) => c.source))]);

  const filtered = $derived.by(() => {
    let list = ats.candidates.filter((c) => {
      if (view === 'new' && c.stage !== 'inbox') return false;
      if (view === 'active' && STAGE_BY_ID[c.stage]?.terminal) return false;
      if (view === 'starred' && !c.starred) return false;
      if (jobFilter !== 'all' && c.jobId !== jobFilter) return false;
      if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
      return matchesQuery(c, search);
    });

    const by = {
      recent: (a, b) => (b.lastActivityAt ?? '').localeCompare(a.lastActivityAt ?? ''),
      applied: (a, b) => (b.appliedAt ?? '').localeCompare(a.appliedAt ?? ''),
      name: (a, b) => a.name.localeCompare(b.name),
      rating: (a, b) => (ats.rating(b) ?? -1) - (ats.rating(a) ?? -1),
      waiting: (a, b) => ats.daysInStage(b) - ats.daysInStage(a)
    };
    return [...list].sort(by[sort]);
  });

  const allSelected = $derived(filtered.length > 0 && filtered.every((c) => selected.has(c.id)));

  // A filter change can strand selections for rows no longer on screen.
  $effect(() => {
    const visible = new Set(filtered.map((c) => c.id));
    if ([...selected].some((id) => !visible.has(id))) {
      selected = new Set([...selected].filter((id) => visible.has(id)));
    }
  });

  function toggle(id, on) {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    selected = next;
  }

  function toggleAll(on) {
    selected = on ? new Set(filtered.map((c) => c.id)) : new Set();
  }

  async function bulk(stage, options) {
    await ats.bulkMove([...selected], stage, options);
    selected = new Set();
  }

  async function confirmReject() {
    await bulk('rejected', { reason: rejectReason });
    rejecting = false;
  }

  const activeFilters = $derived(
    (jobFilter !== 'all' ? 1 : 0) + (sourceFilter !== 'all' ? 1 : 0) + (search.trim() ? 1 : 0)
  );
</script>

<PageHeader
  title="Inbox"
  count={filtered.length}
  description="Applications across every open role. Triage here, then work the pipeline board."
>
  {#snippet actions()}
    <a class="btn btn--sm" href="#/pipeline"><Icon name="pipeline" size={14} /> Pipeline board</a>
    <a class="btn btn--primary btn--sm" href="#/apply"><Icon name="plus" size={14} /> Add application</a>
  {/snippet}
</PageHeader>

<div class="toolbar">
  <div class="views" role="tablist" aria-label="Inbox view">
    {#each VIEWS as item (item.id)}
      {@const n =
        item.id === 'new'
          ? ats.inStage('inbox').length
          : item.id === 'active'
            ? ats.activeCount
            : item.id === 'starred'
              ? ats.candidates.filter((c) => c.starred).length
              : ats.candidates.length}
      <button
        type="button"
        role="tab"
        aria-selected={view === item.id}
        class="view"
        class:on={view === item.id}
        onclick={() => (view = item.id)}
      >
        {item.label}<span class="n numeric">{n}</span>
      </button>
    {/each}
  </div>

  <div class="controls">
    <label class="search">
      <Icon name="search" size={15} />
      <input
        id="inbox-search"
        class="search-input"
        type="search"
        bind:value={search}
        placeholder="Name, skill, location…"
        aria-label="Search candidates"
      />
    </label>

    <label class="sr-only" for="inbox-job">Filter by role</label>
    <select id="inbox-job" class="select select--sm" bind:value={jobFilter}>
      <option value="all">All roles</option>
      {#each ats.jobs as job (job.id)}<option value={job.id}>{job.title}</option>{/each}
    </select>

    <label class="sr-only" for="inbox-source">Filter by source</label>
    <select id="inbox-source" class="select select--sm" bind:value={sourceFilter}>
      {#each sources as source (source)}
        <option value={source}>{source === 'all' ? 'All sources' : source}</option>
      {/each}
    </select>

    <label class="sr-only" for="inbox-sort">Sort</label>
    <select id="inbox-sort" class="select select--sm" bind:value={sort}>
      <option value="recent">Latest activity</option>
      <option value="applied">Newest application</option>
      <option value="waiting">Longest waiting</option>
      <option value="rating">Highest rated</option>
      <option value="name">Name A–Z</option>
    </select>

    {#if activeFilters}
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        onclick={() => {
          jobFilter = 'all';
          sourceFilter = 'all';
          search = '';
        }}
      >
        Clear {activeFilters}
      </button>
    {/if}
  </div>
</div>

{#if selected.size}
  <div class="bulk" role="region" aria-label="Bulk actions">
    <strong class="numeric">{selected.size} selected</strong>
    <button class="btn btn--sm" type="button" onclick={() => bulk('screening')}>Move to screening</button>
    <button class="btn btn--sm" type="button" onclick={() => bulk('interview')}>Move to interview</button>
    <button class="btn btn--sm btn--danger" type="button" onclick={() => (rejecting = true)}>Reject…</button>
    <button class="btn btn--ghost btn--sm" type="button" onclick={() => (selected = new Set())}>Clear</button>
  </div>
{/if}

<section class="list-wrap">
  {#if filtered.length}
    <div class="list-head">
      <label class="pick">
        <input
          type="checkbox"
          checked={allSelected}
          onchange={(e) => toggleAll(e.currentTarget.checked)}
          aria-label="Select all visible candidates"
        />
      </label>
      <span>Candidate</span>
    </div>
    <div class="list">
      {#each filtered as candidate (candidate.id)}
        <CandidateRow {candidate} selected={selected.has(candidate.id)} onselect={toggle} />
      {/each}
    </div>
  {:else}
    <EmptyState
      icon="inbox"
      title={view === 'new' ? 'Inbox zero.' : 'Nothing matches those filters.'}
      description={view === 'new'
        ? 'Every application has been looked at. Submit one from the candidate portal to see it land here.'
        : 'Try widening the search or clearing a filter.'}
    >
      {#if view === 'new'}
        <a class="btn btn--sm" href="#/apply">Open the candidate portal</a>
      {/if}
    </EmptyState>
  {/if}
</section>

<Modal
  open={rejecting}
  title="Reject {selected.size} candidate{selected.size === 1 ? '' : 's'}"
  subtitle="The reason is recorded on each candidate's timeline and feeds the funnel stats."
  onclose={() => (rejecting = false)}
  width="460px"
>
  <div class="field">
    <label for="reject-reason">Reason</label>
    <select id="reject-reason" class="select" bind:value={rejectReason}>
      {#each REJECTION_REASONS as reason (reason)}<option value={reason}>{reason}</option>{/each}
    </select>
  </div>
  {#snippet footer()}
    <button class="btn btn--sm" type="button" onclick={() => (rejecting = false)}>Cancel</button>
    <button class="btn btn--sm btn--danger" type="button" onclick={confirmReject}>Reject</button>
  {/snippet}
</Modal>

<style>
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 0 clamp(16px, 3vw, 28px) 14px;
  }
  .views {
    display: flex;
    gap: 2px;
    padding: 3px;
    border-radius: var(--radius);
    background: var(--surface-3);
  }
  .view {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--ink-3);
    font-size: 12.8px;
    font-weight: 500;
    cursor: pointer;
  }
  .view:hover {
    color: var(--ink);
  }
  .view.on {
    background: var(--surface);
    color: var(--ink);
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }
  .n {
    font-size: 11px;
    color: var(--ink-4);
  }
  .view.on .n {
    color: var(--brand);
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-wrap: wrap;
  }
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
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 16%, transparent);
  }
  .search-input {
    border: 0;
    background: none;
    outline: none;
    font-size: 13px;
    inline-size: 170px;
    color: var(--ink);
  }
  .search-input::-webkit-search-cancel-button {
    display: none;
  }
  :global(.select--sm) {
    inline-size: auto;
    padding: 6px 28px 6px 9px;
    font-size: 12.5px;
  }

  .bulk {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-inline: clamp(16px, 3vw, 28px);
    padding: 9px 12px;
    border-radius: var(--radius);
    background: var(--brand);
    color: var(--brand-ink);
  }
  .bulk strong {
    font-size: 12.5px;
    margin-inline-end: 4px;
  }

  .list-wrap {
    margin: 12px clamp(16px, 3vw, 28px) 40px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface);
    overflow: hidden;
  }
  .list-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    border-block-end: 1px solid var(--line);
    background: var(--surface-2);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-4);
  }
  .list-head .pick {
    display: grid;
    place-items: center;
  }
  .list-head input {
    inline-size: 15px;
    block-size: 15px;
    accent-color: var(--brand);
    cursor: pointer;
  }
  .list > :global(.row:last-child) {
    border-block-end: 0;
  }
</style>
