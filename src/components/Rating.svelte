<script>
  /** Read-only score display, or an interactive 1-5 picker when `onchange` is set. */
  import { RATING_LABELS } from '../lib/store/schema.js';

  let { value = null, onchange = null, size = 14, showNumber = false, name = '' } = $props();
  const rounded = $derived(value == null ? 0 : Math.round(value * 2) / 2);
</script>

<span class="rating" class:interactive={Boolean(onchange)}>
  {#each [1, 2, 3, 4, 5] as star (star)}
    {@const fill = Math.max(0, Math.min(1, rounded - star + 1))}
    {#if onchange}
      <button
        type="button"
        class="star-btn"
        aria-label="{RATING_LABELS[star]} ({star} of 5){name ? ` — ${name}` : ''}"
        aria-pressed={Math.round(rounded) === star}
        onclick={() => onchange(star)}
        style="--size:{size}px"
      >
        <span class="star" style="--fill:{fill}"></span>
      </button>
    {:else}
      <span class="star" style="--size:{size}px; --fill:{fill}"></span>
    {/if}
  {/each}
  {#if showNumber}
    <span class="num numeric">{value == null ? '—' : value.toFixed(1)}</span>
  {/if}
</span>

<style>
  .rating {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
  .star {
    inline-size: var(--size);
    block-size: var(--size);
    display: block;
    background: linear-gradient(
      90deg,
      var(--accent) calc(var(--fill) * 100%),
      var(--line-strong) calc(var(--fill) * 100%)
    );
    -webkit-mask: var(--star-mask) center / contain no-repeat;
    mask: var(--star-mask) center / contain no-repeat;
    --star-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m12 2.6 2.9 5.9 6.5 1-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.5l6.5-1z'/%3E%3C/svg%3E");
  }
  .star-btn {
    padding: 2px;
    border: 0;
    background: none;
    cursor: pointer;
    line-height: 0;
    border-radius: 3px;
  }
  .star-btn:hover .star {
    --fill: 1;
    filter: brightness(1.05);
  }
  .num {
    margin-inline-start: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-2);
  }
</style>
