<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  type Status = 'stable' | 'preview' | 'unreleased';
  let { status }: { status: Status } = $props();

  const labels = $derived(dict(ui.locale).status);
</script>

<span class="status status-{status}">
  <span class="d" aria-hidden="true"></span>
  {labels[status]}
</span>

<style>
  .status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid;
    line-height: 1;
  }
  .status .d {
    width: 5px;
    height: 5px;
    border-radius: 999px;
  }
  .status-stable {
    color: var(--k-matcha);
    background: color-mix(in oklab, var(--k-matcha-soft) 70%, transparent);
    border-color: color-mix(in oklab, var(--k-matcha) 30%, transparent);
  }
  .status-stable .d {
    background: var(--k-matcha);
  }
  .status-preview {
    color: var(--k-yamabuki);
    background: color-mix(in oklab, var(--k-yamabuki-soft) 70%, transparent);
    border-color: color-mix(in oklab, var(--k-yamabuki) 30%, transparent);
  }
  .status-preview .d {
    background: var(--k-yamabuki);
  }
  .status-unreleased {
    color: var(--k-ink-4);
    border-color: var(--k-line-2);
    background: var(--k-surface-1);
  }
  .status-unreleased .d {
    background: var(--k-ink-4);
  }
</style>
