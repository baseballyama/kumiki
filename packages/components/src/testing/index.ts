/**
 * `@kumiki/components/testing` — DOM assertion helpers tuned to Kumiki's
 * `data-*` hooks and APG-conformant ARIA wiring. Designed to drop into
 * `@testing-library/svelte` (or any DOM testing harness) without pulling
 * Svelte / Kumiki internals into the assertion path.
 *
 * Public surface (intentionally tiny):
 * - {@link getByRoleStrict} — `getByRole` with `aria-label` /
 *   `aria-labelledby` resolution + clearer failure message.
 * - {@link queryByRoleStrict} — non-throwing variant.
 * - {@link expectComponentState} — assert `data-state` (or any `data-*`)
 *   on a node with a clean diff message on mismatch.
 * - {@link expectAttributes} — assert a bag of ARIA / DOM attributes.
 * - {@link getByDataPart} — locate a sub-element via
 *   `data-component-part` (Kumiki's internal slot marker).
 * - {@link queryAllByDataState} — gather every node matching a state.
 *
 * No `peerDependency` on a test runner — the helpers throw plain
 * `Error`s with rich messages so they integrate with vitest, jest, mocha,
 * node:test, and Playwright `expect` alike.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/
 */

/**
 * Resolves the accessible name of an element by following:
 * 1. `aria-labelledby` (concatenates all referenced text content), then
 * 2. `aria-label`, then
 * 3. native text content (trimmed).
 *
 * Mirrors the W3C accessible-name computation closely enough for
 * assertion purposes; full algorithm lives in browsers and Guidepup.
 */
export function getAccessibleName(node: Element): string {
  const labelledBy = node.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ownerDoc = node.ownerDocument;
    const ids = labelledBy.split(/\s+/).filter(Boolean);
    const parts: string[] = [];
    for (const id of ids) {
      const ref = ownerDoc?.getElementById(id);
      if (ref) parts.push((ref.textContent ?? '').trim());
    }
    if (parts.length) return parts.join(' ').trim();
  }
  const label = node.getAttribute('aria-label');
  if (label) return label.trim();
  return (node.textContent ?? '').trim();
}

export type RoleStrictOptions = {
  /** Required accessible name (compared after trim). */
  name?: string | RegExp;
  /**
   * If true, includes `[hidden]` and `aria-hidden=true` elements. Defaults to
   * false — matching Testing Library's behavior.
   */
  hidden?: boolean;
  /** Restrict the search to this container. Defaults to `document.body`. */
  container?: ParentNode;
};

function elementMatchesRole(node: Element, role: string): boolean {
  const explicit = node.getAttribute('role');
  if (explicit && explicit.split(/\s+/).includes(role)) return true;
  return implicitRole(node) === role;
}

function implicitRole(node: Element): string | undefined {
  const tag = node.tagName.toLowerCase();
  switch (tag) {
    case 'button':
      return 'button';
    case 'a':
      return node.hasAttribute('href') ? 'link' : undefined;
    case 'nav':
      return 'navigation';
    case 'main':
      return 'main';
    case 'header':
      return 'banner';
    case 'footer':
      return 'contentinfo';
    case 'aside':
      return 'complementary';
    case 'section':
      return node.hasAttribute('aria-label') || node.hasAttribute('aria-labelledby')
        ? 'region'
        : undefined;
    case 'dialog':
      return 'dialog';
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return 'heading';
    case 'ul':
    case 'ol':
      return 'list';
    case 'li':
      return 'listitem';
    case 'table':
      return 'table';
    case 'thead':
      return 'rowgroup';
    case 'tbody':
      return 'rowgroup';
    case 'tfoot':
      return 'rowgroup';
    case 'tr':
      return 'row';
    case 'th':
      return node.getAttribute('scope') === 'row' ? 'rowheader' : 'columnheader';
    case 'td':
      return 'cell';
    case 'input': {
      const type = (node.getAttribute('type') ?? 'text').toLowerCase();
      if (type === 'checkbox') return 'checkbox';
      if (type === 'radio') return 'radio';
      if (type === 'range') return 'slider';
      if (type === 'number') return 'spinbutton';
      if (type === 'search') return 'searchbox';
      if (type === 'submit' || type === 'button' || type === 'reset') return 'button';
      return 'textbox';
    }
    case 'select':
      return node.hasAttribute('multiple') ? 'listbox' : 'combobox';
    case 'textarea':
      return 'textbox';
    case 'progress':
      return 'progressbar';
    case 'output':
      return 'status';
    case 'hr':
      return 'separator';
    case 'img':
      return node.getAttribute('alt') === '' ? undefined : 'img';
    default:
      return undefined;
  }
}

function isVisible(node: Element): boolean {
  if (node.hasAttribute('hidden')) return false;
  if (node.getAttribute('aria-hidden') === 'true') return false;
  let cur: Element | null = node;
  while (cur) {
    if (cur.hasAttribute('hidden')) return false;
    if (cur.getAttribute('aria-hidden') === 'true') return false;
    cur = cur.parentElement;
  }
  return true;
}

function nameMatches(actual: string, expected: string | RegExp): boolean {
  if (expected instanceof RegExp) return expected.test(actual);
  return actual === expected;
}

/**
 * Like Testing Library's `getByRole`, but:
 * - Requires the role parameter explicitly (no implicit fallback).
 * - Throws an `Error` with a rich message that lists every candidate found
 *   and what their accessible names are — much faster to debug than the
 *   default "unable to find" message.
 *
 * Returns the first matching element. Use {@link queryByRoleStrict} for the
 * non-throwing variant.
 */
export function getByRoleStrict(role: string, options: RoleStrictOptions = {}): Element {
  const found = queryAllByRoleStrict(role, options);
  if (found.length === 1) return found[0]!;
  if (found.length === 0) {
    const containerEl = options.container ?? document.body;
    const candidates = Array.from(containerEl.querySelectorAll('*')).filter((n) =>
      elementMatchesRole(n, role),
    );
    const candidateLines = candidates
      .slice(0, 8)
      .map((n) => `  - <${n.tagName.toLowerCase()}> name="${getAccessibleName(n)}"`)
      .join('\n');
    const nameClause = options.name ? ` and name=${formatName(options.name)}` : '';
    throw new Error(
      `getByRoleStrict: no element with role="${role}"${nameClause} found.\nCandidates with that role (any name):\n${candidateLines || '  (none)'}`,
    );
  }
  throw new Error(
    `getByRoleStrict: ${found.length} elements with role="${role}" matched. ` +
      `Refine with the 'name' option.\n` +
      found
        .slice(0, 8)
        .map((n) => `  - <${n.tagName.toLowerCase()}> name="${getAccessibleName(n)}"`)
        .join('\n'),
  );
}

/** Non-throwing variant of {@link getByRoleStrict}. Returns null on miss. */
export function queryByRoleStrict(role: string, options: RoleStrictOptions = {}): Element | null {
  const found = queryAllByRoleStrict(role, options);
  return found[0] ?? null;
}

/** Returns every match for the given role + name. */
export function queryAllByRoleStrict(role: string, options: RoleStrictOptions = {}): Element[] {
  const containerEl = options.container ?? document.body;
  const all = Array.from(containerEl.querySelectorAll('*'));
  return all.filter((n) => {
    if (!elementMatchesRole(n, role)) return false;
    if (!options.hidden && !isVisible(n)) return false;
    if (options.name !== undefined) {
      return nameMatches(getAccessibleName(n), options.name);
    }
    return true;
  });
}

function formatName(name: string | RegExp): string {
  return name instanceof RegExp ? name.toString() : JSON.stringify(name);
}

/**
 * Asserts a single attribute value, throwing a clean error on mismatch.
 * Most useful with `data-state` / `aria-expanded` / `aria-pressed`.
 *
 * @example
 * expectComponentState(toggleEl, { 'data-state': 'on', 'aria-pressed': 'true' });
 */
export function expectComponentState(
  node: Element,
  expected: Record<string, string | boolean | null>,
): void {
  const mismatches: string[] = [];
  for (const [attr, want] of Object.entries(expected)) {
    const got = node.getAttribute(attr);
    if (want === null) {
      if (got !== null) mismatches.push(`  ${attr}: expected absent, got "${got}"`);
      continue;
    }
    const wantStr = typeof want === 'boolean' ? String(want) : want;
    if (got !== wantStr) {
      mismatches.push(
        `  ${attr}: expected "${wantStr}", got ${got === null ? 'absent' : `"${got}"`}`,
      );
    }
  }
  if (mismatches.length) {
    throw new Error(
      `expectComponentState mismatch on <${node.tagName.toLowerCase()}>:\n${mismatches.join('\n')}`,
    );
  }
}

/** Alias of {@link expectComponentState} for ARIA-only assertions. */
export const expectAttributes = expectComponentState;

/**
 * Locates an element annotated with `data-component-part="<part>"`. Kumiki
 * Layer 4 components emit this hook on every interactive sub-element so
 * tests don't need to know the underlying tag name.
 */
export function getByDataPart(part: string, container: ParentNode = document.body): Element {
  const node = container.querySelector(`[data-component-part="${part}"]`);
  if (!node) {
    throw new Error(`getByDataPart: no element with [data-component-part="${part}"] found.`);
  }
  return node;
}

/** Returns every node matching the given `data-state` value. */
export function queryAllByDataState(
  state: string,
  container: ParentNode = document.body,
): Element[] {
  return Array.from(container.querySelectorAll(`[data-state="${state}"]`));
}

/**
 * Convenience: assert that an element appears focused (i.e. it is
 * `document.activeElement`). Throws with the actual focus owner on
 * mismatch.
 */
export function expectFocused(node: Element): void {
  const owner = node.ownerDocument;
  if (!owner) throw new Error('expectFocused: node has no ownerDocument.');
  if (owner.activeElement !== node) {
    const active = owner.activeElement as Element | null;
    throw new Error(
      `expectFocused: expected <${node.tagName.toLowerCase()}> to be focused, got ` +
        (active ? `<${active.tagName.toLowerCase()}>` : 'null'),
    );
  }
}
