<!--
  @component @kumiki/atelier/horizontal-rule Tailwind variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/horizontal-rule';

  type Props = {
    as?: 'hr' | 'div';
    orientation?: 'horizontal' | 'vertical';
    class?: string;
    [k: string]: unknown;
  };

  let { orientation = 'horizontal', class: className = '', ...rest }: Props = $props();
  const cls = $derived(
    orientation === 'vertical'
      ? 'inline-block h-full w-px bg-slate-200 dark:bg-slate-700'
      : 'block w-full border-0 h-px bg-slate-200 dark:bg-slate-700',
  );
</script>

<Root {orientation} class={`${cls} ${className}`.trim()} {...rest} />
