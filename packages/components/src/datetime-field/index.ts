/**
 * `@kumiki/components/datetime-field` — Layer 4 combined date + time input.
 *
 * Owns a single `CalendarDateTime` and splits it into:
 * - `DateTimeField.DatePart` — re-uses `DatePicker` (popover-anchored calendar)
 * - `DateTimeField.TimePart` — re-uses `TimeField` (segmented spinbutton)
 *
 * Both halves share the surrounding context's `disabled`, `granularity`,
 * `hourCycle`, and date bounds.
 *
 * ```svelte
 * <DateTimeField.Root bind:value granularity="minute">
 *   <DateTimeField.Label>Scheduled at</DateTimeField.Label>
 *   <DateTimeField.DatePart />
 *   <DateTimeField.TimePart />
 * </DateTimeField.Root>
 * ```
 *
 * @when-to-use A field that needs both a date and a time-of-day with a
 *              single committed value. Pair with `LocaleProvider` for
 *              locale-aware month names, hour cycle, and segment order.
 *
 * @anti-pattern Don't try to combine date + time into a single popover with
 *               a calendar grid + time strip. The two halves are separate
 *               inputs with separate accessible names by design — segmented
 *               input has better SR support than a fused calendar+strip UI.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */

import Root from './Root.svelte';
import Label from './Label.svelte';
import DatePart from './DatePart.svelte';
import TimePart from './TimePart.svelte';

export { Root, Label, DatePart, TimePart };

export const DateTimeField = { Root, Label, DatePart, TimePart };
