/**
 * Hand-transcribed screen-reader smoke contracts for every Kumiki
 * component.
 *
 * Each contract focuses the canonical first interactive surface in the
 * sandbox and asserts a sane (role, name) pair.
 */

import type { SrContract } from './_harness.js';

export const contracts: ReadonlyArray<SrContract> = [
  {
    component: 'toggle',
    sandbox: '/sandbox/toggle',
    hydrationSelector: '[data-testid="toggle-host"] button[id^="kumiki-toggle-"]',
    cases: [
      {
        name: 'Toggle button has button role + visible label',
        focus: '[data-testid="toggle-host"] button',
        role: 'button',
      },
    ],
  },
  {
    component: 'switch',
    sandbox: '/sandbox/switch',
    hydrationSelector: 'button[role="switch"]',
    cases: [
      { name: 'Switch advertises role=switch', focus: 'button[role="switch"]', role: 'switch' },
    ],
  },
  {
    component: 'checkbox',
    sandbox: '/sandbox/checkbox',
    hydrationSelector: 'button[role="checkbox"]',
    cases: [
      {
        name: 'Checkbox advertises role=checkbox',
        focus: 'button[role="checkbox"]',
        role: 'checkbox',
      },
    ],
  },
  {
    component: 'radio-group',
    sandbox: '/sandbox/radio-group',
    hydrationSelector: '[role="radiogroup"]',
    cases: [
      { name: 'Radio item advertises role=radio', focus: 'button[role="radio"]', role: 'radio' },
    ],
  },
  {
    component: 'tabs',
    sandbox: '/sandbox/tabs',
    hydrationSelector: '[role="tablist"]',
    cases: [{ name: 'Tab advertises role=tab', focus: 'button[role="tab"]', role: 'tab' }],
  },
  {
    component: 'dialog',
    sandbox: '/sandbox/dialog',
    hydrationSelector: '[data-component-host="dialog"]',
    cases: [
      { name: 'Dialog Trigger has button role', focus: '[aria-haspopup="dialog"]', role: 'button' },
    ],
  },
  {
    component: 'tooltip',
    sandbox: '/sandbox/tooltip',
    hydrationSelector: 'button[aria-describedby]',
    cases: [
      { name: 'Tooltip anchor is described-by a tooltip', focus: 'button[aria-describedby]' },
    ],
  },
  {
    component: 'select',
    sandbox: '/sandbox/select',
    hydrationSelector: 'button[role="combobox"]',
    cases: [
      {
        name: 'Select trigger has combobox role',
        focus: 'button[role="combobox"]',
        role: 'combobox',
      },
    ],
  },
  {
    component: 'combobox',
    sandbox: '/sandbox/combobox',
    hydrationSelector: '[role="combobox"]',
    cases: [
      {
        name: 'Combobox input has combobox role',
        focus: 'input[role="combobox"]',
        role: 'combobox',
      },
    ],
  },
  {
    component: 'form-field',
    sandbox: '/sandbox/form-field',
    hydrationSelector: 'label',
    cases: [{ name: 'Form input is labeled by its <label>', focus: 'input' }],
  },
  {
    component: 'slider',
    sandbox: '/sandbox/slider',
    hydrationSelector: '[role="slider"]',
    cases: [{ name: 'Slider thumb has slider role', focus: '[role="slider"]', role: 'slider' }],
  },
  {
    component: 'accordion',
    sandbox: '/sandbox/accordion',
    hydrationSelector: 'button[aria-expanded]',
    cases: [
      {
        name: 'Accordion trigger has button role + aria-expanded',
        focus: 'button[aria-expanded]',
        role: 'button',
      },
    ],
  },
  {
    component: 'number-field',
    sandbox: '/sandbox/number-field',
    hydrationSelector: 'input[role="spinbutton"], input[type="number"]',
    cases: [
      {
        name: 'Number input has spinbutton role',
        focus: 'input[role="spinbutton"], input[type="number"]',
      },
    ],
  },
  {
    component: 'popover',
    sandbox: '/sandbox/popover',
    hydrationSelector: '[aria-haspopup="dialog"]',
    cases: [
      {
        name: 'Popover trigger advertises aria-haspopup=dialog',
        focus: '[aria-haspopup="dialog"]',
      },
    ],
  },
  {
    component: 'toast',
    sandbox: '/sandbox/toast',
    hydrationSelector: 'button',
    cases: [
      { name: 'Toast Add button is a button', focus: 'button:has-text("Add")', role: 'button' },
    ],
  },
  {
    component: 'menu',
    sandbox: '/sandbox/menu',
    hydrationSelector: 'button[aria-haspopup="menu"]',
    cases: [
      { name: 'Menu trigger advertises aria-haspopup=menu', focus: 'button[aria-haspopup="menu"]' },
    ],
  },
  {
    component: 'calendar',
    sandbox: '/sandbox/calendar?initial=2026-05-09',
    hydrationSelector: '[role="grid"] button[id^="cal-day-"][tabindex="0"]',
    cases: [
      { name: 'Calendar grid has grid role', focus: '[role="grid"]', role: 'grid' },
      {
        name: 'Focused day cell has gridcell role',
        focus: 'button[tabindex="0"]',
        role: 'gridcell',
      },
    ],
  },
  {
    component: 'date-picker',
    sandbox: '/sandbox/date-picker',
    hydrationSelector: '[aria-haspopup="dialog"]',
    cases: [
      {
        name: 'DatePicker trigger advertises aria-haspopup=dialog',
        focus: '[aria-haspopup="dialog"]',
      },
    ],
  },
];
