<!--
  @component Toggle.Group — a row of Toggle buttons sharing keyboard navigation
  and a single selection model.

  Two modes:
  - `mode="multiple"` (default) → `role="group"`. Each child uses `aria-pressed`.
    `value` is `string[]` and may have any number of entries.
  - `mode="single"` → `role="radiogroup"`. Children use `aria-checked` and at
    most one is "on" at a time. Optional `allowDeselect` lets the user toggle
    the active item back to `null`.

  Roving tabindex: the group exposes a single tab stop (the active item or the
  first enabled item). Arrow keys move focus across enabled items. RTL inverts
  ArrowLeft/ArrowRight via `tryUseLocale()` — if no `<LocaleProvider>` is in
  the tree, LTR is assumed.

  Accessible name: required at the type level. Provide either `aria-label` or
  `aria-labelledby` on `<Toggle.Group>`.

  @see https://www.w3.org/WAI/ARIA/apg/patterns/radio/
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';

  type BaseProps = {
    disabled?: boolean;
    id?: string;
    children: Snippet;
    /** Extra props (`class`, `style`, `data-*`, …) forwarded to the wrapper element. */
    [key: string]: unknown;
  };

  type MultipleProps = BaseProps & {
    mode?: 'multiple';
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
  };

  type SingleProps = BaseProps & {
    mode: 'single';
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    /** Permit toggling the active item back to `null`. Default `false` (radio-like). */
    allowDeselect?: boolean;
  };

  type LabelProps = { 'aria-label': string } | { 'aria-labelledby': string };

  export type Props = (MultipleProps | SingleProps) & LabelProps;
</script>

<script lang="ts">
  import { setContext, untrack } from 'svelte';
  import { tryUseLocale } from '../locale-provider/index.js';
  import {
    TOGGLE_GROUP_CONTEXT_KEY,
    type ToggleGroupContext,
    type ToggleGroupMode,
  } from './group-context.js';

  let props: Props = $props();

  const mode = $derived<ToggleGroupMode>(props.mode ?? 'multiple');
  const disabled = $derived(props.disabled ?? false);

  // Selection model — controlled if `value` is supplied, otherwise uncontrolled.
  // The defaults are read once at mount; they are not meant to react.
  let multiSelectionState = $state<string[]>(
    untrack(() => {
      const dv = (props as MultipleProps).defaultValue;
      return Array.isArray(dv) ? [...dv] : [];
    }),
  );
  let singleSelectionState = $state<string | null>(
    untrack(() => (props as SingleProps).defaultValue ?? null),
  );

  const selection = $derived.by<string[] | string | null>(() => {
    if (mode === 'multiple') {
      const m = props as MultipleProps;
      return m.value ?? multiSelectionState;
    }
    const s = props as SingleProps;
    return s.value === undefined ? singleSelectionState : s.value;
  });

  function isSelected(value: string): boolean {
    if (mode === 'multiple') return (selection as string[]).includes(value);
    return (selection as string | null) === value;
  }

  function toggleValue(value: string): void {
    if (disabled) return;
    if (mode === 'multiple') {
      const current = selection as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      const m = props as MultipleProps;
      if (m.value === undefined) multiSelectionState = next;
      m.onValueChange?.(next);
    } else {
      const s = props as SingleProps;
      const current = selection as string | null;
      let next: string | null;
      if (current === value) {
        next = s.allowDeselect ? null : current;
      } else {
        next = value;
      }
      if (next === current) return;
      if (s.value === undefined) singleSelectionState = next;
      s.onValueChange?.(next);
    }
  }

  // ─── Roving tabindex coordinator ─────────────────────────────────────────
  type Item = { value: string; node: HTMLButtonElement; disabled: boolean };
  // Source-order list. Insertion order matches DOM order because each
  // GroupItem registers from inside its own `{@attach}` callback, which fires
  // top-down during mount.
  const items = $state<Item[]>([]);
  let tabStopValue = $state<string | null>(null);

  const locale = tryUseLocale();
  const isRtl = $derived(locale?.dir === 'rtl');

  function ensureTabStop(): void {
    if (tabStopValue && items.some((i) => i.value === tabStopValue && !i.disabled)) return;
    // Prefer the first selected enabled item; fall back to the first enabled item.
    const firstSelected = items.find((i) => !i.disabled && isSelected(i.value));
    const firstEnabled = items.find((i) => !i.disabled);
    tabStopValue = firstSelected?.value ?? firstEnabled?.value ?? null;
  }

  function focusRelative(from: string, direction: 'prev' | 'next' | 'first' | 'last'): void {
    const enabled = items.filter((i) => !i.disabled);
    if (enabled.length === 0) return;
    let target: Item | undefined;
    if (direction === 'first') target = enabled[0];
    else if (direction === 'last') target = enabled[enabled.length - 1];
    else {
      const idx = enabled.findIndex((i) => i.value === from);
      if (idx === -1) target = enabled[0];
      else if (direction === 'next') target = enabled[(idx + 1) % enabled.length];
      else target = enabled[(idx - 1 + enabled.length) % enabled.length];
    }
    if (!target) return;
    tabStopValue = target.value;
    target.node.focus();
  }

  const ctx: ToggleGroupContext = {
    get mode() {
      return mode;
    },
    get disabled() {
      return disabled;
    },
    isSelected,
    toggle: toggleValue,
    register(value, node, itemDisabled) {
      const entry: Item = { value, node, disabled: itemDisabled };
      items.push(entry);
      ensureTabStop();
      return () => {
        const idx = items.findIndex((i) => i === entry);
        if (idx >= 0) items.splice(idx, 1);
        if (tabStopValue === value) {
          tabStopValue = null;
          ensureTabStop();
        }
      };
    },
    setItemDisabled(value, itemDisabled) {
      const entry = items.find((i) => i.value === value);
      if (entry && entry.disabled !== itemDisabled) {
        entry.disabled = itemDisabled;
        if (itemDisabled && tabStopValue === value) {
          tabStopValue = null;
        }
        ensureTabStop();
      }
    },
    isTabStop(value) {
      // Read-only: state mutation inside a $derived is forbidden in Svelte 5.
      // `register` and `setItemDisabled` call `ensureTabStop()` for us.
      return tabStopValue === value;
    },
    notifyFocus(value) {
      tabStopValue = value;
    },
    focusRelative(from, dir) {
      // RTL flip: ArrowRight in RTL means "logical previous" (visually left).
      let resolved = dir;
      if (isRtl) {
        if (dir === 'prev') resolved = 'next';
        else if (dir === 'next') resolved = 'prev';
      }
      focusRelative(from, resolved);
    },
  };

  setContext<ToggleGroupContext>(TOGGLE_GROUP_CONTEXT_KEY, ctx);

  // Forward all unknown props to the wrapper, but strip the ones we own.
  const wrapperProps = $derived.by(() => {
    const {
      mode: _mode,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      allowDeselect: _allowDeselect,
      disabled: _disabled,
      id: _id,
      children: _children,
      ...rest
    } = props as Record<string, unknown>;
    void _mode;
    void _value;
    void _defaultValue;
    void _onValueChange;
    void _allowDeselect;
    void _disabled;
    void _id;
    void _children;
    return rest;
  });
</script>

<div
  {...wrapperProps}
  id={props.id}
  role={mode === 'single' ? 'radiogroup' : 'group'}
  data-mode={mode}
  data-disabled={disabled ? '' : undefined}
>
  {@render props.children()}
</div>
