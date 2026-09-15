<script>
  /** Dialog built on <dialog> so focus trapping and Esc come from the platform. */
  let { open = false, title, subtitle = null, onclose, width = '560px', children, footer } = $props();

  let node = $state(null);

  $effect(() => {
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  });
</script>

<dialog
  bind:this={node}
  style="--w:{width}"
  onclose={() => onclose?.()}
  onclick={(e) => {
    if (e.target === node) onclose?.();
  }}
>
  <div class="panel">
    <header>
      <div>
        <h2>{title}</h2>
        {#if subtitle}<p class="sub">{subtitle}</p>{/if}
      </div>
      <button class="btn btn--ghost btn--sm" type="button" onclick={() => onclose?.()} aria-label="Close">✕</button>
    </header>
    <div class="body">{@render children?.()}</div>
    {#if footer}<footer>{@render footer()}</footer>{/if}
  </div>
</dialog>

<style>
  dialog {
    padding: 0;
    border: 0;
    background: transparent;
    max-inline-size: min(var(--w), calc(100vw - 32px));
    inline-size: 100%;
    max-block-size: calc(100dvh - 48px);
    color: var(--ink);
  }
  dialog::backdrop {
    background: rgba(9, 20, 26, 0.5);
    backdrop-filter: blur(2px);
  }
  .panel {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    max-block-size: calc(100dvh - 48px);
    overflow: hidden;
  }
  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--line);
  }
  h2 {
    font-size: 17px;
  }
  .sub {
    margin-block-start: 3px;
    font-size: 12.5px;
    color: var(--ink-3);
  }
  .body {
    padding: 18px 20px;
    overflow: auto;
  }
  footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 14px 20px;
    border-top: 1px solid var(--line);
    background: var(--surface-2);
    flex-wrap: wrap;
  }
</style>
