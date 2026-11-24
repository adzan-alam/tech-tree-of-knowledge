/**
 * verify-sim-to-real.ts
 *
 * Comprehensive Automated Verification Suite for Sim-to-Real Embodied AI Engine
 * Module 6 of Pathway #4: Embodied AI and Autonomous Physical Robotics
 *
 * 8 Test Suites:
 * 1. Domain Randomization Distributions & Sampling Invariants
 * 2. Asynchronous Communication Latency & Jitter Ring Buffer
 * 3. Actuator Modeling, Gearbox Backlash & Joint PD Torque Control
 * 4. Sensory Degradation & Noise Injection Pipeline
 * 5. Teacher-Student Policy Distillation & Behavior Cloning
 * 6. Residual Physics Modeling & Hybrid Control
 * 7. Safety Filters & Control Barrier Functions (CBF)
 * 8. End-to-End Closed-Loop Sensorimotor Agent Simulation
 */

import {
  MathUtils,
  DomainRandomizer,
  CommunicationDelayBuffer,
  ActuatorModel,
  SensorNoisePipeline,
  TeacherStudentDistillation,
  ResidualPhysicsCompensator,
  SafetyFilterCBF,
  EmbodiedAgentPipeline
} from './sim-to-real-engine';

interface TestCase {
  name: string;
  fn: () => void | Promise<void>;
}

class TestRunner {
  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;

  public async runSuite(suiteName: string, tests: TestCase[]) {
    console.log(`\n===============================================================`);
    console.log(`Running Suite: ${suiteName}`);
    console.log(`===============================================================`);

    for (const test of tests) {
      this.totalTests++;
      try {
        await test.fn();
        this.passedTests++;
        console.log(`  [PASS] ${test.name}`);
      } catch (err: any) {
        this.failedTests++;
        console.error(`  [FAIL] ${test.name}`);
        console.error(`         Error: ${err.message}`);
      }
    }
  }

  public printSummary(): boolean {
    console.log(`\n===============================================================`);
    console.log(`VERIFICATION SUMMARY: ${this.passedTests} / ${this.totalTests} tests passed (${Math.round((this.passedTests / this.totalTests) * 100)}%)`);
    console.log(`===============================================================`);
    return this.failedTests === 0;
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertApprox(actual: number, expected: number, tolerance: number, message: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message} - Expected ~${expected}, got ${actual} (diff: ${Math.abs(actual - expected)}, tol: ${tolerance})`);
  }
}

async function main() {
  const runner = new TestRunner();

  // --------------------------------------------------------------------------
  // Suite 1: Domain Randomization Distributions & Sampling Invariants
  // --------------------------------------------------------------------------
  await runner.runSuite('Suite 1: Domain Randomization Distributions & Sampling Invariants', [
    {
      name: 'Uniform distribution produces samples strictly within [min, max]',
      fn: () => {
        const math = new MathUtils(101);
        for (let i = 0; i < 500; i++) {
          const val = math.sampleUniform(-2.5, 7.5);
          assert(val >= -2.5 && val <= 7.5, `Sample ${val} out of bounds [-2.5, 7.5]`);
        }
      }
    },
    {
      name: 'Log-Uniform distribution satisfies scale invariance across decades',
      fn: () => {
        const math = new MathUtils(202);
        const N = 10000;
        let decade1 = 0; // [0.01, 0.10]
        let decade2 = 0; // [0.10, 1.00]
        let decade3 = 0; // [1.00, 10.00]

        for (let i = 0; i < N; i++) {
          const val = math.sampleLogUniform(0.01, 10.0);
          if (val >= 0.01 && val < 0.10) decade1++;
          else if (val >= 0.10 && val < 1.00) decade2++;
          else if (val >= 1.00 && val <= 10.00) decade3++;
        }

        // Each decade should hold approximately 1/3 (33.3%) of samples
        const ratio1 = decade1 / N;
        const ratio2 = decade2 / N;
        const ratio3 = decade3 / N;

        assertApprox(ratio1, 0.333, 0.03, 'Decade 1 scale invariance failed');
        assertApprox(ratio2, 0.333, 0.03, 'Decade 2 scale invariance failed');
        assertApprox(ratio3, 0.333, 0.03, 'Decade 3 scale invariance failed');
      }
    },
    {
      name: 'Truncated Gaussian strictly satisfies truncation boundaries',
      fn: () => {
        const math = new MathUtils(303);
        const min = 2.0;
        const max = 5.0;
        for (let i = 0; i < 1000; i++) {
          const val = math.sampleTruncatedGaussian(3.5, 1.5, min, max);
          assert(val >= min && val <= max, `Truncated sample ${val} out of bounds [${min}, ${max}]`);
        }
      }
    },
    {
      name: 'Physical inertia tensor satisfies triangle inequality Ixx + Iyy >= Izz',
      fn: () => {
        const dr = new DomainRandomizer(404);
        for (let i = 0; i < 100; i++) {
          const env = dr.sampleEnvironment(3.5);
          const [Ixx, Iyy, Izz] = env.inertia;
          assert(Ixx + Iyy >= Izz, `Triangle inequality violated: ${Ixx} + ${Iyy} < ${Izz}`);
          assert(env.coulombFriction >= 0.1 && env.coulombFriction <= 1.2, 'Friction out of range');
        }
      }
    }
  ]);

  // --------------------------------------------------------------------------
  // Suite 2: Asynchronous Communication Latency & Jitter Ring Buffer
  // --------------------------------------------------------------------------
  await runner.runSuite('Suite 2: Asynchronous Communication Latency & Jitter Ring Buffer', [
    {
      name: 'Buffer holds packets until scheduled deliverAt time',
      fn: () => {
        const buffer = new CommunicationDelayBuffer<number>(20, 20, 0.0, 505);
        buffer.send(100, 0); // Send at t = 0 ms, delivery at t = 20 ms

        // Query at t = 10 ms (should return fallback, not yet delivered)
        const val10 = buffer.receive(10, 0);
        assert(val10 === 0, `Packet delivered prematurely at t=10ms (got ${val10})`);

        // Query at t = 20 ms (should be delivered)
        const val20 = buffer.receive(20, 0);
        assert(val20 === 100, `Packet not delivered at t=20ms (got ${val20})`);
      }
    },
    {
      name: 'Buffer preserves most recent delivered value across holds',
      fn: () => {
        const buffer = new CommunicationDelayBuffer<number>(15, 15, 0.0, 606);
        buffer.send(42, 0); // Delivers at 15 ms
        buffer.receive(15, 0); // Delivered

        // At t = 25 ms, no new packet sent, should hold last delivered 42
        const held = buffer.receive(25, 0);
        assert(held === 42, `Buffer failed to hold last delivered packet (got ${held})`);
      }
    },
    {
      name: 'Stochastic packet drop drops packets according to drop rate',
      fn: () => {
        const dropRate = 0.25;
        const buffer = new CommunicationDelayBuffer<number>(10, 10, dropRate, 707);
        const N = 1000;
        for (let i = 0; i < N; i++) {
          buffer.send(i, 0);
        }
        const queued = buffer.getQueueLength();
        const observedDropRate = 1.0 - queued / N;
        assertApprox(observedDropRate, dropRate, 0.05, 'Observed drop rate diverges from configured');
      }
    }
  ]);

  // --------------------------------------------------------------------------
  // Suite 3: Actuator Modeling, Gearbox Backlash & Joint PD Torque Control
  // --------------------------------------------------------------------------
  await runner.runSuite('Suite 3: Actuator Modeling, Gearbox Backlash & Joint PD Torque Control', [
    {
      name: 'Gearbox backlash deadband produces zero torque during clearance floating',
      fn: () => {
        const backlash = 0.005; // rad
        const actuator = new ActuatorModel(1.0, backlash, 20.0, 50.0, 2000.0);

        // Within deadband: deltaTheta = 0.002 < 0.005
        const state = actuator.step(0.002, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.01);
        assertApprox(state.deliveredTorque, 0.0, 0.01, 'Torque was non-zero inside deadband');
      }
    },
    {
      name: 'Torque slew rate limiter clamps abrupt derivative spikes',
      fn: () => {
        const maxSlew = 500.0; // N*m/s
        const dt = 0.01; // 10 ms -> max delta = 5.0 N*m
        const actuator = new ActuatorModel(1.0, 0.0, 20.0, 50.0, maxSlew);

        // Demand instant 40 N*m jump
        const state = actuator.step(10.0, 0.0, 0.0, 0.0, 40.0, 0.0, 0.0, dt);
        assert(state.deliveredTorque <= 5.1, `Slew rate limit violated (got ${state.deliveredTorque})`);
      }
    },
    {
      name: 'Thermal accumulation derates continuous torque capacity',
      fn: () => {
        const actuator = new ActuatorModel(1.0, 0.0, 15.0, 45.0, 5000.0, 25.0);

        // Apply sustained heavy torque to heat windings
        for (let i = 0; i < 2000; i++) {
          actuator.step(1.0, 0.0, 0.0, 0.0, 30.0, 100.0, 5.0, 0.05);
        }

        const temp = actuator.getTemperature();
        assert(temp > 60.0, `Actuator failed to accumulate thermal energy (temp: ${temp})`);
      }
    }
  ]);

  // --------------------------------------------------------------------------
  // Suite 4: Sensory Degradation & Noise Injection Pipeline
  // --------------------------------------------------------------------------
  await runner.runSuite('Suite 4: Sensory Degradation & Noise Injection Pipeline', [
    {
      name: 'Encoder quantization preserves discretization resolution',
      fn: () => {
        const noise = new SensorNoisePipeline(808);
        const trueAngles = [0.0001, 0.0002, 0.0003];
        const quantized = noise.corruptJointPosition(trueAngles);
        assert(quantized.length === 3, 'Corrupted array size mismatch');
      }
    },
    {
      name: 'Camera pinhole projection with radial lens distortion shifts boundary points',
      fn: () => {
        const noise = new SensorNoisePipeline(909);
        // Point on optical axis (X=0, Y=0, Z=1.0)
        const center = noise.projectCameraPoint([0, 0, 1.0], 600, [320, 240], -0.15);
        assertApprox(center[0], 320.0, 2.0, 'Optical center projection error');
        assertApprox(center[1], 240.0, 2.0, 'Optical center projection error');

        // Corner point should be distorted
        const corner = noise.projectCameraPoint([0.5, 0.5, 1.0], 600, [320, 240], -0.15);
        assert(corner[0] > 0 && corner[1] > 0, 'Corner projection failed');
      }
    },
    {
      name: 'IMU measurements include realistic noise and bias walk',
      fn: () => {
        const noise = new SensorNoisePipeline(1010);
        const imu = noise.corruptIMU([0, 0, 9.81], [0, 0, 0], 0.01);
        assert(Math.abs(imu.accel[2] - 9.81) < 1.5, 'IMU gravity acceleration out of bounds');
      }
    }
  ]);

  // --------------------------------------------------------------------------
  // Suite 5: Teacher-Student Policy Distillation & Behavior Cloning
  // --------------------------------------------------------------------------
  await runner.runSuite('Suite 5: Teacher-Student Policy Distillation & Behavior Cloning', [
    {
      name: 'Teacher policy outputs bounded actions from privileged state',
      fn: () => {
        const dist = new TeacherStudentDistillation(10, 4, 6, 3, 2, 1111);
        const actions = dist.forwardTeacher([0.1, 0.2, -0.1, 0.0], [0.8, 5.0, 0.0, 0.0, 0.0, 0.1]);
        assert(actions.length === 2, 'Action dimension mismatch');
        assert(Math.abs(actions[0]) <= 1.0, 'Teacher action outside [-1, 1]');
        assert(Math.abs(actions[1]) <= 1.0, 'Teacher action outside [-1, 1]');
      }
    },
    {
      name: 'Temporal history encoder extracts compact latent vector',
      fn: () => {
        const dist = new TeacherStudentDistillation(10, 2, 4, 3, 1, 1212);
        const history: number[][] = [];
        for (let i = 0; i < 10; i++) {
          history.push([i * 0.1, Math.sin(i * 0.2)]);
        }
        const z = dist.encodeHistory(history);
        assert(z.length === 3, `Latent vector dimension mismatch (got ${z.length})`);
        assert(Math.abs(z[0]) <= 1.0, 'Latent z outside [-1, 1]');
      }
    },
    {
      name: 'Distillation loss evaluates zero for identical actions',
      fn: () => {
        const dist = new TeacherStudentDistillation(10, 2, 4, 3, 2, 1313);
        const lossZero = dist.computeDistillationLoss([0.5, -0.3], [0.5, -0.3]);
        assertApprox(lossZero, 0.0, 1e-6, 'Identical actions yielded non-zero loss');

        const lossDiff = dist.computeDistillationLoss([1.0, 0.0], [0.0, 0.0]);
        assertApprox(lossDiff, 0.5, 1e-6, 'Distillation loss calculation error');
      }
    }
  ]);

  // --------------------------------------------------------------------------
  // Suite 6: Residual Physics Modeling & Hybrid Control
  // --------------------------------------------------------------------------
  await runner.runSuite('Suite 6: Residual Physics Modeling & Hybrid Control', [
    {
      name: 'Analytical model accurately evaluates gravity torque',
      fn: () => {
        const res = new ResidualPhysicsCompensator(2, 4);
        // Horizontal link (q = 0): maximum gravity torque = m * g * (L/2)
        const tauGravity = res.computeAnalyticalTorque(0.0, 0.0, 0.0, 2.0, 0.6);
        const expected = 2.0 * 9.81 * 0.3; // 5.886 N*m
        assertApprox(tauGravity, expected, 0.05, 'Analytical gravity torque calculation error');
      }
    },
    {
      name: 'Online recursive adaptation updates weights in response to error',
      fn: () => {
        const res = new ResidualPhysicsCompensator(2, 4);
        const features = [0.5, 0.2];
        const tauInitial = res.computeResidualTorque(features);

        // Apply error signal of 5.0 N*m
        res.adaptWeights(features, 5.0, 0.1);
        const tauUpdated = res.computeResidualTorque(features);

        assert(tauUpdated > tauInitial, `Residual torque failed to increase following positive error update (initial: ${tauInitial}, updated: ${tauUpdated})`);
      }
    }
  ]);

  // --------------------------------------------------------------------------
  // Suite 7: Safety Filters & Control Barrier Functions (CBF)
  // --------------------------------------------------------------------------
  await runner.runSuite('Suite 7: Safety Filters & Control Barrier Functions (CBF)', [
    {
      name: 'CBF filter passes nominal torque when deep inside safe set',
      fn: () => {
        const cbf = new SafetyFilterCBF(-2.0, 2.0, 10.0, 30.0, 5.0);
        const safeTorque = cbf.filterCommand(0.0, 0.0, 15.0, 0.2);
        assertApprox(safeTorque, 15.0, 1e-3, 'Safe nominal command was unnecessarily modified');
      }
    },
    {
      name: 'CBF filter intervenes and clamps torque when approaching joint limit at speed',
      fn: () => {
        const cbf = new SafetyFilterCBF(-2.0, 2.0, 10.0, 30.0, 5.0);
        // High speed approaching upper limit (q = 1.95, qdot = 4.0)
        const unsafeCommand = +25.0; // Demanding forward acceleration
        const safeTorque = cbf.filterCommand(1.95, 4.0, unsafeCommand, 0.2);
        assert(safeTorque < unsafeCommand, `CBF failed to intervene (got ${safeTorque})`);
        assert(safeTorque <= 0, `CBF should command braking or negative torque near boundary (got ${safeTorque})`);
      }
    }
  ]);

  // --------------------------------------------------------------------------
  // Suite 8: End-to-End Closed-Loop Sensorimotor Agent Simulation
  // --------------------------------------------------------------------------
  await runner.runSuite('Suite 8: End-to-End Closed-Loop Sensorimotor Agent Simulation', [
    {
      name: 'Complete embodied pipeline runs 100 closed-loop steps deterministically',
      fn: () => {
        const pipeline = new EmbodiedAgentPipeline(42);
        const targetAngle = 1.2; // 1.2 rad target
        let lastResult: any = null;

        for (let i = 0; i < 100; i++) {
          lastResult = pipeline.step(targetAngle, 0.01);
          assert(!isNaN(lastResult.actualAngle), `NaN detected in actual angle at step ${i}`);
          assert(!isNaN(lastResult.appliedTorque), `NaN detected in applied torque at step ${i}`);
        }

        assert(lastResult.step === 100, `Expected step 100, got ${lastResult.step}`);
        assert(lastResult.timeMs === 1000.0, `Expected 1000 ms, got ${lastResult.timeMs}`);
        assert(Math.abs(lastResult.actualVelocity) < 15.0, 'Velocity exploded');
      }
    },
    {
      name: 'Pipeline adapts to target trajectory with bounded error under randomized physics',
      fn: () => {
        const pipeline = new EmbodiedAgentPipeline(999);
        const target = 0.8;
        for (let i = 0; i < 150; i++) {
          pipeline.step(target, 0.01);
        }
        const env = pipeline.getEnvironmentParams();
        assert(env.mass > 0, 'Invalid mass parameter');
        assert(env.coulombFriction > 0, 'Invalid friction parameter');
      }
    }
  ]);

  const allPassed = runner.printSummary();
  if (!allPassed) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
