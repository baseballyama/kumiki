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
