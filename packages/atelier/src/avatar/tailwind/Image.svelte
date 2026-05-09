<script lang="ts">
  import { Image } from '@kumiki/components/avatar';

  type Props = { src: string; loading?: 'eager' | 'lazy'; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Image class={`h-full w-full object-cover data-[hidden]:hidden ${className}`.trim()} {...rest} />
