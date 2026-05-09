<!--
  @component Toolbar.Root — `<div role="toolbar">` wrapper with roving tabindex.

  APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

  Toolbar gets one tab stop (the first enabled item, or the last-focused one
  if the user has previously interacted). Within the toolbar, Arrow keys move
  focus between items.

  - `orientation="horizontal"` (default): ArrowLeft / ArrowRight (RTL inverted).
  - `orientation="vertical"`: ArrowUp / ArrowDown.

  Required props:
  - `aria-label` or `aria-labelledby` — accessible name for the toolbar.

  Optional:
  - `orientation` — default `'horizontal'`.
  - `disabled` — disables every child item.

  No state machine, no headless layer. The roving-tabindex coordinator is
  pure DOM bookkeeping; lifting it into a Layer 2 FSM would not save bytes
  and would add an indirection nobody benefits from.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { ToolbarOrientation } from './context.js';

  type BaseProps = {
    orientation?: ToolbarOrientation;
    disabled?: boolean;
    id?: string;
    children: Snippet;
    /** Extra props (`class`, `style`, `data-*`, …) forwarded to the wrapper. */
    [key: string]: unknown;
  };

  type LabelProps = { 'aria-label': string } | { 'aria-labelledby': string };

  export type Props = BaseProps & LabelProps;
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { tryUseLocale } from '../locale-provider/index.js';
  import { TOOLBAR_CONTEXT_KEY, type ToolbarContextValue } from './context.js';

  let props: Props = $props();
  const orientation = $derived<ToolbarOrientation>(props.orientation ?? 'horizontal');
  const disabled = $derived(props.disabled ?? false);

  type Item = { node: HTMLElement; disabled: boolean };
  const items: Item[] = [];
  let tabStopNode = $state<HTMLElement | null>(null);

  const locale = tryUseLocale();
  const isRtl = $derived(locale?.dir === 'rtl');

  function ensureTabStop(): void {
    if (tabStopNode && items.some((i) => i.node === tabStopNode && !i.disabled)) return;
    const firstEnabled = items.find((i) => !i.disabled);
    tabStopNode = firstEnabled?.node ?? null;
  }

  function focusRelative(from: HTMLElement, direction: 'prev' | 'next' | 'first' | 'last'): void {
    const enabled = items.filter((i) => !i.disabled);
    if (enabled.length === 0) return;
    let target: Item | undefined;
    if (direction === 'first') target = enabled[0];
    else if (direction === 'last') target = enabled[enabled.length - 1];
    else {
      const idx = enabled.findIndex((i) => i.node === from);
      if (idx === -1) target = enabled[0];
      else if (direction === 'next') target = enabled[(idx + 1) % enabled.length];
      else target = enabled[(idx - 1 + enabled.length) % enabled.length];
    }
    if (!target) return;
    tabStopNode = target.node;
    target.node.focus();
  }

  const ctx: ToolbarContextValue = {
    get orientation() {
      return orientation;
    },
    register(node, itemDisabled) {
      const entry: Item = { node, disabled: itemDisabled || disabled };
      items.push(entry);
      ensureTabStop();
      return () => {
        const idx = items.indexOf(entry);
        if (idx >= 0) items.splice(idx, 1);
        if (tabStopNode === node) {
          tabStopNode = null;
          ensureTabStop();
        }
      };
    },
    setItemDisabled(node, itemDisabled) {
      const entry = items.find((i) => i.node === node);
      const next = itemDisabled || disabled;
      if (entry && entry.disabled !== next) {
        entry.disabled = next;
        if (next && tabStopNode === node) tabStopNode = null;
        ensureTabStop();
      }
    },
    isTabStop(node) {
      // Read-only: never mutate state from inside a $derived/derivedExpression.
      // `ensureTabStop()` is called from register/setItemDisabled where mutation
      // is safe.
      return node !== null && tabStopNode === node;
    },
    notifyFocus(node) {
      tabStopNode = node;
    },
    focusRelative(from, dir) {
      // Toolbar Items intercept the orientation-correct arrow keys and pass
      // the logical direction here. RTL flips horizontal traversal only.
      let resolved = dir;
      if (orientation === 'horizontal' && isRtl) {
        if (dir === 'prev') resolved = 'next';
        else if (dir === 'next') resolved = 'prev';
      }
      focusRelative(from, resolved);
    },
  };

  setContext<ToolbarContextValue>(TOOLBAR_CONTEXT_KEY, ctx);

  const wrapperProps = $derived.by(() => {
    const {
      orientation: _orientation,
      disabled: _disabled,
      id: _id,
      children: _children,
      ...rest
    } = props as Record<string, unknown>;
    void _orientation;
    void _disabled;
    void _id;
    void _children;
    return rest;
  });
</script>

<div
  {...wrapperProps}
  id={props.id}
  role="toolbar"
  aria-orientation={orientation}
  aria-disabled={disabled ? 'true' : undefined}
  data-orientation={orientation}
  data-disabled={disabled ? '' : undefined}
>
  {@render props.children()}
</div>
