import { describe, it, expect } from 'vitest';
import { createDialogMachine } from './index.ts';

describe('dialog machine', () => {
  describe('initial state', () => {
    it('defaults to closed', () => {
      const m = createDialogMachine();
      expect(m.state).toBe('closed');
      expect(m.context.modal).toBe(true);
      expect(m.context.closeOnEscape).toBe(true);
      expect(m.context.closeOnOutsideClick).toBe(true);
    });

    it('honors defaultOpen', () => {
      const m = createDialogMachine({ defaultOpen: true });
      expect(m.state).toBe('open');
    });

    it('honors policy overrides', () => {
      const m = createDialogMachine({
        modal: false,
        closeOnEscape: false,
        closeOnOutsideClick: false,
      });
      expect(m.context.modal).toBe(false);
      expect(m.context.closeOnEscape).toBe(false);
      expect(m.context.closeOnOutsideClick).toBe(false);
    });
  });

  describe('OPEN / CLOSE', () => {
    it('opens then closes', () => {
      const m = createDialogMachine();
      m.send({ type: 'OPEN' });
      expect(m.state).toBe('open');
      m.send({ type: 'CLOSE' });
      expect(m.state).toBe('closed');
    });

    it('OPEN is idempotent when already open', () => {
      const m = createDialogMachine({ defaultOpen: true });
      m.send({ type: 'OPEN' });
      expect(m.state).toBe('open');
    });

    it('CLOSE is idempotent when already closed', () => {
      const m = createDialogMachine();
      m.send({ type: 'CLOSE' });
      expect(m.state).toBe('closed');
    });
  });

  describe('TOGGLE', () => {
    it('flips open ↔ closed', () => {
      const m = createDialogMachine();
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('open');
      m.send({ type: 'TOGGLE' });
      expect(m.state).toBe('closed');
    });
  });

  describe('SET.OPEN', () => {
    it('open: true → open', () => {
      const m = createDialogMachine();
      m.send({ type: 'SET.OPEN', open: true });
      expect(m.state).toBe('open');
    });

    it('open: false → closed', () => {
      const m = createDialogMachine({ defaultOpen: true });
      m.send({ type: 'SET.OPEN', open: false });
      expect(m.state).toBe('closed');
    });

    it('open: true while open is a no-op', () => {
      const m = createDialogMachine({ defaultOpen: true });
      m.send({ type: 'SET.OPEN', open: true });
      expect(m.state).toBe('open');
    });

    it('open: false while closed is a no-op', () => {
      const m = createDialogMachine();
      m.send({ type: 'SET.OPEN', open: false });
      expect(m.state).toBe('closed');
    });
  });

  describe('ESCAPE', () => {
    it('closes when closeOnEscape is true', () => {
      const m = createDialogMachine({ defaultOpen: true });
      m.send({ type: 'ESCAPE' });
      expect(m.state).toBe('closed');
    });

    it('is a no-op when closeOnEscape is false', () => {
      const m = createDialogMachine({ defaultOpen: true, closeOnEscape: false });
      m.send({ type: 'ESCAPE' });
      expect(m.state).toBe('open');
    });

    it('is a no-op when already closed', () => {
      const m = createDialogMachine();
      m.send({ type: 'ESCAPE' });
      expect(m.state).toBe('closed');
    });
  });

  describe('OUTSIDE_CLICK', () => {
    it('closes when closeOnOutsideClick is true', () => {
      const m = createDialogMachine({ defaultOpen: true });
      m.send({ type: 'OUTSIDE_CLICK' });
      expect(m.state).toBe('closed');
    });

    it('is a no-op when closeOnOutsideClick is false', () => {
      const m = createDialogMachine({ defaultOpen: true, closeOnOutsideClick: false });
      m.send({ type: 'OUTSIDE_CLICK' });
      expect(m.state).toBe('open');
    });
  });

  describe('runtime policy updates', () => {
    it('SET.MODAL updates context in either state', () => {
      const m = createDialogMachine();
      m.send({ type: 'SET.MODAL', modal: false });
      expect(m.context.modal).toBe(false);
      m.send({ type: 'OPEN' });
      m.send({ type: 'SET.MODAL', modal: true });
      expect(m.context.modal).toBe(true);
    });

    it('SET.CLOSE_ON_ESCAPE flips guard at runtime', () => {
      const m = createDialogMachine({ defaultOpen: true });
      m.send({ type: 'SET.CLOSE_ON_ESCAPE', value: false });
      m.send({ type: 'ESCAPE' });
      expect(m.state).toBe('open');
      m.send({ type: 'SET.CLOSE_ON_ESCAPE', value: true });
      m.send({ type: 'ESCAPE' });
      expect(m.state).toBe('closed');
    });

    it('SET.CLOSE_ON_OUTSIDE_CLICK flips guard at runtime', () => {
      const m = createDialogMachine({ defaultOpen: true });
      m.send({ type: 'SET.CLOSE_ON_OUTSIDE_CLICK', value: false });
      m.send({ type: 'OUTSIDE_CLICK' });
      expect(m.state).toBe('open');
    });
  });

  describe('subscribe', () => {
    it('emits on every transition', () => {
      const m = createDialogMachine();
      const seen: string[] = [];
      m.subscribe(({ state }) => seen.push(state));
      // First emission is the current ('closed') initial snapshot.
      m.send({ type: 'OPEN' });
      m.send({ type: 'CLOSE' });
      m.send({ type: 'OPEN' });
      expect(seen).toEqual(['closed', 'open', 'closed', 'open']);
    });
  });
});
