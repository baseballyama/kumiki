<!--
  Small-caps mono label that names a member kind, prefixed with a
  pigment-coloured glyph. Kept as a self-contained piece so it can be
  reused in the Toc + MemberCard headers + sidebar mini-pills.
-->
<script lang="ts">
  import type { MemberKind } from '$lib/api/types.js';

  let { kind, size = 'md' }: { kind: MemberKind; size?: 'sm' | 'md' } = $props();

  const META: Record<MemberKind, { label: string; glyph: string; pigment: string }> = {
    interface: { label: 'interface', glyph: '◇', pigment: 'var(--k-ai)' },
    'type-alias': { label: 'type', glyph: '○', pigment: 'var(--k-matcha)' },
    function: { label: 'function', glyph: 'ƒ', pigment: 'var(--k-shu)' },
    class: { label: 'class', glyph: '▣', pigment: 'var(--k-yamabuki)' },
    enum: { label: 'enum', glyph: '☰', pigment: 'var(--k-yamabuki)' },
    variable: { label: 'const', glyph: '•', pigment: 'var(--k-ink-3)' },
    namespace: { label: 'namespace', glyph: '❖', pigment: 'var(--k-ai)' },
  };

  const meta = $derived(META[kind]);
</script>

<span class="kind kind--{size}" data-kind={kind} style="--kind-color: {meta.pigment}">
  <span class="glyph" aria-hidden="true">{meta.glyph}</span>
  <span class="label">{meta.label}</span>
</span>

<style>
  .kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--k-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--kind-color);
    line-height: 1;
    user-select: none;
  }
  .kind--md {
    font-size: 10.5px;
  }
  .kind--sm {
    font-size: 9.5px;
    gap: 4px;
  }
  .glyph {
    font-size: 13px;
    line-height: 1;
    transform: translateY(0.5px);
  }
  .kind--sm .glyph {
    font-size: 11px;
  }
  .label {
    font-weight: 600;
  }
</style>
