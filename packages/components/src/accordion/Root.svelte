<!--
  @component Accordion.Root — owns the controller and shares it via context.

  Generic over the item value type `V`.

  Bindable props:
  - `value` → V[] | V | null. For `multiple` mode, bind an array; for
    `single`, bind a single V or null.

  Plain props:
  - `items` (required) → AccordionItem<V>[]
  - `mode` → 'single' (default) | 'multiple'
  - `defaultValue`, `collapsible`, `navigation`, `onValueChange`.
-->
<script lang="ts" generics="V">
  import { onDestroy, setContext, untrack } from 'svelte';
  import {
    createAccordion,
    type AccordionController,
    type AccordionItem,
    type AccordionMode,
  } from '@kumiki/headless/accordion';
  import type { Snippet } from 'svelte';
  import { ACCORDION_CONTEXT_KEY, type AccordionContextValue } from './context.js';

  type Props = {
    items: ReadonlyArray<AccordionItem<V>>;
    value?: ReadonlyArray<V> | V | null;
    mode?: AccordionMode;
    defaultValue?: ReadonlyArray<V> | V | null;
    collapsible?: boolean;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (expandedIds: ReadonlyArray<string>) => void;
    id?: string;
    children: Snippet;
  };

  let {
    items,
    value = $bindable(undefined),
    mode = 'single',
    defaultValue,
    collapsible = true,
    navigation = 'wrap',
    onValueChange,
    id,
    children,
  }: Props = $props();

  const controller: AccordionController<V> = untrack(() =>
    createAccordion<V>({
      items,
      defaultValue: value !== undefined ? value : defaultValue,
      mode,
      collapsible,
      navigation,
      id,
      onValueChange: (expandedIds) => {
        // Sync expandedIds back to the bindable value as the matching V[] /
        // V | null shape that the consumer wrote — keeping the round-trip
        // honest.
        if (mode === 'multiple') {
          const vals = expandedIds
            .map((eid) => items.find((it) => it.id === eid)?.value)
            .filter((v): v is V => v !== undefined);
          value = vals;
        } else {
          const eid = expandedIds[0];
          const v = eid ? (items.find((it) => it.id === eid)?.value ?? null) : null;
          value = v;
        }
        onValueChange?.(expandedIds);
      },
    }),
  );

  $effect(() => {
    if (value !== undefined) {
      controller.setValue(value);
    }
  });
  $effect(() => {
    if (mode !== controller.mode) controller.setMode(mode);
  });
  $effect(() => {
    controller.setCollapsible(collapsible);
  });
  $effect(() => {
    if (items !== controller.context.items) controller.setItems(items);
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<AccordionContextValue<V>>(ACCORDION_CONTEXT_KEY, { controller });
</script>

<div id={controller.id} {@attach controller.root}>
  {@render children()}
</div>
