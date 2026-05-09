/*
 * Aggregator for the per-locale dictionaries. Each locale lives in its own
 * file under `./locales/<lang>.ts` and exports a `dict: DocDict`. Adding a
 * new locale is a one-line change here plus one new file.
 *
 * The shape and locale list live in `./types.ts`; re-exported here for
 * backwards compatibility with existing consumers.
 */

export type { DocDict, LocaleCode } from './types.js';
export { LOCALES, RTL_LOCALES } from './types.js';

import type { LocaleCode, DocDict } from './types.js';
import { dict as en } from './locales/en.js';
import { dict as ja } from './locales/ja.js';
import { dict as zhHans } from './locales/zh-Hans.js';
import { dict as zhHant } from './locales/zh-Hant.js';
import { dict as ko } from './locales/ko.js';
import { dict as es } from './locales/es.js';
import { dict as fr } from './locales/fr.js';
import { dict as de } from './locales/de.js';
import { dict as ar } from './locales/ar.js';
import { dict as he } from './locales/he.js';

const DICT: Record<LocaleCode, DocDict> = {
  en,
  ja,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  ko,
  es,
  fr,
  de,
  ar,
  he,
};

export function dict(locale: LocaleCode): DocDict {
  return DICT[locale] ?? en;
}

export function isRtl(locale: LocaleCode): boolean {
  return locale === 'ar' || locale === 'he';
}
