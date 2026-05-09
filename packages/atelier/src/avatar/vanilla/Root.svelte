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
  {@const { class: _cls, children, decorative: _d, ...rest } = props}
  <Root decorative {size} class={`kumiki-avatar ${className}`.trim()} {...rest}>
    {@render children()}
  </Root>
{:else}
  {@const { class: _cls, children, name, ...rest } = props}
  <Root {name} {size} class={`kumiki-avatar ${className}`.trim()} {...rest}>
    {@render children()}
  </Root>
{/if}

<style>
  :global(.kumiki-avatar) {
    --kumiki-avatar-bg-fallback: hsl(220 10% 86%);
    --kumiki-avatar-fg-fallback: hsl(220 10% 25%);
    --kumiki-avatar-border: transparent;
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
    background: var(--kumiki-avatar-bg-fallback);
    color: var(--kumiki-avatar-fg-fallback);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
  }
  :global(.kumiki-avatar[data-size='sm']) {
    --kumiki-avatar-size: 1.75rem;
    font-size: 0.75rem;
  }
  :global(.kumiki-avatar[data-size='lg']) {
    --kumiki-avatar-size: 3rem;
    font-size: 1rem;
  }
  :global(.kumiki-avatar [data-part='image']) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  :global(.kumiki-avatar [data-part='image'][data-hidden]),
  :global(.kumiki-avatar [data-part='fallback'][data-hidden]) {
    display: none;
  }
  :global(.kumiki-avatar [data-part='fallback']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
</style>
