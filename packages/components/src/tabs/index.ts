/**
 * `@kumiki/components/tabs` — Layer 4 compound component for Tabs.
 *
 * Composes four sub-components: `Root`, `List`, `Tab`, `Panel`. Root owns the
 * controller and shares it via context. Tab + Panel pair by `value`.
 *
 * @when-to-use Switching between mutually-exclusive panels of related content
 *              within a single page region — settings panes, dashboard slices.
 *
 * @anti-pattern Don't use Tabs for navigation that changes the URL — use
 *               links / a router. Don't use Tabs to disclose unrelated
 *               content — use Accordion or stacked sections.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */

import Root from './Root.svelte';
import List from './List.svelte';
import Tab from './Tab.svelte';
import Panel from './Panel.svelte';

export { Root, List, Tab, Panel };

export type {
  TabItem,
  TabsActivation,
  TabsContext,
  TabsController,
  TabsDirection,
  TabsEvent,
  TabsOrientation,
  TabsState,
  CreateTabsOptions,
} from '@kumiki/headless/tabs';
