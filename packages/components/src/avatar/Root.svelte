<!--
  @component Avatar.Root — image with text/initials fallback.

  Discriminated Props enforce one of:
  - `decorative: true` — the avatar's image is decorative (`alt=""`); the
    surrounding markup carries the user's name elsewhere.
  - `name: string` — the avatar is the sole identifier; `<Avatar.Image>`
    will paint `alt={name}` and the fallback's text content is the
    initials of `name` (consumer override via the children snippet).

  When the image fails / is loading, `<Avatar.Fallback>` is shown.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { AvatarSize } from './context.js';
  export type { AvatarSize };

  type CommonProps = {
    size?: AvatarSize;
    children: Snippet;
    [key: string]: unknown;
  };

  export type Props =
    | (CommonProps & { decorative: true; name?: undefined })
    | (CommonProps & { name: string; decorative?: false });
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import { AVATAR_CONTEXT_KEY, type AvatarContextValue } from './context.js';

  let { size = 'md', name, decorative = false, children, ...rest }: Props = $props();
  let imageLoaded = $state(false);

  setContext<AvatarContextValue>(AVATAR_CONTEXT_KEY, {
    get meaningful() {
      return !decorative;
    },
    get name() {
      return name;
    },
    get size() {
      return size;
    },
    get imageLoaded() {
      return imageLoaded;
    },
    setImageLoaded(v) {
      imageLoaded = v;
    },
  } as AvatarContextValue);
</script>

<span
  {...rest}
  data-size={size}
  data-decorative={decorative ? '' : undefined}
  data-loaded={imageLoaded ? '' : undefined}
>
  {@render children()}
</span>
