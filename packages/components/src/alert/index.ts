/**
 * `@kumiki/components/alert` — Layer 4 component for the Alert.
 *
 * Static page-level message surface. Maps `severity` to `role`/`aria-live`:
 * - `error` → `role="alert"` + `aria-live="assertive"`
 * - others → `role="status"` + `aria-live="polite"`
 *
 * Override via the `live` prop on `Alert.Root`.
 *
 * ```ts
 * import { Alert } from '@kumiki/components/alert';
 *
 * <Alert.Root severity="error">
 *   <Alert.Title>Something went wrong</Alert.Title>
 *   <Alert.Description>Please retry in a moment.</Alert.Description>
 * </Alert.Root>
 * ```
 *
 * @when-to-use Page-level banners (maintenance notice, error from a route
 *              load, success after a form submit). For ephemeral feedback
 *              that auto-dismisses, use `Toast` instead.
 *
 * @anti-pattern Don't render `role="alert"` for non-urgent info — it overrides
 *              VoiceOver focus and is hostile. Reserve `severity="error"` for
 *              cases where assertive announcement is genuinely warranted.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 */

import Root from './Root.svelte';
import Title from './Title.svelte';
import Description from './Description.svelte';
import Close from './Close.svelte';

export { Root, Title, Description, Close };

export const Alert = { Root, Title, Description, Close };

export type { Props as AlertProps, AlertSeverity, AlertLive } from './Root.svelte';
export type { AlertController, CreateAlertOptions } from '@kumiki/headless/alert';
