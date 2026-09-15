<script>
  /**
   * Drag-and-drop or click-to-browse file field with type and size validation.
   * Emits a data: URI so the file survives a page reload alongside the record.
   */
  import Icon from './Icon.svelte';
  import { readFileAsDataUrl } from '../lib/downloads.js';
  import { normalisePhoto } from '../lib/pdf/raster.js';
  import { formatBytes } from '../lib/format.js';

  let {
    id,
    label,
    hint = '',
    accept = [],
    maxBytes = 4 * 1024 * 1024,
    kind = 'file', // 'file' | 'image'
    value = null,
    onchange,
    required = false
  } = $props();

  let dragging = $state(false);
  let busy = $state(false);
  let error = $state('');
  let input = $state(null);

  const acceptAttr = $derived(accept.join(','));
  const extensions = $derived(
    accept.map((t) => t.split('/')[1]?.toUpperCase().replace('JPEG', 'JPG')).filter(Boolean).join(', ')
  );

  async function handle(fileList) {
    const file = fileList?.[0];
    if (!file) return;
    error = '';

    if (accept.length && !accept.includes(file.type)) {
      error = `That is a ${file.type || 'unknown'} file. Please choose ${extensions}.`;
      return;
    }

    busy = true;
    try {
      let dataUrl = await readFileAsDataUrl(file, maxBytes);
      // Photos get downscaled to a square so a 4 MB upload does not become a
      // 4 MB record. The CV keeps its original bytes.
      if (kind === 'image') dataUrl = await normalisePhoto(dataUrl);
      onchange?.({
        kind: 'upload',
        filename: file.name,
        mime: file.type,
        size: file.size,
        dataUrl,
        uploadedAt: new Date().toISOString()
      });
    } catch (err) {
      error = err.message;
    } finally {
      busy = false;
      if (input) input.value = '';
    }
  }

  function clear() {
    error = '';
    onchange?.(null);
  }
</script>

<div class="field">
  <label class="field-label" for={id}>
    {label}{#if !required}<span class="optional">optional</span>{/if}
  </label>

  {#if value}
    <div class="filled">
      {#if kind === 'image'}
        <img class="thumb" src={value.dataUrl} alt="Uploaded preview" />
      {:else}
        <span class="filetype"><Icon name="file" size={18} /></span>
      {/if}
      <div class="meta">
        <strong>{value.filename}</strong>
        <span>{formatBytes(value.size)}</span>
      </div>
      <button type="button" class="btn btn--sm btn--ghost" onclick={clear}>Remove</button>
    </div>
  {:else}
    <div
      class="drop"
      class:dragging
      class:busy
      role="button"
      tabindex="0"
      aria-describedby="{id}-hint"
      ondragover={(e) => {
        e.preventDefault();
        dragging = true;
      }}
      ondragleave={() => (dragging = false)}
      ondrop={(e) => {
        e.preventDefault();
        dragging = false;
        handle(e.dataTransfer?.files);
      }}
      onclick={() => input?.click()}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          input?.click();
        }
      }}
    >
      <Icon name="upload" size={20} />
      <span class="prompt">
        {busy ? 'Reading file…' : 'Drop a file here, or click to browse'}
      </span>
      <span class="limits">{extensions} · up to {formatBytes(maxBytes)}</span>
    </div>
  {/if}

  <input
    bind:this={input}
    {id}
    type="file"
    class="sr-only"
    accept={acceptAttr}
    onchange={(e) => handle(e.currentTarget.files)}
  />

  {#if error}
    <p class="field-error" role="alert">{error}</p>
  {:else if hint}
    <p class="field-hint" id="{id}-hint">{hint}</p>
  {/if}
</div>

<style>
  .optional {
    margin-inline-start: 6px;
    font-weight: 400;
    font-size: 11px;
    color: var(--ink-4);
  }
  .drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 22px 16px;
    border: 1.5px dashed var(--line-strong);
    border-radius: var(--radius);
    background: var(--surface-2);
    color: var(--ink-3);
    cursor: pointer;
    text-align: center;
    transition: border-color 0.14s ease, background 0.14s ease;
  }
  .drop:hover,
  .dragging {
    border-color: var(--brand);
    background: var(--brand-wash);
    color: var(--brand);
  }
  .busy {
    opacity: 0.7;
    pointer-events: none;
  }
  .prompt {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-2);
  }
  .dragging .prompt,
  .drop:hover .prompt {
    color: var(--brand);
  }
  .limits {
    font-size: 11px;
    color: var(--ink-4);
  }
  .filled {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius);
    background: var(--surface-2);
  }
  .thumb {
    inline-size: 42px;
    block-size: 42px;
    border-radius: 8px;
    object-fit: cover;
    flex: none;
  }
  .filetype {
    display: grid;
    place-items: center;
    inline-size: 42px;
    block-size: 42px;
    border-radius: 8px;
    background: var(--brand-wash);
    color: var(--brand);
    flex: none;
  }
  .meta {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
    flex: 1;
  }
  .meta strong {
    font-size: 13px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta span {
    font-size: 11.5px;
    color: var(--ink-4);
  }
</style>
