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
  {#snippet child({ props })}
    <button
      {...props}
      class={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-slate-300 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:data-[state=checked]:bg-slate-100 dark:data-[state=unchecked]:bg-slate-700 ${className}`.trim()}
    >
      <span
        class="pointer-events-none inline-block h-4 w-4 translate-x-0.5 transform rounded-full bg-white shadow ring-0 transition-transform data-[state=checked]:translate-x-[1.125rem] data-[state=unchecked]:translate-x-0.5"
        data-state={props['data-state']}
      ></span>
    </button>
  {/snippet}
</Root>
