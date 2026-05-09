/**
 * `@kumiki/components/date-picker` — Layer 4 compound component for
 * picking a single date from a popover-anchored calendar.
 *
 * Built on `@kumiki/components/popover` + `@kumiki/components/calendar`;
 * no separate machine / headless layer (the composition is purely
 * arrangement of existing pieces).
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import { DatePicker } from '@kumiki/components';
 * </script>
 *
 * <DatePicker.Root locale="ja" placeholder="日付を選択">
 *   <DatePicker.Trigger />
 *   <DatePicker.Content />
 * </DatePicker.Root>
 * ```
 *
 * @when-to-use Inline date selection inside forms; replaces a native
 *              `<input type="date">` when locale-aware formatting,
 *              non-Gregorian calendars, or custom keyboard ergonomics
 *              are required.
 *
 * @anti-pattern Don't reach for DatePicker for time selection (no time
 *               primitive yet — Phase 2.1) or for date *ranges* (also
 *               Phase 2.1). Use Calendar.Root directly if you want the
 *               grid embedded inline rather than inside a popover.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#example-datepicker-dialog
 */

import Root from './Root.svelte';
import Trigger from './Trigger.svelte';
import Content from './Content.svelte';

export { Root, Trigger, Content };
export type { DatePickerContextValue } from './context.js';
