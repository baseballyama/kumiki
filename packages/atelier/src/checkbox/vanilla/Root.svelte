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
  {#snippet child({ props, state, attachment })}
    <button {...props} class={`kumiki-checkbox ${className}`.trim()} {@attach attachment}>
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
    --kumiki-checkbox-bg: var(--kumiki-color-accent-fg);
    --kumiki-checkbox-bg-checked: var(--kumiki-color-accent);
    --kumiki-checkbox-border: var(--kumiki-color-line-strong);
    --kumiki-checkbox-border-checked: var(--kumiki-color-accent);
    --kumiki-checkbox-fg: var(--kumiki-color-accent-fg);
    --kumiki-checkbox-radius: 5px;
    --kumiki-checkbox-size: 1.0625rem;
    --kumiki-checkbox-outline-focus: var(--kumiki-color-accent);

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
    box-shadow:
      0 1px 1px oklch(0 0 0 / 0.04),
      inset 0 1px 0 oklch(1 0 0 / 0.6);
    transition:
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      border-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-checkbox:hover:not([data-disabled])) {
    border-color: oklch(0.62 0.04 256);
  }
  :global(.kumiki-checkbox[data-state='checked']),
  :global(.kumiki-checkbox[data-state='mixed']) {
    background: var(--kumiki-checkbox-bg-checked);
    border-color: var(--kumiki-checkbox-border-checked);
    box-shadow:
      0 1px 2px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      inset 0 1px 0 oklch(1 0 0 / 0.1);
  }
  :global(.kumiki-checkbox svg) {
    width: 0.8125rem;
    height: 0.8125rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    animation: kumiki-check-in 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes kumiki-check-in {
    from {
      opacity: 0;
      transform: scale(0.7);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  :global(.kumiki-checkbox:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-accent-fg),
      0 0 0 4px var(--kumiki-checkbox-outline-focus);
  }
  :global(.kumiki-checkbox[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global {
    :root[data-theme='dark'] .kumiki-checkbox {
      --kumiki-checkbox-bg: var(--kumiki-color-surface);
      --kumiki-checkbox-bg-checked: var(--kumiki-color-accent);
      --kumiki-checkbox-border: var(--kumiki-color-line-strong);
      --kumiki-checkbox-border-checked: var(--kumiki-color-accent);
      --kumiki-checkbox-outline-focus: var(--kumiki-color-accent);
    }
    :root[data-theme='dark'] .kumiki-checkbox:hover:not([data-disabled]) {
      border-color: oklch(0.48 0.018 256);
    }
    :root[data-theme='dark'] .kumiki-checkbox:focus-visible {
      box-shadow:
        0 0 0 2px var(--kumiki-color-bg),
        0 0 0 4px var(--kumiki-checkbox-outline-focus);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-checkbox),
    :global(.kumiki-checkbox svg) {
      transition: none;
      animation: none;
    }
  }
</style>
