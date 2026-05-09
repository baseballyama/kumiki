# TimeField / DateTimeField

> Locale-aware time-of-day input and combined date+time input.

| Field                               | Value                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **APG pattern**                     | [Spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) (segmented), per React Aria DateField precedent |
| **Bundle (Layer 4 target, brotli)** | TimeField `2.5 kB`; DateTimeField `4.0 kB` (target)                                                                |
| **Status**                          | `unreleased` (Phase 1.5)                                                                                           |
| **Peer dep**                        | `@internationalized/date` (per ADR 0013)                                                                           |

## Why two components, not one

`TimeField` is independently useful (e.g. "Daily reminder time"). It
also does **not** need a popover Calendar. Splitting them keeps the
TimeField bundle under 3 kB and lets DateTimeField compose
`Calendar` + `TimeField` rather than ship a third independent input.

## Relationship to existing components

```
Calendar                — a month grid (already shipped)
DatePicker              — Calendar inside a Popover (already shipped)
TimeField               — segmented hh:mm[:ss] input  (new)
DateTimeField           — DatePicker + TimeField in one form-row (new)
```

`DateTimeField` is **not** a single popover with both grids inside it
— it is two adjacent inputs that share a single committed value
(`CalendarDateTime` from `@internationalized/date`). Each input has
its own focus and its own ARIA. A combined "calendar with time
strip" UX is out of scope for v1.5.

## Anatomy

```
TimeField.Root           (group with aria-labelledby)
  ├── TimeField.Label
  ├── TimeField.Input          (visual segmented input)
  │     ├── TimeField.Segment kind="hour"
  │     ├── TimeField.Segment kind="minute"
  │     ├── TimeField.Segment kind="second"   (optional, granularity)
  │     └── TimeField.Segment kind="dayPeriod" (optional, hour12 locales)
  └── TimeField.Description / TimeField.Errors  (Form-Field semantics)
```

```
DateTimeField.Root       (form-field-style group)
  ├── DateTimeField.Label
  ├── DateTimeField.DatePart       (re-uses DatePicker)
  ├── DateTimeField.TimePart       (re-uses TimeField)
  └── DateTimeField.Description / .Errors
```

## Segmented input model

Each segment is a `role="spinbutton"` with its own `aria-label`,
`aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`.
Pattern is identical to React Aria's
[DateField/TimeField](https://react-spectrum.adobe.com/react-aria/TimeField.html)
— verified production-grade across NVDA/JAWS/VoiceOver since 2021.

We **do not** use a single `<input type="time">`:

- Browser appearance is non-stylable cross-platform.
- Mobile keyboards differ.
- 24-hour vs 12-hour follows `LocaleProvider`, not the OS locale.
- IME composition on `<input type="time">` is broken in several
  Japanese / Chinese IMEs.

## Keyboard

| Key                   | When                  | Effect                                         |
| --------------------- | --------------------- | ---------------------------------------------- |
| `ArrowUp` / `Down`    | on a segment          | Increment / decrement (with carry to neighbor) |
| `ArrowLeft` / `Right` | on a segment          | Move focus to prev / next segment (RTL-aware)  |
| `0`–`9`               | on a numeric segment  | Type the digit; auto-advance when full         |
| `Backspace`           | on a segment          | Clear digit / move back                        |
| `A` / `P`             | on day-period segment | Set AM / PM                                    |
| `Tab`                 | always                | Leaves the field as a single tab stop          |

## ARIA

| Element             | Role         | aria-\* attributes                                                                  |
| ------------------- | ------------ | ----------------------------------------------------------------------------------- |
| `TimeField.Root`    | `group`      | `aria-labelledby` (Label id), `aria-describedby`                                    |
| `TimeField.Segment` | `spinbutton` | `aria-label` (i18n: "Hour"/"Minute"/"Second"/"AM/PM"), `aria-valuemin/max/now/text` |
| `TimeField.Input`   | (none)       | `aria-invalid` mirrors form-field state                                             |

## API

```ts
import type { Time, CalendarDateTime } from '@internationalized/date';

// TimeField.Root
type TimeFieldProps = {
  value: Time | null;
  onValueChange?: (v: Time | null) => void;
  /** 'hour' | 'minute' | 'second'. Default 'minute'. */
  granularity?: 'hour' | 'minute' | 'second';
  /** Force 12-hour vs 24-hour. Default: from LocaleProvider. */
  hourCycle?: 12 | 24;
  /** Step minutes for the minute segment (e.g. 15 for quarter-hour). */
  minuteStep?: number;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
};

// DateTimeField.Root
type DateTimeFieldProps = {
  value: CalendarDateTime | null;
  onValueChange?: (v: CalendarDateTime | null) => void;
  granularity?: 'minute' | 'second';
  hourCycle?: 12 | 24;
  /** Date constraints — same as DatePicker. */
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
};
```

## i18n strings

| Key                           | en       | ja          |
| ----------------------------- | -------- | ----------- |
| `timeField.segment.hour`      | `Hour`   | `時`        |
| `timeField.segment.minute`    | `Minute` | `分`        |
| `timeField.segment.second`    | `Second` | `秒`        |
| `timeField.segment.dayPeriod` | `AM/PM`  | `午前/午後` |
| `timeField.placeholder`       | `––:––`  | `––:––`     |

`@kumiki/locale/<lang>/time-field`.

## Examples

```svelte
<TimeField.Root bind:value granularity="minute">
  <TimeField.Label>Reminder time</TimeField.Label>
  <TimeField.Input>
    <TimeField.Segment kind="hour" />
    <TimeField.Segment kind="minute" />
    <TimeField.Segment kind="dayPeriod" />
  </TimeField.Input>
</TimeField.Root>
```

```svelte
<DateTimeField.Root bind:value granularity="minute">
  <DateTimeField.Label>Scheduled at</DateTimeField.Label>
  <DateTimeField.DatePart />
  <DateTimeField.TimePart />
</DateTimeField.Root>
```

## Source

- Machine: [`packages/machines/src/time-field`](../../packages/machines/src/time-field) (new), [`packages/machines/src/datetime-field`](../../packages/machines/src/datetime-field) (new)
- Headless: [`packages/headless/src/time-field`](../../packages/headless/src/time-field), [`packages/headless/src/datetime-field`](../../packages/headless/src/datetime-field)
- Component: [`packages/components/src/time-field`](../../packages/components/src/time-field), [`packages/components/src/datetime-field`](../../packages/components/src/datetime-field)

## Anti-patterns

- Don't use `<input type="time">` for a styled time input — non-stylable, IME-fragile, locale-unaware (uses OS locale instead of LocaleProvider).
- Don't combine date and time into a single popover Calendar with a time strip; the segmented input has better SR support and is what users already know from native iOS/macOS time pickers.
- Don't expose `setHours` / `setMinutes` callbacks individually; commit the whole `Time`/`CalendarDateTime` value via `onValueChange` so consumers control commit semantics.

## Related

- [Calendar](#) — month grid; DatePicker pops it.
- [DatePicker](#) — date-only popover field.
- ADR 0013 — `@internationalized/date` peer dep.
