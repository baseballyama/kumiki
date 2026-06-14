<!--
  @component Calendar.Root — owns the controller and shares it via context.

  Single-date selection. Range selection lands in Phase 2.1.

  Bindable props:
  - `value` → currently selected date (`CalendarDate | null`).
  - `focusedDate` → currently focused day cell (`CalendarDate`).

  Plain props:
  - `defaultValue`: uncontrolled initial selection.
  - `defaultFocusedDate`: uncontrolled initial focus (defaults to today).
  - `minValue` / `maxValue`: inclusive bounds.
  - `isDateUnavailable`: predicate for marking dates unavailable.
  - `disabled`: disables interaction.
  - `direction`: `'ltr'` (default) or `'rtl'`.
  - `onSelect`: called when the user selects a date.
  - `onFocusChange`: called when focus moves to a new date.

  See https://www.w3.org/WAI/ARIA/apg/patterns/grid/ — the Date Picker uses
  the Grid pattern for keyboard nav across day cells.
-->
<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
  import {
    createCalendar,
    type CalendarController,
    type IsDateUnavailable,
  } from '@kumiki/headless/calendar';
  import { CALENDAR_CONTEXT_KEY, type CalendarContextValue } from './context.js';

  type Props = {
    value?: CalendarDate | null;
    defaultValue?: CalendarDate | null;
    focusedDate?: CalendarDate;
    defaultFocusedDate?: CalendarDate;
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    isDateUnavailable?: IsDateUnavailable | null;
    disabled?: boolean;
    direction?: 'ltr' | 'rtl';
    /** BCP-47 locale for day-cell accessible names. Defaults to `'en-US'`. */
    locale?: string;
    onSelect?: (date: CalendarDate) => void;
    onFocusChange?: (date: CalendarDate) => void;
    id?: string;
    children: Snippet;
  };

  let {
    value = $bindable(undefined),
    defaultValue = null,
    focusedDate = $bindable(undefined),
    defaultFocusedDate,
    minValue = null,
    maxValue = null,
    isDateUnavailable = null,
    disabled = false,
    direction = 'ltr',
    locale = 'en-US',
    onSelect,
    onFocusChange,
    id,
    children,
  }: Props = $props();

  const initialFocused: CalendarDate = untrack(
    () => focusedDate ?? defaultFocusedDate ?? value ?? defaultValue ?? today(getLocalTimeZone()),
  );

  const controller: CalendarController = untrack(() =>
    createCalendar({
      focusedDate: initialFocused,
      selectedDate: value ?? defaultValue,
      minValue,
      maxValue,
      isDateUnavailable,
      disabled,
      direction,
      locale,
      id,
      onSelect: (date) => {
        value = date;
        onSelect?.(date);
      },
      onFocusChange: (date) => {
        focusedDate = date;
        onFocusChange?.(date);
      },
    }),
  );

  setContext<CalendarContextValue>(CALENDAR_CONTEXT_KEY, { controller });

  // Mirror controller state so descendants can react.
  let snapFocused = $state<CalendarDate>(controller.focusedDate);
  let snapSelected = $state<CalendarDate | null>(controller.selectedDate);

  const unsub = controller.subscribe(({ context }) => {
    snapFocused = context.focusedDate;
    snapSelected = context.selectedDate;
  });
  onDestroy(unsub);

  // Reflect controlled prop changes.
  $effect(() => {
    if (value !== undefined) {
      const same =
        (value === null && controller.selectedDate === null) ||
        (value !== null &&
          controller.selectedDate !== null &&
          value.compare(controller.selectedDate) === 0);
      if (!same) controller.setValue(value);
    }
  });
  $effect(() => {
    if (focusedDate !== undefined && controller.focusedDate.compare(focusedDate) !== 0) {
      controller.focus(focusedDate);
    }
  });
  $effect(() => {
    if (disabled !== controller.disabled) controller.setDisabled(disabled);
  });
  // FIX A: reactively propagate constraint changes to the machine so that
  // changing minValue/maxValue/isDateUnavailable after mount takes effect.
  $effect(() => {
    const ctx = controller.context;
    const minChanged =
      minValue !== ctx.minValue &&
      !(minValue === null
        ? ctx.minValue === null
        : ctx.minValue !== null && minValue.compare(ctx.minValue) === 0);
    const maxChanged =
      maxValue !== ctx.maxValue &&
      !(maxValue === null
        ? ctx.maxValue === null
        : ctx.maxValue !== null && maxValue.compare(ctx.maxValue) === 0);
    // Compare isDateUnavailable by reference — function identity.
    const fnChanged = isDateUnavailable !== ctx.isDateUnavailable;
    if (minChanged || maxChanged || fnChanged) {
      controller.setConstraints({ minValue, maxValue, isDateUnavailable });
    }
  });
</script>

{@render children()}
