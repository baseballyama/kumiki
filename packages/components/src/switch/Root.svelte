<!--
  @component Switch.Root — an on/off setting control.

  Default rendering: a native `<button role="switch">` with `aria-checked`.
  Provide the `child` snippet to render any element / component instead.

  Behavior follows WAI-ARIA APG switch pattern:
  https://www.w3.org/WAI/ARIA/apg/patterns/switch/

  Bindable props:
  - `checked`        → mirrors `aria-checked`. Bind for two-way control, or pass
                       `defaultChecked` for uncontrolled mode.

  Plain props:
  - `defaultChecked` → uncontrolled initial value.
  - `disabled`       → disables interaction; sets `aria-disabled`.
  - `onCheckedChange`→ user-initiated changes only.
-->
<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import { createSwitch, type SwitchController } from '@kumiki/headless/switch';
  import type { Attachment } from 'svelte/attachments';
  import type { Snippet } from 'svelte';

  type ChildPayload = {
    props: {
      type: 'button';
      role: 'switch';
      'aria-checked': 'true' | 'false';
      'aria-disabled': 'true' | undefined;
      'data-state': 'on' | 'off';
      'data-disabled': '' | undefined;
      id: string;
    };
    state: {
      checked: boolean;
      disabled: boolean;
    };
    /**
     * Attach to your rendered element via `{@attach attachment}` to wire
     * click / keyboard interactions and ARIA paint-on-change.
     */
    attachment: Attachment;
  };

  type Props = {
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    id?: string;
    children?: Snippet;
    child?: Snippet<[payload: ChildPayload]>;
    /** Extra props (`class`, `style`, `data-*`, …) forwarded to the root `<button>`. */
    [key: string]: unknown;
  };

  let {
    checked = $bindable(undefined),
    defaultChecked,
    disabled = false,
    onCheckedChange,
    id,
    children,
    child,
    ...rest
  }: Props = $props();

  const controller: SwitchController = untrack(() =>
    createSwitch({
      initial: checked ?? defaultChecked ?? false,
      disabled,
      id,
      onCheckedChange: (next) => {
        checked = next;
        onCheckedChange?.(next);
      },
    }),
  );

  let snapChecked = $state(controller.checked);
  let snapDisabled = $state(controller.disabled);

  const unsub = controller.subscribe(({ context, state }) => {
    snapChecked = context.checked;
    snapDisabled = state === 'disabled';
  });
  onDestroy(unsub);

  $effect(() => {
    if (checked !== undefined && checked !== controller.checked) {
      controller.set(checked);
    }
  });

  $effect(() => {
    if (disabled !== controller.disabled) {
      controller.setDisabled(disabled);
    }
  });

  const childProps = $derived<ChildPayload['props']>({
    type: 'button',
    role: 'switch',
    'aria-checked': snapChecked ? 'true' : 'false',
    'aria-disabled': snapDisabled ? 'true' : undefined,
    'data-state': snapChecked ? 'on' : 'off',
    'data-disabled': snapDisabled ? '' : undefined,
    id: controller.id,
  });
</script>

{#if child}
  {@render child({
    props: childProps,
    state: { checked: snapChecked, disabled: snapDisabled },
    attachment: controller.root,
  })}
{:else}
  <button
    {...rest}
    type="button"
    role="switch"
    aria-checked={snapChecked ? 'true' : 'false'}
    aria-disabled={snapDisabled ? 'true' : undefined}
    data-state={snapChecked ? 'on' : 'off'}
    data-disabled={snapDisabled ? '' : undefined}
    {@attach controller.root}
  >
    {#if children}{@render children()}{/if}
  </button>
{/if}
