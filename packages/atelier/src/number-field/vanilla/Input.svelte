<script lang="ts">
  import { Input } from '@kumiki/components/number-field';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Input class={className} {...rest} />
