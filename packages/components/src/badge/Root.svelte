<!--
  @component Badge.Root — compact label / count, non-interactive by default.

  Three accessible-name shapes, enforced via a discriminated union on Props:
  - text content carries semantics (default `<Badge.Root>New</Badge.Root>`)
  - count-only with explicit `aria-label` (`<Badge.Root aria-label="3 unread">3</Badge.Root>`)
  - decorative-only (`<Badge.Root decorative variant="error" />` → `aria-hidden="true"`)
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type BadgeVariant = 'neutral' | 'info' | 'success' | 'warn' | 'error';
  export type BadgeSize = 'sm' | 'md';

  type CommonProps = {
    variant?: BadgeVariant;
    size?: BadgeSize;
    decorative?: boolean;
    [key: string]: unknown;
  };

  export type Props =
    | (CommonProps & { decorative: true; children?: Snippet })
    | (CommonProps & { 'aria-label': string; children: Snippet })
    | (CommonProps & { children: Snippet });
</script>

<script lang="ts">
  let { variant = 'neutral', size = 'md', decorative = false, children, ...rest }: Props = $props();
</script>

<span
  {...rest}
  data-variant={variant}
  data-size={size}
  data-decorative={decorative ? '' : undefined}
  aria-hidden={decorative ? 'true' : undefined}
>
  {#if children}{@render children()}{/if}
</span>
