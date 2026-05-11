<!--
  @component Checkbox.Root — a tri-state form checkbox.

  Default rendering: a native `<button role="checkbox">` with `aria-checked`
  set to one of `"true"`, `"false"`, or `"mixed"`. Provide the `child` snippet
  to render any element / component instead.

  Behavior follows the WAI-ARIA APG checkbox / tristate-checkbox patterns.

  Bindable props:
  - `value` → CheckboxValue ('unchecked' | 'checked' | 'mixed').

  Plain props:
  - `defaultValue` / `disabled` / `onCheckedChange`.
-->
<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import {
    createCheckbox,
    type CheckboxController,
    type CheckboxValue,
  } from '@kumiki/headless/checkbox';
  import type { Attachment } from 'svelte/attachments';
  import type { Snippet } from 'svelte';

  type ChildPayload = {
    props: {
      type: 'button';
      role: 'checkbox';
      'aria-checked': 'true' | 'false' | 'mixed';
      'aria-disabled': 'true' | undefined;
      'data-state': CheckboxValue;
      'data-disabled': '' | undefined;
      id: string;
    };
    state: {
      value: CheckboxValue;
      checked: boolean;
      indeterminate: boolean;
      disabled: boolean;
    };
    /**
     * Attach to your rendered element via `{@attach attachment}` to wire
     * click / keyboard interactions and ARIA paint-on-change.
     */
    attachment: Attachment;
  };

  type Props = {
    value?: CheckboxValue;
    defaultValue?: CheckboxValue;
    disabled?: boolean;
    onCheckedChange?: (value: CheckboxValue) => void;
    id?: string;
    children?: Snippet;
    child?: Snippet<[payload: ChildPayload]>;
    /** Extra props (`class`, `style`, `data-*`, …) forwarded to the root `<button>`. */
    [key: string]: unknown;
  };

  let {
    value = $bindable(undefined),
    defaultValue = 'unchecked',
    disabled = false,
    onCheckedChange,
    id,
    children,
    child,
    ...rest
  }: Props = $props();

  const controller: CheckboxController = untrack(() =>
    createCheckbox({
      initial: value ?? defaultValue,
      disabled,
      id,
      onCheckedChange: (next) => {
        value = next;
        onCheckedChange?.(next);
      },
    }),
  );

  let snapValue = $state<CheckboxValue>(controller.value);
  let snapDisabled = $state(controller.disabled);

  const unsub = controller.subscribe(({ context, state }) => {
    snapValue = context.value;
    snapDisabled = state === 'disabled';
  });
  onDestroy(unsub);

  $effect(() => {
    if (value !== undefined && value !== controller.value) {
      controller.set(value);
    }
  });

  $effect(() => {
    if (disabled !== controller.disabled) {
      controller.setDisabled(disabled);
    }
  });

  function ariaCheckedFor(v: CheckboxValue): 'true' | 'false' | 'mixed' {
    if (v === 'checked') return 'true';
    if (v === 'mixed') return 'mixed';
    return 'false';
  }

  const childProps = $derived<ChildPayload['props']>({
    type: 'button',
    role: 'checkbox',
    'aria-checked': ariaCheckedFor(snapValue),
    'aria-disabled': snapDisabled ? 'true' : undefined,
    'data-state': snapValue,
    'data-disabled': snapDisabled ? '' : undefined,
    id: controller.id,
  });
</script>

{#if child}
  {@render child({
    props: childProps,
    state: {
      value: snapValue,
      checked: snapValue === 'checked',
      indeterminate: snapValue === 'mixed',
      disabled: snapDisabled,
    },
    attachment: controller.root,
  })}
{:else}
  <!--
    SSR-safe attributes match what `controller.root` repaints client-side
    so hydration is silent.
  -->
  <button
    {...rest}
    type="button"
    role="checkbox"
    aria-checked={ariaCheckedFor(snapValue)}
    aria-disabled={snapDisabled ? 'true' : undefined}
    data-state={snapValue}
    data-disabled={snapDisabled ? '' : undefined}
    {@attach controller.root}
  >
    {#if children}{@render children()}{/if}
  </button>
{/if}
