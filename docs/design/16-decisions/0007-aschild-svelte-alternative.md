# ADR 0007 — `child` snippet replaces `asChild`

**Status:** Accepted
**Date:** 2026-05

## Context

Radix UI introduced **`asChild`** as a render delegation pattern: the user's element is cloned with the library's props merged in. Implementation uses React's `cloneElement` and the `Slot` utility. Limitations:

- Single child requirement (`React.Children.only`) — fragments not allowed.
- Event handlers must be merged into wrapper functions — subtle ordering bugs.
- Type signatures are loose; the user's element type is not propagated.

Svelte 5's snippets are more powerful than React fragments and cleanly typed via `Snippet<[ArgTypes]>`. Bits UI v2 dropped `asChild` and replaced it with a **`child` snippet** that receives `props`. This is the established Svelte 5 idiom.

## Decision

Kumiki's render delegation uses the **`child` snippet pattern** introduced by Bits UI v2.

```svelte
<Combobox.Trigger>
  {#snippet child({ props })}
    <MyButton {...props}>Open</MyButton>
  {/snippet}
</Combobox.Trigger>
```

The component's default rendering is preserved if `child` is not provided:

```svelte
<Combobox.Trigger>Open</Combobox.Trigger> <!-- renders <button {...props}> -->
```

Where the component anchors floating content (Tooltip, Popover, Combobox listbox), the snippet additionally receives a `wrapperProps` to spread on a wrapper element so anchoring still works. Inspired by Bits UI's `child` snippet for floating content.

## Alternatives considered

| Option                                             | Verdict                                                                                       |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **`child` snippet** (chosen)                       | ✅ Type-safe, multi-element capable, Svelte 5 native                                          |
| Reimplement `asChild` via clone-equivalent         | ❌ Svelte has no `cloneElement`; would need DOM cloning, which loses types and event handlers |
| `<svelte:element this={tag}>` with prop forwarding | ❌ Forces user to express their custom component as a string tag; loses component composition |
| `as` prop                                          | ❌ Same forcing — user must pass the component type as a value                                |

## Consequences

**Easier:**

- The user's element/component type is preserved end-to-end. `MyButton {...props}` typechecks against `MyButton`'s actual prop shape.
- Multiple-element rendering is straightforward — no `React.Children.only` constraint.
- Event handler ordering is explicit: the user spreads `props.onclick`, etc. — no merge magic.
- Floating-anchored components pass a `wrapperProps` cleanly.

**Harder:**

- Users coming from React-Radix have a small learning curve. Mitigation: the docs site has a "Migrating from Radix" page (Phase 1).
- Type definitions must list every prop that gets handed to the user. We pay for that explicitness once per component; it makes API contracts visible.

## Reference shape

Every Layer 4 component that can delegate rendering exposes:

```ts
type ChildPayload = {
  props: AllRequiredProps; // role, aria-*, onclick, onkeydown, …
  wrapperProps?: WrapperProps; // for floating-anchored content
  state?: ComponentState; // if useful for the child to inspect
};

type Props = {
  children?: Snippet; // default rendering
  child?: Snippet<[payload: ChildPayload]>;
};
```

Code template lives in `docs/components/_template.md`.

## References

- Bits UI v2 `child` snippet: https://bits-ui.com/docs/child-snippet
- Bits UI migration guide: https://bits-ui.com/docs/migration-guide
- Bryan Lee, "asChild in React, Svelte, Vue and Solid": https://medium.com/@bryanmylee/aschild-in-react-svelte-vue-and-solid-for-render-delegation-645c73650ced
- User's market research §2.1 (Bits UI snippet design as best practice).
