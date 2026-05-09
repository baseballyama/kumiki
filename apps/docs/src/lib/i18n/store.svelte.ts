/*
 * Reactive UI state for theme, locale, and direction.
 *
 * Exported as singletons so any component can read or update them. Persisted
 * to localStorage; the no-flash inline script in app.html bootstraps the
 * <html> attributes before hydration so dark-mode users never see a flash
 * of light theme.
 */

import { browser } from '$app/environment';
import type { LocaleCode } from './dict.js';
import { isRtl, LOCALES } from './dict.js';

export type Theme = 'light' | 'dark';
export type Direction = 'ltr' | 'rtl';

const THEME_KEY = 'kumiki:theme';
const LOCALE_KEY = 'kumiki:locale';
const DIR_OVERRIDE_KEY = 'kumiki:dirOverride';

function readTheme(): Theme {
  if (!browser) return 'light';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readLocale(): LocaleCode {
  if (!browser) return 'en';
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored && LOCALES.some((l) => l.code === stored)) return stored as LocaleCode;
  return 'en';
}

function readDirOverride(): Direction | null {
  if (!browser) return null;
  const stored = localStorage.getItem(DIR_OVERRIDE_KEY);
  return stored === 'ltr' || stored === 'rtl' ? stored : null;
}

class UiState {
  theme = $state<Theme>(readTheme());
  locale = $state<LocaleCode>(readLocale());
  /** When set, overrides the locale's natural direction (for RTL preview). */
  dirOverride = $state<Direction | null>(readDirOverride());

  /** Effective writing direction. */
  get direction(): Direction {
    return this.dirOverride ?? (isRtl(this.locale) ? 'rtl' : 'ltr');
  }

  setTheme(t: Theme): void {
    this.theme = t;
    if (browser) {
      localStorage.setItem(THEME_KEY, t);
      document.documentElement.setAttribute('data-theme', t);
    }
  }

  toggleTheme(): void {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  setLocale(l: LocaleCode): void {
    this.locale = l;
    // Changing locale resets any user override — natural direction kicks back in.
    this.dirOverride = null;
    if (browser) {
      localStorage.setItem(LOCALE_KEY, l);
      localStorage.removeItem(DIR_OVERRIDE_KEY);
      document.documentElement.setAttribute('lang', l);
      document.documentElement.setAttribute('dir', this.direction);
    }
  }

  toggleDirection(): void {
    const next: Direction = this.direction === 'ltr' ? 'rtl' : 'ltr';
    this.dirOverride = next;
    if (browser) {
      localStorage.setItem(DIR_OVERRIDE_KEY, next);
      document.documentElement.setAttribute('dir', next);
    }
  }
}

export const ui = new UiState();
