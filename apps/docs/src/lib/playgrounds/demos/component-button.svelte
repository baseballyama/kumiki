<!--
  Layer 4 Button demo — pure headless contract.

  L4 ships only behavior + ARIA: `loading` (aria-busy + click/Enter/Space gating),
  `disabled` (aria-disabled), `type`, accessible name (`children` or `aria-label`),
  optional `icon` / `iconTrailing` snippets.

  Visual variants and sizes are intentionally NOT part of L4 — see the
  Layer breakdown below the demo for how the same Button looks at
  Layer 5 (`@kumiki/atelier/button`).
-->
<script lang="ts">
  import { Button } from '@kumiki/components/button';

  let loading = $state(false);
  let disabled = $state(false);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [line, ...log].slice(0, 6);
  }

  async function fakeWork() {
    if (disabled) return;
    loading = true;
    append('clicked → loading…');
    await new Promise((r) => setTimeout(r, 1200));
    loading = false;
    append('done');
  }
</script>

<div class="demo">
  <div class="row">
    <Button.Root class="raw-button" {loading} {disabled} onclick={fakeWork}
      >Save changes</Button.Root
    >

    <label class="control">
      <input type="checkbox" bind:checked={disabled} /> disabled
    </label>
    <label class="control">
      <input type="checkbox" bind:checked={loading} /> loading
    </label>
  </div>

  <p class="state">
    loading=<code>{loading}</code> · disabled=<code>{disabled}</code>
  </p>

  <p class="hint">
    Layer 4 ships <strong>no styling</strong> — the button above only emits
    <code>aria-busy</code> / <code>aria-disabled</code> / <code>data-loading</code> /
    <code>data-disabled</code>. The orange chrome you see is one line of consumer CSS in this demo's
    <code>&lt;style&gt;</code>
    block. Variants / sizes / palettes are a Layer 5 concern (see
    <code>@kumiki/atelier/button</code>) or a consumer concern.
  </p>

  {#if log.length > 0}
    <ol class="log">
      {#each log as line, i (`${i}-${line}`)}
        <li><code>{line}</code></li>
      {/each}
    </ol>
  {/if}
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  /* Consumer-supplied chrome — Layer 4 emits no styles itself. */
  .demo :global(.raw-button) {
    padding: 10px 18px;
    background: var(--k-shu);
    color: white;
    border: 1px solid var(--k-shu);
    border-radius: var(--k-radius-sm);
    font: inherit;
    cursor: pointer;
  }
  .demo :global(.raw-button[aria-busy='true']),
  .demo :global(.raw-button[aria-disabled='true']) {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .state {
    color: var(--k-ink-3);
    font-size: 13px;
    margin-top: 16px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha);
  }
  .hint {
    margin-top: 12px;
    color: var(--k-ink-3);
    font-size: 13px;
    line-height: 1.6;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .hint code {
    color: var(--k-matcha);
  }
  .log {
    margin-top: 8px;
    padding: 8px 12px 8px 28px;
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: var(--k-radius-sm);
    font-size: 12px;
    color: var(--k-ink-3);
    list-style: decimal;
    font-family: var(--k-font-mono, monospace);
  }
</style>
