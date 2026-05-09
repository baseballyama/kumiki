<script lang="ts">
  import En from '$content/docs/i18n/en.svelte';
  import Ja from '$content/docs/i18n/ja.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
</script>

{#if ui.locale === 'ja'}
  <Ja />
{:else}
  <En />
{/if}
