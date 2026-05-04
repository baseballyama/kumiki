/**
 * `@kumiki/component-number-field` — Layer 4 compound component for NumberField.
 *
 * Four named exports — Root + Input + Increment + Decrement. Root owns
 * the controller; the others read it from context.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import {
 *     Root,
 *     Input,
 *     Increment,
 *     Decrement,
 *   } from '@kumiki/component-number-field';
 *   let value = $state(5);
 * </script>
 *
 * <Root bind:value min={0} max={10} step={1}>
 *   <Decrement>−</Decrement>
 *   <Input aria-label="Quantity" />
 *   <Increment>+</Increment>
 * </Root>
 * ```
 *
 * @when-to-use Precise numeric input — quantities, prices, durations.
 *
 * @anti-pattern Don't use NumberField for ordinal categories (RadioGroup)
 *               or rough drag selection (Slider).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */

import Root from './Root.svelte';
import Input from './Input.svelte';
import Increment from './Increment.svelte';
import Decrement from './Decrement.svelte';

export { Root, Input, Increment, Decrement };

export type {
  NumberFieldContext,
  NumberFieldController,
  NumberFieldEvent,
  NumberFieldMachine,
  NumberFieldState,
  CreateNumberFieldOptions,
} from '@kumiki/attachment-number-field';
