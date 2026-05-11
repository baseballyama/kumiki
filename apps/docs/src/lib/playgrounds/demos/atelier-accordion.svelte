<script lang="ts">
  import { Vanilla as Accordion } from '@kumiki/atelier/accordion';
  import type { AccordionItem } from '@kumiki/components/accordion';

  type Q = { question: string; answer: string };
  const items: AccordionItem<Q>[] = [
    {
      id: 'q1',
      value: {
        question: 'Why Svelte 5 only?',
        answer: 'Kumiki relies on `{@attach}` (≥ 5.29) and runes — see ADR 0001.',
      },
    },
    {
      id: 'q2',
      value: {
        question: 'Where do styles live?',
        answer:
          'Layer 4 ships no styles. Layer 5 (Atelier) ships styled variants — Tailwind v4 + Vanilla CSS.',
      },
    },
    {
      id: 'q3',
      value: {
        question: 'How are bundle sizes enforced?',
        answer: 'CI runs size-limit per subpath; budgets are documented per component.',
      },
    },
  ];
</script>

<div class="demo">
  <Accordion.Root {items} mode="single" collapsible>
    {#each items as q (q.id)}
      <Accordion.Item value={q}>
        <Accordion.Trigger value={q}>{q.value.question}</Accordion.Trigger>
        <Accordion.Panel value={q}>
          <p>{q.value.answer}</p>
        </Accordion.Panel>
      </Accordion.Item>
    {/each}
  </Accordion.Root>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .demo p {
    margin: 0;
    color: var(--k-ink-2);
    font-size: 14px;
  }
</style>
