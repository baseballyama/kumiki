// @vitest-environment jsdom
/**
 * Smoke tests for the public surface of `@kumiki/components/testing`.
 *
 * Uses jsdom (via the docblock pragma above) to exercise the DOM
 * computations directly. The whole point of these helpers is to keep
 * Kumiki internals out of consumer test paths, so we keep coverage
 * focused on the documented behavior — accessible-name computation,
 * role matching, attribute assertion shape — rather than re-asserting
 * Testing Library semantics.
 */
import { afterEach, describe, expect, it } from 'vitest';
import {
  expectAttributes,
  expectComponentState,
  expectFocused,
  getAccessibleName,
  getByDataPart,
  getByRoleStrict,
  queryAllByDataState,
  queryAllByRoleStrict,
  queryByRoleStrict,
} from './index.js';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('getAccessibleName', () => {
  it('prefers aria-labelledby over aria-label and text', () => {
    document.body.innerHTML = `
      <span id="lbl">Hello there</span>
      <button aria-labelledby="lbl" aria-label="ignored">also ignored</button>
    `;
    const btn = document.querySelector('button')!;
    expect(getAccessibleName(btn)).toBe('Hello there');
  });

  it('falls back to aria-label when aria-labelledby is absent', () => {
    document.body.innerHTML = `<button aria-label="Save">x</button>`;
    expect(getAccessibleName(document.querySelector('button')!)).toBe('Save');
  });

  it('falls back to text content when both ARIA attributes are absent', () => {
    document.body.innerHTML = `<button>  Submit  </button>`;
    expect(getAccessibleName(document.querySelector('button')!)).toBe('Submit');
  });

  it('joins multiple aria-labelledby ids in order', () => {
    document.body.innerHTML = `
      <span id="a">First</span>
      <span id="b">Second</span>
      <button aria-labelledby="a b">x</button>
    `;
    expect(getAccessibleName(document.querySelector('button')!)).toBe('First Second');
  });
});

describe('getByRoleStrict', () => {
  it('matches an explicit role attribute', () => {
    document.body.innerHTML = `<div role="dialog" aria-label="hi"></div>`;
    const node = getByRoleStrict('dialog');
    expect(node.getAttribute('role')).toBe('dialog');
  });

  it('matches implicit roles for buttons', () => {
    document.body.innerHTML = `<button>Save</button>`;
    expect(getByRoleStrict('button').tagName).toBe('BUTTON');
  });

  it('filters by accessible name (string)', () => {
    document.body.innerHTML = `
      <button>One</button>
      <button>Two</button>
    `;
    expect(getByRoleStrict('button', { name: 'Two' }).textContent).toBe('Two');
  });

  it('filters by accessible name (regex)', () => {
    document.body.innerHTML = `
      <button>Save</button>
      <button>Cancel</button>
    `;
    expect(getByRoleStrict('button', { name: /save/i }).textContent).toBe('Save');
  });

  it('throws with a candidate listing on miss', () => {
    document.body.innerHTML = `<button>Only</button>`;
    expect(() => getByRoleStrict('checkbox')).toThrowError(/no element with role="checkbox"/);
  });

  it('throws when multiple match without a name filter', () => {
    document.body.innerHTML = `<button>A</button><button>B</button>`;
    expect(() => getByRoleStrict('button')).toThrowError(/2 elements with role="button"/);
  });

  it('honors hidden=true to include aria-hidden elements', () => {
    document.body.innerHTML = `<button aria-hidden="true">ghost</button>`;
    expect(queryByRoleStrict('button')).toBeNull();
    expect(queryByRoleStrict('button', { hidden: true })).not.toBeNull();
  });
});

describe('queryAllByRoleStrict', () => {
  it('returns every match', () => {
    document.body.innerHTML = `<button>A</button><button>B</button>`;
    expect(queryAllByRoleStrict('button')).toHaveLength(2);
  });

  it('returns empty array on miss', () => {
    document.body.innerHTML = `<span>nothing</span>`;
    expect(queryAllByRoleStrict('button')).toEqual([]);
  });
});

describe('expectComponentState', () => {
  it('passes when every expected attribute matches', () => {
    document.body.innerHTML = `<button data-state="on" aria-pressed="true">x</button>`;
    const btn = document.querySelector('button')!;
    expectComponentState(btn, { 'data-state': 'on', 'aria-pressed': 'true' });
  });

  it('throws with diff on mismatch', () => {
    document.body.innerHTML = `<button data-state="off" aria-pressed="false">x</button>`;
    const btn = document.querySelector('button')!;
    expect(() => expectComponentState(btn, { 'data-state': 'on' })).toThrowError(
      /data-state: expected "on", got "off"/,
    );
  });

  it('handles boolean expectations by stringifying', () => {
    document.body.innerHTML = `<div aria-expanded="true"></div>`;
    expectComponentState(document.body.firstElementChild!, { 'aria-expanded': true });
  });

  it('checks for absent attributes when expected is null', () => {
    document.body.innerHTML = `<button data-state="on">x</button>`;
    expectComponentState(document.querySelector('button')!, { 'aria-pressed': null });
    expect(() =>
      expectComponentState(document.querySelector('button')!, { 'data-state': null }),
    ).toThrowError(/data-state: expected absent, got "on"/);
  });

  it('is aliased as expectAttributes', () => {
    expect(expectAttributes).toBe(expectComponentState);
  });
});

describe('getByDataPart', () => {
  it('finds a child via data-component-part', () => {
    document.body.innerHTML = `
      <div>
        <button data-component-part="trigger">x</button>
      </div>
    `;
    expect(getByDataPart('trigger').tagName).toBe('BUTTON');
  });

  it('throws when not found', () => {
    document.body.innerHTML = `<div></div>`;
    expect(() => getByDataPart('trigger')).toThrowError(
      /no element with \[data-component-part="trigger"\]/,
    );
  });
});

describe('queryAllByDataState', () => {
  it('returns every node with matching state', () => {
    document.body.innerHTML = `
      <div data-state="open"></div>
      <div data-state="closed"></div>
      <div data-state="open"></div>
    `;
    expect(queryAllByDataState('open')).toHaveLength(2);
  });
});

describe('expectFocused', () => {
  it('passes when node is the active element', () => {
    document.body.innerHTML = `<input />`;
    const input = document.querySelector('input')!;
    input.focus();
    expectFocused(input);
  });

  it('throws with the actual focused tag on mismatch', () => {
    document.body.innerHTML = `<input id="a" /><input id="b" />`;
    const a = document.getElementById('a')!;
    const b = document.getElementById('b')!;
    b.focus();
    expect(() => expectFocused(a)).toThrowError(/expected <input> to be focused, got <input>/);
  });
});
