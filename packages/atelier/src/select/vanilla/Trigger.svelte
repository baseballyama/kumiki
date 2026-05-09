<script lang="ts" generics="V">
  import { Trigger } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger class={`kumiki-select-trigger ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
  <span aria-hidden="true">▾</span>
</Trigger>

<style>
  :global(.kumiki-select-trigger) {
    display: inline-flex;
    height: 2.25rem;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding-inline: 0.75rem;
    border: 1px solid hsl(220 10% 80%);
    border-radius: 6px;
    background: white;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }
  :global(.kumiki-select-trigger:hover) {
    background: hsl(220 10% 96%);
  }
</style>
