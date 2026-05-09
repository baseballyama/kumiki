/**
 * `@kumiki/components/dialog` — Layer 4 compound component for Dialog.
 *
 * Composes seven sub-components: Root, Trigger, Overlay, Content, Title,
 * Description, Close. Root owns the controller and shares it via context.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import * as Dialog from '@kumiki/components/dialog';
 *   let open = $state(false);
 * </script>
 *
 * <Dialog.Root bind:open>
 *   <Dialog.Trigger>Open settings</Dialog.Trigger>
 *   <Dialog.Overlay />
 *   <Dialog.Content>
 *     <Dialog.Title>Settings</Dialog.Title>
 *     <Dialog.Description>Configure your account.</Dialog.Description>
 *     …form…
 *     <Dialog.Close>Done</Dialog.Close>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 *
 * @when-to-use Modal forms, confirmations, "more info" panels.
 *
 * @anti-pattern Don't use Dialog for transient announcements (Toast) or
 *               navigation (router-driven page).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */

import Root from './Root.svelte';
import Trigger from './Trigger.svelte';
import Overlay from './Overlay.svelte';
import Content from './Content.svelte';
import Title from './Title.svelte';
import Description from './Description.svelte';
import Close from './Close.svelte';

export { Root, Trigger, Overlay, Content, Title, Description, Close };

export type { DialogSide } from './context.js';

export type {
  DialogContext,
  DialogController,
  DialogEvent,
  DialogMachine,
  DialogState,
  CreateDialogOptions,
} from '@kumiki/headless/dialog';
