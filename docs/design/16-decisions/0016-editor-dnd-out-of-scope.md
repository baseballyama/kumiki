# ADR 0016 — Rich-text editor and drag-and-drop are out of kumiki scope

**Status:** Accepted
**Date:** 2026-05-09

## Context

Two surfaces appear repeatedly in business UIs and in the flyle-nexus
design system specifically:

1. **Rich-text editor** — `editor/editor-field` in flyle, almost
   certainly tiptap-backed. Toolbar, content-editable, mark/node
   schemas, collaborative-edit hooks.
2. **Drag-and-drop sortable list** — `sortable` in flyle, using
   `sortablejs` directly.

Both already appear in [`15-roadmap.md`](../15-roadmap.md) §15.8 as
deferred items:

> | Rich text editor primitives | Scope blow-out. Out of vision. |
> | Drag-and-drop primitives | Phase 3+ if at all. |

But "deferred" leaves room for ambiguity — every quarter someone asks
"can we land a small one?" The migration target (flyle) ships both
today, so the question gets sharper: do we accept them eventually, or
formally close the door?

## Decision

**Both are intentionally outside kumiki, permanently.** Not "deferred";
**out of scope.** This ADR replaces the §15.8 row for these two items
with a stronger statement.

### Why a hard line, not a soft "later"

**Rich-text editor.** The accessibility surface for an editor (caret
behavior, screen-reader text-attribute announcements, IME composition,
inline-formula a11y) is multi-year work. Tiptap, Lexical, ProseMirror,
TinyMCE all employ dedicated editor teams. Kumiki's positioning —
_minimal, test-heavy, single-maintainer-survivable_ — cannot absorb
that surface without compromising the rest.

**Drag-and-drop.** A11y-correct DnD requires:

- Pointer + keyboard + touch + screen-reader-virtual-cursor parity.
- Live-region announcements at every reorder step.
- Cross-list moves with predictable focus management.
- Long-press / motor-impairment alternatives.

dnd-kit (React) ships ~14 KB and took a year to reach parity with
mouse-only libraries. Re-implementing it in Svelte to kumiki's quality
bar is at minimum a quarter of focused work, with a maintenance cost
that competes with everything else in §15.6 / §15.7.

The **opportunity cost** is the load-bearing reason. We can ship 5
new accessible primitives in the time it would take to ship one
production-grade editor toolbar or one production-grade drag handle.

### What kumiki _does_ offer instead — integration recipes

Both features are **composable** with kumiki primitives the consumer
already has. The integration-boundary doc
([`docs/design/17-integration-boundaries.md`](../17-integration-boundaries.md))
documents the recommended shape:

#### Editor toolbar pattern

```svelte
<!-- consumer's tiptap wrapper -->
<Toolbar.Root aria-label="Formatting">
  <Toggle.Root pressed={editor.isActive('bold')} onPressedChange={...}>
    {#snippet icon()}<BoldIcon />{/snippet}
  </Toggle.Root>
  <Toggle.Root pressed={editor.isActive('italic')} onPressedChange={...}>
    {#snippet icon()}<ItalicIcon />{/snippet}
  </Toggle.Root>
  <Menu.Root>...heading levels...</Menu.Root>
</Toolbar.Root>

<div bind:this={editorEl} class="editor-content"></div>
```

What kumiki ships: the `Toggle`, `Menu`, `Tooltip`, eventually `Toolbar`
(tracked separately as a Phase 2 candidate — APG `toolbar` pattern,
roving tabindex). What flyle keeps: tiptap binding, content-editable,
schema, collaborative-edit hooks.

#### Sortable list pattern

```svelte
<!-- consumer's sortablejs binding -->
<ul use:sortable={{ onEnd: handleReorder }}>
  {#each items as item (item.id)}
    <li>
      <Button.Root variant="ghost">
        {#snippet icon()}<GripIcon />{/snippet}
        <span class="sr-only">Drag to reorder</span>
      </Button.Root>
      {item.label}
    </li>
  {/each}
</ul>
```

The drag-handle is a kumiki Button with the consumer's chosen DnD
library handling the actual drag. Kumiki provides nothing for this
beyond the controls around it.

### Items that are **adjacent but in scope**

Three patterns are tempting to confuse with editor / DnD but are
explicitly **in** scope:

| Pattern                | In scope as                                                                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Toolbar**            | Phase 2 candidate component. Roving tabindex, APG toolbar pattern. Used by editors and elsewhere.                                                                                                          |
| **Listbox reordering** | A future `withReorder` composer on `Combobox`/`Listbox` for keyboard-only reorder via Alt+Arrow. Phase 3.                                                                                                  |
| **File upload UI**     | A future `FileInput` component (Phase 2 candidate). The progress / list / cancel UI is a candidate; the multi-file drag-drop _zone_ is not (uses native drop events; no a11y benefit from a kumiki layer). |

These are each tracked individually; this ADR does not commit to them.

## Alternatives considered

| Option                                                            | Verdict                                                                                                                                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ship a minimal editor (e.g. textarea + toolbar)                   | ❌ Either it's just a textarea (no value) or it grows into a real editor (scope blow-out). No middle ground that adds value without owning a multi-year a11y surface.   |
| Ship a minimal DnD (`useDraggable` / `useDropTarget` primitives)  | ❌ Same trap as React's pre-dnd-kit landscape — primitives that don't solve a11y end up worse than no library at all, because consumers think the a11y is handled.      |
| Recommend specific libraries officially (tiptap + dnd-kit-svelte) | 🟡 Done loosely in the boundary doc; not a hard endorsement, since either can be swapped (lexical, prosemirror, sortablejs, etc.) without affecting kumiki integration. |
| **Close the door and document recipes** (chosen)                  | ✅ Honest about scope. Consumers know where to invest. Maintainers know what to say no to.                                                                              |

## Consequences

**Easier:**

- Roadmap discipline: any future "should we ship X editor primitive?"
  question has a written answer.
- flyle migration is unambiguous: editor stays in flyle, sortable stays
  in flyle, both compose kumiki primitives around them.
- Bundle budgets stay defended — neither feature lands surprise bytes.

**Harder:**

- Kumiki cannot claim "all-in-one design system." That's a positioning
  call we made early (`01-vision.md`) and re-affirm here.
- Migration guides must explicitly recommend tiptap / sortablejs (or
  alternatives) by name. This couples documentation to third-party
  ecosystems' churn.

## References

- [`docs/design/01-vision.md`](../01-vision.md) — kumiki positioning.
- [`docs/design/15-roadmap.md`](../15-roadmap.md) §15.8 — to be updated
  to point at this ADR for the editor / DnD rows.
- [`docs/design/17-integration-boundaries.md`](../17-integration-boundaries.md)
  — recipes for tiptap, sortablejs, dnd-kit-svelte, TanStack Table.
- WAI-ARIA APG: [Toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) — the in-scope adjacent piece.
