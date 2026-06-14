// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCombobox, type ComboboxOption } from './index.ts';

interface User extends ComboboxOption {
  id: string;
  label: string;
}

const users: User[] = [
  { id: '1', label: 'Alice' },
  { id: '2', label: 'Bob' },
  { id: '3', label: 'Carol' },
];

describe('createCombobox attachment', () => {
  let root: HTMLDivElement;
  let input: HTMLInputElement;
  let listbox: HTMLUListElement;
  let teardowns: Array<() => void> = [];

  beforeEach(() => {
    root = document.createElement('div');
    input = document.createElement('input');
    listbox = document.createElement('ul');
    document.body.append(root, input, listbox);
    teardowns = [];
  });

  afterEach(() => {
    for (const t of teardowns) t();
    teardowns = [];
    root.remove();
    input.remove();
    listbox.remove();
  });

  function attachAll(cb: ReturnType<typeof createCombobox<User>>) {
    teardowns.push(cb.root(root) || (() => {}));
    teardowns.push(cb.input(input) || (() => {}));
    teardowns.push(cb.listbox(listbox) || (() => {}));
  }

  it('initializes ARIA on input and listbox', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-controls')).toBe(`${cb.id}-listbox`);
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(listbox.getAttribute('role')).toBe('listbox');
    expect(listbox.id).toBe(`${cb.id}-listbox`);
    expect(listbox.hasAttribute('hidden')).toBe(true);
  });

  it('focusing the input opens the listbox', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    input.dispatchEvent(new FocusEvent('focus'));
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(listbox.hasAttribute('hidden')).toBe(false);
  });

  it('typing in the input triggers INPUT.CHANGE and filters', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    input.value = 'al';
    input.dispatchEvent(new Event('input'));
    expect(cb.context.query).toBe('al');
    expect(cb.context.filtered).toEqual([users[0]]);
  });

  it('ArrowDown / ArrowUp navigate', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    expect(cb.context.highlightedId).toBe('1');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    expect(cb.context.highlightedId).toBe('2');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true }));
    expect(cb.context.highlightedId).toBe('1');
  });

  it('Enter commits highlighted option', () => {
    const onValueChange = vi.fn();
    const cb = createCombobox<User>({ options: users, onValueChange });
    attachAll(cb);
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    expect(cb.value).toEqual(users[1]);
    expect(onValueChange).toHaveBeenCalledWith(users[1]);
    expect(cb.state).toBe('idle');
  });

  it('Escape closes', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
    expect(cb.state).toBe('idle');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('programmatic setValue updates value but does not fire onValueChange', () => {
    const onValueChange = vi.fn();
    const cb = createCombobox<User>({ options: users, onValueChange });
    attachAll(cb);
    cb.setValue(users[1]!);
    expect(cb.value).toEqual(users[1]);
    // setValue is the controlled-binding path, not a user selection.
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('aria-activedescendant points to highlighted option element id', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    input.dispatchEvent(new FocusEvent('focus'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }));
    expect(input.getAttribute('aria-activedescendant')).toBe(`${cb.id}-option-1`);
  });

  it('option attachment sets ARIA + handles click selection', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    const optEl = document.createElement('li');
    listbox.appendChild(optEl);
    teardowns.push(cb.option(users[0]!)(optEl) || (() => {}));

    expect(optEl.getAttribute('role')).toBe('option');
    expect(optEl.id).toBe(`${cb.id}-option-1`);
    expect(optEl.getAttribute('aria-selected')).toBe('false');

    // Options can only be selected while the listbox is open.
    cb.open();
    optEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(cb.value).toEqual(users[0]);
    expect(cb.state).toBe('idle');
  });

  it('option mouseenter highlights without committing', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    const optEl = document.createElement('li');
    listbox.appendChild(optEl);
    teardowns.push(cb.option(users[2]!)(optEl) || (() => {}));

    cb.open();
    optEl.dispatchEvent(new MouseEvent('mouseenter'));
    expect(cb.context.highlightedId).toBe('3');
    expect(cb.value).toBe(null);
  });

  it('trigger toggles open / closed', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    teardowns.push(cb.trigger(btn) || (() => {}));

    expect(btn.getAttribute('aria-controls')).toBe(`${cb.id}-listbox`);
    expect(btn.getAttribute('aria-haspopup')).toBe('listbox');

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(cb.state).toBe('open');
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(cb.state).toBe('idle');
    btn.remove();
  });

  it('disabled combobox ignores focus', () => {
    const cb = createCombobox<User>({ options: users, disabled: true });
    attachAll(cb);
    input.dispatchEvent(new FocusEvent('focus'));
    expect(cb.state).toBe('disabled');
  });

  it('onOpenChange + onQueryChange callbacks', () => {
    const onOpenChange = vi.fn();
    const onQueryChange = vi.fn();
    const cb = createCombobox<User>({ options: users, onOpenChange, onQueryChange });
    attachAll(cb);
    input.dispatchEvent(new FocusEvent('focus'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    input.value = 'al';
    input.dispatchEvent(new Event('input'));
    expect(onQueryChange).toHaveBeenCalledWith('al');
  });

  it('input value syncs to machine query when option selected', () => {
    const cb = createCombobox<User>({ options: users });
    attachAll(cb);
    cb.open();
    cb.select(users[0]!);
    // Subscriber paint syncs node.value when machine.context.query changes.
    expect(input.value).toBe('Alice');
  });
});
