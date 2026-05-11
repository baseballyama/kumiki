<!--
  @component Avatar.Fallback — shown when the image isn't loaded.

  Default content is the initials of the parent Root's `name` (max 2
  characters). Override with the children snippet (e.g. an icon).
  Marked `aria-hidden="true"` when the parent is meaningful (the name
  is already exposed through the image's `alt`); decorative avatars
  with no alt expose the fallback to AT.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { AVATAR_CONTEXT_KEY, type AvatarContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();
  const ctx = getContext<AvatarContextValue>(AVATAR_CONTEXT_KEY);

  function initials(name: string | undefined): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/u).slice(0, 2);
    return parts
      .map((p) => p[0] ?? '')
      .join('')
      .toUpperCase();
  }
</script>

<span
  {...rest}
  data-component-part="fallback"
  data-hidden={ctx.imageLoaded ? '' : undefined}
  aria-hidden={ctx.meaningful ? 'true' : undefined}
>
  {#if children}{@render children()}{:else}{initials(ctx.name)}{/if}
</span>
