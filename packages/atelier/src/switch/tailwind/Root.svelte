<!--
  @component @kumiki/atelier/switch Tailwind variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/switch';

  type Props = {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    class?: string;
    [k: string]: unknown;
  };

  let { checked = $bindable(undefined), class: className = '', ...rest }: Props = $props();
</script>

<Root bind:checked {...rest}>
  {#snippet child({ props, attachment })}
    <button
      {...props}
      {@attach attachment}
      class={`relative inline-flex h-[1.375rem] w-[2.375rem] shrink-0 cursor-pointer items-center rounded-full border-0 shadow-[inset_0_1px_1px_rgb(0_0_0_/_0.06)] transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white data-[state=checked]:bg-orange-600 data-[state=checked]:shadow-[inset_0_1px_1px_rgb(0_0_0_/_0.10),0_1px_2px_rgb(67_56_202_/_0.18)] data-[state=unchecked]:bg-slate-300 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:focus-visible:ring-offset-slate-950 dark:data-[state=checked]:bg-orange-500 dark:data-[state=unchecked]:bg-slate-700 motion-reduce:transition-none ${className}`.trim()}
    >
      <span
        class="pointer-events-none inline-block h-[1.0625rem] w-[1.0625rem] translate-x-[0.1875rem] transform rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0_/_0.18),0_1px_1px_rgb(0_0_0_/_0.06)] ring-0 transition-transform duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[state=checked]:translate-x-[1.125rem] motion-reduce:transition-none"
        data-state={props['data-state']}
      ></span>
    </button>
  {/snippet}
</Root>
