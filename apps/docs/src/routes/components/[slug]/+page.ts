import { error } from '@sveltejs/kit';
import { findPlayground, LIVE_PLAYGROUNDS } from '$lib/playgrounds/registry.js';
import { SNIPPETS, DEFAULT_SNIPPETS } from '$lib/playgrounds/snippets.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ params }) => {
  const entry = findPlayground(params.slug);
  if (!entry) {
    error(404, `Unknown Kumiki package: ${params.slug}`);
  }

  const snippets = SNIPPETS[entry.slug] ?? DEFAULT_SNIPPETS;
  const demoLoader = entry.live ? LIVE_PLAYGROUNDS[entry.slug] : undefined;

  return {
    entry,
    snippets,
    hasDemo: Boolean(demoLoader),
  };
};
