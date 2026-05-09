<script lang="ts">
  import { Input } from '@kumiki/components/combobox';

  type Props = { placeholder?: string; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Input
  class={`h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:border-slate-700 dark:bg-slate-900 ${className}`.trim()}
  {...rest}
/>
