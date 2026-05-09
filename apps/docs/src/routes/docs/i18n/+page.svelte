<script lang="ts">
  import En from '$content/docs/i18n/en.svelte';
  import Ja from '$content/docs/i18n/ja.svelte';
  import ZhHans from '$content/docs/i18n/zh-Hans.svelte';
  import ZhHant from '$content/docs/i18n/zh-Hant.svelte';
  import Ko from '$content/docs/i18n/ko.svelte';
  import Es from '$content/docs/i18n/es.svelte';
  import Fr from '$content/docs/i18n/fr.svelte';
  import De from '$content/docs/i18n/de.svelte';
  import Ar from '$content/docs/i18n/ar.svelte';
  import He from '$content/docs/i18n/he.svelte';
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
