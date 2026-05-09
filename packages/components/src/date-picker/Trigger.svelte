<!--
  @component DatePicker.Trigger — the button that opens the popover.

  Renders the formatted current value (or placeholder) by default;
  pass `children` to fully control the visual content.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import * as Popover from '../popover/index.js';
  import { DATE_PICKER_CONTEXT_KEY, type DatePickerContextValue } from './context.js';

  type Props = {
    children?: Snippet<[label: string]>;
    class?: string;
    [k: string]: unknown;
  };

  let { children, class: className = '', ...rest }: Props = $props();

  const ctx = getContext<DatePickerContextValue>(DATE_PICKER_CONTEXT_KEY);

  const label = $derived.by(() => {
    if (ctx.value === null) return ctx.placeholder;
    const fmt = new Intl.DateTimeFormat(ctx.locale, ctx.displayFormat);
    return fmt.format(new Date(ctx.value.year, ctx.value.month - 1, ctx.value.day));
  });
</script>

<Popover.Trigger class={className} {...rest}>
  {#if children}{@render children(label)}{:else}{label}{/if}
</Popover.Trigger>
