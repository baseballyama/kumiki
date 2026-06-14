/**
 * `@kumiki/headless/alert` — Layer 3 attachment for the Alert component.
 *
 * Alert has no FSM. The controller manages:
 * - id triplet (root, title, description) for `aria-labelledby` / `aria-describedby`
 * - role + aria-live mapping based on severity / explicit live override
 * - optional dismiss handler (Escape key while focused inside the alert)
 *
 * @see docs/components/alert.md
 */
import { uid } from '@kumiki/primitives/id';

export type Attachment = (node: HTMLElement) => void | (() => void);

export type AlertSeverity = 'info' | 'success' | 'warn' | 'error';
export type AlertLive = 'polite' | 'assertive' | 'off';

export interface CreateAlertOptions {
  severity?: AlertSeverity;
  /** Override the severity-derived role/live. Default: error → assertive, others → polite. */
  live?: AlertLive;
  dismissible?: boolean;
  onDismiss?: () => void;
  id?: string;
}

export interface AlertController {
  readonly id: string;
  readonly titleId: string;
  readonly descriptionId: string;
  readonly severity: AlertSeverity;
  readonly role: 'status' | 'alert';
  readonly live: AlertLive;
  readonly dismissible: boolean;

  /** Programmatic dismiss — fires `onDismiss`. Idempotent. */
  dismiss(): void;

  setSeverity(severity: AlertSeverity): void;

  /** Subscribe to severity changes. */
  subscribe(listener: (snapshot: { severity: AlertSeverity }) => void): () => void;

  readonly root: Attachment;
}

function deriveRoleLive(
  severity: AlertSeverity,
  override?: AlertLive,
): {
  role: 'status' | 'alert';
  live: AlertLive;
} {
  if (override) {
    return { role: override === 'assertive' ? 'alert' : 'status', live: override };
  }
  if (severity === 'error') return { role: 'alert', live: 'assertive' };
  return { role: 'status', live: 'polite' };
}

function paint(node: HTMLElement, role: 'status' | 'alert', live: AlertLive): void {
  node.setAttribute('role', role);
  if (live === 'off') {
    node.removeAttribute('aria-live');
  } else {
    node.setAttribute('aria-live', live);
  }
  node.setAttribute('aria-atomic', 'true');
}

/**
 * Create an Alert controller plus the root attachment.
 *
 * @when-to-use Direct headless integration when Layer 4's compound API is too
 *              opinionated about the surrounding markup.
 */
export function createAlert(options: CreateAlertOptions = {}): AlertController {
  const id = options.id ?? uid('alert');
  const titleId = `${id}-title`;
  const descriptionId = `${id}-desc`;

  let severity: AlertSeverity = options.severity ?? 'info';
  const liveOverride = options.live;
  const dismissible = options.dismissible ?? false;

  const listeners = new Set<(s: { severity: AlertSeverity }) => void>();

  const root: Attachment = (node) => {
    if (!node.id) node.id = id;
    const apply = (): void => {
      const { role, live } = deriveRoleLive(severity, liveOverride);
      paint(node, role, live);
      // Name/describe the live region only when the referenced elements
      // exist — a dangling reference would make screen readers announce
      // nothing. A consumer-supplied aria-label takes precedence.
      if (!node.hasAttribute('aria-label')) {
        if (node.ownerDocument?.getElementById(titleId)) {
          node.setAttribute('aria-labelledby', titleId);
        } else {
          node.removeAttribute('aria-labelledby');
        }
      }
      if (node.ownerDocument?.getElementById(descriptionId)) {
        node.setAttribute('aria-describedby', descriptionId);
      } else {
        node.removeAttribute('aria-describedby');
      }
    };
    apply();

    const onKeydown = (event: KeyboardEvent): void => {
      if (!dismissible) return;
      if (event.key !== 'Escape') return;
      event.preventDefault();
      options.onDismiss?.();
    };

    const repaint = (): void => apply();
    listeners.add(repaint);
    node.addEventListener('keydown', onKeydown);

    return () => {
      listeners.delete(repaint);
      node.removeEventListener('keydown', onKeydown);
    };
  };

  return {
    id,
    titleId,
    descriptionId,
    get severity() {
      return severity;
    },
    get role() {
      return deriveRoleLive(severity, liveOverride).role;
    },
    get live() {
      return deriveRoleLive(severity, liveOverride).live;
    },
    dismissible,
    dismiss() {
      options.onDismiss?.();
    },
    setSeverity(next) {
      if (severity === next) return;
      severity = next;
      for (const l of listeners) l({ severity });
    },
    subscribe(listener) {
      listeners.add(listener);
      listener({ severity });
      return () => listeners.delete(listener);
    },
    root,
  };
}
