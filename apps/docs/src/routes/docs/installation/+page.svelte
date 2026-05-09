<script lang="ts">
  import En from '$content/docs/installation/en.svelte';
  import Ja from '$content/docs/installation/ja.svelte';
  import ZhHans from '$content/docs/installation/zh-Hans.svelte';
  import ZhHant from '$content/docs/installation/zh-Hant.svelte';
  import Ko from '$content/docs/installation/ko.svelte';
  import Es from '$content/docs/installation/es.svelte';
  import Fr from '$content/docs/installation/fr.svelte';
  import De from '$content/docs/installation/de.svelte';
  import Ar from '$content/docs/installation/ar.svelte';
  import He from '$content/docs/installation/he.svelte';
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
