/**
 * `@kumiki/components/checkbox` — Layer 4 compound component for the Checkbox.
 *
 * Tri-state form checkbox following WAI-ARIA APG.
 *
 * @when-to-use For a form-level boolean (or tri-state) field. Use Switch for
 *              an immediate-effect setting and Toggle for a transient
 *              "pressed" command button.
 *
 * @anti-pattern User clicks should never produce `'mixed'` — that state is
 *               set programmatically by code controlling a parent over a
 *               group of children. Don't try to bind it through user input.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/checkbox-tristate/
 */

import Root from './Root.svelte';

export { Root };

export const Checkbox = { Root };

export type {
  CheckboxController,
  CheckboxContext,
  CheckboxEvent,
  CheckboxState,
  CheckboxValue,
  CreateCheckboxOptions,
} from '@kumiki/headless/checkbox';
