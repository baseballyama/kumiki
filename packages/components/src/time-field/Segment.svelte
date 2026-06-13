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
    if (kind === 'dayPeriod') return { min: 0, max: 1, pad: 0 };
    if (kind === 'hour')
      return { min: ctx.hourCycle === 12 ? 1 : 0, max: ctx.hourCycle === 12 ? 12 : 23, pad: 2 };
    return { min: 0, max: 59, pad: 2 };
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
  const ariaValueNow = $derived.by(() => {
    if (value === null) return undefined;
    if (kind === 'dayPeriod') return value === 'PM' ? 1 : 0;
    return value as number;
  });

  // Single tab stop: only the active segment is `tabindex="0"`. `segmentRef`
  // stays `null` until `{@attach}` runs (post-hydration), so SSR markup keeps
  // every segment at `tabindex="-1"` and the active segment only becomes the
  // tab stop once the field is interactive.
  let segmentRef = $state<HTMLElement | null>(null);
  const isTabStop = $derived(segmentRef !== null && segmentRef === ctx.tabStop);

  function attach(node: HTMLElement): () => void {
    segmentRef = node;
    return untrack(() => ctx.registerSegment(node));
  }

  function bump(dir: 1 | -1): void {
    if (kind === 'dayPeriod') {
      ctx.setSegmentValue(kind, value === 'PM' ? 'AM' : 'PM');
      return;
    }
    const numericValue = (value as number | null) ?? config.min;
    const step = (kind === 'minute' ? Math.max(1, ctx.minuteStep) : 1) * dir;
    const range = config.max - config.min + 1;
    const next = ((((numericValue - config.min + step) % range) + range) % range) + config.min;
    typedBuffer = '';
    ctx.setSegmentValue(kind, next);
  }

  function advance(): void {
    typedBuffer = '';
    if (segmentRef) ctx.focusRelative(segmentRef, 'next');
  }

  function clear(): void {
    typedBuffer = '';
    ctx.setSegmentValue(kind, null);
  }

  function typeDigit(d: string): void {
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
        if (single * 10 > config.max) advance();
      }
      return;
    }
    typedBuffer = candidate;
    ctx.setSegmentValue(kind, candidateNum);
    // If buffer is full or next digit can't fit, advance.
    const couldFitMore = candidateNum * 10 + 9 <= config.max;
    if (typedBuffer.length >= config.pad || !couldFitMore) advance();
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (ctx.disabled || ctx.readonly || !segmentRef) return;
    const node = segmentRef;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        bump(1);
        return;
      case 'ArrowDown':
        event.preventDefault();
        bump(-1);
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
    }
    if (kind === 'dayPeriod') {
      const k = event.key.toLowerCase();
      if (k === 'a' || k === 'p') {
        event.preventDefault();
        ctx.setSegmentValue(kind, k === 'a' ? 'AM' : 'PM');
      }
      return;
    }
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      typeDigit(event.key);
    }
  }

  function handleFocus(): void {
    typedBuffer = '';
  }
</script>

<span
  {...rest}
  role="spinbutton"
  tabindex={isTabStop && !ctx.disabled ? 0 : -1}
  aria-label={ariaLabel}
  aria-valuemin={config.min}
  aria-valuemax={config.max}
  aria-valuenow={ariaValueNow}
  aria-valuetext={display}
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
