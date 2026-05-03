import { error } from '@sveltejs/kit';
import { findPlayground, LIVE_PLAYGROUNDS } from '$lib/playgrounds/registry.js';
import { SNIPPETS, DEFAULT_SNIPPETS } from '$lib/playgrounds/snippets.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ params }) => {
  const entry = findPlayground(params.package);
  if (!entry) {
    error(404, `Unknown Kumiki package: ${params.package}`);
  }

  const snippets = SNIPPETS[entry.slug] ?? DEFAULT_SNIPPETS;

  // Eagerly resolve the demo loader — falls back to undefined for non-live packages.
  const demoLoader = entry.live ? LIVE_PLAYGROUNDS[entry.slug] : undefined;

  return {
    entry,
    snippets,
    hasDemo: Boolean(demoLoader),
  };
};
