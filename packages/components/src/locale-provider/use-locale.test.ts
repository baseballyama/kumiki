/**
 * Smoke tests for the static surface of the locale-provider exports.
 *
 * The full provider-→-consumer flow is exercised by the docs e2e suite
 * (real Svelte tree). Here we just check that the public surface exists
 * and the error class behaves correctly — `getContext` itself throws when
 * called outside a component instance, which is unrelated to our intent.
 */
import { describe, expect, it } from 'vitest';
import { LOCALE_CONTEXT_KEY } from './context.ts';
import { LocaleProviderMissingError, tryUseLocale, useLocale } from './use-locale.ts';

describe('locale-provider exports', () => {
  it('exposes LOCALE_CONTEXT_KEY as a process-stable Symbol', () => {
    expect(typeof LOCALE_CONTEXT_KEY).toBe('symbol');
    expect(LOCALE_CONTEXT_KEY).toBe(Symbol.for('kumiki.locale'));
  });

  it('exposes useLocale and tryUseLocale as callable functions', () => {
    expect(typeof useLocale).toBe('function');
    expect(typeof tryUseLocale).toBe('function');
  });
});

describe('LocaleProviderMissingError', () => {
  it('is an Error subclass with a useful name', () => {
    const err = new LocaleProviderMissingError();
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('LocaleProviderMissingError');
  });

  it('mentions the missing <LocaleProvider> in its message', () => {
    expect(new LocaleProviderMissingError().message).toMatch(/<LocaleProvider>/);
  });
});
