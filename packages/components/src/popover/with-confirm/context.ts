/**
 * Internal context shared between `Popconfirm.*` recipe parts.
 *
 * Populated by `Popconfirm.Root` (which also sets up the surrounding
 * `Popover.Root` context). Layer 4 internal — not part of the public API.
 */

export const POPCONFIRM_CONTEXT_KEY = Symbol('kumiki.popover.with-confirm');

export interface PopconfirmContextValue {
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  /** Run consumer's confirm callback, then close the popover. */
  fireConfirm(): void | Promise<void>;
  /** Run consumer's cancel callback (if any), then close the popover. */
  fireCancel(): void;
  /** Cancel registers itself here so Content can move initial focus to it. */
  registerCancel(node: HTMLButtonElement): () => void;
}
