<!--
  @component @kumiki/atelier/loading-spinner Vanilla variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/loading-spinner';
  import type { Snippet } from 'svelte';

  type Props = {
    mode?: 'inline' | 'region';
    size?: 'sm' | 'md' | 'lg';
    spinner?: Snippet;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { mode = 'inline', size = 'md', children, class: className = '', ...rest }: Props = $props();
</script>

<Root {mode} {size} class={`kumiki-spinner ${className}`.trim()} {...rest}>
  {#snippet spinner()}
    <span class="kumiki-spinner__glyph"></span>
  {/snippet}
  {#if children}{@render children()}{/if}
</Root>

<style>
  :global(.kumiki-spinner) {
    --kumiki-spinner-track: hsl(220 10% 86%);
    --kumiki-spinner-head: hsl(220 90% 55%);
    --kumiki-spinner-thickness: 2px;
    --kumiki-spinner-size: 1em;
    --kumiki-spinner-gap: 0.375rem;

    display: inline-flex;
    align-items: center;
    gap: var(--kumiki-spinner-gap);
    font-size: 0.875rem;
  }
  :global(.kumiki-spinner[data-size='sm']) {
    font-size: 0.75rem;
  }
  :global(.kumiki-spinner[data-size='lg']) {
    font-size: 1rem;
  }
  :global(.kumiki-spinner__glyph) {
    display: inline-block;
    width: var(--kumiki-spinner-size);
    height: var(--kumiki-spinner-size);
    border: var(--kumiki-spinner-thickness) solid var(--kumiki-spinner-track);
    border-top-color: var(--kumiki-spinner-head);
    border-radius: 50%;
    animation: kumiki-spinner-rotate 0.7s linear infinite;
  }
  :global(.kumiki-spinner [data-visually-hidden]) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @keyframes kumiki-spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-spinner__glyph) {
      animation: none;
    }
  }
</style>
