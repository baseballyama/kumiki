<script lang="ts">
  import { Separator } from '@kumiki/components/menu';
  import type { MenuItem as MenuItemType } from '@kumiki/components/menu';

  type Props = { item: MenuItemType; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Separator class={className} {...rest} />
