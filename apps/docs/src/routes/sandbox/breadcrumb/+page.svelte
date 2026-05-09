<!--
  Breadcrumb sandbox — Playwright + axe fixture.

  Query params:
    ?dir=rtl
-->
<script lang="ts">
  import { Breadcrumb } from '@kumiki/components/breadcrumb';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
</script>

<svelte:head>
  <title>Breadcrumb sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="breadcrumb" data-testid="sandbox">
  <h1>Breadcrumb sandbox</h1>

  <div data-testid="breadcrumb-host">
    <Breadcrumb.Root>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/" data-testid="link-home">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/products" data-testid="link-products">Products</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link current data-testid="link-current">Acme</Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.Root>
  </div>

  <p data-testid="state">dir: <strong data-testid="dir">{dir}</strong></p>
</div>
