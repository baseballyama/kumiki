import { asset } from '$app/paths';
import type { PageLoad } from './$types';

export interface SizeEntry {
  name: string;
  size: number;
  sizeLimit: number;
  passed: boolean;
}

export interface SizePackage {
  package: string;
  directory: string;
  entries: ReadonlyArray<SizeEntry>;
}

export interface SizesData {
  generatedAt: string;
  packages: ReadonlyArray<SizePackage>;
}

export const load: PageLoad = async ({ fetch }) => {
  const response = await fetch(asset('/sizes.json'));
  if (!response.ok) {
    return { sizes: null as SizesData | null };
  }
  const sizes = (await response.json()) as SizesData;
  return { sizes };
};

// SSR / on-demand render is fine — the JSON is small and Cloudflare's
// edge caches the result. (Prerendering exposes a global favicon-missing
// error in this project; not worth fixing for one page.)
