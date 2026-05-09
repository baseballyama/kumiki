<!--
  @component Field.Root — owns the controller and shares it via context.

  Generic over the input value type `V`. Pass `V` to `<Root<V>>`.

  Bindable props:
  - `value` → V. Bind for two-way control.

  Plain props:
  - `initialValue` → V (required) seed for the controller; `bind:value` mirrors.
  - `name` → string, optional. Painted onto the underlying `<input>` so
    native `<form>` submission, FormData, and sveltekit-superforms pick
    the value up by key. A `name` set directly on `Field.Input` wins.
  - `validator` → StandardSchemaV1<V, V> for validation.
  - `validateOn` → 'blur' | 'change' | 'submit' or array. Default 'blur'.
  - `serverIssues` → ReadonlyArray<FieldIssue | string> | null | undefined.
    Reactive entry point for externally-supplied errors (SvelteKit form
    actions, sveltekit-superforms `$errors[name]`, RPC failures, …).
    `undefined` is a no-op (server hasn't spoken); `[]` clears; non-empty
    drives the field to invalid via `controller.setErrors`. The local
    validator's results are not affected — typing again clears server
    errors as expected.
  - `oncontroller` → callback receiving the controller once on mount, for
    advanced imperative use (`controller.validate()`, `controller.reset()`).
  - `onValueChange`, `onValidityChange`.

  Renders no DOM itself — Label / Input / Errors / Description are
  responsible for their own elements.
-->
<script lang="ts" generics="V">
  import { onDestroy, setContext, untrack } from 'svelte';
  import {
    createFormField,
    type FieldIssue,
    type FormFieldController,
    type FormFieldState,
    type StandardSchemaV1,
    type ValidateOn,
  } from '@kumiki/headless/form-field';
  import type { Snippet } from 'svelte';
  import { FIELD_CONTEXT_KEY, type FieldContextValue } from './context.js';

  type ServerIssues = ReadonlyArray<FieldIssue> | ReadonlyArray<string> | null | undefined;

  type Props = {
    initialValue: V;
    value?: V;
    name?: string;
    validator?: StandardSchemaV1<V, V> | StandardSchemaV1<unknown, V>;
    validateOn?: ValidateOn | ReadonlyArray<ValidateOn>;
    serverIssues?: ServerIssues;
    onValueChange?: (value: V) => void;
    onValidityChange?: (state: FormFieldState) => void;
    oncontroller?: (controller: FormFieldController<V>) => void;
    id?: string;
    children: Snippet;
  };

  let {
    initialValue,
    value = $bindable(undefined),
    name,
    validator,
    validateOn,
    serverIssues,
    onValueChange,
    onValidityChange,
    oncontroller,
    id,
    children,
  }: Props = $props();

  const controller: FormFieldController<V> = untrack(() =>
    createFormField<V>({
      initialValue: value !== undefined ? value : initialValue,
      validator,
      validateOn,
      id,
      onValueChange: (next) => {
        value = next;
        onValueChange?.(next);
      },
      onValidityChange,
    }),
  );

  $effect(() => {
    if (value !== undefined && !Object.is(value, controller.value)) {
      controller.setValue(value);
    }
  });

  // Push server-side errors into the field whenever they change. The
  // controller dedupes via `Object.is` on the array reference; consumers
  // (SvelteKit form actions, superforms) typically pass a fresh array per
  // server response, which is the right granularity.
  let lastServerIssues: ServerIssues = undefined;
  $effect(() => {
    if (serverIssues === undefined) return;
    if (Object.is(serverIssues, lastServerIssues)) return;
    lastServerIssues = serverIssues;
    controller.setErrors(serverIssues ?? []);
  });

  let unsub = controller.subscribe(() => {});
  onDestroy(unsub);

  // Mount-time imperative hook. The callback fires exactly once with a
  // stable controller reference; it is not a reactive subscription.
  untrack(() => oncontroller?.(controller));

  // `name` is consumed as a static at mount — typical form fields don't
  // rename mid-life. Apps that need a dynamic name should pass it on
  // <Input name={…}> directly, where reactivity flows through normally.
  setContext<FieldContextValue<V>>(FIELD_CONTEXT_KEY, { controller, name: untrack(() => name) });
</script>

{@render children()}
