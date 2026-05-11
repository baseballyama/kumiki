<script lang="ts">
  import { Separator } from '@kumiki/components/menu';
  import type { MenuItem as MenuItemType } from '@kumiki/components/menu';

  type Props = { item: MenuItemType; class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Separator
  class={`-mx-px my-[0.3125rem] h-px bg-slate-200 dark:bg-slate-700 ${className}`.trim()}
  {...rest}
/>
