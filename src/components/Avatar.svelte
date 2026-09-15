<script>
  import { AVATAR_SVG } from '../lib/data/avatars.js';
  import { initials, hueFor } from '../lib/format.js';

  let { candidate, size = 40, ring = false } = $props();

  const svg = $derived(AVATAR_SVG[candidate?.id] ?? null);
  const photo = $derived(candidate?.photo ?? null);
  const hue = $derived(hueFor(candidate?.name ?? candidate?.id ?? ''));
</script>

<span
  class="avatar"
  class:ring
  style="--size:{size}px; --hue:{hue}"
  aria-hidden="true"
>
  {#if photo}
    <img src={photo} alt="" />
  {:else if svg}
    <!-- Bundled CC0 illustration; inlined so it inherits crisp scaling. -->
    {@html svg}
  {:else}
    <span class="fallback">{initials(candidate?.name ?? '')}</span>
  {/if}
</span>

<style>
  .avatar {
    inline-size: var(--size);
    block-size: var(--size);
    border-radius: 50%;
    overflow: hidden;
    flex: none;
    display: grid;
    place-items: center;
    background: hsl(var(--hue) 34% 92%);
    color: hsl(var(--hue) 40% 28%);
    position: relative;
  }

  :global(:root[data-theme='dark']) .avatar,
  :global(:root:not([data-theme='light'])) .avatar {
    background: hsl(var(--hue) 22% 86%);
  }

  .ring {
    box-shadow: 0 0 0 2px var(--surface), 0 0 0 3.5px var(--line-strong);
  }

  .avatar :global(svg),
  .avatar img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    display: block;
  }

  .fallback {
    font-size: calc(var(--size) * 0.38);
    font-weight: 600;
    letter-spacing: 0.02em;
  }
</style>
