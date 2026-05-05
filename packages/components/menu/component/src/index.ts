/**
 * `@kumiki/component-menu` — Layer 4 compound for a single-level Menu.
 *
 * Five named exports — Root + Trigger + Menu + Item + Separator. Root
 * owns the controller and exposes its child as a snippet that receives
 * `{ items, controller }` so the consumer iterates without prop-drilling.
 *
 * Submenus (the `menubar` + nested `menu` shape) are deliberately deferred
 * — single-level Menu ships first.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import {
 *     Root,
 *     Trigger,
 *     Menu,
 *     Item,
 *     Separator,
 *     type MenuItem,
 *   } from '@kumiki/component-menu';
 *
 *   const items: MenuItem[] = [
 *     { id: 'new', label: 'New file' },
 *     { id: 'open', label: 'Open' },
 *     { id: 'sep1', label: '', kind: 'separator' },
 *     { id: 'export', label: 'Export' },
 *   ];
 * </script>
 *
 * <Root {items} onSelect={(it) => console.log('selected', it.id)}>
 *   {#snippet children({ items })}
 *     <Trigger>Actions</Trigger>
 *     <Menu>
 *       {#each items as item (item.id)}
 *         {#if item.kind === 'separator'}
 *           <Separator {item} />
 *         {:else}
 *           <Item {item}>{item.label}</Item>
 *         {/if}
 *       {/each}
 *     </Menu>
 *   {/snippet}
 * </Root>
 * ```
 *
 * @when-to-use Action lists invoked from a button — "Open recent",
 *              "More options", context menus.
 *
 * @anti-pattern Don't use Menu for picking a value (Select / Combobox)
 *               or for permanent navigation (Tabs / Sidebar). Submenus
 *               are not yet supported.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 */

import Root from './Root.svelte';
import Trigger from './Trigger.svelte';
import Menu from './Menu.svelte';
import Item from './Item.svelte';
import Separator from './Separator.svelte';

export { Root, Trigger, Menu, Item, Separator };

export type {
  MenuContext,
  MenuController,
  MenuEvent,
  MenuItem,
  MenuMachine,
  MenuState,
  CreateMenuOptions,
} from '@kumiki/headless/menu';
