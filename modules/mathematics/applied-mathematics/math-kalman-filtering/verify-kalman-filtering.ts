/**
 * verify-kalman-filtering.ts
 *
 * Comprehensive Automated Verification Suite for `kalman-filter-engine.ts`
 * 8 Suites covering Matrix Algebra, 1D Scalar KF, Linear Multivariable KF,
 * Joseph Stabilized Form, EKF, UKF, RTS Backward Smoother, and Chi-Square Gating.
 */

import {
  Vector,
  Matrix,
  ScalarKalmanFilter,
  LinearKalmanFilter,
  ExtendedKalmanFilter,
  UnscentedKalmanFilter,
  RTSSmoother,
  ChiSquareGating,
  ForwardTrajectoryEntry,
} from "./kalman-filter-engine.js";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail: string = ""): void {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] Test ${totalTests}: ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] Test ${totalTests}: ${testName} - ${detail}`);
  }
}

function assertClose(actual: number, expected: number, tol: number, testName: string): void {
  const diff = Math.abs(actual - expected);
  assert(diff <= tol, testName, `expected ${expected}, got ${actual} (diff: ${diff.toExponential(4)}, tol: ${tol.toExponential(4)})`);
}

console.log("===============================================================================");
console.log("       AUTOMATED VERIFICATION SUITE: math-kalman-filtering (SMTS-40K)");
console.log("===============================================================================\n");

// ============================================================================
// SUITE 1: Linear Algebra, Cholesky Factorization & Positive Definiteness
// ============================================================================
console.log("--- SUITE 1: Matrix Algebra, Cholesky Factorization & Inversion ---");

{
  // 1.1 Vector arithmetic
  const v1 = Vector.from([1, 2, 3]);
  const v2 = Vector.from([4, 5, 6]);
  assertClose(v1.dot(v2), 32.0, 1e-12, "Vector dot product (1*4 + 2*5 + 3*6 = 32)");
  assertClose(v1.norm(), Math.sqrt(14), 1e-12, "Vector Euclidean norm");

  const vSum = v1.add(v2);
  assert(vSum.get(0) === 5 && vSum.get(1) === 7 && vSum.get(2) === 9, "Vector addition");

  // 1.2 Matrix multiplication and transpose
  const A = Matrix.from([
    [1, 2],
    [3, 4],
  ]);
  const At = A.transpose();
  assert(At.get(0, 1) === 3 && At.get(1, 0) === 2, "Matrix transpose");

  const I2 = Matrix.eye(2);
  const AI = A.multiply(I2);
  assertClose(AI.get(0, 0), 1, 1e-12, "Matrix multiply identity (0,0)");
  assertClose(AI.get(1, 1), 4, 1e-12, "Matrix multiply identity (1,1)");

  // 1.3 Determinant & Inversion
  assertClose(A.determinant(), -2.0, 1e-10, "Matrix determinant (1*4 - 2*3 = -2)");
  const Ainv = A.inverse();
  const prod = A.multiply(Ainv);
  assertClose(prod.get(0, 0), 1.0, 1e-10, "Matrix inverse round-trip (0,0)");
  assertClose(prod.get(0, 1), 0.0, 1e-10, "Matrix inverse round-trip (0,1)");
  assertClose(prod.get(1, 0), 0.0, 1e-10, "Matrix inverse round-trip (1,0)");
  assertClose(prod.get(1, 1), 1.0, 1e-10, "Matrix inverse round-trip (1,1)");

  // 1.4 Linear system solve: A x = b
  const b = Vector.from([5, 11]);
  const x = A.solve(b);
  // Solution to [[1,2],[3,4]] x = [5,11] is x = [1, 2]
  assertClose(x.get(0), 1.0, 1e-10, "Linear system solve x[0] = 1");
  assertClose(x.get(1), 2.0, 1e-10, "Linear system solve x[1] = 2");

  // 1.5 Cholesky factorization: S = L L^T
  const S = Matrix.from([
    [4.0, 2.0],
    [2.0, 5.0],
  ]);
  const L = S.cholesky();
  assert(L.get(0, 1) === 0, "Cholesky factor L is strictly lower triangular");
  assertClose(L.get(0, 0), 2.0, 1e-12, "Cholesky L(0,0) = sqrt(4) = 2");
  assertClose(L.get(1, 0), 1.0, 1e-12, "Cholesky L(1,0) = 2/2 = 1");
  assertClose(L.get(1, 1), 2.0, 1e-12, "Cholesky L(1,1) = sqrt(5 - 1^2) = 2");

  const LLt = L.multiply(L.transpose());
  assertClose(LLt.get(0, 0), S.get(0, 0), 1e-12, "Cholesky reconstruction S(0,0)");
  assertClose(LLt.get(0, 1), S.get(0, 1), 1e-12, "Cholesky reconstruction S(0,1)");
  assertClose(LLt.get(1, 0), S.get(1, 0), 1e-12, "Cholesky reconstruction S(1,0)");
  assertClose(LLt.get(1, 1), S.get(1, 1), 1e-12, "Cholesky reconstruction S(1,1)");

  // 1.6 Cholesky rejection on non-positive definite matrix
  const nonPD = Matrix.from([
    [1.0, 2.0],
    [2.0, 1.0],
  ]); // det = 1 - 4 = -3 < 0
  let threwPD = false;
  try {
    nonPD.cholesky();
  } catch (e) {
    threwPD = true;
  }
  assert(threwPD, "Cholesky correctly rejects indefinite matrix with negative pivot");
}

// ============================================================================
// SUITE 2: 1D Scalar Kalman Filter Mechanics & DARE Asymptotics
// ============================================================================
console.log("\n--- SUITE 2: 1D Scalar Kalman Filter & DARE Asymptotics ---");

{
  // System: a = 1, b = 0, c = 1, q = 3, r = 1
  // DARE: p^2 - 3p - 3 = 0 => p_inf = (3 + sqrt(21)) / 2 = 3.7912878...
  const skf = new ScalarKalmanFilter(0.0, 100.0, 1.0, 0.0, 1.0, 3.0, 1.0);

  const pInfExpected = (3.0 + Math.sqrt(21.0)) / 2.0;
  assertClose(skf.computeSteadyStateVariance(), pInfExpected, 1e-10, "Scalar DARE analytical variance p_inf");

  const kInfExpected = pInfExpected / (pInfExpected + 1.0);
  assertClose(skf.computeSteadyStateGain(), kInfExpected, 1e-10, "Scalar DARE steady-state gain K_inf");

  // Step 1: Predict & Update from P0 = 100
  const pred1 = skf.predict();
  assertClose(pred1.pPrior, 103.0, 1e-10, "Scalar predict: pPrior = 100*1^2 + 3 = 103");

  const upd1 = skf.update(10.0);
  assert(upd1.pPost < upd1.pPrior, "Scalar update: monotonic variance contraction (pPost < pPrior)");
  assertClose(upd1.pPost, 103.0 / 104.0, 1e-10, "Scalar update: pPost = (1 - 103/104)*103 = 103/104 = 0.9904");

  // Run 10 iterations to verify convergence to DARE p_inf
  for (let k = 0; k < 10; k++) {
    skf.predict();
    skf.update(10.0);
  }
  // After predict, pPrior should match p_inf
  const pPriorConverged = skf.predict().pPrior;
  assertClose(pPriorConverged, pInfExpected, 1e-4, "Scalar filter converges to theoretical DARE p_inf within 10 steps");

  // Asymptotic test: r -> 0 => K -> 1/c
  const skfZeroR = new ScalarKalmanFilter(0.0, 5.0, 1.0, 0.0, 2.0, 1.0, 1e-9);
  const updZeroR = skfZeroR.update(10.0);
  assertClose(updZeroR.gain, 1.0 / 2.0, 1e-4, "Limiting behavior: as r -> 0, Kalman gain K -> 1/c = 0.5");

  // Asymptotic test: r -> infty => K -> 0
  const skfInfR = new ScalarKalmanFilter(0.0, 5.0, 1.0, 0.0, 1.0, 1.0, 1e9);
  const updInfR = skfInfR.update(10.0);
  assertClose(updInfR.gain, 0.0, 1e-6, "Limiting behavior: as r -> infty, Kalman gain K -> 0");
}

// ============================================================================
// SUITE 3: Multivariable Linear Kalman Filter (2D Kinematics)
// ============================================================================
console.log("\n--- SUITE 3: Multivariable Linear Kalman Filter (2D Tracking) ---");

{
  // State x = [p, v]^T
  const F = Matrix.from([
    [1.0, 1.0],
    [0.0, 1.0],
  ]);
  const Q = Matrix.from([
    [0.1, 0.05],
    [0.05, 0.2],
  ]);
  const H = Matrix.from([[1.0, 0.0]]);
  const R = Matrix.from([[0.5]]);

  const x0 = Vector.from([10.0, 2.0]);
  const P0 = Matrix.from([
    [1.0, 0.2],
    [0.2, 0.5],
  ]);

  const lkf = new LinearKalmanFilter(x0, P0, F, null, H, Q, R);

  // Predict step
  const pred = lkf.predict();
  assertClose(pred.xPrior.get(0), 12.0, 1e-10, "LKF predict: p = 10 + 2*1 = 12");
  assertClose(pred.xPrior.get(1), 2.0, 1e-10, "LKF predict: v = 2.0");
  assertClose(pred.pPrior.get(0, 0), 2.0, 1e-10, "LKF predict: P(0,0) = 2.0");
  assertClose(pred.pPrior.get(0, 1), 0.75, 1e-10, "LKF predict: P(0,1) = 0.75");
  assertClose(pred.pPrior.get(1, 1), 0.70, 1e-10, "LKF predict: P(1,1) = 0.70");

  // Measurement update with position z = 12.8
  const z = Vector.from([12.8]);
  const upd = lkf.update(z);

  assertClose(upd.y.get(0), 0.8, 1e-10, "LKF innovation: y = 12.8 - 12.0 = 0.8");
  assertClose(upd.S.get(0, 0), 2.5, 1e-10, "LKF innovation variance: S = 2.0 + 0.5 = 2.5");
  assertClose(upd.K.get(0, 0), 0.80, 1e-10, "LKF gain K[0] = 2.0 / 2.5 = 0.8");
  assertClose(upd.K.get(1, 0), 0.30, 1e-10, "LKF gain K[1] = 0.75 / 2.5 = 0.3");

  // Updated state: xPost = [12.0 + 0.8*0.8, 2.0 + 0.3*0.8] = [12.64, 2.24]
  assertClose(upd.xPost.get(0), 12.64, 1e-10, "LKF updated position xPost[0] = 12.64");
  assertClose(upd.xPost.get(1), 2.24, 1e-10, "LKF updated velocity xPost[1] = 2.24");

  // Cross-covariance conditioning: velocity variance reduced from 0.70 down to 0.475
  assertClose(upd.pPost.get(1, 1), 0.475, 1e-10, "LKF velocity variance contraction: P(1,1) = 0.475 < 0.70");
  assertClose(upd.pPost.get(0, 0), 0.40, 1e-10, "LKF position variance: P(0,0) = 0.40");
}

// ============================================================================
// SUITE 4: Joseph Form Numerical Stability & Invariant Verification
// ============================================================================
console.log("\n--- SUITE 4: Joseph Form Numerical Stability & Symmetry ---");

{
  // Ill-conditioned measurement noise R = 1e-10
  const P_prior = Matrix.from([
    [2.0, 0.75],
    [0.75, 0.70],
  ]);
  const H = Matrix.from([[1.0, 0.0]]);
  const R_tiny = Matrix.from([[1e-10]]);

  // Sub-optimal / perturbed gain K to test Joseph robustness
  const K_perturbed = Matrix.from([[0.95], [0.35]]);

  // 1. Textbook formula: P_textbook = (I - K H) * P
  const I2 = Matrix.eye(2);
  const P_textbook = I2.sub(K_perturbed.multiply(H)).multiply(P_prior);
  const isTextbookSymmetric = Math.abs(P_textbook.get(0, 1) - P_textbook.get(1, 0)) < 1e-12;
  assert(!isTextbookSymmetric, "Textbook formula loses symmetry under non-optimal gain (P12 != P21)");

  // 2. Joseph form: P_joseph = (I - K H) P (I - K H)^T + K R K^T
  const M = I2.sub(K_perturbed.multiply(H));
  const P_joseph = M.multiply(P_prior).multiply(M.transpose()).add(K_perturbed.multiply(R_tiny).multiply(K_perturbed.transpose())).symmetric();
  const isJosephSymmetric = Math.abs(P_joseph.get(0, 1) - P_joseph.get(1, 0)) < 1e-12;
  assert(isJosephSymmetric, "Joseph form strictly guarantees mathematical symmetry (P12 == P21)");

  // 3. Positive definiteness check: det > 0 and Cholesky succeeds
  assert(P_joseph.determinant() > 0, "Joseph form covariance has strictly positive determinant");
  let cholSucceeded = false;
  try {
    P_joseph.cholesky();
    cholSucceeded = true;
  } catch (e) {
    cholSucceeded = false;
  }
  assert(cholSucceeded, "Joseph form covariance factorizes cleanly via Cholesky (strictly positive-definite)");
}

// ============================================================================
// SUITE 5: Extended Kalman Filter (EKF) on Nonlinear Radar Range-Bearing
// ============================================================================
console.log("\n--- SUITE 5: Extended Kalman Filter (EKF) Nonlinear Radar Tracking ---");

{
  // State: x = [px, py]^T
  // Observation: h(x) = [sqrt(px^2 + py^2), atan2(py, px)]^T
  const f_identity = (x: Vector) => x.clone();
  const h_polar = (x: Vector) => {
    const px = x.get(0);
    const py = x.get(1);
    const range = Math.sqrt(px * px + py * py);
    const bearing = Math.atan2(py, px);
    return Vector.from([range, bearing]);
  };

  const H_analytical = (x: Vector) => {
    const px = x.get(0);
    const py = x.get(1);
    const rho2 = px * px + py * py;
    const rho = Math.sqrt(rho2);
    return Matrix.from([
      [px / rho, py / rho],
      [-py / rho2, px / rho2],
    ]);
  };

  const x_test = Vector.from([3.0, 4.0]);
  const H_ana = H_analytical(x_test);
  const H_num = ExtendedKalmanFilter.computeNumericalJacobian(h_polar, x_test, 2, 1e-6);

  assertClose(H_ana.get(0, 0), H_num.get(0, 0), 1e-5, "EKF Jacobian check: d(range)/dx (analytical vs numerical)");
  assertClose(H_ana.get(0, 1), H_num.get(0, 1), 1e-5, "EKF Jacobian check: d(range)/dy (analytical vs numerical)");
  assertClose(H_ana.get(1, 0), H_num.get(1, 0), 1e-5, "EKF Jacobian check: d(bearing)/dx (analytical vs numerical)");
  assertClose(H_ana.get(1, 1), H_num.get(1, 1), 1e-5, "EKF Jacobian check: d(bearing)/dy (analytical vs numerical)");

  // Test full EKF update step from Problem 8.1
  const Q = Matrix.diag([0.01, 0.01]);
  const R = Matrix.diag([0.1, 0.01]);
  const P0 = Matrix.diag([2.0, 2.0]);
  const ekf = new ExtendedKalmanFilter(x_test.clone(), P0, {
    f: f_identity,
    h: h_polar,
    H_jacobian: H_analytical,
    Q,
    R,
  });

  const z_meas = Vector.from([5.2, 0.95]); // range = 5.2 (vs predicted 5.0), bearing = 0.95 (vs predicted 0.9273)
  const ekfUpd = ekf.update(z_meas, [1]); // angle wrap index 1

  assertClose(ekfUpd.y.get(0), 0.20, 1e-5, "EKF range innovation = 0.20");
  assertClose(ekfUpd.xPost.get(0), 3.0336, 1e-3, "EKF updated x-coordinate ~ 3.0336");
  assertClose(ekfUpd.xPost.get(1), 4.2129, 1e-3, "EKF updated y-coordinate ~ 4.2129");
  assert(ekfUpd.pPost.trace() < P0.trace(), "EKF update contracts total covariance trace");

  // Angle wrapping resilience test
  const z_wrapped = Vector.from([5.0, -Math.PI + 0.05]); // -177 deg
  const x_nearPi = Vector.from([-5.0, 0.1]); // heading ~ +178 deg
  const ekfAngle = new ExtendedKalmanFilter(x_nearPi, P0, {
    f: f_identity,
    h: h_polar,
    Q,
    R,
  });
  const angleUpd = ekfAngle.update(z_wrapped, [1]);
  assert(Math.abs(angleUpd.y.get(1)) < 0.2, "EKF angle wrapping prevents catastrophic 2*pi jump across branch cut");
}

// ============================================================================
// SUITE 6: Unscented Kalman Filter (UKF) vs EKF Benchmark
// ============================================================================
console.log("\n--- SUITE 6: Unscented Kalman Filter (UKF) 3rd-Order Accuracy ---");

{
  // Polar transformation of a Cartesian state with high cross-track uncertainty
  // x = [0, 10]^T, P = diag(1.0, 0.01)
  const mean_cart = Vector.from([0.0, 10.0]);
  const cov_cart = Matrix.diag([1.0, 0.01]);
  const h_range = (x: Vector) => Vector.from([Math.sqrt(x.get(0) * x.get(0) + x.get(1) * x.get(1))]);

  const ukf = new UnscentedKalmanFilter(mean_cart.clone(), cov_cart.clone(), {
    f: (x) => x.clone(),
    h: h_range,
    Q: Matrix.diag([0.01, 0.01]),
    R: Matrix.from([[0.01]]),
    alpha: 1.0,
    beta: 2.0,
    kappa: 0.0,
  });

  // Verify Sigma Points Generation (2n + 1 = 5 points)
  const sigmas = ukf.generateSigmaPoints(mean_cart, cov_cart);
  assert(sigmas.points.length === 5, "UKF generates exactly 2n + 1 = 5 sigma points in 2D");
  assertClose(sigmas.Wm.reduce((a, b) => a + b, 0), 1.0, 1e-12, "UKF mean weights sum exactly to 1.0");

  // True expected range: E[sqrt(x^2 + y^2)] ~ y + E[x^2]/(2y) = 10 + 1.0/20 = 10.0500
  // EKF prediction: h([0, 10]) = 10.0000 (0% of curvature captured)
  // UKF prediction: should capture ~ 10.0498 (99.6% of curvature captured)
  const z_pred_ukf = sigmas.points.reduce((acc, pt, idx) => acc + h_range(pt).get(0) * sigmas.Wm[idx], 0);

  assertClose(z_pred_ukf, 10.0498, 1e-3, "UKF captures 3rd-order nonlinear range curvature (10.0498 vs EKF 10.0000)");

  // Run full UKF update cycle
  const z_obs = Vector.from([10.05]);
  const ukfUpd = ukf.update(z_obs);
  assert(ukfUpd.pPost.get(1, 1) < cov_cart.get(1, 1), "UKF measurement update contracts range covariance");
}

// ============================================================================
// SUITE 7: Rauch-Tung-Striebel (RTS) Optimal Backward Smoother
// ============================================================================
console.log("\n--- SUITE 7: Rauch-Tung-Striebel (RTS) Backward Smoother ---");

{
  // 1D random walk tracking test over 5 steps
  const F = Matrix.from([[1.0]]);
  const Q = Matrix.from([[1.0]]);
  const H = Matrix.from([[1.0]]);
  const R = Matrix.from([[2.0]]);

  const lkf = new LinearKalmanFilter(Vector.from([0.0]), Matrix.from([[1.0]]), F, null, H, Q, R);

  const measurements = [1.0, 2.5, 3.2, 4.8, 5.0];
  const trajectory: ForwardTrajectoryEntry[] = [];

  for (let k = 0; k < measurements.length; k++) {
    const pred = lkf.predict();
    const upd = lkf.update(Vector.from([measurements[k]]));
    trajectory.push({
      xPrior: pred.xPrior,
      pPrior: pred.pPrior,
      xPost: upd.xPost,
      pPost: upd.pPost,
      F,
    });
  }

  // Execute RTS Backward Smoother
  const smoothed = RTSSmoother.smooth(trajectory);
  assert(smoothed.length === trajectory.length, "RTS Smoother outputs exact matching trajectory length");

  // Terminal step N-1: smoothed state and covariance must equal filtered state and covariance
  const last = smoothed.length - 1;
  assertClose(smoothed[last].xSmooth.get(0), trajectory[last].xPost.get(0), 1e-12, "RTS terminal state matches filter x_{N|N}");
  assertClose(smoothed[last].pSmooth.get(0, 0), trajectory[last].pPost.get(0, 0), 1e-12, "RTS terminal covariance matches filter P_{N|N}");

  // Historical steps k < N-1: RTS smoothed covariance must be strictly <= filtered covariance
  let allContracted = true;
  for (let k = 0; k < last; k++) {
    const pFilt = trajectory[k].pPost.get(0, 0);
    const pSmooth = smoothed[k].pSmooth.get(0, 0);
    if (pSmooth > pFilt + 1e-12) {
      allContracted = false;
    }
  }
  assert(allContracted, "RTS Invariant: smoothed covariance is strictly <= filtered covariance (P_{k|N} <= P_{k|k}) for all k");

  // Verify that smoothed variance at step 0 is strictly smaller than causal filter variance
  const pFilt0 = trajectory[0].pPost.get(0, 0);
  const pSmooth0 = smoothed[0].pSmooth.get(0, 0);
  assert(pSmooth0 < pFilt0, `RTS smoothing contracts initial uncertainty (pFilt: ${pFilt0.toFixed(4)} -> pSmooth: ${pSmooth0.toFixed(4)})`);
}

// ============================================================================
// SUITE 8: Chi-Square Statistical Innovation Gating (NIS Fault Detection)
// ============================================================================
console.log("\n--- SUITE 8: Chi-Square Innovation Gating (NIS Fault Detection) ---");

{
  // 2D Innovation vector and covariance
  const S = Matrix.from([
    [3.0, 0.5],
    [0.5, 2.0],
  ]);

  // Nominal in-distribution innovation
  const y_normal = Vector.from([0.5, -0.3]);
  const resNormal = ChiSquareGating.test(y_normal, S, 0.01);

  assert(resNormal.nis < resNormal.threshold, `In-distribution innovation accepted (NIS=${resNormal.nis.toFixed(3)} < threshold=${resNormal.threshold})`);
  assert(!resNormal.isOutlier, "In-distribution measurement not flagged as outlier");

  // Gross sensor failure: 10-sigma outlier jump
  const y_outlier = Vector.from([10.0, 10.0]);
  const resOutlier = ChiSquareGating.test(y_outlier, S, 0.01);

  assert(resOutlier.nis > resOutlier.threshold, `Gross outlier rejected (NIS=${resOutlier.nis.toFixed(3)} > threshold=${resOutlier.threshold})`);
  assert(resOutlier.isOutlier, "Gross sensor failure successfully detected and isolated");

  // Verification of exact Chi-Square thresholds
  assertClose(ChiSquareGating.getThreshold(1, 0.05), 3.841, 1e-3, "Chi2 threshold dof=1, alpha=0.05 is 3.841");
  assertClose(ChiSquareGating.getThreshold(2, 0.01), 9.210, 1e-3, "Chi2 threshold dof=2, alpha=0.01 is 9.210");
  assertClose(ChiSquareGating.getThreshold(3, 0.001), 16.266, 1e-3, "Chi2 threshold dof=3, alpha=0.001 is 16.266");
}

console.log("\n===============================================================================");
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log("===============================================================================");

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED WITH 100% SUCCESS. MATHEMATICALLY & TECHNICALLY VERIFIED.");
}
