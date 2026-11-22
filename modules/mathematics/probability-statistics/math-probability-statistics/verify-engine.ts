import {
  ProbabilityEngine,
  MultivariateGaussian,
  BayesianEstimator,
  MonteCarloIntegrator
} from './probability-engine';

console.log("=== RUNNING PROBABILITY & STOCHASTIC ENGINE VERIFICATION SUITE ===");

const engine = new ProbabilityEngine(42n);

// 1. Verification of Standard Normal Moments
const N_SAMPLES = 200_000;
let sum = 0;
let sumSq = 0;
let sumCube = 0;
let sumQuad = 0;

for (let i = 0; i < N_SAMPLES; i++) {
  const z = engine.standardNormal();
  sum += z;
  sumSq += z * z;
  sumCube += z * z * z;
  sumQuad += z * z * z * z;
}

const mean = sum / N_SAMPLES;
const variance = sumSq / N_SAMPLES - mean * mean;
const skewness = (sumCube / N_SAMPLES) / Math.pow(variance, 1.5);
const kurtosis = (sumQuad / N_SAMPLES) / Math.pow(variance, 2.0);

console.log(`Standard Normal Empirical Moments (N=${N_SAMPLES}):`);
console.log(`  Mean:     ${mean.toFixed(5)} (Expected: 0.00000, error: ${Math.abs(mean).toFixed(5)})`);
console.log(`  Variance: ${variance.toFixed(5)} (Expected: 1.00000, error: ${Math.abs(variance - 1).toFixed(5)})`);
console.log(`  Skewness: ${skewness.toFixed(5)} (Expected: 0.00000, error: ${Math.abs(skewness).toFixed(5)})`);
console.log(`  Kurtosis: ${kurtosis.toFixed(5)} (Expected: 3.00000, error: ${Math.abs(kurtosis - 3).toFixed(5)})`);

if (Math.abs(mean) > 0.02 || Math.abs(variance - 1) > 0.02 || Math.abs(kurtosis - 3) > 0.1) {
  throw new Error("Normal generator moment verification failed!");
}
console.log("-> PASSED: Standard Normal Moments verified within statistical error bounds.");

// 2. Verification of Multivariate Gaussian & Cholesky
const mu = [10, 20];
const cov = [
  [4, 3],
  [3, 9]
];
const mvn = new MultivariateGaussian(mu, cov);
console.log(`Cholesky Factor L:`);
console.log(`  [${mvn.L[0][0].toFixed(4)}, ${mvn.L[0][1].toFixed(4)}]`);
console.log(`  [${mvn.L[1][0].toFixed(4)}, ${mvn.L[1][1].toFixed(4)}]`);

// Check L * L^T matches cov
const reconstructed00 = mvn.L[0][0] * mvn.L[0][0];
const reconstructed10 = mvn.L[1][0] * mvn.L[0][0];
const reconstructed11 = mvn.L[1][0] * mvn.L[1][0] + mvn.L[1][1] * mvn.L[1][1];
if (Math.abs(reconstructed00 - 4) > 1e-10 || Math.abs(reconstructed10 - 3) > 1e-10 || Math.abs(reconstructed11 - 9) > 1e-10) {
  throw new Error("Cholesky reconstruction failed!");
}
console.log("-> PASSED: Cholesky decomposition L * L^T exactly reconstructs covariance matrix.");

// 3. Verification of Mahalanobis Distance on Ellipsoid
// A point at mu + L * [1, 0]^T has Mahalanobis distance exactly 1.0
const testPoint = [mu[0] + mvn.L[0][0], mu[1] + mvn.L[1][0]];
const dM2 = mvn.mahalanobisSquared(testPoint);
console.log(`Mahalanobis distance squared of 1-sigma point: ${dM2.toFixed(6)} (Expected: 1.000000)`);
if (Math.abs(dM2 - 1.0) > 1e-10) {
  throw new Error("Mahalanobis distance calculation failed!");
}
console.log("-> PASSED: Mahalanobis metric verified.");

// 4. Verification of Bayesian Beta-Binomial Updating
const betaUpdate = BayesianEstimator.updateBetaBinomial(2, 8, 30, 100);
console.log(`Bayesian Beta-Binomial: Prior Beta(2, 8), Data: 30/100`);
console.log(`  Posterior: Beta(${betaUpdate.alphaPost}, ${betaUpdate.betaPost})`);
console.log(`  Posterior Mean: ${betaUpdate.mean.toFixed(5)} (Expected: 32/110 = 0.29091)`);
console.log(`  Posterior MAP:  ${betaUpdate.map.toFixed(5)} (Expected: 31/108 = 0.28704)`);
if (Math.abs(betaUpdate.mean - 32 / 110) > 1e-10 || Math.abs(betaUpdate.map - 31 / 108) > 1e-10) {
  throw new Error("Beta-Binomial update failed!");
}
console.log("-> PASSED: Bayesian conjugate updating verified.");

// 5. Verification of Monte Carlo Integration
// Integrate quarter circle: f(x, y) = 1 if x^2 + y^2 <= 1 else 0 over [0, 1]x[0, 1] => Integral = pi / 4
const quarterCircle = (pt: number[]) => (pt[0] * pt[0] + pt[1] * pt[1] <= 1.0 ? 1.0 : 0.0);
const mcResult = MonteCarloIntegrator.integrate(quarterCircle, [0, 0], [1, 1], 100_000, engine);
const piEstimate = mcResult.estimate * 4.0;
const piError = Math.abs(piEstimate - Math.PI);
console.log(`Monte Carlo Pi Estimation (100k samples):`);
console.log(`  Pi Estimate: ${piEstimate.toFixed(5)} (True Pi: ${Math.PI.toFixed(5)}, error: ${piError.toFixed(5)})`);
console.log(`  95% CI: [${(mcResult.ciLower * 4).toFixed(5)}, ${(mcResult.ciUpper * 4).toFixed(5)}]`);
if (piError > 0.03) {
  throw new Error("Monte Carlo Pi integration exceeded tolerance!");
}
console.log("-> PASSED: Monte Carlo integration verified.");

console.log("=== ALL STOCHASTIC ENGINE UNIT TESTS PASSED WITH ZERO REGRESSIONS ===");
