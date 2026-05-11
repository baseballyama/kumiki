<script lang="ts">
  import { Segment } from '@kumiki/components/time-field';
  import type { SegmentKind } from '@kumiki/components/time-field';

  type Props = { kind: SegmentKind; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Segment
  class={`inline-flex h-7 min-w-[1.25rem] cursor-text items-center justify-center rounded px-1 transition-colors duration-100 focus:bg-orange-100 focus:text-orange-700 focus:outline-none data-[empty]:text-slate-400 dark:focus:bg-orange-900/40 dark:focus:text-orange-300 dark:data-[empty]:text-slate-500 ${className}`.trim()}
  {...rest}
/>
