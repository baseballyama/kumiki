/**
 * Internal context shared between Menu.Root and its subcomponents.
 */

import type { MenuController, MenuItem } from '@kumiki/attachment-menu';

export const MENU_CONTEXT_KEY = Symbol('kumiki.menu');

export interface MenuContextValue {
  controller: MenuController;
}

export type { MenuController, MenuItem } from '@kumiki/attachment-menu';
