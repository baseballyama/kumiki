<script lang="ts">
  import { Trigger } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Trigger class={`kumiki-popover-trigger ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Trigger>

<style>
  :global(.kumiki-popover-trigger) {
    --kumiki-popover-trigger-bg: white;
    --kumiki-popover-trigger-fg: hsl(220 10% 12%);
    --kumiki-popover-trigger-border: hsl(220 10% 80%);

    display: inline-flex;
    height: 2.25rem;
    align-items: center;
    justify-content: center;
    padding-inline: 0.75rem;
    border: 1px solid var(--kumiki-popover-trigger-border);
    border-radius: 6px;
    background: var(--kumiki-popover-trigger-bg);
    color: var(--kumiki-popover-trigger-fg);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }
  :global(.kumiki-popover-trigger:hover) {
    background: hsl(220 10% 96%);
  }
</style>
