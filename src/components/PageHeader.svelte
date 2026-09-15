<script>
  let { title, count = null, description = null, actions, children } = $props();
</script>

<header class="page-header">
  <div class="titles">
    <h1>
      {title}{#if count !== null}<span class="count numeric">{count}</span>{/if}
    </h1>
    {#if description}<p>{description}</p>{/if}
  </div>
  {#if actions}<div class="actions">{@render actions()}</div>{/if}
  {@render children?.()}
</header>

<style>
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    padding: 20px clamp(16px, 3vw, 28px) 16px;
  }
  h1 {
    display: flex;
    align-items: baseline;
    gap: 10px;
    font-size: 21px;
  }
  .count {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-4);
  }
  p {
    margin-block-start: 5px;
    font-size: 13px;
    color: var(--ink-3);
    max-inline-size: 66ch;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
</style>
