<!--
  Layer 4 Badge demo — pure headless contract.

  L4 Badge ships only the discriminated accessible-name contract:
  - text content (default)
  - `aria-label` for count-only badges
  - `decorative` for hidden status pips

  Visual variants (info/success/warn/error) and sizes are NOT part of L4.
  See `@kumiki/atelier/badge` (Layer 5) for that vocabulary.
-->
<script lang="ts">
  import { Badge } from '@kumiki/components/badge';
</script>

<div class="demo">
  <div class="row">
    <Badge.Root>New</Badge.Root>
    <Badge.Root aria-label="3 unread notifications">3</Badge.Root>
    <Badge.Root decorative />
  </div>

  <p class="hint">
    Three accessible-name shapes: <strong>text content</strong>, count + <code>aria-label</code>,
    <code>decorative</code> (rendered with <code>aria-hidden="true"</code>). The chrome above is one
    consumer-CSS rule — Layer 4 ships <strong>no styling</strong>. Visual variants such as
    <em>info</em> / <em>success</em> / <em>error</em> live in
    <code>@kumiki/atelier/badge</code> (Layer 5) or your own stylesheet.
  </p>
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
    gap: 12px;
    flex-wrap: wrap;
  }
  .row :global(span) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    padding: 2px 10px;
    border-radius: 12px;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    font-size: 12px;
    font-weight: 600;
  }
  .row :global(span[data-decorative]) {
    width: 10px;
    min-width: 10px;
    height: 10px;
    padding: 0;
    border-radius: 50%;
    background: var(--k-shu);
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
    color: var(--k-matcha);
  }
</style>
