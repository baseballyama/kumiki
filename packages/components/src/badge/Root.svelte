<!--
  @component Badge.Root — compact label / count, non-interactive by default.

  Three accessible-name shapes, enforced via a discriminated union on Props:
  - text content carries semantics (default `<Badge.Root>New</Badge.Root>`)
  - count-only with explicit `aria-label` (`<Badge.Root aria-label="3 unread">3</Badge.Root>`)
  - decorative-only (`<Badge.Root decorative />` → `aria-hidden="true"`)

  Visual variants (`info`, `success`, `error`, …) and sizes are not part of
  the headless contract — drive them via your own `data-*` / `class` attributes
  passed through the rest-spread, or use `@kumiki/atelier/badge`.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';

  type CommonProps = {
    decorative?: boolean;
    [key: string]: unknown;
  };

  export type Props =
    | (CommonProps & { decorative: true; children?: Snippet })
    | (CommonProps & { 'aria-label': string; children: Snippet })
    | (CommonProps & { children: Snippet });
</script>

<script lang="ts">
  let { decorative = false, children, ...rest }: Props = $props();
</script>

<span
  {...rest}
  data-decorative={decorative ? '' : undefined}
  aria-hidden={decorative ? 'true' : undefined}
>
  {#if children}{@render children()}{/if}
</span>
