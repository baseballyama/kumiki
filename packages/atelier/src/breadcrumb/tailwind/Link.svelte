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
  const className = $derived((props as { class?: string }).class ?? '');
  const base = 'transition-colors hover:text-slate-900 dark:hover:text-slate-50';
  const currentClass = 'font-medium text-slate-900 dark:text-slate-50';
</script>

{#if props.current === true}
  {@const { current: _c, class: _cls, children, ...rest } = props as CurrentProps}
  <Link current class={`${currentClass} ${className}`.trim()} {...rest}>
    {@render children()}
  </Link>
{:else}
  {@const { href, current: _c, class: _cls, children, ...rest } = props as LinkProps}
  <Link {href} class={`${base} ${className}`.trim()} {...rest}>
    {@render children()}
  </Link>
{/if}
