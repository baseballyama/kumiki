/**
 * `@kumiki/components/popover/with-confirm` — Popconfirm recipe.
 *
 * A "click → confirm in a popover" pattern (delete buttons, destructive
 * toggles). Sits at a sub-subpath because it's a *recipe* on top of
 * `@kumiki/components/popover`, not a new top-level component.
 *
 * What it composes:
 * - A `Popover.Root` (so Escape / outside-click / focus restore all work).
 * - A `<div role="alertdialog">` (APG escalation from the vanilla popover).
 * - A `Message` paragraph wired as `aria-describedby`.
 * - Two `<button>`s: `Confirm` (calls `onConfirm`) and `Cancel`
 *   (calls `onCancel?` then closes).
 *
 * What it adds beyond a hand-rolled Popover composition:
 * - Initial focus is moved to **Cancel** on open (less-destructive default,
 *   per APG `alertdialog` guidance).
 * - i18n labels resolved from `<LocaleProvider>` (`popconfirm.confirm` /
 *   `popconfirm.cancel`), with English fallbacks when no provider is in
 *   the tree.
 *
 * ```svelte
 * <Popconfirm.Root onConfirm={remove} variant="danger">
 *   <Popconfirm.Trigger>Delete</Popconfirm.Trigger>
 *   <Popconfirm.Content>
 *     <Popconfirm.Message>This cannot be undone.</Popconfirm.Message>
 *     <Popconfirm.Cancel />
 *     <Popconfirm.Confirm>Delete</Popconfirm.Confirm>
 *   </Popconfirm.Content>
 * </Popconfirm.Root>
 * ```
 *
 * @when-to-use Single-action confirmations attached to a button
 *              (delete, archive, sign-out). For multi-step modal flows,
 *              reach for `@kumiki/components/dialog` instead.
 *
 * @anti-pattern Don't omit the `Cancel` — `alertdialog` requires a way out.
 *               Don't elevate the variant to `'danger'` for a reversible
 *               action; reserve it for genuinely destructive flows.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
 */

import Root from './Root.svelte';
import Trigger from './Trigger.svelte';
import Content from './Content.svelte';
import Message from './Message.svelte';
import Confirm from './Confirm.svelte';
import Cancel from './Cancel.svelte';

export { Root, Trigger, Content, Message, Confirm, Cancel };

export const Popconfirm = { Root, Trigger, Content, Message, Confirm, Cancel };
