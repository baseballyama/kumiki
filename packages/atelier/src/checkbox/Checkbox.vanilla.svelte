<!--
  @component @kumiki/atelier/checkbox Vanilla variant.
-->
<script lang="ts">
  import { Root, type CheckboxValue } from '@kumiki/components/checkbox';

  type Props = {
    value?: CheckboxValue;
    defaultValue?: CheckboxValue;
    disabled?: boolean;
    onCheckedChange?: (value: CheckboxValue) => void;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), class: className = '', ...rest }: Props = $props();
</script>

<Root bind:value {...rest}>
  {#snippet child({ props, state })}
    <button {...props} class={`kumiki-checkbox ${className}`.trim()}>
      {#if state.value === 'checked'}
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8l3.5 3.5L13 5" />
        </svg>
      {:else if state.value === 'mixed'}
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10" />
        </svg>
      {/if}
    </button>
  {/snippet}
</Root>

<style>
  :global(.kumiki-checkbox) {
    --kumiki-checkbox-bg: white;
    --kumiki-checkbox-bg-checked: hsl(220 90% 55%);
    --kumiki-checkbox-border: hsl(220 10% 60%);
    --kumiki-checkbox-border-checked: hsl(220 90% 55%);
    --kumiki-checkbox-fg: white;
    --kumiki-checkbox-radius: 3px;
    --kumiki-checkbox-size: 1rem;
    --kumiki-checkbox-outline-focus: hsl(220 90% 60%);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--kumiki-checkbox-size);
    height: var(--kumiki-checkbox-size);
    flex-shrink: 0;
    border: 1px solid var(--kumiki-checkbox-border);
    border-radius: var(--kumiki-checkbox-radius);
    background: var(--kumiki-checkbox-bg);
    color: var(--kumiki-checkbox-fg);
    cursor: pointer;
    padding: 0;
    transition:
      background-color 120ms ease,
      border-color 120ms ease;
  }
  :global(.kumiki-checkbox[data-state='checked']),
  :global(.kumiki-checkbox[data-state='mixed']) {
    background: var(--kumiki-checkbox-bg-checked);
    border-color: var(--kumiki-checkbox-border-checked);
  }
  :global(.kumiki-checkbox svg) {
    width: 0.75rem;
    height: 0.75rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  :global(.kumiki-checkbox:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px var(--kumiki-checkbox-outline-focus);
  }
  :global(.kumiki-checkbox[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
