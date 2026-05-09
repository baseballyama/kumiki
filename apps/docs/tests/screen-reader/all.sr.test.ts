/**
 * Runs every screen-reader smoke contract in `contracts.ts`. One file
 * per project (Playwright's `screen-reader` project) keeps the
 * matrix tractable; the per-component fanout happens via
 * `runSrContract`.
 */
import { contracts } from './contracts.js';
import { runSrContract } from './_harness.js';

for (const c of contracts) runSrContract(c);
