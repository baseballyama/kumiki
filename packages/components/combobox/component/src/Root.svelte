<!--
  @component Combobox.Root — single-input combobox with a popup listbox.

  Generic over option type `T extends ComboboxOption`. The generic propagates
  to children via Svelte context (per docs/design/08-typescript.md §8.2).

  Behavior follows WAI-ARIA APG combobox pattern:
  https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

  This is the design-validation pilot per docs/design/15-roadmap.md §15.3 —
  the most complex Phase 1 component. If something here feels awkward, the
  rest of the API is on shaky ground.
-->
<script lang="ts" generics="T extends ComboboxOption">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createCombobox, type ComboboxController } from '@kumiki/attachment-combobox';
  import type { Snippet } from 'svelte';
  import {
    COMBOBOX_CONTEXT_KEY,
    type ComboboxContextValue,
    type ComboboxOption,
  } from './context.js';

  type Props = {
    /** Source list of options. Empty array is fine for async-only mode. */
    options?: ReadonlyArray<T>;
    /** Bindable selected value. Pass `null` for "no selection". */
    value?: T | null;
    /** Initial selection for uncontrolled mode. */
    defaultValue?: T | null;
    /** Initial query for uncontrolled mode. */
    defaultQuery?: string;
    /** Disabled state. */
    disabled?: boolean;
    /** Page step for PageUp/PageDown navigation. */
    pageSize?: number;
    /** Custom sync filter. Default: case-insensitive label substring match. */
    filter?: (options: ReadonlyArray<T>, query: string) => ReadonlyArray<T>;

    onValueChange?: (value: T | null) => void;
    onOpenChange?: (open: boolean) => void;
    onQueryChange?: (query: string) => void;

    /** Stable id override. Auto-generated if omitted. */
    id?: string;

    children: Snippet;
  };

  let {
    options = [] as ReadonlyArray<T>,
    value = $bindable(undefined),
    defaultValue = null,
    defaultQuery = '',
    disabled = false,
    pageSize,
    filter,
    onValueChange,
    onOpenChange,
    onQueryChange,
    id,
    children,
  }: Props = $props();

  const controller: ComboboxController<T> = untrack(() =>
    createCombobox<T>({
      options,
      defaultValue: value ?? defaultValue,
      defaultQuery,
      disabled,
      pageSize,
      filter,
      id,
      onValueChange: (next) => {
        value = next;
        onValueChange?.(next);
      },
      onOpenChange,
      onQueryChange,
    }),
  );

  // Mirror controller state into reactive locals so the template re-renders.
  let snapState = $state(controller.state);
  let snapValue = $state(controller.value);

  const unsub = controller.subscribe(({ state, context }) => {
    snapState = state;
    snapValue = context.value;
  });
  onDestroy(unsub);

  // Reflect controlled `value` updates back into the controller. We use the
  // programmatic `setValue` path so the listbox doesn't pop open in response.
  $effect(() => {
    if (value !== undefined && value !== controller.value) {
      controller.setValue(value);
    }
  });

  $effect(() => {
    if (disabled !== controller.disabled) {
      controller.setDisabled(disabled);
    }
  });

  // Keep options in sync if the parent prop changes (rare for sync mode).
  // Note: full options-list mutation also bumps the token. Matches expectation
  // that re-supplying options should re-filter.
  // We don't reach into the machine for this; instead, we rebuild filtered.
  // Phase 0c: revisit if a real use case needs runtime option swapping.

  setContext<ComboboxContextValue<T>>(COMBOBOX_CONTEXT_KEY, { controller });
</script>

<div
  data-component="combobox"
  data-state={snapState}
  data-has-value={snapValue ? '' : undefined}
  {@attach controller.root}
>
  {@render children()}
</div>
