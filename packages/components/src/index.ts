/**
 * `@kumiki/components` — every Kumiki Svelte 5 component, exposed as a
 * dot-namespace barrel.
 *
 * Prefer the subpath import for the cleanest tree-shake on older
 * bundlers (`import { Root } from '@kumiki/components/toggle'`); the
 * barrel below is for ergonomic namespaced access:
 *
 * ```svelte
 * <script>
 *   import { Toggle, Dialog, Combobox } from '@kumiki/components';
 * </script>
 *
 * <Toggle.Root>Bold</Toggle.Root>
 * <Dialog.Root>...</Dialog.Root>
 * ```
 *
 * Implementation note: we use `export * as` namespace re-exports rather
 * than `export const Toggle = { Root, … }` because generic Svelte
 * components emit `$$IsomorphicComponent` in their `.d.ts` which can't
 * cross module boundaries through a const-bound object
 * (sveltejs/svelte#12785).
 */

export * as Accordion from './accordion/index.js';
export * as Alert from './alert/index.js';
export * as Avatar from './avatar/index.js';
export * as AvatarGroup from './avatar-group/index.js';
export * as Badge from './badge/index.js';
export * as Breadcrumb from './breadcrumb/index.js';
export * as Button from './button/index.js';
export * as Chips from './chips/index.js';
export * as Calendar from './calendar/index.js';
export * as DatePicker from './date-picker/index.js';
export * as DefinitionList from './definition-list/index.js';
export * as Checkbox from './checkbox/index.js';
export * as HorizontalRule from './horizontal-rule/index.js';
export * as LoadingSpinner from './loading-spinner/index.js';
export * as Combobox from './combobox/index.js';
export * as Dialog from './dialog/index.js';
export * as FormField from './form-field/index.js';
export * as Menu from './menu/index.js';
export * as NumberField from './number-field/index.js';
export * as Pagination from './pagination/index.js';
export * as Popover from './popover/index.js';
export * as RadioGroup from './radio-group/index.js';
export * as Select from './select/index.js';
export * as Slider from './slider/index.js';
export * as Switch from './switch/index.js';
export * as Tabs from './tabs/index.js';
export * as Toast from './toast/index.js';
export * as Toggle from './toggle/index.js';
export * as Tooltip from './tooltip/index.js';
export * as LocaleProvider from './locale-provider/index.js';
