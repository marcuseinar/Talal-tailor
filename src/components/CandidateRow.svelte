<script>
  import { ats } from '../lib/store/ats.svelte.js';
  import { relativeTime, pluralise } from '../lib/format.js';
  import Avatar from './Avatar.svelte';
  import StageBadge from './StageBadge.svelte';
  import Rating from './Rating.svelte';
  import Icon from './Icon.svelte';

  let { candidate, selected = false, onselect = null, showStage = true } = $props();

  const rating = $derived(ats.rating(candidate));
  const days = $derived(ats.daysInStage(candidate));
</script>

<div class="row" class:unread={candidate.unread} class:selected>
  {#if onselect}
    <label class="pick">
      <input
        type="checkbox"
        checked={selected}
        onchange={(e) => onselect(candidate.id, e.currentTarget.checked)}
        aria-label="Select {candidate.name}"
      />
    </label>
  {/if}

  <a class="link" href="#/candidates/{candidate.id}">
    <Avatar {candidate} size={38} />

    <span class="who">
      <span class="name">
        {candidate.name}
        {#if candidate.unread}<span class="new">New</span>{/if}
      </span>
      <span class="headline">{candidate.headline}</span>
    </span>

    <span class="job">{ats.jobTitle(candidate.jobId)}</span>

    {#if showStage}
      <span class="stage"><StageBadge stage={candidate.stage} /></span>
    {/if}

    <span class="score">
      {#if rating != null}
        <Rating value={rating} size={12} />
      {:else}
        <span class="dash">Not scored</span>
      {/if}
    </span>

    <span class="when" title="Applied {relativeTime(candidate.appliedAt)}">
      {pluralise(days, 'day')} in stage
    </span>
  </a>

  <button
    class="star"
    class:on={candidate.starred}
    type="button"
    onclick={() => ats.toggleStar(candidate.id)}
    aria-pressed={candidate.starred}
    aria-label="{candidate.starred ? 'Remove star from' : 'Star'} {candidate.name}"
  >
    <Icon name="star" size={16} filled={candidate.starred} />
  </button>
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-inline: 8px 10px;
    border-block-end: 1px solid var(--line);
    background: var(--surface);
    transition: background 0.12s ease;
  }
  .row:hover {
    background: var(--surface-2);
  }
  .selected {
    background: var(--brand-wash);
  }
  .unread .name {
    font-weight: 700;
  }
  .unread {
    box-shadow: inset 3px 0 0 var(--accent);
  }

  .pick {
    display: grid;
    place-items: center;
    padding: 0 6px;
  }
  .pick input {
    inline-size: 15px;
    block-size: 15px;
    accent-color: var(--brand);
    cursor: pointer;
  }

  .link {
    flex: 1;
    display: grid;
    grid-template-columns: auto minmax(0, 2.1fr) minmax(0, 1.2fr) auto auto auto;
    align-items: center;
    gap: 14px;
    padding: 11px 6px;
    text-decoration: none;
    color: inherit;
    min-inline-size: 0;
  }

  .who {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }
  .name {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13.8px;
    font-weight: 500;
  }
  .new {
    padding: 0 5px;
    border-radius: 3px;
    background: var(--accent);
    color: #fff;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .headline {
    font-size: 12px;
    color: var(--ink-4);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .job {
    font-size: 12.5px;
    color: var(--ink-3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .score {
    min-inline-size: 78px;
  }
  .dash {
    font-size: 11.5px;
    color: var(--ink-4);
  }
  .when {
    font-size: 11.5px;
    color: var(--ink-4);
    white-space: nowrap;
    min-inline-size: 92px;
    text-align: end;
  }

  .star {
    border: 0;
    background: none;
    padding: 7px;
    border-radius: var(--radius-sm);
    color: var(--ink-4);
    cursor: pointer;
  }
  .star:hover {
    background: var(--surface-3);
    color: var(--accent);
  }
  .star.on {
    color: var(--accent);
  }

  @media (max-width: 1080px) {
    .link {
      grid-template-columns: auto minmax(0, 2fr) auto auto;
    }
    .job,
    .when {
      display: none;
    }
  }
  @media (max-width: 620px) {
    .link {
      grid-template-columns: auto minmax(0, 1fr) auto;
    }
    .score {
      display: none;
    }
  }
</style>
