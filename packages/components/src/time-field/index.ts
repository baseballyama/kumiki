/**
 * `@kumiki/components/time-field` — Layer 4 segmented time-of-day input.
 *
 * APG pattern: composition of `spinbutton` per segment + `group` wrapper
 * (the React Aria DateField/TimeField precedent — production-grade across
 * NVDA/JAWS/VoiceOver since 2021).
 *
 * ```svelte
 * <TimeField.Root bind:value granularity="minute">
 *   <TimeField.Label>Reminder time</TimeField.Label>
 *   <TimeField.Input>
 *     <TimeField.Segment kind="hour" />
 *     <TimeField.Segment kind="minute" />
 *     <TimeField.Segment kind="dayPeriod" />
 *   </TimeField.Input>
 * </TimeField.Root>
 * ```
 *
 * @when-to-use Locale-aware time-of-day input — daily reminders, scheduling
 *              UIs, anything that doesn't need a calendar.
 *
 * @anti-pattern Don't use `<input type="time">`. Browser appearance is
 *               non-stylable cross-platform, mobile keyboards differ, and
 *               the 12/24-hour cycle follows the OS locale instead of
 *               `<LocaleProvider>`.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */

import Root from './Root.svelte';
import Label from './Label.svelte';
import Input from './Input.svelte';
import Segment from './Segment.svelte';

export { Root, Label, Input, Segment };

export const TimeField = { Root, Label, Input, Segment };

export type { TimeGranularity, SegmentKind } from './context.js';
