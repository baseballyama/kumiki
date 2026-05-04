<!--
  @component Field.Root — owns the controller and shares it via context.

  Generic over the input value type `V`. Pass `V` to `<Root<V>>`.

  Bindable props:
  - `value` → V. Bind for two-way control.

  Plain props:
  - `initialValue` → V (required) seed for the controller; `bind:value` mirrors.
  - `validator` → StandardSchemaV1<V, V> for validation.
  - `validateOn` → 'blur' | 'change' | 'submit' or array. Default 'blur'.
  - `onValueChange`, `onValidityChange`.

  Renders no DOM itself — Label / Input / Errors / Description are
  responsible for their own elements.
-->
<script lang="ts" generics="V">
  import { onDestroy, setContext, untrack } from 'svelte';
  import {
    createFormField,
    type FormFieldController,
    type FormFieldState,
    type StandardSchemaV1,
    type ValidateOn,
  } from '@kumiki/attachment-form-field';
  import type { Snippet } from 'svelte';
  import { FIELD_CONTEXT_KEY, type FieldContextValue } from './context.js';

  type Props = {
    initialValue: V;
    value?: V;
    validator?: StandardSchemaV1<V, V> | StandardSchemaV1<unknown, V>;
    validateOn?: ValidateOn | ReadonlyArray<ValidateOn>;
    onValueChange?: (value: V) => void;
    onValidityChange?: (state: FormFieldState) => void;
    id?: string;
    children: Snippet;
  };

  let {
    initialValue,
    value = $bindable(undefined),
    validator,
    validateOn,
    onValueChange,
    onValidityChange,
    id,
    children,
  }: Props = $props();

  const controller: FormFieldController<V> = untrack(() =>
    createFormField<V>({
      initialValue: value !== undefined ? value : initialValue,
      validator,
      validateOn,
      id,
      onValueChange: (next) => {
        value = next;
        onValueChange?.(next);
      },
      onValidityChange,
    }),
  );

  $effect(() => {
    if (value !== undefined && !Object.is(value, controller.value)) {
      controller.setValue(value);
    }
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  setContext<FieldContextValue<V>>(FIELD_CONTEXT_KEY, { controller });
</script>

{@render children()}
