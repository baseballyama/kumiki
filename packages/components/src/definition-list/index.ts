/**
 * `@kumiki/components/definition-list` — semantic `<dl>` term/description list.
 *
 * Eliminates the most common misuse class (`<div>`-between-`<dt>`-and-`<dd>`,
 * grouping wrappers that break SR semantics) by exposing a typed compound
 * with a Term + Description anatomy.
 *
 * ```svelte
 * <DefinitionList.Root>
 *   <DefinitionList.Term>Status</DefinitionList.Term>
 *   <DefinitionList.Description>Active</DefinitionList.Description>
 * </DefinitionList.Root>
 * ```
 *
 * @when-to-use Term/value pairings (key/value displays, glossaries,
 *              metadata strips).
 *
 * @anti-pattern Don't use this as a two-column layout for unrelated content;
 *               it asserts a term/value relationship. Don't put more than
 *               one `<dd>` per `<dt>` unless the values are genuinely
 *               synonymous.
 */

import Root from './Root.svelte';
import Term from './Term.svelte';
import Description from './Description.svelte';

export { Root, Term, Description };

export const DefinitionList = { Root, Term, Description };

export type { Props as DefinitionListProps } from './Root.svelte';
