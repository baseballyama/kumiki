<script lang="ts">
  import { Root } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = {
    open?: boolean;
    defaultOpen?: boolean;
    placement?: string;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet;
    [k: string]: unknown;
  };

  let { open = $bindable(undefined), children, ...rest }: Props = $props();
</script>

<Root bind:open {...rest}>{@render children()}</Root>
