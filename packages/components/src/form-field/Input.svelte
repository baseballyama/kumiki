<!--
  @component Field.Input — the input element. Defaults to `<input>`.

  Forwards all `rest` props (type, placeholder, autocomplete, …) for full
  HTML control. The attachment paints id / aria-invalid / data-state /
  aria-describedby / data-touched / data-dirty post-hydration; SSR ships a
  minimal `<input>` and lets the controller take over.
-->
<script lang="ts" generics="V">
  import { getContext } from 'svelte';
  import { FIELD_CONTEXT_KEY, type FieldContextValue } from './context.js';

  type Props = {
    [key: string]: unknown;
  };

  let { ...rest }: Props = $props();

  const { controller } = getContext<FieldContextValue<V>>(FIELD_CONTEXT_KEY);
</script>

<input data-component-part="input" {...rest} {@attach controller.input} />
