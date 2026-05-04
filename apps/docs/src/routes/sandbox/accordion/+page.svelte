<!--
  Accordion sandbox — fixture for Playwright + axe.

  Query params:
    ?initial=team               initial expanded value (single mode)
    ?mode=multiple              switch to multiple mode
    ?collapsible=0              disable collapsing the only-open (single mode)
    ?dir=rtl                    wrap in dir="rtl"
-->
<script lang="ts">
  import { Root, Item, Trigger, Panel, type AccordionItem } from '@kumiki/component-accordion';
  import { page } from '$app/state';

  const items: AccordionItem<string>[] = [
    { id: 'a-general', value: 'general', label: 'General' },
    { id: 'a-billing', value: 'billing', label: 'Billing', disabled: true },
    { id: 'a-team', value: 'team', label: 'Team' },
    { id: 'a-security', value: 'security', label: 'Security' },
  ];

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const mode = $derived<'single' | 'multiple'>(
    page.url.searchParams.get('mode') === 'multiple' ? 'multiple' : 'single',
  );
  const collapsible = $derived(page.url.searchParams.get('collapsible') !== '0');
  const initial = $derived(page.url.searchParams.get('initial'));

  // svelte-ignore state_referenced_locally
  let value = $state<string | string[] | null>(initial ?? (mode === 'multiple' ? [] : null));
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Accordion sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Accordion sandbox</h1>

  <div data-testid="accordion-host">
    <Root
      {items}
      bind:value
      {mode}
      {collapsible}
      onValueChange={(ids) => append(`onValueChange(${JSON.stringify(ids)})`)}
    >
      {#each items as item (item.id)}
        <Item value={item} data-testid={`item-${item.value}`}>
          <Trigger value={item} data-testid={`trigger-${item.value}`}>
            {item.label}
          </Trigger>
          <Panel value={item} data-testid={`panel-${item.value}`}>
            <p>Panel for <strong>{item.label}</strong>.</p>
          </Panel>
        </Item>
      {/each}
    </Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{JSON.stringify(value)}</strong>
    · mode: <strong data-testid="mode">{mode}</strong>
    · collapsible: <strong data-testid="collapsible">{collapsible}</strong>
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
  :global([data-component-host='accordion']) {
    border: 1px solid #2a2a4a;
    border-radius: 8px;
    overflow: hidden;
  }
  :global([data-component-part='item']) {
    border-bottom: 1px solid #2a2a4a;
  }
  :global([data-component-part='item']:last-child) {
    border-bottom: none;
  }
  :global([data-component-host='accordion'] button) {
    width: 100%;
    text-align: start;
    background: #16162a;
    color: #e0e0e0;
    border: 0;
    padding: 12px 16px;
    cursor: pointer;
    font: inherit;
  }
  :global([data-component-host='accordion'] button[aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  :global([data-component-host='accordion'] [role='region'][hidden]) {
    display: none;
  }
  :global([data-component-host='accordion'] [role='region']:not([hidden])) {
    padding: 12px 16px;
    background: #0e0e1c;
    color: #e0e0e0;
  }
</style>
