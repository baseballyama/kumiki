<!--
  @component Field.Errors — live-region container for validation errors.

  Renders a `<div role="alert" aria-live="polite">`. Hidden when there are
  no errors. The default rendering shows messages joined by space; override
  by passing `children` and using the controller from context to render
  whatever you like.
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
  aria-live="polite"
  data-component-part="errors"
  hidden={initialHidden || undefined}
  {@attach controller.errors}
>
  {#if children}{@render children()}{/if}
</div>
