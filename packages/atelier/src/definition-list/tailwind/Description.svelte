<script lang="ts">
  import { Description } from '@kumiki/components/definition-list';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Description class={`text-slate-600 dark:text-slate-300 m-0 ${className}`.trim()} {...rest}>
  {@render children()}
</Description>
