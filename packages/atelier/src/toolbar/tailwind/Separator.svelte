<script lang="ts">
  import { Separator } from '@kumiki/components/toolbar';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Separator
  class={`mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700 data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full ${className}`.trim()}
  {...rest}
/>
