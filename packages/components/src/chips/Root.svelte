<!--
  @component Chips.Root — compact label / tag with three variants.

  - `static` (default): pure `<span>`, no interactivity.
  - `dismissible`: `<span>` surface + a sibling `<Chips.Close>` button.
  - `selectable`: rendered as `<button>` with `aria-pressed`.

  Discriminated union enforces the right props per variant.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';

  type CommonProps = {
    children: Snippet;
    [key: string]: unknown;
  };

  export type Props =
    | (CommonProps & { variant?: 'static' })
    | (CommonProps & {
        variant: 'dismissible';
        /** Required so Close's aria-label can be "Remove {label}". */
        label: string;
        onDismiss: () => void;
      })
    | (CommonProps & {
        variant: 'selectable';
        pressed: boolean;
        onPressedChange: (v: boolean) => void;
        disabled?: boolean;
      });
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { CHIPS_CONTEXT_KEY, type ChipsContextValue } from './context.js';

  let props: Props = $props();
  const variant = $derived(
    'variant' in props && props.variant ? props.variant : ('static' as const),
  );

  setContext<ChipsContextValue>(CHIPS_CONTEXT_KEY, {
    get variant() {
      return variant;
    },
    get label() {
      return 'label' in props ? (props as { label?: string }).label : undefined;
    },
    onDismiss() {
      if (variant === 'dismissible') {
        (props as { onDismiss: () => void }).onDismiss();
      }
    },
  } as ChipsContextValue);

  function handleSelectableClick(): void {
    if (variant !== 'selectable') return;
    const p = props as {
      pressed: boolean;
      onPressedChange: (v: boolean) => void;
      disabled?: boolean;
    };
    if (p.disabled) return;
    p.onPressedChange(!p.pressed);
  }

  function handleSelectableKey(event: KeyboardEvent): void {
    // Native <button> already handles Space/Enter; this is here for non-button hosts in the future.
    if (event.key !== ' ' && event.key !== 'Enter') return;
    handleSelectableClick();
  }
</script>

{#if variant === 'selectable'}
  {@const p = props as { pressed: boolean; disabled?: boolean }}
  <button
    type="button"
    data-part="root"
    data-variant="selectable"
    data-pressed={p.pressed ? '' : undefined}
    aria-pressed={p.pressed ? 'true' : 'false'}
    aria-disabled={p.disabled ? 'true' : undefined}
    disabled={p.disabled}
    onclick={handleSelectableClick}
    onkeydown={handleSelectableKey}
  >
    {@render props.children()}
  </button>
{:else}
  <span data-part="root" data-variant={variant}>
    {@render props.children()}
  </span>
{/if}
