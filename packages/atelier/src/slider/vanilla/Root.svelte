<script lang="ts">
  import { Root } from '@kumiki/components/slider';
  import type { Snippet } from 'svelte';

  type Props = {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    pageStep?: number;
    orientation?: 'horizontal' | 'vertical';
    direction?: 'ltr' | 'rtl';
    disabled?: boolean;
    onValueChange?: (value: number) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), children, class: className = '', ...rest }: Props = $props();
</script>

<Root bind:value class={`kumiki-slider ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-slider) {
    --kumiki-slider-track-bg: hsl(220 10% 86%);
    --kumiki-slider-range-bg: hsl(220 90% 55%);
    --kumiki-slider-thumb-bg: white;
    --kumiki-slider-thumb-size: 1rem;
    --kumiki-slider-track-height: 0.375rem;
    --kumiki-slider-outline-focus: hsl(220 90% 60%);

    position: relative;
    width: 100%;
    height: var(--kumiki-slider-track-height);
    background: var(--kumiki-slider-track-bg);
    border-radius: 999px;
  }
  :global(.kumiki-slider[data-orientation='vertical']) {
    width: var(--kumiki-slider-track-height);
    height: 100%;
  }
  :global(.kumiki-slider [data-component-part='thumb']) {
    display: block;
    width: var(--kumiki-slider-thumb-size);
    height: var(--kumiki-slider-thumb-size);
    border: 2px solid hsl(220 10% 12%);
    border-radius: 50%;
    background: var(--kumiki-slider-thumb-bg);
    box-shadow: 0 1px 2px hsl(0 0% 0% / 0.15);
    cursor: grab;
  }
  :global(.kumiki-slider [data-component-part='thumb']:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px var(--kumiki-slider-outline-focus);
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-slider) {
      --kumiki-slider-track-bg: hsl(220 10% 28%);
    }
    :global(.kumiki-slider [data-component-part='thumb']) {
      border-color: hsl(220 10% 90%);
    }
  }
</style>
