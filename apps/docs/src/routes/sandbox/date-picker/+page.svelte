<!--
  DatePicker sandbox — exercises Popover + Calendar composition.
-->
<script lang="ts">
  import { CalendarDate, parseDate } from '@internationalized/date';
  import { DatePicker } from '@kumiki/components';
  import { page } from '$app/state';

  function tryParse(s: string | null): CalendarDate | null {
    if (!s) return null;
    try {
      return parseDate(s);
    } catch {
      return null;
    }
  }

  const initialSelected = $derived(tryParse(page.url.searchParams.get('selected')));
  const locale = $derived(page.url.searchParams.get('locale') ?? 'en-US');

  // svelte-ignore state_referenced_locally
  let value = $state<CalendarDate | null>(initialSelected);
</script>

<svelte:head>
  <title>DatePicker sandbox</title>
</svelte:head>

<main class="page">
  <h1>DatePicker</h1>
  <p>locale = <code>{locale}</code></p>

  <DatePicker.Root bind:value {locale} placeholder="Pick a date">
    <DatePicker.Trigger class="trigger" />
    <DatePicker.Content class="content" />
  </DatePicker.Root>

  <p data-testid="value">selected = {value ? value.toString() : 'none'}</p>
</main>

<style>
  .page {
    padding: 2rem;
    font-family: system-ui, sans-serif;
    max-width: 28rem;
  }
  :global(.trigger) {
    display: inline-flex;
    height: 2.25rem;
    align-items: center;
    padding-inline: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    font: inherit;
    font-size: 0.875rem;
  }
  :global(.content) {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background: white;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    min-width: 18rem;
  }
</style>
