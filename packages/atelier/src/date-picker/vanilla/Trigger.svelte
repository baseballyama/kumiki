<script lang="ts">
  import { Trigger } from '@kumiki/components/date-picker';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet<[label: string]>; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger class={`kumiki-date-picker-trigger ${className}`.trim()} {...rest}>
  {#snippet children(label: string)}
    <span aria-hidden="true">📅</span>
    <span>{label}</span>
  {/snippet}
</Trigger>

<style>
  :global(.kumiki-date-picker-trigger) {
    display: inline-flex;
    height: 2.25rem;
    align-items: center;
    gap: 0.5rem;
    padding-inline: 0.75rem;
    border: 1px solid hsl(220 10% 80%);
    border-radius: 6px;
    background: white;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }
  :global(.kumiki-date-picker-trigger:hover) {
    background: hsl(220 10% 96%);
  }
</style>
