<!--
  @component HorizontalRule.Root — semantic separator.

  Renders `<hr>` by default; `as="div"` for contexts that forbid `<hr>`
  (e.g. inside flex/grid menus where `<hr>` semantics conflict). Non-
  `<hr>` mode applies `role="separator"` with `aria-orientation`.
-->
<script lang="ts" module>
  export type HorizontalRuleOrientation = 'horizontal' | 'vertical';
  export type Props = {
    as?: 'hr' | 'div';
    orientation?: HorizontalRuleOrientation;
    [key: string]: unknown;
  };
</script>

<script lang="ts">
  let { as = 'hr', orientation = 'horizontal', ...rest }: Props = $props();
  // Vertical orientation doesn't make sense on `<hr>` — coerce to div.
  const tag = $derived(orientation === 'vertical' ? 'div' : as);
</script>

{#if tag === 'hr'}
  <hr {...rest} data-orientation={orientation} />
{:else}
  <div
    role="separator"
    aria-orientation={orientation}
    {...rest}
    data-orientation={orientation}
  ></div>
{/if}
