<!--
  Sidebar for the /api section.

  Mirrors the visual treatment of `lib/components/Sidebar.svelte` (the one
  used by /docs and /components) but adds:
    - a filter input that narrows the visible modules
    - per-package member counts
    - kind-tally micro-bars next to each module name
-->
<script lang="ts">
  import { page } from '$app/state';
  import type { ApiPackage } from '$lib/api/types.js';

  let {
    packages,
    open = false,
    onClose,
  }: {
    packages: readonly ApiPackage[];
    open?: boolean;
    onClose?: () => void;
  } = $props();

  const path = $derived(page.url.pathname);
  let query = $state('');

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return packages.map((p) => {
      const modules =
        q === '' ? p.modules : p.modules.filter((m) => m.name.toLowerCase().includes(q));
      return { id: p.id, name: p.name, tagline: p.tagline, modules };
    });
  });

  function isActive(slug: string): boolean {
    return path === `/api/${slug}`;
  }
</script>

<aside class="sidebar" class:open aria-label="API section navigation">
  <button class="close" type="button" onclick={() => onClose?.()} aria-label="Close menu">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
  </button>

  <a href="/api" class="brand" class:brand--active={path === '/api'}>
    <span class="brand-kicker">Reference</span>
    <span class="brand-title">API</span>
  </a>

  <label class="filter">
    <svg
      class="filter-icon"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" stroke-width="1.3" />
      <path d="M8.5 8.5L11 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
    </svg>
    <input
      type="search"
      placeholder="filter"
      bind:value={query}
      autocomplete="off"
      spellcheck="false"
      aria-label="Filter modules"
    />
    {#if query}
      <button type="button" class="clear" onclick={() => (query = '')} aria-label="Clear filter">
        ×
      </button>
    {/if}
  </label>

  <nav>
    {#each filtered as pkg (pkg.id)}
      {#if pkg.modules.length > 0}
        <div class="pkg">
          <div class="pkg-head">
            <h3>{pkg.name}</h3>
            <span class="pkg-count">{pkg.modules.length}</span>
          </div>
          <ul>
            {#each pkg.modules as m (m.slug)}
              <li>
                <a href={`/api/${m.slug}`} class:active={isActive(m.slug)}>
                  <span class="m-name">{m.name}</span>
                  <span class="m-count" aria-hidden="true">{m.memberCount}</span>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/each}
    {#if filtered.every((p) => p.modules.length === 0)}
      <p class="empty">No modules match “{query}”.</p>
    {/if}
  </nav>
</aside>

{#if open}
  <button type="button" class="scrim" aria-label="Close menu" onclick={() => onClose?.()}></button>
{/if}

<style>
  .sidebar {
    width: var(--k-sidebar-w);
    flex-shrink: 0;
    padding: 24px 8px 48px 0;
    align-self: stretch;
    border-inline-end: 1px solid var(--k-line-1);
    height: calc(100vh - 65px);
    position: sticky;
    top: 65px;
    overflow-y: auto;
  }
  .close {
    display: none;
    background: transparent;
    border: 1px solid var(--k-line-1);
    color: var(--k-ink-2);
    width: 32px;
    height: 32px;
    border-radius: var(--k-radius-sm);
    margin-bottom: 12px;
    cursor: pointer;
  }

  .brand {
    display: block;
    padding: 4px 12px 16px;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid var(--k-line-1);
    margin-bottom: 14px;
  }
  .brand-kicker {
    display: block;
    font-family: var(--k-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--k-ink-4);
    margin-bottom: 2px;
  }
  .brand-title {
    display: block;
    font-family: var(--k-font-display);
    font-size: 22px;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
    color: var(--k-ink-1);
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .brand--active .brand-title {
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) .brand--active .brand-title {
    color: var(--k-shu);
  }

  .filter {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 12px 18px;
    padding: 7px 10px;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    background: var(--k-surface-1);
    transition: border-color var(--k-dur-fast);
  }
  .filter:focus-within {
    border-color: var(--k-shu);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--k-shu) 18%, transparent);
  }
  .filter-icon {
    color: var(--k-ink-4);
    flex-shrink: 0;
  }
  .filter input {
    flex: 1;
    border: 0;
    background: transparent;
    color: var(--k-ink-1);
    font-family: var(--k-font-mono);
    font-size: 12.5px;
    outline: none;
    min-width: 0;
  }
  .filter input::placeholder {
    color: var(--k-ink-5);
  }
  .clear {
    background: transparent;
    border: 0;
    color: var(--k-ink-4);
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 0 2px;
  }

  .pkg + .pkg {
    margin-top: 22px;
  }
  .pkg-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 0 12px;
    margin-bottom: 6px;
  }
  .pkg-head h3 {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    margin: 0;
  }
  .pkg-count {
    font-family: var(--k-font-mono);
    font-size: 10px;
    color: var(--k-ink-5);
    font-variant-numeric: tabular-nums;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li a {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 12px;
    margin: 1px 0;
    color: var(--k-ink-2);
    text-decoration: none;
    border-radius: var(--k-radius-xs);
    border-inline-start: 2px solid transparent;
    transition:
      background var(--k-dur-fast),
      color var(--k-dur-fast),
      border-color var(--k-dur-fast);
  }
  .m-name {
    font-family: var(--k-font-mono);
    font-size: 13px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .m-count {
    font-family: var(--k-font-mono);
    font-size: 10px;
    color: var(--k-ink-5);
    font-variant-numeric: tabular-nums;
  }
  li a:hover {
    background: var(--k-surface-1);
    color: var(--k-ink-1);
  }
  li a.active {
    background: var(--k-surface-1);
    color: var(--k-shu-ink);
    border-inline-start-color: var(--k-shu);
    font-weight: 500;
  }
  :global([data-theme='dark']) li a.active {
    color: var(--k-shu);
  }
  .empty {
    color: var(--k-ink-4);
    font-size: 13px;
    padding: 12px;
  }

  .scrim {
    display: none;
  }

  @media (max-width: 920px) {
    .sidebar {
      position: fixed;
      inset-inline-start: -100%;
      inset-block-start: 0;
      height: 100vh;
      width: 280px;
      background: var(--k-surface-0);
      border-inline-end: 1px solid var(--k-line-1);
      padding: 24px 16px 48px;
      z-index: 80;
      transition: inset-inline-start var(--k-dur-mid) var(--k-ease-out);
      box-shadow: var(--k-shadow-lg);
    }
    .sidebar.open {
      inset-inline-start: 0;
    }
    .close {
      display: inline-grid;
      place-items: center;
    }
    .scrim {
      display: block;
      position: fixed;
      inset: 0;
      background: oklch(0 0 0 / 0.4);
      z-index: 70;
      border: 0;
      padding: 0;
      cursor: default;
    }
  }
</style>
