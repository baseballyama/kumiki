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
</script>

<!-- Vertical orientation has no semantic <hr> equivalent — coerce to div. -->
<svelte:element
  this={as === 'hr' && orientation === 'horizontal' ? 'hr' : 'div'}
  role={as === 'hr' && orientation === 'horizontal' ? undefined : 'separator'}
  aria-orientation={as === 'hr' && orientation === 'horizontal' ? undefined : orientation}
  {...rest}
  data-orientation={orientation}
/>
