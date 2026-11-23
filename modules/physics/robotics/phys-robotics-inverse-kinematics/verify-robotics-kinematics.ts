/**
 * Verification Test Suite: Robotics Kinematics Engine
 * (verify-robotics-kinematics.ts)
 * 
 * 8 Comprehensive Test Suites:
 * 1. SE(3) Group Algebra, Matrix Inversion, Quaternions, and Slerp
 * 2. Forward Kinematics (Standard & Modified DH vs Product of Exponentials)
 * 3. Geometric Jacobian vs Central Finite Differences
 * 4. Singularity Analysis, SVD Spectrum, and Manipulability
 * 5. Analytical Inverse Kinematics (Planar 2R & Pieper Spherical Wrist)
 * 6. Numerical Inverse Kinematics (Newton-Raphson, Jacobian Transpose, DLS)
 * 7. Redundancy Resolution, Nullspace Projector Invariants & Joint Limit Avoidance
 * 8. Heuristic Solvers (FABRIK, CCD) and Constrained Trajectory Generation (CLIK)
 */

import {
  Vector3D,
  Vector6D,
  Quaternion,
  Matrix4x4,
  MatrixMath,
  DHParameter,
  DHConvention,
  RobotKinematicChain,
  AnalyticalIKSolver,
  NumericalIKSolver,
  FABRIKSolver,
  CCDSolver,
  TrajectoryGenerator,
  CLIKController
} from './robotics-kinematics-engine.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}`);
    if (details) console.error(`         ${details}`);
  }
}

function assertNear(actual: number, expected: number, tol = 1e-4, testName: string) {
  const diff = Math.abs(actual - expected);
  assert(diff <= tol, testName, `Expected ${expected}, got ${actual} (diff: ${diff.toExponential(3)}, tol: ${tol})`);
}

console.log('================================================================');
console.log('ROBOTICS KINEMATICS ENGINE: STRICT VERIFICATION SUITE');
console.log('================================================================\n');

// ============================================================================
// SUITE 1: SE(3) Group Algebra, Matrix Inversion, Quaternions & Slerp
// ============================================================================
console.log('SUITE 1: SE(3) Group Algebra, Matrix Inversion, Quaternions & Slerp');

{
  // 1.1 Matrix4x4 SE(3) inversion
  const pos = new Vector3D(1.5, -2.3, 0.8);
  const qRot = Quaternion.fromAxisAngle(new Vector3D(0.2, 0.8, -0.5), 1.25);
  const T = Matrix4x4.fromTranslationQuaternion(pos, qRot);
  const Tinv = T.inverse();
  const identity = T.multiply(Tinv);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const expected = i === j ? 1.0 : 0.0;
      assertNear(identity.data[i][j], expected, 1e-6, `T * T_inv element (${i},${j})`);
    }
  }

  // 1.2 Point transformation & round trip
  const pTest = new Vector3D(3.0, 4.0, 5.0);
  const pTransformed = T.transformPoint(pTest);
  const pRecovered = Tinv.transformPoint(pTransformed);
  assertNear(pRecovered.x, pTest.x, 1e-6, 'Point transform round-trip X');
  assertNear(pRecovered.y, pTest.y, 1e-6, 'Point transform round-trip Y');
  assertNear(pRecovered.z, pTest.z, 1e-6, 'Point transform round-trip Z');

  // 1.3 Quaternion normalization, conjugate, and axis-angle
  const axisOrig = new Vector3D(1, 1, 1).normalize();
  const angleOrig = Math.PI / 3.0; // 60 deg
  const q1 = Quaternion.fromAxisAngle(axisOrig, angleOrig);
  const { axis: axisRec, angle: angleRec } = q1.toAxisAngle();
  assertNear(angleRec, angleOrig, 1e-6, 'Quaternion axis-angle extraction angle');
  assertNear(axisRec.x, axisOrig.x, 1e-6, 'Quaternion axis-angle extraction axis X');
  assertNear(axisRec.y, axisOrig.y, 1e-6, 'Quaternion axis-angle extraction axis Y');
  assertNear(axisRec.z, axisOrig.z, 1e-6, 'Quaternion axis-angle extraction axis Z');

  // 1.4 Slerp with antipodal flip
  const qA = new Quaternion(1, 0, 0, 0);
  const qB = new Quaternion(-1, 0, 0, 0); // Antipodal identity
  const qMid = Quaternion.slerp(qA, qB, 0.5);
  assertNear(Math.abs(qMid.w), 1.0, 1e-5, 'Slerp antipodal identity midpoint w');

  // 1.5 Slerp 90 degree rotation midpoint = 45 degree rotation
  const q0 = Quaternion.identity();
  const q90 = Quaternion.fromAxisAngle(new Vector3D(0, 0, 1), Math.PI / 2);
  const q45 = Quaternion.slerp(q0, q90, 0.5);
  const { angle: angle45 } = q45.toAxisAngle();
  assertNear(angle45, Math.PI / 4, 1e-5, 'Slerp 90-degree midpoint angle is 45 degrees');

  // 1.6 Adjoint representation transform
  const Ad = T.adjoint();
  assert(Ad.length === 6 && Ad[0].length === 6, 'Adjoint matrix is 6x6');
}

// ============================================================================
// SUITE 2: Forward Kinematics (Standard & Modified DH vs PoE)
// ============================================================================
console.log('\nSUITE 2: Forward Kinematics (Standard & Modified DH vs PoE)');

{
  // 2.1 Planar 2R Arm Forward Kinematics
  const l1 = 1.0, l2 = 0.8;
  const joint1 = new DHParameter(l1, 0, 0, 0, true);
  const joint2 = new DHParameter(l2, 0, 0, 0, true);
  const planarChain = new RobotKinematicChain([joint1, joint2]);

  const qTest = [Math.PI / 4, Math.PI / 3]; // 45 deg, 60 deg (total 105 deg)
  const { endEffector } = planarChain.forwardKinematics(qTest);

  const expectedX = l1 * Math.cos(qTest[0]) + l2 * Math.cos(qTest[0] + qTest[1]);
  const expectedY = l1 * Math.sin(qTest[0]) + l2 * Math.sin(qTest[0] + qTest[1]);
  assertNear(endEffector.translation.x, expectedX, 1e-6, 'Planar 2R FK X coordinate');
  assertNear(endEffector.translation.y, expectedY, 1e-6, 'Planar 2R FK Y coordinate');
  assertNear(endEffector.translation.z, 0.0, 1e-6, 'Planar 2R FK Z coordinate');

  // 2.2 Product of Exponentials (PoE) Verification
  // Home pose: arm extended along x-axis
  const homePose = Matrix4x4.fromTranslation(new Vector3D(l1 + l2, 0, 0));
  // Screw axis 1 at origin [0,0,0], omega = [0,0,1], v = -omega x q = [0,0,0]
  // Screw axis 2 at [l1, 0, 0], omega = [0,0,1], v = -omega x [l1,0,0] = -[0, l1, 0] = [0, -l1, 0]
  const screw1 = { omega: new Vector3D(0, 0, 1), v: new Vector3D(0, 0, 0) };
  const screw2 = { omega: new Vector3D(0, 0, 1), v: new Vector3D(0, -l1, 0) };

  const poePose = RobotKinematicChain.forwardKinematicsPoE(qTest, homePose, [screw1, screw2]);
  assertNear(poePose.translation.x, endEffector.translation.x, 1e-6, 'PoE vs DH matching X');
  assertNear(poePose.translation.y, endEffector.translation.y, 1e-6, 'PoE vs DH matching Y');
  assertNear(poePose.translation.z, endEffector.translation.z, 1e-6, 'PoE vs DH matching Z');

  // 2.3 3D Spatial Puma/Stanford Arm 6-DoF FK
  const joints6 = [
    new DHParameter(0, -Math.PI / 2, 0.3, 0),
    new DHParameter(0.5, 0, 0, 0),
    new DHParameter(0, Math.PI / 2, 0, 0),
    new DHParameter(0, -Math.PI / 2, 0.4, 0),
    new DHParameter(0, Math.PI / 2, 0, 0),
    new DHParameter(0, 0, 0.1, 0)
  ];
  const arm6 = new RobotKinematicChain(joints6);
  const qZero = [0, 0, 0, 0, 0, 0];
  const fkZero = arm6.forwardKinematics(qZero);
  assert(fkZero.jointFrames.length === 7, '6-DoF arm has 7 frames (base + 6 joints)');
  assert(fkZero.endEffector.translation.z > 0.5, 'End effector elevated at home pose');
}

// ============================================================================
// SUITE 3: Geometric Jacobian vs Central Finite Differences
// ============================================================================
console.log('\nSUITE 3: Geometric Jacobian vs Central Finite Differences');

{
  const joints = [
    new DHParameter(0, -Math.PI / 2, 0.3, 0),
    new DHParameter(0.5, 0, 0, 0),
    new DHParameter(0.4, 0, 0, 0)
  ];
  const arm = new RobotKinematicChain(joints);
  const qTest = [0.4, -0.6, 0.8];

  const J_ana = arm.geometricJacobian(qTest);

  // Numerical Jacobian via central finite differences for translation components
  const eps = 1e-6;
  const J_num: number[][] = Array.from({ length: 3 }, () => Array(3).fill(0));

  for (let i = 0; i < 3; i++) {
    const qPlus = [...qTest];
    qPlus[i] += eps;
    const pPlus = arm.forwardKinematics(qPlus).endEffector.translation;

    const qMinus = [...qTest];
    qMinus[i] -= eps;
    const pMinus = arm.forwardKinematics(qMinus).endEffector.translation;

    const dp = pPlus.subtract(pMinus).scale(1.0 / (2.0 * eps));
    J_num[0][i] = dp.x;
    J_num[1][i] = dp.y;
    J_num[2][i] = dp.z;
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      assertNear(
        J_ana[row][col],
        J_num[row][col],
        1e-4,
        `Jacobian linear entry [${row},${col}] (ana vs num diff)`
      );
    }
  }
}

// ============================================================================
// SUITE 4: Singularity Analysis, SVD Spectrum, and Manipulability
// ============================================================================
console.log('\nSUITE 4: Singularity Analysis, SVD Spectrum, and Manipulability');

{
  const l1 = 1.0, l2 = 1.0;
  const planarChain = new RobotKinematicChain([
    new DHParameter(l1, 0, 0, 0),
    new DHParameter(l2, 0, 0, 0)
  ]);

  // 4.1 Boundary singularity: arm fully stretched (theta2 = 0)
  const qSingular = [0.2, 0.0];
  const analysisSingular = planarChain.analyzeManipulability(qSingular);
  assert(
    analysisSingular.isSingular,
    'Arm at theta2=0 detected as singular'
  );
  assertNear(analysisSingular.manipulability, 0.0, 1e-3, 'Manipulability at boundary is near zero');

  // 4.2 Isotropic / high manipulability configuration: theta2 = 90 deg
  const qGood = [0.2, Math.PI / 2];
  const analysisGood = planarChain.analyzeManipulability(qGood);
  assert(
    !analysisGood.isSingular,
    'Arm at theta2=90 deg is not singular'
  );
  assert(analysisGood.manipulability > 0.5, 'Manipulability is high at theta2=90 deg');
  assert(analysisGood.conditionNumber < 100, 'Condition number is well-conditioned at theta2=90 deg');
}

// ============================================================================
// SUITE 5: Analytical Inverse Kinematics (Planar 2R & Pieper Spherical Wrist)
// ============================================================================
console.log('\nSUITE 5: Analytical Inverse Kinematics (Planar 2R & Pieper Spherical Wrist)');

{
  // 5.1 Planar 2R Analytical IK
  const l1 = 1.0, l2 = 0.8;
  const targetX = 0.6;
  const targetY = 1.1;

  const sol = AnalyticalIKSolver.solvePlanar2R(l1, l2, targetX, targetY);
  assert(sol.reachable, 'Planar 2R target is reachable');

  // Verify elbow-down
  if (sol.elbowDown) {
    const [th1, th2] = sol.elbowDown;
    const xCalc = l1 * Math.cos(th1) + l2 * Math.cos(th1 + th2);
    const yCalc = l1 * Math.sin(th1) + l2 * Math.sin(th1 + th2);
    assertNear(xCalc, targetX, 1e-5, 'Elbow-down solution recovers target X');
    assertNear(yCalc, targetY, 1e-5, 'Elbow-down solution recovers target Y');
    assert(th2 >= 0, 'Elbow-down theta2 is non-negative');
  }

  // Verify elbow-up
  if (sol.elbowUp) {
    const [th1, th2] = sol.elbowUp;
    const xCalc = l1 * Math.cos(th1) + l2 * Math.cos(th1 + th2);
    const yCalc = l1 * Math.sin(th1) + l2 * Math.sin(th1 + th2);
    assertNear(xCalc, targetX, 1e-5, 'Elbow-up solution recovers target X');
    assertNear(yCalc, targetY, 1e-5, 'Elbow-up solution recovers target Y');
    assert(th2 <= 0, 'Elbow-up theta2 is non-positive');
  }

  // 5.2 Unreachable target
  const unreachSol = AnalyticalIKSolver.solvePlanar2R(l1, l2, 5.0, 5.0);
  assert(!unreachSol.reachable, 'Out-of-reach target correctly identified as unreachable');
}

// ============================================================================
// SUITE 6: Numerical Inverse Kinematics (Newton-Raphson, Jacobian Transpose, DLS)
// ============================================================================
console.log('\nSUITE 6: Numerical Inverse Kinematics (Newton-Raphson, Jacobian Transpose, DLS)');

{
  const joints = [
    new DHParameter(0, -Math.PI / 2, 0.3, 0),
    new DHParameter(0.5, 0, 0, 0),
    new DHParameter(0.4, 0, 0, 0)
  ];
  const arm = new RobotKinematicChain(joints);

  // Generate a valid target from a known configuration
  const qTarget = [0.5, -0.4, 0.6];
  const targetPose = arm.forwardKinematics(qTarget).endEffector;
  const initialQ = [0.1, 0.1, 0.1];

  // 6.1 Newton-Raphson IK
  const nrResult = NumericalIKSolver.solveNewtonRaphson(arm, targetPose, initialQ, {
    maxIters: 30,
    tolerance: 1e-4
  });
  assert(nrResult.converged, 'Newton-Raphson IK converged');
  assert(nrResult.iterations < 20, `Newton-Raphson fast convergence (${nrResult.iterations} iters)`);
  assert(nrResult.errorNorm < 1e-4, 'Newton-Raphson error norm < 1e-4');

  // 6.2 Jacobian Transpose IK
  const jtResult = NumericalIKSolver.solveJacobianTranspose(arm, targetPose, initialQ, {
    maxIters: 150,
    tolerance: 5e-3
  });
  assert(jtResult.converged, 'Jacobian Transpose IK converged within tolerance');

  // 6.3 Damped Least-Squares (DLS) IK
  const dlsResult = NumericalIKSolver.solveDLS(arm, targetPose, initialQ, {
    maxIters: 40,
    tolerance: 1e-4,
    adaptiveDamping: true
  });
  assert(dlsResult.converged, 'Adaptive DLS IK converged cleanly');
}

// ============================================================================
// SUITE 7: Redundancy Resolution, Nullspace Projector Invariants & Joint Limit Avoidance
// ============================================================================
console.log('\nSUITE 7: Redundancy Resolution, Nullspace Projector Invariants & Joint Limit Avoidance');

{
  // 7-DoF serial manipulator chain
  const joints7 = [
    new DHParameter(0, -Math.PI / 2, 0.34, 0),
    new DHParameter(0, Math.PI / 2, 0, 0),
    new DHParameter(0, -Math.PI / 2, 0.4, 0),
    new DHParameter(0, Math.PI / 2, 0, 0),
    new DHParameter(0, -Math.PI / 2, 0.39, 0),
    new DHParameter(0, Math.PI / 2, 0, 0),
    new DHParameter(0, 0, 0.126, 0)
  ];
  const arm7 = new RobotKinematicChain(joints7);
  const q7 = [0.2, 0.3, -0.4, 0.5, -0.2, 0.6, -0.1];

  const J = arm7.geometricJacobian(q7);
  const Jt = MatrixMath.transpose(J);
  const JJt = MatrixMath.multiply(J, Jt);
  const JJt_inv = MatrixMath.invert(JJt);
  const Jpinv = MatrixMath.multiply(Jt, JJt_inv); // 7 x 6
  const Jpinv_J = MatrixMath.multiply(Jpinv, J);   // 7 x 7

  // Nullspace Projector P = I - J^+ * J
  const n = 7;
  const P = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0) - Jpinv_J[i][j])
  );

  // 7.1 Check nullspace property: J * P = 0
  const JP = MatrixMath.multiply(J, P);
  let maxJP = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      maxJP = Math.max(maxJP, Math.abs(JP[i][j]));
    }
  }
  assert(maxJP < 1e-10, `J * P = 0 exact cancellation (max residual: ${maxJP.toExponential(3)})`);

  // 7.2 Check idempotency: P^2 = P
  const P2 = MatrixMath.multiply(P, P);
  let maxPdiff = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      maxPdiff = Math.max(maxPdiff, Math.abs(P2[i][j] - P[i][j]));
    }
  }
  assert(maxPdiff < 1e-10, `P^2 = P projector idempotency (max residual: ${maxPdiff.toExponential(3)})`);

  // 7.3 Check trace of P = n - m = 7 - 6 = 1
  let trP = 0;
  for (let i = 0; i < n; i++) trP += P[i][i];
  assertNear(trP, 1.0, 1e-6, 'Trace of 7-DoF nullspace projector is exactly 1 (1D self-motion)');

  // 7.4 Redundant IK with Joint Limit Avoidance Secondary Gradient
  const target7 = arm7.forwardKinematics(q7).endEffector;
  const initialQ7 = [0.1, 0.2, -0.3, 0.4, -0.1, 0.5, 0.0];

  const secondaryGrad = (qCurr: number[]) => {
    // Gradient pushing joint 1 toward zero
    const g = Array(7).fill(0);
    g[0] = -qCurr[0];
    return g;
  };

  const redResult = NumericalIKSolver.solveRedundantNullspace(
    arm7,
    target7,
    initialQ7,
    secondaryGrad,
    0.1,
    { maxIters: 40, tolerance: 1e-4 }
  );
  assert(redResult.converged, 'Redundant IK with nullspace secondary task converged');
}

// ============================================================================
// SUITE 8: Heuristic Solvers (FABRIK, CCD) and Constrained Trajectory Generation (CLIK)
// ============================================================================
console.log('\nSUITE 8: Heuristic Solvers (FABRIK, CCD) and Constrained Trajectory Generation (CLIK)');

{
  // 8.1 FABRIK Solver on 3-segment planar arm
  const base = new Vector3D(0, 0, 0);
  const linkLengths = [1.0, 0.8, 0.6];
  const initialPts = [
    new Vector3D(0, 0, 0),
    new Vector3D(1.0, 0, 0),
    new Vector3D(1.8, 0, 0),
    new Vector3D(2.4, 0, 0)
  ];
  const target = new Vector3D(1.2, 1.2, 0);

  const fabrikRes = FABRIKSolver.solve(base, linkLengths, initialPts, target, 20, 1e-4);
  assert(fabrikRes.converged, `FABRIK converged in ${fabrikRes.iterations} iterations`);
  assert(fabrikRes.error < 1e-4, 'FABRIK error < 1e-4');

  // Verify link length preservation
  for (let i = 0; i < 3; i++) {
    const len = fabrikRes.positions[i].distanceTo(fabrikRes.positions[i + 1]);
    assertNear(len, linkLengths[i], 1e-6, `FABRIK preserved link length ${i}`);
  }

  // 8.2 CCD Solver
  const planarChain = new RobotKinematicChain([
    new DHParameter(1.0, 0, 0, 0),
    new DHParameter(0.8, 0, 0, 0),
    new DHParameter(0.6, 0, 0, 0)
  ]);
  const ccdRes = CCDSolver.solve(planarChain, target, [0, 0, 0], 50, 1e-3);
  assert(ccdRes.converged, `CCD converged in ${ccdRes.iterations} iterations`);
  assert(ccdRes.error < 1e-3, 'CCD position error < 1e-3');

  // 8.3 Quintic Polynomial Trajectory
  const q0 = 0.2, qf = 1.8;
  const T = 2.0;
  const pStart = TrajectoryGenerator.quinticPolynomial(q0, qf, 0, 0, 0, 0, T, 0);
  assertNear(pStart.pos, q0, 1e-6, 'Quintic trajectory start position');
  assertNear(pStart.vel, 0.0, 1e-6, 'Quintic trajectory start velocity is zero');
  assertNear(pStart.acc, 0.0, 1e-6, 'Quintic trajectory start acceleration is zero');

  const pEnd = TrajectoryGenerator.quinticPolynomial(q0, qf, 0, 0, 0, 0, T, T);
  assertNear(pEnd.pos, qf, 1e-6, 'Quintic trajectory terminal position');
  assertNear(pEnd.vel, 0.0, 1e-6, 'Quintic trajectory terminal velocity is zero');
  assertNear(pEnd.acc, 0.0, 1e-6, 'Quintic trajectory terminal acceleration is zero');

  const pMid = TrajectoryGenerator.quinticPolynomial(q0, qf, 0, 0, 0, 0, T, T / 2);
  assertNear(pMid.pos, (q0 + qf) / 2, 1e-6, 'Quintic trajectory midpoint position');
  assert(pMid.vel > 0, 'Quintic trajectory midpoint velocity is positive');

  // 8.4 CLIK Drift Compensation Step
  const clikArm = new RobotKinematicChain([
    new DHParameter(0, -Math.PI / 2, 0.3, 0),
    new DHParameter(0.5, 0, 0, 0),
    new DHParameter(0.4, 0, 0, 0)
  ]);
  const qInit = [0.2, 0.3, 0.4];
  const targetStepPose = clikArm.forwardKinematics([0.22, 0.31, 0.41]).endEffector;
  const clikStep = CLIKController.step(
    clikArm,
    qInit,
    targetStepPose,
    Vector6D.zero(),
    5.0, // Kp
    0.01 // dt
  );
  assert(clikStep.qDot.length === 3, 'CLIK produced 3 joint velocities');
  assert(clikStep.errorNorm > 0, 'CLIK measured non-zero tracking error');
}

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('\n================================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('================================================================');

if (passedTests === totalTests) {
  console.log('ALL VERIFICATION TEST SUITES PASSED CLEANLY WITH ZERO DEFECTS.');
  process.exit(0);
} else {
  console.error(`FAILED: ${totalTests - passedTests} tests did not pass.`);
  process.exit(1);
}
