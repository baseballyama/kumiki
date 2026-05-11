import { error } from '@sveltejs/kit';
import {
  findPlayground,
  LIVE_PLAYGROUNDS,
  PLAYGROUNDS,
  type PlaygroundEntry,
} from '$lib/playgrounds/registry.js';
import { findMachineSpec, type MachineSpecMeta } from '$lib/playgrounds/machine-specs-index.js';
import {
  SNIPPETS,
  DEFAULT_SNIPPETS,
  type HighlightedSnippet as Snippet,
} from '$lib/playgrounds/highlighted-snippets.js';
import type { PageLoad } from './$types.js';

/**
 * Slug → family. The slug prefix encodes the layer:
 *   `machine-accordion`     → family `accordion` (Layer 2)
 *   `attachment-accordion`  → family `accordion` (Layer 3)
 *   `component-accordion`   → family `accordion` (Layer 4)
 *   `atelier-accordion`     → family `accordion` (Layer 5)
 *
 * Foundation packages (`runtime`, `primitives`, `types`, `locale`) have no
 * prefix — their family is the slug itself, and they never have siblings.
 */
function familyForSlug(slug: string): string {
  return slug.replace(/^(machine|attachment|component|atelier)-/, '');
}

function dotPascal(family: string): string {
  return family
    .split('-')
    .map((w) => (w[0]?.toUpperCase() ?? '') + w.slice(1))
    .join('');
}

function plainHtml(code: string): string {
  const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<pre class="shiki"><code>${escaped}</code></pre>`;
}

function syn(title: string, lang: Snippet['lang'], code: string): Snippet {
  return { title, lang, code, html: plainHtml(code) };
}

/**
 * When a layer has no curated snippet, synthesize a minimal usage example from
 * its package name so every layer panel renders something actionable.
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
  import { Vanilla as ${Pascal} } from '${entry.name}';
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

export interface LayerPanelData {
  readonly entry: PlaygroundEntry;
  readonly snippets: ReadonlyArray<Snippet>;
  readonly hasLive: boolean;
  readonly machineSpec: MachineSpecMeta | undefined;
}

export const load: PageLoad = async ({ params }) => {
  const entry = findPlayground(params.slug);
  if (!entry) {
    error(404, `Unknown Kumiki package: ${params.slug}`);
  }

  const family = familyForSlug(entry.slug);

  // Build the full layer cross-section for this family, sorted ascending.
  const familyEntries = [...PLAYGROUNDS]
    .filter((p) => familyForSlug(p.slug) === family)
    .sort((a, b) => a.layer - b.layer);

  const layers: ReadonlyArray<LayerPanelData> = familyEntries.map((e) => {
    const curated = SNIPPETS[e.slug];
    let snippets: ReadonlyArray<Snippet>;
    if (curated && curated.length > 0) {
      snippets = curated;
    } else {
      const fallback = synthesizeSnippet(e);
      snippets = fallback ? [fallback] : DEFAULT_SNIPPETS;
    }
    return {
      entry: e,
      snippets,
      hasLive: Boolean(LIVE_PLAYGROUNDS[e.slug]),
      machineSpec: e.layer === 2 ? findMachineSpec(e.slug) : undefined,
    };
  });

  // Pick the canonical hero entry — prefer L5 (most visually polished),
  // then fall back through L4, L3, L2. We display the family identity in
  // the hero rather than the URL-slug's specific entry so visitors landing
  // on any layer's URL get the same first impression.
  const heroEntry =
    familyEntries.find((e) => e.layer === 5) ??
    familyEntries.find((e) => e.layer === 4) ??
    familyEntries.find((e) => e.layer === 3) ??
    entry;

  return {
    entry,
    heroEntry,
    family,
    layers,
  };
};
