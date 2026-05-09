<!--
  Inline notice shown at the top of doc pages when the body content for the
  active locale isn't available yet and we're falling back to English.
  Encourages community translation contributions.
-->
<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';

  type Props = { availableLocales: ReadonlyArray<string> };
  let { availableLocales }: Props = $props();

  // The chrome dict already covers every locale; this notice only appears
  // when *body* content for the active locale hasn't been authored.
  const showNotice = $derived(!availableLocales.includes(ui.locale) && ui.locale !== 'en');

  // Native-language messages — kept inline so the notice itself is always
  // shown in the user's chosen language even when chrome translations
  // haven't propagated yet.
  const messages: Record<string, string> = {
    ja: 'このページの本文はまだ日本語に翻訳されていません。英語で表示しています。翻訳の貢献を歓迎します。',
    'zh-Hans': '本页正文尚未翻译为简体中文,以英文显示。欢迎贡献翻译。',
    'zh-Hant': '本頁內文尚未翻譯為繁體中文,以英文顯示。歡迎貢獻翻譯。',
    ko: '이 페이지의 본문은 아직 한국어로 번역되지 않았습니다. 영문으로 표시합니다. 번역 기여를 환영합니다.',
    es: 'El contenido de esta página aún no está traducido al español. Se muestra en inglés. Las contribuciones de traducción son bienvenidas.',
    fr: 'Le contenu de cette page n’est pas encore traduit en français. Il est affiché en anglais. Les contributions de traduction sont les bienvenues.',
    de: 'Der Inhalt dieser Seite ist noch nicht ins Deutsche übersetzt. Er wird auf Englisch angezeigt. Übersetzungs­beiträge sind willkommen.',
    ar: 'لم تُتَرجَم هذه الصفحة إلى العربية بعد، وتُعرض بالإنجليزية. مساهمات الترجمة مُرحَّب بها.',
    he: 'התוכן של עמוד זה עדיין לא תורגם לעברית. הוא מוצג באנגלית. תרומות תרגום יתקבלו בברכה.',
  };

  const message = $derived(messages[ui.locale] ?? messages.en);
</script>

{#if showNotice}
  <aside class="notice" lang={ui.locale}>
    <span class="dot" aria-hidden="true"></span>
    <p>{message}</p>
    <a
      class="contribute"
      href="https://github.com/baseballyama/kumiki/blob/main/apps/docs/src/content"
      rel="noopener noreferrer"
      target="_blank"
    >
      ↗
    </a>
  </aside>
{/if}

<style>
  .notice {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    margin-bottom: 24px;
    background: var(--k-yamabuki-soft);
    border: 1px solid color-mix(in oklab, var(--k-yamabuki) 35%, transparent);
    border-radius: var(--k-radius-sm);
    color: var(--k-ink-1);
    font-size: 13.5px;
    line-height: 1.5;
  }
  .notice .dot {
    flex-shrink: 0;
    margin-top: 6px;
    width: 6px;
    height: 6px;
    background: var(--k-yamabuki);
    border-radius: 999px;
  }
  .notice p {
    margin: 0;
    flex: 1;
    color: inherit;
  }
  .contribute {
    flex-shrink: 0;
    color: var(--k-shu-ink);
    font-family: var(--k-font-mono);
    font-size: 14px;
  }
  :global([data-theme='dark']) .contribute {
    color: var(--k-shu);
  }
</style>
