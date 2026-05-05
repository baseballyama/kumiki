/**
 * Internal context shared between Tooltip.Root and the leaf components.
 */

import type { TooltipController } from '@kumiki/headless/tooltip';

export const TOOLTIP_CONTEXT_KEY = Symbol('kumiki.tooltip');

export interface TooltipContextValue {
  controller: TooltipController;
}

export type { TooltipController } from '@kumiki/headless/tooltip';
