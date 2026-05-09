/**
 * Smoke tests for the `kumiki` CLI binary.
 *
 * Programmatic-API tests for `add()` live in `../add.test.ts`; these
 * tests cover the bin's argv parsing + exit codes by spawning the built
 * dist binary directly (skipped if dist isn't present).
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const PKG_ROOT = join(dirname(__filename), '..', '..');
const BIN = join(PKG_ROOT, 'dist', 'bin', 'kumiki.mjs');

const distExists = existsSync(BIN);

interface RunResult {
  status: number;
  stdout: string;
  stderr: string;
}

function run(args: ReadonlyArray<string>): RunResult {
  try {
    const out = execFileSync('node', [BIN, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, stdout: out, stderr: '' };
  } catch (err) {
    const e = err as { status?: number; stdout?: string; stderr?: string };
    return {
      status: typeof e.status === 'number' ? e.status : 1,
      stdout: e.stdout?.toString() ?? '',
      stderr: e.stderr?.toString() ?? '',
    };
  }
}

describe.skipIf(!distExists)('@kumiki/cli — bin', () => {
  it('exits 0 and prints help when invoked with no args', () => {
    const r = run([]);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage:/);
    expect(r.stdout).toMatch(/kumiki add/);
  });

  it('exits 0 and prints help with --help', () => {
    const r = run(['--help']);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage:/);
  });

  it('exits 0 and prints help with -h', () => {
    const r = run(['-h']);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage:/);
  });

  it('exits 2 with a usage hint when `add` is invoked without a component arg', () => {
    const r = run(['add']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/missing <component>/);
  });

  it('exits 2 for an unknown top-level command', () => {
    const r = run(['xyz-totally-not-a-command']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/unknown command/);
  });

  it('exits 2 for an invalid --variant value', () => {
    const r = run(['add', 'toggle', '--variant=lol']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/invalid --variant/);
  });

  it('exits 2 for an unknown component', () => {
    // Project is run from the kumiki repo cwd, so @kumiki/atelier resolves
    // and the call hits the registry — we just check the registry rejects
    // a bogus name with a clear message.
    const r = run(['add', 'bogus-component']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/Unknown component/);
  });
});
