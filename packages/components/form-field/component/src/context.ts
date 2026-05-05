/**
 * Internal context shared between Field.Root and the leaf components.
 *
 * Generic over the field value type V; descendants consume via getContext
 * with a single internal cast (per docs/design/08-typescript.md §8.2).
 */

import type { FormFieldController } from '@kumiki/headless/form-field';

export const FIELD_CONTEXT_KEY = Symbol('kumiki.form-field');

export interface FieldContextValue<V> {
  controller: FormFieldController<V>;
}

export type {
  FormFieldController,
  FieldIssue,
  StandardSchemaV1,
  ValidateOn,
} from '@kumiki/headless/form-field';
