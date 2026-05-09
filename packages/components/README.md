# @kumiki/components

Layer 4 — every Kumiki Svelte 5 component (Toggle, Dialog, Combobox, …) under
a single install. Subpath per component plus a dot-namespace barrel.

## Install

```bash
pnpm add @kumiki/components
```

`@kumiki/headless` ships transitively. Svelte ≥ 5.29 is a peer.

## Use

```svelte
<script>
  // Dot-namespace barrel (most ergonomic — IDE auto-imports the namespace)
  import { Toggle, Dialog } from '@kumiki/components';
</script>

<Toggle.Root>Bold</Toggle.Root>

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>...</Dialog.Content>
</Dialog.Root>
```

```svelte
<script>
  // Subpath import (best tree-shake guarantee on older bundlers)
  import { Root, Trigger, Content } from '@kumiki/components/dialog';
</script>
```

## Available subpaths

| Subpath                           | What it ships                                     |
| --------------------------------- | ------------------------------------------------- |
| `@kumiki/components/accordion`    | `Accordion.{Root,Item,Header,Trigger,Content}`    |
| `@kumiki/components/checkbox`     | `Checkbox.{Root,Label}`                           |
| `@kumiki/components/combobox`     | `Combobox.{Root,Input,Listbox,Option,…}`          |
| `@kumiki/components/dialog`       | `Dialog.{Root,Trigger,Overlay,Content,Title,…}`   |
| `@kumiki/components/form-field`   | `FormField.{Root,Label,Description,Errors,Input}` |
| `@kumiki/components/menu`         | `Menu.{Root,Trigger,Content,Item,Separator}`      |
| `@kumiki/components/number-field` | `NumberField.{Root,Input,Increment,Decrement}`    |
| `@kumiki/components/popover`      | `Popover.{Root,Trigger,Content}`                  |
| `@kumiki/components/radio-group`  | `RadioGroup.{Root,Item,Indicator}`                |
| `@kumiki/components/select`       | `Select.{Root,Trigger,Listbox,Option,…}`          |
| `@kumiki/components/slider`       | `Slider.{Root,Track,Range,Thumb}`                 |
| `@kumiki/components/switch`       | `Switch.{Root,Label}`                             |
| `@kumiki/components/tabs`         | `Tabs.{Root,List,Tab,Panel}`                      |
| `@kumiki/components/toast`        | `Toast.{Toaster,Item,Title,Description,Close,…}`  |
| `@kumiki/components/toggle`       | `Toggle.{Root}`                                   |
| `@kumiki/components/tooltip`      | `Tooltip.{Root,Trigger,Content}`                  |

## See also

- [`@kumiki/headless`](../headless) — Layer 3 attachments. Use this if you need
  to bring your own DOM markup.
- [`@kumiki/atelier`](../atelier) — Layer 5 opinionated, copy-pasteable styled variants built on top.
- [`docs/components/`](../../docs/components/) — per-component reference.
