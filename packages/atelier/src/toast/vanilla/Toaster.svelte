<script lang="ts">
  import { Toaster } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';
  import type { ToastItem, ToastController } from '@kumiki/components/toast';

  type Props = {
    max?: number;
    defaultDuration?: number;
    initial?: ToastItem[];
    onAdd?: (toast: ToastItem) => void;
    onRemove?: (id: string) => void;
    id?: string;
    children: Snippet<[{ toasts: readonly ToastItem[]; controller: ToastController }]>;
  };

  let { children, ...rest }: Props = $props();
</script>

<Toaster {children} {...rest} />
