/**
 * Internal context shared between Dialog.Root and the leaf components.
 */

import type { DialogController } from '@kumiki/headless/dialog';

export const DIALOG_CONTEXT_KEY = Symbol('kumiki.dialog');

/**
 * Layout-side hint forwarded from `Dialog.Root` to `Dialog.Content` to drive
 * the Drawer variant. Layer 4 emits no styles; consumers (or atelier) read
 * `data-side` and translate it. `'center'` is the conventional modal default.
 */
export type DialogSide = 'center' | 'left' | 'right' | 'top' | 'bottom';

export interface DialogContextValue {
  controller: DialogController;
  side: DialogSide;
}

export type { DialogController } from '@kumiki/headless/dialog';
