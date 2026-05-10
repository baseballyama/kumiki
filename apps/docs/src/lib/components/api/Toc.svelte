<!--
  Right-rail in-page table of contents. Lists every member of the current
  module, grouped by kind. Active item tracks scroll position via
  IntersectionObserver bound through {@attach}.
-->
<script lang="ts">
  import type { ApiMember, MemberKind } from '$lib/api/types.js';
  import MemberKindLabel from './MemberKindLabel.svelte';

  let { members }: { members: readonly ApiMember[] } = $props();

  const KIND_ORDER: readonly MemberKind[] = [
    'interface',
    'class',
    'type-alias',
    'enum',
    'function',
    'variable',
    'namespace',
  ];

  const groups = $derived(
    KIND_ORDER.map((kind) => ({
      kind,
      items: members.filter((m) => m.kind === kind),
    })).filter((g) => g.items.length > 0),
  );

  let observedSlug = $state<string | null>(null);
  const activeSlug = $derived(observedSlug ?? members[0]?.slug ?? null);

  function trackScroll(_root: HTMLElement) {
    if (typeof IntersectionObserver === 'undefined') return;
    // Snapshot at attach-time. This component is re-mounted on every
    // navigation so a re-snapshot per attach matches the data lifetime.
    const ms = members;
    const visible = new Set<string>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        for (const m of ms) {
          if (visible.has(m.slug)) {
            observedSlug = m.slug;
            break;
          }
        }
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    );
    for (const m of ms) {
      const el = document.getElementById(m.slug);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }
</script>

<aside class="toc" {@attach trackScroll} aria-label="On this page">
  <p class="title">On this page</p>
  <nav>
    {#each groups as group (group.kind)}
      <div class="group">
        <div class="group-head">
          <MemberKindLabel kind={group.kind} size="sm" />
          <span class="count">{group.items.length}</span>
        </div>
        <ul>
          {#each group.items as m (m.slug)}
            <li>
              <a
                href="#{m.slug}"
                class:active={activeSlug === m.slug}
                data-kind={m.kind}
                title={m.name}
              >
                {m.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
</aside>

<style>
  .toc {
    width: var(--k-toc-w);
    flex-shrink: 0;
    position: sticky;
    top: 96px;
    align-self: flex-start;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 4px 0 24px;
  }
  .title {
    font-family: var(--k-font-mono);
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    margin: 0 0 12px;
    padding-inline-start: 12px;
  }
  .group + .group {
    margin-top: 18px;
  }
  .group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 6px;
    border-bottom: 1px solid var(--k-line-1);
    margin-bottom: 6px;
  }
  .count {
    font-family: var(--k-font-mono);
    font-size: 10px;
    color: var(--k-ink-4);
    font-variant-numeric: tabular-nums;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li a {
    display: block;
    font-family: var(--k-font-mono);
    font-size: 12.5px;
    color: var(--k-ink-3);
    text-decoration: none;
    padding: 4px 12px;
    border-inline-start: 2px solid transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition:
      color var(--k-dur-fast),
      border-color var(--k-dur-fast),
      background var(--k-dur-fast);
  }
  li a:hover {
    color: var(--k-ink-1);
    background: var(--k-surface-1);
  }
  li a.active {
    color: var(--k-ink-1);
    border-inline-start-color: var(--k-shu);
    font-weight: 600;
  }
  :global([data-theme='dark']) li a.active {
    border-inline-start-color: var(--k-shu);
  }

  @media (max-width: 1100px) {
    .toc {
      display: none;
    }
  }
</style>
