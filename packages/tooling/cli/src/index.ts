/**
 * `@kumiki/cli` — programmatic surface for the `kumiki` binary.
 *
 * The exported helpers (`add`, `resolveAtelierRoot`, `REGISTRY`) are
 * importable for tooling integrations (custom scripts, scaffolding
 * pipelines) that don't want to spawn the binary. The `kumiki` CLI in
 * `bin/kumiki.ts` consumes them too.
 *
 * @see docs/design/15-roadmap.md §15.5 for the copy flow.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

// ─── Public types ─────────────────────────────────────────────────────────

export type Variant = 'tailwind' | 'vanilla';

/** A single source-file entry to copy when running `kumiki add`. */
export interface ComponentFileSpec {
  /** Path relative to `@kumiki/atelier/dist/` in the installed package. */
  readonly source: string;
  /** Path relative to the user's destination directory. */
  readonly dest: string;
}

/** Per-component recipe. */
export interface ComponentSpec {
  /** Component name (the `kumiki add <name>` arg). */
  readonly name: string;
  /** Layout: which files to copy per variant. */
  readonly files: Record<Variant, ReadonlyArray<ComponentFileSpec>>;
  /** Suggested import line shown after a successful add. */
  readonly importHint: (variant: Variant) => string;
}

/**
 * The component registry the CLI ships against. Update when a new
 * Atelier component lands. (Phase 2.1: rest of Phase 1 components.)
 */
export const REGISTRY: ReadonlyArray<ComponentSpec> = [
  {
    name: 'toggle',
    files: {
      tailwind: [{ source: 'toggle/Toggle.tailwind.svelte', dest: 'toggle/Toggle.svelte' }],
      vanilla: [{ source: 'toggle/Toggle.vanilla.svelte', dest: 'toggle/Toggle.svelte' }],
    },
    importHint: () => "import Toggle from '$lib/components/ui/toggle/Toggle.svelte';",
  },
  {
    name: 'dialog',
    files: {
      tailwind: [
        { source: 'dialog/tailwind/Root.svelte', dest: 'dialog/Root.svelte' },
        { source: 'dialog/tailwind/Trigger.svelte', dest: 'dialog/Trigger.svelte' },
        { source: 'dialog/tailwind/Overlay.svelte', dest: 'dialog/Overlay.svelte' },
        { source: 'dialog/tailwind/Content.svelte', dest: 'dialog/Content.svelte' },
        { source: 'dialog/tailwind/Title.svelte', dest: 'dialog/Title.svelte' },
        { source: 'dialog/tailwind/Description.svelte', dest: 'dialog/Description.svelte' },
        { source: 'dialog/tailwind/Close.svelte', dest: 'dialog/Close.svelte' },
      ],
      vanilla: [
        { source: 'dialog/vanilla/Root.svelte', dest: 'dialog/Root.svelte' },
        { source: 'dialog/vanilla/Trigger.svelte', dest: 'dialog/Trigger.svelte' },
        { source: 'dialog/vanilla/Overlay.svelte', dest: 'dialog/Overlay.svelte' },
        { source: 'dialog/vanilla/Content.svelte', dest: 'dialog/Content.svelte' },
        { source: 'dialog/vanilla/Title.svelte', dest: 'dialog/Title.svelte' },
        { source: 'dialog/vanilla/Description.svelte', dest: 'dialog/Description.svelte' },
        { source: 'dialog/vanilla/Close.svelte', dest: 'dialog/Close.svelte' },
      ],
    },
    importHint: () => "import * as Dialog from '$lib/components/ui/dialog/index.js';",
  },
];

export interface AddOptions {
  /** Tailwind v4 utility classes vs vanilla CSS modules. Defaults to `'tailwind'`. */
  variant?: Variant;
  /** Destination directory relative to `cwd`. Default: `'src/lib/components/ui'`. */
  dest?: string;
  /** Overwrite existing files. Default: `false`. */
  force?: boolean;
  /** Print actions without writing. Default: `false`. */
  dryRun?: boolean;
  /** Override the cwd (used by tests). Default: `process.cwd()`. */
  cwd?: string;
  /**
   * Override the Atelier dist root (used by tests). Default: resolved from
   * `node_modules/@kumiki/atelier/dist` relative to `cwd`.
   */
  atelierRoot?: string;
}

export interface AddResult {
  readonly component: string;
  readonly variant: Variant;
  readonly written: ReadonlyArray<string>;
  readonly skipped: ReadonlyArray<{ path: string; reason: 'exists' }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

export function resolveAtelierRoot(cwd: string): string {
  // Walk up from cwd looking for node_modules/@kumiki/atelier/dist.
  let dir = resolve(cwd);
  for (let i = 0; i < 12; i++) {
    const candidate = join(dir, 'node_modules', '@kumiki', 'atelier', 'dist');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new AtelierNotInstalledError();
}

export class AtelierNotInstalledError extends Error {
  constructor() {
    super(
      '@kumiki/atelier is not installed. Run `pnpm add @kumiki/atelier@preview` (or your preferred package manager) before `kumiki add`.',
    );
    this.name = 'AtelierNotInstalledError';
  }
}

export class UnknownComponentError extends Error {
  constructor(name: string) {
    super(`Unknown component "${name}". Known: ${REGISTRY.map((s) => s.name).join(', ')}.`);
    this.name = 'UnknownComponentError';
  }
}

export class FileExistsError extends Error {
  constructor(path: string) {
    super(`Refusing to overwrite ${path} (pass --force to allow).`);
    this.name = 'FileExistsError';
  }
}

// ─── Implementation ──────────────────────────────────────────────────────

/**
 * Copy the source files for a single component into the user's project.
 *
 * @when-to-use From a JS scaffolding script. The CLI binary is the
 *   typical entry point; this exists for programmatic access.
 *
 * @anti-pattern Don't call from inside hot reload loops — file writes
 *   trigger Vite invalidation cascades.
 */
export function add(component: string, options: AddOptions = {}): AddResult {
  const variant: Variant = options.variant ?? 'tailwind';
  const cwd = options.cwd ?? process.cwd();
  const destBase = resolve(cwd, options.dest ?? 'src/lib/components/ui');
  const force = options.force ?? false;
  const dryRun = options.dryRun ?? false;

  const spec = REGISTRY.find((s) => s.name === component);
  if (!spec) throw new UnknownComponentError(component);

  const atelierRoot = options.atelierRoot ?? resolveAtelierRoot(cwd);

  const written: string[] = [];
  const skipped: Array<{ path: string; reason: 'exists' }> = [];

  for (const file of spec.files[variant]) {
    const srcPath = join(atelierRoot, file.source);
    const destPath = join(destBase, file.dest);

    if (!existsSync(srcPath)) {
      throw new Error(`Source file not found: ${srcPath}`);
    }

    if (existsSync(destPath) && !force) {
      if (dryRun) {
        skipped.push({ path: destPath, reason: 'exists' });
        continue;
      }
      throw new FileExistsError(destPath);
    }

    if (dryRun) {
      written.push(destPath);
      continue;
    }

    mkdirSync(dirname(destPath), { recursive: true });
    const contents = readFileSync(srcPath, 'utf8');
    writeFileSync(destPath, contents);
    written.push(destPath);
  }

  return { component, variant, written, skipped };
}
