/**
 * `@kumiki/headless/slider` — Layer 3 Svelte 5 attachments for Slider.
 *
 * Two factories:
 * - `root` — the track container; pointer-down anywhere inside maps the
 *   pointer position to a value (along the active axis) and starts a
 *   drag-tracking session that updates value as the pointer moves.
 * - `thumb` — the focusable indicator with `role="slider"` and full
 *   ARIA value attributes. Receives keyboard.
 *
 * Keyboard (per APG Slider):
 * - horizontal LTR: ArrowRight/Up = increment, ArrowLeft/Down = decrement
 * - horizontal RTL: ArrowLeft/Up = increment, ArrowRight/Down = decrement
 * - vertical: ArrowUp = increment, ArrowDown = decrement; horizontal
 *   arrows are no-ops
 * - PageUp/Down = page increment / decrement
 * - Home/End = TO_MIN / TO_MAX
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */

import {
  createSliderMachine,
  type CreateSliderInput,
  type SliderContext,
  type SliderEvent,
  type SliderMachine,
  type SliderOrientation,
  type SliderState,
} from '@kumiki/machines/slider';
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export type SliderDirection = 'ltr' | 'rtl';

export interface SliderController {
  readonly id: string;
  readonly state: SliderState;
  readonly context: Readonly<SliderContext>;
  readonly value: number;
  readonly disabled: boolean;

  setValue(value: number): void;
  setMin(value: number): void;
  setMax(value: number): void;
  setStep(value: number): void;
  setPageStep(value: number): void;
  setOrientation(value: SliderOrientation): void;
  setDirection(value: SliderDirection): void;
  setDisabled(value: boolean): void;

  subscribe(
    listener: (snapshot: { state: SliderState; context: SliderContext }) => void,
  ): () => void;

  readonly trackId: string;
  readonly thumbId: string;

  readonly root: Attachment;
  readonly thumb: Attachment;

  readonly machine: SliderMachine;
}

export interface CreateSliderOptions extends CreateSliderInput {
  onValueChange?: (value: number) => void;
  id?: string;
  direction?: SliderDirection;
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export function createSlider(options: CreateSliderOptions = {}): SliderController {
  const machine = createSliderMachine(options);
  const id = options.id ?? uid('slider');
  const trackId = `${id}-track`;
  const thumbId = `${id}-thumb`;

  let direction: SliderDirection = options.direction ?? 'ltr';

  let prevValue = machine.context.value;
  machine.subscribe(({ context }) => {
    if (context.value !== prevValue) {
      prevValue = context.value;
      options.onValueChange?.(context.value);
    }
  });

  let trackEl: HTMLElement | null = null;

  function valueFromPointer(event: PointerEvent): number {
    if (!trackEl) return machine.context.value;
    const rect = trackEl.getBoundingClientRect();
    const ctx = machine.context;
    let pct: number;
    if (ctx.orientation === 'vertical') {
      // Vertical: top = max, bottom = min (visually). Inverted ratio.
      pct = clamp01((rect.bottom - event.clientY) / rect.height);
    } else {
      pct = clamp01((event.clientX - rect.left) / rect.width);
      if (direction === 'rtl') pct = 1 - pct;
    }
    return ctx.min + pct * (ctx.max - ctx.min);
  }

  // ── root (track) attachment ─────────────────────────────────────────
  const root: Attachment = (node) => {
    if (!node.id) node.id = trackId;
    node.setAttribute('data-component-host', 'slider');
    trackEl = node;

    const paint = (): void => {
      const ctx = machine.context;
      node.setAttribute('data-orientation', ctx.orientation);
      if (machine.state === 'disabled') node.setAttribute('data-disabled', '');
      else node.removeAttribute('data-disabled');
      // Paint `--kumiki-slider-pct` on the root so styled variants can render
      // the filled range as a background gradient or position decorative
      // children without needing a separate Range component.
      const pct = ctx.max === ctx.min ? 0 : ((ctx.value - ctx.min) / (ctx.max - ctx.min)) * 100;
      const visualPct = ctx.orientation === 'horizontal' && direction === 'rtl' ? 100 - pct : pct;
      node.style.setProperty('--kumiki-slider-pct', `${visualPct}%`);
    };
    paint();

    let dragActive = false;
    function endDrag(): void {
      if (!dragActive) return;
      dragActive = false;
      if (typeof document !== 'undefined') {
        document.removeEventListener('pointermove', onDocumentPointerMove);
        document.removeEventListener('pointerup', onDocumentPointerUp);
      }
    }
    function onDocumentPointerMove(event: PointerEvent): void {
      if (!dragActive || machine.state === 'disabled') return;
      machine.send({ type: 'SET.VALUE', value: valueFromPointer(event) });
    }
    function onDocumentPointerUp(): void {
      endDrag();
    }
    function onPointerDown(event: PointerEvent): void {
      if (machine.state === 'disabled') return;
      // Primary button only.
      if (event.button !== 0) return;
      event.preventDefault();
      machine.send({ type: 'SET.VALUE', value: valueFromPointer(event) });
      dragActive = true;
      if (typeof document !== 'undefined') {
        document.addEventListener('pointermove', onDocumentPointerMove);
        document.addEventListener('pointerup', onDocumentPointerUp);
      }
    }

    node.addEventListener('pointerdown', onPointerDown);
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      endDrag();
      node.removeEventListener('pointerdown', onPointerDown);
      if (trackEl === node) trackEl = null;
    };
  };

  // ── thumb attachment ────────────────────────────────────────────────
  const thumb: Attachment = (node) => {
    if (!node.id) node.id = thumbId;
    node.setAttribute('role', 'slider');
    if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '0');

    const paint = (): void => {
      const ctx = machine.context;
      node.setAttribute('aria-valuemin', String(ctx.min));
      node.setAttribute('aria-valuemax', String(ctx.max));
      node.setAttribute('aria-valuenow', String(ctx.value));
      node.setAttribute('aria-orientation', ctx.orientation);
      node.setAttribute('data-state', machine.state);
      const pct = ctx.max === ctx.min ? 0 : ((ctx.value - ctx.min) / (ctx.max - ctx.min)) * 100;
      const visualPct = ctx.orientation === 'horizontal' && direction === 'rtl' ? 100 - pct : pct;
      node.style.setProperty('--kumiki-slider-pct', `${visualPct}%`);
      if (machine.state === 'disabled') node.setAttribute('aria-disabled', 'true');
      else node.removeAttribute('aria-disabled');
    };
    paint();

    function isPrev(key: string): boolean {
      if (machine.context.orientation === 'vertical') return key === 'ArrowDown';
      // horizontal
      return direction === 'rtl' ? key === 'ArrowRight' : key === 'ArrowLeft';
    }
    function isNext(key: string): boolean {
      if (machine.context.orientation === 'vertical') return key === 'ArrowUp';
      return direction === 'rtl' ? key === 'ArrowLeft' : key === 'ArrowRight';
    }

    const onKeydown = (event: KeyboardEvent): void => {
      if (machine.state === 'disabled') return;
      if (isPrev(event.key)) {
        event.preventDefault();
        machine.send({ type: 'DECREMENT' });
        return;
      }
      if (isNext(event.key)) {
        event.preventDefault();
        machine.send({ type: 'INCREMENT' });
        return;
      }
      switch (event.key) {
        case 'PageDown':
          event.preventDefault();
          machine.send({ type: 'PAGE_DECREMENT' });
          break;
        case 'PageUp':
          event.preventDefault();
          machine.send({ type: 'PAGE_INCREMENT' });
          break;
        case 'Home':
          event.preventDefault();
          machine.send({ type: 'TO_MIN' });
          break;
        case 'End':
          event.preventDefault();
          machine.send({ type: 'TO_MAX' });
          break;
        default:
          break;
      }
    };

    node.addEventListener('keydown', onKeydown);
    const unsub = machine.subscribe(paint);

    return () => {
      unsub();
      node.removeEventListener('keydown', onKeydown);
    };
  };

  return {
    id,
    trackId,
    thumbId,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get value() {
      return machine.context.value;
    },
    get disabled() {
      return machine.state === 'disabled';
    },
    setValue: (v) => machine.send({ type: 'SET.VALUE', value: v }),
    setMin: (v) => machine.send({ type: 'SET.MIN', value: v }),
    setMax: (v) => machine.send({ type: 'SET.MAX', value: v }),
    setStep: (v) => machine.send({ type: 'SET.STEP', value: v }),
    setPageStep: (v) => machine.send({ type: 'SET.PAGE_STEP', value: v }),
    setOrientation: (v) => machine.send({ type: 'SET.ORIENTATION', value: v }),
    setDirection: (v) => {
      direction = v;
    },
    setDisabled: (v) => machine.send({ type: v ? 'DISABLE' : 'ENABLE' } as SliderEvent),
    subscribe: machine.subscribe.bind(machine),
    root,
    thumb,
    machine,
  };
}

export type { SliderContext, SliderEvent, SliderMachine, SliderOrientation, SliderState };
