<!--
  @component TimeField.Label — `<label>` whose id wires into Root's
  `aria-labelledby`. Clicking it moves focus to the first segment.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { uid } from '@kumiki/primitives/id';
  import { TIME_FIELD_CONTEXT_KEY, type TimeFieldContextValue } from './context.js';

  type Props = {
    id?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { id, children, ...rest }: Props = $props();

  const ctxOptional = getContext<TimeFieldContextValue | undefined>(TIME_FIELD_CONTEXT_KEY);
  if (!ctxOptional) {
    throw new Error('<TimeField.Label> must be inside <TimeField.Root>.');
  }
  const ctx: TimeFieldContextValue = ctxOptional;

  // svelte-ignore state_referenced_locally
  const labelId = id ?? uid('time-field-label');

  function register(): () => void {
    return ctx.registerLabel(labelId);
  }
</script>

<label {...rest} id={labelId} {@attach register}>
  {#if children}{@render children()}{/if}
</label>
