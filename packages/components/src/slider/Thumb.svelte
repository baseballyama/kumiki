<!--
  @component Slider.Thumb — the focusable indicator with role="slider".

  The attachment paints aria-valuemin / valuemax / valuenow,
  aria-orientation, aria-disabled, plus a `--kumiki-slider-pct` CSS
  custom property the consumer's stylesheet uses to position the thumb.
-->
<script lang="ts" module>
  type BaseProps = {
    /** Extra attributes (`class`, `style`, `data-*`, …) forwarded to the thumb element. */
    [key: string]: unknown;
  };

  /**
   * Slider.Thumb — the focusable indicator with `role="slider"`.
   *
   * `role="slider"` requires an accessible name so screen readers can announce
   * what value is being controlled. Require one of `aria-label` or
   * `aria-labelledby` at the type level.
   *
   * @when-to-use Use `aria-label` for a literal description (e.g. "Volume")
   * or `aria-labelledby` to reference a visible label element.
   * @anti-pattern Omitting both leaves the slider control unnamed for
   * assistive technology users.
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider/
   */
  export type Props =
    | (BaseProps & { 'aria-label': string })
    | (BaseProps & { 'aria-labelledby': string });
</script>

<script lang="ts">
  import { getContext } from 'svelte';
  import { SLIDER_CONTEXT_KEY, type SliderContextValue } from './context.js';

  let { ...rest }: Props = $props();

  const { controller } = getContext<SliderContextValue>(SLIDER_CONTEXT_KEY);
</script>

<div data-component-part="thumb" {...rest} {@attach controller.thumb}></div>
