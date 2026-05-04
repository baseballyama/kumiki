/**
 * `@kumiki/component-popover` — Layer 4 compound for Popover (non-modal disclosure).
 *
 * Six named exports — Root + Trigger + Content + Close + Title + Description.
 * Root owns the controller; the others read it from context.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import {
 *     Root,
 *     Trigger,
 *     Content,
 *     Close,
 *     Title,
 *     Description,
 *   } from '@kumiki/component-popover';
 *   let open = $state(false);
 * </script>
 *
 * <Root bind:open>
 *   <Trigger>Open menu</Trigger>
 *   <Content>
 *     <Title>Settings</Title>
 *     <Description>Configure your preferences.</Description>
 *     <Close>Done</Close>
 *   </Content>
 * </Root>
 * ```
 *
 * @when-to-use Click-anchored auxiliary content — date pickers, color
 *              swatches, "more options" panels, share menus.
 *
 * @anti-pattern Don't use Popover for modal interruptions (Dialog), for
 *               hover-only disclosure (Tooltip), or for selecting one of
 *               N options (Select / Combobox / Menu).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
 */

import Root from './Root.svelte';
import Trigger from './Trigger.svelte';
import Content from './Content.svelte';
import Close from './Close.svelte';
import Title from './Title.svelte';
import Description from './Description.svelte';

export { Root, Trigger, Content, Close, Title, Description };

export type {
  PopoverContext,
  PopoverController,
  PopoverEvent,
  PopoverMachine,
  PopoverState,
  CreatePopoverOptions,
} from '@kumiki/attachment-popover';
