<script lang="ts">
  // Bare-metal test: Layer 3 attachment directly on a vanilla <button>.
  // Used to isolate whether <Toggle.Root> (Layer 4) wiring is the cause when a
  // test fails — if this page works and the Layer 4 sandbox does not, the bug
  // is in Root.svelte; otherwise it's in attachment-toggle or upstream.
  import { createToggle } from '@kumiki/attachment-toggle';

  const t = createToggle({ initial: false, onPressedChange: (v) => console.log('changed:', v) });
</script>

<button data-testid="bare-toggle" type="button" {@attach t.root}>{t.pressed ? 'On' : 'Off'}</button>
