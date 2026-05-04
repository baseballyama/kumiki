/**
 * Internal context shared between Slider.Root and Slider.Thumb.
 */

import type { SliderController } from '@kumiki/attachment-slider';

export const SLIDER_CONTEXT_KEY = Symbol('kumiki.slider');

export interface SliderContextValue {
  controller: SliderController;
}

export type {
  SliderController,
  SliderDirection,
  SliderOrientation,
} from '@kumiki/attachment-slider';
