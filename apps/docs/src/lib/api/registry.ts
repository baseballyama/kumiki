/*
 * Module discovery for the API reference. Walks every Markdown file emitted
 * by `pnpm typedoc` (output dir `docs/api/`) and produces:
 *
 *   - `ALL_ENTRIES`  the canonical list of public modules (excludes index
 *                    `README.md` files and anything outside our 3 packages).
 *   - `findEntry`    URL-slug → entry lookup for the [...slug] route.
 *   - `buildIndex`   pre-parsed package summaries with member counts.
 *
 * Slug shape is intentionally compact and stable:
 *
 *   docs/api/core/runtime/src.md             →  core/runtime
 *   docs/api/machines/src/namespaces/foo.md  →  machines/foo
 *   docs/api/headless/src/namespaces/foo.md  →  headless/foo
 */

import { quickScan } from './parse.js';
import type { ApiModuleSummary, ApiPackage, ApiPackageId } from './types.js';

const RAW_FILES = import.meta.glob('../../../../../docs/api/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const PACKAGE_META: Record<ApiPackageId, { name: string; tagline: string }> = {
  core: {
    name: 'Core',
    tagline: 'Foundations — runtime, primitives, locale, types.',
  },
  machines: {
    name: 'Machines',
    tagline: 'Layer 2. Pure-TS state machines, framework-agnostic.',
  },
  headless: {
    name: 'Headless',
    tagline: 'Layer 3. Attachment factories ({@attach}) bound to machines.',
  },
};

export interface ModuleEntry {
  slug: string;
  name: string;
  fullName: string;
  packageId: ApiPackageId;
  filePath: string;
}

function pathToEntry(filePath: string): ModuleEntry | null {
  const cleaned = filePath.replace(/^.*\/docs\/api\//, '').replace(/\.md$/, '');
  if (cleaned === 'README' || cleaned.endsWith('/README')) return null;

  const segments = cleaned.split('/');
  const root = segments[0];

  if (root === 'core') {
    const pkg = segments[1];
    if (!pkg) return null;
    return {
      slug: `core/${pkg}`,
      name: pkg,
      fullName: `@kumiki/${pkg}`,
      packageId: 'core',
      filePath,
    };
  }

  if (root === 'machines' || root === 'headless') {
    if (segments[1] !== 'src' || segments[2] !== 'namespaces') return null;
    const ns = segments[3];
    if (!ns) return null;
    return {
      slug: `${root}/${ns}`,
      name: ns,
      fullName: `@kumiki/${root}/${ns}`,
      packageId: root,
      filePath,
    };
  }

  return null;
}

export const ALL_ENTRIES: readonly ModuleEntry[] = Object.keys(RAW_FILES)
  .map((p) => pathToEntry(p))
  .filter((e): e is ModuleEntry => Boolean(e))
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function findEntry(slug: string): ModuleEntry | null {
  return ALL_ENTRIES.find((e) => e.slug === slug) ?? null;
}

export function getRawMarkdown(filePath: string): string {
  return RAW_FILES[filePath] ?? '';
}

export function packageMeta(id: ApiPackageId): { name: string; tagline: string } {
  return PACKAGE_META[id];
}

export function buildIndex(): ApiPackage[] {
  const order: readonly ApiPackageId[] = ['core', 'machines', 'headless'];
  return order.map((id) => {
    const modules: ApiModuleSummary[] = ALL_ENTRIES.filter((e) => e.packageId === id).map((e) => {
      const md = getRawMarkdown(e.filePath);
      const { kindCounts } = quickScan(md);
      const memberCount = Object.values(kindCounts).reduce<number>((a, b) => a + (b ?? 0), 0);
      return {
        slug: e.slug,
        name: e.name,
        fullName: e.fullName,
        packageId: e.packageId,
        memberCount,
        kindCounts,
      };
    });
    return {
      id,
      name: PACKAGE_META[id].name,
      tagline: PACKAGE_META[id].tagline,
      modules,
    };
  });
}
