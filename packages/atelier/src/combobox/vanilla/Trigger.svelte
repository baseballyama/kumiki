<script lang="ts">
  import { Trigger } from '@kumiki/components/combobox';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; 'aria-label'?: string; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger class={`kumiki-combobox-trigger ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{:else}<span aria-hidden="true">▾</span>{/if}
</Trigger>

<style>
  :global(.kumiki-combobox-trigger) {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: hsl(220 10% 50%);
    cursor: pointer;
  }
  :global(.kumiki-combobox-trigger:hover) {
    background: hsl(220 10% 92%);
  }
</style>
