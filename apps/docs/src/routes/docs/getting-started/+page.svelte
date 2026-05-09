<script lang="ts">
  import En from '$content/docs/getting-started/en.svelte';
  import Ja from '$content/docs/getting-started/ja.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
</script>

{#if ui.locale === 'ja'}
  <Ja />
{:else}
  <En />
{/if}
