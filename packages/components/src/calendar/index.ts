/**
 * `@kumiki/components/calendar` — Layer 4 compound component for the
 * Calendar grid.
 *
 * Composes four sub-components: Root, Header, Grid, Day. Root owns the
 * controller and shares it via context.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import { Calendar } from '@kumiki/components';
 * </script>
 *
 * <Calendar.Root locale="ja">
 *   <Calendar.Header locale="ja" />
 *   <Calendar.Grid locale="ja">
 *     {#snippet day(cell)}
 *       <Calendar.Day date={cell.date} inMonth={cell.inMonth} />
 *     {/snippet}
 *   </Calendar.Grid>
 * </Calendar.Root>
 * ```
 *
 * @when-to-use Date selection inside a form, in a popover (DatePicker), or
 *              as a standalone month-grid surface.
 *
 * @anti-pattern Don't use Calendar for non-date-picker grids — the keyboard
 *               contract assumes day cells. Use a generic grid otherwise.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */

import Root from './Root.svelte';
import Header from './Header.svelte';
import Grid from './Grid.svelte';
import Day from './Day.svelte';

export { Root, Header, Grid, Day };

export type {
  CalendarContext,
  CalendarController,
  CalendarEvent,
  CalendarMachine,
  CalendarState,
  CreateCalendarInput,
} from '@kumiki/headless/calendar';
