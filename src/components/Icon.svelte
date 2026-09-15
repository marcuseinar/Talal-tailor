<script module>
  /**
   * One inline SVG sprite, drawn on a 24px grid with a 1.6 stroke so icons sit
   * evenly against Archivo's stems. Paths only — the wrapper supplies size and
   * colour, which keeps icons themeable through the token set.
   */
  export const ICONS = {
    inbox: 'M3 13h5l1.5 3h5L16 13h5M4.2 6.6 3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5l-1.2-6.4A2 2 0 0 0 17.8 5H6.2a2 2 0 0 0-2 1.6Z',
    pipeline: 'M4 4h5v16H4zM15 4h5v9h-5zM9.5 8h5.5M9.5 16h3',
    briefcase: 'M3 8h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18',
    insights: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
    star: 'm12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9Z',
    check: 'm4.5 12.5 5 5 10-11',
    x: 'M6 6l12 12M18 6 6 18',
    plus: 'M12 5v14M5 12h14',
    arrowRight: 'M4 12h15m-6-6 6 6-6 6',
    arrowLeft: 'M20 12H5m6 6-6-6 6-6',
    download: 'M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
    upload: 'M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
    file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
    mail: 'M3 6.5h18v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5zM3.5 7l8.5 6.5L20.5 7',
    note: 'M5 4h14v11l-5 5H5zM19 15h-5v5',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
    users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.9M18 14.2a6.5 6.5 0 0 1 3.5 5.8',
    settings: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.2A1.6 1.6 0 0 0 4.3 6.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V2.5a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.1 1.7Z',
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1.5V4M12 20v2.5M4.2 4.2 6 6M18 18l1.8 1.8M1.5 12H4M20 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8',
    moon: 'M20.5 14.3A8.8 8.8 0 0 1 9.7 3.5a8.8 8.8 0 1 0 10.8 10.8Z',
    menu: 'M4 7h16M4 12h16M4 17h16',
    chevronDown: 'm6 9.5 6 6 6-6',
    chevronRight: 'm9.5 6 6 6-6 6',
    trash: 'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6',
    external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
    filter: 'M3 5h18l-7 8v6l-4 2v-8z',
    building: 'M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 21V10h5a1 1 0 0 1 1 1v10M2 21h20M7.5 8h3M7.5 12h3M7.5 16h3M17 14v3',
    location: 'M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    phone: 'M7.5 3.5h-3a1 1 0 0 0-1 1.1C4.2 12.8 11.2 19.8 19.4 20.5a1 1 0 0 0 1.1-1v-3a1 1 0 0 0-.8-1l-3.2-.6a1 1 0 0 0-1 .4l-1 1.3a13.5 13.5 0 0 1-5.1-5.1l1.3-1a1 1 0 0 0 .4-1l-.6-3.2a1 1 0 0 0-1-.8Z',
    link: 'M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1.7 1.7M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1.7-1.7',
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    command: 'M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z',
    refresh: 'M20 11A8 8 0 0 0 6.3 6.3L4 8.5M4 5v3.5h3.5M4 13a8 8 0 0 0 13.7 4.7L20 15.5M20 19v-3.5h-3.5',
    eye: 'M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
  };
</script>

<script>
  let { name, size = 18, strokeWidth = 1.6, filled = false, label = null, ...rest } = $props();
  const path = $derived(ICONS[name] ?? '');
</script>

<svg
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill={filled ? 'currentColor' : 'none'}
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden={label ? undefined : 'true'}
  role={label ? 'img' : undefined}
  aria-label={label ?? undefined}
  {...rest}
>
  {#if label}<title>{label}</title>{/if}
  <path d={path} />
</svg>

<style>
  svg {
    flex: none;
    display: block;
  }
</style>
