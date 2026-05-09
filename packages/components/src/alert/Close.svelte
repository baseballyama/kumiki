<!--
  @component Alert.Close — button that fires the alert's `onDismiss`.

  Default `aria-label` comes from the active LocaleProvider's
  `messages.alert.dismissLabel`. Override by passing `aria-label`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { ALERT_CONTEXT_KEY, type AlertContextValue } from './context.js';
  import { tryUseLocale } from '../locale-provider/use-locale.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<AlertContextValue>(ALERT_CONTEXT_KEY);
  const locale = tryUseLocale();

  const ariaLabel = $derived(
    (rest['aria-label'] as string | undefined) ?? locale?.messages.alert.dismissLabel ?? 'Dismiss',
  );

  function handleClick(): void {
    controller.dismiss();
  }
</script>

<button {...rest} type="button" aria-label={ariaLabel} data-part="close" onclick={handleClick}>
  {#if children}{@render children()}{/if}
</button>
