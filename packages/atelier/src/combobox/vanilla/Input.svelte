<script lang="ts">
  import { Input } from '@kumiki/components/combobox';

  type Props = { placeholder?: string; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Input class={className} {...rest} />
