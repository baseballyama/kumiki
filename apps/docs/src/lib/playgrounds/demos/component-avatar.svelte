<!--
  Layer 4 Avatar demo — pure headless contract.

  L4 Avatar enforces only the discriminated alt-text contract via Avatar.Root:
  - `name="…"` ⇒ Avatar.Image carries `alt={name}`
  - `decorative` ⇒ Avatar.Image carries `alt=""`

  Sizes are NOT part of L4. See `@kumiki/atelier/avatar` (Layer 5) for the
  size vocabulary, or apply your own `data-*` / `class` via the rest-spread.
-->
<script lang="ts">
  import { Avatar } from '@kumiki/components/avatar';
</script>

<div class="demo">
  <div class="row">
    <!-- Meaningful: name carried via alt -->
    <Avatar.Root name="Aiko Tanaka" class="kumiki-demo-avatar">
      <Avatar.Image src="https://i.pravatar.cc/64?img=12" />
      <Avatar.Fallback />
    </Avatar.Root>

    <!-- Decorative + initials fallback (broken image) -->
    <Avatar.Root decorative class="kumiki-demo-avatar">
      <Avatar.Image src="https://broken.invalid/x.png" />
      <Avatar.Fallback>JS</Avatar.Fallback>
    </Avatar.Root>

    <!-- Decorative + custom snippet fallback -->
    <Avatar.Root decorative class="kumiki-demo-avatar">
      <Avatar.Image src="https://broken.invalid/y.png" />
      <Avatar.Fallback>★</Avatar.Fallback>
    </Avatar.Root>
  </div>

  <p class="hint">
    <code>name=</code> ⇒ <code>alt=name</code> · <code>decorative</code> ⇒ <code>alt=""</code>. L4
    ships <strong>no styling and no size vocabulary</strong>; the avatars above are sized by one
    consumer-CSS rule. Layer 5 (<code>@kumiki/atelier/avatar</code>) provides
    <code>sm</code> / <code>md</code> / <code>lg</code>.
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 380px;
    min-height: 260px;
    box-sizing: border-box;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .demo :global(.kumiki-demo-avatar) {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    overflow: hidden;
    text-align: center;
    line-height: 40px;
    font-weight: 600;
    font-size: 14px;
  }
  .demo :global(img[data-component-part='image']) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .demo :global(img[data-hidden]) {
    visibility: hidden;
  }
  .demo :global(span[data-component-part='fallback'][data-hidden]) {
    visibility: hidden;
  }
  .hint {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    line-height: 1.6;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .hint code {
    color: var(--k-matcha-ink);
  }
</style>
