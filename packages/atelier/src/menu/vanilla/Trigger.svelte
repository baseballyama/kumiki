<script lang="ts">
  import { Trigger } from '@kumiki/components/menu';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger class={`kumiki-menu-trigger ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Trigger>

<style>
  :global(.kumiki-menu-trigger) {
    display: inline-flex;
    height: 2.25rem;
    align-items: center;
    justify-content: center;
    padding-inline: 0.75rem;
    border: 1px solid hsl(220 10% 80%);
    border-radius: 6px;
    background: white;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }
  :global(.kumiki-menu-trigger:hover) {
    background: hsl(220 10% 96%);
  }
</style>
