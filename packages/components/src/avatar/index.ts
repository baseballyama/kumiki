/**
 * `@kumiki/components/avatar` — Layer 4 Avatar.
 *
 * Image + initials-fallback compound. Decorative-by-default (`alt=""`)
 * unless the consumer passes `name` to indicate the avatar is the sole
 * identifier (then `alt={name}`).
 *
 * ```svelte
 * <Avatar.Root decorative>
 *   <Avatar.Image src={user.photo} />
 *   <Avatar.Fallback />
 * </Avatar.Root>
 * ```
 *
 * Visual sizing lives in `@kumiki/atelier/avatar` (or your own CSS); pass
 * `class` / `style` / `data-*` via the rest-spread to drive your own
 * variant vocabulary.
 *
 * @when-to-use User identification (message headers, member lists,
 *              comment threads). For groups of avatars, see
 *              `@kumiki/components/avatar-group`.
 *
 * @anti-pattern Don't pass `alt={name}` on a decorative avatar — duplicates
 *               the visible name to screen readers.
 */

import Root from './Root.svelte';
import Image from './Image.svelte';
import Fallback from './Fallback.svelte';

export { Root, Image, Fallback };

export const Avatar = { Root, Image, Fallback };

export type { Props as AvatarProps } from './Root.svelte';
