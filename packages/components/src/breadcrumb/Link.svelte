<!--
  @component Breadcrumb.Link — link or current-page text within a Breadcrumb.

  Discriminated Props:
  - `current: true` → renders plain text with `aria-current="page"`. No
    `href` (current page is not navigable).
  - default → `<a href>` link.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  export type Props =
    | { href: string; current?: false; children: Snippet; [key: string]: unknown }
    | { current: true; href?: undefined; children: Snippet; [key: string]: unknown };
</script>

<script lang="ts">
  let props: Props = $props();
  const isCurrent = $derived(props.current === true);
</script>

{#if isCurrent}
  {@const { current: _c, children, ...rest } = props as Extract<Props, { current: true }>}
  <span data-part="link" data-current="page" aria-current="page" {...rest}>
    {@render children()}
  </span>
{:else}
  {@const { href, current: _c, children, ...rest } = props as Extract<Props, { href: string }>}
  <a data-part="link" {href} {...rest}>{@render children()}</a>
{/if}
