<!--
  @component Alert.Root — page-level message surface.

  Maps `severity` to `role` + `aria-live`:
  - error → role="alert" + aria-live="assertive"
  - others → role="status" + aria-live="polite"

  Override via the `live` prop.

  When `dismissible`, Escape on a focused descendant fires `onDismiss`,
  and the consumer should render `<Alert.Close>` to expose a button.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { AlertSeverity, AlertLive } from '@kumiki/headless/alert';
  export type { AlertSeverity, AlertLive };

  type BaseProps = {
    severity?: AlertSeverity;
    live?: AlertLive;
    dismissible?: boolean;
    onDismiss?: () => void;
    id?: string;
    icon?: Snippet<[{ severity: AlertSeverity }]>;
    children: Snippet;
    [key: string]: unknown;
  };

  // When the consumer doesn't include <Alert.Title>, an explicit
  // accessible name is required.
  export type Props =
    | BaseProps
    | (BaseProps & { 'aria-label': string })
    | (BaseProps & { 'aria-labelledby': string });
</script>

<script lang="ts">
  import { onDestroy, setContext, untrack } from 'svelte';
  import { createAlert } from '@kumiki/headless/alert';
  import { ALERT_CONTEXT_KEY, type AlertContextValue } from './context.js';

  let {
    severity = 'info',
    live,
    dismissible = false,
    onDismiss,
    id,
    icon,
    children,
    ...rest
  }: Props = $props();

  const controller = untrack(() =>
    createAlert({
      severity,
      live,
      dismissible,
      onDismiss,
      id,
    }),
  );

  let snapSeverity = $state(controller.severity);
  const unsub = controller.subscribe(({ severity: s }) => {
    snapSeverity = s;
  });
  onDestroy(unsub);

  $effect(() => {
    if (severity !== controller.severity) controller.setSeverity(severity);
  });

  setContext<AlertContextValue>(ALERT_CONTEXT_KEY, {
    get controller() {
      return controller;
    },
  } as AlertContextValue);
</script>

<div
  {...rest}
  data-severity={snapSeverity}
  data-dismissible={dismissible ? '' : undefined}
  {@attach controller.root}
>
  {#if icon}<span data-component-part="icon" aria-hidden="true"
      >{@render icon({ severity: snapSeverity })}</span
    >{/if}
  {@render children()}
</div>
