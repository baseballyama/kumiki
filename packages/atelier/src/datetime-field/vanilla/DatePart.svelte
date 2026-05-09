<script lang="ts">
  import { DatePart } from '@kumiki/components/datetime-field';

  type Props = { locale?: string; placeholder?: string; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<DatePart class={className} {...rest} />
