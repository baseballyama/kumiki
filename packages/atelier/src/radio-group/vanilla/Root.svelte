<script lang="ts" generics="V">
  import { Root } from '@kumiki/components/radio-group';
  import type { Snippet } from 'svelte';
  import type { RadioItem } from '@kumiki/components/radio-group';

  type Props = {
    items: ReadonlyArray<RadioItem<V>>;
    value?: V | null;
    defaultValue?: V | null;
    disabled?: boolean;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (value: V | null) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    items,
    value = $bindable(undefined),
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root {items} bind:value class={`kumiki-radio-group ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-radio-group) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  :global(.kumiki-radio-group [role='radio']) {
    --kumiki-radio-bg: var(--kumiki-color-accent-fg);
    --kumiki-radio-border: var(--kumiki-color-line-strong);
    --kumiki-radio-border-checked: var(--kumiki-color-accent);
    --kumiki-radio-bg-checked: var(--kumiki-color-accent);
    --kumiki-radio-fg: var(--kumiki-color-accent-fg);
    --kumiki-radio-radius: 999px;
    --kumiki-radio-size: 1.0625rem;
    --kumiki-radio-outline-focus: var(--kumiki-color-accent);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--kumiki-radio-size);
    height: var(--kumiki-radio-size);
    flex-shrink: 0;
    border: 1px solid var(--kumiki-radio-border);
    border-radius: var(--kumiki-radio-radius);
    background: var(--kumiki-radio-bg);
    cursor: pointer;
    padding: 0;
    box-shadow:
      0 1px 1px oklch(0 0 0 / 0.04),
      inset 0 1px 0 oklch(1 0 0 / 0.6);
    transition:
      border-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-radio-group [role='radio']:hover:not([data-disabled])) {
    border-color: oklch(0.62 0.04 256);
  }
  :global(.kumiki-radio-group [role='radio'][data-state='checked']) {
    border-color: var(--kumiki-radio-border-checked);
    border-width: 1.25px;
  }
  :global(.kumiki-radio-group [role='radio'][data-state='checked'])::after {
    content: '';
    width: 0.5625rem;
    height: 0.5625rem;
    border-radius: 50%;
    background: var(--kumiki-radio-bg-checked);
    box-shadow: 0 1px 2px color-mix(in oklab, var(--kumiki-color-accent) 22%, transparent);
    animation: kumiki-radio-pop 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes kumiki-radio-pop {
    from {
      transform: scale(0.4);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  :global(.kumiki-radio-group [role='radio']:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-accent-fg),
      0 0 0 4px var(--kumiki-radio-outline-focus);
  }
  :global(.kumiki-radio-group [role='radio'][data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :global {
    :root[data-theme='dark'] .kumiki-radio-group [role='radio'] {
      --kumiki-radio-bg: var(--kumiki-color-surface);
      --kumiki-radio-border: var(--kumiki-color-line-strong);
      --kumiki-radio-border-checked: var(--kumiki-color-accent);
      --kumiki-radio-bg-checked: var(--kumiki-color-accent);
      --kumiki-radio-outline-focus: var(--kumiki-color-accent);
    }
    :root[data-theme='dark'] .kumiki-radio-group [role='radio']:hover:not([data-disabled]) {
      border-color: oklch(0.48 0.018 256);
    }
    :root[data-theme='dark'] .kumiki-radio-group [role='radio']:focus-visible {
      box-shadow:
        0 0 0 2px var(--kumiki-color-bg),
        0 0 0 4px var(--kumiki-radio-outline-focus);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-radio-group [role='radio']),
    :global(.kumiki-radio-group [role='radio'][data-state='checked'])::after {
      transition: none;
      animation: none;
    }
  }
</style>
