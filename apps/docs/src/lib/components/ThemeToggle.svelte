<!--
  Theme toggle — light ⇄ dark. Sun and moon glyphs morph between states.
  Animation respects prefers-reduced-motion.
-->
<script lang="ts">
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';
  const labels = $derived(dict(ui.locale).nav);
</script>

<button
  type="button"
  class="theme"
  aria-label={labels.toggleTheme}
  title={labels.toggleTheme}
  onclick={() => ui.toggleTheme()}
  data-theme-mode={ui.theme}
>
  <svg
    class="sun"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4.2" fill="currentColor" />
    <g stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
      <path d="M12 2.5v2.7" /><path d="M12 18.8v2.7" /><path d="M2.5 12h2.7" /><path
        d="M18.8 12h2.7"
      />
      <path d="M5.6 5.6l1.9 1.9" /><path d="M16.5 16.5l1.9 1.9" /><path
        d="M5.6 18.4l1.9-1.9"
      /><path d="M16.5 7.5l1.9-1.9" />
    </g>
  </svg>
  <svg
    class="moon"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 13.4A9 9 0 1 1 10.6 3a7.2 7.2 0 0 0 10.4 10.4Z"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linejoin="round"
    />
  </svg>
</button>

<style>
  .theme {
    width: 36px;
    height: 36px;
    border-radius: var(--k-radius-sm);
    background: transparent;
    border: 1px solid var(--k-line-1);
    color: var(--k-ink-2);
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    position: relative;
    transition:
      background var(--k-dur-fast),
      color var(--k-dur-fast),
      border-color var(--k-dur-fast);
  }
  .theme:hover {
    background: var(--k-surface-1);
    color: var(--k-ink-1);
    border-color: var(--k-line-2);
  }
  .theme svg {
    position: absolute;
    transition:
      transform var(--k-dur-mid) var(--k-ease-out),
      opacity var(--k-dur-fast) var(--k-ease-out);
  }
  .theme[data-theme-mode='light'] .sun {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
  .theme[data-theme-mode='light'] .moon {
    transform: rotate(45deg) scale(0.4);
    opacity: 0;
  }
  .theme[data-theme-mode='dark'] .sun {
    transform: rotate(-45deg) scale(0.4);
    opacity: 0;
  }
  .theme[data-theme-mode='dark'] .moon {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
</style>
