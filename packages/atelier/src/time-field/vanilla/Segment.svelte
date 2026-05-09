<script lang="ts">
  import { Segment } from '@kumiki/components/time-field';
  import type { SegmentKind } from '@kumiki/components/time-field';

  type Props = { kind: SegmentKind; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Segment class={className} {...rest} />
