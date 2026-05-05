<!--
  @component Select.Root — owns the controller and shares it via context.

  Generic over the item value type `V`. Pass `V` to `<Root<V>>`; `<Option>`
  receives a typed `SelectItem<V>` for its `value` prop.

  Bindable props:
  - `value` → V | null. Bind for two-way control.
  - `open` → boolean. Bind for two-way control.

  Plain props:
  - `items` → SelectItem<V>[] (required).
  - `defaultValue` / `defaultOpen` / `navigation` (`'wrap'` default) /
    `onValueChange` / `onOpenChange`.
-->
<script lang="ts" generics="V">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createSelect, type SelectController, type SelectItem } from '@kumiki/headless/select';
  import type { Snippet } from 'svelte';
  import { SELECT_CONTEXT_KEY, type SelectContextValue } from './context.js';

  type Props = {
    items: ReadonlyArray<SelectItem<V>>;
    value?: V | null;
    open?: boolean;
    defaultValue?: V | null;
    defaultOpen?: boolean;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (value: V | null) => void;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet;
  };

  let {
    items,
    value = $bindable(undefined),
    open = $bindable(undefined),
    defaultValue = null,
    defaultOpen = false,
    navigation = 'wrap',
    onValueChange,
    onOpenChange,
    id,
    children,
  }: Props = $props();

  const controller: SelectController<V> = untrack(() =>
    createSelect<V>({
      items,
      defaultValue: value !== undefined ? value : defaultValue,
      defaultOpen: open !== undefined ? open : defaultOpen,
      navigation,
      id,
      onValueChange: (next) => {
        value = next;
        onValueChange?.(next);
      },
      onOpenChange: (next) => {
        open = next;
        onOpenChange?.(next);
      },
    }),
  );

  $effect(() => {
    if (value !== undefined && value !== controller.value) {
      controller.setValue(value);
    }
  });
  $effect(() => {
    if (open !== undefined && open !== controller.open) {
      if (open) controller.show();
      else controller.hide();
    }
  });
  $effect(() => {
    if (items !== controller.context.items) {
      controller.setItems(items);
    }
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<SelectContextValue<V>>(SELECT_CONTEXT_KEY, { controller });
</script>

{@render children()}
