/*
 * Tiny resolver for per-locale content components.
 *
 * Usage:
 *   import En from '$content/docs/getting-started/en.svelte';
 *   import Ja from '$content/docs/getting-started/ja.svelte';
 *   const Body = pickLocaleComponent({ en: En, ja: Ja });
 *   <Body />
 *
 * The fallback locale is `en`. Adding a new locale is a one-line change
 * in the map; the page never needs to know about i18n.
 */

import type { Component } from 'svelte';
import { ui } from './store.svelte.js';
import type { LocaleCode } from './dict.js';

export type LocaleMap = Partial<Record<LocaleCode, Component>>;

/** Reactive: re-runs whenever `ui.locale` changes. Returns en when missing. */
export function pickLocaleComponent(map: LocaleMap): Component {
  const fallback = map.en;
  if (!fallback) {
    throw new Error('pickLocaleComponent: every locale map must include `en` as the fallback.');
  }
  return map[ui.locale] ?? fallback;
}
