<script lang="ts">
  import { Vanilla as Field } from '@kumiki/atelier/form-field';
  import type { StandardSchemaV1 } from '@kumiki/components/form-field';

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
</script>

<div class="demo">
  <Field.Root initialValue="" bind:value validator={emailValidator} validateOn="blur" name="email">
    <Field.Label>Email</Field.Label>
    <Field.Input type="email" autocomplete="email" placeholder="you@example.com" />
    <Field.Description>We'll send a confirmation link.</Field.Description>
    <Field.Errors />
  </Field.Root>

  <p class="state">value: <code>{value || '(empty)'}</code></p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
