<!--
  Breadcrumb sandbox — Playwright + axe fixture.

  Query params:
    ?dir=rtl
-->
<script lang="ts">
  import { base, resolve } from '$app/paths';
  import { Breadcrumb } from '@kumiki/components/breadcrumb';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  // `resolve()` enforces that the pathname matches a known route. Sandbox
  // demos intentionally use fictional URLs (`/products`, …) for illustration,
  // so we prefix the base path manually instead.
  const productsHref = `${base}/products`;
</script>

<svelte:head>
  <title>Breadcrumb sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="breadcrumb" data-testid="sandbox">
  <h1>Breadcrumb sandbox</h1>

  <div data-testid="breadcrumb-host">
    <Breadcrumb.Root>
      <Breadcrumb.Item>
        <Breadcrumb.Link href={resolve('/')} data-testid="link-home">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href={productsHref} data-testid="link-products">Products</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link current data-testid="link-current">Acme</Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  </div>

  <p data-testid="state">dir: <strong data-testid="dir">{dir}</strong></p>
</div>
