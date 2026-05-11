<script lang="ts">
  import { Input } from '@kumiki/components/number-field';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Input
  class={`h-9 w-20 border-0 bg-transparent px-2.5 text-right text-[0.8125rem] tabular-nums tracking-[-0.01em] text-slate-900 focus-visible:outline-none dark:text-slate-50 ${className}`.trim()}
  {...rest}
/>
