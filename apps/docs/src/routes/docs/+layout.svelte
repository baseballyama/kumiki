<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { PLAYGROUNDS } from '$lib/playgrounds/registry.js';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  let { children } = $props();
  let sidebarOpen = $state(false);

  const sb = $derived(dict(ui.locale).sidebar);

  // Component sidebar items keep their slug-derived labels — they are package
  // names, not translated strings.
  const componentItems = PLAYGROUNDS.filter((p) => p.layer === 4).map((p) => ({
    href: `/components/${p.slug}`,
    label: p.name.split('/').pop()?.replace(/-/g, ' ') ?? p.name,
    status: p.status,
  }));

  const sections = $derived([
    {
      title: sb.gettingStarted,
      items: [
        { href: '/docs/getting-started', label: sb.introduction },
        { href: '/docs/installation', label: sb.installation },
        { href: '/docs/first-component', label: sb.firstComponent },
      ],
    },
    {
      title: sb.foundations,
      items: [
        { href: '/docs/architecture', label: sb.architecture },
        { href: '/docs/layers-by-example', label: sb.layersByExample },
        { href: '/docs/composition', label: sb.composition },
        { href: '/docs/styling', label: sb.styling },
        { href: '/docs/accessibility', label: sb.accessibility },
        { href: '/docs/i18n', label: sb.i18n },
        { href: '/docs/bundle-budgets', label: sb.bundleBudgets },
      ],
    },
    {
      title: sb.components,
      items: componentItems,
    },
  ]);
</script>

<div class="layout">
  <Sidebar {sections} open={sidebarOpen} onClose={() => (sidebarOpen = false)} />

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

  <article class="content">
    {@render children()}
  </article>
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
  .content {
    flex: 1;
    padding: 48px 0 64px;
    min-width: 0;
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
    .content {
      padding-top: 24px;
    }
  }
</style>
