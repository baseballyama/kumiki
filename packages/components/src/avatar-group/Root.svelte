<!--
  @component AvatarGroup.Root — stacked-avatar list with overflow.

  Children are placed inside a `role="list"` `<ul>`. The component does
  NOT enforce truncation — `max` and `total` are passed via context so a
  consumer can render the visible items + a single Overflow.

  This keeps the slicing-from-an-array decision at the consumer site
  (different apps already paginate / filter their member lists) while
  the component handles the ARIA wrapper and the overflow label.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';

  type BaseProps = {
    /** Maximum visible avatars before showing the overflow indicator. */
    max?: number;
    /** Override the total count for the overflow label (defaults to children-count). */
    total?: number;
    children: Snippet;
    /** Extra attributes (`class`, `style`, `data-*`, …) forwarded to `<ul>`. */
    [key: string]: unknown;
  };

  /**
   * AvatarGroup.Root — `<ul role="list">` wrapper for stacked avatars.
   *
   * A `<ul>` without an accessible name is announced with no context. Require
   * one of `aria-label` or `aria-labelledby` at the type level so consumers
   * cannot forget it.
   *
   * @when-to-use Always. Use `aria-label` for a literal string (e.g. "Team
   * members") or `aria-labelledby` to point at a visible heading.
   * @anti-pattern Omitting both leaves screen-reader users without list context.
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/
   */
  export type Props =
    | (BaseProps & { 'aria-label': string })
    | (BaseProps & { 'aria-labelledby': string });
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { AVATAR_GROUP_CONTEXT_KEY, type AvatarGroupContextValue } from './context.js';

  let { max, total, children, ...rest }: Props = $props();

  setContext<AvatarGroupContextValue>(AVATAR_GROUP_CONTEXT_KEY, {
    get max() {
      return max;
    },
    get total() {
      return total;
    },
  } as AvatarGroupContextValue);
</script>

<ul role="list" {...rest} data-component-part="group">{@render children()}</ul>
