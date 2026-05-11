<script lang="ts">
  import { Header } from '@kumiki/components/calendar';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

{#if children}
  <Header class={className} {...rest}>
    {@render children()}
  </Header>
{:else}
  <Header class={className} {...rest} />
{/if}
