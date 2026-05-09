<script lang="ts">
  import { Input } from '@kumiki/components/form-field';

  type Props = { name?: string; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Input class={className} {...rest} />
