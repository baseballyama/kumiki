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
    gap: 0.5rem;
    padding-inline: 0.75rem 0.625rem;
    border: 1px solid var(--kumiki-color-line);
    border-radius: 8px;
    background: var(--kumiki-color-accent-fg);
    color: var(--kumiki-color-fg);
    font: inherit;
    font-size: 0.8125rem;
    letter-spacing: -0.005em;
    cursor: pointer;
    box-shadow:
      inset 0 1px 1px oklch(0 0 0 / 0.025),
      0 1px 1px oklch(0 0 0 / 0.02);
    transition:
      border-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-select-trigger:hover) {
    border-color: var(--kumiki-color-line-strong);
  }
  :global(.kumiki-select-trigger:focus-visible) {
    outline: 0;
    border-color: var(--kumiki-color-accent);
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      inset 0 1px 1px oklch(0 0 0 / 0.025);
  }
  :global(.kumiki-select-trigger > span:last-child) {
    color: var(--kumiki-color-fg-muted);
    font-size: 0.6875rem;
    transition: transform 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-select-trigger[data-state='open'] > span:last-child) {
    transform: rotate(180deg);
  }
  :global {
    :root[data-theme='dark'] .kumiki-select-trigger {
      background: var(--kumiki-color-surface);
      color: var(--kumiki-color-surface);
      border-color: var(--kumiki-color-fg);
    }
    :root[data-theme='dark'] .kumiki-select-trigger:hover {
      border-color: oklch(0.42 0.014 256);
    }
    :root[data-theme='dark'] .kumiki-select-trigger:focus-visible {
      border-color: var(--kumiki-color-accent);
      box-shadow:
        0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 25%, transparent),
        inset 0 1px 1px oklch(0 0 0 / 0.1);
    }
  }
</style>
