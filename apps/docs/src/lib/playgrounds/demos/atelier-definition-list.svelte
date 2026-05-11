<script lang="ts">
  import { Vanilla as DL } from '@kumiki/atelier/definition-list';
</script>

<div class="demo">
  <DL.Root layout="inline">
    <DL.Term>Plan</DL.Term>
    <DL.Description>Pro</DL.Description>
    <DL.Term>Renews</DL.Term>
    <DL.Description>2026-12-01</DL.Description>
    <DL.Term>Members</DL.Term>
    <DL.Description>12 / 25 seats</DL.Description>
    <DL.Term>Region</DL.Term>
    <DL.Description>asia-northeast1 (Tokyo)</DL.Description>
  </DL.Root>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
</style>
