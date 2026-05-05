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
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 24px;
  }
  button {
    padding: 10px 18px;
    background: #1a1a2e;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    border-radius: 8px;
    font: inherit;
    cursor: pointer;
    min-width: 80px;
  }
  /* The attachment paints `aria-pressed` after mount; Svelte's CSS scoping can't
     see the dynamic attribute, so we mark this selector :global() to keep it. */
  :global(button[aria-pressed='true']) {
    background: #ff3e00;
    border-color: #ff3e00;
    color: white;
  }
  p {
    color: #888;
    font-size: 14px;
    margin-top: 16px;
  }
  code {
    color: #4fc08d;
  }
</style>
