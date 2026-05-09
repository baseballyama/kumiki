<!--
  @component TimeField.Segment — one spinbutton segment of the time input.

  Required props:
  - `kind` — `'hour' | 'minute' | 'second' | 'dayPeriod'`.

  Behavior:
  - Renders a `<span role="spinbutton">` with `aria-valuemin/max/now/text`
    and the appropriate i18n `aria-label`.
  - ArrowUp / ArrowDown increment / decrement (with wrap).
  - 0–9 type into the segment with auto-advance to the next segment when
    the typed value can no longer accept another digit.
  - Backspace clears the typed buffer (and the segment value).
  - 'A' / 'P' toggle the dayPeriod segment.
  - ArrowLeft / ArrowRight move focus across siblings via the field
    coordinator (no manual tabindex juggling needed).
-->
<script lang="ts">
  import { getContext, untrack } from 'svelte';
  import { tryUseLocale } from '../locale-provider/index.js';
  import {
    TIME_FIELD_CONTEXT_KEY,
    type TimeFieldContextValue,
    type SegmentKind,
  } from './context.js';

  type Props = {
    kind: SegmentKind;
    /** Extra props (`class`, `style`, …) forwarded to the `<span>`. */
    [key: string]: unknown;
  };

  let { kind, ...rest }: Props = $props();

  const ctxOptional = getContext<TimeFieldContextValue | undefined>(TIME_FIELD_CONTEXT_KEY);
  if (!ctxOptional) {
    throw new Error('<TimeField.Segment> must be inside <TimeField.Root>.');
  }
  const ctx: TimeFieldContextValue = ctxOptional;
  const locale = tryUseLocale();

  // Numeric segments accumulate typed digits; cleared on Backspace / ArrowUp/Down.
  let typedBuffer = $state('');

  const config = $derived.by(() => {
    switch (kind) {
      case 'hour':
        return ctx.hourCycle === 12
          ? { min: 1, max: 12, pad: 2, isNumeric: true as const }
          : { min: 0, max: 23, pad: 2, isNumeric: true as const };
      case 'minute':
        return { min: 0, max: 59, pad: 2, isNumeric: true as const };
      case 'second':
        return { min: 0, max: 59, pad: 2, isNumeric: true as const };
      case 'dayPeriod':
        return { min: 0, max: 1, pad: 0, isNumeric: false as const };
    }
  });

  const ariaLabel = $derived.by(() => {
    const m = locale?.messages.timeField;
    if (kind === 'hour') return m?.hour ?? 'Hour';
    if (kind === 'minute') return m?.minute ?? 'Minute';
    if (kind === 'second') return m?.second ?? 'Second';
    return m?.dayPeriod ?? 'AM/PM';
  });

  const placeholder = $derived(locale?.messages.timeField.placeholder ?? '––');
  const amLabel = $derived(locale?.messages.timeField.am ?? 'AM');
  const pmLabel = $derived(locale?.messages.timeField.pm ?? 'PM');

  const value = $derived(ctx.getSegmentValue(kind));
  const display = $derived.by(() => {
    if (value === null) return placeholder;
    if (kind === 'dayPeriod') return value === 'PM' ? pmLabel : amLabel;
    return String(value).padStart(config.pad, '0');
  });
  const ariaValueText = $derived(value === null ? placeholder : display);
  const ariaValueNow = $derived.by(() => {
    if (value === null) return undefined;
    if (kind === 'dayPeriod') return value === 'PM' ? 1 : 0;
    return value as number;
  });

  function attach(node: HTMLElement): () => void {
    return ctx.registerSegment(node, kind);
  }

  function increment(): void {
    if (kind === 'dayPeriod') {
      ctx.setSegmentValue(kind, value === 'PM' ? 'AM' : 'PM');
      return;
    }
    const numericValue = (value as number | null) ?? config.min;
    const step = kind === 'minute' ? Math.max(1, ctx.minuteStep) : 1;
    const range = config.max - config.min + 1;
    const next = ((numericValue - config.min + step) % range) + config.min;
    typedBuffer = '';
    ctx.setSegmentValue(kind, next);
  }
  function decrement(): void {
    if (kind === 'dayPeriod') {
      ctx.setSegmentValue(kind, value === 'PM' ? 'AM' : 'PM');
      return;
    }
    const numericValue = (value as number | null) ?? config.min;
    const step = kind === 'minute' ? Math.max(1, ctx.minuteStep) : 1;
    const range = config.max - config.min + 1;
    const next = ((numericValue - config.min - step + range) % range) + config.min;
    typedBuffer = '';
    ctx.setSegmentValue(kind, next);
  }

  function typeDigit(d: string, currentNode: HTMLElement): void {
    if (!config.isNumeric) return;
    const candidate = (typedBuffer + d).slice(-config.pad);
    const candidateNum = Number(candidate);
    // If a 1-digit value already saturates the maximum two-digit space
    // (e.g. typed '3' for hour in 24-hour cycle: '3X' would overflow > 23),
    // commit immediately and advance.
    const fits = candidateNum >= config.min && candidateNum <= config.max;
    if (!fits) {
      // Try the digit alone.
      const single = Number(d);
      if (single >= config.min && single <= config.max) {
        typedBuffer = d;
        ctx.setSegmentValue(kind, single);
        if (d.length >= config.pad || single * 10 > config.max) {
          // Auto-advance.
          typedBuffer = '';
          untrack(() => ctx.focusRelative(currentNode, 'next'));
        }
      }
      return;
    }
    typedBuffer = candidate;
    ctx.setSegmentValue(kind, candidateNum);
    // If buffer is full or next digit can't fit, advance.
    const couldFitMore = candidateNum * 10 + 9 <= config.max;
    if (typedBuffer.length >= config.pad || !couldFitMore) {
      typedBuffer = '';
      untrack(() => ctx.focusRelative(currentNode, 'next'));
    }
  }

  function clear(): void {
    typedBuffer = '';
    ctx.setSegmentValue(kind, null);
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (ctx.disabled || ctx.readonly) return;
    const node = event.currentTarget as HTMLElement;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        increment();
        return;
      case 'ArrowDown':
        event.preventDefault();
        decrement();
        return;
      case 'ArrowLeft':
        event.preventDefault();
        ctx.focusRelative(node, locale?.dir === 'rtl' ? 'next' : 'prev');
        return;
      case 'ArrowRight':
        event.preventDefault();
        ctx.focusRelative(node, locale?.dir === 'rtl' ? 'prev' : 'next');
        return;
      case 'Backspace':
        event.preventDefault();
        clear();
        return;
      case 'a':
      case 'A':
        if (kind === 'dayPeriod') {
          event.preventDefault();
          ctx.setSegmentValue(kind, 'AM');
        }
        return;
      case 'p':
      case 'P':
        if (kind === 'dayPeriod') {
          event.preventDefault();
          ctx.setSegmentValue(kind, 'PM');
        }
        return;
    }
    if (config.isNumeric && /^[0-9]$/.test(event.key)) {
      event.preventDefault();
      typeDigit(event.key, node);
    }
  }

  function handleFocus(): void {
    typedBuffer = '';
  }
</script>

<span
  {...rest}
  role="spinbutton"
  tabindex={ctx.disabled ? -1 : 0}
  aria-label={ariaLabel}
  aria-valuemin={kind === 'dayPeriod' ? 0 : config.min}
  aria-valuemax={kind === 'dayPeriod' ? 1 : config.max}
  aria-valuenow={ariaValueNow}
  aria-valuetext={ariaValueText}
  aria-disabled={ctx.disabled ? 'true' : undefined}
  aria-readonly={ctx.readonly ? 'true' : undefined}
  data-component-part="segment"
  data-segment-kind={kind}
  data-empty={value === null ? '' : undefined}
  onkeydown={handleKeydown}
  onfocus={handleFocus}
  {@attach attach}
>
  {display}
</span>
