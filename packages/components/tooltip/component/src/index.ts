/**
 * `@kumiki/component-tooltip` — Layer 4 compound component for Tooltip.
 *
 * Three named exports — Root + Trigger + Content. Root owns the controller
 * and shares it via context. Trigger is the focusable element the tooltip
 * describes; Content is the popup itself.
 *
 * Minimal usage:
 *
 * ```svelte
 * <script lang="ts">
 *   import * as Tooltip from '@kumiki/component-tooltip';
 * </script>
 *
 * <Tooltip.Root>
 *   <Tooltip.Trigger>?</Tooltip.Trigger>
 *   <Tooltip.Content>Help text shown on hover or focus.</Tooltip.Content>
 * </Tooltip.Root>
 * ```
 *
 * @when-to-use Brief, supplemental hints attached to a focusable control —
 *              keyboard shortcuts, icon-button labels, terse definitions.
 *
 * @anti-pattern Don't put interactive content inside a tooltip — that's
 *               Popover / Dialog territory. APG explicitly forbids it.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */

import Root from './Root.svelte';
import Trigger from './Trigger.svelte';
import Content from './Content.svelte';

export { Root, Trigger, Content };

export type {
  TooltipContext,
  TooltipController,
  TooltipEvent,
  TooltipMachine,
  TooltipState,
  CreateTooltipOptions,
} from '@kumiki/headless/tooltip';
