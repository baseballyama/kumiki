<!--
  DatePicker live demo — Popover + Calendar composition.
-->
<script lang="ts">
  import { DatePicker } from '@kumiki/components';
  import type { CalendarDate } from '@internationalized/date';
  import { ui } from '$lib/i18n/store.svelte.js';

  let value = $state<CalendarDate | null>(null);
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
  const placeholderJa = $derived(ui.locale === 'ja' ? '日付を選択' : 'Pick a date');
</script>

<div class="demo">
  <DatePicker.Root bind:value locale={intlLocale} placeholder={placeholderJa}>
    <DatePicker.Trigger class="dp-trigger" />
    <DatePicker.Content class="dp-content" />
  </DatePicker.Root>

  <p class="state">
    selected = <code>{value ? value.toString() : '—'}</code>
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    min-width: 280px;
  }
  .demo :global(.dp-trigger) {
    display: inline-flex;
    height: 36px;
    align-items: center;
    padding-inline: 14px;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    background: var(--k-surface-1);
    color: var(--k-ink-1);
    cursor: pointer;
    font: inherit;
    font-size: 14px;
    min-width: 200px;
    justify-content: space-between;
    gap: 8px;
  }
  .demo :global(.dp-trigger:hover) {
    border-color: var(--k-line-3);
  }
  .demo :global(.dp-content) {
    padding: 16px;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    background: var(--k-surface-0);
    box-shadow: var(--k-shadow-lg);
    min-width: 280px;
    z-index: 60;
  }
  .demo :global(.dp-content button) {
    width: 28px;
    height: 28px;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    background: transparent;
    color: var(--k-ink-2);
    cursor: pointer;
    font: inherit;
  }
  .demo :global(.dp-content [data-calendar-month-label]) {
    font-family: var(--k-font-display);
    font-weight: 500;
    color: var(--k-ink-1);
    font-size: 15px;
  }
  .demo :global(.dp-content table) {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .demo :global(.dp-content table th) {
    padding: 4px;
    font-size: 11px;
    color: var(--k-ink-4);
    font-family: var(--k-font-mono);
  }
  .demo :global(.dp-content table button) {
    width: 32px;
    height: 32px;
    border: 0;
    background: transparent;
    border-radius: var(--k-radius-xs);
    color: var(--k-ink-2);
    font-size: 13px;
  }
  .demo :global(.dp-content table button:hover:not([data-disabled])) {
    background: var(--k-surface-2);
  }
  .demo :global(.dp-content table button[data-state='selected']) {
    background: var(--k-shu);
    color: white;
  }
  .state {
    margin-top: 16px;
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
