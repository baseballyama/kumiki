<script lang="ts">
  import { Link } from '@kumiki/components/breadcrumb';
  import type { Snippet } from 'svelte';

  type CurrentProps = {
    current: true;
    href?: undefined;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  type LinkProps = {
    href: string;
    current?: false;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  type Props = LinkProps | CurrentProps;

  let props: Props = $props();
</script>

{#if props.current === true}
  {@const { current: _c, class: cls = '', children, ...rest } = props as CurrentProps}
  <Link current class={cls} {...rest}>{@render children()}</Link>
{:else}
  {@const { href, current: _c, class: cls = '', children, ...rest } = props as LinkProps}
  <Link {href} class={cls} {...rest}>{@render children()}</Link>
{/if}
