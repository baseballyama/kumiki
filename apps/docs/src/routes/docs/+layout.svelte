<script lang="ts">
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { PLAYGROUNDS, type PlaygroundEntry } from '$lib/playgrounds/registry.js';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  let { children } = $props();
  let sidebarOpen = $state(false);

  const sb = $derived(dict(ui.locale).sidebar);

  // Strip the slug prefix (`component-`, `attachment-`, `machine-`, `atelier-`)
  // and turn the rest into a human-friendly label. The package names themselves
  // are not translated.
  function entryLabel(p: PlaygroundEntry): string {
    return p.slug.replace(/^(component|attachment|machine|atelier)-/, '').replace(/-/g, ' ');
  }

  function entryHref(p: PlaygroundEntry): string {
    return `/components/${p.slug}`;
  }

  function itemsForLayer(layer: number): Array<{
    href: string;
    label: string;
    status?: 'preview' | 'unreleased' | 'stable';
  }> {
    return PLAYGROUNDS.filter((p) => p.layer === layer).map((p) => ({
      href: entryHref(p),
      label: entryLabel(p),
      status: p.status,
    }));
  }

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
      title: sb.layer0,
      items: itemsForLayer(0),
      collapsible: true,
      defaultOpen: false,
      storageKey: 'layer-0',
    },
    {
      title: sb.layer1,
      items: itemsForLayer(1),
      collapsible: true,
      defaultOpen: false,
      storageKey: 'layer-1',
    },
    {
      title: sb.layer2,
      items: itemsForLayer(2),
      collapsible: true,
      defaultOpen: false,
      storageKey: 'layer-2',
    },
    {
      title: sb.layer3,
      items: itemsForLayer(3),
      collapsible: true,
      defaultOpen: false,
      storageKey: 'layer-3',
    },
    {
      title: sb.layer4,
      items: itemsForLayer(4),
      collapsible: true,
      defaultOpen: true,
      storageKey: 'layer-4',
    },
    {
      title: sb.layer5,
      items: itemsForLayer(5),
      collapsible: true,
      defaultOpen: false,
      storageKey: 'layer-5',
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
