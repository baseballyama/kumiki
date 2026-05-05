<!--
  @component Tabs.Root — owns the controller and shares it via context.

  Bindable props:
  - `value` → string | null. Bind for two-way control.

  Plain props:
  - `items` → TabItem[] (required).
  - `defaultValue` / `disabled` / `activation` (`'automatic'` default) /
    `orientation` (`'horizontal'` default) / `direction` (`'ltr'` default) /
    `navigation` (`'wrap'` default) / `onValueChange`.
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import {
    createTabs,
    type TabItem,
    type TabsActivation,
    type TabsController,
    type TabsDirection,
    type TabsOrientation,
  } from '@kumiki/headless/tabs';
  import type { Snippet } from 'svelte';
  import { TABS_CONTEXT_KEY, type TabsContextValue } from './context.js';

  type Props = {
    items: ReadonlyArray<TabItem>;
    value?: string | null;
    defaultValue?: string | null;
    disabled?: boolean;
    activation?: TabsActivation;
    orientation?: TabsOrientation;
    direction?: TabsDirection;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (value: string | null) => void;
    id?: string;
    children: Snippet;
  };

  let {
    items,
    value = $bindable(undefined),
    defaultValue,
    disabled = false,
    activation = 'automatic',
    orientation = 'horizontal',
    direction = 'ltr',
    navigation = 'wrap',
    onValueChange,
    id,
    children,
  }: Props = $props();

  const controller: TabsController = untrack(() =>
    createTabs({
      items,
      defaultValue: value !== undefined ? value : defaultValue,
      disabled,
      activation,
      orientation,
      direction,
      navigation,
      id,
      onValueChange: (next) => {
        value = next;
        onValueChange?.(next);
      },
    }),
  );

  $effect(() => {
    if (value !== undefined && value !== controller.value) {
      controller.setValue(value);
    }
  });
  $effect(() => {
    if (disabled !== controller.disabled) {
      controller.setDisabled(disabled);
    }
  });
  $effect(() => {
    if (activation !== controller.activation) {
      controller.setActivation(activation);
    }
  });
  $effect(() => {
    controller.setOrientation(orientation);
  });
  $effect(() => {
    controller.setDirection(direction);
  });
  $effect(() => {
    if (items !== controller.items) {
      controller.setItems(items);
    }
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<TabsContextValue>(TABS_CONTEXT_KEY, { controller });
</script>

{@render children()}
