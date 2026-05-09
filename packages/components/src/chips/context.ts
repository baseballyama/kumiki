export const CHIPS_CONTEXT_KEY = Symbol('kumiki-chips');

export type ChipsVariant = 'static' | 'dismissible' | 'selectable';

export interface ChipsContextValue {
  readonly variant: ChipsVariant;
  /** When variant === 'dismissible', the underlying label string. */
  readonly label: string | undefined;
  /** Trigger the parent's onDismiss handler. */
  onDismiss(): void;
}
