<!--
  Shared layout for every page under /api — sidebar (left) + content
  (centre). Module pages add their own right-rail TOC inside +page.svelte.
-->
<script lang="ts">
  import ApiSidebar from '$lib/components/api/ApiSidebar.svelte';
  import { buildIndex } from '$lib/api/registry.js';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  let { children } = $props();
  let sidebarOpen = $state(false);

  const packages = buildIndex();
  const sb = $derived(dict(ui.locale).sidebar);
</script>

<div class="layout">
  <ApiSidebar {packages} open={sidebarOpen} onClose={() => (sidebarOpen = false)} />

  <button
    type="button"
    class="open-btn"
    onclick={() => (sidebarOpen = true)}
    aria-label={sb.sections}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 4h12M2 8h12M2 12h12"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
    {sb.sections}
  </button>

  <div class="page">
    {@render children()}
  </div>
</div>

<style>
  .layout {
    max-width: var(--k-content-max);
    margin: 0 auto;
    display: flex;
    gap: 32px;
    padding: 0 24px;
    align-items: flex-start;
  }
  .page {
    flex: 1;
    min-width: 0;
    padding: 48px 0 96px;
  }
  .open-btn {
    display: none;
    position: sticky;
    top: 80px;
    z-index: 40;
    margin-top: 16px;
    padding: 8px 14px;
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    color: var(--k-ink-2);
    font-family: var(--k-font-mono);
    font-size: 12px;
    cursor: pointer;
    align-items: center;
    gap: 8px;
  }
  @media (max-width: 920px) {
    .open-btn {
      display: inline-flex;
    }
    .page {
      padding-top: 24px;
    }
  }
</style>
