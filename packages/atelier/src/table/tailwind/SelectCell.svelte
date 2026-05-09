<script lang="ts">
  import { SelectCell } from '@kumiki/components/table';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<SelectCell class={`w-10 px-2 align-middle ${className}`.trim()} {...rest} />
