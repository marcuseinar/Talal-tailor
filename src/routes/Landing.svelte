<script>
  /** The front door: pick which side of the hiring process you want to see. */
  import { ats } from '../lib/store/ats.svelte.js';
  import { theme } from '../lib/theme.svelte.js';
  import Mascot from '../components/Mascot.svelte';
  import Icon from '../components/Icon.svelte';

  const openRoles = $derived(ats.jobs.length);
  const waiting = $derived(ats.inStage('inbox').length);
  const inProcess = $derived(ats.activeCount);
</script>

<div class="landing">
  <header class="top">
    <span class="wordmark">
      <Mascot variant="face" size={30} alt="" />
      Talal Tailor
    </span>
    <div class="top-actions">
      <button
        class="ghost"
        type="button"
        onclick={() => theme.toggle()}
        aria-label="Switch to {theme.resolved === 'dark' ? 'light' : 'dark'} theme"
      >
        <Icon name={theme.resolved === 'dark' ? 'sun' : 'moon'} size={16} />
      </button>
      <a class="ghost" href="#/about">About</a>
    </div>
  </header>

  <main id="main" class="hero">
    <div class="copy">
      <p class="eyebrow">Applicant tracking · proof of concept</p>
      <h1>Two sides of<br />the same hire.</h1>
      <p class="lede">
        A working recruitment system for <strong>Helio</strong>, a fictional grid-software company
        with {openRoles} open roles. Pick a side — the two views share one live dataset, so an
        application submitted on the left lands in the inbox on the right.
      </p>

      <div class="choices">
        <a class="choice" href="#/apply">
          <span class="choice-icon"><Icon name="user" size={19} /></span>
          <span class="choice-body">
            <strong>I'm applying</strong>
            <span>Browse the open roles, then submit an application with your email, a PDF CV and a photo.</span>
          </span>
          <span class="choice-go"><Icon name="arrowRight" size={17} /></span>
        </a>

        <a class="choice choice--primary" href="#/inbox">
          <span class="choice-icon"><Icon name="inbox" size={19} /></span>
          <span class="choice-body">
            <strong>I'm hiring</strong>
            <span>
              The recruiter workspace — {waiting} new application{waiting === 1 ? '' : 's'} waiting,
              {inProcess} candidates in process.
            </span>
          </span>
          <span class="choice-go"><Icon name="arrowRight" size={17} /></span>
        </a>
      </div>

      <p class="foot">
        Every candidate, company and CV here is invented. CVs are generated as real PDFs you can
        download.
      </p>
    </div>

    <div class="mascot">
      <Mascot say="أنا أفضل من تيم تيلور" size={330} alt="Talal, the mascot, giving a thumbs up" />
    </div>
  </main>
</div>

<style>
  .landing {
    flex: 1;
    min-block-size: 100%;
    display: flex;
    flex-direction: column;
    background:
      radial-gradient(120% 90% at 82% 8%, rgba(86, 179, 201, 0.16), transparent 62%),
      linear-gradient(168deg, #0d2f3a 0%, #102b34 48%, #0b2028 100%);
    color: #eaf5f8;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px clamp(18px, 5vw, 56px);
  }
  .wordmark {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.015em;
  }
  .top-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    border: 1px solid rgba(234, 245, 248, 0.22);
    border-radius: var(--radius-sm);
    background: rgba(234, 245, 248, 0.06);
    color: #eaf5f8;
    font-size: 13px;
    text-decoration: none;
    cursor: pointer;
  }
  .ghost:hover {
    background: rgba(234, 245, 248, 0.14);
  }

  .hero {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: clamp(24px, 5vw, 64px);
    padding: clamp(16px, 4vw, 40px) clamp(18px, 5vw, 56px) clamp(32px, 6vw, 64px);
    max-inline-size: 1180px;
    inline-size: 100%;
    margin-inline: auto;
  }

  .copy {
    max-inline-size: 620px;
  }
  .eyebrow {
    color: #8fc4d1;
  }
  h1 {
    margin-block-start: 14px;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(38px, 7vw, 66px);
    line-height: 1.02;
    letter-spacing: -0.015em;
  }
  .lede {
    margin-block-start: 18px;
    max-inline-size: 54ch;
    font-size: clamp(14px, 1.6vw, 16px);
    line-height: 1.6;
    color: #bcdbe3;
  }
  .lede strong {
    color: #eaf5f8;
    font-weight: 600;
  }

  .choices {
    margin-block-start: 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-inline-size: 560px;
  }
  .choice {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border: 1px solid rgba(234, 245, 248, 0.2);
    border-radius: var(--radius-lg);
    background: rgba(234, 245, 248, 0.07);
    color: inherit;
    text-decoration: none;
    transition: background 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
  }
  .choice:hover {
    background: rgba(234, 245, 248, 0.13);
    border-color: rgba(234, 245, 248, 0.42);
    transform: translateY(-1px);
  }
  .choice--primary {
    background: #eaf5f8;
    color: #0d2530;
    border-color: #eaf5f8;
  }
  .choice--primary:hover {
    background: #fff;
    border-color: #fff;
  }
  .choice-icon {
    display: grid;
    place-items: center;
    inline-size: 40px;
    block-size: 40px;
    border-radius: 11px;
    background: rgba(234, 245, 248, 0.14);
    flex: none;
  }
  .choice--primary .choice-icon {
    background: var(--accent);
    color: #fff;
  }
  .choice-body {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-inline-size: 0;
  }
  .choice-body strong {
    font-size: 16px;
    font-weight: 600;
  }
  .choice-body span {
    font-size: 12.8px;
    line-height: 1.45;
    color: #bcdbe3;
  }
  .choice--primary .choice-body span {
    color: #3d616e;
  }
  .choice-go {
    flex: none;
    opacity: 0.6;
  }
  .choice:hover .choice-go {
    opacity: 1;
  }

  .foot {
    margin-block-start: 22px;
    font-size: 12px;
    color: #7fa9b6;
    max-inline-size: 52ch;
  }

  .mascot {
    display: flex;
    justify-content: center;
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
    .mascot {
      order: -1;
      justify-content: flex-start;
    }
    .mascot :global(figure) {
      inline-size: min(270px, 74vw);
    }
  }
</style>
