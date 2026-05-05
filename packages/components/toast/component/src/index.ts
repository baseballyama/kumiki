/**
 * `@kumiki/component-toast` — Layer 4 compound for the Toast (toaster queue).
 *
 * Six named exports — Toaster (Root) + Viewport + Item + Title + Description + Close.
 *
 * Toaster owns the controller and exposes its child as a snippet that
 * receives `{ toasts, controller }`, so the consumer can iterate and call
 * back into the controller without prop-drilling.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import {
 *     Toaster,
 *     Viewport,
 *     Item,
 *     Title,
 *     Description,
 *     Close,
 *   } from '@kumiki/component-toast';
 * </script>
 *
 * <Toaster>
 *   {#snippet children({ toasts, controller })}
 *     <Viewport>
 *       {#each toasts as toast (toast.id)}
 *         <Item {toast}>
 *           <Title>{toast.title}</Title>
 *           {#if toast.description}<Description>{toast.description}</Description>{/if}
 *           <Close>×</Close>
 *         </Item>
 *       {/each}
 *     </Viewport>
 *
 *     <button onclick={() => controller.add({ title: 'Saved' })}>Notify</button>
 *   {/snippet}
 * </Toaster>
 * ```
 *
 * @when-to-use Transient, non-modal feedback — "Saved", "Failed to send".
 *              One toaster per app, mounted near the root.
 *
 * @anti-pattern Don't use Toast for anything the user has to act on
 *               (use Dialog) or for critical errors that must not be
 *               missed (use a banner / status message).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#live
 */

import Toaster from './Toaster.svelte';
import Viewport from './Viewport.svelte';
import Item from './Item.svelte';
import Title from './Title.svelte';
import Description from './Description.svelte';
import Close from './Close.svelte';

export { Toaster, Viewport, Item, Title, Description, Close };

export type {
  ToastContext,
  ToastController,
  ToastEvent,
  ToastItem,
  ToastMachine,
  ToastPoliteness,
  ToastState,
  ToastType,
  CreateToastOptions,
} from '@kumiki/headless/toast';
