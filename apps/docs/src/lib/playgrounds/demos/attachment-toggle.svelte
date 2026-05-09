<script lang="ts">
  // Demonstrates Layer 3 — using `createToggle()` + `{@attach}` directly on a button.
  import { createToggle } from '@kumiki/headless/toggle';

  const t = createToggle({ initial: false });
  let pressedDisplay = $state(t.pressed);

  // Mirror controller state into local $state so the template re-renders.
  t.subscribe(({ context }) => {
    pressedDisplay = context.pressed;
  });
</script>

<div class="demo">
  <button type="button" {@attach t.root}>{pressedDisplay ? 'On' : 'Off'}</button>
  <p>pressed = <code>{pressedDisplay}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
  }
  button {
    padding: 10px 18px;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 8px;
    font: inherit;
    cursor: pointer;
    min-width: 80px;
  }
  /* The attachment paints `aria-pressed` after mount; Svelte's CSS scoping can't
     see the dynamic attribute, so we mark this selector :global() to keep it. */
  :global(button[aria-pressed='true']) {
    background: var(--k-shu);
    border-color: var(--k-shu);
    color: white;
  }
  p {
    color: var(--k-ink-3);
    font-size: 14px;
    margin-top: 16px;
  }
  code {
    color: var(--k-matcha);
  }
</style>
