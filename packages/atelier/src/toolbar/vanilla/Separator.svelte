<script lang="ts">
  import { Separator } from '@kumiki/components/toolbar';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Separator class={className} {...rest} />
