<script>
  import { STAGE_BY_ID } from '../lib/store/schema.js';
  let { stage, size = 'md' } = $props();
  const meta = $derived(STAGE_BY_ID[stage]);
</script>

{#if meta}
  <span class="badge" class:sm={size === 'sm'} style="--tone: var(--tone-{meta.tone}); --wash: var(--tone-{meta.tone}-wash);">
    <span class="dot"></span>{meta.label}
  </span>
{/if}

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 9px 2px 7px;
    border-radius: 999px;
    background: var(--wash);
    color: var(--tone);
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;
  }
  .sm {
    font-size: 10.5px;
    padding: 1px 7px 1px 5px;
  }
  .dot {
    inline-size: 6px;
    block-size: 6px;
    border-radius: 50%;
    background: currentColor;
    flex: none;
  }
</style>
