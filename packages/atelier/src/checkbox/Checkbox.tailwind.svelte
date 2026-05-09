<!--
  @component @kumiki/atelier/checkbox Tailwind variant.
-->
<script lang="ts">
  import { Root, type CheckboxValue } from '@kumiki/components/checkbox';

  type Props = {
    value?: CheckboxValue;
    defaultValue?: CheckboxValue;
    disabled?: boolean;
    onCheckedChange?: (value: CheckboxValue) => void;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), class: className = '', ...rest }: Props = $props();

  const base =
    'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-400 bg-white text-white transition-colors data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=mixed]:bg-slate-900 data-[state=mixed]:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:data-[state=checked]:bg-slate-100 dark:data-[state=checked]:border-slate-100 dark:data-[state=checked]:text-slate-900';
</script>

<Root bind:value class={`${base} ${className}`.trim()} {...rest}>
  {#snippet child({ props, state })}
    <button {...props} class={`${base} ${className}`.trim()}>
      {#if state.value === 'checked'}
        <svg
          viewBox="0 0 16 16"
          class="h-3 w-3"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8l3.5 3.5L13 5" />
        </svg>
      {:else if state.value === 'mixed'}
        <svg
          viewBox="0 0 16 16"
          class="h-3 w-3"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M3 8h10" />
        </svg>
      {/if}
    </button>
  {/snippet}
</Root>
