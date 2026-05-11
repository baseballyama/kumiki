<script lang="ts">
  import {
    Root,
    Label,
    Input,
    Errors,
    Description,
    type StandardSchemaV1,
    type ValidateOn,
  } from '@kumiki/components/form-field';

  const emailValidator: StandardSchemaV1<string, string> = {
    '~standard': {
      version: 1,
      vendor: 'kumiki-demo',
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.length === 0) {
          return { issues: [{ message: 'Required' }] };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return { issues: [{ message: 'Enter a valid email address' }] };
        }
        return { value };
      },
    },
  };

  let value = $state('');
  let validateOn = $state<ValidateOn>('blur');
</script>

<div class="demo">
  <div class="controls">
    <label>
      validateOn:
      <select bind:value={validateOn}>
        <option value="blur">blur</option>
        <option value="change">change</option>
      </select>
    </label>
  </div>

  <Root initialValue="" bind:value validator={emailValidator} {validateOn}>
    <Label class="label">Email</Label>
    <Input class="input" type="email" autocomplete="email" placeholder="you@example.com" />
    <Description class="hint">We'll send a confirmation link.</Description>
    <Errors class="errors" />
  </Root>

  <p class="state">value: <code>{value || '(empty)'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: 12px;
    padding: 24px;
    width: 420px;
    min-height: 340px;
    box-sizing: border-box;
  }
  .controls {
    margin-bottom: 16px;
    color: var(--k-ink-2);
    font-size: 13px;
  }
  .controls select {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
    margin-left: 6px;
  }
  .demo :global(.label) {
    display: block;
    color: var(--k-matcha-ink);
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 6px;
  }
  .demo :global(.input) {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    padding: 8px 12px;
    border-radius: 6px;
    font: inherit;
    width: 320px;
    max-width: 100%;
  }
  .demo :global(.input:focus) {
    outline: none;
    border-color: var(--k-matcha-ink);
  }
  .demo :global(.input[aria-invalid='true']) {
    border-color: var(--k-shu);
  }
  .demo :global(.hint) {
    color: var(--k-ink-3);
    font-size: 12px;
    margin: 6px 0 0;
  }
  .demo :global(.errors[hidden]) {
    display: none;
  }
  .demo :global(.errors:not([hidden])) {
    color: var(--k-shu);
    font-size: 13px;
    margin-top: 6px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
