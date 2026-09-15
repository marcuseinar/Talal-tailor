/**
 * Hash-based router.
 *
 * Hash routing rather than the History API because the built app has to run
 * unchanged from a domain root, a GitHub Pages sub-path, a sandboxed embed and
 * the local filesystem — none of which agree on what a pushState URL means.
 */

/** '/candidates/:id' -> matcher */
function compile(pattern) {
  const keys = [];
  const source = pattern
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      if (segment.startsWith(':')) {
        keys.push(segment.slice(1));
        return '([^/]+)';
      }
      if (segment === '*') {
        keys.push('rest');
        return '(.*)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { regex: new RegExp(`^/${source}/?$`), keys };
}

export function parseHash(hash = window.location.hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const [pathname, search = ''] = raw.split('?');
  return {
    path: pathname.startsWith('/') ? pathname : `/${pathname}`,
    query: Object.fromEntries(new URLSearchParams(search))
  };
}

export function navigate(path, { replace = false, query } = {}) {
  const search = query && Object.keys(query).length ? `?${new URLSearchParams(query)}` : '';
  const target = `#${path}${search}`;
  if (replace) window.history.replaceState(null, '', target);
  else window.location.hash = `${path}${search}`;
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'));
}

/**
 * @param {{path: string, component: any, name?: string}[]} routes
 * `routes` is ordered — the first match wins, so put '*' last.
 */
export function createRouter(routes) {
  const compiled = routes.map((route) => ({ ...route, ...compile(route.path) }));

  let location = $state(parseHash());

  function resolve(current) {
    for (const route of compiled) {
      const match = route.regex.exec(current.path);
      if (!match) continue;
      const params = Object.fromEntries(
        route.keys.map((key, i) => [key, decodeURIComponent(match[i + 1] ?? '')])
      );
      return { route, params, query: current.query, path: current.path };
    }
    return { route: compiled.at(-1), params: {}, query: current.query, path: current.path };
  }

  return {
    get current() {
      return resolve(location);
    },
    get path() {
      return location.path;
    },
    get query() {
      return location.query;
    },
    navigate,
    /** Wire up in an $effect; returns the teardown. */
    listen() {
      const onChange = () => {
        location = parseHash();
        // A fresh view should start at the top, like a page load.
        window.scrollTo({ top: 0 });
      };
      window.addEventListener('hashchange', onChange);
      if (!window.location.hash) navigate('/', { replace: true });
      return () => window.removeEventListener('hashchange', onChange);
    }
  };
}
