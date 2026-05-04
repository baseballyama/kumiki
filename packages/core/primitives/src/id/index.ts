/**
 * Stable, SSR-safe id generator.
 *
 * - On the server (no `crypto.randomUUID`): falls back to a counter-based id.
 * - On the client: prefers `crypto.randomUUID()` (always available on modern
 *   browsers + Node 22+ + edge runtimes).
 *
 * @when-to-use Use whenever a component needs an id for `aria-controls`,
 *              `aria-labelledby`, `aria-describedby`, etc.
 *
 * @anti-pattern Don't seed any user-visible value with this id — the value is
 *               not stable across reloads.
 */

const ID_PREFIX = 'kumiki';

let counter = 0;

/**
 * Generate an id using the best available source of entropy.
 * Output is always prefixed with `kumiki-`, optionally followed by `<scope>-`.
 *
 * @example
 * uid()         // "kumiki-3f5b…"
 * uid('toggle') // "kumiki-toggle-3f5b…"
 */
export function uid(scope?: string): string {
  const prefix = scope ? `${ID_PREFIX}-${scope}` : ID_PREFIX;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

/**
 * Create an id scope for deterministic id generation within a request /
 * component mount. The counter resets per scope instance.
 *
 * @example
 * ```ts
 * const scope = createIdScope('dialog');
 * const titleId = scope.next('title');     // "kumiki-dialog-1-title"
 * const descId  = scope.next('desc');      // "kumiki-dialog-2-desc"
 * ```
 */
export function createIdScope(scope: string): {
  next(suffix?: string): string;
} {
  let n = 0;
  return {
    next(suffix) {
      n += 1;
      return suffix ? `${ID_PREFIX}-${scope}-${n}-${suffix}` : `${ID_PREFIX}-${scope}-${n}`;
    },
  };
}
