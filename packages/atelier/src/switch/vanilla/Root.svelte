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
  {#snippet child({ props })}
    <button {...props} class={`kumiki-switch ${className}`.trim()}>
      <span class="kumiki-switch__thumb" data-state={props['data-state']}></span>
    </button>
  {/snippet}
</Root>

<style>
  :global(.kumiki-switch) {
    --kumiki-switch-track-bg: hsl(220 10% 80%);
    --kumiki-switch-track-bg-checked: hsl(220 90% 55%);
    --kumiki-switch-thumb-bg: white;
    --kumiki-switch-thumb-radius: 999px;
    --kumiki-switch-track-radius: 999px;
    --kumiki-switch-track-width: 2.25rem;
    --kumiki-switch-track-height: 1.25rem;
    --kumiki-switch-thumb-size: 1rem;
    --kumiki-switch-outline-focus: hsl(220 90% 60%);

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
    transition: background-color 150ms ease;
  }
  :global(.kumiki-switch[data-state='checked']) {
    background: var(--kumiki-switch-track-bg-checked);
  }
  :global(.kumiki-switch__thumb) {
    display: inline-block;
    width: var(--kumiki-switch-thumb-size);
    height: var(--kumiki-switch-thumb-size);
    border-radius: var(--kumiki-switch-thumb-radius);
    background: var(--kumiki-switch-thumb-bg);
    transform: translateX(0.125rem);
    transition: transform 150ms ease;
    box-shadow: 0 1px 2px hsl(0 0% 0% / 0.15);
  }
  :global(.kumiki-switch__thumb[data-state='checked']) {
    transform: translateX(
      calc(var(--kumiki-switch-track-width) - var(--kumiki-switch-thumb-size) - 0.125rem)
    );
  }
  :global(.kumiki-switch:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px var(--kumiki-switch-outline-focus);
  }
  :global(.kumiki-switch[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
