# @kumiki/component-popover

Compound Svelte 5 components (Layer 4) for the Popover (non-modal
disclosure) component — `Root` + `Trigger` + `Content` + `Close` +
`Title` + `Description`.

```svelte
<script lang="ts">
  import { Root, Trigger, Content, Close, Title, Description } from '@kumiki/component-popover';

  let open = $state(false);
</script>

<Root bind:open>
  <Trigger>Open menu</Trigger>
  <Content>
    <Title>Settings</Title>
    <Description>Configure your preferences.</Description>
    <Close>Done</Close>
  </Content>
</Root>
```

Popover is **non-modal**: focus is not trapped, the page stays
interactive. For modal disclosure use `@kumiki/component-dialog`.
