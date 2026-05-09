/**
 * `@kumiki/components/horizontal-rule` — semantic separator.
 *
 * Renders `<hr>` by default. `as="div"` (or `orientation="vertical"`)
 * switches to a `role="separator"` `<div>` for layouts where `<hr>` is
 * structurally invalid.
 *
 * @when-to-use Visual / semantic break between sections of unrelated
 *              content. For menu separators use `Menu.Separator`; for
 *              tab list dividers use the `Tabs.List` border treatment.
 *
 * @anti-pattern Don't use this for layout spacing (`<br>`-as-margin); use
 *               CSS gap / margin instead.
 */

import Root from './Root.svelte';

export { Root };

export const HorizontalRule = { Root };

export type { Props as HorizontalRuleProps, HorizontalRuleOrientation } from './Root.svelte';
