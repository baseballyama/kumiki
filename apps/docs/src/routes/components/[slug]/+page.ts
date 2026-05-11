import { error } from '@sveltejs/kit';
import {
  findPlayground,
  LIVE_PLAYGROUNDS,
  PLAYGROUNDS,
  type PlaygroundEntry,
} from '$lib/playgrounds/registry.js';
import { findMachineSpec } from '$lib/playgrounds/machine-specs-index.js';
import {
  SNIPPETS,
  DEFAULT_SNIPPETS,
  type HighlightedSnippet as Snippet,
} from '$lib/playgrounds/highlighted-snippets.js';
import type { PageLoad } from './$types.js';

/**
 * Slug → family. The slug prefix encodes the layer:
 *   `machine-button`     → family `button` (Layer 2)
 *   `attachment-button`  → family `button` (Layer 3)
 *   `component-button`   → family `button` (Layer 4)
 *   `atelier-button`     → family `button` (Layer 5)
 *
 * Foundation packages (`runtime`, `primitives`, `types`, `locale`) have no
 * prefix — their family is the slug itself, and they never have siblings.
 */
function familyForSlug(slug: string): string {
  return slug.replace(/^(machine|attachment|component|atelier)-/, '');
}

function siblingsForFamily(family: string, currentSlug: string): readonly PlaygroundEntry[] {
  return PLAYGROUNDS.filter((p) => familyForSlug(p.slug) === family && p.slug !== currentSlug).sort(
    (a, b) => a.layer - b.layer,
  );
}

function dotPascal(family: string): string {
  return family
    .split('-')
    .map((w) => (w[0]?.toUpperCase() ?? '') + w.slice(1))
    .join('');
}

/**
 * Plain HTML-escape wrapper for synthesized snippets. They share the same
 * shape as `HighlightedSnippet` but skip Shiki — the synthesized templates
 * are short and cross-layer, not the primary teaching surface.
 */
function plainHtml(code: string): string {
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<pre class="shiki"><code>${escaped}</code></pre>`;
}

function syn(title: string, lang: Snippet['lang'], code: string): Snippet {
  return { title, lang, code, html: plainHtml(code) };
}

/**
 * When a sibling has no curated snippet, synthesize a minimal usage example
 * from its package name so the family section never shows a layer with
 * empty code. Layers that genuinely have no userland surface (Layer 0 types,
 * Layer 1 framework-agnostic primitives consumed indirectly) return `null`.
 */
function synthesizeSnippet(entry: PlaygroundEntry): Snippet | null {
  const family = familyForSlug(entry.slug);
  const Pascal = dotPascal(family);
  switch (entry.layer) {
    case 5:
      return syn(
        'Drop-in styled wrapper',
        'svelte',
        `<script lang="ts">
  import { Tailwind as ${Pascal} } from '${entry.name}';
</script>

<${Pascal}.Root />`,
      );
    case 4:
      return syn(
        'Compound usage',
        'svelte',
        `<script lang="ts">
  import { ${Pascal} } from '${entry.name}';
</script>

<${Pascal}.Root>
  <!-- subcomponents go here -->
</${Pascal}.Root>`,
      );
    case 3:
      return syn(
        'Attach to your own DOM',
        'svelte',
        `<script lang="ts">
  import { create${Pascal} } from '${entry.name}';
  const ctl = create${Pascal}({});
</script>

<div {@attach ctl.root}>
  <!-- your markup -->
</div>`,
      );
    case 2:
      return syn(
        'Pure-TS state machine',
        'ts',
        `import { create${Pascal}Machine } from '${entry.name}';

const m = create${Pascal}Machine({});
m.send({ type: '…' });
console.log(m.state, m.context);`,
      );
    default:
      return null;
  }
}

function pickUsageSnippet(
  entry: PlaygroundEntry,
  curated?: ReadonlyArray<Snippet>,
): Snippet | null {
  const set = curated ?? SNIPPETS[entry.slug];
  const found = set?.find((s) => s.lang !== 'bash');
  return found ?? synthesizeSnippet(entry);
}

export const load: PageLoad = async ({ params }) => {
  const entry = findPlayground(params.slug);
  if (!entry) {
    error(404, `Unknown Kumiki package: ${params.slug}`);
  }

  const snippets = SNIPPETS[entry.slug] ?? DEFAULT_SNIPPETS;
  const demoLoader = entry.live ? LIVE_PLAYGROUNDS[entry.slug] : undefined;

  const family = familyForSlug(entry.slug);
  const siblings = siblingsForFamily(family, entry.slug);

  // Pluck the most relevant userland-snippet per sibling layer. We pick the
  // first non-`Install` snippet — that's typically the canonical
  // "this is what you write" example. If a slug has no curated snippet, we
  // synthesize a minimal import-and-render example from the package name so
  // every layer renders something actionable.
  const siblingSnippets: Record<string, Snippet | null> = {};
  for (const sib of siblings) {
    siblingSnippets[sib.slug] = pickUsageSnippet(sib);
  }
  const activeSnippet = pickUsageSnippet(entry, snippets);

  const machineSpec = findMachineSpec(entry.slug);
  const machineSpecJsonUrl = machineSpec ? `/machine-specs/${machineSpec.name}.json` : null;
  const machineSpecVizUrl = machineSpec
    ? `https://stately.ai/viz?source=${encodeURIComponent(`https://kumiki.dev/machine-specs/${machineSpec.name}.json`)}`
    : null;

  return {
    entry,
    snippets,
    hasDemo: Boolean(demoLoader),
    family,
    siblings,
    siblingSnippets,
    activeSnippet,
    machineSpec,
    machineSpecJsonUrl,
    machineSpecVizUrl,
  };
};
