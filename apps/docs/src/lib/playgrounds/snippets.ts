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
