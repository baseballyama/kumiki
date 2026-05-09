<script lang="ts">
  import { Image } from '@kumiki/components/avatar';

  type Props = { src: string; loading?: 'eager' | 'lazy'; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Image class={className} {...rest} />
