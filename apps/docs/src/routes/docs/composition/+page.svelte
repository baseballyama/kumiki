<script lang="ts">
  import En from '$content/docs/composition/en.svelte';
  import Ja from '$content/docs/composition/ja.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
</script>

{#if ui.locale === 'ja'}
  <Ja />
{:else}
  <En />
{/if}
