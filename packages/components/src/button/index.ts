/**
 * `@kumiki/components/button` — Layer 4 component for the Button.
 *
 * Behavior follows the WAI-ARIA APG button pattern. Loading state preserves
 * the accessible name and focus while blocking activation; `disabled` removes
 * the button from interaction entirely.
 *
 * Two ways to import:
 * ```ts
 * import { Button } from '@kumiki/components/button';
 * // <Button.Root>Save</Button.Root>
 *
 * // or selective:
 * import { Root } from '@kumiki/components/button';
 * // <Root>Save</Root>
 * ```
 *
 * @when-to-use Anywhere you need a clickable command that triggers an action
 *              (Save, Delete, Submit). Pair with `loading={true}` while an
 *              async action is in flight — the accessible name stays intact.
 *
 * @anti-pattern Don't use `disabled` to communicate "loading"; use `loading`
 *               so the accessible name and focus are preserved. Don't put
 *               interactive descendants (links, other buttons) inside.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */

import Root from './Root.svelte';

export { Root };

export const Button = { Root };

export type { Props as ButtonProps } from './Root.svelte';
export type { ButtonController, CreateButtonOptions } from '@kumiki/headless/button';
