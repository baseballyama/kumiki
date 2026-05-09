import type { Snippet } from 'svelte';

export const AVATAR_CONTEXT_KEY = Symbol('kumiki-avatar');

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarContextValue {
  /** True when meaningful (carries `name`). False for decorative avatars. */
  readonly meaningful: boolean;
  readonly name: string | undefined;
  readonly size: AvatarSize;
  /** Becomes true once the image successfully loads. */
  readonly imageLoaded: boolean;
  /** Reports the load state from `<Avatar.Image>` to other parts. */
  setImageLoaded(loaded: boolean): void;
  /** Optional fallback snippet supplied by the consumer (e.g. icon). */
  fallbackSnippet?: Snippet;
}
