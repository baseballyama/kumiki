import competitorSizes from '../../../data/competitor-sizes.json';
import type { PageLoad } from './$types';

export interface SizeRow {
  library: string;
  version: string;
  gzip: number;
  framework: string;
  verified: string;
}

export interface ComponentComparison {
  component: string;
  kumikiSubpath: string;
  rows: ReadonlyArray<SizeRow>;
}

export interface CompareData {
  methodology: string;
  generatedAt: string;
  components: ReadonlyArray<ComponentComparison>;
  caveats: ReadonlyArray<string>;
}

export const load: PageLoad = async () => {
  return {
    compare: competitorSizes as CompareData,
  };
};
