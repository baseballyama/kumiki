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

/** Cell value for the a11y feature matrix. */
export type FeatureCell = 'yes' | 'no' | 'partial' | 'manual' | string;

export interface FeatureRow {
  feature: string;
  /** One value per library, in the same order as `featureMatrix.libraries`. */
  values: ReadonlyArray<FeatureCell>;
  note?: string;
}

export interface FeatureMatrix {
  asOf: string;
  sources: string;
  libraries: ReadonlyArray<string>;
  rows: ReadonlyArray<FeatureRow>;
}

export interface CompareData {
  methodology: string;
  generatedAt: string;
  components: ReadonlyArray<ComponentComparison>;
  caveats: ReadonlyArray<string>;
  featureMatrix: FeatureMatrix;
}

export const load: PageLoad = async () => {
  return {
    compare: competitorSizes as CompareData,
  };
};
