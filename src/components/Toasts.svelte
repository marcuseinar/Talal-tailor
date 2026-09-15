<script module>
  /** Tiny global toast queue — imported anywhere, rendered once in the shell. */
  let items = $state([]);
  let seq = 0;

  export function toast(message, { tone = 'info', timeout = 4200 } = {}) {
    const id = ++seq;
    items = [...items, { id, message, tone }];
    if (timeout) setTimeout(() => dismiss(id), timeout);
    return id;
  }

  export function dismiss(id) {
    items = items.filter((t) => t.id !== id);
  }

  export function getToasts() {
    return items;
  }
</script>

<script>
  const list = $derived(getToasts());
</script>

<div class="toasts" role="status" aria-live="polite">
  {#each list as item (item.id)}
    <div class="toast" data-tone={item.tone}>
      <span>{item.message}</span>
      <button type="button" onclick={() => dismiss(item.id)} aria-label="Dismiss">✕</button>
    </div>
  {/each}
</div>

<style>
  .toasts {
    position: fixed;
    inset-block-end: calc(16px + env(safe-area-inset-bottom, 0px));
    inset-inline: 16px;
    z-index: 120;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
  }
  .toast {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 14px;
    max-inline-size: min(460px, 100%);
    padding: 10px 12px 10px 14px;
    border-radius: var(--radius);
    background: var(--ink);
    color: var(--surface);
    font-size: 13px;
    box-shadow: var(--shadow-lg);
    animation: rise 0.18s ease-out;
  }
  .toast[data-tone='success'] {
    background: var(--good);
    color: #fff;
  }
  .toast[data-tone='error'] {
    background: var(--bad);
    color: #fff;
  }
  .toast button {
    border: 0;
    background: none;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    font-size: 12px;
    padding: 2px 4px;
  }
  .toast button:hover {
    opacity: 1;
  }
  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
</style>
