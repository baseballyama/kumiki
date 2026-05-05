/**
 * `@kumiki/components/form-field` — Layer 4 compound component for Form Field.
 *
 * Generic over the input value type `V` (default `string`). Five named
 * exports — Root, Label, Input, Errors, Description — composed via Svelte
 * context. Root is render-only; the leaves render real DOM with full ARIA
 * wiring painted by the controller.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import * as Field from '@kumiki/components/form-field';
 *   import * as v from 'valibot';
 *
 *   const emailSchema = v.pipe(v.string(), v.email());
 * </script>
 *
 * <Field.Root initialValue="" validator={emailSchema}>
 *   <Field.Label>Email</Field.Label>
 *   <Field.Input type="email" autocomplete="email" />
 *   <Field.Description>We'll send a confirmation link.</Field.Description>
 *   <Field.Errors />
 * </Field.Root>
 * ```
 *
 * @when-to-use Single-input forms or per-field state in a multi-field form.
 *              Works with any Standard Schema-compliant validator (Zod,
 *              Valibot, ArkType, Effect, …).
 *
 * @anti-pattern Don't bypass the live-region by rendering errors in a
 *               non-aria element — screen readers won't announce changes.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/practices/forms/
 * @see https://standardschema.dev/
 * @see https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21
 */

import Root from './Root.svelte';
import Label from './Label.svelte';
import Input from './Input.svelte';
import Errors from './Errors.svelte';
import Description from './Description.svelte';

// Generic Svelte components (`<script generics="V">`) emit
// `$$IsomorphicComponent` in their .d.ts which TypeScript can't reference
// across module boundaries (sveltejs/svelte#12785). We therefore expose
// only named exports. Users who prefer dot-namespace style use:
//
//     import * as Field from '@kumiki/components/form-field';
export { Root, Label, Input, Errors, Description };

export type {
  FormFieldController,
  FieldIssue,
  FormFieldContext,
  FormFieldEvent,
  FormFieldMachine,
  FormFieldState,
  StandardSchemaV1,
  StandardSchemaResult,
  ValidateOn,
  CreateFormFieldOptions,
} from '@kumiki/headless/form-field';
