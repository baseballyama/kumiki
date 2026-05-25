<!--
  Form-Field sandbox — fixture for Playwright + axe.

  Query params:
    ?initial=foo                 initial value
    ?validator=async             pick async validator (default sync)
    ?validateOn=change           validate on every keystroke
    ?dir=rtl                     wrap in dir="rtl"
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import {
    Root,
    Label,
    Input,
    Errors,
    Description,
    type StandardSchemaV1,
    type ValidateOn,
  } from '@kumiki/components/form-field';
  import { page } from '$app/state';

  // Sync validator: required, min 3 chars.
  const syncValidator: StandardSchemaV1<string, string> = {
    '~standard': {
      version: 1,
      vendor: 'kumiki-sandbox',
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.length === 0) {
          return { issues: [{ message: 'Required' }] };
        }
        if (value.length < 3) {
          return { issues: [{ message: 'Must be at least 3 characters' }] };
        }
        return { value };
      },
    },
  };

  // Async validator: same rules + 50 ms latency to simulate a server check.
  const asyncValidator: StandardSchemaV1<string, string> = {
    '~standard': {
      version: 1,
      vendor: 'kumiki-sandbox-async',
      validate: (value: unknown) =>
        new Promise((resolve) => {
          setTimeout(() => {
            if (typeof value !== 'string' || value.length === 0) {
              resolve({ issues: [{ message: 'Required (async)' }] });
              return;
            }
            if (value.length < 3) {
              resolve({ issues: [{ message: 'Must be at least 3 characters (async)' }] });
              return;
            }
            resolve({ value });
          }, 50);
        }),
    },
  };

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const initial = $derived(page.url.searchParams.get('initial') ?? '');
  const isAsync = $derived(page.url.searchParams.get('validator') === 'async');
  const validateOn = $derived<ValidateOn>(
    page.url.searchParams.get('validateOn') === 'change' ? 'change' : 'blur',
  );

  // svelte-ignore state_referenced_locally
  let value = $state<string>(initial);
  let log = $state<string[]>([]);
  let serverIssues = $state<ReadonlyArray<string> | undefined>(undefined);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }

  function pushServerError() {
    serverIssues = ['Username already taken'];
  }
  function clearServerError() {
    serverIssues = [];
  }
</script>

<svelte:head>
  <title>Form-Field sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Form-Field sandbox</h1>

  <div data-testid="field-host">
    <Root
      initialValue={initial}
      bind:value
      name="username"
      validator={isAsync ? asyncValidator : syncValidator}
      {validateOn}
      {serverIssues}
      onValidityChange={(s) => append(`onValidityChange(${s})`)}
    >
      <Label data-testid="label">Username</Label>
      <Input data-testid="input" type="text" autocomplete="off" />
      <Description data-testid="description">
        Three or more characters, letters and digits.
      </Description>
      <Errors data-testid="errors" />
    </Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value}</strong>
    · async: <strong data-testid="async">{isAsync}</strong>
    · validateOn: <strong data-testid="validateOn">{validateOn}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-set" type="button" onclick={() => (value = 'kumiki')}>
    Set value externally
  </button>
  <button data-testid="ext-clear" type="button" onclick={() => (value = '')}>
    Clear externally
  </button>
  <button data-testid="server-error" type="button" onclick={pushServerError}>
    Push server error
  </button>
  <button data-testid="server-clear" type="button" onclick={clearServerError}>
    Clear server error
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  :global([data-component-part='label']) {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    color: #111;
  }
  :global([data-component-part='input']) {
    padding: 6px 10px;
    border: 1px solid #999;
    border-radius: 4px;
    font: inherit;
    width: 240px;
  }
  :global([data-component-part='input'][aria-invalid='true']) {
    border-color: #b00020;
  }
  :global([data-component-part='description']) {
    color: #666;
    font-size: 13px;
    margin: 4px 0 0;
  }
  :global([data-component-part='errors'][hidden]) {
    display: none;
  }
  :global([data-component-part='errors']:not([hidden])) {
    color: #b00020;
    font-size: 13px;
    margin-top: 4px;
  }
</style>
