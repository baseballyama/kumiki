<script lang="ts">
  import { ExpandCell } from '@kumiki/components/table';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<ExpandCell class={`w-8 px-2 align-middle ${className}`.trim()} {...rest} />
