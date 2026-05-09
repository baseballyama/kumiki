<script lang="ts">
  import { Input } from '@kumiki/components/number-field';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Input
  class={`h-9 w-20 border-0 bg-transparent px-2 text-sm tabular-nums focus-visible:outline-none ${className}`.trim()}
  {...rest}
/>
