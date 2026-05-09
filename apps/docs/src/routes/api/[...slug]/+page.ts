import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const pages = import.meta.glob('../../../../../../docs/api/**/*.md', {
  query: '?raw',
  import: 'default',
});

export const load: PageLoad = async ({ params }) => {
  const slug = params.slug;
  // Find the matching page by suffix-match on the path.
  const match = Object.entries(pages).find(([path]) => path.endsWith(`/docs/api/${slug}.md`));
  if (!match) throw error(404, `No API page for "${slug}"`);
  const [, loader] = match;
  const markdown = (await loader()) as string;
  return { slug, markdown };
};
