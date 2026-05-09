<!--
  @component Toggle.GroupItem — a button child of `<Toggle.Group>`.

  Reads selection / roving-tabindex / disabled state from the group context
  and writes back via Space/Enter/click. Arrow keys + Home/End are intercepted
  here and handed to the group coordinator.

  Required props:
  - `value` — string identifier passed back via the group's `onValueChange`.

  Optional props:
  - `disabled` — disables this item only. The group's `disabled` overrides it.

  ARIA:
  - In `mode='multiple'`: `aria-pressed` mirrors selection.
  - In `mode='single'` : `role='radio'` + `aria-checked` mirrors selection.

  Snippets:
  - `children` — visible button label.
-->
<script lang="ts">
  import { getContext, untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import { TOGGLE_GROUP_CONTEXT_KEY, type ToggleGroupContext } from './group-context.js';

  type Props = {
    value: string;
    disabled?: boolean;
    children?: Snippet;
    /** Extra props (`class`, `style`, `data-*`, `aria-label`, …) forwarded to `<button>`. */
    [key: string]: unknown;
  };

  let { value, disabled = false, children, ...rest }: Props = $props();

  const ctxOptional = getContext<ToggleGroupContext | undefined>(TOGGLE_GROUP_CONTEXT_KEY);
  if (!ctxOptional) {
    throw new Error('<Toggle.GroupItem> must be a descendant of <Toggle.Group>.');
  }
  const ctx: ToggleGroupContext = ctxOptional;

  const effectiveDisabled = $derived(disabled || ctx.disabled);
  const selected = $derived(ctx.isSelected(value));
  const tabStop = $derived(ctx.isTabStop(value));

  function handleClick(event: MouseEvent): void {
    if (effectiveDisabled) {
      event.preventDefault();
      return;
    }
    ctx.toggle(value);
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (effectiveDisabled) return;
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        ctx.focusRelative(value, 'next');
        return;
      case 'ArrowLeft':
        event.preventDefault();
        ctx.focusRelative(value, 'prev');
        return;
      case 'Home':
        event.preventDefault();
        ctx.focusRelative(value, 'first');
        return;
      case 'End':
        event.preventDefault();
        ctx.focusRelative(value, 'last');
        return;
      case 'Enter':
      case ' ': {
        // Native <button> already toggles on click for Space/Enter, but we want
        // Enter to behave consistently in single mode (select rather than form-submit).
        event.preventDefault();
        ctx.toggle(value);
        return;
      }
    }
  }

  function handleFocus(): void {
    if (effectiveDisabled) return;
    ctx.notifyFocus(value);
  }

  function attach(node: HTMLButtonElement) {
    return untrack(() => ctx.register(value, node, effectiveDisabled));
  }

  $effect(() => {
    const v = value;
    const d = effectiveDisabled;
    untrack(() => ctx.setItemDisabled(v, d));
  });
</script>

<button
  {...rest}
  type="button"
  role={ctx.mode === 'single' ? 'radio' : undefined}
  aria-pressed={ctx.mode === 'multiple' ? (selected ? 'true' : 'false') : undefined}
  aria-checked={ctx.mode === 'single' ? (selected ? 'true' : 'false') : undefined}
  aria-disabled={effectiveDisabled ? 'true' : undefined}
  data-state={selected ? 'on' : 'off'}
  data-disabled={effectiveDisabled ? '' : undefined}
  tabindex={tabStop ? 0 : -1}
  onclick={handleClick}
  onkeydown={handleKeydown}
  onfocus={handleFocus}
  {@attach attach}
>
  {#if children}{@render children()}{/if}
</button>
