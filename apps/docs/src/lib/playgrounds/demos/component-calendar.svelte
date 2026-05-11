<!--
  Calendar live demo for the components catalog. Wraps the Layer 4
  <Calendar.Root> with cell rendering and exposes a selected-date readout.
-->
<script lang="ts">
  import { Calendar } from '@kumiki/components';
  import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
  import { ui } from '$lib/i18n/store.svelte.js';

  let value = $state<CalendarDate | null>(today(getLocalTimeZone()));
  // Map our 10 short locales to the IETF tags Intl expects.
  const intlLocale = $derived(
    (
      {
        en: 'en-US',
        ja: 'ja-JP',
        'zh-Hans': 'zh-Hans-CN',
        'zh-Hant': 'zh-Hant-TW',
        ko: 'ko-KR',
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
        ar: 'ar-SA',
        he: 'he-IL',
      } as Record<string, string>
    )[ui.locale] ?? 'en-US',
  );
</script>

<div class="demo">
  <Calendar.Root bind:value direction={ui.direction}>
    <Calendar.Header locale={intlLocale} class="cal-header" />
    <Calendar.Grid locale={intlLocale} class="cal-grid">
      {#snippet day(cell)}
        <Calendar.Day date={cell.date} inMonth={cell.inMonth} class="cal-cell" />
      {/snippet}
    </Calendar.Grid>
  </Calendar.Root>

  <p class="state">
    selected = <code>{value ? value.toString() : '—'}</code>
  </p>
</div>

<style>
  .demo {
    width: 420px;
    max-width: 100%;
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 16px;
    min-height: 420px;
    box-sizing: border-box;
  }

  .demo :global(.cal-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 12px;
  }
  .demo :global(.cal-header button) {
    width: 28px;
    height: 28px;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    background: transparent;
    color: var(--k-ink-2);
    cursor: pointer;
    font: inherit;
  }
  .demo :global(.cal-header button:hover) {
    border-color: var(--k-line-3);
    color: var(--k-ink-1);
  }
  .demo :global(.cal-header [data-calendar-month-label]) {
    font-family: var(--k-font-display);
    font-weight: 500;
    color: var(--k-ink-1);
    font-size: 15px;
    letter-spacing: -0.01em;
  }

  .demo :global(.cal-grid) {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  .demo :global(.cal-grid th) {
    padding: 4px;
    font-size: 11px;
    color: var(--k-ink-4);
    font-weight: 500;
    font-family: var(--k-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .demo :global(.cal-grid td) {
    padding: 2px;
    text-align: center;
  }
  .demo :global(.cal-cell) {
    width: 100%;
    height: 32px;
    border: 0;
    border-radius: var(--k-radius-xs);
    background: transparent;
    font: inherit;
    font-size: 13px;
    color: var(--k-ink-2);
    cursor: pointer;
  }
  .demo :global(.cal-cell:hover:not([data-disabled])) {
    background: var(--k-surface-2);
  }
  .demo :global(.cal-cell[data-state='selected']) {
    background: var(--k-shu);
    color: white;
  }
  .demo :global(.cal-cell[data-disabled]) {
    color: var(--k-ink-5);
    cursor: not-allowed;
  }
  .demo :global(.cal-cell:not([data-in-month])) {
    color: var(--k-ink-5);
  }
  .demo :global(.cal-cell:focus-visible) {
    outline: 2px solid var(--k-focus);
    outline-offset: 1px;
  }

  .state {
    margin-top: 12px;
    color: var(--k-ink-3);
    font-size: 12px;
    font-family: var(--k-font-mono);
  }
  .state code {
    color: var(--k-matcha-ink);
    background: transparent;
    border: 0;
    padding: 0;
  }
</style>
