/**
 * `@kumiki/components/breadcrumb` — hierarchical location indicator.
 *
 * `nav[aria-label="Breadcrumb"]` wrapping an `<ol>` of items, separators,
 * and links. The current page is rendered as plain text with
 * `aria-current="page"` (not a link — current page is not navigable).
 *
 * ```svelte
 * <Breadcrumb.Root>
 *   <Breadcrumb.Item>
 *     <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
 *   </Breadcrumb.Item>
 *   <Breadcrumb.Separator />
 *   <Breadcrumb.Item>
 *     <Breadcrumb.Link current>Acme</Breadcrumb.Link>
 *   </Breadcrumb.Item>
 * </Breadcrumb.Root>
 * ```
 *
 * @when-to-use Multi-level navigation surfaces with a clear hierarchy
 *              (file paths, taxonomy, settings sub-pages).
 *
 * @anti-pattern Don't render the current page as a link. Don't omit the
 *               surrounding `<nav>` — landmarks are how SR users skim a page.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 */

import Root from './Root.svelte';
import Item from './Item.svelte';
import Link from './Link.svelte';
import Separator from './Separator.svelte';

export { Root, Item, Link, Separator };

export const Breadcrumb = { Root, Item, Link, Separator };

export type { Props as BreadcrumbProps } from './Root.svelte';
export type { Props as BreadcrumbLinkProps } from './Link.svelte';
