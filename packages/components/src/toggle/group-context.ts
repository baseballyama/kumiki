/**
 * Internal context shared between `Toggle.Group` and `Toggle.GroupItem`.
 *
 * The Group owns the selection model and the roving-tabindex coordinator;
 * each GroupItem reads from this context to decide its `aria-pressed` /
 * `aria-checked`, its `tabindex`, and to dispatch focus/select intents back.
 *
 * Layer 4 internal — not part of the public API.
 */

export const TOGGLE_GROUP_CONTEXT_KEY = Symbol('kumiki.toggle.group');

export type ToggleGroupMode = 'single' | 'multiple';

export interface ToggleGroupContext {
  readonly mode: ToggleGroupMode;
  readonly disabled: boolean;
  isSelected(value: string): boolean;
  /** Toggle / set the value. Item disabled state is enforced inside Group. */
  toggle(value: string): void;
  /** Register a button node so the group can rove focus across it. Returns deregister. */
  register(value: string, node: HTMLButtonElement, disabled: boolean): () => void;
  /** Update the per-item disabled flag (used when item-level `disabled` prop changes). */
  setItemDisabled(value: string, disabled: boolean): void;
  /** Whether this item should currently host the single tab stop. */
  isTabStop(value: string): boolean;
  /** Notify the group that this item's button received focus (so we keep the tab stop in sync). */
  notifyFocus(value: string): void;
  /** Move the roving focus relative to the given value; called on Arrow/Home/End. */
  focusRelative(from: string, dir: 'prev' | 'next' | 'first' | 'last'): void;
}
