export interface RiskAssessmentData {
  status: string;
  assessmentType: string;
  studyArea: string;
  screeningStatus: string;
  validatedFloodExtent: boolean;
  monetaryDamageEstimated: boolean;
  groundTruthValidation: boolean;
  reason: string;
  indicators: {
    floodCandidateAreaKm2: number;
    floodCandidatePixels: number;
    classification: string;
    ghslOverlapKm2: number;
    ghslOverlapPercentage: number;
    viirsObservations: number;
    annualRadianceChangePct: number;
  };
  limitations: string[];
}

export const RISK_ASSESSMENT: RiskAssessmentData = {
  status: 'COMPLETED',
  assessmentType: 'SPATIAL_RISK_SCREENING',
  studyArea: 'Silchar, Assam, India',
  screeningStatus: 'INDICATORS_AVAILABLE',
  validatedFloodExtent: false,
  monetaryDamageEstimated: false,
  groundTruthValidation: false,
  reason: 'Independent flood reference data and verified asset exposure values are required before operational risk classification.',
  indicators: {
    floodCandidateAreaKm2: 177.6561,
    floodCandidatePixels: 1776561,
    classification: 'SAR_FLOOD_CANDIDATES_AFTER_HISTORICAL_WATER_SCREENING',
    ghslOverlapKm2: 33.1631,
    ghslOverlapPercentage: 18.6670,
    viirsObservations: 24,
    annualRadianceChangePct: 2.45
  },
  limitations: [
    'SAR-derived flood candidates require independent ground-truth validation.',
    'GHSL positive-value overlap is a spatial screening indicator, not confirmed building exposure or damage.',
    'VIIRS radiance is contextual regional economic proxy information.',
    'No actual monetary damage or insurance loss payout is estimated or modeled.'
  ]
};
