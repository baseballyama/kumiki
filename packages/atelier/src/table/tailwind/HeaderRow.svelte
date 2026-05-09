<script lang="ts">
  import { HeaderRow } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<HeaderRow class={`border-b border-slate-200 dark:border-slate-700 ${className}`.trim()} {...rest}>
  {@render children()}
</HeaderRow>
