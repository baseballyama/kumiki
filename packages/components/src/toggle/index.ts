/**
 * `@kumiki/components/toggle` — Layer 4 compound component for the Toggle.
 *
 * Behavior follows the WAI-ARIA APG button (toggle) pattern.
 *
 * Two ways to import:
 * ```ts
 * import { Toggle } from '@kumiki/components/toggle';
 * // <Toggle.Root>...</Toggle.Root>
 *
 * // or selective:
 * import { Root } from '@kumiki/components/toggle';
 * // <Root>...</Root>
 * ```
 *
 * @when-to-use Anywhere you need a two-state on/off button — toolbar buttons
 *              (Bold/Italic), feature flags, accordion expanders.
 *
 * @anti-pattern For a setting that affects whether a related element is rendered,
 *               use a Switch (`@kumiki/components/switch`) — it semantically and
 *               visually conveys an active/inactive state better than Toggle's
 *               aria-pressed.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */

import Root from './Root.svelte';

export { Root };

export const Toggle = { Root };

// Re-export controller type for users that wire `bind:pressed` etc. with strict types.
export type {
  ToggleController,
  ToggleContext,
  ToggleEvent,
  ToggleState,
  CreateToggleOptions,
} from '@kumiki/headless/toggle';
