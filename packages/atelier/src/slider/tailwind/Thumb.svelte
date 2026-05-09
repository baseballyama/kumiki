<script lang="ts">
  import { Thumb } from '@kumiki/components/slider';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Thumb
  class={`block h-4 w-4 rounded-full border-2 border-slate-900 bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-100 ${className}`.trim()}
  {...rest}
/>
