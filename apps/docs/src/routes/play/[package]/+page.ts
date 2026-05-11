import { error } from '@sveltejs/kit';
import { findPlayground, LIVE_PLAYGROUNDS } from '$lib/playgrounds/registry.js';
import { findMachineSpec } from '$lib/playgrounds/machine-specs-index.js';
import { SNIPPETS, DEFAULT_SNIPPETS } from '$lib/playgrounds/highlighted-snippets.js';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async ({ params }) => {
  const entry = findPlayground(params.package);
  if (!entry) {
    error(404, `Unknown Kumiki package: ${params.package}`);
  }

  const snippets = SNIPPETS[entry.slug] ?? DEFAULT_SNIPPETS;

  // Eagerly resolve the demo loader — falls back to undefined for non-live packages.
  const demoLoader = entry.live ? LIVE_PLAYGROUNDS[entry.slug] : undefined;

  // Surface the matching FSM `toJSON()` snapshot when one exists. The same
  // snapshot is reused across `machine-`, `attachment-`, and `component-`
  // slugs because Layers 2 / 3 / 4 share the same machine.
  const machineSpec = findMachineSpec(entry.slug);
  const machineSpecJsonUrl = machineSpec ? `/machine-specs/${machineSpec.name}.json` : null;
  const machineSpecVizUrl = machineSpec
    ? `https://stately.ai/viz?source=${encodeURIComponent(`https://kumiki.dev/machine-specs/${machineSpec.name}.json`)}`
    : null;

  return {
    entry,
    snippets,
    hasDemo: Boolean(demoLoader),
    machineSpec,
    machineSpecJsonUrl,
    machineSpecVizUrl,
  };
};
