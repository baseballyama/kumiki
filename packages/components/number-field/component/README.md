# @kumiki/component-number-field

Compound Svelte 5 components (Layer 4) for the NumberField (spin button)
component — `Root` + `Input` + `Increment` + `Decrement`.

```svelte
<script lang="ts">
  import { Root, Input, Increment, Decrement } from '@kumiki/component-number-field';

  let value = $state(5);
</script>

<Root bind:value min={0} max={10} step={1}>
  <Decrement>−</Decrement>
  <Input aria-label="Quantity" />
  <Increment>+</Increment>
</Root>
```

See [APG Spin Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/).
