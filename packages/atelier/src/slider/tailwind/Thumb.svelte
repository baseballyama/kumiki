<script lang="ts">
  import { Thumb } from '@kumiki/components/slider';

  type BaseProps = { class?: string; [k: string]: unknown };
  type Props = (BaseProps & { 'aria-label': string }) | (BaseProps & { 'aria-labelledby': string });

  let { class: className = '', ...rest }: Props = $props();
</script>

<Thumb
  class={`block h-[1.125rem] w-[1.125rem] cursor-grab rounded-full border-0 bg-white shadow-[0_1px_3px_rgb(0_0_0_/_0.2),0_1px_2px_rgb(0_0_0_/_0.06),0_0_0_1px_rgb(0_0_0_/_0.04)] transition-transform duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.08] active:scale-[1.1] active:cursor-grabbing focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-offset-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-white dark:bg-slate-50 dark:focus-visible:ring-offset-slate-950 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 ${className}`.trim()}
  {...rest}
/>
