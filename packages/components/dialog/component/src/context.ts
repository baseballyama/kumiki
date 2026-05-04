/**
 * Internal context shared between Dialog.Root and the leaf components.
 */

import type { DialogController } from '@kumiki/attachment-dialog';

export const DIALOG_CONTEXT_KEY = Symbol('kumiki.dialog');

export interface DialogContextValue {
  controller: DialogController;
}

export type { DialogController } from '@kumiki/attachment-dialog';
