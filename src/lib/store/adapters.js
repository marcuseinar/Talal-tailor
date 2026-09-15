/**
 * Storage adapters.
 *
 * The app never talks to a storage backend directly — it talks to this
 * contract, so the same UI runs against browser storage today and a real API
 * later. Swapping is a one-line change in `createAtsStore`.
 *
 * Contract:
 *   load()                  -> Promise<{candidates, jobs, meta} | null>
 *   putCandidate(candidate) -> Promise<void>
 *   removeCandidate(id)     -> Promise<void>
 *   putMeta(meta)           -> Promise<void>
 *   replaceAll(state)       -> Promise<void>
 *   clear()                 -> Promise<void>
 *   subscribe(fn)           -> () => void      (remote change notifications)
 */

const VERSION = 1;

/** Non-persistent. Used when storage is blocked (private mode, sandboxes). */
export function createMemoryAdapter() {
  let snapshot = null;
  return {
    id: 'memory',
    label: 'This session only',
    description: 'Changes are lost when the tab closes — browser storage is unavailable here.',
    persistent: false,
    async load() {
      return snapshot;
    },
    async putCandidate() {},
    async removeCandidate() {},
    async putMeta() {},
    async replaceAll(state) {
      snapshot = structuredClone(state);
    },
    async clear() {
      snapshot = null;
    },
    subscribe() {
      return () => {};
    }
  };
}

/**
 * Browser storage, with cross-tab sync.
 *
 * Writes are whole-document because the dataset is small (tens of KB); the
 * per-entity methods exist so a networked adapter can be fine-grained without
 * the app changing.
 */
export function createLocalAdapter(key = 'talal-tailor/state') {
  /** @type {Storage|null} */
  let store = null;
  try {
    // Touch it — Safari private mode throws on write, not on access.
    window.localStorage.setItem(`${key}:probe`, '1');
    window.localStorage.removeItem(`${key}:probe`);
    store = window.localStorage;
  } catch {
    store = null;
  }
  if (!store) return createMemoryAdapter();

  let cache = null;

  const read = () => {
    if (cache) return cache;
    try {
      const raw = store.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.version !== VERSION) return null;
      cache = parsed.state;
      return cache;
    } catch {
      return null;
    }
  };

  const write = (state) => {
    cache = state;
    try {
      store.setItem(key, JSON.stringify({ version: VERSION, savedAt: new Date().toISOString(), state }));
      return true;
    } catch {
      // Quota — most likely a large uploaded CV. Surfaced by the caller.
      return false;
    }
  };

  const mutate = (fn) => {
    const state = read() ?? { candidates: [], jobs: [], meta: {} };
    fn(state);
    return write(state);
  };

  return {
    id: 'local',
    label: 'This browser',
    description: 'Saved in this browser only. Other people opening the link start from the seeded demo.',
    persistent: true,
    async load() {
      return read();
    },
    async putCandidate(candidate) {
      const ok = mutate((state) => {
        const i = state.candidates.findIndex((c) => c.id === candidate.id);
        if (i >= 0) state.candidates[i] = candidate;
        else state.candidates.unshift(candidate);
      });
      if (!ok) throw new Error('Browser storage is full — try removing an uploaded CV.');
    },
    async removeCandidate(id) {
      mutate((state) => {
        state.candidates = state.candidates.filter((c) => c.id !== id);
      });
    },
    async putMeta(meta) {
      mutate((state) => {
        state.meta = { ...state.meta, ...meta };
      });
    },
    async replaceAll(state) {
      const ok = write(structuredClone(state));
      if (!ok) throw new Error('Browser storage is full.');
    },
    async clear() {
      cache = null;
      try {
        store.removeItem(key);
      } catch {
        /* nothing useful to do */
      }
    },
    /** Fires when another tab writes — gives the demo live multi-tab sync. */
    subscribe(onChange) {
      const handler = (event) => {
        if (event.key !== key) return;
        cache = null;
        onChange(read());
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
  };
}

/**
 * Reference implementation for a real backend. Not wired up by default —
 * point `createAtsStore` at it once an API exists:
 *
 *   createAtsStore({ adapter: createRestAdapter('/api') })
 *
 * The endpoints it expects are deliberately boring:
 *   GET    {base}/state                 -> {candidates, jobs, meta}
 *   PUT    {base}/candidates/:id        <- candidate body
 *   DELETE {base}/candidates/:id
 *   PATCH  {base}/meta                  <- partial meta
 *   PUT    {base}/state                 <- whole snapshot (used by reset)
 *   GET    {base}/events                -> Server-Sent Events for live updates
 */
export function createRestAdapter(base, { fetchImpl = globalThis.fetch, headers = {} } = {}) {
  const url = (path) => `${base.replace(/\/$/, '')}${path}`;
  const send = async (method, path, body) => {
    const res = await fetchImpl(url(path), {
      method,
      headers: { 'content-type': 'application/json', ...headers },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
    return res.status === 204 ? null : res.json();
  };

  return {
    id: 'rest',
    label: 'Shared workspace',
    description: 'Everyone in the workspace sees the same pipeline.',
    persistent: true,
    load: () => send('GET', '/state'),
    putCandidate: (candidate) => send('PUT', `/candidates/${candidate.id}`, candidate),
    removeCandidate: (id) => send('DELETE', `/candidates/${id}`),
    putMeta: (meta) => send('PATCH', '/meta', meta),
    replaceAll: (state) => send('PUT', '/state', state),
    clear: () => send('DELETE', '/state'),
    subscribe(onChange) {
      if (typeof EventSource === 'undefined') return () => {};
      const source = new EventSource(url('/events'));
      source.onmessage = (event) => {
        try {
          onChange(JSON.parse(event.data));
        } catch {
          /* ignore malformed frames */
        }
      };
      return () => source.close();
    }
  };
}

/** Pick the best adapter this environment supports. */
export function createDefaultAdapter() {
  if (typeof window === 'undefined') return createMemoryAdapter();
  return createLocalAdapter();
}
