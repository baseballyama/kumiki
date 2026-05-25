<script lang="ts">
  import { resolve } from '$app/paths';
  import { Breadcrumb } from '@kumiki/components/breadcrumb';

  const trail = [
    { href: resolve('/'), label: 'Home' },
    { href: resolve('/components'), label: 'Components' },
    { href: resolve('/components/breadcrumb'), label: 'Breadcrumb' },
  ];
</script>

<div class="demo">
  <Breadcrumb.Root>
    {#each trail as crumb, i (crumb.href)}
      <Breadcrumb.Item>
        {#if i === trail.length - 1}
          <Breadcrumb.Link current>{crumb.label}</Breadcrumb.Link>
        {:else}
          <Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
        {/if}
      </Breadcrumb.Item>
      {#if i < trail.length - 1}
        <Breadcrumb.Separator>›</Breadcrumb.Separator>
      {/if}
    {/each}
  </Breadcrumb.Root>

  <p class="hint">
    Last item is rendered as <code>aria-current="page"</code> text — not a link.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 400px;
    min-height: 200px;
    box-sizing: border-box;
  }
  .demo :global(nav[data-component-part='root']) {
    color: var(--k-ink-2);
    font-size: 14px;
  }
  .demo :global(ol[data-component-part='list']) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .demo :global([data-component-part='link']) {
    color: var(--k-shu);
    text-decoration: none;
  }
  .demo :global([data-component-part='link']:hover) {
    text-decoration: underline;
  }
  .demo :global([data-component-part='link'][data-current]) {
    color: var(--k-ink-1);
    font-weight: 600;
    cursor: default;
  }
  .demo :global([data-component-part='separator']) {
    color: var(--k-ink-3);
    list-style: none;
  }
  .hint {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .hint code {
    color: var(--k-matcha-ink);
  }
</style>
