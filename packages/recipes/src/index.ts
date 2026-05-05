/**
 * `@kumiki/recipes` — barrel that re-exports every recipe as a namespace.
 *
 * Prefer the per-recipe subpath (`@kumiki/recipes/toggle`) for tree-shake
 * guarantees. This barrel exists for one-shot imports.
 *
 * Implementation note: matches the `export * as` namespace pattern from
 * `@kumiki/components` to handle generic Svelte components consistently
 * (sveltejs/svelte#12785).
 */

export * as Dialog from './dialog/index.js';
export * as Toggle from './toggle/index.js';
