<!--
  @component NumberField.Increment — step-up button.

  Disabled automatically when the machine is disabled or the value is
  at the upper bound.

  A button without a text label or `aria-label` is inaccessible. Require
  either `children` (visible / SR-only label inside the button) or
  `aria-label` (string) at the type level so the button always has an
  accessible name.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';

  type BaseProps = {
    /** Extra attributes (`class`, `style`, `data-*`, …) forwarded to `<button>`. */
    [key: string]: unknown;
  };

  /**
   * NumberField.Increment — step-up button.
   *
   * Require either `children` (the button label rendered as content, e.g. `+`)
   * or `aria-label` (e.g. `"Increase"`) so every step button has an accessible
   * name.
   *
   * @when-to-use Render a visible label as `children` (e.g. `+`, `▲`, or a
   * localised word) or use `aria-label` for a visually-hidden description.
   * @anti-pattern Omitting both leaves the button nameless for AT users.
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
   */
  export type Props =
    | (BaseProps & { children: Snippet; 'aria-label'?: never })
    | (BaseProps & { 'aria-label': string; children?: Snippet });
</script>

<script lang="ts">
  import { getContext } from 'svelte';
  import { NUMBER_FIELD_CONTEXT_KEY, type NumberFieldContextValue } from './context.js';

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<NumberFieldContextValue>(NUMBER_FIELD_CONTEXT_KEY);
</script>

<button type="button" data-component-part="increment" {...rest} {@attach controller.increment_}>
  {#if children}{@render children()}{/if}
</button>
