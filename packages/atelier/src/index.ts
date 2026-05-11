/**
 * `@kumiki/atelier` — barrel that re-exports every Atelier component as a namespace.
 *
 * Prefer the per-component subpath (`@kumiki/atelier/toggle`) for tree-shake
 * guarantees. This barrel exists for one-shot imports.
 *
 * Each namespace itself contains the `Tailwind` and `Vanilla` styled
 * variants — pick one at the import site:
 *
 * ```svelte
 * <script>
 *   import { Toggle } from '@kumiki/atelier';
 *   const T = Toggle.Tailwind; // or Toggle.Vanilla
 * </script>
 * <T.Root>…</T.Root>
 * ```
 *
 * Implementation note: matches the `export * as` namespace pattern from
 * `@kumiki/components` to handle generic Svelte components consistently
 * (sveltejs/svelte#12785).
 */

export * as Accordion from './accordion/index.js';
export * as Alert from './alert/index.js';
export * as Avatar from './avatar/index.js';
export * as AvatarGroup from './avatar-group/index.js';
export * as Badge from './badge/index.js';
export * as Breadcrumb from './breadcrumb/index.js';
export * as Button from './button/index.js';
export * as Calendar from './calendar/index.js';
export * as Checkbox from './checkbox/index.js';
export * as Chips from './chips/index.js';
export * as Combobox from './combobox/index.js';
export * as DatePicker from './date-picker/index.js';
export * as DateTimeField from './datetime-field/index.js';
export * as DefinitionList from './definition-list/index.js';
export * as Dialog from './dialog/index.js';
export * as FormField from './form-field/index.js';
export * as HorizontalRule from './horizontal-rule/index.js';
export * as IconButton from './icon-button/index.js';
export * as LoadingSpinner from './loading-spinner/index.js';
export * as Menu from './menu/index.js';
export * as NumberField from './number-field/index.js';
export * as Pagination from './pagination/index.js';
export * as Popover from './popover/index.js';
export * as RadioGroup from './radio-group/index.js';
export * as Select from './select/index.js';
export * as Slider from './slider/index.js';
export * as Switch from './switch/index.js';
export * as Table from './table/index.js';
export * as Tabs from './tabs/index.js';
export * as TimeField from './time-field/index.js';
export * as Toast from './toast/index.js';
export * as Toggle from './toggle/index.js';
export * as Toolbar from './toolbar/index.js';
export * as Tooltip from './tooltip/index.js';
