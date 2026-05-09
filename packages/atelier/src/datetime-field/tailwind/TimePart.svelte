<script lang="ts">
  import { TimePart } from '@kumiki/components/datetime-field';

  type Props = { label?: string; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<TimePart
  class={`inline-flex h-9 items-center gap-1 rounded-md border border-slate-300 bg-white px-3 text-sm focus-within:ring-2 focus-within:ring-slate-950 dark:border-slate-700 dark:bg-slate-900 ${className}`.trim()}
  {...rest}
/>
