<!--
  Reusable sidebar for /docs and /components routes.
-->
<script lang="ts">
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  type Item = { href: string; label: string; status?: 'preview' | 'unreleased' | 'stable' };
  type Section = {
    title: string;
    items: ReadonlyArray<Item>;
    /** Render the section as a collapsible <details>. */
    collapsible?: boolean;
    /** Initial open state when collapsible. Defaults to false. */
    defaultOpen?: boolean;
    /** Stable id for persisting expansion in localStorage. */
    storageKey?: string;
  };

  let {
    sections,
    open = false,
    onClose,
    children,
  }: {
    sections: ReadonlyArray<Section>;
    open?: boolean;
    onClose?: () => void;
    children?: Snippet;
  } = $props();

  const path = $derived(page.url.pathname);
  const sb = $derived(dict(ui.locale).sidebar);

  function readPersistedOpen(key: string | undefined, fallback: boolean): boolean {
    if (typeof localStorage === 'undefined' || !key) return fallback;
    const raw = localStorage.getItem(`kumiki:sidebar:${key}`);
    return raw === null ? fallback : raw === '1';
  }

  function persistOpen(key: string | undefined, value: boolean): void {
    if (typeof localStorage === 'undefined' || !key) return;
    localStorage.setItem(`kumiki:sidebar:${key}`, value ? '1' : '0');
  }

  function sectionContainsActive(items: ReadonlyArray<Item>, currentPath: string): boolean {
    return items.some((it) => it.href === currentPath);
  }
</script>

<aside class="sidebar" class:open aria-label="Section navigation">
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
  {#if children}
    <div class="header-extra">{@render children()}</div>
  {/if}
  <nav>
    {#each sections as section, sIdx (sIdx)}
      {#if section.collapsible}
        {@const containsActive = sectionContainsActive(section.items, path)}
        {@const initialOpen =
          containsActive || readPersistedOpen(section.storageKey, section.defaultOpen ?? false)}
        <details
          class="section section-collapsible"
          open={initialOpen}
          ontoggle={(e) =>
            persistOpen(section.storageKey, (e.currentTarget as HTMLDetailsElement).open)}
        >
          <summary>
            <h3>{section.title}</h3>
            <svg
              class="caret"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 2l3 3-3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
              ></path>
            </svg>
          </summary>
          <ul>
            {#each section.items as item (item.href)}
              <li>
                <a href={item.href} class:active={path === item.href}>
                  <span>{item.label}</span>
                  {#if item.status === 'preview'}
                    <span class="badge preview">{sb.previewBadge}</span>
                  {:else if item.status === 'unreleased'}
                    <span class="badge unreleased">{sb.soonBadge}</span>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </details>
      {:else}
        <div class="section">
          <h3>{section.title}</h3>
          <ul>
            {#each section.items as item (item.href)}
              <li>
                <a href={item.href} class:active={path === item.href}>
                  <span>{item.label}</span>
                  {#if item.status === 'preview'}
                    <span class="badge preview">{sb.previewBadge}</span>
                  {:else if item.status === 'unreleased'}
                    <span class="badge unreleased">{sb.soonBadge}</span>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/each}
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
  .header-extra {
    margin-bottom: 16px;
    padding-inline-end: 12px;
  }

  .section + .section {
    margin-top: 24px;
  }
  .section h3 {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--k-ink-4);
    margin-bottom: 8px;
    padding-inline-start: 12px;
  }
  .section-collapsible > summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline-end: 12px;
    user-select: none;
    border-radius: var(--k-radius-xs);
    transition: background var(--k-dur-fast);
  }
  .section-collapsible > summary::-webkit-details-marker {
    display: none;
  }
  .section-collapsible > summary:hover {
    background: var(--k-surface-1);
  }
  .section-collapsible > summary > h3 {
    margin-bottom: 0;
    flex: 1;
  }
  .section-collapsible > summary .caret {
    color: var(--k-ink-4);
    transition: transform var(--k-dur-fast) var(--k-ease-out);
    flex-shrink: 0;
  }
  .section-collapsible[open] > summary .caret {
    transform: rotate(90deg);
  }
  .section-collapsible > ul {
    margin-top: 8px;
  }
  :global([dir='rtl']) .section-collapsible > summary .caret {
    transform: scaleX(-1);
  }
  :global([dir='rtl']) .section-collapsible[open] > summary .caret {
    transform: rotate(-90deg) scaleX(-1);
  }
  ul {
    list-style: none;
  }
  li a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    margin: 2px 0;
    color: var(--k-ink-2);
    border-radius: var(--k-radius-xs);
    font-size: 13.5px;
    transition:
      background var(--k-dur-fast),
      color var(--k-dur-fast);
    border-inline-start: 2px solid transparent;
  }
  li a:hover {
    color: var(--k-ink-1);
    background: var(--k-surface-1);
    text-decoration: none;
  }
  li a.active {
    color: var(--k-shu-ink);
    background: var(--k-surface-1);
    border-inline-start-color: var(--k-shu);
    font-weight: 500;
  }
  :global([data-theme='dark']) li a.active {
    color: var(--k-shu);
  }

  .badge {
    font-family: var(--k-font-mono);
    font-size: 9px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 1px 5px;
    border-radius: 999px;
    border: 1px solid;
  }
  .badge.preview {
    color: var(--k-yamabuki);
    border-color: color-mix(in oklab, var(--k-yamabuki) 50%, transparent);
  }
  .badge.unreleased {
    color: var(--k-ink-4);
    border-color: var(--k-line-2);
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
