<!--
  @component Slider.Root — track container; owns the controller.

  Bindable props:
  - `value` → number. Bind for two-way control.

  Plain props:
  - `min` (default 0) / `max` (default 100) / `step` (default 1) /
    `pageStep` (default step*10) / `orientation` ('horizontal' default) /
    `direction` ('ltr' default) / `disabled` / `defaultValue` /
    `onValueChange`.
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import {
    createSlider,
    type SliderController,
    type SliderDirection,
    type SliderOrientation,
  } from '@kumiki/headless/slider';
  import type { Snippet } from 'svelte';
  import { SLIDER_CONTEXT_KEY, type SliderContextValue } from './context.js';

  type Props = {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    pageStep?: number;
    orientation?: SliderOrientation;
    direction?: SliderDirection;
    disabled?: boolean;
    onValueChange?: (value: number) => void;
    id?: string;
    children: Snippet;
    [key: string]: unknown;
  };

  let {
    value = $bindable(undefined),
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    pageStep,
    orientation = 'horizontal',
    direction = 'ltr',
    disabled = false,
    onValueChange,
    id,
    children,
    ...rest
  }: Props = $props();

  const controller: SliderController = untrack(() =>
    createSlider({
      defaultValue: value !== undefined ? value : defaultValue,
      min,
      max,
      step,
      pageStep,
      orientation,
      direction,
      disabled,
      id,
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
    controller.setMin(min);
  });
  $effect(() => {
    controller.setMax(max);
  });
  $effect(() => {
    controller.setStep(step);
  });
  $effect(() => {
    if (pageStep !== undefined) controller.setPageStep(pageStep);
  });
  $effect(() => {
    controller.setOrientation(orientation);
  });
  $effect(() => {
    controller.setDirection(direction);
  });
  $effect(() => {
    if (disabled !== controller.disabled) controller.setDisabled(disabled);
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<SliderContextValue>(SLIDER_CONTEXT_KEY, { controller });
</script>

<div {...rest} {@attach controller.root}>
  {@render children()}
</div>
