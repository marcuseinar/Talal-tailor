<script>
  import { ats } from '../lib/store/ats.svelte.js';
  import { theme } from '../lib/theme.svelte.js';
  import Icon from './Icon.svelte';

  let { showBack = false } = $props();
</script>

<header class="bar">
  <a class="brand" href="#/apply">
    <span class="mark" aria-hidden="true"></span>
    <span class="names">
      <strong>{ats.company?.name ?? 'Helio'}</strong>
      <small>Careers</small>
    </span>
  </a>

  <div class="actions">
    {#if showBack}
      <a class="btn btn--sm btn--ghost" href="#/apply">
        <Icon name="arrowLeft" size={14} /> All roles
      </a>
    {/if}
    <button
      class="btn btn--ghost btn--sm"
      type="button"
      onclick={() => theme.toggle()}
      aria-label="Switch to {theme.resolved === 'dark' ? 'light' : 'dark'} theme"
    >
      <Icon name={theme.resolved === 'dark' ? 'sun' : 'moon'} size={16} />
    </button>
    <a class="btn btn--sm" href="#/">
      <Icon name="grid" size={14} /> Switch view
    </a>
  </div>
</header>

<style>
  .bar {
    position: sticky;
    top: env(safe-area-inset-top, 0px);
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px clamp(16px, 4vw, 40px);
    background: color-mix(in srgb, var(--surface) 88%, transparent);
    backdrop-filter: blur(8px);
    border-block-end: 1px solid var(--line);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: var(--ink);
  }
  .mark {
    inline-size: 26px;
    block-size: 26px;
    border-radius: 8px;
    background: linear-gradient(140deg, var(--brand) 20%, var(--accent) 140%);
  }
  .names {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }
  .names strong {
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: -0.015em;
  }
  .names small {
    font-size: 11px;
    color: var(--ink-4);
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
