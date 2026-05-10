<!--
  Module page — hero + grouped member cards + right-rail TOC.
-->
<script lang="ts">
  import type { PageProps } from './$types';
  import type { MemberKind } from '$lib/api/types.js';
  import ModuleHero from '$lib/components/api/ModuleHero.svelte';
  import MemberCard from '$lib/components/api/MemberCard.svelte';
  import MemberKindLabel from '$lib/components/api/MemberKindLabel.svelte';
  import Toc from '$lib/components/api/Toc.svelte';

  let { data }: PageProps = $props();

  const KIND_ORDER: readonly MemberKind[] = [
    'interface',
    'class',
    'type-alias',
    'enum',
    'function',
    'variable',
    'namespace',
  ];

  const sections = $derived(
    KIND_ORDER.map((kind) => ({
      kind,
      members: data.module.members.filter((m) => m.kind === kind),
    })).filter((s) => s.members.length > 0),
  );

  const sectionTitle: Record<MemberKind, string> = {
    interface: 'Interfaces',
    class: 'Classes',
    'type-alias': 'Type Aliases',
    enum: 'Enumerations',
    function: 'Functions',
    variable: 'Variables',
    namespace: 'Namespaces',
  };
</script>

<svelte:head>
  <title>{data.module.fullName} · API · Kumiki</title>
  <meta
    name="description"
    content={`Public API of ${data.module.fullName} — ${data.module.members.length} member${data.module.members.length === 1 ? '' : 's'}.`}
  />
</svelte:head>

<div class="page">
  <article class="content">
    <ModuleHero module={data.module} />

    {#if data.module.members.length === 0}
      <p class="empty">
        This module has no public members. Anything here was deliberately marked
        <code>@internal</code> or filtered out.
      </p>
    {:else}
      {#each sections as section (section.kind)}
        <section class="kind-block" id="kind-{section.kind}">
          <header class="kind-head">
            <MemberKindLabel kind={section.kind} />
            <span class="kind-title">{sectionTitle[section.kind]}</span>
            <span class="kind-rule" aria-hidden="true"></span>
            <span class="kind-count">{section.members.length}</span>
          </header>

          <div class="members">
            {#each section.members as m (m.slug)}
              <MemberCard member={m} />
            {/each}
          </div>
        </section>
      {/each}
    {/if}
  </article>

  {#if data.module.members.length > 0}
    <Toc members={data.module.members} />
  {/if}
</div>

<style>
  .page {
    display: flex;
    align-items: flex-start;
    gap: 48px;
    max-width: 100%;
  }
  .content {
    flex: 1;
    min-width: 0;
    max-width: 760px;
  }

  .empty {
    padding: 32px;
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    color: var(--k-ink-3);
  }
  .empty code {
    font-family: var(--k-font-mono);
    font-size: 0.92em;
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: 3px;
    padding: 0 0.35em;
    color: var(--k-ink-2);
  }

  .kind-block {
    margin-bottom: 56px;
  }
  .kind-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }
  .kind-title {
    font-family: var(--k-font-display);
    font-size: 1.1rem;
    color: var(--k-ink-2);
    letter-spacing: -0.01em;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  .kind-rule {
    flex: 1;
    height: 1px;
    background: var(--k-line-1);
  }
  .kind-count {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-4);
    font-variant-numeric: tabular-nums;
  }
  .members {
    display: grid;
    gap: 20px;
  }
</style>
