<!--
  @component Toggle.Root — a two-state on/off button.

  Default rendering: a native `<button>` with `aria-pressed`. Provide the
  `child` snippet to render any element / component instead — Kumiki passes
  the props you must spread on it.

  Behavior follows WAI-ARIA APG button (toggle) pattern:
  https://www.w3.org/WAI/ARIA/apg/patterns/button/

  Bindable props:
  - `pressed`        → mirrors `aria-pressed`. Bind for two-way control, or pass
                       `defaultPressed` for uncontrolled mode.

  Plain props:
  - `defaultPressed` → uncontrolled initial value.
  - `disabled`       → disables interaction; sets `aria-disabled`.
  - `onPressedChange`→ user-initiated changes only. Controlled `pressed`
                       updates do not call this.

  Snippets:
  - `children`       → default content of the button.
  - `child`          → render delegation. Receives `{ props, state }`.
-->
<script lang="ts">
  import { onDestroy, untrack } from 'svelte';
  import { createToggle, type ToggleController } from '@kumiki/headless/toggle';
  import type { Attachment } from 'svelte/attachments';
  import type { Snippet } from 'svelte';

  type ChildPayload = {
    props: {
      type: 'button';
      'aria-pressed': 'true' | 'false';
      'aria-disabled': 'true' | undefined;
      'data-state': 'on' | 'off';
      'data-disabled': '' | undefined;
      id: string;
    };
    state: {
      pressed: boolean;
      disabled: boolean;
    };
    /**
     * Attach to your rendered element via `{@attach attachment}` to wire
     * click / keyboard interactions and ARIA paint-on-change.
     */
    attachment: Attachment;
  };

  type Props = {
    pressed?: boolean;
    defaultPressed?: boolean;
    disabled?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    id?: string;
    children?: Snippet;
    child?: Snippet<[payload: ChildPayload]>;
    /** Extra props (`class`, `style`, `data-*`, …) forwarded to the root `<button>`. */
    [key: string]: unknown;
  };

  let {
    pressed = $bindable(undefined),
    defaultPressed,
    disabled = false,
    onPressedChange,
    id,
    children,
    child,
    ...rest
  }: Props = $props();

  // Controlled if `pressed` prop is supplied (even false). Otherwise uncontrolled.
  // Reads of bindable/state values at top level are captured once at component
  // construction. We use `untrack` so the Svelte compiler doesn't warn — the
  // post-construction reactive sync happens via $effect below.
  const controller: ToggleController = untrack(() =>
    createToggle({
      initial: pressed ?? defaultPressed ?? false,
      disabled,
      id,
      onPressedChange: (next) => {
        // Sync into bindable prop and notify caller.
        pressed = next;
        onPressedChange?.(next);
      },
    }),
  );

  // Mirror controller state into reactive locals so the template re-renders.
  let snapPressed = $state(controller.pressed);
  let snapDisabled = $state(controller.disabled);

  const unsub = controller.subscribe(({ context, state }) => {
    snapPressed = context.pressed;
    snapDisabled = state === 'disabled';
  });
  onDestroy(unsub);

  // Reflect prop changes into the controller (controlled mode).
  $effect(() => {
    if (pressed !== undefined && pressed !== controller.pressed) {
      controller.set(pressed);
    }
  });

  $effect(() => {
    if (disabled !== controller.disabled) {
      controller.setDisabled(disabled);
    }
  });

  // Build the props payload that the consumer spreads on their element.
  // Interactions (click, keydown) are wired by the `attachment` payload, not
  // by these props — keeping the props strictly declarative.
  const childProps = $derived<ChildPayload['props']>({
    type: 'button',
    'aria-pressed': snapPressed ? 'true' : 'false',
    'aria-disabled': snapDisabled ? 'true' : undefined,
    'data-state': snapPressed ? 'on' : 'off',
    'data-disabled': snapDisabled ? '' : undefined,
    id: controller.id,
  });
</script>

{#if child}
  {@render child({
    props: childProps,
    state: { pressed: snapPressed, disabled: snapDisabled },
    attachment: controller.root,
  })}
{:else}
  <!--
    Static SSR-safe attributes are emitted in the template so the server-rendered
    HTML is correct before hydration. The `id` is intentionally NOT rendered in
    the template — the attachment paints it on mount. Rendering a UUID in SSR
    would cause a hydration mismatch (server UUID ≠ client UUID), forcing Svelte
    to re-create the component and lose interactions.
  -->
  <button
    {...rest}
    type="button"
    aria-pressed={snapPressed ? 'true' : 'false'}
    aria-disabled={snapDisabled ? 'true' : undefined}
    data-state={snapPressed ? 'on' : 'off'}
    data-disabled={snapDisabled ? '' : undefined}
    {@attach controller.root}
  >
    {#if children}{@render children()}{/if}
  </button>
{/if}
