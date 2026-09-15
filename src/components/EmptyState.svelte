<script>
  import Icon from './Icon.svelte';
  let { icon = 'inbox', title, description = '', children } = $props();
</script>

<div class="empty">
  <span class="glyph"><Icon name={icon} size={22} /></span>
  <h3>{title}</h3>
  {#if description}<p>{description}</p>{/if}
  {@render children?.()}
</div>

<style>
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 48px 24px;
    text-align: center;
    color: var(--ink-3);
  }
  .glyph {
    display: grid;
    place-items: center;
    inline-size: 46px;
    block-size: 46px;
    border-radius: 50%;
    background: var(--surface-3);
    color: var(--ink-3);
    margin-block-end: 2px;
  }
  h3 {
    font-size: 15px;
    color: var(--ink);
  }
  p {
    font-size: 13px;
    max-inline-size: 42ch;
  }
</style>
