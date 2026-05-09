<script lang="ts">
  import { SelectCell } from '@kumiki/components/table';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<SelectCell class={className} {...rest} />
