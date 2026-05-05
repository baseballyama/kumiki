<!--
  @component NumberField.Input — the editable text input with role=spinbutton.

  The attachment paints aria-valuemin / valuemax / valuenow / valuetext,
  data-state, aria-disabled, and reflects the formatted value into the
  input element when not focused.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { NUMBER_FIELD_CONTEXT_KEY, type NumberFieldContextValue } from './context.js';

  type Props = {
    [key: string]: unknown;
  };

  let { ...rest }: Props = $props();

  const { controller } = getContext<NumberFieldContextValue>(NUMBER_FIELD_CONTEXT_KEY);
</script>

<input data-component-part="input" {...rest} {@attach controller.input} />
