/**
 * `/api` index — pre-parsed package summaries (built at module-load time
 * from glob-imported Markdown). No raw Markdown ships to the client.
 */
import { buildIndex } from '$lib/api/registry.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  return { packages: buildIndex() };
};
