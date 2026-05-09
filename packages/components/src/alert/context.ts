import type { AlertController } from '@kumiki/headless/alert';

export const ALERT_CONTEXT_KEY = Symbol('kumiki-alert');

export interface AlertContextValue {
  readonly controller: AlertController;
}
