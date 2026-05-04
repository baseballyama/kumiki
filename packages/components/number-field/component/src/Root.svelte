<!--
  @component NumberField.Root — container; owns the controller.

  Bindable props:
  - `value` → number | null. Bind for two-way control. `null` = empty.

  Plain props:
  - `min` (default -Infinity) / `max` (default Infinity) / `step` (default 1) /
    `pageStep` (default step*10) / `disabled` / `defaultValue` /
    `format` / `parse` / `onValueChange`.
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createNumberField, type NumberFieldController } from '@kumiki/attachment-number-field';
  import type { Snippet } from 'svelte';
  import { NUMBER_FIELD_CONTEXT_KEY, type NumberFieldContextValue } from './context.js';

  type Props = {
    value?: number | null;
    defaultValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    pageStep?: number;
    disabled?: boolean;
    format?: (value: number) => string;
    parse?: (raw: string) => number | null | undefined;
    onValueChange?: (value: number | null) => void;
    id?: string;
    children: Snippet;
    [key: string]: unknown;
  };

  let {
    value = $bindable(undefined),
    defaultValue,
    min,
    max,
    step = 1,
    pageStep,
    disabled = false,
    format,
    parse,
    onValueChange,
    id,
    children,
    ...rest
  }: Props = $props();

  const controller: NumberFieldController = untrack(() =>
    createNumberField({
      defaultValue: value !== undefined ? value : defaultValue,
      min,
      max,
      step,
      pageStep,
      disabled,
      id,
      format,
      parse,
      onValueChange: (next) => {
        value = next;
        onValueChange?.(next);
      },
    }),
  );

  $effect(() => {
    if (value !== undefined && value !== controller.value) controller.setValue(value);
  });
  $effect(() => {
    if (min !== undefined) controller.setMin(min);
  });
  $effect(() => {
    if (max !== undefined) controller.setMax(max);
  });
  $effect(() => {
    controller.setStep(step);
  });
  $effect(() => {
    if (pageStep !== undefined) controller.setPageStep(pageStep);
  });
  $effect(() => {
    if (disabled !== controller.disabled) controller.setDisabled(disabled);
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<NumberFieldContextValue>(NUMBER_FIELD_CONTEXT_KEY, { controller });
</script>

<div {...rest} {@attach controller.root}>
  {@render children()}
</div>
