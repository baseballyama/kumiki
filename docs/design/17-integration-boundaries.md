# 17 — Integration boundaries

This doc names the things kumiki **does not** ship and explains how
consumers integrate them. It is the answer to "where do I draw the
line?" for design-system migrations onto kumiki.

The boundaries are durable — established by [ADR 0014](16-decisions/0014-icon-strategy.md),
[ADR 0015](16-decisions/0015-table-primitive-scope.md), and
[ADR 0016](16-decisions/0016-editor-dnd-out-of-scope.md). They are not
"yet to be shipped" — they are intentional non-goals.

## 17.1 The boundary map

| Surface                 | Kumiki ships                                                                    | Kumiki does NOT ship                                                                                      | Recommended pairing                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Icons                   | Snippet slots on every component that needs a glyph                             | An icon set; a peer-dep on a specific library                                                             | [Lucide](https://lucide.dev/), [Heroicons](https://heroicons.com/), or app's own SVG sprite                                                                                                 |
| Rich-text editing       | Toolbar (Phase 1.5, APG `toolbar`), Toggle, Menu, Tooltip, Popover              | Editor / `contenteditable` semantics, schema, marks, collaborative edit                                   | [Tiptap](https://tiptap.dev/), [Lexical](https://lexical.dev/), [ProseMirror](https://prosemirror.net/)                                                                                     |
| Drag-and-drop           | Button (drag handle), List markup                                               | Drag/drop primitives; live-region announcements during drag; touch-vs-pointer parity                      | [dnd-kit-svelte](https://github.com/HanielU/dnd-kit-svelte), [SortableJS](https://sortablejs.github.io/Sortable/)                                                                           |
| Data Grid (virtualized) | Semantic Table (sort, select, tree rows, sticky)                                | Virtualized rows, cell editing, column resize/reorder/pin, server-pagination glue, `role="grid"` cell-nav | [TanStack Table](https://tanstack.com/table) (headless), [AG Grid](https://www.ag-grid.com/), [glide-data-grid](https://grid.glideapps.com/)                                                |
| Charting / data viz     | (nothing)                                                                       | All of it                                                                                                 | [LayerChart](https://layerchart.com/), [D3](https://d3js.org/), [observable plot](https://observablehq.com/plot/)                                                                           |
| Forms — wire format     | Standard Schema input (ADR 0004)                                                | A specific validator; form-state library                                                                  | [zod](https://zod.dev/) ≥ 3.24, [valibot](https://valibot.dev/), [arktype](https://arktype.io/) (all expose `~standard`); for form state: [sveltekit-superforms](https://superforms.rocks/) |
| Routing / SSR           | (nothing)                                                                       | Routing, hydration                                                                                        | [SvelteKit](https://kit.svelte.dev/)                                                                                                                                                        |
| Theming runtime         | CSS variable contract per component (`docs/design/18-css-variable-contract.md`) | A theme-switching mechanism, dark-mode toggling                                                           | App's choice — `data-theme` attribute, `prefers-color-scheme`, [mode-watcher](https://github.com/svecosystem/mode-watcher)                                                                  |

## 17.2 Editor — the recipe

The kumiki view of an editor: **the toolbar is in scope; the editor
itself is not.**

```svelte
<script lang="ts">
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { Toolbar, Toggle, Menu, Tooltip } from '@kumiki/components';
  import BoldIcon from '~icons/lucide/bold';
  import ItalicIcon from '~icons/lucide/italic';

  let editorEl: HTMLDivElement;
  let editor = $state<Editor | null>(null);

  $effect(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [StarterKit],
    });
    return () => editor?.destroy();
  });
</script>

<Toolbar.Root aria-label="Formatting">
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Toggle.Root
        aria-label="Bold"
        pressed={editor?.isActive('bold') ?? false}
        onPressedChange={() => editor?.chain().focus().toggleBold().run()}
      >
        {#snippet icon()}<BoldIcon />{/snippet}
      </Toggle.Root>
    </Tooltip.Trigger>
    <Tooltip.Content>Bold (Ctrl+B)</Tooltip.Content>
  </Tooltip.Root>

  <Toggle.Root
    aria-label="Italic"
    pressed={editor?.isActive('italic') ?? false}
    onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
  >
    {#snippet icon()}<ItalicIcon />{/snippet}
  </Toggle.Root>

  <Menu.Root>
    <Menu.Trigger>Heading</Menu.Trigger>
    <Menu.Content>
      <Menu.Item onSelect={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        >H1</Menu.Item
      >
      <Menu.Item onSelect={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >H2</Menu.Item
      >
    </Menu.Content>
  </Menu.Root>
</Toolbar.Root>

<div bind:this={editorEl} class="editor-content" />
```

**What kumiki gives you here:** Toolbar's roving tabindex; Toggle's
`aria-pressed` plumbing; Menu's open/close FSM; Tooltip's delay and
`prefers-reduced-motion` handling; type-level accessible-name
enforcement on icon-only Toggles.

**What kumiki does _not_ do:** anything inside the `<div
class="editor-content">`. Tiptap owns that completely.

## 17.3 Drag-and-drop — the recipe

```svelte
<script lang="ts">
  import { DndContext, type DragEndEvent } from '@dnd-kit-svelte/core';
  import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit-svelte/sortable';
  import { Button } from '@kumiki/components';
  import GripIcon from '~icons/lucide/grip-vertical';

  let items = $state<Item[]>(initial);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (active.id !== over?.id) {
      items = reorder(items, active.id, over.id);
    }
  }
</script>

<DndContext onDragEnd={onDragEnd}>
  <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
    <ul>
      {#each items as item (item.id)}
        <SortableRow {item} />
      {/each}
    </ul>
  </SortableContext>
</DndContext>

<!-- SortableRow.svelte -->
<script lang="ts">
  let { item } = $props();
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id: item.id });
</script>

<li use:setNodeRef style:transform={transform}>
  <Button.Root variant="ghost" {...attributes} {...listeners} aria-label={`Reorder ${item.label}`}>
    {#snippet icon()}<GripIcon />{/snippet}
  </Button.Root>
  {item.label}
</li>
```

The drag handle is a kumiki `Button` (with required `aria-label`
because it's icon-only). Everything DnD-specific is dnd-kit. Live-region
announcements during drag are dnd-kit's responsibility — kumiki's only
contribution is the trigger semantics.

## 17.4 Data Grid — when kumiki Table is not enough

Use kumiki Table when:

- You can render every row up front, or paginate server-side (≤ ~500 rows / page).
- Sorting is column-level and single-column.
- Selection is row-level (single or multi).
- Tree rows are at most a few levels deep.

Use TanStack Table (or AG Grid for true enterprise) when:

- You need virtualized rows (10k+ rows).
- You need cell editing, column resize / reorder / pin / freeze.
- You need filter UIs that participate in a table state model.
- You need pivot / aggregate rows.
- You need `role="grid"` cell-keyboard-navigation (arrow keys move
  between cells).

The migration shape we recommend: keep kumiki for the **surrounding
controls** (Combobox column filters, Pagination, the row checkboxes
themselves rendered through `Checkbox`) and let TanStack own the
table state.

```svelte
<!-- TanStack table wired with kumiki controls -->
<Combobox.Root options={columns} bind:value={visibleColumns}>...</Combobox.Root>

<table>
  <thead>
    {#each table.getHeaderGroups() as group}
      <tr>{#each group.headers as header}<th>{...}</th>{/each}</tr>
    {/each}
  </thead>
  <tbody>
    {#each table.getRowModel().rows as row}
      <tr>
        <td><Checkbox.Root checked={row.getIsSelected()} onCheckedChange={row.toggleSelected} /></td>
        {#each row.getVisibleCells() as cell}<td>{...}</td>{/each}
      </tr>
    {/each}
  </tbody>
</table>

<Pagination.Root
  page={table.getState().pagination.pageIndex + 1}
  pageCount={table.getPageCount()}
  onPageChange={(p) => table.setPageIndex(p - 1)}
>
  ...
</Pagination.Root>
```

## 17.5 Forms — what kumiki ships and what it doesn't

kumiki ships:

- `FormField.Root` — Label / Input / Description / Errors composition with id-wiring.
- Standard Schema integration (ADR 0004) — any validator that exposes `~standard`.
- Per-input components (`Combobox`, `DatePicker`, `Checkbox`, `Switch`, `RadioGroup`, `NumberField`, `TimeField`, `DateTimeField`).

kumiki does **not** ship:

- Form-state aggregation (touched / dirty / submit / reset / nested).
- Server-action integration.
- Field arrays / wizard / multi-step flows.

The pairing recommendation: use [`sveltekit-superforms`](https://superforms.rocks/)
for form state if you're on SvelteKit; the Standard Schema integration
in superforms accepts kumiki-compatible validators directly.

## 17.6 Things explicitly **not** out of scope (anchor list)

To avoid the inverse confusion ("is X out of scope?"):

- **Toolbar** — in scope (Phase 1.5, APG `toolbar`).
- **Tree** — in scope as a future component (Phase 2 candidate; needed by Sidebar).
- **Sidebar** — in scope as a future component (Phase 2 candidate; composes Tree + Disclosure).
- **FileInput** — in scope as a future component (Phase 2 candidate; the _input_ is in scope, the multi-file _drag-drop zone_ is not).
- **Toolbar nested-menu / split button** — in scope (Phase 2 candidate).

## 17.7 References

- ADR 0014 — Icon strategy.
- ADR 0015 — Table scope.
- ADR 0016 — Editor / DnD out-of-scope.
- `15-roadmap.md` §15.5b (Phase 1.5), §15.8 (deferred).
