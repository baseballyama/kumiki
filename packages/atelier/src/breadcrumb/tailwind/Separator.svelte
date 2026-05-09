<script lang="ts">
  import { Separator } from '@kumiki/components/breadcrumb';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Separator
  class={`mx-2 select-none text-slate-400 dark:text-slate-500 ${className}`.trim()}
  {...rest}
/>
