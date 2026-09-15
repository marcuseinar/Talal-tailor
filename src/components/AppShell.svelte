<script>
  /** Chrome for the hiring-side views: sidebar, search, theme, user. */
  import { ats } from '../lib/store/ats.svelte.js';
  import { theme } from '../lib/theme.svelte.js';
  import { navigate } from '../lib/router.svelte.js';
  import Icon from './Icon.svelte';
  import Mascot from './Mascot.svelte';

  let { path = '/', onOpenPalette, children } = $props();

  let navOpen = $state(false);

  const NAV = $derived([
    { path: '/inbox', label: 'Inbox', icon: 'inbox', badge: ats.unreadCount },
    { path: '/pipeline', label: 'Pipeline', icon: 'pipeline', badge: 0 },
    { path: '/jobs', label: 'Jobs', icon: 'briefcase', badge: 0 },
    { path: '/insights', label: 'Insights', icon: 'insights', badge: 0 }
  ]);

  const isActive = (target) => path === target || path.startsWith(`${target}/`);
</script>

<div class="shell">
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="topbar">
    <button
      class="btn btn--ghost btn--sm nav-toggle"
      type="button"
      onclick={() => (navOpen = !navOpen)}
      aria-expanded={navOpen}
      aria-controls="sidebar"
    >
      <Icon name="menu" size={18} label="Menu" />
    </button>

    <a class="wordmark" href="#/">
      <Mascot variant="face" size={26} alt="" />
      <span>Talal&nbsp;Tailor</span>
    </a>

    <button class="searchbar" type="button" onclick={onOpenPalette}>
      <Icon name="search" size={15} />
      <span>Search candidates…</span>
      <kbd>⌘K</kbd>
    </button>

    <div class="topbar-actions">
      <a class="btn btn--sm" href="#/apply">
        <Icon name="external" size={14} />
        <span class="hide-sm">Candidate view</span>
      </a>
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        onclick={() => theme.toggle()}
        aria-label="Switch to {theme.resolved === 'dark' ? 'light' : 'dark'} theme"
      >
        <Icon name={theme.resolved === 'dark' ? 'sun' : 'moon'} size={16} />
      </button>
      <span class="who" title="Signed in as Talal — hiring manager">
        <Mascot variant="face" size={28} alt="Talal" />
      </span>
    </div>
  </header>

  <div class="frame">
    <nav id="sidebar" class="sidebar" class:open={navOpen} aria-label="Sections">
      <ul>
        {#each NAV as item (item.path)}
          <li>
            <a
              href="#{item.path}"
              class:active={isActive(item.path)}
              aria-current={isActive(item.path) ? 'page' : undefined}
              onclick={() => (navOpen = false)}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {#if item.badge > 0}<span class="badge numeric">{item.badge}</span>{/if}
            </a>
          </li>
        {/each}
      </ul>

      <div class="sidebar-foot">
        <p class="eyebrow">Pipeline</p>
        <p class="stat"><strong class="numeric">{ats.activeCount}</strong> candidates in process</p>
        <button class="btn btn--sm" type="button" onclick={() => navigate('/about')}>
          <Icon name="settings" size={14} /> About this demo
        </button>
      </div>
    </nav>

    {#if navOpen}
      <button class="scrim" type="button" aria-label="Close menu" onclick={() => (navOpen = false)}></button>
    {/if}

    <main id="main" class="main">
      {@render children?.()}
    </main>
  </div>
</div>

<style>
  .shell {
    min-block-size: 100%;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    position: sticky;
    top: env(safe-area-inset-top, 0px);
    z-index: 40;
    display: flex;
    align-items: center;
    gap: 12px;
    block-size: var(--header-h);
    padding-inline: 14px;
    background: var(--surface);
    border-block-end: 1px solid var(--line);
  }

  .nav-toggle {
    display: none;
  }

  .wordmark {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: var(--ink);
    text-decoration: none;
    flex: none;
  }

  .searchbar {
    flex: 1;
    max-inline-size: 380px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 10px;
    margin-inline-start: 6px;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    color: var(--ink-4);
    font-size: 13px;
    cursor: pointer;
    text-align: start;
  }
  .searchbar:hover {
    border-color: var(--line-strong);
    color: var(--ink-3);
  }
  .searchbar span {
    flex: 1;
  }
  .searchbar kbd {
    font-family: var(--font-ui);
    font-size: 10.5px;
    padding: 1px 5px;
    border: 1px solid var(--line-strong);
    border-radius: 4px;
  }

  .topbar-actions {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .who {
    display: grid;
    place-items: center;
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--surface), 0 0 0 3px var(--line-strong);
  }

  .frame {
    flex: 1;
    display: grid;
    grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
    align-items: start;
  }

  .sidebar {
    position: sticky;
    top: calc(var(--header-h) + env(safe-area-inset-top, 0px));
    block-size: calc(100dvh - var(--header-h) - env(safe-area-inset-top, 0px));
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 12px;
    border-inline-end: 1px solid var(--line);
    background: var(--surface);
  }
  .sidebar ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .sidebar a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    color: var(--ink-2);
    font-size: 13.5px;
    font-weight: 500;
    text-decoration: none;
  }
  .sidebar a:hover {
    background: var(--surface-3);
    color: var(--ink);
  }
  .sidebar a.active {
    background: var(--brand-wash);
    color: var(--brand);
    font-weight: 600;
  }
  .badge {
    margin-inline-start: auto;
    min-inline-size: 19px;
    padding: 1px 5px;
    border-radius: 999px;
    background: var(--accent);
    color: #fff;
    font-size: 10.5px;
    font-weight: 700;
    text-align: center;
  }

  .sidebar-foot {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px 10px;
    border-radius: var(--radius);
    background: var(--surface-2);
    border: 1px solid var(--line);
  }
  .stat {
    font-size: 12.5px;
    color: var(--ink-3);
  }
  .stat strong {
    font-size: 17px;
    color: var(--ink);
    margin-inline-end: 3px;
  }
  .sidebar-foot .btn {
    margin-block-start: 4px;
  }

  .main {
    min-inline-size: 0;
  }

  .scrim {
    display: none;
  }

  @media (max-width: 860px) {
    .nav-toggle {
      display: inline-flex;
    }
    .frame {
      grid-template-columns: minmax(0, 1fr);
    }
    .sidebar {
      position: fixed;
      inset-block: calc(var(--header-h) + env(safe-area-inset-top, 0px)) 0;
      inset-inline-start: 0;
      inline-size: var(--sidebar-w);
      z-index: 45;
      transform: translateX(-102%);
      transition: transform 0.18s ease;
      box-shadow: var(--shadow-lg);
      block-size: auto;
    }
    .sidebar.open {
      transform: none;
    }
    .scrim {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 44;
      border: 0;
      background: rgba(9, 20, 26, 0.4);
    }
    .searchbar span {
      display: none;
    }
    .searchbar {
      flex: none;
      inline-size: auto;
      margin-inline-start: auto;
    }
    .hide-sm {
      display: none;
    }
  }

  @media (max-width: 520px) {
    .wordmark span {
      display: none;
    }
    .searchbar kbd {
      display: none;
    }
  }
</style>
