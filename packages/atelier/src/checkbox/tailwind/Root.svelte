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
    'inline-flex h-[1.0625rem] w-[1.0625rem] shrink-0 items-center justify-center rounded-[5px] border border-slate-300 bg-white text-white shadow-[0_1px_1px_rgb(0_0_0_/_0.04),inset_0_1px_0_rgb(255_255_255_/_0.6)] transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-slate-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 data-[state=checked]:shadow-[0_1px_2px_rgb(67_56_202_/_0.18),inset_0_1px_0_rgb(255_255_255_/_0.1)] data-[state=mixed]:bg-orange-600 data-[state=mixed]:border-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500 dark:data-[state=checked]:bg-orange-500 dark:data-[state=checked]:border-orange-500 dark:data-[state=mixed]:bg-orange-500 dark:data-[state=mixed]:border-orange-500 dark:focus-visible:ring-offset-slate-950 motion-reduce:transition-none';
</script>

<Root bind:value class={`${base} ${className}`.trim()} {...rest}>
  {#snippet child({ props, state, attachment })}
    <button {...props} class={`${base} ${className}`.trim()} {@attach attachment}>
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
