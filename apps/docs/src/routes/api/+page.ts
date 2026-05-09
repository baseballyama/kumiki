/**
 * `/api` index — links to every TypeDoc-generated reference page.
 */
import type { PageLoad } from './$types';

// Vite resolves these globs at build time. The TypeDoc output ships at
// repo root `docs/api/`; we resolve relative to apps/docs/.
// Keep `eager: false` so each page lazy-loads its content.
const pages = import.meta.glob('../../../../../docs/api/**/*.md', {
  query: '?raw',
  import: 'default',
});

export interface ApiIndexEntry {
  /** URL slug — `core/runtime/src` etc. */
  slug: string;
  /** Path relative to docs/api/ — used for display. */
  display: string;
}

export const load: PageLoad = async () => {
  const entries: ApiIndexEntry[] = Object.keys(pages)
    .map((path) => {
      // Strip the leading `../../../../../docs/api/` prefix and `.md`.
      const cleaned = path.replace(/^.*\/docs\/api\//, '').replace(/\.md$/, '');
      return { slug: cleaned, display: cleaned };
    })
    .filter((e) => e.slug !== 'README')
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return { entries };
};
