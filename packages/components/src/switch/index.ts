/**
 * `@kumiki/components/switch` — Layer 4 compound component for the Switch.
 *
 * Behavior follows the WAI-ARIA APG switch pattern.
 *
 * @when-to-use For an on/off setting that takes effect immediately (e.g.,
 *              dark-mode toggle, notifications, feature flag).
 *
 * @anti-pattern For a button that flips a transient pressed state, use
 *               `@kumiki/components/toggle`. For a form-level boolean field,
 *               use `@kumiki/components/checkbox`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */

import Root from './Root.svelte';

export { Root };

export const Switch = { Root };

export type {
  SwitchController,
  SwitchContext,
  SwitchEvent,
  SwitchState,
  CreateSwitchOptions,
} from '@kumiki/headless/switch';
