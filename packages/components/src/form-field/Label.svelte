<!--
  @component Field.Label — the `<label for={inputId}>` for this field.
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
</script>

<label
  {...rest}
  id={controller.labelId}
  for={controller.inputId}
  data-component-host="form-field"
  data-component-part="label"
  {@attach controller.label}
>
  {#if children}{@render children()}{/if}
</label>
