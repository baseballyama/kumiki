<script lang="ts">
  import En from '$content/docs/architecture/en.svelte';
  import Ja from '$content/docs/architecture/ja.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
</script>

{#if ui.locale === 'ja'}
  <Ja />
{:else}
  <En />
{/if}
