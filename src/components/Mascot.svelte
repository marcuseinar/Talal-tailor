<script>
  /**
   * The mascot — and yes, he has an opinion about the incumbent.
   * The bubble is marked lang="ar" dir="rtl" so the browser shapes and orders
   * the Arabic correctly rather than rendering it left to right.
   */
  import mascotFull from '../assets/mascot.webp';
  import mascotFace from '../assets/mascot-face.webp';

  let {
    variant = 'hero', // 'hero' | 'face'
    say = null,
    size = 300,
    alt = 'Talal, the mascot'
  } = $props();
</script>

{#if variant === 'face'}
  <img class="face" src={mascotFace} {alt} style="--size:{size}px" />
{:else}
  <figure class="hero" style="--w:{size}px">
    {#if say}
      <div class="bubble" lang="ar" dir="rtl">
        <p>{say}</p>
      </div>
    {/if}
    <img src={mascotFull} {alt} />
  </figure>
{/if}

<style>
  .face {
    inline-size: var(--size);
    block-size: var(--size);
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  .hero {
    margin: 0;
    inline-size: var(--w);
    max-inline-size: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero img {
    inline-size: 100%;
    display: block;
    filter: drop-shadow(0 18px 32px rgba(6, 22, 28, 0.35));
  }

  .bubble {
    position: relative;
    align-self: flex-start;
    max-inline-size: 100%;
    margin-block-end: 10px;
    padding: 12px 18px 13px;
    border-radius: 18px;
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow);
    border: 1px solid var(--line);
  }

  .bubble p {
    font-family: var(--font-arabic);
    font-size: clamp(16px, 2.2vw, 21px);
    font-weight: 700;
    line-height: 1.7;
    white-space: nowrap;
  }

  /* Tail: a rotated square tucked under the bubble's lower edge. */
  .bubble::after {
    content: '';
    position: absolute;
    inset-block-end: -6px;
    inset-inline-start: 34px;
    inline-size: 13px;
    block-size: 13px;
    background: var(--surface);
    border-inline-end: 1px solid var(--line);
    border-block-end: 1px solid var(--line);
    transform: rotate(45deg);
  }

  @media (max-width: 560px) {
    .bubble p {
      white-space: normal;
    }
  }
</style>
