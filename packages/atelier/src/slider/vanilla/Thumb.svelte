<script lang="ts">
  import { Thumb } from '@kumiki/components/slider';

  type BaseProps = { class?: string; [k: string]: unknown };
  type Props = (BaseProps & { 'aria-label': string }) | (BaseProps & { 'aria-labelledby': string });

  let { class: className = '', ...rest }: Props = $props();
</script>

<Thumb class={className} {...rest} />
