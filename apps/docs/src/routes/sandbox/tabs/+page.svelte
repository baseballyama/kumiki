<!--
  Tabs sandbox — fixture for Playwright + axe (and eventually Guidepup).

  Query params:
    ?initial=team               initial value (account | team | security)
    ?disabled=1                 start disabled
    ?activation=manual          manual activation (default automatic)
    ?orientation=vertical       vertical orientation (default horizontal)
    ?dir=rtl                    wrap in dir="rtl" (also reroutes ArrowKeys)
-->
<script lang="ts">
  import { Root, List, Tab, Panel, type TabItem } from '@kumiki/components/tabs';
  import { page } from '$app/state';

  const items: TabItem[] = [
    { id: 't-a', value: 'account', label: 'Account' },
    { id: 't-b', value: 'billing', label: 'Billing', disabled: true },
    { id: 't-c', value: 'team', label: 'Team' },
    { id: 't-d', value: 'security', label: 'Security' },
  ];

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const activation = $derived(
    page.url.searchParams.get('activation') === 'manual' ? 'manual' : 'automatic',
  );
  const orientation = $derived(
    page.url.searchParams.get('orientation') === 'vertical' ? 'vertical' : 'horizontal',
  );
  const initial = $derived(page.url.searchParams.get('initial'));

  // svelte-ignore state_referenced_locally
  let value = $state<string | null>(initial ?? 'account');
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Tabs sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component-host="tabs" data-testid="sandbox">
  <h1>Tabs sandbox</h1>

  <div data-testid="tabs-host">
    <Root
      {items}
      bind:value
      {disabled}
      {activation}
      {orientation}
      direction={dir}
      onValueChange={(v) => append(`onValueChange(${v ?? 'null'})`)}
    >
      <List data-testid="tabs-list">
        {#each items as item (item.id)}
          <Tab value={item}>{item.label}</Tab>
        {/each}
      </List>
      {#each items as item (item.id)}
        <Panel value={item} data-testid={`panel-${item.value}`}>
          <p>Panel for <strong>{item.label}</strong>.</p>
          <p>This content is only rendered for the active tab in the a11y tree.</p>
        </Panel>
      {/each}
    </Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value ?? 'null'}</strong>
    · activation: <strong data-testid="activation">{activation}</strong>
    · orientation: <strong data-testid="orientation">{orientation}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-clear" type="button" onclick={() => (value = null)}>Clear</button>
  <button data-testid="ext-set-team" type="button" onclick={() => (value = 'team')}>
    Set team externally
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>
