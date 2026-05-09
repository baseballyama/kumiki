/**
 * `@kumiki/headless` — barrel that re-exports every attachment factory.
 *
 * Prefer the per-component subpath (`@kumiki/headless/toggle`,
 * `@kumiki/headless/combobox`, …) for tree-shake guarantees. This barrel
 * exists to make `import * as headless from '@kumiki/headless'` work and
 * to keep one-shot integrations terse.
 *
 * Each component is a namespace to prevent name collisions (multiple
 * components export `Controller`, etc).
 */

export * as accordion from './accordion/index.js';
export * as button from './button/index.js';
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
export * as switchAttachment from './switch/index.js';
export * as tabs from './tabs/index.js';
export * as toast from './toast/index.js';
export * as toggle from './toggle/index.js';
export * as tooltip from './tooltip/index.js';
export * as calendar from './calendar/index.js';
