export interface GhslComparisonRecord {
  ghslReference: string;
  originalCandidatePixels: number;
  improvedCandidatePixels: number;
  originalGhslOverlapPixels: number;
  improvedGhslOverlapPixels: number;
  originalGhslOverlapKm2: number;
  improvedGhslOverlapKm2: number;
  originalOverlapPercentage: number;
  improvedOverlapPercentage: number;
  interpretation: string;
}

export const GHSL_DATA: GhslComparisonRecord = {
  ghslReference: 'GHSL_Silchar_2020.tif',
  originalCandidatePixels: 1790919,
  improvedCandidatePixels: 1776561,
  originalGhslOverlapPixels: 336632,
  improvedGhslOverlapPixels: 331631,
  originalGhslOverlapKm2: 33.6632,
  improvedGhslOverlapKm2: 33.1631,
  originalOverlapPercentage: 18.7966,
  improvedOverlapPercentage: 18.6670,
  interpretation: 'GHSL-positive-value overlap is a spatial screening indicator, not confirmed building exposure or flood damage.'
};
