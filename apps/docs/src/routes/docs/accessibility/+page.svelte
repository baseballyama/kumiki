<script lang="ts">
  import En from '$content/docs/accessibility/en.svelte';
  import Ja from '$content/docs/accessibility/ja.svelte';
  import TranslationNotice from '$lib/components/TranslationNotice.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';

  // Locales with body translations authored. Chrome translations are complete
  // for all 10; this list reflects body-content translations only.
  const AVAILABLE_BODY_LOCALES = ['en', 'ja'] as const;
</script>

<TranslationNotice availableLocales={AVAILABLE_BODY_LOCALES} />

{#if ui.locale === 'ja'}
  <Ja />
{:else}
  <En />
{/if}
