<!--
  @component Slider.Thumb — the focusable indicator with role="slider".

  The attachment paints aria-valuemin / valuemax / valuenow,
  aria-orientation, aria-disabled, plus a `--kumiki-slider-pct` CSS
  custom property the consumer's stylesheet uses to position the thumb.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { SLIDER_CONTEXT_KEY, type SliderContextValue } from './context.js';

  type Props = {
    [key: string]: unknown;
  };

  let { ...rest }: Props = $props();

  const { controller } = getContext<SliderContextValue>(SLIDER_CONTEXT_KEY);
</script>

<div data-component-part="thumb" {...rest} {@attach controller.thumb}></div>
