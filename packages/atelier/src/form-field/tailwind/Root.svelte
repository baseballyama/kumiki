<script lang="ts" generics="V">
  import { Root } from '@kumiki/components/form-field';
  import type { Snippet } from 'svelte';
  import type {
    FieldIssue,
    FormFieldController,
    FormFieldState,
    StandardSchemaV1,
    ValidateOn,
  } from '@kumiki/components/form-field';

  type Props = {
    initialValue: V;
    value?: V;
    name?: string;
    validator?: StandardSchemaV1<V, V> | StandardSchemaV1<unknown, V>;
    validateOn?: ValidateOn | ReadonlyArray<ValidateOn>;
    serverIssues?: ReadonlyArray<string> | ReadonlyArray<FieldIssue> | null;
    onValueChange?: (value: V) => void;
    onValidityChange?: (state: FormFieldState) => void;
    oncontroller?: (controller: FormFieldController<V>) => void;
    id?: string;
    children: Snippet;
    class?: string;
  };

  let { value = $bindable(undefined), children, class: className = '', ...rest }: Props = $props();
</script>

<div class={`flex flex-col gap-1 ${className}`.trim()}>
  <Root bind:value {...rest}>{@render children()}</Root>
</div>
