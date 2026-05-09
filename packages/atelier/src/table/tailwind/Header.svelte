<script lang="ts">
  import { Header } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Header class={`bg-slate-50 dark:bg-slate-800 ${className}`.trim()} {...rest}>
  {@render children()}
</Header>
