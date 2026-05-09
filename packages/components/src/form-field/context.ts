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
  /**
   * Optional `name` attribute for the input. When set on `Field.Root`, the
   * `Field.Input` paints it onto the underlying `<input>` so native form
   * submission and form-state libraries (sveltekit-superforms, native
   * `<form action>`, FormData) pick the value up by key.
   *
   * Per-Input `name` props win over the Root-level value.
   */
  name?: string;
}

export type {
  FormFieldController,
  FieldIssue,
  StandardSchemaV1,
  ValidateOn,
} from '@kumiki/headless/form-field';
