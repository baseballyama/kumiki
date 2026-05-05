/**
 * Smoke tests for the `kumiki` CLI binary.
 *
 * The CLI is currently a Phase 0a stub — these tests cover the help and
 * unknown-command paths, locking in their exit codes and output shape so
 * we don't accidentally break them when the real `kumiki add` lands in
 * Phase 1.
 *
 * Spawns the built dist binary directly (skipped if dist isn't present).
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

  it('exits 2 and writes to stderr for an unknown command', () => {
    const r = run(['add']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/not implemented yet/);
  });

  it('exits 2 for a totally bogus command', () => {
    const r = run(['xyz-totally-not-a-command']);
    expect(r.status).toBe(2);
    expect(r.stderr).toMatch(/not implemented yet/);
  });
});
