import { describe, it, expect } from 'vitest';
import { createTooltipMachine } from './index.ts';

describe('tooltip machine', () => {
  describe('initial state', () => {
    it('defaults to closed with sensible delays', () => {
      const m = createTooltipMachine();
      expect(m.state).toBe('closed');
      expect(m.context.openDelay).toBe(700);
      expect(m.context.closeDelay).toBe(300);
      expect(m.context.disableHoverableContent).toBe(false);
    });

    it('honors defaultOpen', () => {
      const m = createTooltipMachine({ defaultOpen: true });
      expect(m.state).toBe('open');
    });

    it('honors timing overrides', () => {
      const m = createTooltipMachine({ openDelay: 0, closeDelay: 0 });
      expect(m.context.openDelay).toBe(0);
      expect(m.context.closeDelay).toBe(0);
    });

    it('honors disableHoverableContent', () => {
      const m = createTooltipMachine({ disableHoverableContent: true });
      expect(m.context.disableHoverableContent).toBe(true);
    });
  });

  describe('OPEN / CLOSE', () => {
    it('opens then closes', () => {
      const m = createTooltipMachine();
      m.send({ type: 'OPEN' });
      expect(m.state).toBe('open');
      m.send({ type: 'CLOSE' });
      expect(m.state).toBe('closed');
    });

    it('OPEN is idempotent when already open', () => {
      const m = createTooltipMachine({ defaultOpen: true });
      m.send({ type: 'OPEN' });
      expect(m.state).toBe('open');
    });
  });

  describe('TOGGLE', () => {
    it('flips closed ↔ open', () => {
      const m = createTooltipMachine();
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('open');
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('closed');
    });
  });

  describe('SET.OPEN', () => {
    it('open: true → open', () => {
      const m = createTooltipMachine();
      m.send({ type: 'SET.OPEN', open: true });
      expect(m.state).toBe('open');
    });

    it('open: false → closed', () => {
      const m = createTooltipMachine({ defaultOpen: true });
      m.send({ type: 'SET.OPEN', open: false });
      expect(m.state).toBe('closed');
    });

    it('redundant SET.OPEN is a no-op', () => {
      const m = createTooltipMachine();
      m.send({ type: 'SET.OPEN', open: false });
      expect(m.state).toBe('closed');
      const m2 = createTooltipMachine({ defaultOpen: true });
      m2.send({ type: 'SET.OPEN', open: true });
      expect(m2.state).toBe('open');
    });
  });

  describe('ESCAPE', () => {
    it('closes when open', () => {
      const m = createTooltipMachine({ defaultOpen: true });
      m.send({ type: 'ESCAPE' });
      expect(m.state).toBe('closed');
    });

    it('is a no-op when already closed', () => {
      const m = createTooltipMachine();
      m.send({ type: 'ESCAPE' });
      expect(m.state).toBe('closed');
    });
  });

  describe('runtime policy updates', () => {
    it('SET.OPEN_DELAY mutates context in either state', () => {
      const m = createTooltipMachine();
      m.send({ type: 'SET.OPEN_DELAY', ms: 100 });
      expect(m.context.openDelay).toBe(100);
      m.send({ type: 'OPEN' });
      m.send({ type: 'SET.OPEN_DELAY', ms: 50 });
      expect(m.context.openDelay).toBe(50);
    });

    it('SET.CLOSE_DELAY mutates context in either state', () => {
      const m = createTooltipMachine();
      m.send({ type: 'SET.CLOSE_DELAY', ms: 200 });
      expect(m.context.closeDelay).toBe(200);
      m.send({ type: 'OPEN' });
      m.send({ type: 'SET.CLOSE_DELAY', ms: 0 });
      expect(m.context.closeDelay).toBe(0);
    });

    it('SET.DISABLE_HOVERABLE_CONTENT flips at runtime', () => {
      const m = createTooltipMachine();
      m.send({ type: 'SET.DISABLE_HOVERABLE_CONTENT', value: true });
      expect(m.context.disableHoverableContent).toBe(true);
      m.send({ type: 'OPEN' });
      m.send({ type: 'SET.DISABLE_HOVERABLE_CONTENT', value: false });
      expect(m.context.disableHoverableContent).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('emits initial + every transition', () => {
      const m = createTooltipMachine();
      const seen: string[] = [];
      m.subscribe(({ state }) => seen.push(state));
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
      expect(seen).toEqual(['closed', 'open', 'closed']);
    });
  });
});
