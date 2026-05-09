/**
 * `@kumiki/components/avatar-group` — stacked Avatar list with overflow.
 *
 * ```svelte
 * <AvatarGroup.Root max={3} total={users.length}>
 *   {#each users.slice(0, 3) as u}
 *     <AvatarGroup.Item>
 *       <Avatar.Root decorative><Avatar.Image src={u.photo} /><Avatar.Fallback /></Avatar.Root>
 *     </AvatarGroup.Item>
 *   {/each}
 *   <AvatarGroup.Overflow />
 * </AvatarGroup.Root>
 * ```
 *
 * @when-to-use Compact "members of" displays where individual avatars are
 *              decorative and a Tooltip can reveal the hidden names on
 *              hover/focus.
 */

import Root from './Root.svelte';
import Item from './Item.svelte';
import Overflow from './Overflow.svelte';

export { Root, Item, Overflow };

export const AvatarGroup = { Root, Item, Overflow };

export type { Props as AvatarGroupProps } from './Root.svelte';
