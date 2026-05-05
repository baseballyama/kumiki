<!--
  @component RadioGroup.Root — group container for mutually-exclusive radios.

  Generic over the value type `V`. Renders `<div role="radiogroup">` by
  default; the items are children, each rendered via `<RadioGroup.Item>`.

  Behavior follows WAI-ARIA APG RadioGroup pattern:
  https://www.w3.org/WAI/ARIA/apg/patterns/radio/

  Bindable props:
  - `value` → V | null. Bind for two-way control.

  Plain props:
  - `items` → RadioItem<V>[] (required).
  - `defaultValue` / `disabled` / `navigation` (`'wrap'` default) /
    `onValueChange`.
-->
<script lang="ts" generics="V">
  import { onDestroy, setContext, untrack } from 'svelte';
  import {
    createRadioGroup,
    type RadioGroupController,
    type RadioItem,
  } from '@kumiki/headless/radio-group';
  import type { Snippet } from 'svelte';
  import { RADIO_GROUP_CONTEXT_KEY, type RadioGroupContextValue } from './context.js';

  type Props = {
    items: ReadonlyArray<RadioItem<V>>;
    value?: V | null;
    defaultValue?: V | null;
    disabled?: boolean;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (value: V | null) => void;
    id?: string;
    children: Snippet;
    /** Extra props (`class`, `style`, `data-*`, …) forwarded to the root element. */
    [key: string]: unknown;
  };

  let {
    items,
    value = $bindable(undefined),
    defaultValue = null,
    disabled = false,
    navigation = 'wrap',
    onValueChange,
    id,
    children,
    ...rest
  }: Props = $props();

  const controller: RadioGroupController<V> = untrack(() =>
    createRadioGroup<V>({
      items,
      defaultValue: value ?? defaultValue,
      disabled,
      navigation,
      id,
      onValueChange: (next) => {
        value = next;
        onValueChange?.(next);
      },
    }),
  );

  let snapDisabled = $state(controller.disabled);
  const unsub = controller.subscribe(({ state }) => {
    snapDisabled = state === 'disabled';
  });
  onDestroy(unsub);

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
  // Keep items in sync when the parent prop changes.
  $effect(() => {
    if (items !== controller.items) {
      controller.setItems(items);
    }
  });

  setContext<RadioGroupContextValue<V>>(RADIO_GROUP_CONTEXT_KEY, { controller });
</script>

<div
  {...rest}
  role="radiogroup"
  aria-disabled={snapDisabled ? 'true' : undefined}
  data-component="radio-group"
  data-disabled={snapDisabled ? '' : undefined}
  {@attach controller.root}
>
  {@render children()}
</div>
