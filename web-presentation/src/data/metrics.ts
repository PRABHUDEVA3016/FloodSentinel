export interface VerifiedMetrics {
  originalCandidatePixels: number;
  improvedCandidatePixels: number;
  excludedWaterPixels: number;
  originalCandidateAreaKm2: number;
  excludedWaterAreaKm2: number;
  improvedCandidateAreaKm2: number;
  extractedPolygons: number;
  originalGhslOverlapPixels: number;
  improvedGhslOverlapPixels: number;
  originalGhslOverlapAreaKm2: number;
  improvedGhslOverlapAreaKm2: number;
  originalGhslOverlapPercent: number;
  improvedGhslOverlapPercent: number;
  viirsObservations: number;
  annualViirsRadianceChangePercent: number;
  integratedRiskStatus: string;
  studyArea: string;
  sensor: string;
  preEventDate: string;
  postEventDate: string;
  jrcThresholdPercent: number;
}

export const VERIFIED_METRICS: VerifiedMetrics = {
  originalCandidatePixels: 1790919,
  improvedCandidatePixels: 1776561,
  excludedWaterPixels: 14358,
  originalCandidateAreaKm2: 179.0919,
  excludedWaterAreaKm2: 1.4358,
  improvedCandidateAreaKm2: 177.6561,
  extractedPolygons: 1189,
  originalGhslOverlapPixels: 336632,
  improvedGhslOverlapPixels: 331631,
  originalGhslOverlapAreaKm2: 33.6632,
  improvedGhslOverlapAreaKm2: 33.1631,
  originalGhslOverlapPercent: 18.7966,
  improvedGhslOverlapPercent: 18.6670,
  viirsObservations: 24,
  annualViirsRadianceChangePercent: 2.45,
  integratedRiskStatus: 'INDICATORS_AVAILABLE',
  studyArea: 'Silchar, Assam, India',
  sensor: 'Sentinel-1A C-band SAR (Descending, Relative Orbit 77)',
  preEventDate: '2022-06-18',
  postEventDate: '2022-06-30',
  jrcThresholdPercent: 90
};
