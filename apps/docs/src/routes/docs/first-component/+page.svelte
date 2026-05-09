<script lang="ts">
  import En from '$content/docs/first-component/en.svelte';
  import Ja from '$content/docs/first-component/ja.svelte';
  import ZhHans from '$content/docs/first-component/zh-Hans.svelte';
  import ZhHant from '$content/docs/first-component/zh-Hant.svelte';
  import Ko from '$content/docs/first-component/ko.svelte';
  import Es from '$content/docs/first-component/es.svelte';
  import Fr from '$content/docs/first-component/fr.svelte';
  import De from '$content/docs/first-component/de.svelte';
  import Ar from '$content/docs/first-component/ar.svelte';
  import He from '$content/docs/first-component/he.svelte';
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
