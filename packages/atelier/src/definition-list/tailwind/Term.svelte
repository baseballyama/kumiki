<script lang="ts">
  import { Term } from '@kumiki/components/definition-list';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Term class={`font-medium text-slate-700 dark:text-slate-200 ${className}`.trim()} {...rest}>
  {@render children()}
</Term>
