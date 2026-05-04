<!--
  Combobox + withAsyncSearch sandbox — Layer 3 fixture for Playwright + axe.

  Demonstrates `withAsyncSearch`: typing fires an async fetcher with an
  AbortSignal. Each new query aborts the prior one; the machine's token
  protocol drops stale results.

  Query params:
    ?dir=rtl       wrap in dir="rtl"
    ?latency=N     fetcher delay in ms (default 200)
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { createCombobox } from '@kumiki/attachment-combobox';
  import { withAsyncSearch } from '@kumiki/attachment-combobox/with-async-search';
  import { page } from '$app/state';

  interface City {
    id: string;
    value: string;
    label: string;
  }

  const DICT: City[] = [
    'Tokyo',
    'Osaka',
    'Kyoto',
    'Sapporo',
    'Yokohama',
    'New York',
    'Los Angeles',
    'San Francisco',
    'Seattle',
    'Boston',
    'London',
    'Manchester',
    'Edinburgh',
    'Paris',
    'Berlin',
    'Munich',
    'Madrid',
    'Barcelona',
    'Rome',
    'Milan',
  ].map((label) => ({ id: label.toLowerCase().replace(/\s+/g, '-'), value: label, label }));

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const latency = $derived(parseInt(page.url.searchParams.get('latency') ?? '200', 10));

  const base = createCombobox<City>({ options: [] });
  let cb = $state<ReturnType<typeof withAsyncSearch<City>>>();

  let inputEl: HTMLInputElement | null = null;
  let listboxEl: HTMLUListElement | null = null;
  let triggerEl: HTMLButtonElement | null = null;
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }

  // Fake server-side filter via setTimeout so tests can use vi.advanceTimers
  // … but in browser we just sleep.
  async function fetcher(query: string, signal: AbortSignal): Promise<City[]> {
    append(`fetch(${query})`);
    await new Promise<void>((resolve, reject) => {
      const id = setTimeout(() => resolve(), latency);
      signal.addEventListener('abort', () => {
        clearTimeout(id);
        reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
      });
    });
    if (signal.aborted) {
      append(`abort(${query})`);
      throw Object.assign(new Error('aborted'), { name: 'AbortError' });
    }
    const q = query.toLowerCase();
    return DICT.filter((c) => c.label.toLowerCase().includes(q));
  }

  // svelte-ignore state_referenced_locally
  $effect(() => {
    cb = withAsyncSearch(base, fetcher, { debounceMs: 50 });
  });

  onMount(() => {
    if (inputEl) cb?.input(inputEl);
    if (listboxEl) cb?.listbox(listboxEl);
    if (triggerEl) cb?.trigger(triggerEl);
  });

  let value = $derived(cb?.value);
  let status = $derived(cb?.status ?? 'idle');
  let filtered = $derived(cb?.filtered ?? []);
</script>

<svelte:head>
  <title>Combobox async sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Combobox + withAsyncSearch sandbox</h1>

  <div data-testid="cb-host" class="host">
    <div class="row">
      <input data-testid="input" bind:this={inputEl} placeholder="Type a city" />
      <button data-testid="trigger" bind:this={triggerEl} type="button">▾</button>
    </div>

    <ul
      data-testid="listbox"
      bind:this={listboxEl}
      role="listbox"
      data-state={cb?.isOpen ? 'open' : 'closed'}
    >
      {#each filtered as opt (opt.id)}
        <li data-testid="option-{opt.id}" {@attach (node) => cb?.option(opt)?.(node)}>
          {opt.label}
        </li>
      {/each}
      {#if status === 'loading' && filtered.length === 0}
        <li class="empty" data-testid="loading">Loading…</li>
      {:else if status === 'idle' && filtered.length === 0 && cb?.query}
        <li class="empty" data-testid="empty">No matches</li>
      {/if}
    </ul>
  </div>

  <p data-testid="state">
    status: <strong data-testid="status">{status}</strong>
    · query: <strong data-testid="query">{cb?.query ?? ''}</strong>
    · filtered: <strong data-testid="count">{filtered.length}</strong>
    · value: <strong data-testid="value">{value?.label ?? '—'}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  .host {
    margin: 16px 0;
    max-width: 360px;
  }
  .row {
    display: flex;
    gap: 4px;
  }
  input {
    flex: 1;
    padding: 6px 10px;
    background: #0e0e1c;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 4px;
  }
  button {
    background: #1a1a30;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
  }
  ul {
    list-style: none;
    margin: 4px 0 0;
    padding: 4px;
    background: #16162a;
    border: 1px solid #3a3a5a;
    border-radius: 4px;
    min-height: 32px;
  }
  ul[data-state='closed']:not(:has(.empty)):not(:has(li)) {
    display: none;
  }
  li {
    padding: 4px 8px;
    color: #e0e0e0;
    border-radius: 3px;
    cursor: pointer;
  }
  :global(li[data-highlighted]) {
    background: #2a2a4a;
  }
  .empty {
    color: #888;
    font-style: italic;
    cursor: default;
  }
</style>
