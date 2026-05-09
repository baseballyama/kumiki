/**
 * `@kumiki/machines` — barrel that re-exports every component machine.
 *
 * Prefer the per-component subpath (`@kumiki/machines/toggle`,
 * `@kumiki/machines/combobox`, …) for tree-shake guarantees. This barrel
 * exists for one-shot cases like type indexing in tooling, and to keep
 * `import * as machines from '@kumiki/machines'` working.
 *
 * Each component is exposed as a namespace to prevent name collisions
 * (e.g. multiple components have a `Context` type).
 */

export * as accordion from './accordion/index.js';
export * as checkbox from './checkbox/index.js';
export * as combobox from './combobox/index.js';
export * as dialog from './dialog/index.js';
export * as formField from './form-field/index.js';
export * as menu from './menu/index.js';
export * as numberField from './number-field/index.js';
export * as popover from './popover/index.js';
export * as radioGroup from './radio-group/index.js';
export * as select from './select/index.js';
export * as slider from './slider/index.js';
export * as switchMachine from './switch/index.js';
export * as tabs from './tabs/index.js';
export * as toast from './toast/index.js';
export * as toggle from './toggle/index.js';
export * as tooltip from './tooltip/index.js';
export * as calendar from './calendar/index.js';
