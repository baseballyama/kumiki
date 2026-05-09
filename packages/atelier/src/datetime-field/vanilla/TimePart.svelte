<script lang="ts">
  import { TimePart } from '@kumiki/components/datetime-field';

  type Props = { label?: string; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<TimePart class={className} {...rest} />
