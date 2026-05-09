<!--
  Calendar sandbox — exercises the Layer 4 Calendar compound. Used by
  Playwright e2e + axe + APG keyboard tests.

  Query params:
    ?initial=YYYY-MM-DD     focus this date initially (default: today)
    ?selected=YYYY-MM-DD    pre-select this date
    ?disabled=1             start disabled
    ?dir=rtl                wrap in dir="rtl"
    ?locale=en|ja           formatting locale (default: en-US)
-->
<script lang="ts">
  import { CalendarDate, parseDate, today, getLocalTimeZone } from '@internationalized/date';
  import { Calendar } from '@kumiki/components';
  import { page } from '$app/state';

  function tryParse(s: string | null): CalendarDate | null {
    if (!s) return null;
    try {
      return parseDate(s);
    } catch {
      return null;
    }
  }

  const initialFocused = $derived(
    tryParse(page.url.searchParams.get('initial')) ?? today(getLocalTimeZone()),
  );
  const initialSelected = $derived(tryParse(page.url.searchParams.get('selected')));
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const locale = $derived(page.url.searchParams.get('locale') ?? 'en-US');

  // svelte-ignore state_referenced_locally
  let value = $state<CalendarDate | null>(initialSelected);
</script>

<svelte:head>
  <title>Calendar sandbox</title>
</svelte:head>

<main class="page" {dir}>
  <h1>Calendar</h1>
  <p>
    locale = <code>{locale}</code> · disabled = <code>{disabled}</code> · dir = <code>{dir}</code>
  </p>

  <Calendar.Root id="cal" bind:value defaultFocusedDate={initialFocused} {disabled} direction={dir}>
    <Calendar.Header {locale} class="header" />
    <Calendar.Grid {locale} class="grid">
      {#snippet day(cell)}
        <Calendar.Day date={cell.date} inMonth={cell.inMonth} class="cell" />
      {/snippet}
    </Calendar.Grid>
  </Calendar.Root>

  <p data-testid="value">selected = {value ? value.toString() : 'none'}</p>
</main>

<style>
  .page {
    padding: 2rem;
    font-family: system-ui, sans-serif;
    max-width: 28rem;
  }

  :global(.header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 0.5rem;
  }
  :global(.header button) {
    width: 2rem;
    height: 2rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    background: transparent;
    cursor: pointer;
  }
  :global(.header [data-calendar-month-label]) {
    font-weight: 600;
  }

  :global(.grid) {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  :global(.grid th) {
    padding: 0.25rem;
    font-size: 0.75rem;
    color: #666;
    font-weight: 500;
  }
  :global(.grid td) {
    padding: 0.125rem;
    text-align: center;
  }
  :global(.cell) {
    width: 100%;
    height: 2.25rem;
    border: 0;
    border-radius: 0.25rem;
    background: transparent;
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }
  :global(.cell:hover:not([data-disabled])) {
    background: oklch(0.95 0 0);
  }
  :global(.cell[data-state='selected']) {
    background: oklch(0.55 0.18 252);
    color: white;
  }
  :global(.cell[data-disabled]) {
    color: #aaa;
    cursor: not-allowed;
  }
  :global(.cell:not([data-in-month])) {
    color: #aaa;
  }
  :global(.cell:focus-visible) {
    outline: 2px solid oklch(0.55 0.18 252);
    outline-offset: 1px;
  }
</style>
