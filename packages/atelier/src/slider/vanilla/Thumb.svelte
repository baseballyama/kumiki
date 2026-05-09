<script lang="ts">
  import { Thumb } from '@kumiki/components/slider';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Thumb class={className} {...rest} />
