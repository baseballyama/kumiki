<script lang="ts">
  import En from '$content/docs/composition/en.svelte';
  import Ja from '$content/docs/composition/ja.svelte';
  import ZhHans from '$content/docs/composition/zh-Hans.svelte';
  import ZhHant from '$content/docs/composition/zh-Hant.svelte';
  import Ko from '$content/docs/composition/ko.svelte';
  import Es from '$content/docs/composition/es.svelte';
  import Fr from '$content/docs/composition/fr.svelte';
  import De from '$content/docs/composition/de.svelte';
  import Ar from '$content/docs/composition/ar.svelte';
  import He from '$content/docs/composition/he.svelte';
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
