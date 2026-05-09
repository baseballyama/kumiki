<script lang="ts">
  import { Footer } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Footer
  class={`bg-slate-50 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200 ${className}`.trim()}
  {...rest}
>
  {@render children()}
</Footer>
