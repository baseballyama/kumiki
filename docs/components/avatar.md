# Avatar

> Image with text/initials fallback; group variant for stacked avatars.

| Field                               | Value                    |
| ----------------------------------- | ------------------------ |
| **APG pattern**                     | (none — semantic image)  |
| **Bundle (Layer 4 target, brotli)** | `1.0 kB` brotli (target) |
| **Status**                          | `unreleased` (Phase 1.5) |

## Anatomy

```
Avatar.Root                   (wrapper; manages img loading state)
  ├── Avatar.Image            (<img>; hidden until loaded)
  └── Avatar.Fallback         (initials | icon | custom)
```

```
AvatarGroup.Root              (<ul role="list">)
  ├── AvatarGroup.Item        (<li>)
  └── AvatarGroup.Overflow    ("+N more"; Tooltip-friendly target)
```

## When the image is decorative vs meaningful

- **Decorative** (default) — the avatar visually represents a user
  whose name is already exposed elsewhere (next to the avatar in a
  message header). The avatar's `<img>` gets `alt=""`.
- **Meaningful** — the avatar is the _only_ identifier (e.g. a hover
  card with no other text). Pass `name` and the component renders
  `alt={name}`.

The fallback (initials) is `aria-hidden` because it duplicates `name`.

## ARIA

| Element                | Role     | aria-\* attributes                                                                    |
| ---------------------- | -------- | ------------------------------------------------------------------------------------- |
| `Avatar.Root`          | (none)   | —                                                                                     |
| `Avatar.Image`         | (img)    | `alt={name}` if meaningful, `alt=""` if decorative                                    |
| `Avatar.Fallback`      | (none)   | `aria-hidden="true"` (initials duplicate name); not hidden when no `name` is supplied |
| `AvatarGroup.Root`     | (`list`) | `aria-label` (i18n template e.g. "{count} members") optional                          |
| `AvatarGroup.Overflow` | (none)   | `aria-label` (i18n: "{n} more")                                                       |

## API

```ts
// Avatar.Root
type AvatarRootProps =
  | { name: string; src?: string; size?: Size; ... }    // meaningful
  | { decorative: true; src?: string; size?: Size; ... }; // decorative

// Avatar.Image
type ImageProps = { src: string; loading?: 'eager' | 'lazy' };

// Avatar.Fallback
type FallbackProps = {
  /** Auto-generated from name; override to render an icon instead. */
  children?: Snippet;
};

// AvatarGroup.Root
type GroupRootProps = {
  /** Show this many before collapsing the rest into Overflow. */
  max?: number;
  total?: number;        // when total !== children.length (server count)
  children: Snippet;
};
```

## Examples

```svelte
<!-- decorative -->
<Avatar.Root decorative size="md">
  <Avatar.Image src={user.photo} />
  <Avatar.Fallback />
  <!-- renders initials from name passed to context -->
</Avatar.Root>

<!-- meaningful (sole identifier) -->
<Avatar.Root name="Erika Mustermann">
  <Avatar.Image src={u.photo} />
  <Avatar.Fallback />
</Avatar.Root>

<!-- group -->
<AvatarGroup.Root max={3} total={7}>
  {#each users as u}
    <AvatarGroup.Item>
      <Avatar.Root decorative><Avatar.Image src={u.photo} /><Avatar.Fallback /></Avatar.Root>
    </AvatarGroup.Item>
  {/each}
  <AvatarGroup.Overflow />
</AvatarGroup.Root>
```

## i18n strings

| Key                     | en          | ja        |
| ----------------------- | ----------- | --------- |
| `avatar.fallback`       | `{name}`    | `{name}`  |
| `avatar.group.overflow` | `+{n} more` | `他{n}人` |

`@kumiki/locale/<lang>/avatar`.

## Source

- Component: [`packages/components/src/avatar`](../../packages/components/src/avatar)

## Anti-patterns

- Don't put `alt={name}` on a decorative avatar — duplicates the visible name to screen readers.
- Don't render `Avatar.Fallback` text _and_ `Avatar.Image` simultaneously; the controller swaps based on image load state.
- Don't use AvatarGroup as a tab list or select — it's a list of users, not a control surface.

## Related

- [Tooltip](tooltip.md) — pair with Overflow to reveal the hidden names.
