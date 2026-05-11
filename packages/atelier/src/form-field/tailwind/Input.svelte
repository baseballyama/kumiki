<script lang="ts">
  import { Input } from '@kumiki/components/form-field';

  type Props = { name?: string; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Input
  class={`h-9 rounded-lg border border-slate-200 bg-white px-3 text-[0.8125rem] tracking-[-0.005em] text-slate-900 shadow-[inset_0_1px_1px_rgb(0_0_0_/_0.025)] transition-[border-color,box-shadow] duration-150 placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-orange-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-500/[0.18] aria-invalid:border-rose-500 aria-invalid:focus-visible:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus-visible:border-orange-500 dark:focus-visible:ring-orange-500/25 motion-reduce:transition-none ${className}`.trim()}
  {...rest}
/>
