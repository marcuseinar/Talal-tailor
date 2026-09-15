/**
 * Theme preference.
 *
 * Three states, matching how the page is rendered: 'system' leaves the root
 * element unstamped so prefers-color-scheme decides, 'light' and 'dark' stamp
 * data-theme and win over the OS in both directions.
 */
const KEY = 'talal-tailor/theme';

function read() {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function createTheme() {
  let preference = $state(read());

  function apply(value) {
    const root = document.documentElement;
    if (value === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', value);
  }

  return {
    get preference() {
      return preference;
    },
    /** What the viewer actually sees right now. */
    get resolved() {
      if (preference !== 'system') return preference;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    set(value) {
      preference = value;
      apply(value);
      try {
        if (value === 'system') localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, value);
      } catch {
        /* preference just will not persist */
      }
    },
    toggle() {
      this.set(this.resolved === 'dark' ? 'light' : 'dark');
    },
    init() {
      apply(preference);
    }
  };
}

export const theme = createTheme();
