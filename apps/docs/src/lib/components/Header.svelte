<!--
  Sticky site header. Houses the logo, primary navigation, search trigger,
  theme/locale toggles, and a mobile menu opener.
-->
<script lang="ts">
  import { page } from '$app/state';
  import Logo from './Logo.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import LocaleSelect from './LocaleSelect.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';

  const labels = $derived(dict(ui.locale).nav);
  const path = $derived(page.url.pathname);

  let drawerOpen = $state(false);

  function isActive(href: string): boolean {
    if (href === '/') return path === '/';
    return path === href || path.startsWith(href + '/');
  }

  // Close drawer on route change
  $effect(() => {
    void path;
    drawerOpen = false;
  });
</script>

<a class="skip-link" href="#main">{labels.skipToContent}</a>

<header class="header">
  <div class="bar">
    <div class="brand">
      <button
        type="button"
        class="menu-btn"
        aria-label={labels.menu}
        aria-expanded={drawerOpen}
        onclick={() => (drawerOpen = !drawerOpen)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <Logo />
      <span class="version" aria-label="Status">pre-α</span>
    </div>

    <nav class="primary" aria-label="Primary">
      <a href="/docs/getting-started" class:active={isActive('/docs')}>{labels.docs}</a>
      <a href="/components" class:active={isActive('/components')}>{labels.components}</a>
      <a href="/docs/architecture" class:active={path.startsWith('/docs/architecture')}
        >{labels.architecture}</a
      >
      <a href="/sizes" class:active={isActive('/sizes')}>{labels.sizes}</a>
      <a href="/api" class:active={isActive('/api')}>{labels.api}</a>
    </nav>

    <div class="actions">
      <a class="github" href="https://github.com/baseballyama/kumiki" rel="noopener noreferrer">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
          />
        </svg>
        <span class="sr-only">{labels.github}</span>
      </a>
      <ThemeToggle />
      <LocaleSelect />
    </div>
  </div>

  {#if drawerOpen}
    <nav class="drawer" aria-label="Mobile navigation">
      <a href="/docs/getting-started" class:active={isActive('/docs')}>{labels.docs}</a>
      <a href="/components" class:active={isActive('/components')}>{labels.components}</a>
      <a href="/docs/architecture" class:active={path.startsWith('/docs/architecture')}
        >{labels.architecture}</a
      >
      <a href="/sizes" class:active={isActive('/sizes')}>{labels.sizes}</a>
      <a href="/api" class:active={isActive('/api')}>{labels.api}</a>
      <a href="https://github.com/baseballyama/kumiki" rel="noopener noreferrer">
        {labels.github} ↗
      </a>
    </nav>
  {/if}
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in oklab, var(--k-surface-0) 92%, transparent);
    backdrop-filter: saturate(140%) blur(12px);
    -webkit-backdrop-filter: saturate(140%) blur(12px);
    border-bottom: 1px solid var(--k-line-1);
  }
  .bar {
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 12px 24px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 24px;
    align-items: center;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }
  .menu-btn {
    display: none;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    background: transparent;
    color: var(--k-ink-2);
    cursor: pointer;
  }
  .version {
    font-family: var(--k-font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--k-shu);
    border: 1px solid color-mix(in oklab, var(--k-shu) 35%, transparent);
    padding: 2px 6px;
    border-radius: 999px;
  }

  .primary {
    display: flex;
    gap: 4px;
    justify-content: center;
    font-size: 14px;
  }
  .primary a {
    padding: 7px 12px;
    border-radius: var(--k-radius-sm);
    color: var(--k-ink-2);
    transition:
      background var(--k-dur-fast),
      color var(--k-dur-fast);
  }
  .primary a:hover {
    color: var(--k-ink-1);
    text-decoration: none;
    background: var(--k-surface-1);
  }
  .primary a.active {
    color: var(--k-ink-1);
    background: var(--k-surface-2);
  }

  .actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .github {
    width: 36px;
    height: 36px;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    color: var(--k-ink-2);
    display: inline-grid;
    place-items: center;
    transition:
      border-color var(--k-dur-fast),
      color var(--k-dur-fast);
  }
  .github:hover {
    color: var(--k-ink-1);
    border-color: var(--k-line-2);
    text-decoration: none;
  }

  .drawer {
    display: none;
  }

  @media (max-width: 920px) {
    .bar {
      grid-template-columns: auto 1fr;
      gap: 16px;
    }
    .menu-btn {
      display: inline-grid;
    }
    .primary {
      display: none;
    }
    .drawer {
      display: flex;
      flex-direction: column;
      padding: 8px 16px 16px;
      border-top: 1px solid var(--k-line-1);
      gap: 2px;
      font-size: 15px;
    }
    .drawer a {
      padding: 10px 12px;
      border-radius: var(--k-radius-sm);
      color: var(--k-ink-2);
    }
    .drawer a.active,
    .drawer a:hover {
      background: var(--k-surface-1);
      color: var(--k-ink-1);
      text-decoration: none;
    }
  }
</style>
