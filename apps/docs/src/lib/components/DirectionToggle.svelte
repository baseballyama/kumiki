<!--
  Direction toggle (LTR ⇄ RTL). Used to preview RTL behaviour without
  switching to an RTL locale. Shown only on the components catalog and
  detail pages, since the rest of the chrome doesn't depend on it.
-->
<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  const labels = $derived(dict(ui.locale).nav);
  const components = $derived(dict(ui.locale).components);
</script>

<button
  type="button"
  class="dir"
  aria-label={labels.toggleRtl}
  title="{components.dirLtr} / {components.dirRtl}"
  aria-pressed={ui.direction === 'rtl'}
  onclick={() => ui.toggleDirection()}
>
  <span class={ui.direction === 'ltr' ? 'on' : 'off'}>{components.dirLtr}</span>
  <span class="sep" aria-hidden="true">/</span>
  <span class={ui.direction === 'rtl' ? 'on' : 'off'}>{components.dirRtl}</span>
</button>

<style>
  .dir {
    height: 36px;
    padding: 0 12px;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    background: transparent;
    color: var(--k-ink-3);
    font-family: var(--k-font-mono);
    font-size: 11px;
    letter-spacing: 0.05em;
    cursor: pointer;
    display: inline-flex;
    gap: 4px;
    align-items: center;
    transition: border-color var(--k-dur-fast);
  }
  .dir:hover {
    border-color: var(--k-line-2);
  }
  .dir .on {
    color: var(--k-shu);
    font-weight: 600;
  }
  .dir .off {
    color: var(--k-ink-4);
  }
  .dir .sep {
    color: var(--k-ink-5);
  }
</style>
