<!--
  @component Breadcrumb.Root — `<nav>`-wrapped `<ol>` for hierarchical
  location.

  Default `aria-label` comes from the active LocaleProvider's
  `messages.breadcrumb.label`. Override by passing `aria-label` or
  `aria-labelledby`.

  @see https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  export type Props = {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    [key: string]: unknown;
  };
</script>

<script lang="ts">
  import { tryUseLocale } from '../locale-provider/use-locale.js';

  let {
    'aria-label': ariaLabelProp,
    'aria-labelledby': ariaLabelledBy,
    children,
    ...rest
  }: Props = $props();

  const locale = tryUseLocale();

  // If consumer supplied aria-labelledby, prefer it; otherwise fall back to
  // aria-label (consumer-supplied or locale default).
  const ariaLabel = $derived(
    ariaLabelledBy
      ? undefined
      : (ariaLabelProp ?? locale?.messages.breadcrumb.label ?? 'Breadcrumb'),
  );
</script>

<nav {...rest} data-component-part="root" aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
  <ol data-component-part="list">
    {@render children()}
  </ol>
</nav>
