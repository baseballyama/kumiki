import type { PageLoad } from './$types';

export interface BenchEntry {
  name: string;
  hz: number;
  rme: number;
  samples: number;
  mean: number;
  p75: number;
  p99: number;
}

export interface BenchGroup {
  name: string;
  benches: ReadonlyArray<BenchEntry>;
}

export interface BenchPackage {
  package: string;
  directory: string;
  groups: ReadonlyArray<BenchGroup>;
}

export interface BenchData {
  generatedAt: string;
  packages: ReadonlyArray<BenchPackage>;
}

import { asset } from '$app/paths';

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch(asset('/benches.json'));
  if (!response.ok) {
    return { benches: null as BenchData | null };
  }
  const benches = (await response.json()) as BenchData;
  return { benches };
};

// Mirrors the /sizes route — SSR/on-demand, JSON is small enough.
