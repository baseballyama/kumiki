/**
 * `@kumiki/machines/number-field` — pure-TS FSM for NumberField (spin button).
 *
 * Linear numeric value, optionally `null` when empty. INCREMENT / DECREMENT
 * arrows by `step`, PageUp / PageDown by `pageStep`, Home / End jump to
 * `min` / `max` (when bounded). When `value` is `null` and the user
 * spins, the machine seeds from `defaultSeed` (clamped to [min,max]).
 *
 * Range bounds may be `±Infinity` to model unbounded fields. The FSM
 * keeps no notion of formatting or text input — Layer 3 owns parse/format.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

export type NumberFieldEvent =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'PAGE_INCREMENT' }
  | { type: 'PAGE_DECREMENT' }
  | { type: 'TO_MIN' }
  | { type: 'TO_MAX' }
  | { type: 'CLEAR' }
  | { type: 'SET.VALUE'; value: number | null }
  | { type: 'SET.MIN'; value: number }
  | { type: 'SET.MAX'; value: number }
  | { type: 'SET.STEP'; value: number }
  | { type: 'SET.PAGE_STEP'; value: number }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface NumberFieldContext {
  value: number | null;
  min: number;
  max: number;
  step: number;
  pageStep: number;
}

export type NumberFieldState = 'idle' | 'disabled';

export type NumberFieldMachine = Machine<NumberFieldContext, NumberFieldEvent, NumberFieldState>;

export interface CreateNumberFieldInput {
  defaultValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  /** PageUp/PageDown step. Default = step * 10. */
  pageStep?: number;
  disabled?: boolean;
}

function snap(n: number, anchor: number, step: number): number {
  if (step <= 0 || !Number.isFinite(step)) return n;
  const base = Number.isFinite(anchor) ? anchor : 0;
  const rel = n - base;
  const snapped = Math.round(rel / step) * step;
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  return Number((base + snapped).toFixed(Math.min(decimals, 20)));
}

function clamp(n: number, min: number, max: number): number {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

function applyValue(ctx: NumberFieldContext, raw: number): NumberFieldContext {
  const snapped = snap(raw, ctx.min, ctx.step);
  return { ...ctx, value: clamp(snapped, ctx.min, ctx.max) };
}

function seed(ctx: NumberFieldContext): number {
  if (ctx.value !== null) return ctx.value;
  if (Number.isFinite(ctx.min)) return ctx.min;
  if (Number.isFinite(ctx.max)) return ctx.max;
  return 0;
}

/**
 * Construct a fresh NumberField machine.
 *
 * @when-to-use Precise numeric input — quantity selectors, ages, prices,
 *              durations. Pair with Slider when users need both rough
 *              dragging and precise typing.
 *
 * @anti-pattern Don't use NumberField for ordinal categories with
 *               semantic names (use RadioGroup) or for free-text numbers
 *               that don't have a step grid (use a plain `<input
 *               type="number">`).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */
export function createNumberFieldMachine(input: CreateNumberFieldInput = {}): NumberFieldMachine {
  const min = input.min ?? Number.NEGATIVE_INFINITY;
  const max = input.max ?? Number.POSITIVE_INFINITY;
  const step = input.step ?? 1;
  const pageStep = input.pageStep ?? step * 10;

  const initialValue =
    input.defaultValue === undefined || input.defaultValue === null
      ? null
      : clamp(snap(input.defaultValue, min, step), min, max);

  const factory = defineMachine<NumberFieldContext, NumberFieldEvent, NumberFieldState>({
    id: 'numberField',
    initial: input.disabled ? 'disabled' : 'idle',
    context: {
      value: initialValue,
      min,
      max,
      step,
      pageStep,
    },
    states: {
      idle: {
        on: {
          INCREMENT: {
            actions: [
              {
                type: 'increment',
                exec: (ctx) => applyValue(ctx, seed(ctx) + ctx.step),
              },
            ],
          },
          DECREMENT: {
            actions: [
              {
                type: 'decrement',
                exec: (ctx) => applyValue(ctx, seed(ctx) - ctx.step),
              },
            ],
          },
          PAGE_INCREMENT: {
            actions: [
              {
                type: 'pageIncrement',
                exec: (ctx) => applyValue(ctx, seed(ctx) + ctx.pageStep),
              },
            ],
          },
          PAGE_DECREMENT: {
            actions: [
              {
                type: 'pageDecrement',
                exec: (ctx) => applyValue(ctx, seed(ctx) - ctx.pageStep),
              },
            ],
          },
          TO_MIN: {
            actions: [
              {
                type: 'toMin',
                exec: (ctx) => {
                  if (!Number.isFinite(ctx.min)) return;
                  return { value: ctx.min };
                },
              },
            ],
          },
          TO_MAX: {
            actions: [
              {
                type: 'toMax',
                exec: (ctx) => {
                  if (!Number.isFinite(ctx.max)) return;
                  return { value: ctx.max };
                },
              },
            ],
          },
          CLEAR: {
            actions: [{ type: 'clear', exec: () => ({ value: null }) }],
          },
          'SET.VALUE': {
            actions: [
              {
                type: 'setValue',
                exec: (ctx, e) => {
                  if (e.type !== 'SET.VALUE') return;
                  if (e.value === null) return { value: null };
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
                  const next = { ...ctx, min: e.value };
                  return ctx.value === null ? { min: e.value } : applyValue(next, ctx.value);
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
                  const next = { ...ctx, max: e.value };
                  return ctx.value === null ? { max: e.value } : applyValue(next, ctx.value);
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
                  const next = { ...ctx, step: e.value };
                  return ctx.value === null ? { step: e.value } : applyValue(next, ctx.value);
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
