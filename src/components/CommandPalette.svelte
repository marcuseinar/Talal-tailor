<script>
  /** ⌘K / Ctrl+K quick switcher across candidates, jobs and views. */
  import { ats } from '../lib/store/ats.svelte.js';
  import { navigate } from '../lib/router.svelte.js';
  import { matchesQuery } from '../lib/format.js';
  import Avatar from './Avatar.svelte';
  import StageBadge from './StageBadge.svelte';
  import Icon from './Icon.svelte';

  let { open = false, onclose } = $props();

  let query = $state('');
  let cursor = $state(0);
  let inputEl = $state(null);
  let dialogEl = $state(null);

  const VIEWS = [
    { id: 'inbox', label: 'Inbox', icon: 'inbox', path: '/inbox' },
    { id: 'pipeline', label: 'Pipeline', icon: 'pipeline', path: '/pipeline' },
    { id: 'jobs', label: 'Jobs', icon: 'briefcase', path: '/jobs' },
    { id: 'insights', label: 'Insights', icon: 'insights', path: '/insights' },
    { id: 'apply', label: 'Candidate portal', icon: 'external', path: '/apply' },
    { id: 'home', label: 'Switch view', icon: 'grid', path: '/' }
  ];

  const results = $derived.by(() => {
    const q = query.trim().toLowerCase();
    const views = VIEWS.filter((v) => !q || v.label.toLowerCase().includes(q)).map((v) => ({
      kind: 'view',
      ...v
    }));
    const people = ats.candidates
      .filter((c) => matchesQuery(c, query))
      .slice(0, 8)
      .map((c) => ({ kind: 'candidate', id: c.id, candidate: c, path: `/candidates/${c.id}` }));
    return q ? [...people, ...views] : [...views, ...people.slice(0, 5)];
  });

  $effect(() => {
    if (!dialogEl) return;
    if (open && !dialogEl.open) {
      dialogEl.showModal();
      query = '';
      cursor = 0;
      queueMicrotask(() => inputEl?.focus());
    }
    if (!open && dialogEl.open) dialogEl.close();
  });

  // Keep the highlight inside the list as it shrinks.
  $effect(() => {
    if (cursor > results.length - 1) cursor = Math.max(0, results.length - 1);
  });

  function choose(item) {
    if (!item) return;
    navigate(item.path);
    onclose?.();
  }

  function onKeydown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      cursor = (cursor + 1) % Math.max(1, results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      cursor = (cursor - 1 + results.length) % Math.max(1, results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[cursor]);
    }
  }
</script>

<dialog bind:this={dialogEl} onclose={() => onclose?.()} onclick={(e) => e.target === dialogEl && onclose?.()}>
  <div class="palette">
    <div class="search">
      <Icon name="search" size={16} />
      <input
        bind:this={inputEl}
        bind:value={query}
        onkeydown={onKeydown}
        id="command-palette-input"
        class="query"
        type="search"
        placeholder="Search candidates, jobs and views…"
        autocomplete="off"
        aria-label="Search"
      />
      <kbd>Esc</kbd>
    </div>
    <ul role="listbox" aria-label="Results">
      {#each results as item, i (item.kind + item.id)}
        <li>
          <button
            type="button"
            class="row"
            class:active={i === cursor}
            role="option"
            aria-selected={i === cursor}
            onmouseenter={() => (cursor = i)}
            onclick={() => choose(item)}
          >
            {#if item.kind === 'candidate'}
              <Avatar candidate={item.candidate} size={26} />
              <span class="label">
                <strong>{item.candidate.name}</strong>
                <small>{ats.jobTitle(item.candidate.jobId)}</small>
              </span>
              <StageBadge stage={item.candidate.stage} size="sm" />
            {:else}
              <span class="glyph"><Icon name={item.icon} size={15} /></span>
              <span class="label"><strong>{item.label}</strong></span>
              <span class="hint">Go to</span>
            {/if}
          </button>
        </li>
      {:else}
        <li class="none">Nothing matches “{query}”.</li>
      {/each}
    </ul>
  </div>
</dialog>

<style>
  dialog {
    padding: 0;
    border: 0;
    background: transparent;
    inline-size: min(560px, calc(100vw - 32px));
    margin-block-start: 12vh;
  }
  dialog::backdrop {
    background: rgba(9, 20, 26, 0.5);
    backdrop-filter: blur(2px);
  }
  .palette {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    color: var(--ink);
  }
  .search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-block-end: 1px solid var(--line);
    color: var(--ink-3);
  }
  .query {
    flex: 1;
    border: 0;
    background: none;
    font-size: 15px;
    outline: none;
    color: var(--ink);
    min-inline-size: 0;
  }
  .query::-webkit-search-cancel-button {
    display: none;
  }
  kbd {
    font-family: var(--font-ui);
    font-size: 10.5px;
    padding: 2px 6px;
    border: 1px solid var(--line-strong);
    border-radius: 4px;
    color: var(--ink-4);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 6px;
    max-block-size: 52vh;
    overflow: auto;
  }
  .row {
    inline-size: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 9px;
    border: 0;
    border-radius: var(--radius-sm);
    background: none;
    text-align: start;
    cursor: pointer;
  }
  .row.active {
    background: var(--brand-wash);
  }
  .glyph {
    display: grid;
    place-items: center;
    inline-size: 26px;
    block-size: 26px;
    border-radius: 6px;
    background: var(--surface-3);
    color: var(--ink-2);
    flex: none;
  }
  .label {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }
  .label strong {
    font-size: 13.5px;
    font-weight: 500;
  }
  .label small {
    font-size: 11.5px;
    color: var(--ink-4);
  }
  .hint,
  .none {
    font-size: 11.5px;
    color: var(--ink-4);
  }
  .none {
    padding: 18px;
    text-align: center;
  }
</style>
