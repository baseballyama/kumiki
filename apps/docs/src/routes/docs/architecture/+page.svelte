<script lang="ts">
  import En from '$content/docs/architecture/en.svelte';
  import Ja from '$content/docs/architecture/ja.svelte';
  import ZhHans from '$content/docs/architecture/zh-Hans.svelte';
  import ZhHant from '$content/docs/architecture/zh-Hant.svelte';
  import Ko from '$content/docs/architecture/ko.svelte';
  import Es from '$content/docs/architecture/es.svelte';
  import Fr from '$content/docs/architecture/fr.svelte';
  import De from '$content/docs/architecture/de.svelte';
  import Ar from '$content/docs/architecture/ar.svelte';
  import He from '$content/docs/architecture/he.svelte';
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
