/**
 * Internal context shared between `Toolbar.Root` and its children.
 *
 * The Root owns the roving-tabindex coordinator and exposes the orientation
 * (horizontal | vertical). Items register themselves so the Root can rove
 * focus across them and decide which one currently hosts the single tab stop.
 *
 * Layer 4 internal — not part of the public API.
 */

export const TOOLBAR_CONTEXT_KEY = Symbol('kumiki.toolbar');

export type ToolbarOrientation = 'horizontal' | 'vertical';

export interface ToolbarContextValue {
  readonly orientation: ToolbarOrientation;
  /**
   * Register an item button so the toolbar can rove focus across it.
   * Returns a deregister function to call on unmount.
   */
  register(node: HTMLElement, disabled: boolean): () => void;
  /** Update the per-item disabled flag (when item-level `disabled` prop changes). */
  setItemDisabled(node: HTMLElement, disabled: boolean): void;
  /** Whether the given node is the current single tab stop for the toolbar. */
  isTabStop(node: HTMLElement | null): boolean;
  /** Notify the toolbar that this item received focus (keep the tab stop in sync). */
  notifyFocus(node: HTMLElement): void;
  /** Move the roving focus from the given node — called on Arrow/Home/End. */
  focusRelative(from: HTMLElement, dir: 'prev' | 'next' | 'first' | 'last'): void;
}
