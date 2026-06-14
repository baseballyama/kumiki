<script lang="ts">
  import { Increment } from '@kumiki/components/number-field';
  import type { Snippet } from 'svelte';

  type BaseProps = { class?: string; [k: string]: unknown };
  type Props =
    | (BaseProps & { children: Snippet; 'aria-label'?: never })
    | (BaseProps & { 'aria-label': string; children?: Snippet });

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Increment class={className} {...rest}>
  {#if children}{@render children()}{:else}<span aria-hidden="true">+</span>{/if}
</Increment>
