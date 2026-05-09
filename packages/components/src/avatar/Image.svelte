<!--
  @component Avatar.Image — the avatar `<img>`.

  - When the parent Root is meaningful (carries `name`), `alt={name}`.
  - When decorative, `alt=""` and the image is hidden from AT.

  Image is hidden via `data-loaded=""` until it loads, allowing CSS to
  fade it in or hide it entirely until ready.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { AVATAR_CONTEXT_KEY, type AvatarContextValue } from './context.js';

  type Props = {
    src: string;
    loading?: 'eager' | 'lazy';
    [key: string]: unknown;
  };

  let { src, loading = 'lazy', ...rest }: Props = $props();
  const ctx = getContext<AvatarContextValue>(AVATAR_CONTEXT_KEY);

  function handleLoad(): void {
    ctx.setImageLoaded(true);
  }
  function handleError(): void {
    ctx.setImageLoaded(false);
  }
</script>

<img
  {...rest}
  {src}
  {loading}
  alt={ctx.meaningful ? (ctx.name ?? '') : ''}
  data-part="image"
  data-hidden={ctx.imageLoaded ? undefined : ''}
  onload={handleLoad}
  onerror={handleError}
/>
