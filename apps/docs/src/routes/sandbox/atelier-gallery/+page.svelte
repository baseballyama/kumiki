<!--
  Atelier gallery — visual smoke test of all 32 atelier presets in their
  Vanilla variant.

  This is the demo for Deliverable D in `docs/migrations/flyle-nexus.md`:
  "atelier 経由で Phase 1.5 全コンポーネントが画面に出る demo を作成".

  Run: `pnpm --filter @kumiki/docs dev` then visit /sandbox/atelier-gallery.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import { Vanilla as Accordion } from '@kumiki/atelier/accordion';
  import { Vanilla as Alert } from '@kumiki/atelier/alert';
  import { Vanilla as Avatar } from '@kumiki/atelier/avatar';
  import { Vanilla as AvatarGroup } from '@kumiki/atelier/avatar-group';
  import { Vanilla as Badge } from '@kumiki/atelier/badge';
  import { Vanilla as Breadcrumb } from '@kumiki/atelier/breadcrumb';
  import { Vanilla as Button } from '@kumiki/atelier/button';
  import { Vanilla as Calendar } from '@kumiki/atelier/calendar';
  import { Vanilla as Checkbox } from '@kumiki/atelier/checkbox';
  import { Vanilla as Chips } from '@kumiki/atelier/chips';
  import { Vanilla as Combobox } from '@kumiki/atelier/combobox';
  import { Vanilla as DefinitionList } from '@kumiki/atelier/definition-list';
  import { Vanilla as Dialog } from '@kumiki/atelier/dialog';
  import { Vanilla as FormField } from '@kumiki/atelier/form-field';
  import { Vanilla as HorizontalRule } from '@kumiki/atelier/horizontal-rule';
  import { Vanilla as IconButton } from '@kumiki/atelier/icon-button';
  import { Vanilla as LoadingSpinner } from '@kumiki/atelier/loading-spinner';
  import { Vanilla as Menu } from '@kumiki/atelier/menu';
  import { Vanilla as NumberField } from '@kumiki/atelier/number-field';
  import { Vanilla as Pagination } from '@kumiki/atelier/pagination';
  import { Vanilla as Popover } from '@kumiki/atelier/popover';
  import { Vanilla as RadioGroup } from '@kumiki/atelier/radio-group';
  import { Vanilla as Select } from '@kumiki/atelier/select';
  import { Vanilla as Slider } from '@kumiki/atelier/slider';
  import { Vanilla as Switch } from '@kumiki/atelier/switch';
  import { Vanilla as Table } from '@kumiki/atelier/table';
  import { Vanilla as Tabs } from '@kumiki/atelier/tabs';
  import { Vanilla as Toolbar } from '@kumiki/atelier/toolbar';
  import { Vanilla as Toggle } from '@kumiki/atelier/toggle';
  import { Vanilla as Tooltip } from '@kumiki/atelier/tooltip';

  let togglePressed = $state(false);
  let switchOn = $state(true);
  let checkboxValue = $state<'unchecked' | 'checked' | 'mixed'>('unchecked');
  let radioValue = $state<string | null>('a');
  let chipsSelected = $state(false);
  let dialogOpen = $state(false);
  let popoverOpen = $state(false);

  const radioItems = [
    { id: 'a', value: 'a', label: 'A' },
    { id: 'b', value: 'b', label: 'B' },
  ];
  const accordionItems = [
    { id: 'one', value: 'one', label: 'Section one' },
    { id: 'two', value: 'two', label: 'Section two' },
  ];
  const tabItems = [
    { id: 'overview', value: 'overview', label: 'Overview' },
    { id: 'details', value: 'details', label: 'Details' },
  ];
</script>

<svelte:head>
  <title>Atelier gallery · Kumiki</title>
</svelte:head>

<main class="page">
  <h1>Atelier gallery</h1>
  <p>
    Vanilla CSS variants from <code>@kumiki/atelier/*</code> — visual smoke test for Deliverable D.
  </p>

  <section>
    <h2>Button family</h2>
    <div class="row">
      <Button.Root>Primary</Button.Root>
      <Button.Root variant="secondary">Secondary</Button.Root>
      <Button.Root variant="ghost">Ghost</Button.Root>
      <Button.Root variant="danger">Danger</Button.Root>
      <IconButton.Root aria-label="Settings">
        {#snippet icon()}<span aria-hidden="true">⚙</span>{/snippet}
      </IconButton.Root>
    </div>
  </section>

  <section>
    <h2>Toggles &amp; selection</h2>
    <div class="row">
      <Toggle.Root bind:pressed={togglePressed}>Toggle</Toggle.Root>
      <Switch.Root bind:checked={switchOn} aria-label="Switch" />
      <Checkbox.Root bind:value={checkboxValue} aria-label="Checkbox" />
      <RadioGroup.Root items={radioItems} bind:value={radioValue}>
        {#each radioItems as item (item.id)}
          <label style="display: inline-flex; gap: 0.25rem; align-items: center;">
            <RadioGroup.Item value={item} aria-label={item.label} />
            {item.label}
          </label>
        {/each}
      </RadioGroup.Root>
    </div>
  </section>

  <section>
    <h2>Status indicators</h2>
    <div class="row">
      <Badge.Root>neutral</Badge.Root>
      <Badge.Root variant="info">info</Badge.Root>
      <Badge.Root variant="success">success</Badge.Root>
      <Badge.Root variant="warn">warn</Badge.Root>
      <Badge.Root variant="error">error</Badge.Root>
      <Chips.Root>Chip</Chips.Root>
      <Chips.Root variant="dismissible" label="Removable" onDismiss={() => {}}>
        <Chips.Label>Removable</Chips.Label>
        <Chips.Close />
      </Chips.Root>
      <LoadingSpinner.Root mode="region">Loading</LoadingSpinner.Root>
      <Avatar.Root size="md" name="Ada Lovelace">
        <Avatar.Fallback />
      </Avatar.Root>
      <AvatarGroup.Root max={3} aria-label="Team">
        <AvatarGroup.Item
          ><Avatar.Root size="md" name="A B"><Avatar.Fallback /></Avatar.Root></AvatarGroup.Item
        >
        <AvatarGroup.Item
          ><Avatar.Root size="md" name="C D"><Avatar.Fallback /></Avatar.Root></AvatarGroup.Item
        >
        <AvatarGroup.Overflow count={5} />
      </AvatarGroup.Root>
    </div>
  </section>

  <section>
    <h2>Alerts</h2>
    <Alert.Root severity="info">
      <Alert.Title>Heads up</Alert.Title>
      <Alert.Description>Atelier shows the panel preset.</Alert.Description>
    </Alert.Root>
    <Alert.Root severity="success">
      <Alert.Title>All set</Alert.Title>
      <Alert.Description>Build succeeded.</Alert.Description>
    </Alert.Root>
  </section>

  <section>
    <h2>Inputs</h2>
    <div class="row">
      <NumberField.Root>
        <NumberField.Decrement />
        <NumberField.Input aria-label="Quantity" />
        <NumberField.Increment />
      </NumberField.Root>
      <Slider.Root min={0} max={100} aria-label="Volume">
        <Slider.Thumb aria-label="Volume" />
      </Slider.Root>
    </div>
  </section>

  <section>
    <h2>Layout primitives</h2>
    <HorizontalRule.Root />
    <Breadcrumb.Root>
      <Breadcrumb.Item>
        <Breadcrumb.Link href={resolve('/')}>Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link current>Atelier</Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
    <Pagination.Root page={3} pageCount={10}>
      <Pagination.Prev />
      <Pagination.PageList>
        {#snippet item({ page, isCurrent, isEllipsis })}
          {#if isEllipsis}
            <Pagination.Ellipsis />
          {:else}
            <Pagination.PageItem {page} aria-current={isCurrent ? 'page' : undefined}
              >{page}</Pagination.PageItem
            >
          {/if}
        {/snippet}
      </Pagination.PageList>
      <Pagination.Next />
    </Pagination.Root>
  </section>

  <section>
    <h2>Disclosures</h2>
    <Accordion.Root items={accordionItems}>
      {#each accordionItems as item (item.id)}
        <Accordion.Item value={item}>
          <Accordion.Trigger value={item}>{item.label}</Accordion.Trigger>
          <Accordion.Panel value={item}>Content for {item.label}.</Accordion.Panel>
        </Accordion.Item>
      {/each}
    </Accordion.Root>

    <Tabs.Root items={tabItems} defaultValue="overview">
      <Tabs.List>
        {#each tabItems as item (item.id)}
          <Tabs.Tab value={item}>{item.label}</Tabs.Tab>
        {/each}
      </Tabs.List>
      {#each tabItems as item (item.id)}
        <Tabs.Panel value={item}>{item.label} panel</Tabs.Panel>
      {/each}
    </Tabs.Root>
  </section>

  <section>
    <h2>Floating</h2>
    <div class="row">
      <Dialog.Root bind:open={dialogOpen}>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Atelier dialog</Dialog.Title>
          <Dialog.Description>Vanilla preset.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
      <Popover.Root bind:open={popoverOpen}>
        <Popover.Trigger>Popover</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Title</Popover.Title>
          <Popover.Description>Body text.</Popover.Description>
        </Popover.Content>
      </Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Content>Tooltip body</Tooltip.Content>
      </Tooltip.Root>
    </div>
  </section>

  <section>
    <h2>Forms</h2>
    <FormField.Root initialValue="">
      <FormField.Label>Email</FormField.Label>
      <FormField.Input type="email" />
      <FormField.Description>We never share your address.</FormField.Description>
      <FormField.Errors />
    </FormField.Root>
  </section>

  <section>
    <h2>Toolbar</h2>
    <Toolbar.Root aria-label="Editing">
      <Toolbar.Item>Bold</Toolbar.Item>
      <Toolbar.Item>Italic</Toolbar.Item>
      <Toolbar.Separator />
      <Toolbar.Item>Link</Toolbar.Item>
    </Toolbar.Root>
  </section>

  <section>
    <h2>Definition list</h2>
    <DefinitionList.Root layout="inline">
      <DefinitionList.Term>Layer</DefinitionList.Term>
      <DefinitionList.Description>Atelier (5)</DefinitionList.Description>
      <DefinitionList.Term>Tag</DefinitionList.Term>
      <DefinitionList.Description>preview</DefinitionList.Description>
    </DefinitionList.Root>
  </section>

  <section>
    <h2>Calendar</h2>
    <Calendar.Root>
      <Calendar.Header>
        <span>Calendar</span>
      </Calendar.Header>
      <Calendar.Grid>
        {#snippet day(cell)}
          <Calendar.Day date={cell.date}>{cell.date.day}</Calendar.Day>
        {/snippet}
      </Calendar.Grid>
    </Calendar.Root>
  </section>

  <section>
    <h2>Combobox &amp; Select &amp; Menu</h2>
    <p>
      These need active focus / open state to render their listbox; see the individual sandboxes
      (e.g. <code>/sandbox/combobox</code>) for live interaction. Their atelier wrappers are
      smoke-built here only.
    </p>
    {#if false}
      <Combobox.Root><Combobox.Input /></Combobox.Root>
      <Select.Root items={[]}><Select.Trigger>Pick…</Select.Trigger></Select.Root>
      <Menu.Root items={[]}
        >{#snippet children()}<Menu.Trigger>Menu</Menu.Trigger>{/snippet}</Menu.Root
      >
    {/if}
  </section>

  <section>
    <h2>Table</h2>
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell>Component</Table.HeaderCell>
          <Table.HeaderCell>Layer</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        <Table.Row rowId="r1">
          <Table.Cell>Toggle</Table.Cell>
          <Table.Cell>Atelier (5)</Table.Cell>
        </Table.Row>
        <Table.Row rowId="r2">
          <Table.Cell>Dialog</Table.Cell>
          <Table.Cell>Atelier (5)</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  </section>
</main>

<style>
  .page {
    padding: 2rem;
    max-width: 64rem;
    margin: 0 auto;
    font-family: system-ui, sans-serif;
  }
  section {
    margin-block: 2rem;
  }
  h2 {
    margin-block: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: hsl(220 10% 35%);
  }
  .row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
    margin-block: 0.5rem;
  }
</style>
