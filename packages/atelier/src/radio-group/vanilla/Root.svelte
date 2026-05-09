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
    --kumiki-radio-bg: white;
    --kumiki-radio-border: hsl(220 10% 60%);
    --kumiki-radio-border-checked: hsl(220 90% 55%);
    --kumiki-radio-bg-checked: hsl(220 90% 55%);
    --kumiki-radio-fg: white;
    --kumiki-radio-radius: 999px;
    --kumiki-radio-size: 1rem;
    --kumiki-radio-outline-focus: hsl(220 90% 60%);

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
  }
  :global(.kumiki-radio-group [role='radio'][data-state='checked']) {
    border-color: var(--kumiki-radio-border-checked);
  }
  :global(.kumiki-radio-group [role='radio'][data-state='checked'])::after {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--kumiki-radio-bg-checked);
  }
  :global(.kumiki-radio-group [role='radio']:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px var(--kumiki-radio-outline-focus);
  }
  :global(.kumiki-radio-group [role='radio'][data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
