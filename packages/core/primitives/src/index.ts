/**
 * `@kumiki/primitives` — Layer 1 framework-agnostic primitives.
 *
 * Each primitive is also available as a sub-path import — e.g.,
 * `import { uid } from '@kumiki/primitives/id'` — for surgical tree-shaking.
 * The barrel below is for users who want everything at once.
 *
 * See `docs/design/02-architecture.md` §2.3.
 */

export { uid, createIdScope } from './id/index.ts';
export {
  findByTypeAhead,
  getNextEnabledId,
  tabindexFor,
  type CollectionItem,
  type NavigateDirection,
  type NavigateOptions,
} from './collection/index.ts';
