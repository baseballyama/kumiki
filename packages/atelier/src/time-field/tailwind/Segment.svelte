<script lang="ts">
  import { Segment } from '@kumiki/components/time-field';
  import type { SegmentKind } from '@kumiki/components/time-field';

  type Props = { kind: SegmentKind; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Segment
  class={`inline-flex h-7 min-w-[1.25rem] items-center justify-center rounded px-1 focus:bg-slate-200 focus:outline-none data-[empty]:text-slate-400 dark:focus:bg-slate-700 dark:data-[empty]:text-slate-500 ${className}`.trim()}
  {...rest}
/>
