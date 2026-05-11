<script lang="ts">
  import { Root } from '@kumiki/components/avatar';
  import type { Snippet } from 'svelte';

  type CommonProps = {
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  type Props =
    | (CommonProps & { decorative: true; name?: undefined })
    | (CommonProps & { name: string; decorative?: false });

  let props: Props = $props();
  const size = $derived(props.size ?? 'md');
  const className = $derived((props.class ?? '') as string);
</script>

{#if props.decorative === true}
  {@const { class: _cls, children, decorative: _d, size: _s, ...rest } = props}
  <Root decorative class={`kumiki-avatar ${className}`.trim()} data-size={size} {...rest}>
    {@render children()}
  </Root>
{:else}
  {@const { class: _cls, children, name, size: _s, ...rest } = props}
  <Root {name} class={`kumiki-avatar ${className}`.trim()} data-size={size} {...rest}>
    {@render children()}
  </Root>
{/if}

<style>
  :global(.kumiki-avatar) {
    --kumiki-avatar-bg-fallback: oklch(0.92 0.04 35);
    --kumiki-avatar-fg-fallback: oklch(0.4 0.14 35);
    --kumiki-avatar-border: oklch(0 0 0 / 0.04);
    --kumiki-avatar-radius: 999px;
    --kumiki-avatar-size: 2.25rem;

    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: var(--kumiki-avatar-size);
    height: var(--kumiki-avatar-size);
    border: 1px solid var(--kumiki-avatar-border);
    border-radius: var(--kumiki-avatar-radius);
    background: linear-gradient(135deg, var(--kumiki-color-accent-soft), oklch(0.88 0.06 65));
    color: var(--kumiki-avatar-fg-fallback);
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: -0.005em;
    line-height: 1;
  }
  :global(.kumiki-avatar[data-size='sm']) {
    --kumiki-avatar-size: 1.75rem;
    font-size: 0.6875rem;
  }
  :global(.kumiki-avatar[data-size='lg']) {
    --kumiki-avatar-size: 3rem;
    font-size: 1rem;
  }
  :global {
    :root[data-theme='dark'] .kumiki-avatar {
      --kumiki-avatar-border: oklch(1 0 0 / 0.06);
      --kumiki-avatar-fg-fallback: var(--kumiki-color-accent-soft-hover);
      background: linear-gradient(135deg, oklch(0.32 0.1 35), oklch(0.28 0.1 65));
    }
  }
  :global(.kumiki-avatar [data-component-part='image']) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  :global(.kumiki-avatar [data-component-part='image'][data-hidden]),
  :global(.kumiki-avatar [data-component-part='fallback'][data-hidden]) {
    display: none;
  }
  :global(.kumiki-avatar [data-component-part='fallback']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
</style>
