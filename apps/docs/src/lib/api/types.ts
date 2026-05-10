/*
 * Structured representation of the TypeDoc-emitted Markdown that lives at
 * `docs/api/**\/*.md`. The parser at `./parse.ts` converts each module's
 * Markdown into one `ApiModule`. Pages render from these objects; raw
 * Markdown never reaches the DOM.
 */

export type ApiPackageId = 'core' | 'machines' | 'headless';

export type MemberKind =
  | 'interface'
  | 'type-alias'
  | 'function'
  | 'class'
  | 'enum'
  | 'variable'
  | 'namespace';

export interface ApiSource {
  /** Repo-relative path, e.g. `core/runtime/src/types.ts`. */
  file: string;
  line: number;
  /** GitHub blob URL pointing at the exact line. */
  url: string;
}

export interface ApiTag {
  /** "When-to-use", "Anti-pattern", "See", "Example", "Deprecated", "Throws". */
  name: string;
  text: string;
}

export interface ApiProperty {
  name: string;
  optional: boolean;
  /** Raw signature line — `> readonly **name**: type` minus the `> ` prefix. */
  signature: string;
  description?: string;
  source?: ApiSource;
}

export interface ApiTypeParameter {
  name: string;
  /** Constraint signature (`extends Foo`, default values, …). */
  constraint?: string;
}

export interface ApiParameter {
  name: string;
  optional: boolean;
  /** Raw type/value signature for the parameter. */
  type: string;
  description?: string;
}

export interface ApiMember {
  kind: MemberKind;
  name: string;
  /** In-page anchor slug (kebab-case, lower). */
  slug: string;
  /** Headline declaration line — first `> …` blockquote in the source. */
  signature?: string;
  description?: string;
  typeParameters?: ApiTypeParameter[];
  properties?: ApiProperty[];
  parameters?: ApiParameter[];
  /** Function return type only. */
  returns?: { type: string };
  source?: ApiSource;
  tags?: ApiTag[];
}

export interface ApiModule {
  /** URL-friendly slug — `core/runtime`, `machines/dialog`. */
  slug: string;
  /** Last segment, used as the display name. */
  name: string;
  packageId: ApiPackageId;
  /** Distribution name, e.g. `@kumiki/runtime`, `@kumiki/machines/dialog`. */
  fullName: string;
  members: ApiMember[];
}

export interface ApiModuleSummary {
  slug: string;
  name: string;
  fullName: string;
  packageId: ApiPackageId;
  memberCount: number;
  /** Member-kind tally — used by the sidebar / index. */
  kindCounts: Partial<Record<MemberKind, number>>;
}

export interface ApiPackage {
  id: ApiPackageId;
  name: string;
  tagline: string;
  modules: ApiModuleSummary[];
}
