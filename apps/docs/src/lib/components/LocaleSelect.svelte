<!--
  Native <select> for locale switching. Native because:
  - it's the most accessible default (handles all the keyboard / SR work),
  - 10 locales is enough that a custom listbox isn't worth the extra bytes
    on the docs site itself,
  - we have to demonstrate i18n discipline, not show off the combobox.
-->
<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';
  import { LOCALES, dict, type LocaleCode } from '$lib/i18n/dict.js';

  const labels = $derived(dict(ui.locale).nav);
</script>

<label class="wrap">
  <span class="sr-only">{labels.selectLocale}</span>
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4" />
    <path
      d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
      stroke="currentColor"
      stroke-width="1.2"
      fill="none"
    />
  </svg>
  <select
    aria-label={labels.selectLocale}
    value={ui.locale}
    onchange={(e) => ui.setLocale((e.currentTarget as HTMLSelectElement).value as LocaleCode)}
  >
    {#each LOCALES as l (l.code)}
      <option value={l.code}>{l.native}</option>
    {/each}
  </select>
</label>

<style>
  .wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 8px 0 10px;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    color: var(--k-ink-2);
    background: transparent;
    transition:
      border-color var(--k-dur-fast),
      color var(--k-dur-fast);
  }
  .wrap:hover {
    border-color: var(--k-line-2);
    color: var(--k-ink-1);
  }
  .wrap:has(select:focus-visible) {
    outline: 2px solid var(--k-focus);
    outline-offset: 2px;
  }
  select {
    appearance: none;
    background: transparent;
    border: 0;
    color: inherit;
    font: inherit;
    font-size: 13px;
    padding-inline-end: 14px;
    cursor: pointer;
    outline: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><path d='M2 4l3 3 3-3' stroke='currentColor' stroke-width='1.2' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
    background-repeat: no-repeat;
    background-position: right center;
    background-size: 10px;
  }
  select option {
    color: var(--k-ink-1);
    background: var(--k-surface-1);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
</style>
