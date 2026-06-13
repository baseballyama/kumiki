/**
 * Internal context for TimeField — shared between Root, Input, Segment, Label.
 */

import type { Time } from '@internationalized/date';

export const TIME_FIELD_CONTEXT_KEY = Symbol('kumiki.time-field');

export type TimeGranularity = 'hour' | 'minute' | 'second';
export type SegmentKind = 'hour' | 'minute' | 'second' | 'dayPeriod';

export interface TimeFieldContextValue {
  readonly value: Time | null;
  readonly granularity: TimeGranularity;
  readonly hourCycle: 12 | 24;
  readonly minuteStep: number;
  readonly disabled: boolean;
  readonly readonly: boolean;
  readonly required: boolean;
  readonly invalid: boolean;
  readonly labelId: string | null;
  registerLabel(id: string): () => void;

  /** Read the current value of a segment (`null` if unset). */
  getSegmentValue(kind: SegmentKind): number | 'AM' | 'PM' | null;
  /** Commit a new value for a segment. Triggers `onValueChange`. */
  setSegmentValue(kind: SegmentKind, next: number | 'AM' | 'PM' | null): void;

  /**
   * Register a focusable segment so the field can rove focus across it and
   * decide which one currently hosts the single tab stop. Returns a
   * deregister function to call on unmount.
   */
  registerSegment(node: HTMLElement): () => void;
  /** The segment node that currently hosts the field's single tab stop. */
  readonly tabStop: HTMLElement | null;
  /** Roving focus among segments — Arrow Left/Right handlers call this. */
  focusRelative(from: HTMLElement, dir: 'prev' | 'next'): void;
}
