import { error } from '@sveltejs/kit';
import { findEntry, getRawMarkdown } from '$lib/api/registry.js';
import { parseModule } from '$lib/api/parse.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const entry = findEntry(params.slug);
  if (!entry) throw error(404, `No API page for "${params.slug}"`);

  const markdown = getRawMarkdown(entry.filePath);
  const module = parseModule({
    slug: entry.slug,
    name: entry.name,
    fullName: entry.fullName,
    packageId: entry.packageId,
    markdown,
  });

  return { module };
};
