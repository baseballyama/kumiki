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

<div class={`kumiki-form-field ${className}`.trim()}>
  <Root bind:value {...rest}>{@render children()}</Root>
</div>

<style>
  :global(.kumiki-form-field) {
    --kumiki-form-field-label-fg: hsl(220 10% 25%);
    --kumiki-form-field-label-fg-required: hsl(0 80% 50%);
    --kumiki-form-field-description-fg: hsl(220 10% 38%);
    --kumiki-form-field-error-fg: hsl(0 80% 45%);
    --kumiki-form-field-gap: 0.25rem;

    display: flex;
    flex-direction: column;
    gap: var(--kumiki-form-field-gap);
  }
  :global(.kumiki-form-field [data-component-part='label']) {
    color: var(--kumiki-form-field-label-fg);
    font-weight: 500;
    font-size: 0.875rem;
  }
  :global(.kumiki-form-field [data-component-part='input']) {
    height: 2.25rem;
    padding-inline: 0.75rem;
    border: 1px solid hsl(220 10% 80%);
    border-radius: 6px;
    background: white;
    font: inherit;
    font-size: 0.875rem;
  }
  :global(.kumiki-form-field [data-component-part='input'][aria-invalid='true']) {
    border-color: hsl(0 80% 50%);
  }
  :global(.kumiki-form-field [data-component-part='input']:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px hsl(220 90% 60%);
  }
  :global(.kumiki-form-field [data-component-part='errors']) {
    color: var(--kumiki-form-field-error-fg);
    font-size: 0.75rem;
  }
  :global(.kumiki-form-field [data-component-part='description']) {
    color: var(--kumiki-form-field-description-fg);
    font-size: 0.75rem;
    margin: 0;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-form-field) {
      --kumiki-form-field-label-fg: hsl(220 10% 80%);
      --kumiki-form-field-description-fg: hsl(220 10% 65%);
      --kumiki-form-field-error-fg: hsl(0 80% 65%);
    }
    :global(.kumiki-form-field [data-component-part='input']) {
      border-color: hsl(220 10% 28%);
      background: hsl(220 10% 14%);
    }
  }
</style>
