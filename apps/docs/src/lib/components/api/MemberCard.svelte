<!--
  Single-member card. Visual structure:
  ┌──┬──────────────────────────────────────────────────────┐
  │  │ KIND-LABEL                          source.ts · L42 ↗│
  │  │ name() / Name                                         │
  │  │ ┌──────────────────────────────────────────────────┐ │
  │  │ │ <signature>                                      │ │
  │  │ └──────────────────────────────────────────────────┘ │
  │  │ description prose                                     │
  │  │ ── Type Parameters ──                                 │
  │  │ ── Properties / Parameters ──                         │
  │  │ ── Returns ──                                         │
  │  │ ── Tags (when-to-use, anti-pattern, see) ──           │
  └──┴──────────────────────────────────────────────────────┘
   ↑ 2px pigment-coloured left rule keyed off the kind.
-->
<script lang="ts">
  import type { ApiMember } from '$lib/api/types.js';
  import MemberKindLabel from './MemberKindLabel.svelte';
  import Markdown from './Markdown.svelte';
  import SourceLink from './SourceLink.svelte';

  let { member }: { member: ApiMember } = $props();

  // Lookup of tag-name -> display copy. Falls back to the raw key for any
  // tag we don't have a special icon for.
  const TAG_DECOR: Record<string, { tone: 'note' | 'warn' | 'info' | 'cite'; mark: string }> = {
    'When-to-use': { tone: 'note', mark: '◆' },
    'Anti-pattern': { tone: 'warn', mark: '⚠' },
    See: { tone: 'cite', mark: '↗' },
    Example: { tone: 'info', mark: '⌘' },
    Throws: { tone: 'warn', mark: '⚡' },
    Deprecated: { tone: 'warn', mark: '✕' },
    Default: { tone: 'info', mark: '=' },
    Remarks: { tone: 'note', mark: '※' },
  };

  const tagDecor = (name: string) => TAG_DECOR[name] ?? { tone: 'note' as const, mark: '·' };
</script>

<article class="card" data-kind={member.kind} id={member.slug}>
  <header class="head">
    <div class="meta">
      <MemberKindLabel kind={member.kind} />
      {#if member.source}
        <SourceLink source={member.source} />
      {/if}
    </div>
    <h3 class="title">
      <a class="anchor" href="#{member.slug}" aria-label="Permalink">#</a>
      <span class="name">{member.name}</span>
      {#if member.kind === 'function'}<span class="parens">(&nbsp;)</span>{/if}
    </h3>
  </header>

  {#if member.signature}
    <div class="signature">
      <Markdown text={member.signature} mode="signature" />
    </div>
  {/if}

  {#if member.description}
    <div class="desc">
      <Markdown text={member.description} mode="prose" />
    </div>
  {/if}

  {#if member.typeParameters && member.typeParameters.length > 0}
    <section class="block">
      <h4 class="block-head">Type Parameters</h4>
      <dl class="dl">
        {#each member.typeParameters as tp (tp.name)}
          <div class="row">
            <dt><code class="rowname">{tp.name}</code></dt>
            <dd>
              {#if tp.constraint}
                <Markdown text={tp.constraint} mode="signature" />
              {/if}
            </dd>
          </div>
        {/each}
      </dl>
    </section>
  {/if}

  {#if member.properties && member.properties.length > 0}
    <section class="block">
      <h4 class="block-head">{member.kind === 'interface' ? 'Members' : 'Properties'}</h4>
      <dl class="dl">
        {#each member.properties as p (p.name)}
          <div class="row" id="{member.slug}-{p.name}">
            <dt>
              <code class="rowname">
                {p.name}{#if p.optional}<span class="opt">?</span>{/if}
              </code>
            </dt>
            <dd>
              <Markdown text={p.signature} mode="signature" />
              {#if p.description}
                <div class="row-desc"><Markdown text={p.description} mode="prose" /></div>
              {/if}
            </dd>
          </div>
        {/each}
      </dl>
    </section>
  {/if}

  {#if member.parameters && member.parameters.length > 0}
    <section class="block">
      <h4 class="block-head">Parameters</h4>
      <dl class="dl">
        {#each member.parameters as p (p.name)}
          <div class="row">
            <dt>
              <code class="rowname">
                {p.name}{#if p.optional}<span class="opt">?</span>{/if}
              </code>
            </dt>
            <dd>
              <Markdown text={p.type} mode="signature" />
              {#if p.description}
                <div class="row-desc"><Markdown text={p.description} mode="prose" /></div>
              {/if}
            </dd>
          </div>
        {/each}
      </dl>
    </section>
  {/if}

  {#if member.returns}
    <section class="block">
      <h4 class="block-head">Returns</h4>
      <Markdown text={member.returns.type} mode="signature" />
    </section>
  {/if}

  {#if member.tags && member.tags.length > 0}
    <section class="tags">
      {#each member.tags as tag (tag.name)}
        {@const decor = tagDecor(tag.name)}
        <aside class="tag" data-tone={decor.tone}>
          <header class="tag-head">
            <span class="tag-mark" aria-hidden="true">{decor.mark}</span>
            <span class="tag-name">{tag.name}</span>
          </header>
          <div class="tag-body">
            <Markdown text={tag.text} mode="prose" />
          </div>
        </aside>
      {/each}
    </section>
  {/if}
</article>

<style>
  .card {
    position: relative;
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px 28px 28px;
    /* Pigment-keyed left rule. */
    border-inline-start-width: 2px;
    border-inline-start-color: var(--card-color, var(--k-line-2));
    scroll-margin-top: 96px;
    transition: box-shadow var(--k-dur-fast);
  }
  .card[data-kind='interface'] {
    --card-color: var(--k-ai);
  }
  .card[data-kind='type-alias'] {
    --card-color: var(--k-matcha);
  }
  .card[data-kind='function'] {
    --card-color: var(--k-shu);
  }
  .card[data-kind='class'] {
    --card-color: var(--k-yamabuki);
  }
  .card[data-kind='enum'] {
    --card-color: var(--k-yamabuki);
  }
  .card[data-kind='variable'] {
    --card-color: var(--k-ink-3);
  }
  .card[data-kind='namespace'] {
    --card-color: var(--k-ai);
  }
  .card:target {
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--card-color) 24%, transparent);
  }
  .head {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 14px;
  }
  .title {
    font-family: var(--k-font-display);
    font-size: clamp(1.2rem, 1.05rem + 0.6vw, 1.55rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--k-ink-1);
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 4px;
    font-variation-settings:
      'opsz' 96,
      'SOFT' 30;
  }
  .title .name {
    font-family: var(--k-font-mono);
    font-weight: 600;
    font-size: 0.92em;
    letter-spacing: -0.01em;
  }
  .title .parens {
    font-family: var(--k-font-mono);
    font-size: 0.85em;
    color: var(--k-ink-4);
    letter-spacing: -0.05em;
  }
  .anchor {
    color: var(--k-ink-5);
    font-family: var(--k-font-mono);
    font-size: 0.7em;
    margin-inline-end: 2px;
    text-decoration: none;
    opacity: 0;
    transition: opacity var(--k-dur-fast);
  }
  .card:hover .anchor,
  .anchor:focus-visible {
    opacity: 1;
    color: var(--card-color);
  }

  .signature {
    margin-top: 16px;
  }
  .desc {
    margin-top: 16px;
    max-width: 64ch;
  }

  .block {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px dashed var(--k-line-1);
  }
  .block-head {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-3);
    margin: 0 0 12px;
  }

  .dl {
    margin: 0;
    display: grid;
    grid-template-columns: minmax(7rem, max-content) 1fr;
    gap: 12px 24px;
  }
  .row {
    display: contents;
  }
  .row dt {
    margin: 0;
    padding-top: 13px;
  }
  .row dd {
    margin: 0;
    min-width: 0;
  }
  .rowname {
    font-family: var(--k-font-mono);
    font-size: 12.5px;
    color: var(--k-ink-1);
    background: transparent;
    border: 0;
    padding: 0;
  }
  .rowname .opt {
    color: var(--k-ink-4);
    margin-inline-start: -1px;
  }
  .row-desc {
    margin-top: 8px;
    color: var(--k-ink-3);
  }

  .tags {
    margin-top: 24px;
    display: grid;
    gap: 12px;
  }
  .tag {
    --tone: var(--k-ink-3);
    border: 1px solid var(--k-line-1);
    border-inline-start: 2px solid var(--tone);
    border-radius: var(--k-radius-sm);
    padding: 14px 18px;
    background: color-mix(in oklab, var(--k-surface-2) 60%, transparent);
  }
  .tag[data-tone='note'] {
    --tone: var(--k-ink-4);
  }
  .tag[data-tone='warn'] {
    --tone: var(--k-yamabuki);
    background: color-mix(in oklab, var(--k-yamabuki-soft) 35%, var(--k-surface-1));
  }
  .tag[data-tone='info'] {
    --tone: var(--k-ai);
    background: color-mix(in oklab, var(--k-ai-soft) 30%, var(--k-surface-1));
  }
  .tag[data-tone='cite'] {
    --tone: var(--k-shu);
  }
  .tag-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--k-font-mono);
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--tone);
    margin-bottom: 8px;
    font-weight: 600;
  }
  .tag-mark {
    font-size: 12px;
  }
  .tag-body {
    color: var(--k-ink-2);
  }

  @media (max-width: 600px) {
    .card {
      padding: 20px 18px;
    }
    .dl {
      grid-template-columns: 1fr;
      gap: 4px 0;
    }
    .row dt {
      padding-top: 0;
    }
  }
</style>
