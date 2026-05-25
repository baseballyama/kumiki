<script lang="ts">
  import { base, resolve } from '$app/paths';
  import { Vanilla as Breadcrumb } from '@kumiki/atelier/breadcrumb';

  // `/docs/atelier` is a demo URL — there is no real route. We prefix the
  // base path by hand because `resolve()` only accepts known routes.
  const atelierHref = `${base}/docs/atelier`;
</script>

<div class="demo">
  <Breadcrumb.Root aria-label="Breadcrumb">
    <Breadcrumb.Item>
      <Breadcrumb.Link href={resolve('/')}>Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href={resolve('/docs')}>Docs</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href={atelierHref}>Atelier</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link current>Breadcrumb</Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.Root>
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
</style>
