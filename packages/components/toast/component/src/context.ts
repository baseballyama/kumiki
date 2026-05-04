/**
 * Internal context shared between Toast.Toaster and its subcomponents.
 */

import type { ToastController, ToastItem } from '@kumiki/attachment-toast';

export const TOASTER_CONTEXT_KEY = Symbol('kumiki.toaster');
export const TOAST_ITEM_CONTEXT_KEY = Symbol('kumiki.toast-item');

export interface ToasterContextValue {
  controller: ToastController;
}

export interface ToastItemContextValue {
  toast: ToastItem;
}

export type { ToastController, ToastItem } from '@kumiki/attachment-toast';
