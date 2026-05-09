<!--
  @component TimeField.Root — segmented hh:mm[:ss] input.

  Owns the `Time | null` value and exposes the segment coordinator via
  context. Renders a `<div role="group">` so screen readers announce the
  field as a unit.

  Bindable:
  - `value` (Time | null)

  Plain:
  - `granularity` ('hour' | 'minute' | 'second'). Default `'minute'`.
  - `hourCycle` (12 | 24). Default `24` (override via prop or LocaleProvider).
  - `minuteStep` — increment for ArrowUp/ArrowDown on minute. Default `1`.
  - `disabled` / `readonly` / `required` / `invalid` / `id` / `aria-describedby`.

  See https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
-->
<script lang="ts">
  import { setContext, untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import { Time } from '@internationalized/date';
  import { uid } from '@kumiki/primitives/id';
  import {
    TIME_FIELD_CONTEXT_KEY,
    type TimeFieldContextValue,
    type TimeGranularity,
    type SegmentKind,
  } from './context.js';

  type Props = {
    value?: Time | null;
    defaultValue?: Time | null;
    onValueChange?: (value: Time | null) => void;
    granularity?: TimeGranularity;
    hourCycle?: 12 | 24;
    minuteStep?: number;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    invalid?: boolean;
    id?: string;
    children: Snippet;
    /** Extra props (`class`, `style`, `aria-describedby`, …) forwarded to the wrapper. */
    [key: string]: unknown;
  };

  let {
    value = $bindable(undefined),
    defaultValue = null,
    onValueChange,
    granularity = 'minute',
    hourCycle = 24,
    minuteStep = 1,
    disabled = false,
    readonly = false,
    required = false,
    invalid = false,
    id,
    children,
    ...rest
  }: Props = $props();

  const fieldId = untrack(() => id ?? uid('time-field'));

  let internal = $state<Time | null>(untrack(() => value ?? defaultValue));
  $effect(() => {
    if (value !== undefined && !sameTime(internal, value)) internal = value;
  });

  function sameTime(a: Time | null, b: Time | null): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return a.compare(b) === 0;
  }

  function commit(next: Time | null): void {
    if (sameTime(internal, next)) return;
    internal = next;
    value = next;
    onValueChange?.(next);
  }

  // ─── Segment value getters / setters ─────────────────────────────────────
  function get12HourFromTime(t: Time): number {
    const h = t.hour % 12;
    return h === 0 ? 12 : h;
  }

  function getSegmentValue(kind: SegmentKind): number | 'AM' | 'PM' | null {
    if (!internal) return null;
    switch (kind) {
      case 'hour':
        return hourCycle === 12 ? get12HourFromTime(internal) : internal.hour;
      case 'minute':
        return internal.minute;
      case 'second':
        return internal.second;
      case 'dayPeriod':
        return internal.hour >= 12 ? 'PM' : 'AM';
    }
  }

  function setSegmentValue(kind: SegmentKind, next: number | 'AM' | 'PM' | null): void {
    if (disabled || readonly) return;
    if (next === null) {
      commit(null);
      return;
    }

    const base = internal ?? new Time(0, 0, 0);
    let h = base.hour,
      m = base.minute,
      s = base.second;

    switch (kind) {
      case 'hour':
        if (typeof next !== 'number') return;
        if (hourCycle === 12) {
          const wasPM = h >= 12;
          const twelve = ((next - 1 + 12) % 12) + 1; // wrap into 1..12
          h = (twelve % 12) + (wasPM ? 12 : 0);
        } else {
          h = ((next % 24) + 24) % 24;
        }
        break;
      case 'minute':
        if (typeof next !== 'number') return;
        m = ((next % 60) + 60) % 60;
        break;
      case 'second':
        if (typeof next !== 'number') return;
        s = ((next % 60) + 60) % 60;
        break;
      case 'dayPeriod': {
        const want = next === 'PM';
        const isPM = h >= 12;
        if (want !== isPM) h = (h + 12) % 24;
        break;
      }
    }
    commit(new Time(h, m, s));
  }

  // ─── Roving focus across segments ────────────────────────────────────────
  type SegEntry = { node: HTMLElement; kind: SegmentKind };
  const segments: SegEntry[] = [];

  function focusRelative(from: HTMLElement, dir: 'prev' | 'next'): void {
    const idx = segments.findIndex((s) => s.node === from);
    if (idx === -1) return;
    const nextIdx = dir === 'next' ? idx + 1 : idx - 1;
    const target = segments[nextIdx];
    if (!target) return;
    target.node.focus();
  }

  // ─── Label registration ──────────────────────────────────────────────────
  let labelId = $state<string | null>(null);

  setContext<TimeFieldContextValue>(TIME_FIELD_CONTEXT_KEY, {
    get value() {
      return internal;
    },
    get granularity() {
      return granularity;
    },
    get hourCycle() {
      return hourCycle;
    },
    get minuteStep() {
      return minuteStep;
    },
    get disabled() {
      return disabled;
    },
    get readonly() {
      return readonly;
    },
    get required() {
      return required;
    },
    get invalid() {
      return invalid;
    },
    get labelId() {
      return labelId;
    },
    registerLabel(id) {
      labelId = id;
      return () => {
        if (labelId === id) labelId = null;
      };
    },
    getSegmentValue,
    setSegmentValue,
    registerSegment(node, kind) {
      const entry: SegEntry = { node, kind };
      segments.push(entry);
      return () => {
        const idx = segments.indexOf(entry);
        if (idx >= 0) segments.splice(idx, 1);
      };
    },
    focusRelative,
  });
</script>

<!--
  ARIA note: `aria-readonly`, `aria-required`, and `aria-invalid` aren't
  supported on `role="group"`. The per-segment spinbuttons mirror those
  states themselves; the group exposes `aria-disabled` only and the rest
  via `data-*` for atelier hooks.
-->
<div
  {...rest}
  id={fieldId}
  role="group"
  aria-labelledby={labelId ?? undefined}
  aria-disabled={disabled ? 'true' : undefined}
  data-component-host="time-field"
  data-disabled={disabled ? '' : undefined}
  data-readonly={readonly ? '' : undefined}
  data-required={required ? '' : undefined}
  data-invalid={invalid ? '' : undefined}
>
  {@render children()}
</div>
