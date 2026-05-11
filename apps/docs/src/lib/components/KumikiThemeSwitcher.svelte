<!--
  Kumiki Atelier theme switcher — toggles between the bundled accent
  presets (shu / matcha / ai / sumi). Selection is persisted via the
  central ui store; the data-kumiki-theme attribute on <html> is the
  source of truth at runtime.
-->
<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';
  import { KUMIKI_THEMES, type KumikiTheme } from '$lib/i18n/store.svelte.js';

  type Props = {
    /** Visual variant. `pill` = compact horizontal toggle group. `card` = labelled card with swatches. */
    variant?: 'pill' | 'card';
  };
  let { variant = 'pill' }: Props = $props();

  function select(id: KumikiTheme): void {
    ui.setKumikiTheme(id);
  }

  // Two locales — Japanese display gets the kanji label, English gets the romanised name.
  const localeKey = $derived<'ja' | 'en'>(ui.locale === 'ja' ? 'ja' : 'en');
</script>

<div
  class="theme-switcher"
  data-variant={variant}
  role="radiogroup"
  aria-label={localeKey === 'ja' ? 'アクセントテーマ' : 'Accent theme'}
>
  {#each KUMIKI_THEMES as theme (theme.id)}
    {@const active = ui.kumikiTheme === theme.id}
    <button
      type="button"
      role="radio"
      aria-checked={active}
      class="swatch"
      class:on={active}
      data-theme-id={theme.id}
      onclick={() => select(theme.id)}
    >
      <span class="dot" aria-hidden="true" data-theme={theme.id}></span>
      <span class="label">
        {#if variant === 'card'}
          <span class="name">{localeKey === 'ja' ? theme.ja : theme.en}</span>
        {:else}
          <span class="name">{theme.ja}</span>
        {/if}
      </span>
    </button>
  {/each}
</div>

<style>
  .theme-switcher {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px;
    border: 1px solid var(--k-line-1);
    border-radius: 999px;
    background: var(--k-surface-1);
  }
  .theme-switcher[data-variant='card'] {
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    border-radius: var(--k-radius-md);
  }

  .swatch {
    appearance: none;
    border: 0;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px;
    border-radius: 999px;
    color: var(--k-ink-3);
    font-family: var(--k-font-mono);
    font-size: 11.5px;
    letter-spacing: 0.04em;
    transition:
      background var(--k-dur-fast),
      color var(--k-dur-fast),
      box-shadow var(--k-dur-fast);
  }
  .theme-switcher[data-variant='card'] .swatch {
    padding: 8px 14px;
    border-radius: var(--k-radius-sm);
    border: 1px solid var(--k-line-1);
    font-family: var(--k-font-display);
    font-size: 13px;
    letter-spacing: -0.005em;
  }
  .swatch:hover {
    color: var(--k-ink-1);
    background: var(--k-surface-2);
  }
  .swatch:focus-visible {
    outline: 2px solid var(--k-shu);
    outline-offset: 2px;
  }
  .swatch.on {
    color: var(--k-ink-1);
    background: var(--k-surface-0);
    box-shadow:
      0 0 0 1px var(--k-line-2),
      0 1px 2px color-mix(in oklab, var(--k-ink-1) 8%, transparent);
  }
  .theme-switcher[data-variant='card'] .swatch.on {
    border-color: color-mix(in oklab, var(--k-shu) 50%, transparent);
    box-shadow:
      inset 0 0 0 1px color-mix(in oklab, var(--k-shu) 30%, transparent),
      0 2px 8px -2px color-mix(in oklab, var(--k-shu) 20%, transparent);
  }

  /* Each swatch's dot is a fixed-hue preview, independent of the
     currently-active theme — so the user can see what they'd be picking. */
  .dot {
    inline-size: 12px;
    block-size: 12px;
    border-radius: 999px;
    flex-shrink: 0;
    box-shadow:
      inset 0 0 0 0.5px oklch(0 0 0 / 0.1),
      0 1px 1px oklch(0 0 0 / 0.06);
  }
  .dot[data-theme='shu'] {
    background: oklch(0.62 0.18 35);
  }
  .dot[data-theme='matcha'] {
    background: oklch(0.62 0.13 145);
  }
  .dot[data-theme='ai'] {
    background: oklch(0.52 0.21 268);
  }
  .dot[data-theme='sumi'] {
    background: oklch(0.22 0.012 280);
  }

  .name {
    line-height: 1;
  }
</style>
