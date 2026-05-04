/**
 * Internal context shared between NumberField.Root and its subcomponents.
 */

import type { NumberFieldController } from '@kumiki/attachment-number-field';

export const NUMBER_FIELD_CONTEXT_KEY = Symbol('kumiki.number-field');

export interface NumberFieldContextValue {
  controller: NumberFieldController;
}

export type { NumberFieldController } from '@kumiki/attachment-number-field';
