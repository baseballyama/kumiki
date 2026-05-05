/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';
import { createPopover } from './index.js';

interface UI {
  trigger: HTMLButtonElement;
  content: HTMLDivElement;
  close: HTMLButtonElement;
  title: HTMLHeadingElement;
  description: HTMLParagraphElement;
  body: HTMLDivElement;
  teardown(): void;
}

function mount(controller: ReturnType<typeof createPopover>): UI {
  const trigger = document.createElement('button');
  trigger.textContent = 'Open';
  const content = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = 'Popover title';
  const description = document.createElement('p');
  description.textContent = 'Popover description';
  const body = document.createElement('div');
  body.innerHTML = '<input data-focusable="1" /><a href="#x">link</a>';
  const close = document.createElement('button');
  close.textContent = 'Close';
  content.append(title, description, body, close);
  document.body.append(trigger, content);
  const tearTrigger = controller.trigger(trigger);
  const tearContent = controller.content(content);
  const tearClose = controller.close(close);
  const tearTitle = controller.title(title);
  const tearDesc = controller.description(description);
  return {
    trigger,
    content,
    close,
    title,
    description,
    body,
    teardown() {
      tearTrigger?.();
      tearContent?.();
      tearClose?.();
      tearTitle?.();
      tearDesc?.();
      trigger.remove();
      content.remove();
    },
  };
}

const tick = () => new Promise((r) => queueMicrotask(() => r(undefined)));

describe('createPopover', () => {
  it('paints initial trigger ARIA attributes', () => {
    const c = createPopover();
    const ui = mount(c);
    expect(ui.trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(ui.trigger.getAttribute('aria-expanded')).toBe('false');
    expect(ui.trigger.getAttribute('aria-controls')).toBe(c.contentId);
    expect(ui.trigger.getAttribute('type')).toBe('button');
    ui.teardown();
  });

  it('content is hidden when closed', () => {
    const c = createPopover();
    const ui = mount(c);
    expect(ui.content.hasAttribute('hidden')).toBe(true);
    expect(ui.content.getAttribute('data-state')).toBe('closed');
    ui.teardown();
  });

  it('clicking trigger toggles open', () => {
    const c = createPopover();
    const ui = mount(c);
    ui.trigger.click();
    expect(c.state).toBe('open');
    expect(ui.trigger.getAttribute('aria-expanded')).toBe('true');
    expect(ui.content.hasAttribute('hidden')).toBe(false);
    ui.trigger.click();
    expect(c.state).toBe('closed');
    ui.teardown();
  });

  it('focus moves into content on open (first focusable wins)', async () => {
    const c = createPopover();
    const ui = mount(c);
    ui.trigger.click();
    await tick();
    const first = ui.body.querySelector<HTMLElement>('[data-focusable="1"]');
    expect(document.activeElement).toBe(first);
    ui.teardown();
  });

  it('focus returns to trigger on close', async () => {
    const c = createPopover();
    const ui = mount(c);
    ui.trigger.click();
    await tick();
    c.hide();
    expect(document.activeElement).toBe(ui.trigger);
    ui.teardown();
  });

  it('Escape closes when closeOnEscape (default true)', async () => {
    const c = createPopover();
    const ui = mount(c);
    ui.trigger.click();
    await tick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(c.state).toBe('closed');
    ui.teardown();
  });

  it('Escape is ignored when closeOnEscape=false', async () => {
    const c = createPopover({ closeOnEscape: false });
    const ui = mount(c);
    ui.trigger.click();
    await tick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(c.state).toBe('open');
    ui.teardown();
  });

  it('outside click closes when closeOnOutsideClick (default true)', async () => {
    const c = createPopover();
    const ui = mount(c);
    const outside = document.createElement('div');
    document.body.append(outside);
    ui.trigger.click();
    await tick();
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(c.state).toBe('closed');
    outside.remove();
    ui.teardown();
  });

  it('clicking the trigger does not double-fire as outside click', async () => {
    const c = createPopover();
    const ui = mount(c);
    ui.trigger.click(); // opens
    await tick();
    // Simulate pointerdown on the trigger (could be interpreted as outside click)
    ui.trigger.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(c.state).toBe('open');
    ui.teardown();
  });

  it('clicking inside content does not close', async () => {
    const c = createPopover();
    const ui = mount(c);
    ui.trigger.click();
    await tick();
    ui.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(c.state).toBe('open');
    ui.teardown();
  });

  it('Close subcomponent dispatches CLOSE', () => {
    const c = createPopover({ defaultOpen: true });
    const ui = mount(c);
    ui.close.click();
    expect(c.state).toBe('closed');
    ui.teardown();
  });

  it('title wires aria-labelledby on content', () => {
    const c = createPopover();
    const ui = mount(c);
    expect(ui.content.getAttribute('aria-labelledby')).toBe(c.titleId);
    ui.teardown();
  });

  it('description wires aria-describedby on content', () => {
    const c = createPopover();
    const ui = mount(c);
    expect(ui.content.getAttribute('aria-describedby')).toBe(c.descriptionId);
    ui.teardown();
  });

  it('controller methods drive state', () => {
    const c = createPopover();
    const ui = mount(c);
    c.show();
    expect(c.open).toBe(true);
    c.toggle();
    expect(c.open).toBe(false);
    c.setOpen(true);
    expect(c.open).toBe(true);
    ui.teardown();
  });

  it('onOpenChange fires on transitions', () => {
    const log: boolean[] = [];
    const c = createPopover({ onOpenChange: (v) => log.push(v) });
    const ui = mount(c);
    c.show();
    c.hide();
    c.toggle();
    expect(log).toEqual([true, false, true]);
    ui.teardown();
  });

  it('teardown removes the dismissable handlers', async () => {
    const c = createPopover();
    const ui = mount(c);
    ui.trigger.click();
    await tick();
    ui.teardown();
    // Dispatch a phantom escape — should not throw or transition.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(c.state).toBe('open'); // machine retains state but no listeners react
  });
});
