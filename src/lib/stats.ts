/**
 * Statistical utilities for A/B experiment analysis
 */

/**
 * Standard normal cumulative distribution function (approximation)
 * Uses Abramowitz and Stegun approximation
 */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Inverse normal CDF (quantile function) - approximation
 */
function normalQuantile(p: number): number {
  if (p <= 0 || p >= 1) {
    throw new Error('p must be between 0 and 1');
  }

  // Rational approximation for central region
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.383577518672690e2, -3.066479806614716e1, 2.506628277459239e0,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
    -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
    3.754408661907416e0,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number, r: number;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  } else if (p <= pHigh) {
    q = p - 0.5;
    r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
}

/**
 * Calculate required sample size per variant for a two-proportion z-test
 *
 * @param baselineRate - Expected conversion rate in control (e.g., 0.24 for 24%)
 * @param minDetectableEffect - Minimum relative effect to detect (e.g., 0.20 for 20% lift)
 * @param power - Statistical power (default 0.80)
 * @param alpha - Significance level (default 0.05, two-tailed)
 * @returns Required sample size per variant
 */
export function requiredSampleSize(
  baselineRate: number,
  minDetectableEffect: number,
  power: number = 0.80,
  alpha: number = 0.05
): number {
  if (baselineRate <= 0 || baselineRate >= 1) {
    throw new Error('Baseline rate must be between 0 and 1');
  }
  if (minDetectableEffect <= 0) {
    throw new Error('Minimum detectable effect must be positive');
  }

  // Treatment rate based on relative lift
  const treatmentRate = baselineRate * (1 + minDetectableEffect);

  if (treatmentRate >= 1) {
    throw new Error('Treatment rate would exceed 100%');
  }

  // Pooled proportion
  const pooledRate = (baselineRate + treatmentRate) / 2;

  // Z-scores for alpha/2 and power
  const zAlpha = normalQuantile(1 - alpha / 2); // Two-tailed
  const zBeta = normalQuantile(power);

  // Sample size formula for two-proportion test
  const numerator =
    2 * pooledRate * (1 - pooledRate) * Math.pow(zAlpha + zBeta, 2);
  const denominator = Math.pow(treatmentRate - baselineRate, 2);

  return Math.ceil(numerator / denominator);
}

/**
 * Calculate experiment duration given sample size and daily signups
 */
export function experimentDuration(
  sampleSizePerVariant: number,
  dailySignups: number
): number {
  const totalRequired = sampleSizePerVariant * 2; // Both variants
  return Math.ceil(totalRequired / dailySignups);
}

export interface SignificanceResult {
  controlRate: number;
  treatmentRate: number;
  absoluteDiff: number;
  relativeLift: number;
  confidenceInterval: { lower: number; upper: number };
  pValue: number;
  significant: boolean;
  status: 'significant' | 'not_significant' | 'insufficient_data';
}

/**
 * Calculate confidence interval and p-value for difference in proportions
 * Uses pooled standard error and z-test
 *
 * @param controlN - Number of users in control
 * @param controlSuccesses - Number of conversions in control
 * @param treatmentN - Number of users in treatment
 * @param treatmentSuccesses - Number of conversions in treatment
 * @param confidence - Confidence level (default 0.95)
 * @param minSampleSize - Minimum sample per variant to report (default 30)
 */
export function proportionSignificance(
  controlN: number,
  controlSuccesses: number,
  treatmentN: number,
  treatmentSuccesses: number,
  confidence: number = 0.95,
  minSampleSize: number = 30
): SignificanceResult {
  // Rates
  const controlRate = controlN > 0 ? controlSuccesses / controlN : 0;
  const treatmentRate = treatmentN > 0 ? treatmentSuccesses / treatmentN : 0;
  const absoluteDiff = treatmentRate - controlRate;
  const relativeLift = controlRate > 0 ? absoluteDiff / controlRate : 0;

  // Check for insufficient data
  if (controlN < minSampleSize || treatmentN < minSampleSize) {
    return {
      controlRate,
      treatmentRate,
      absoluteDiff,
      relativeLift,
      confidenceInterval: { lower: NaN, upper: NaN },
      pValue: NaN,
      significant: false,
      status: 'insufficient_data',
    };
  }

  // Pooled proportion for standard error under null hypothesis
  const pooledRate = (controlSuccesses + treatmentSuccesses) / (controlN + treatmentN);

  // Standard error for the difference (pooled)
  const se = Math.sqrt(
    pooledRate * (1 - pooledRate) * (1 / controlN + 1 / treatmentN)
  );

  // Z-score
  const z = se > 0 ? absoluteDiff / se : 0;

  // P-value (two-tailed)
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));

  // Confidence interval (using unpooled SE for CI)
  const seUnpooled = Math.sqrt(
    (controlRate * (1 - controlRate)) / controlN +
      (treatmentRate * (1 - treatmentRate)) / treatmentN
  );
  const zCritical = normalQuantile(1 - (1 - confidence) / 2);
  const marginOfError = zCritical * seUnpooled;

  const alpha = 1 - confidence;
  const significant = pValue < alpha;

  return {
    controlRate,
    treatmentRate,
    absoluteDiff,
    relativeLift,
    confidenceInterval: {
      lower: absoluteDiff - marginOfError,
      upper: absoluteDiff + marginOfError,
    },
    pValue,
    significant,
    status: significant ? 'significant' : 'not_significant',
  };
}

/**
 * Calculate significance for continuous metrics (time to value)
 * Uses Welch's t-test for unequal variances
 */
export interface ContinuousSignificanceResult {
  controlMean: number;
  treatmentMean: number;
  absoluteDiff: number;
  percentChange: number;
  confidenceInterval: { lower: number; upper: number };
  pValue: number;
  significant: boolean;
  status: 'significant' | 'not_significant' | 'insufficient_data';
}

export function continuousSignificance(
  controlValues: number[],
  treatmentValues: number[],
  confidence: number = 0.95,
  minSampleSize: number = 30
): ContinuousSignificanceResult {
  const controlN = controlValues.length;
  const treatmentN = treatmentValues.length;

  const mean = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const variance = (arr: number[], m: number) =>
    arr.length > 1
      ? arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0) / (arr.length - 1)
      : 0;

  const controlMean = mean(controlValues);
  const treatmentMean = mean(treatmentValues);
  const absoluteDiff = treatmentMean - controlMean;
  const percentChange = controlMean !== 0 ? absoluteDiff / controlMean : 0;

  if (controlN < minSampleSize || treatmentN < minSampleSize) {
    return {
      controlMean,
      treatmentMean,
      absoluteDiff,
      percentChange,
      confidenceInterval: { lower: NaN, upper: NaN },
      pValue: NaN,
      significant: false,
      status: 'insufficient_data',
    };
  }

  const controlVar = variance(controlValues, controlMean);
  const treatmentVar = variance(treatmentValues, treatmentMean);

  // Welch's t-test
  const se = Math.sqrt(controlVar / controlN + treatmentVar / treatmentN);
  const t = se > 0 ? absoluteDiff / se : 0;

  // Welch-Satterthwaite degrees of freedom
  const num = Math.pow(controlVar / controlN + treatmentVar / treatmentN, 2);
  const denom =
    Math.pow(controlVar / controlN, 2) / (controlN - 1) +
    Math.pow(treatmentVar / treatmentN, 2) / (treatmentN - 1);
  const df = denom > 0 ? num / denom : 1;

  // Approximate p-value using normal distribution (good for large samples)
  const pValue = 2 * (1 - normalCDF(Math.abs(t)));

  // Confidence interval
  const zCritical = normalQuantile(1 - (1 - confidence) / 2);
  const marginOfError = zCritical * se;

  const alpha = 1 - confidence;
  const significant = pValue < alpha;

  return {
    controlMean,
    treatmentMean,
    absoluteDiff,
    percentChange,
    confidenceInterval: {
      lower: absoluteDiff - marginOfError,
      upper: absoluteDiff + marginOfError,
    },
    pValue,
    significant,
    status: significant ? 'significant' : 'not_significant',
  };
}
