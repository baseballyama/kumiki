/**
 * `@kumiki/headless/button` — Layer 3 attachment for the Button component.
 *
 * Button has no FSM (no Layer 2 machine): all state is owned by the
 * caller and flows through props. The Layer 3 controller exists for two
 * reasons:
 *
 * 1. Attribute synchronisation — `aria-busy`, `aria-disabled`,
 *    `data-state` track the `loading` / `disabled` props.
 * 2. Click guard — while loading or disabled, click and key activation
 *    are intercepted at capture phase before the host's handlers run.
 *
 * The controller paints attributes directly on the node so SSR + hydration
 * stay consistent. See `docs/components/button.md` for the spec.
 */
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface ButtonController {
  readonly id: string;
  readonly loading: boolean;
  readonly disabled: boolean;

  setLoading(loading: boolean): void;
  setDisabled(disabled: boolean): void;
  /** Subscribe to (loading | disabled) state changes. */
  subscribe(listener: (snapshot: { loading: boolean; disabled: boolean }) => void): () => void;

  /** Svelte 5 `{@attach}`-compatible attachment for the host element. */
  readonly root: Attachment;
}

export interface CreateButtonOptions {
  loading?: boolean;
  disabled?: boolean;
  id?: string;
}

/** Apply the current (loading, disabled) snapshot to the host node. */
function paint(node: HTMLElement, loading: boolean, disabled: boolean): void {
  if (loading) {
    node.setAttribute('aria-busy', 'true');
    node.setAttribute('data-loading', '');
  } else {
    node.removeAttribute('aria-busy');
    node.removeAttribute('data-loading');
  }

  if (disabled) {
    node.setAttribute('aria-disabled', 'true');
    node.setAttribute('data-disabled', '');
  } else {
    node.removeAttribute('aria-disabled');
    node.removeAttribute('data-disabled');
  }
}

/**
 * Create a Button controller plus its `{@attach}`-compatible root.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { createButton } from '@kumiki/headless/button';
 *   const b = createButton({ loading: false });
 * </script>
 *
 * <button {@attach b.root}>Save</button>
 * ```
 *
 * @when-to-use Direct headless integration when Layer 4's compound API
 *              is too opinionated about the surrounding markup.
 *
 * @anti-pattern Don't reuse a single controller across multiple buttons —
 *               each button owns its own state and listeners.
 */
export function createButton(options: CreateButtonOptions = {}): ButtonController {
  const id = options.id ?? uid('button');
  let loading = options.loading ?? false;
  let disabled = options.disabled ?? false;

  type Listener = (s: { loading: boolean; disabled: boolean }) => void;
  const listeners = new Set<Listener>();

  function notify(): void {
    const snapshot = { loading, disabled };
    for (const l of listeners) l(snapshot);
  }

  const root: Attachment = (node) => {
    if (!node.hasAttribute('type') && node.tagName === 'BUTTON') {
      node.setAttribute('type', 'button');
    }
    if (!node.id) node.id = id;

    paint(node, loading, disabled);

    const intercept = (event: Event): void => {
      if (loading || disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const onKeydown = (event: KeyboardEvent): void => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      if (loading || disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    // Capture-phase so we win over host-attached `onclick` props.
    node.addEventListener('click', intercept, { capture: true });
    node.addEventListener('keydown', onKeydown, { capture: true });

    const unsubscribe = (): void => {
      node.removeEventListener('click', intercept, { capture: true });
      node.removeEventListener('keydown', onKeydown, { capture: true });
    };

    const repaint: Listener = ({ loading: l, disabled: d }) => paint(node, l, d);
    listeners.add(repaint);

    return () => {
      listeners.delete(repaint);
      unsubscribe();
    };
  };

  return {
    id,
    get loading() {
      return loading;
    },
    get disabled() {
      return disabled;
    },
    setLoading(next: boolean) {
      if (loading === next) return;
      loading = next;
      notify();
    },
    setDisabled(next: boolean) {
      if (disabled === next) return;
      disabled = next;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      listener({ loading, disabled });
      return () => listeners.delete(listener);
    },
    root,
  };
}
