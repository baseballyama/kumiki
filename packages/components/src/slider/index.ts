/**
 * `@kumiki/components/slider` — Layer 4 compound component for Slider.
 *
 * Two named exports — Root + Thumb. Root is the track container; Thumb
 * is the focusable indicator with full APG-compliant ARIA value attributes.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import { Root, Thumb } from '@kumiki/components/slider';
 *   let value = $state(50);
 * </script>
 *
 * <Root bind:value min={0} max={100} step={1}>
 *   <Thumb />
 * </Root>
 * ```
 *
 * The visual track and thumb position are styled by the consumer using
 * the `--kumiki-slider-pct` CSS custom property the attachment paints on
 * the thumb.
 *
 * @when-to-use Continuous numeric input — volume, brightness, opacity.
 *
 * @anti-pattern Don't use Slider for binary on/off (Switch) or for
 *               named discrete options (RadioGroup).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */

import Root from './Root.svelte';
import Thumb from './Thumb.svelte';

export { Root, Thumb };

export type {
  SliderContext,
  SliderController,
  SliderDirection,
  SliderEvent,
  SliderMachine,
  SliderOrientation,
  SliderState,
  CreateSliderOptions,
} from '@kumiki/headless/slider';
