<script lang="ts">
  import En from '$content/docs/getting-started/en.svelte';
  import Ja from '$content/docs/getting-started/ja.svelte';
  import ZhHans from '$content/docs/getting-started/zh-Hans.svelte';
  import ZhHant from '$content/docs/getting-started/zh-Hant.svelte';
  import Ko from '$content/docs/getting-started/ko.svelte';
  import Es from '$content/docs/getting-started/es.svelte';
  import Fr from '$content/docs/getting-started/fr.svelte';
  import De from '$content/docs/getting-started/de.svelte';
  import Ar from '$content/docs/getting-started/ar.svelte';
  import He from '$content/docs/getting-started/he.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
</script>

{#if ui.locale === 'ja'}
  <Ja />
{:else if ui.locale === 'zh-Hans'}
  <ZhHans />
{:else if ui.locale === 'zh-Hant'}
  <ZhHant />
{:else if ui.locale === 'ko'}
  <Ko />
{:else if ui.locale === 'es'}
  <Es />
{:else if ui.locale === 'fr'}
  <Fr />
{:else if ui.locale === 'de'}
  <De />
{:else if ui.locale === 'ar'}
  <Ar />
{:else if ui.locale === 'he'}
  <He />
{:else}
  <En />
{/if}
