<script lang="ts">
  import En from '$content/docs/layers-by-example/en.svelte';
  import Ja from '$content/docs/layers-by-example/ja.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
</script>

{#if ui.locale === 'ja'}
  <Ja />
{:else}
  <En />
{/if}
