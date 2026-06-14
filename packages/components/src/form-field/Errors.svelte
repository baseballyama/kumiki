<!--
  @component Field.Errors — assertive alert region for validation errors.

  Renders a `<div role="alert">`. Hidden when there are no errors. The
  default rendering shows messages joined by space; override by passing
  `children` and using the controller from context to render whatever you
  like. `role="alert"` implies aria-live="assertive" — do not add a
  redundant aria-live attribute.
-->
<script lang="ts" generics="V">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { FIELD_CONTEXT_KEY, type FieldContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<FieldContextValue<V>>(FIELD_CONTEXT_KEY);
  const initialErrors = controller.context.errors;
  const initialHidden = initialErrors.length === 0;
</script>

<div
  {...rest}
  id={controller.errorsId}
  role="alert"
  data-component-part="errors"
  hidden={initialHidden || undefined}
  {@attach controller.errors}
>
  {#if children}{@render children()}{/if}
</div>
