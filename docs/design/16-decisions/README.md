# Architecture Decision Records (ADR)

This folder records significant decisions made during Kumiki's design.

Each ADR follows a fixed format:

- **Status** — Proposed / Accepted / Superseded
- **Context** — what's the problem; what's the constraint
- **Decision** — what we picked
- **Alternatives** — what we considered
- **Consequences** — what becomes easier / harder

ADRs are immutable once accepted. New information leads to a _new_ ADR that supersedes the old one (preserving the audit trail).

## Index

| ID                                                   | Title                                                     | Status                     |
| ---------------------------------------------------- | --------------------------------------------------------- | -------------------------- |
| [0001](0001-svelte5-only.md)                         | Svelte 5 only — no Svelte 4 compatibility                 | Accepted                   |
| [0002](0002-subpackage-split.md)                     | Subpackage split per Layer × component                    | Superseded by 0012         |
| [0003](0003-state-machine-base.md)                   | Custom minimal FSM in `@kumiki/runtime`                   | Accepted                   |
| [0004](0004-standard-schema.md)                      | Standard Schema for validator integration                 | Accepted                   |
| [0005](0005-guidepup-adoption.md)                    | Adopt Guidepup for screen-reader automation               | Accepted                   |
| [0006](0006-locale-data-distribution.md)             | Locale data via subpath exports per language              | Accepted                   |
| [0007](0007-aschild-svelte-alternative.md)           | `child` snippet replaces `asChild`                        | Accepted                   |
| [0008](0008-pnpm-only-no-turborepo.md)               | pnpm workspace only — no Turborepo / Nx                   | Accepted                   |
| [0009](0009-tsdown-bundler.md)                       | tsdown for TS-only packages, svelte-package for Svelte    | Accepted                   |
| [0010](0010-layer5-preview-in-v1.md)                 | Layer 5 preview during v1.0 series                        | Superseded by 0017         |
| [0011](0011-typedoc-and-api-extractor.md)            | TypeDoc + api-extractor (both, different roles)           | Accepted                   |
| [0012](0012-package-consolidation.md)                | Consolidate 37 packages → 9 per-layer packages            | Accepted (supersedes 0002) |
| [0013](0013-internationalized-date.md)               | `@internationalized/date` for Calendar & DatePicker       | Accepted                   |
| [0014](0014-icon-strategy.md)                        | Icon strategy: consumer-supplied snippets, no icon set    | Accepted                   |
| [0015](0015-table-primitive-scope.md)                | Table: ship semantic Table, defer Data Grid               | Accepted                   |
| [0016](0016-editor-dnd-out-of-scope.md)              | Rich-text editor and drag-and-drop are out of scope       | Accepted                   |
| [0017](0017-atelier-ga-at-v1.md)                     | Atelier GA at v1.0                                        | Accepted (supersedes 0010) |
| [0018](0018-l4-bundle-budget-revision.md)            | L4 / Atelier bundle budget revision (measured)            | Accepted                   |
| [0019](0019-datetime-field-subpath-split.md)         | Split datetime-field into DatePart / TimePart subpaths    | Proposed (post-v1.0)       |
| [0020](0020-button-toggle-l3-l4-dedup.md)            | Deduplicate Button / Toggle paint between L3 and L4       | Proposed (post-v1.0)       |
| [0021](0021-form-field-with-validation-subpath.md)   | Split form-field validator into `with-validation` subpath | Proposed (post-v1.0)       |
| [0022](0022-tabs-radio-group-rtl-budget-revision.md) | Revise Tabs / RadioGroup budgets for RTL-in-machine       | Accepted                   |
