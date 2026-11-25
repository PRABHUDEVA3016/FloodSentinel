export interface MonthlyNightlightRecord {
  month: string;
  label: string;
  radiance: number;
  cloudFreeCoverage: number;
  changePct?: number;
  year: number;
}

export const NIGHTLIGHTS_MONTHLY: MonthlyNightlightRecord[] = [
  { month: '2021-01-01', label: 'Jan 2021', radiance: 1.0371, cloudFreeCoverage: 14.31, year: 2021 },
  { month: '2021-02-01', label: 'Feb 2021', radiance: 1.2678, cloudFreeCoverage: 14.46, changePct: 22.25, year: 2021 },
  { month: '2021-03-01', label: 'Mar 2021', radiance: 1.2099, cloudFreeCoverage: 12.96, changePct: -4.56, year: 2021 },
  { month: '2021-04-01', label: 'Apr 2021', radiance: 1.1070, cloudFreeCoverage: 10.25, changePct: -8.51, year: 2021 },
  { month: '2021-05-01', label: 'May 2021', radiance: 1.1068, cloudFreeCoverage: 7.14, changePct: -0.02, year: 2021 },
  { month: '2021-06-01', label: 'Jun 2021', radiance: 0.5936, cloudFreeCoverage: 1.16, changePct: -46.37, year: 2021 },
  { month: '2021-07-01', label: 'Jul 2021', radiance: 0.8594, cloudFreeCoverage: 0.64, changePct: 44.78, year: 2021 },
  { month: '2021-08-01', label: 'Aug 2021', radiance: 0.0976, cloudFreeCoverage: 0.12, changePct: -88.65, year: 2021 },
  { month: '2021-09-01', label: 'Sep 2021', radiance: 0.8134, cloudFreeCoverage: 2.10, changePct: 733.69, year: 2021 },
  { month: '2021-10-01', label: 'Oct 2021', radiance: 1.2015, cloudFreeCoverage: 12.11, changePct: 47.71, year: 2021 },
  { month: '2021-11-01', label: 'Nov 2021', radiance: 1.5313, cloudFreeCoverage: 13.41, changePct: 27.45, year: 2021 },
  { month: '2021-12-01', label: 'Dec 2021', radiance: 1.3632, cloudFreeCoverage: 12.72, changePct: -10.98, year: 2021 },
  { month: '2022-01-01', label: 'Jan 2022', radiance: 1.2494, cloudFreeCoverage: 15.41, changePct: -8.35, year: 2022 },
  { month: '2022-02-01', label: 'Feb 2022', radiance: 1.1665, cloudFreeCoverage: 9.07, changePct: -6.64, year: 2022 },
  { month: '2022-03-01', label: 'Mar 2022', radiance: 1.3866, cloudFreeCoverage: 12.33, changePct: 18.87, year: 2022 },
  { month: '2022-04-01', label: 'Apr 2022', radiance: 1.1406, cloudFreeCoverage: 6.76, changePct: -17.74, year: 2022 },
  { month: '2022-05-01', label: 'May 2022', radiance: 1.2245, cloudFreeCoverage: 6.37, changePct: 7.35, year: 2022 },
  { month: '2022-06-01', label: 'Jun 2022', radiance: 0.0527, cloudFreeCoverage: 0.07, changePct: -95.70, year: 2022 },
  { month: '2022-07-01', label: 'Jul 2022', radiance: 0.2098, cloudFreeCoverage: 0.26, changePct: 298.35, year: 2022 },
  { month: '2022-08-01', label: 'Aug 2022', radiance: 1.3440, cloudFreeCoverage: 5.69, changePct: 540.51, year: 2022 },
  { month: '2022-09-01', label: 'Sep 2022', radiance: 0.7986, cloudFreeCoverage: 1.70, changePct: -40.58, year: 2022 },
  { month: '2022-10-01', label: 'Oct 2022', radiance: 1.3856, cloudFreeCoverage: 9.24, changePct: 73.51, year: 2022 },
  { month: '2022-11-01', label: 'Nov 2022', radiance: 1.3308, cloudFreeCoverage: 14.54, changePct: -3.96, year: 2022 },
  { month: '2022-12-01', label: 'Dec 2022', radiance: 1.1981, cloudFreeCoverage: 15.04, changePct: -9.97, year: 2022 },
];

export const VIIRS_SUMMARY = {
  dataSource: 'NOAA VIIRS DNB MONTHLY V1 VCMSLCFG',
  observations: 24,
  monthlyMeanRadiance: 1.0281,
  yearlyMeanRadiance: {
    '2021': 1.0157,
    '2022': 1.0406
  },
  annualChangePct: 2.45,
  interpretation: 'Nightlight radiance is an economic activity proxy, not direct GDP measurement or confirmed flood damage.'
};
