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
    --kumiki-form-field-label-fg: var(--kumiki-color-fg);
    --kumiki-form-field-label-fg-required: oklch(0.55 0.22 25);
    --kumiki-form-field-description-fg: var(--kumiki-color-fg-muted);
    --kumiki-form-field-error-fg: oklch(0.5 0.22 25);
    --kumiki-form-field-gap: 0.4375rem;

    display: flex;
    flex-direction: column;
    gap: var(--kumiki-form-field-gap);
  }
  :global(.kumiki-form-field [data-component-part='label']) {
    color: var(--kumiki-form-field-label-fg);
    font-weight: 550;
    font-size: 0.8125rem;
    letter-spacing: -0.005em;
    line-height: 1.3;
  }
  :global(.kumiki-form-field [data-component-part='input']) {
    height: 2.25rem;
    padding-inline: 0.75rem;
    border: 1px solid var(--kumiki-color-line);
    border-radius: 8px;
    background: var(--kumiki-color-accent-fg);
    color: var(--kumiki-color-fg);
    font: inherit;
    font-size: 0.8125rem;
    letter-spacing: -0.005em;
    box-shadow: inset 0 1px 1px oklch(0 0 0 / 0.025);
    transition:
      border-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-form-field [data-component-part='input']::placeholder) {
    color: var(--kumiki-color-fg-quiet);
  }
  :global(.kumiki-form-field [data-component-part='input']:hover) {
    border-color: var(--kumiki-color-line-strong);
  }
  :global(.kumiki-form-field [data-component-part='input'][aria-invalid='true']) {
    border-color: oklch(0.55 0.22 25);
  }
  :global(.kumiki-form-field [data-component-part='input']:focus-visible) {
    outline: 0;
    border-color: var(--kumiki-color-accent);
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      inset 0 1px 1px oklch(0 0 0 / 0.025);
  }
  :global(.kumiki-form-field [data-component-part='input'][aria-invalid='true']:focus-visible) {
    box-shadow:
      0 0 0 3px oklch(0.55 0.22 25 / 0.18),
      inset 0 1px 1px oklch(0 0 0 / 0.025);
  }
  :global(.kumiki-form-field [data-component-part='errors']) {
    color: var(--kumiki-form-field-error-fg);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: -0.003em;
    margin: 0;
  }
  :global(.kumiki-form-field [data-component-part='description']) {
    color: var(--kumiki-form-field-description-fg);
    font-size: 0.75rem;
    line-height: 1.45;
    margin: 0;
  }
  :global {
    :root[data-theme='dark'] .kumiki-form-field {
      --kumiki-form-field-label-fg: var(--kumiki-color-fg-muted);
      --kumiki-form-field-description-fg: var(--kumiki-color-fg-quiet);
      --kumiki-form-field-error-fg: oklch(0.72 0.18 25);
    }
    :root[data-theme='dark'] .kumiki-form-field [data-component-part='input'] {
      border-color: var(--kumiki-color-fg);
      background: var(--kumiki-color-surface);
      color: var(--kumiki-color-surface);
    }
    :root[data-theme='dark'] .kumiki-form-field [data-component-part='input']::placeholder {
      color: var(--kumiki-color-fg-muted);
    }
    :root[data-theme='dark'] .kumiki-form-field [data-component-part='input']:hover {
      border-color: oklch(0.42 0.014 256);
    }
    :root[data-theme='dark'] .kumiki-form-field [data-component-part='input']:focus-visible {
      border-color: var(--kumiki-color-accent);
      box-shadow:
        0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 25%, transparent),
        inset 0 1px 1px oklch(0 0 0 / 0.1);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-form-field [data-component-part='input']) {
      transition: none;
    }
  }
</style>
