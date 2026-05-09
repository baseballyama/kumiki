<!--
  @component IconButton.Root — icon-only Button variant with mandatory accessible name.

  Behavior follows WAI-ARIA APG button pattern:
  https://www.w3.org/WAI/ARIA/apg/patterns/button/

  IconButton is the icon-only branch of Button extracted as its own subpath.
  It enforces — at the type level — that consumers supply both:
  - an `icon` snippet (the visible glyph), and
  - either `aria-label` or `aria-labelledby` (the accessible name).

  All other Button props (variant / size / loading / disabled / type / onclick)
  are forwarded as-is. Default `variant` is `'ghost'` since icon-only buttons
  conventionally use the lightest chrome.

  Snippets:
  - `icon`           → the visible glyph (required, decorative — `aria-hidden` is added).

  Anti-patterns this catches that plain `<button>` does not:
  - Forgetting `aria-label` on a square button containing only an SVG.
  - Mixing `children` with `icon` (use `Button.Root` instead — IconButton is icon-only).
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { ButtonVariant, ButtonSize } from '../button/Root.svelte';

  type BaseProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    icon: Snippet;
    onclick?: (event: MouseEvent) => void;
    /** Extra attributes (`class`, `style`, `data-*`, `form`, …) forwarded to `<button>`. */
    [key: string]: unknown;
  };

  export type Props =
    | (BaseProps & { 'aria-label': string })
    | (BaseProps & { 'aria-labelledby': string });
</script>

<script lang="ts">
  import ButtonRoot from '../button/Root.svelte';

  let {
    variant = 'ghost',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    id,
    icon,
    onclick,
    ...rest
  }: Props = $props();
</script>

<ButtonRoot
  {...rest}
  {variant}
  {size}
  {loading}
  {disabled}
  {type}
  {id}
  {icon}
  {onclick}
  data-icon-only=""
/>
