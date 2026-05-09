<!--
  @component @kumiki/atelier/horizontal-rule Vanilla variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/horizontal-rule';

  type Props = {
    as?: 'hr' | 'div';
    orientation?: 'horizontal' | 'vertical';
    class?: string;
    [k: string]: unknown;
  };

  let { class: className = '', ...rest }: Props = $props();
</script>

<Root class={`kumiki-hr ${className}`.trim()} {...rest} />

<style>
  :global(.kumiki-hr) {
    --kumiki-hr-color: hsl(220 10% 86%);
    --kumiki-hr-thickness: 1px;
    border: 0;
    background: var(--kumiki-hr-color);
    margin: 0;
  }
  :global(.kumiki-hr[data-orientation='horizontal']) {
    display: block;
    width: 100%;
    height: var(--kumiki-hr-thickness);
  }
  :global(.kumiki-hr[data-orientation='vertical']) {
    display: inline-block;
    width: var(--kumiki-hr-thickness);
    height: 100%;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-hr) {
      --kumiki-hr-color: hsl(220 10% 30%);
    }
  }
</style>
