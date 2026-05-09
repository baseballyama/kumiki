<!--
  @component Breadcrumb.Separator — decorative glyph between items.

  `aria-hidden="true"` so screen readers don't announce it. Renders the
  consumer's snippet content, defaulting to "/".
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children?: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<li role="presentation" data-part="separator" aria-hidden="true" {...rest}>
  {#if children}{@render children()}{:else}/{/if}
</li>
