<!--
  @component @kumiki/atelier/switch Vanilla variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/switch';

  type Props = {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    class?: string;
    [k: string]: unknown;
  };

  let { checked = $bindable(undefined), class: className = '', ...rest }: Props = $props();
</script>

<Root bind:checked {...rest}>
  {#snippet child({ props, attachment })}
    <button {...props} class={`kumiki-switch ${className}`.trim()} {@attach attachment}>
      <span class="kumiki-switch__thumb" data-state={props['data-state']}></span>
    </button>
  {/snippet}
</Root>

<style>
  :global(.kumiki-switch) {
    --kumiki-switch-track-bg: var(--kumiki-color-line-strong);
    --kumiki-switch-track-bg-checked: var(--kumiki-color-accent);
    --kumiki-switch-thumb-bg: var(--kumiki-color-accent-fg);
    --kumiki-switch-thumb-radius: 999px;
    --kumiki-switch-track-radius: 999px;
    --kumiki-switch-track-width: 2.375rem;
    --kumiki-switch-track-height: 1.375rem;
    --kumiki-switch-thumb-size: 1.0625rem;
    --kumiki-switch-outline-focus: var(--kumiki-color-accent);

    position: relative;
    display: inline-flex;
    align-items: center;
    width: var(--kumiki-switch-track-width);
    height: var(--kumiki-switch-track-height);
    flex-shrink: 0;
    padding: 0;
    border: 0;
    border-radius: var(--kumiki-switch-track-radius);
    background: var(--kumiki-switch-track-bg);
    cursor: pointer;
    box-shadow: inset 0 1px 1px oklch(0 0 0 / 0.06);
    transition: background-color 200ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-switch[data-state='checked']) {
    background: var(--kumiki-switch-track-bg-checked);
    box-shadow:
      inset 0 1px 1px oklch(0 0 0 / 0.1),
      0 1px 2px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent);
  }
  :global(.kumiki-switch__thumb) {
    display: inline-block;
    width: var(--kumiki-switch-thumb-size);
    height: var(--kumiki-switch-thumb-size);
    border-radius: var(--kumiki-switch-thumb-radius);
    background: var(--kumiki-switch-thumb-bg);
    transform: translateX(0.1875rem);
    transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow:
      0 1px 3px oklch(0 0 0 / 0.18),
      0 1px 1px oklch(0 0 0 / 0.06),
      0 0 0 0.5px oklch(0 0 0 / 0.04);
  }
  :global(.kumiki-switch__thumb[data-state='checked']) {
    transform: translateX(
      calc(var(--kumiki-switch-track-width) - var(--kumiki-switch-thumb-size) - 0.1875rem)
    );
  }
  :global(.kumiki-switch:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-accent-fg),
      0 0 0 4px var(--kumiki-switch-outline-focus);
  }
  :global(.kumiki-switch[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global {
    :root[data-theme='dark'] .kumiki-switch {
      --kumiki-switch-track-bg: var(--kumiki-color-fg);
      --kumiki-switch-track-bg-checked: var(--kumiki-color-accent);
      --kumiki-switch-thumb-bg: var(--kumiki-color-surface);
      --kumiki-switch-outline-focus: var(--kumiki-color-accent);
    }
    :root[data-theme='dark'] .kumiki-switch:focus-visible {
      box-shadow:
        0 0 0 2px var(--kumiki-color-bg),
        0 0 0 4px var(--kumiki-switch-outline-focus);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-switch),
    :global(.kumiki-switch__thumb) {
      transition: none;
    }
  }
</style>
