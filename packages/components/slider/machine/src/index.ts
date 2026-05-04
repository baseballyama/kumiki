/**
 * `@kumiki/machine-slider` — pure-TS FSM for Slider.
 *
 * Single linear value clamped to `[min, max]` and snapped to a `step`
 * grid. Increment / decrement events accept an optional `pageStep`
 * multiplier for PageUp / PageDown semantics. The Layer 3 attachment
 * translates physical key codes (and RTL inversion of horizontal arrows)
 * into the machine's logical INCREMENT / DECREMENT events.
 *
 * Orientation is metadata only — the machine doesn't care; the
 * controller uses it to choose which arrow keys map to which direction.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

export type SliderOrientation = 'horizontal' | 'vertical';

export type SliderEvent =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'PAGE_INCREMENT' }
  | { type: 'PAGE_DECREMENT' }
  | { type: 'TO_MIN' }
  | { type: 'TO_MAX' }
  | { type: 'SET.VALUE'; value: number }
  | { type: 'SET.MIN'; value: number }
  | { type: 'SET.MAX'; value: number }
  | { type: 'SET.STEP'; value: number }
  | { type: 'SET.PAGE_STEP'; value: number }
  | { type: 'SET.ORIENTATION'; value: SliderOrientation }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface SliderContext {
  value: number;
  min: number;
  max: number;
  step: number;
  pageStep: number;
  orientation: SliderOrientation;
}

export type SliderState = 'idle' | 'disabled';

export type SliderMachine = Machine<SliderContext, SliderEvent, SliderState>;

export interface CreateSliderInput {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  /** PageUp/PageDown step. Default = step * 10. */
  pageStep?: number;
  orientation?: SliderOrientation;
  disabled?: boolean;
}

/**
 * Round `n` to the nearest multiple of `step`, anchored at `min`.
 * Avoids floating-point drift on e.g. step=0.1.
 */
function snap(n: number, min: number, step: number): number {
  if (step <= 0) return n;
  const rel = n - min;
  const snapped = Math.round(rel / step) * step;
  // Decimal stabilization for human-readable values.
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  return Number((min + snapped).toFixed(decimals));
}

function clamp(n: number, min: number, max: number): number {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function applyValue(ctx: SliderContext, raw: number): SliderContext {
  const snapped = snap(raw, ctx.min, ctx.step);
  return { ...ctx, value: clamp(snapped, ctx.min, ctx.max) };
}

/**
 * Construct a fresh Slider machine.
 *
 * @when-to-use Continuous numeric input — volume, brightness, opacity,
 *              date pickers' year scrubber. Pair with NumberField for
 *              precise typing; Slider is the affordance for "drag to a
 *              rough value".
 *
 * @anti-pattern Don't use Slider for binary on/off — use Switch. Don't
 *               use Slider when the discrete options have semantic names
 *               rather than positions on a number line — use RadioGroup.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */
export function createSliderMachine(input: CreateSliderInput = {}): SliderMachine {
  const min = input.min ?? 0;
  const max = input.max ?? 100;
  const step = input.step ?? 1;
  const pageStep = input.pageStep ?? step * 10;
  const orientation = input.orientation ?? 'horizontal';
  const initialValue = clamp(snap(input.defaultValue ?? min, min, step), min, max);

  const factory = defineMachine<SliderContext, SliderEvent, SliderState>({
    id: 'slider',
    initial: input.disabled ? 'disabled' : 'idle',
    context: {
      value: initialValue,
      min,
      max,
      step,
      pageStep,
      orientation,
    },
    states: {
      idle: {
        on: {
          INCREMENT: {
            actions: [
              {
                type: 'increment',
                exec: (ctx) => applyValue(ctx, ctx.value + ctx.step),
              },
            ],
          },
          DECREMENT: {
            actions: [
              {
                type: 'decrement',
                exec: (ctx) => applyValue(ctx, ctx.value - ctx.step),
              },
            ],
          },
          PAGE_INCREMENT: {
            actions: [
              {
                type: 'pageIncrement',
                exec: (ctx) => applyValue(ctx, ctx.value + ctx.pageStep),
              },
            ],
          },
          PAGE_DECREMENT: {
            actions: [
              {
                type: 'pageDecrement',
                exec: (ctx) => applyValue(ctx, ctx.value - ctx.pageStep),
              },
            ],
          },
          TO_MIN: {
            actions: [{ type: 'toMin', exec: (ctx) => ({ value: ctx.min }) }],
          },
          TO_MAX: {
            actions: [{ type: 'toMax', exec: (ctx) => ({ value: ctx.max }) }],
          },
          'SET.VALUE': {
            actions: [
              {
                type: 'setValue',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.VALUE') return;
                  return applyValue(ctx, e.value);
                },
              },
            ],
          },
          'SET.MIN': {
            actions: [
              {
                type: 'setMin',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.MIN') return;
                  const min = e.value;
                  return applyValue({ ...ctx, min }, ctx.value);
                },
              },
            ],
          },
          'SET.MAX': {
            actions: [
              {
                type: 'setMax',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.MAX') return;
                  const max = e.value;
                  return applyValue({ ...ctx, max }, ctx.value);
                },
              },
            ],
          },
          'SET.STEP': {
            actions: [
              {
                type: 'setStep',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.STEP') return;
                  return applyValue({ ...ctx, step: e.value }, ctx.value);
                },
              },
            ],
          },
          'SET.PAGE_STEP': {
            actions: [
              {
                type: 'setPageStep',
                exec: (_, e) => {
                  if (e.type !== 'SET.PAGE_STEP') return;
                  return { pageStep: e.value };
                },
              },
            ],
          },
          'SET.ORIENTATION': {
            actions: [
              {
                type: 'setOrientation',
                exec: (_, e) => {
                  if (e.type !== 'SET.ORIENTATION') return;
                  return { orientation: e.value };
                },
              },
            ],
          },
          DISABLE: 'disabled',
        },
      },
      disabled: {
        on: {
          ENABLE: 'idle',
        },
      },
    },
  });

  return factory();
}
