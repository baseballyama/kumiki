<!--
  Layer 4 LoadingSpinner demo — pure headless contract.

  L4 ships only behavioral / a11y props:
  - `mode` — `region` (label visible) vs `inline` (label `data-visually-hidden`)
  - `spinner` snippet — the glyph itself is consumer- or atelier-supplied (ADR 0014)
  - `role="status"` + `aria-live="polite"` are baked in

  Sizes are NOT part of L4. See `@kumiki/atelier/loading-spinner` (Layer 5)
  for the size vocabulary, or apply your own `data-*` / `class` via rest-spread.
-->
<script lang="ts">
  import { LoadingSpinner, type LoadingSpinnerMode } from '@kumiki/components/loading-spinner';

  let mode = $state<LoadingSpinnerMode>('region');
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      Mode
      <select bind:value={mode}>
        <option value="region">region (visible label)</option>
        <option value="inline">inline (visually-hidden label)</option>
      </select>
    </label>
  </div>

  <div class="surface">
    <LoadingSpinner.Root {mode}>
      <LoadingSpinner.Label>Loading content…</LoadingSpinner.Label>
    </LoadingSpinner.Root>
  </div>

  <p class="hint">
    <code>role="status"</code> · <code>aria-live="polite"</code>. The spinner glyph is the default
    consumer-CSS rule in this demo's <code>&lt;style&gt;</code> block — Layer 4 ships
    <strong>no glyph and no size vocabulary</strong>. Layer 5 (<code
      >@kumiki/atelier/loading-spinner</code
    >) provides a reduced-motion-friendly default plus
    <code>sm</code> / <code>md</code> / <code>lg</code> sizing.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .controls {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .control select {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
  }
  .surface {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 110px;
    background: var(--k-surface-1);
    border-radius: var(--k-radius-md);
    border: 1px dashed var(--k-line-2);
  }
  .surface :global([role='status']) {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--k-ink-2);
    font-size: 14px;
  }
  .surface :global([data-default-glyph]) {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--k-line-2);
    border-top-color: var(--k-shu);
    animation: spin 0.8s linear infinite;
  }
  .surface :global([data-mode='inline'] [data-visually-hidden]) {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .surface :global([data-default-glyph]) {
      animation: none;
    }
  }
  .hint {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    line-height: 1.6;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .hint code {
    color: var(--k-matcha-ink);
  }
</style>
