<script lang="ts">
  import { Description } from '@kumiki/components/form-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Description class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Description>
