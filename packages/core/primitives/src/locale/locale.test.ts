import { describe, expect, it } from 'vitest';
import { LOCALE_CONTEXT_KEY, inferDirection } from './index.ts';

describe('inferDirection', () => {
  it('returns "ltr" for English', () => {
    expect(inferDirection('en')).toBe('ltr');
    expect(inferDirection('en-US')).toBe('ltr');
  });

  it('returns "rtl" for Arabic and Hebrew', () => {
    expect(inferDirection('ar')).toBe('rtl');
    expect(inferDirection('he')).toBe('rtl');
  });

  it('strips region / script subtags before lookup', () => {
    expect(inferDirection('ar-EG')).toBe('rtl');
    expect(inferDirection('he-IL')).toBe('rtl');
    expect(inferDirection('zh-Hans-CN')).toBe('ltr');
  });

  it('handles underscore subtag separator', () => {
    expect(inferDirection('fa_IR')).toBe('rtl');
  });

  it('is case-insensitive on the primary tag', () => {
    expect(inferDirection('AR')).toBe('rtl');
    expect(inferDirection('Ar-eg')).toBe('rtl');
  });

  it('covers v1.0 RTL languages plus future ones from CLDR', () => {
    for (const code of ['ar', 'fa', 'he', 'ps', 'sd', 'ug', 'ur', 'yi']) {
      expect(inferDirection(code)).toBe('rtl');
    }
  });

  it('falls back to "ltr" for unknown locales', () => {
    expect(inferDirection('xx')).toBe('ltr');
    expect(inferDirection('')).toBe('ltr');
  });
});

describe('LOCALE_CONTEXT_KEY', () => {
  it('is a process-stable Symbol.for key', () => {
    expect(typeof LOCALE_CONTEXT_KEY).toBe('symbol');
    expect(LOCALE_CONTEXT_KEY).toBe(Symbol.for('kumiki.locale'));
  });
});
