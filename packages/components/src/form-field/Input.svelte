<!--
  @component Field.Input — the input element. Defaults to `<input>`.

  Forwards all `rest` props (type, placeholder, autocomplete, …) for full
  HTML control. The attachment paints id / aria-invalid / data-state /
  aria-describedby / data-touched / data-dirty post-hydration; SSR ships a
  minimal `<input>` and lets the controller take over.

  `name` resolution: a per-Input `name` prop wins over the Root-level
  `name`. The Root-level value is what reaches FormData / superforms by
  default; an explicit per-Input override is rare but supported.
-->
<script lang="ts" generics="V">
  import { getContext } from 'svelte';
  import { FIELD_CONTEXT_KEY, type FieldContextValue } from './context.js';

  type Props = {
    name?: string;
    [key: string]: unknown;
  };

  let { name: localName, ...rest }: Props = $props();

  const ctx = getContext<FieldContextValue<V>>(FIELD_CONTEXT_KEY);
  const { controller } = ctx;
</script>

<input
  data-component-part="input"
  name={localName ?? ctx.name}
  {...rest}
  {@attach controller.input}
/>
