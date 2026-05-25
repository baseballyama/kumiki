<script lang="ts">
  import { asset, resolve } from '$app/paths';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';
  const f = $derived(dict(ui.locale).footer);
</script>

<footer>
  <div class="inner">
    <div class="meta">
      <span class="mark" aria-hidden="true">組木</span>
      <span class="rights">{f.rights}</span>
    </div>
    <ul class="links">
      <li><a href={resolve('/docs/getting-started')}>{f.gettingStarted}</a></li>
      <li><a href={resolve('/docs/architecture')}>{f.architecture}</a></li>
      <li><a href={resolve('/docs/accessibility')}>{f.accessibility}</a></li>
      <li><a href={resolve('/docs/i18n')}>{f.i18n}</a></li>
      <li><a href={resolve('/sizes')}>{f.sizes}</a></li>
      <li><a href={asset('/llms.txt')} dir="ltr">llms.txt</a></li>
      <li>
        <a href="https://github.com/baseballyama/kumiki" rel="noopener noreferrer">GitHub ↗</a>
      </li>
    </ul>
  </div>
  <div class="seal" aria-hidden="true"></div>
</footer>

<style>
  footer {
    margin-top: var(--k-space-24);
    border-top: 1px solid var(--k-line-1);
    background: var(--k-surface-1);
    position: relative;
  }
  .inner {
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 48px 24px 56px;
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    justify-content: space-between;
    align-items: flex-start;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .mark {
    font-family: var(--k-font-display);
    font-size: 64px;
    line-height: 1;
    color: var(--k-shu);
    letter-spacing: -0.02em;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 100;
  }
  .rights {
    color: var(--k-ink-3);
    font-size: 13px;
    max-width: 32ch;
    line-height: 1.6;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .links {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 32px;
    font-size: 14px;
  }
  .links a {
    color: var(--k-ink-2);
  }
  .links a:hover {
    color: var(--k-shu-ink);
  }
  .seal {
    position: absolute;
    inset-inline-end: 32px;
    inset-block-end: 12px;
    width: 22px;
    height: 22px;
    border: 1.5px solid var(--k-shu);
    border-radius: 4px;
    transform: rotate(45deg);
    pointer-events: none;
    opacity: 0.7;
  }
  .seal::after {
    content: '';
    position: absolute;
    inset: 4px;
    background: var(--k-shu);
    opacity: 0.85;
    border-radius: 2px;
  }
  @media (max-width: 640px) {
    .links {
      grid-template-columns: 1fr;
    }
  }
</style>
