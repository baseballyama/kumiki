<!--
  @component Button.Root — native <button> with loading + accessible-name guarantees.

  Behavior follows WAI-ARIA APG button pattern:
  https://www.w3.org/WAI/ARIA/apg/patterns/button/

  Plain props:
  - `variant`        → 'primary' | 'secondary' | 'ghost' | 'danger'. Maps to data-variant.
  - `size`           → 'sm' | 'md' | 'lg'. Maps to data-size.
  - `loading`        → sets aria-busy="true"; clicks/Enter/Space are blocked at capture.
  - `disabled`       → sets aria-disabled="true"; clicks/Enter/Space are blocked.
  - `type`           → 'button' (default) | 'submit' | 'reset'.
  - `onclick`        → forwarded.

  Snippets:
  - `children`       → button label (text path).
  - `icon`           → leading decorative glyph (per ADR 0014).
  - `iconTrailing`   → trailing decorative glyph.

  Accessible-name discriminated union: when no `children` are supplied,
  TypeScript requires `aria-label` or `aria-labelledby`. (Enforcement is
  type-level; runtime markup is forgiving.)
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
  export type ButtonSize = 'sm' | 'md' | 'lg';

  type BaseProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    icon?: Snippet;
    iconTrailing?: Snippet;
    onclick?: (event: MouseEvent) => void;
    /** Extra attributes (`class`, `style`, `data-*`, `form`, …) forwarded to `<button>`. */
    [key: string]: unknown;
  };

  export type Props =
    | (BaseProps & { children: Snippet })
    | (BaseProps & { 'aria-label': string; icon: Snippet; children?: undefined })
    | (BaseProps & { 'aria-labelledby': string; icon: Snippet; children?: undefined });
</script>

<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import { createButton } from '@kumiki/headless/button';

  let {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    id,
    icon,
    iconTrailing,
    onclick,
    children,
    ...rest
  }: Props = $props();

  const controller = untrack(() =>
    createButton({
      loading,
      disabled,
      id,
    }),
  );

  // Mirror controller state into reactive locals so the template re-renders
  // when the controller's setters fire (also lets external `loading`/`disabled`
  // prop changes propagate back into the DOM).
  let snapLoading = $state(controller.loading);
  let snapDisabled = $state(controller.disabled);

  const unsub = controller.subscribe(({ loading: l, disabled: d }) => {
    snapLoading = l;
    snapDisabled = d;
  });
  onDestroy(unsub);

  $effect(() => {
    if (loading !== controller.loading) controller.setLoading(loading);
  });

  $effect(() => {
    if (disabled !== controller.disabled) controller.setDisabled(disabled);
  });
</script>

<button
  {...rest}
  {type}
  data-variant={variant}
  data-size={size}
  aria-busy={snapLoading ? 'true' : undefined}
  aria-disabled={snapDisabled ? 'true' : undefined}
  data-loading={snapLoading ? '' : undefined}
  data-disabled={snapDisabled ? '' : undefined}
  {onclick}
  {@attach controller.root}
>
  {#if icon}<span data-part="icon" aria-hidden="true">{@render icon()}</span>{/if}
  {#if children}{@render children()}{/if}
  {#if iconTrailing}<span data-part="icon-trailing" aria-hidden="true"
      >{@render iconTrailing()}</span
    >{/if}
</button>
