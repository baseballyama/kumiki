<script lang="ts">
  import { Content } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Content class={`kumiki-popover-content ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Content>

<style>
  :global(.kumiki-popover-content) {
    --kumiki-popover-bg: white;
    --kumiki-popover-fg: hsl(220 10% 12%);
    --kumiki-panel-border: hsl(220 10% 86%);
    --kumiki-panel-radius: 6px;
    --kumiki-panel-shadow: 0 8px 24px hsl(0 0% 0% / 0.12);

    position: relative;
    z-index: 50;
    padding: 1rem;
    width: 18rem;
    border: 1px solid var(--kumiki-panel-border);
    border-radius: var(--kumiki-panel-radius);
    background: var(--kumiki-popover-bg);
    color: var(--kumiki-popover-fg);
    box-shadow: var(--kumiki-panel-shadow);
    font-size: 0.875rem;
    outline: none;
  }
  :global(.kumiki-popover-content [data-part='close']) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    opacity: 0.7;
  }
  :global(.kumiki-popover-content [data-part='close']:hover) {
    opacity: 1;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-popover-content) {
      --kumiki-popover-bg: hsl(220 10% 14%);
      --kumiki-popover-fg: hsl(220 10% 96%);
      --kumiki-panel-border: hsl(220 10% 28%);
    }
  }
</style>
