<script>
  import { ats } from './lib/store/ats.svelte.js';
  import { theme } from './lib/theme.svelte.js';
  import { createRouter } from './lib/router.svelte.js';
  import AppShell from './components/AppShell.svelte';
  import CommandPalette from './components/CommandPalette.svelte';
  import Toasts, { toast } from './components/Toasts.svelte';

  import Landing from './routes/Landing.svelte';
  import Portal from './routes/apply/Portal.svelte';
  import ApplyForm from './routes/apply/ApplyForm.svelte';
  import Submitted from './routes/apply/Submitted.svelte';
  import Inbox from './routes/Inbox.svelte';
  import Pipeline from './routes/Pipeline.svelte';
  import CandidateDetail from './routes/CandidateDetail.svelte';
  import Jobs from './routes/Jobs.svelte';
  import Insights from './routes/Insights.svelte';
  import About from './routes/About.svelte';
  import NotFound from './routes/NotFound.svelte';

  /** `chrome: 'public'` routes render standalone; the rest get the app shell. */
  const router = createRouter([
    { path: '/', component: Landing, chrome: 'bare' },
    { path: '/apply', component: Portal, chrome: 'public' },
    { path: '/apply/:jobId', component: ApplyForm, chrome: 'public' },
    { path: '/applied/:id', component: Submitted, chrome: 'public' },
    { path: '/inbox', component: Inbox, chrome: 'app' },
    { path: '/pipeline', component: Pipeline, chrome: 'app' },
    { path: '/candidates/:id', component: CandidateDetail, chrome: 'app' },
    { path: '/jobs', component: Jobs, chrome: 'app' },
    { path: '/insights', component: Insights, chrome: 'app' },
    { path: '/about', component: About, chrome: 'app' },
    { path: '*', component: NotFound, chrome: 'app' }
  ]);

  let paletteOpen = $state(false);

  const match = $derived(router.current);
  const Route = $derived(match.route.component);

  $effect(() => {
    theme.init();
    const stopRouter = router.listen();
    let stopStore;
    ats.init().then((teardown) => (stopStore = teardown));

    const onKeydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        paletteOpen = true;
      }
    };
    window.addEventListener('keydown', onKeydown);

    return () => {
      stopRouter();
      stopStore?.();
      window.removeEventListener('keydown', onKeydown);
    };
  });

  // Storage failures and bulk actions report through the shared toast queue.
  $effect(() => {
    const notice = ats.notice;
    if (!notice) return;
    toast(notice.message, { tone: notice.tone });
    ats.notice = null;
  });
</script>

<svelte:head>
  <title>{match.route.path === '/' ? 'Talal Tailor' : `Talal Tailor — ${match.route.path.split('/')[1] ?? ''}`}</title>
</svelte:head>

{#if !ats.ready}
  <div class="boot" role="status">
    <span class="spinner" aria-hidden="true"></span>
    <span>Loading the pipeline…</span>
  </div>
{:else if match.route.chrome === 'app'}
  <AppShell path={match.path} onOpenPalette={() => (paletteOpen = true)}>
    <Route params={match.params} query={match.query} />
  </AppShell>
{:else}
  <Route params={match.params} query={match.query} />
{/if}

<CommandPalette open={paletteOpen} onclose={() => (paletteOpen = false)} />
<Toasts />

<style>
  .boot {
    min-block-size: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: var(--ink-3);
    font-size: 13.5px;
  }
  .spinner {
    inline-size: 22px;
    block-size: 22px;
    border-radius: 50%;
    border: 2px solid var(--line);
    border-top-color: var(--brand);
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
</style>
