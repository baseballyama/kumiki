<!--
  @component @kumiki/atelier/dialog Tailwind — Overlay scrim.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();

  const base =
    'fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-md backdrop-saturate-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-safe:data-[state=open]:duration-[220ms] motion-safe:data-[state=closed]:duration-[160ms]';
</script>

<Dialog.Overlay class={`${base} ${className}`.trim()} {...rest} />
