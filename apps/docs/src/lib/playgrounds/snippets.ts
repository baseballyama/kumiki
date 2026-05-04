/**
 * Per-package code snippets shown in the Playground.
 * Each entry maps a package slug → array of `{ title, lang, code }`.
 */

export interface Snippet {
  title: string;
  lang: 'svelte' | 'ts' | 'bash';
  code: string;
}

export const SNIPPETS: Record<string, ReadonlyArray<Snippet>> = {
  'component-radio-group': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/component-radio-group' },
    {
      title: 'Basic — typed plan picker',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Root, Item, type RadioItem } from '@kumiki/component-radio-group';

  type Plan = 'free' | 'pro' | 'enterprise';
  const plans: RadioItem<Plan>[] = [
    { id: 'free', value: 'free', label: 'Free' },
    { id: 'pro', value: 'pro', label: 'Pro' },
    { id: 'enterprise', value: 'enterprise', label: 'Enterprise' },
  ];

  let value = $state<Plan | null>('free');
</script>

<Root items={plans} bind:value>
  {#each plans as plan (plan.id)}
    <Item value={plan}>{plan.label}</Item>
  {/each}
</Root>`,
    },
    {
      title: 'Disabled item',
      lang: 'svelte',
      code: `const items = [
  { id: 'a', value: 'a', label: 'Option A' },
  { id: 'b', value: 'b', label: 'Option B', disabled: true },
  { id: 'c', value: 'c', label: 'Option C' },
];
// 'b' is unfocusable and unclickable; arrow-key nav skips it.`,
    },
  ],

  'machine-radio-group': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-radio-group' },
    {
      title: 'Pure-TS — select-on-focus arrow nav',
      lang: 'ts',
      code: `import { createRadioGroupMachine } from '@kumiki/machine-radio-group';

const m = createRadioGroupMachine({
  items: [
    { id: '1', value: 'apple' },
    { id: '2', value: 'banana', disabled: true },
    { id: '3', value: 'cherry' },
  ],
});
m.send({ type: 'NAVIGATE', direction: 'first' });
console.log(m.context.value);          // 'apple'
m.send({ type: 'NAVIGATE', direction: 'next' });
console.log(m.context.value);          // 'cherry' (skipped disabled banana)`,
    },
  ],

  'attachment-radio-group': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-radio-group' },
    {
      title: 'Drive your own DOM',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createRadioGroup } from '@kumiki/attachment-radio-group';
  const g = createRadioGroup({ items });
</script>

<div {@attach g.root}>
  {#each items as item (item.id)}
    <button {@attach g.item(item)}>{item.label}</button>
  {/each}
</div>`,
    },
  ],

  'component-tabs': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/component-tabs' },
    {
      title: 'Basic — settings tabs',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Root, List, Tab, Panel, type TabItem } from '@kumiki/component-tabs';

  const items: TabItem[] = [
    { id: 'account', value: 'account', label: 'Account' },
    { id: 'team', value: 'team', label: 'Team' },
    { id: 'security', value: 'security', label: 'Security' },
  ];

  let value = $state<string | null>('account');
</script>

<Root {items} bind:value>
  <List>
    {#each items as item (item.id)}
      <Tab value={item}>{item.label}</Tab>
    {/each}
  </List>
  {#each items as item (item.id)}
    <Panel value={item}>…panel content…</Panel>
  {/each}
</Root>`,
    },
    {
      title: 'Manual activation (Enter / Space to commit)',
      lang: 'svelte',
      code: `<Root {items} bind:value activation="manual">
  <!-- Arrow keys move focus only; Enter or Space activates. -->
  <List>{#each items as it (it.id)}<Tab value={it}>{it.label}</Tab>{/each}</List>
  {#each items as it (it.id)}<Panel value={it}>{it.label}</Panel>{/each}
</Root>`,
    },
    {
      title: 'Vertical tablist + RTL',
      lang: 'svelte',
      code: `<!-- orientation switches which arrows navigate.
     direction inverts horizontal arrows; vertical is dir-agnostic. -->
<Root {items} bind:value orientation="vertical" direction="rtl">
  <List>{#each items as it (it.id)}<Tab value={it}>{it.label}</Tab>{/each}</List>
  {#each items as it (it.id)}<Panel value={it}>{it.label}</Panel>{/each}
</Root>`,
    },
  ],

  'machine-tabs': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-tabs' },
    {
      title: 'Pure-TS — automatic vs manual activation',
      lang: 'ts',
      code: `import { createTabsMachine } from '@kumiki/machine-tabs';

const m = createTabsMachine({
  items: [
    { id: 'a', value: 'account' },
    { id: 'b', value: 'billing', disabled: true },
    { id: 'c', value: 'team' },
  ],
  activation: 'manual',
});

m.send({ type: 'FOCUS', id: 'c' });
console.log(m.context.value);          // 'account' (manual: focus ≠ activate)
m.send({ type: 'ACTIVATE_FOCUSED' });
console.log(m.context.value);          // 'team'`,
    },
  ],

  'attachment-tabs': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-tabs' },
    {
      title: 'Drive your own DOM (compound — list + tab + panel)',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createTabs } from '@kumiki/attachment-tabs';
  const c = createTabs({ items, orientation: 'horizontal' });
</script>

<div {@attach c.list}>
  {#each items as it (it.id)}
    <button {@attach c.tab(it)}>{it.label}</button>
  {/each}
</div>
{#each items as it (it.id)}
  <div {@attach c.panel(it)}>…content…</div>
{/each}`,
    },
  ],

  'component-dialog': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/component-dialog' },
    {
      title: 'Basic — modal confirmation',
      lang: 'svelte',
      code: `<script lang="ts">
  import * as Dialog from '@kumiki/component-dialog';
  let open = $state(false);
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>Open dialog</Dialog.Trigger>
  <Dialog.Overlay />
  <Dialog.Content>
    <Dialog.Title>Confirm purchase</Dialog.Title>
    <Dialog.Description>You're about to enroll in the Pro plan.</Dialog.Description>
    <Dialog.Close>Cancel</Dialog.Close>
    <Dialog.Close>Confirm</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>`,
    },
    {
      title: 'Non-modal sheet (no overlay, no inert)',
      lang: 'svelte',
      code: `<Dialog.Root bind:open modal={false}>
  <Dialog.Trigger>Show</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Tips</Dialog.Title>
    <p>Background remains interactive — useful for inline help panels.</p>
    <Dialog.Close>Close</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>`,
    },
    {
      title: 'Disable Escape / outside-click for forced confirmation',
      lang: 'svelte',
      code: `<!-- e.g. a destructive action that requires explicit confirmation. -->
<Dialog.Root bind:open closeOnEscape={false} closeOnOutsideClick={false}>
  <Dialog.Trigger>Delete account</Dialog.Trigger>
  <Dialog.Overlay />
  <Dialog.Content>
    <Dialog.Title>Are you sure?</Dialog.Title>
    <Dialog.Description>This cannot be undone.</Dialog.Description>
    <Dialog.Close>Keep account</Dialog.Close>
    <button onclick={destructive}>Yes, delete</button>
  </Dialog.Content>
</Dialog.Root>`,
    },
  ],

  'machine-dialog': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-dialog' },
    {
      title: 'Pure-TS — policy-driven dismissal',
      lang: 'ts',
      code: `import { createDialogMachine } from '@kumiki/machine-dialog';

const m = createDialogMachine({ closeOnEscape: false });
m.send({ type: 'OPEN' });
m.send({ type: 'ESCAPE' });        // ignored — policy says no
console.log(m.state);              // 'open'

m.send({ type: 'SET.CLOSE_ON_ESCAPE', value: true });
m.send({ type: 'ESCAPE' });
console.log(m.state);              // 'closed'`,
    },
  ],

  'attachment-dialog': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-dialog' },
    {
      title: 'Drive your own DOM (six factories)',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createDialog } from '@kumiki/attachment-dialog';
  const d = createDialog({ modal: true });
</script>

<button {@attach d.trigger}>Open</button>
<div {@attach d.overlay}></div>
<div {@attach d.content}>
  <h2 {@attach d.title}>Title</h2>
  <p {@attach d.description}>Description</p>
  <button {@attach d.close}>Close</button>
</div>`,
    },
  ],

  'component-tooltip': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/component-tooltip' },
    {
      title: 'Basic — icon button hint',
      lang: 'svelte',
      code: `<script lang="ts">
  import * as Tooltip from '@kumiki/component-tooltip';
</script>

<Tooltip.Root>
  <Tooltip.Trigger>?</Tooltip.Trigger>
  <Tooltip.Content>Help text shown on hover or focus.</Tooltip.Content>
</Tooltip.Root>`,
    },
    {
      title: 'Custom delays + non-hoverable content',
      lang: 'svelte',
      code: `<!-- 0 ms open delay = no debounce; instant. closeDelay still applies. -->
<Tooltip.Root openDelay={0} closeDelay={150} disableHoverableContent>
  <Tooltip.Trigger aria-label="Save">⌘S</Tooltip.Trigger>
  <Tooltip.Content>Save (Cmd/Ctrl + S)</Tooltip.Content>
</Tooltip.Root>`,
    },
  ],

  'machine-tooltip': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-tooltip' },
    {
      title: 'Pure-TS — policy-driven open/close',
      lang: 'ts',
      code: `import { createTooltipMachine } from '@kumiki/machine-tooltip';

const m = createTooltipMachine({ openDelay: 0, closeDelay: 0 });
m.send({ type: 'OPEN' });
console.log(m.state);     // 'open'
m.send({ type: 'ESCAPE' });
console.log(m.state);     // 'closed'`,
    },
  ],

  'attachment-tooltip': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-tooltip' },
    {
      title: 'Drive your own DOM',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createTooltip } from '@kumiki/attachment-tooltip';
  const t = createTooltip({ openDelay: 500, closeDelay: 200 });
</script>

<button {@attach t.trigger} aria-label="Save">⌘S</button>
<div {@attach t.content}>Save (Cmd/Ctrl + S)</div>`,
    },
  ],

  'component-select': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/component-select' },
    {
      title: 'Basic — typed plan picker',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Root, Trigger, Listbox, Option, type SelectItem } from '@kumiki/component-select';

  type Plan = 'free' | 'pro' | 'enterprise';
  const plans: SelectItem<Plan>[] = [
    { id: 'free', value: 'free', label: 'Free' },
    { id: 'pro', value: 'pro', label: 'Pro' },
    { id: 'enterprise', value: 'enterprise', label: 'Enterprise' },
  ];

  let value = $state<Plan | null>('pro');
</script>

<Root items={plans} bind:value>
  <Trigger>{value ?? 'Pick a plan'}</Trigger>
  <Listbox>
    {#each plans as plan (plan.id)}
      <Option value={plan}>{plan.label}</Option>
    {/each}
  </Listbox>
</Root>`,
    },
    {
      title: 'Disabled item + clamp navigation',
      lang: 'svelte',
      code: `<!-- 'banana' is unfocusable; arrow keys skip it. clamp stops at edges. -->
<Root items={items} bind:value navigation="clamp">
  <Trigger>{labelFor(value) ?? 'Pick'}</Trigger>
  <Listbox>{#each items as it (it.id)}<Option value={it}>{it.label}</Option>{/each}</Listbox>
</Root>`,
    },
  ],

  'machine-select': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-select' },
    {
      title: 'Pure-TS — listbox state machine',
      lang: 'ts',
      code: `import { createSelectMachine } from '@kumiki/machine-select';

const m = createSelectMachine({
  items: [
    { id: '1', value: 'apple', label: 'Apple' },
    { id: '2', value: 'banana', label: 'Banana', disabled: true },
    { id: '3', value: 'cherry', label: 'Cherry' },
  ],
});

m.send({ type: 'OPEN' });
m.send({ type: 'NAVIGATE', direction: 'next' });    // skip banana → cherry
m.send({ type: 'SELECT', id: '3' });
console.log(m.context.value);                       // 'cherry'`,
    },
  ],

  'attachment-select': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-select' },
    {
      title: 'Drive your own DOM (compound — trigger + listbox + option)',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createSelect } from '@kumiki/attachment-select';
  const s = createSelect({ items });
</script>

<button {@attach s.trigger}>{labelFor(s.value)}</button>
<ul {@attach s.listbox}>
  {#each items as it (it.id)}
    <li {@attach s.option(it)}>{it.label}</li>
  {/each}
</ul>`,
    },
  ],

  'component-form-field': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/component-form-field' },
    {
      title: 'Basic — email field with Valibot',
      lang: 'svelte',
      code: `<script lang="ts">
  import * as Field from '@kumiki/component-form-field';
  import * as v from 'valibot';

  const emailSchema = v.pipe(v.string(), v.email('Enter a valid email'));
  let value = $state('');
</script>

<Field.Root initialValue="" bind:value validator={emailSchema}>
  <Field.Label>Email</Field.Label>
  <Field.Input type="email" autocomplete="email" />
  <Field.Description>We'll send a confirmation link.</Field.Description>
  <Field.Errors />
</Field.Root>`,
    },
    {
      title: 'Validate on every keystroke',
      lang: 'svelte',
      code: `<Field.Root initialValue="" validator={schema} validateOn="change">
  <Field.Label>Username</Field.Label>
  <Field.Input />
  <Field.Errors />
</Field.Root>`,
    },
    {
      title: 'Async validator (e.g. server uniqueness check)',
      lang: 'ts',
      code: `// Standard Schema validators may be async — Promise<Result> is fine.
// Race-token guarding is automatic: stale resolutions are dropped.
const usernameSchema: StandardSchemaV1<string, string> = {
  '~standard': {
    version: 1,
    vendor: 'app',
    validate: async (value) => {
      const r = await fetch(\`/api/users/\${value}\`);
      if (r.status === 404) return { value: value as string };
      return { issues: [{ message: 'Already taken' }] };
    },
  },
};`,
    },
  ],

  'machine-form-field': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-form-field' },
    {
      title: 'Pure-TS — race-token guarding',
      lang: 'ts',
      code: `import { createFormFieldMachine } from '@kumiki/machine-form-field';

const m = createFormFieldMachine({ initialValue: '' });
m.send({ type: 'INPUT', value: 'a' });
m.send({ type: 'BLUR' });
const stale = m.context.validationToken;

// User keeps typing while validator is in flight.
m.send({ type: 'INPUT', value: 'ab' });
// The stale validation result arrives — DROPPED, token mismatch.
m.send({
  type: 'VALIDATION_RESOLVE',
  token: stale,
  issues: [{ message: 'too short' }],
});
console.log(m.state); // 'editing' — not 'invalid'`,
    },
  ],

  'attachment-form-field': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-form-field' },
    {
      title: 'Drive your own DOM',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createFormField } from '@kumiki/attachment-form-field';
  const f = createFormField({ initialValue: '', validator });
</script>

<label {@attach f.label}>Email</label>
<input {@attach f.input} type="email" />
<p {@attach f.description}>We won't share it.</p>
<div {@attach f.errors}></div>`,
    },
  ],

  'component-checkbox': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/component-checkbox' },
    {
      title: 'Basic — uncontrolled',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Checkbox } from '@kumiki/component-checkbox';
  let value = $state<'unchecked' | 'checked' | 'mixed'>('unchecked');
</script>

<Checkbox.Root bind:value>
  {value === 'checked' ? '✓' : value === 'mixed' ? '−' : ''}
</Checkbox.Root>`,
    },
    {
      title: 'Tri-state parent of a group',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Checkbox } from '@kumiki/component-checkbox';
  let items = $state([
    { id: 1, checked: false },
    { id: 2, checked: true },
    { id: 3, checked: false },
  ]);
  // mixed when some-but-not-all children checked
  const parentValue = $derived(
    items.every((i) => i.checked)
      ? 'checked'
      : items.some((i) => i.checked)
        ? 'mixed'
        : 'unchecked',
  );
</script>

<Checkbox.Root
  value={parentValue}
  onCheckedChange={(v) => items.forEach((i) => (i.checked = v === 'checked'))}>
  Select all
</Checkbox.Root>`,
    },
  ],

  'machine-checkbox': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-checkbox' },
    {
      title: 'Pure-TS tri-state',
      lang: 'ts',
      code: `import { createCheckboxMachine } from '@kumiki/machine-checkbox';

const m = createCheckboxMachine({ initial: 'mixed' });
m.send({ type: 'TOGGLE' });          // mixed → checked (APG tristate)
console.log(m.context.value);        // 'checked'
m.send({ type: 'SET', value: 'mixed' });
console.log(m.state);                // 'mixed'`,
    },
  ],

  'attachment-checkbox': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-checkbox' },
    {
      title: 'Drive your own DOM',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createCheckbox } from '@kumiki/attachment-checkbox';
  const c = createCheckbox({ initial: 'unchecked' });
</script>

<button {@attach c.root}>
  {c.value === 'checked' ? '✓' : c.value === 'mixed' ? '−' : ''}
</button>`,
    },
  ],

  'component-combobox': [
    {
      title: 'Install',
      lang: 'bash',
      code: 'pnpm add @kumiki/component-combobox',
    },
    {
      title: 'Basic — typed option list',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Root, Input, Listbox, Item, type ComboboxOption } from '@kumiki/component-combobox';

  interface User extends ComboboxOption { id: string; label: string; email: string; }
  const users: User[] = [
    { id: '1', label: 'Alice', email: 'alice@example.com' },
    { id: '2', label: 'Bob',   email: 'bob@example.com' },
  ];

  let value = $state<User | null>(null);
</script>

<Root options={users} bind:value>
  <label for="user-input">User</label>
  <Input id="user-input" placeholder="Search…" />
  <Listbox>
    {#snippet item(user: User)}
      <Item value={user}>{user.label}</Item>
    {/snippet}
    {#snippet empty()}
      <li>No results.</li>
    {/snippet}
  </Listbox>
</Root>`,
    },
    {
      title: 'Namespace import (alternative)',
      lang: 'svelte',
      code: `<script lang="ts">
  import * as Combobox from '@kumiki/component-combobox';
</script>

<Combobox.Root options={items}>
  <Combobox.Input />
  <Combobox.Listbox>
    {#snippet item(it)}
      <Combobox.Item value={it}>{it.label}</Combobox.Item>
    {/snippet}
  </Combobox.Listbox>
</Combobox.Root>`,
    },
  ],

  'machine-combobox': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-combobox' },
    {
      title: 'Pure-TS usage',
      lang: 'ts',
      code: `import { createComboboxMachine } from '@kumiki/machine-combobox';

const m = createComboboxMachine({
  options: [{ id: '1', label: 'Alice' }],
});
m.send({ type: 'INPUT.CHANGE', value: 'al' });
m.send({ type: 'INPUT.NAVIGATE', direction: 'first' });
m.send({ type: 'INPUT.ENTER' });
console.log(m.context.value);  // { id: '1', label: 'Alice' }`,
    },
    {
      title: 'Async race-token guarding',
      lang: 'ts',
      code: `// Each INPUT.CHANGE bumps the token.  Late FETCH.RESOLVE
// arrivals from stale queries are dropped automatically.
const m = createComboboxMachine({ options: [] });
m.send({ type: 'INPUT.CHANGE', value: 'al' });
const stale = m.context.token;
m.send({ type: 'INPUT.CHANGE', value: 'ali' });   // bumps token
m.send({
  type: 'FETCH.RESOLVE',
  options: [/* stale results */],
  token: stale,                                    // dropped
});`,
    },
  ],

  'attachment-combobox': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-combobox' },
    {
      title: 'Drive your own DOM',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createCombobox } from '@kumiki/attachment-combobox';
  const cb = createCombobox({ options: items });
</script>

<input {@attach cb.input} />
<ul {@attach cb.listbox}>
  {#each cb.filtered as opt (opt.id)}
    <li {@attach cb.option(opt)}>{opt.label}</li>
  {/each}
</ul>`,
    },
  ],

  'component-switch': [
    {
      title: 'Install',
      lang: 'bash',
      code: 'pnpm add @kumiki/component-switch',
    },
    {
      title: 'Basic — uncontrolled',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Switch } from '@kumiki/component-switch';
  let checked = $state(false);
</script>

<Switch.Root bind:checked>
  {checked ? 'On' : 'Off'}
</Switch.Root>`,
    },
    {
      title: 'With onCheckedChange — server sync',
      lang: 'svelte',
      code: `<Switch.Root
  onCheckedChange={(c) =>
    fetch('/api/dark-mode', {
      method: 'POST',
      body: JSON.stringify({ on: c }),
    })}>
  Dark mode
</Switch.Root>`,
    },
    {
      title: 'Disabled',
      lang: 'svelte',
      code: `<Switch.Root disabled>Off</Switch.Root>`,
    },
  ],

  'machine-switch': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/machine-switch' },
    {
      title: 'Pure-TS usage — no DOM, no Svelte',
      lang: 'ts',
      code: `import { createSwitchMachine } from '@kumiki/machine-switch';

const m = createSwitchMachine({ initial: false });
console.log(m.state);              // 'off'
m.send({ type: 'TOGGLE' });
console.log(m.state);              // 'on'
console.log(m.context.checked);    // true`,
    },
  ],

  'attachment-switch': [
    { title: 'Install', lang: 'bash', code: 'pnpm add @kumiki/attachment-switch' },
    {
      title: 'Drive a vanilla button',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createSwitch } from '@kumiki/attachment-switch';
  const s = createSwitch({ initial: false });
</script>

<button {@attach s.root}>{s.checked ? 'On' : 'Off'}</button>`,
    },
  ],

  'component-toggle': [
    {
      title: 'Install',
      lang: 'bash',
      code: 'pnpm add @kumiki/component-toggle',
    },
    {
      title: 'Basic — uncontrolled',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Toggle } from '@kumiki/component-toggle';
  let pressed = $state(false);
</script>

<Toggle.Root bind:pressed>
  {pressed ? 'On' : 'Off'}
</Toggle.Root>`,
    },
    {
      title: 'With onPressedChange',
      lang: 'svelte',
      code: `<script lang="ts">
  import { Toggle } from '@kumiki/component-toggle';
</script>

<Toggle.Root onPressedChange={(p) => console.log('changed:', p)}>
  Bold
</Toggle.Root>`,
    },
    {
      title: 'Render delegation via child snippet',
      lang: 'svelte',
      code: `<Toggle.Root>
  {#snippet child({ props, state })}
    <button {...props} class="my-styled-toggle" data-state={state.pressed ? 'on' : 'off'}>
      {state.pressed ? '🌙' : '☀️'}
    </button>
  {/snippet}
</Toggle.Root>`,
    },
    {
      title: 'Disabled',
      lang: 'svelte',
      code: `<Toggle.Root disabled>Off</Toggle.Root>`,
    },
  ],

  'attachment-toggle': [
    {
      title: 'Install',
      lang: 'bash',
      code: 'pnpm add @kumiki/attachment-toggle',
    },
    {
      title: 'Drive a vanilla button',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createToggle } from '@kumiki/attachment-toggle';
  const t = createToggle({ initial: false });
</script>

<button {@attach t.root}>
  {t.pressed ? 'On' : 'Off'}
</button>`,
    },
    {
      title: 'Subscribe + react in Svelte',
      lang: 'svelte',
      code: `<script lang="ts">
  import { createToggle } from '@kumiki/attachment-toggle';

  const t = createToggle({ initial: false });
  let pressed = $state(t.pressed);
  t.subscribe(({ context }) => (pressed = context.pressed));
</script>

<button {@attach t.root}>{pressed ? 'On' : 'Off'}</button>`,
    },
  ],

  'machine-toggle': [
    {
      title: 'Install',
      lang: 'bash',
      code: 'pnpm add @kumiki/machine-toggle',
    },
    {
      title: 'Pure-TS usage — no DOM, no Svelte',
      lang: 'ts',
      code: `import { createToggleMachine } from '@kumiki/machine-toggle';

const m = createToggleMachine({ initial: false });
console.log(m.state);              // 'unpressed'
m.send({ type: 'TOGGLE' });
console.log(m.state);              // 'pressed'
console.log(m.context.toggles);    // 1`,
    },
    {
      title: 'Visualize the statechart',
      lang: 'ts',
      code: `import { createToggleMachine } from '@kumiki/machine-toggle';

// Drop the JSON into https://stately.ai/viz to see the statechart.
console.log(JSON.stringify(createToggleMachine().toJSON(), null, 2));`,
    },
  ],

  runtime: [
    {
      title: 'Install',
      lang: 'bash',
      code: 'pnpm add @kumiki/runtime',
    },
    {
      title: 'Define your own machine',
      lang: 'ts',
      code: `import { defineMachine } from '@kumiki/runtime';

type Event = { type: 'OPEN' } | { type: 'CLOSE' };
type State = 'closed' | 'open';
type Context = { count: number };

const factory = defineMachine<Context, Event, State>({
  id: 'my-machine',
  initial: 'closed',
  context: { count: 0 },
  states: {
    closed: { on: { OPEN: { target: 'open',
      actions: [{ type: 'inc', exec: (c) => ({ count: c.count + 1 }) }] } } },
    open:   { on: { CLOSE: 'closed' } },
  },
});

const m = factory();
m.send({ type: 'OPEN' });
console.log(m.state, m.context); // 'open' { count: 1 }`,
    },
  ],

  primitives: [
    {
      title: 'Install',
      lang: 'bash',
      code: 'pnpm add @kumiki/primitives',
    },
    {
      title: 'Stable id generation',
      lang: 'ts',
      code: `import { uid, createIdScope } from '@kumiki/primitives/id';

uid()                  // "kumiki-3f5b…"
uid('combobox')        // "kumiki-combobox-3f5b…"

const scope = createIdScope('dialog');
scope.next('title')    // "kumiki-dialog-1-title"
scope.next('desc')     // "kumiki-dialog-2-desc"`,
    },
  ],
};

/** Default placeholder snippet for packages without authored snippets yet. */
export const DEFAULT_SNIPPETS: ReadonlyArray<Snippet> = [
  {
    title: 'Status',
    lang: 'bash',
    code: '# Not implemented yet — see docs/design/15-roadmap.md',
  },
];
