/**
 * Programmatic-API tests for `add()`. Each test sets up a temp Atelier
 * fake (a minimal `dist/` mirror) and a temp destination dir, then
 * asserts the side effects of the call.
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  AtelierNotInstalledError,
  FileExistsError,
  REGISTRY,
  UnknownComponentError,
  add,
  resolveAtelierRoot,
} from './index.ts';

let tmpRoot: string;
let cwd: string;
let atelierRoot: string;

function writeFakeAtelier(root: string): void {
  // Mirror just the files our REGISTRY references.
  for (const spec of REGISTRY) {
    for (const variant of ['tailwind', 'vanilla'] as const) {
      for (const file of spec.files[variant]) {
        const target = join(root, file.source);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, `<!-- fake ${spec.name} ${variant} ${file.source} -->\n`);
      }
    }
  }
}

beforeEach(() => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'kumiki-cli-'));
  cwd = join(tmpRoot, 'project');
  mkdirSync(cwd, { recursive: true });
  atelierRoot = join(cwd, 'node_modules', '@kumiki', 'atelier', 'dist');
  mkdirSync(atelierRoot, { recursive: true });
  writeFakeAtelier(atelierRoot);
});

afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe('add() — happy path', () => {
  it('copies the toggle Tailwind variant to the default destination', () => {
    const r = add('toggle', { variant: 'tailwind', cwd });
    expect(r.component).toBe('toggle');
    expect(r.variant).toBe('tailwind');
    expect(r.written).toHaveLength(1);
    const dest = join(cwd, 'src/lib/components/ui/toggle/Toggle.svelte');
    expect(r.written[0]).toBe(dest);
    expect(existsSync(dest)).toBe(true);
    expect(readFileSync(dest, 'utf8')).toMatch(/fake toggle tailwind/);
  });

  it('honors --variant=vanilla', () => {
    const r = add('toggle', { variant: 'vanilla', cwd });
    expect(readFileSync(r.written[0]!, 'utf8')).toMatch(/fake toggle vanilla/);
  });

  it('honors --dest', () => {
    const r = add('toggle', { variant: 'tailwind', dest: 'app/widgets', cwd });
    expect(r.written[0]).toBe(join(cwd, 'app/widgets/toggle/Toggle.svelte'));
  });

  it('copies all 7 dialog subcomponents', () => {
    const r = add('dialog', { variant: 'tailwind', cwd });
    expect(r.written).toHaveLength(7);
    for (const path of r.written) {
      expect(existsSync(path)).toBe(true);
    }
    const root = join(cwd, 'src/lib/components/ui/dialog');
    for (const f of ['Root', 'Trigger', 'Overlay', 'Content', 'Title', 'Description', 'Close']) {
      expect(existsSync(join(root, `${f}.svelte`))).toBe(true);
    }
  });
});

describe('add() — guard rails', () => {
  it('throws UnknownComponentError on a bogus component', () => {
    expect(() => add('bogus', { cwd })).toThrow(UnknownComponentError);
  });

  it('throws FileExistsError when a destination file already exists', () => {
    add('toggle', { cwd });
    expect(() => add('toggle', { cwd })).toThrow(FileExistsError);
  });

  it('overwrites with --force', () => {
    add('toggle', { cwd });
    const dest = join(cwd, 'src/lib/components/ui/toggle/Toggle.svelte');
    writeFileSync(dest, '// stale content\n');
    add('toggle', { cwd, force: true });
    expect(readFileSync(dest, 'utf8')).toMatch(/fake toggle tailwind/);
  });

  it('--dry-run writes nothing but reports `written` paths', () => {
    const r = add('toggle', { cwd, dryRun: true });
    expect(r.written).toHaveLength(1);
    expect(existsSync(r.written[0]!)).toBe(false);
  });

  it('--dry-run on existing files reports them as `skipped`, not error', () => {
    add('toggle', { cwd });
    const r = add('toggle', { cwd, dryRun: true });
    expect(r.skipped).toHaveLength(1);
    expect(r.written).toHaveLength(0);
  });

  it('throws AtelierNotInstalledError when @kumiki/atelier is missing', () => {
    rmSync(atelierRoot, { recursive: true });
    expect(() => add('toggle', { cwd })).toThrow(AtelierNotInstalledError);
  });
});

describe('resolveAtelierRoot', () => {
  it('finds @kumiki/atelier/dist directly under cwd', () => {
    expect(resolveAtelierRoot(cwd)).toBe(atelierRoot);
  });

  it('walks up to a parent containing node_modules/@kumiki/atelier/dist', () => {
    const child = join(cwd, 'apps', 'docs');
    mkdirSync(child, { recursive: true });
    expect(resolveAtelierRoot(child)).toBe(atelierRoot);
  });

  it('throws AtelierNotInstalledError when there is no install', () => {
    const detachedTmp = mkdtempSync(join(tmpdir(), 'kumiki-cli-detached-'));
    try {
      expect(() => resolveAtelierRoot(detachedTmp)).toThrow(AtelierNotInstalledError);
    } finally {
      rmSync(detachedTmp, { recursive: true, force: true });
    }
  });
});
