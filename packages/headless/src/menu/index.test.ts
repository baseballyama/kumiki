/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import { createMenu, type MenuItem } from './index.js';

const ITEMS: MenuItem[] = [
  { id: 'new', label: 'New' },
  { id: 'open', label: 'Open' },
  { id: 'sep1', label: '', kind: 'separator' },
  { id: 'save', label: 'Save', disabled: true },
  { id: 'export', label: 'Export' },
  { id: 'quit', label: 'Quit' },
];

interface UI {
  trigger: HTMLButtonElement;
  menu: HTMLDivElement;
  items: Map<string, HTMLDivElement>;
  teardown: () => void;
}

function mount(controller: ReturnType<typeof createMenu>): UI {
  const trigger = document.createElement('button');
  trigger.textContent = 'Open';
  const menu = document.createElement('div');
  const items = new Map<string, HTMLDivElement>();
  document.body.append(trigger, menu);

  const tearTrigger = controller.trigger(trigger);
  const tearMenu = controller.menu(menu);
  const itemTeardowns: Array<(() => void) | void> = [];
  for (const it of ITEMS) {
    const el = document.createElement('div');
    menu.append(el);
    items.set(it.id, el);
    itemTeardowns.push(controller.item(it)(el));
  }

  return {
    trigger,
    menu,
    items,
    teardown() {
      for (const t of itemTeardowns) t?.();
      tearTrigger?.();
      tearMenu?.();
      trigger.remove();
      menu.remove();
    },
  };
}

describe('createMenu', () => {
  it('paints initial trigger ARIA when closed', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    expect(ui.trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(ui.trigger.getAttribute('aria-expanded')).toBe('false');
    expect(ui.trigger.getAttribute('aria-controls')).toBe(c.menuId);
    ui.teardown();
  });

  it('menu is hidden when closed', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    expect(ui.menu.hasAttribute('hidden')).toBe(true);
    expect(ui.menu.getAttribute('role')).toBe('menu');
    ui.teardown();
  });

  it('clicking trigger toggles the menu open + highlights first item', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    ui.trigger.click();
    expect(c.open).toBe(true);
    expect(ui.trigger.getAttribute('aria-expanded')).toBe('true');
    expect(c.highlightedId).toBe('new');
    // APG menu-button focus model: aria-activedescendant lives on the
    // role=menu element (which permits it), NOT the trigger <button>.
    expect(ui.trigger.hasAttribute('aria-activedescendant')).toBe(false);
    expect(ui.menu.getAttribute('aria-activedescendant')).toBe(c.itemElementId('new'));
    ui.teardown();
  });

  it('Enter on trigger opens the menu', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    ui.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(c.open).toBe(true);
    expect(c.highlightedId).toBe('new');
    ui.teardown();
  });

  it('ArrowDown opens + highlights first', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    ui.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(c.open).toBe(true);
    expect(c.highlightedId).toBe('new');
    ui.teardown();
  });

  it('ArrowUp opens + highlights last', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    ui.trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    expect(c.open).toBe(true);
    expect(c.highlightedId).toBe('quit');
    ui.teardown();
  });

  it('navigation skips separators and disabled items', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    c.show(); // highlight = new
    // Navigation keys are handled on the menu element (focus moved there).
    ui.menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(c.highlightedId).toBe('open');
    ui.menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    expect(c.highlightedId).toBe('export'); // sep1 + save (disabled) skipped
    ui.teardown();
  });

  it('Enter activates the highlighted item and closes', () => {
    const onSelect = vi.fn();
    const c = createMenu({ items: ITEMS, onSelect });
    const ui = mount(c);
    c.show();
    ui.menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })); // highlight = open
    ui.menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(c.open).toBe(false);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ id: 'open' });
    ui.teardown();
  });

  it('Escape closes the menu', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    c.show();
    ui.menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(c.open).toBe(false);
    ui.teardown();
  });

  it('Tab closes (lets focus advance)', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    c.show();
    ui.menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(c.open).toBe(false);
    ui.teardown();
  });

  it('clicking an item activates it and closes', () => {
    const onSelect = vi.fn();
    const c = createMenu({ items: ITEMS, onSelect });
    const ui = mount(c);
    c.show();
    ui.items.get('export')!.click();
    expect(c.open).toBe(false);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'export' }));
    ui.teardown();
  });

  it('clicking a disabled item does nothing', () => {
    const onSelect = vi.fn();
    const c = createMenu({ items: ITEMS, onSelect });
    const ui = mount(c);
    c.show();
    ui.items.get('save')!.click();
    expect(c.open).toBe(true); // still open
    expect(onSelect).not.toHaveBeenCalled();
    ui.teardown();
  });

  it('pointerenter on item updates highlight (when open)', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    c.show();
    ui.items.get('export')!.dispatchEvent(new Event('pointerenter'));
    expect(c.highlightedId).toBe('export');
    ui.teardown();
  });

  it('item paints role + aria-disabled correctly', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    expect(ui.items.get('new')!.getAttribute('role')).toBe('menuitem');
    expect(ui.items.get('sep1')!.getAttribute('role')).toBe('separator');
    expect(ui.items.get('save')!.getAttribute('aria-disabled')).toBe('true');
    ui.teardown();
  });

  it('item gets data-highlighted while it is the cursor', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    c.show(); // highlight=new
    expect(ui.items.get('new')!.hasAttribute('data-highlighted')).toBe(true);
    expect(ui.items.get('open')!.hasAttribute('data-highlighted')).toBe(false);
    ui.teardown();
  });

  it('typeahead jumps to matching item', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    c.show();
    ui.menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    expect(c.highlightedId).toBe('quit');
    ui.teardown();
  });

  it('outside click closes the menu', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    c.show();
    const outside = document.createElement('div');
    document.body.append(outside);
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(c.open).toBe(false);
    outside.remove();
    ui.teardown();
  });

  it('controller.activate() dispatches onSelect', () => {
    const onSelect = vi.fn();
    const c = createMenu({ items: ITEMS, onSelect });
    const ui = mount(c);
    c.show();
    c.activate('export');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'export' }));
    ui.teardown();
  });

  it('setItems updates the underlying queue', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    const next: MenuItem[] = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];
    c.setItems(next);
    expect(c.context.items.map((it) => it.id)).toEqual(['a', 'b']);
    ui.teardown();
  });

  it('moves DOM focus into the menu on open and back to the trigger on close', () => {
    const c = createMenu({ items: ITEMS });
    const ui = mount(c);
    ui.trigger.focus();
    c.show();
    expect(document.activeElement).toBe(ui.menu);
    c.hide();
    expect(document.activeElement).toBe(ui.trigger);
    ui.teardown();
  });

  it('default-open highlights the first item and sets aria-activedescendant on the menu', () => {
    const c = createMenu({ items: ITEMS, defaultOpen: true });
    const ui = mount(c);
    expect(c.open).toBe(true);
    expect(c.highlightedId).toBe('new');
    expect(ui.menu.getAttribute('aria-activedescendant')).toBe(c.itemElementId('new'));
    expect(ui.trigger.hasAttribute('aria-activedescendant')).toBe(false);
    ui.teardown();
  });

  it('onOpenChange fires on transitions', () => {
    const log: boolean[] = [];
    const c = createMenu({ items: ITEMS, onOpenChange: (open) => log.push(open) });
    const ui = mount(c);
    c.show();
    c.hide();
    c.toggle();
    expect(log).toEqual([true, false, true]);
    ui.teardown();
  });
});
