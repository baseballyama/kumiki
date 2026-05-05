# <Name>

> One-sentence description of what this component does.

| Field                               | Value                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------- |
| **APG pattern**                     | [link to APG pattern](https://www.w3.org/WAI/ARIA/apg/patterns/<pattern>/) |
| **Bundle (Layer 4 target, brotli)** | `<measured>` / `<budget>`                                                  |
| **Status**                          | `unreleased` \| `preview` \| `stable`                                      |
| **Phase**                           | `0a` \| `0b` \| `0c` \| `1` \| `2` \| `3`                                  |
| **Layer 5 preview**                 | `none` \| `tailwind+vanilla`                                               |

## Anatomy

```
<Name>.Root
  ├── <Name>.Trigger
  ├── <Name>.Content
  │   └── <Name>.Item
  └── …
```

A short paragraph explaining each part's responsibility.

## Keyboard

Generated from `apps/docs/keyboard/<name>.kb.ts` (the typed APG contract consumed by `apps/docs/tests/keyboard/_harness.ts`). Mirrors the APG keyboard interaction table.

| Key         | When             | Effect                            |
| ----------- | ---------------- | --------------------------------- |
| `ArrowDown` | closed           | Opens; focuses first item         |
| `ArrowDown` | open             | Focuses next item                 |
| `Enter`     | open && hasFocus | Selects focused item; closes      |
| `Escape`    | open             | Closes; restores focus to trigger |
| ...         | ...              | ...                               |

## ARIA

| Element   | Role       | aria-\* attributes                                                         |
| --------- | ---------- | -------------------------------------------------------------------------- |
| `Root`    | (none)     | —                                                                          |
| `Trigger` | `combobox` | `aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-activedescendant` |
| `Content` | `listbox`  | `id`                                                                       |
| `Item`    | `option`   | `aria-selected`                                                            |

## State machine

[View on stately.ai](https://stately.ai/viz?json=...) — pasted from `createXMachine().toJSON()`.

States:

- `idle`
- `open.populated`
- `open.empty`
- `selected`
- ...

Events:

- `INPUT.FOCUS`
- `INPUT.CHANGE`
- ...

## API

### `<Name>.Root`

```ts
type Props<T> = {
  /**
   * @when-to-use Brief.
   * @anti-pattern Brief.
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/<pattern>/
   */
  options: T[];
  value?: T | null;
  onValueChange?: (value: T | null) => void;
  // ...
  children: Snippet;
};
```

### `<Name>.Trigger`

```ts
type Props = {
  children?: Snippet;
  child?: Snippet<[payload: { props: TriggerProps }]>;
};
```

### `<Name>.Item`

```ts
type Props<T> = {
  value: T;
  disabled?: boolean;
  children: Snippet;
};
```

## Examples

### Basic

```svelte
<Name.Root options={items}>
  <Name.Trigger>Open</Name.Trigger>
  <Name.Content>
    {#each items as item}
      <Name.Item value={item}>{item.label}</Name.Item>
    {/each}
  </Name.Content>
</Name.Root>
```

### With validation (Standard Schema)

```svelte
<script lang="ts">
  import { z } from 'zod';
  const schema = z.object({ id: z.string() });
</script>

<Name.Root options={items} validator={schema}>...</Name.Root>
```

### With async fetcher

(if applicable)

### With virtualization

(if applicable)

### With multi-select

(if applicable)

### RTL

```svelte
<LocaleProvider locale="ar" dir="rtl">
  <Name.Root options={items}>...</Name.Root>
</LocaleProvider>
```

## Accessibility checklist

- [ ] APG link present.
- [ ] All keys in the APG keyboard table are implemented and tested.
- [ ] `aria-*` attributes match APG.
- [ ] axe-core passes for every documented state in LTR + RTL.
- [ ] Required accessible name enforced at the type level (where applicable).
- [ ] `:focus-visible` supported (no default `outline: none`).
- [ ] `prefers-reduced-motion` honored where the component animates.
- [ ] `prefers-contrast` documented as integration concern.
- [ ] Screen-reader smoke test passes on macOS-VoiceOver and Windows-NVDA.

## Anti-patterns

- "Don't ..."
- "Avoid ..."

## Disabled axe rules

| Rule     | Why                                        |
| -------- | ------------------------------------------ |
| `region` | Sandbox fixture pages don't have landmarks |

## Composition

Available `with*`:

- `withValidation(base, schema)` — adds Standard Schema validation
- `withAsyncSearch(base, fetcher)` — async option fetching (if applicable)
- ... (component-specific)

## Related

- [Adjacent component A](other-component-a.md)
- [Adjacent component B](other-component-b.md)
