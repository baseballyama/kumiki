<script lang="ts">
  import { Content } from '@kumiki/components/date-picker';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type CalendarArgs = {
    locale: string;
    selectDate: (date: CalendarDate) => void;
    value: CalendarDate | null;
  };
  type Props = {
    calendar?: Snippet<[CalendarArgs]>;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Content class={`kumiki-datepicker-content ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Content>

<style>
  :global(.kumiki-datepicker-content) {
    --kumiki-datepicker-bg: white;
    --kumiki-datepicker-border: hsl(220 10% 86%);

    z-index: 50;
    padding: 0.75rem;
    background: var(--kumiki-datepicker-bg);
    border: 1px solid var(--kumiki-datepicker-border);
    border-radius: 6px;
    box-shadow: 0 8px 24px hsl(0 0% 0% / 0.12);
    outline: none;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-datepicker-content) {
      --kumiki-datepicker-bg: hsl(220 10% 14%);
      --kumiki-datepicker-border: hsl(220 10% 28%);
    }
  }
</style>
