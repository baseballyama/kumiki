<!--
  @component DateTimeField.DatePart — pre-wired DatePicker for the date half.

  Renders `<DatePicker.Root><DatePicker.Trigger /><DatePicker.Content /></DatePicker.Root>`
  with `value` / `onValueChange` already bridged to the surrounding
  DateTimeField context. Consumers who want full control over the trigger /
  content markup should use `<DatePicker.*>` directly inside the field.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { CalendarDate } from '@internationalized/date';
  import * as DatePicker from '../date-picker/index.js';
  import { DATETIME_FIELD_CONTEXT_KEY, type DateTimeFieldContextValue } from './context.js';

  type Props = {
    locale?: string;
    placeholder?: string;
    [key: string]: unknown;
  };

  let { locale, placeholder, ...rest }: Props = $props();

  const ctxOptional = getContext<DateTimeFieldContextValue | undefined>(DATETIME_FIELD_CONTEXT_KEY);
  if (!ctxOptional) {
    throw new Error('<DateTimeField.DatePart> must be inside <DateTimeField.Root>.');
  }
  const ctx: DateTimeFieldContextValue = ctxOptional;

  // Project the CalendarDateTime into a CalendarDate for the picker.
  const dateValue = $derived.by<CalendarDate | null>(() => {
    if (!ctx.value) return null;
    return new CalendarDate(ctx.value.year, ctx.value.month, ctx.value.day);
  });
</script>

<DatePicker.Root
  value={dateValue}
  onValueChange={(d) => ctx.setDate(d)}
  minValue={ctx.minValue}
  maxValue={ctx.maxValue}
  {locale}
  {placeholder}
  {...rest}
>
  <DatePicker.Trigger />
  <DatePicker.Content />
</DatePicker.Root>
