<script lang="ts">
  import { Errors } from '@kumiki/components/form-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Errors class={`text-xs text-rose-600 dark:text-rose-400 ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Errors>
