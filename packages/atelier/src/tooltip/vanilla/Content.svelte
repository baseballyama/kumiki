<script lang="ts">
  import { Content } from '@kumiki/components/tooltip';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Content class={`kumiki-tooltip-content ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Content>

<style>
  :global(.kumiki-tooltip-content) {
    --kumiki-tooltip-bg: hsl(220 10% 12%);
    --kumiki-tooltip-fg: white;

    z-index: 50;
    max-width: 16rem;
    padding: 0.375rem 0.625rem;
    background: var(--kumiki-tooltip-bg);
    color: var(--kumiki-tooltip-fg);
    font-size: 0.75rem;
    line-height: 1rem;
    border-radius: 4px;
    box-shadow: 0 4px 8px hsl(0 0% 0% / 0.15);
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-tooltip-content) {
      --kumiki-tooltip-bg: hsl(220 10% 90%);
      --kumiki-tooltip-fg: hsl(220 10% 12%);
    }
  }
</style>
