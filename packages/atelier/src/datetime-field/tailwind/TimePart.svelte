<script lang="ts">
  import { TimePart } from '@kumiki/components/datetime-field';

  type Props = { label?: string; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<TimePart
  class={`inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-[0.8125rem] tabular-nums tracking-[-0.005em] text-slate-900 shadow-[inset_0_1px_1px_rgb(0_0_0_/_0.025),0_1px_1px_rgb(0_0_0_/_0.02)] transition-[border-color,box-shadow] duration-150 focus-within:border-orange-500 focus-within:shadow-[0_0_0_3px_rgb(99_102_241_/_0.18),inset_0_1px_1px_rgb(0_0_0_/_0.025)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus-within:border-orange-500 dark:focus-within:shadow-[0_0_0_3px_rgb(99_102_241_/_0.25),inset_0_1px_1px_rgb(0_0_0_/_0.1)] ${className}`.trim()}
  {...rest}
/>
