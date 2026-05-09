<!--
  @component @kumiki/atelier/dialog Tailwind — Overlay scrim.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();

  const base =
    'fixed inset-0 z-40 bg-slate-950/60 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0';
</script>

<Dialog.Overlay class={`${base} ${className}`.trim()} {...rest} />
