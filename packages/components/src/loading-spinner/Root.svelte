<!--
  @component LoadingSpinner.Root — visual busy indicator with `role="status"`.

  The Root is the live region; the spinning glyph is consumer-supplied
  (snippet, per ADR 0014). When `mode="inline"` the label is visually
  hidden via `data-visually-hidden`; consumers' CSS / atelier paint the
  `sr-only` recipe.

  `prefers-reduced-motion`-aware spinning lives in atelier or consumer
  CSS — Layer 4 emits no motion styles. Visual sizes also live in
  `@kumiki/atelier/loading-spinner` (or your own CSS keyed off `class` /
  `data-*` passed via rest-spread).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type LoadingSpinnerMode = 'inline' | 'region';

  type BaseProps = {
    mode?: LoadingSpinnerMode;
    /** Custom spinner glyph snippet. Default: a styled <span> for atelier to paint. */
    spinner?: Snippet;
    [key: string]: unknown;
  };

  // role="status" needs an accessible name: either label children or an
  // explicit aria-label (which flows onto the status element via rest-spread).
  export type Props = BaseProps &
    ({ children: Snippet } | { 'aria-label': string; children?: undefined });
</script>

<script lang="ts">
  let { mode = 'inline', spinner, children, ...rest }: Props = $props();
</script>

<div {...rest} role="status" aria-live="polite" aria-atomic="true" data-mode={mode}>
  <span data-component-part="spinner" aria-hidden="true">
    {#if spinner}{@render spinner()}{:else}<span data-default-glyph></span>{/if}
  </span>
  {#if children}
    <span data-component-part="label" data-visually-hidden={mode === 'inline' ? '' : undefined}>
      {@render children()}
    </span>
  {/if}
</div>
