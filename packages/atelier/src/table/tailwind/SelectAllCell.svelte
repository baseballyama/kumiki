<script lang="ts">
  import { SelectAllCell } from '@kumiki/components/table';

  type Props = { rowIds?: ReadonlyArray<string>; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<SelectAllCell class={`h-10 w-10 px-2 align-middle ${className}`.trim()} {...rest} />
