/**
 * Internal context shared between Popover.Root and its subcomponents.
 */

import type { PopoverController } from '@kumiki/headless/popover';

export const POPOVER_CONTEXT_KEY = Symbol('kumiki.popover');

export interface PopoverContextValue {
  controller: PopoverController;
}

export type { PopoverController } from '@kumiki/headless/popover';
