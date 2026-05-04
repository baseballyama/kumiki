<!--
  @component Field.Description — supplemental help text.

  The Input attachment automatically includes this element's id in
  `aria-describedby` when the description has been mounted.
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

<p
  {...rest}
  id={controller.descriptionId}
  data-component-part="description"
  {@attach controller.description}
>
  {#if children}{@render children()}{/if}
</p>
