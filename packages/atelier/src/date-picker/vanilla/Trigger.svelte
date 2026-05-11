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
    padding-inline: 0.875rem;
    border: 1px solid var(--kumiki-color-line);
    border-radius: 8px;
    background: var(--kumiki-color-accent-fg);
    color: var(--kumiki-color-fg);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: -0.005em;
    cursor: pointer;
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 1px 1px oklch(0 0 0 / 0.02);
    transition: background-color 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-date-picker-trigger:hover) {
    background: var(--kumiki-color-bg);
  }
  :global(.kumiki-date-picker-trigger:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-accent-fg),
      0 0 0 4px var(--kumiki-color-accent);
  }
  :global {
    :root[data-theme='dark'] .kumiki-date-picker-trigger {
      background: var(--kumiki-color-surface);
      color: var(--kumiki-color-surface);
      border-color: var(--kumiki-color-fg);
    }
    :root[data-theme='dark'] .kumiki-date-picker-trigger:hover {
      background: var(--kumiki-color-surface-raised);
    }
    :root[data-theme='dark'] .kumiki-date-picker-trigger:focus-visible {
      box-shadow:
        0 0 0 2px var(--kumiki-color-bg),
        0 0 0 4px var(--kumiki-color-accent);
    }
  }
</style>
