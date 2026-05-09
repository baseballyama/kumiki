<script lang="ts">
  import { Root } from '@kumiki/components/tooltip';
  import type { Snippet } from 'svelte';

  type Props = {
    open?: boolean;
    defaultOpen?: boolean;
    delayMs?: number;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet;
    [k: string]: unknown;
  };

  let { open = $bindable(undefined), children, ...rest }: Props = $props();
</script>

<Root bind:open {...rest}>{@render children()}</Root>
