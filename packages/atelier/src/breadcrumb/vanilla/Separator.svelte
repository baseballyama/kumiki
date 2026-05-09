<script lang="ts">
  import { Separator } from '@kumiki/components/breadcrumb';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Separator class={className} {...rest} />
