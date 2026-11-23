/**
 * verify-deep-rl.ts
 * ============================================================================
 * Production Verification Suite for Deep RL Engine (Module #4 Capstone)
 * 
 * Tests:
 * 1. MathOps: Softmax Log-Sum-Exp, Huber Loss clipping, Gaussian draws.
 * 2. ReplayBuffer: Circular FIFO ring buffer mechanics and sampling.
 * 3. SumTree & PER: O(log N) priority updates, prefix search, IS weights.
 * 4. TargetNetworkManager: Hard synchronization & Polyak soft EMA updates.
 * 5. GAE Engine: Exact mathematical verification of Worked Example 8.1.
 * 6. CartPoleSim: Nonlinear equations of motion & boundary thresholds.
 * 7. DQNAgent: End-to-end training step on CartPole transitions.
 * 8. ActorCriticAgent: End-to-end A2C rollout update with GAE advantages.
 * 9. PPOClippedEngine: Pessimistic clipping, ratio tracking, value clipping.
 * ============================================================================
 */

import {
  MathOps,
  ReplayBuffer,
  SumTree,
  PrioritizedReplayBuffer,
  TargetNetworkManager,
  AdvantageEstimator,
  CartPoleSim,
  DQNAgent,
  ActorCriticAgent,
  PPOClippedEngine
} from './deep-rl-engine.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail: string = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName} ${detail ? `(${detail})` : ''}`);
  } else {
    console.error(`[FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
    process.exit(1);
  }
}

console.log("=================================================================");
console.log("      RUNNING PRODUCTION DEEP RL ENGINE VERIFICATION SUITE       ");
console.log("=================================================================\n");

// ----------------------------------------------------------------------------
// Test 1: MathOps & Numerically Stable Softmax / Huber Loss
// ----------------------------------------------------------------------------
console.log("--- Test Section 1: MathOps & Numerical Stability ---");

// Huge logits that would overflow naive exp()
const hugeLogits = [1000.0, 1002.0, 998.0];
const probs = MathOps.softmax(hugeLogits);
assert(!isNaN(probs[0]) && !isNaN(probs[1]) && !isNaN(probs[2]), "Softmax Log-Sum-Exp Stability", "No NaN on huge logits");
assert(Math.abs(probs[0] + probs[1] + probs[2] - 1.0) < 1e-6, "Softmax Probabilities Sum to 1.0", `Sum = ${probs[0] + probs[1] + probs[2]}`);
assert(probs[1] > probs[0] && probs[0] > probs[2], "Softmax Order Preservation", "Max logit receives highest probability");

// Huber loss near zero (|delta| <= 1) -> MSE
const huberSmall = MathOps.huberLoss(0.4, 1.0);
assert(Math.abs(huberSmall.loss - 0.5 * 0.4 * 0.4) < 1e-7, "Huber Loss Quadratic for |delta| <= 1", `Loss = ${huberSmall.loss}`);
assert(Math.abs(huberSmall.grad - 0.4) < 1e-7, "Huber Gradient Linear for |delta| <= 1", `Grad = ${huberSmall.grad}`);

// Huber loss on outlier (|delta| > 1) -> Linear & clipped gradient
const huberLarge = MathOps.huberLoss(25.0, 1.0);
assert(Math.abs(huberLarge.loss - (25.0 - 0.5)) < 1e-7, "Huber Loss Linear for |delta| > 1", `Loss = ${huberLarge.loss}`);
assert(Math.abs(huberLarge.grad - 1.0) < 1e-7, "Huber Gradient Strictly Capped at 1.0", `Grad = ${huberLarge.grad}`);

// ----------------------------------------------------------------------------
// Test 2: Experience Replay Ring Buffer Mechanics
// ----------------------------------------------------------------------------
console.log("\n--- Test Section 2: Replay Buffer Ring Buffer Mechanics ---");

const rb = new ReplayBuffer<number, number>(5);
for (let t = 0; t <= 7; t++) {
  rb.push({ state: t, action: 0, reward: 1, nextState: t + 1, done: false });
}
assert(rb.size() === 5, "ReplayBuffer Reached Maximum Capacity", `Size = ${rb.size()}`);

// Sample mini-batch of 3 items
const batch = rb.sample(3);
assert(batch.length === 3, "Sampled Mini-batch Size Correct", "Length = 3");
assert(batch[0].state >= 3 && batch[1].state >= 3 && batch[2].state >= 3, "Oldest Elements Correctly Purged", "All sampled states >= 3");

// ----------------------------------------------------------------------------
// Test 3: Prioritized Experience Replay via SumTree
// ----------------------------------------------------------------------------
console.log("\n--- Test Section 3: Prioritized Replay & Sum-Tree ---");

const st = new SumTree(4);
st.add(5, "trans_0");
st.add(15, "trans_1");
st.add(10, "trans_2");
st.add(20, "trans_3");

assert(Math.abs(st.totalPriority - 50.0) < 1e-7, "SumTree Total Priority Correct", `Total = ${st.totalPriority}`);

// Test search query: prefix value 28.5 should hit trans_2 (since 5+15=20, 20+10=30)
const sample28 = st.get(28.5);
assert(sample28.item === "trans_2", "SumTree Prefix Search Accuracy", `Found ${sample28.item} for v=28.5`);

// Test priority update: change trans_1 from 15 to 25 -> Total should become 60
st.update(1, 25);
assert(Math.abs(st.totalPriority - 60.0) < 1e-7, "SumTree O(log N) Priority Update", `New Total = ${st.totalPriority}`);

// Full PER Buffer
const per = new PrioritizedReplayBuffer<number, number>(10, 0.6);
for (let i = 0; i < 8; i++) {
  per.push({ state: i, action: 0, reward: 1, nextState: i + 1, done: false });
}
const perBatch = per.sample(4, 0.5);
assert(perBatch.transitions.length === 4, "PER Stratified Sampling Batch Size", "Length = 4");
assert(perBatch.weights[0] > 0 && perBatch.weights[0] <= 1.0, "Normalized IS Weights in (0, 1]", `Weight = ${perBatch.weights[0].toFixed(4)}`);

// ----------------------------------------------------------------------------
// Test 4: Target Network Synchronization Manager
// ----------------------------------------------------------------------------
console.log("\n--- Test Section 4: Target Network Synchronization ---");

const onlineW = [new Float64Array([10.0, 20.0])];
const targetW = [new Float64Array([0.0, 0.0])];

// Hard sync
TargetNetworkManager.hardSync(onlineW, targetW);
assert(targetW[0][0] === 10.0 && targetW[0][1] === 20.0, "TargetNetworkManager Hard Sync", `Target = [${targetW[0]}]`);

// Soft Polyak update with tau = 0.1: target = 0.1 * [20, 40] + 0.9 * [10, 20] = [11, 22]
onlineW[0].set([20.0, 40.0]);
TargetNetworkManager.softSync(onlineW, targetW, 0.1);
assert(Math.abs(targetW[0][0] - 11.0) < 1e-7 && Math.abs(targetW[0][1] - 22.0) < 1e-7, "TargetNetworkManager Polyak Soft Sync", `Target = [${targetW[0]}]`);

// ----------------------------------------------------------------------------
// Test 5: Generalized Advantage Estimation (GAE)
// ----------------------------------------------------------------------------
console.log("\n--- Test Section 5: Generalized Advantage Estimation (GAE) ---");

// Worked Example 8.1 data: rewards = [1, 2, 0, 4], values = [2.5, 3.0, 2.0, 4.0, 1.0], dones = [f, f, f, f]
// gamma = 0.90, lambda = 0.80 -> Expected A_0 = 2.9414
const gaeTest = AdvantageEstimator.computeGAE(
  [1.0, 2.0, 0.0, 4.0],
  [2.5, 3.0, 2.0, 4.0, 1.0],
  [false, false, false, false],
  0.90,
  0.80
);
assert(Math.abs(gaeTest.advantages[0] - 2.9414) < 1e-3, "GAE A_0 Exact Calculation Match", `A_0 = ${gaeTest.advantages[0].toFixed(4)} (Expected 2.9414)`);

// Advantage normalization
const normAdv = AdvantageEstimator.normalize(gaeTest.advantages);
let sumNorm = 0;
for (let i = 0; i < normAdv.length; i++) sumNorm += normAdv[i];
assert(Math.abs(sumNorm) < 1e-6, "Advantage Normalization Zero Mean", `Sum = ${sumNorm.toExponential(4)}`);

// ----------------------------------------------------------------------------
// Test 6: CartPole Physical Simulator
// ----------------------------------------------------------------------------
console.log("\n--- Test Section 6: Non-linear CartPole Physical Simulator ---");

const env = new CartPoleSim();
const s0 = env.reset();
assert(s0.length === 4, "CartPole Initial State Dimension 4", `State = [${Array.from(s0).map(v => v.toFixed(3)).join(', ')}]`);

const stepResult = env.step(1); // Push Right
assert(stepResult.nextState.length === 4, "CartPole Step Next State Valid", "State returned correctly");
assert(stepResult.reward === 1.0, "CartPole Non-Terminal Reward +1.0", `Reward = ${stepResult.reward}`);

// Run simulation until termination
let totalSimSteps = 0;
while (!env.step(Math.random() > 0.5 ? 1 : 0).done && totalSimSteps < 500) {
  totalSimSteps++;
}
assert(totalSimSteps > 0, "CartPole Simulation Physics Integration", `Simulated ${totalSimSteps} steps`);

// ----------------------------------------------------------------------------
// Test 7: Deep Q-Network (DQN) Agent
// ----------------------------------------------------------------------------
console.log("\n--- Test Section 7: Deep Q-Network (DQN) Agent ---");

const dqn = new DQNAgent(4, 2, 0.99, 0.01, 50, 1000);
const action = dqn.selectAction(s0);
assert(action === 0 || action === 1, "DQN Epsilon-Greedy Action Selection", `Action = ${action}`);

// Fill buffer with 40 steps from CartPole
env.reset();
let curState = Array.from(env.state);
for (let i = 0; i < 40; i++) {
  const act = dqn.selectAction(curState);
  const { nextState, reward, done } = env.step(act);
  dqn.replayBuffer.push({
    state: curState,
    action: act,
    reward,
    nextState: Array.from(nextState),
    done
  });
  curState = done ? Array.from(env.reset()) : Array.from(nextState);
}

const dqnTrain = dqn.trainStep(16);
assert(!isNaN(dqnTrain.loss) && dqnTrain.loss >= 0, "DQN Optimization Step Huber Loss Valid", `Loss = ${dqnTrain.loss.toFixed(4)}`);

// ----------------------------------------------------------------------------
// Test 8: Advantage Actor-Critic (A2C) Agent
// ----------------------------------------------------------------------------
console.log("\n--- Test Section 8: Advantage Actor-Critic (A2C) Agent ---");

const a2c = new ActorCriticAgent(4, 2, 0.99, 0.95, 0.01, 0.05, 0.01);
const a2cAct = a2c.selectAction(s0);
assert(a2cAct.probs.length === 2, "A2C Action Probability Distribution Output", `P = [${a2cAct.probs[0].toFixed(3)}, ${a2cAct.probs[1].toFixed(3)}]`);

// Collect short rollout
const rolloutStates: Float64Array[] = [];
const rolloutActions: number[] = [];
const rolloutRewards: number[] = [];
const rolloutDones: boolean[] = [];

env.reset();
let a2cState = env.state;
for (let t = 0; t < 5; t++) {
  const { action: a } = a2c.selectAction(a2cState);
  const { nextState, reward, done } = env.step(a);
  rolloutStates.push(new Float64Array(a2cState));
  rolloutActions.push(a);
  rolloutRewards.push(reward);
  rolloutDones.push(done);
  a2cState = done ? env.reset() : nextState;
}

const a2cUpdate = a2c.updateFromRollout(
  rolloutStates,
  rolloutActions,
  rolloutRewards,
  rolloutDones,
  a2c.predictValue(a2cState)
);
assert(!isNaN(a2cUpdate.actorLoss) && !isNaN(a2cUpdate.criticLoss), "A2C GAE Rollout Update Execution", `Actor Loss = ${a2cUpdate.actorLoss.toFixed(4)}, Critic Loss = ${a2cUpdate.criticLoss.toFixed(4)}`);

// ----------------------------------------------------------------------------
// Test 9: Proximal Policy Optimization (PPO) Clipped Loss Engine
// ----------------------------------------------------------------------------
console.log("\n--- Test Section 9: Proximal Policy Optimization (PPO) Loss Engine ---");

const ppoEngine = new PPOClippedEngine(0.20, 0.20, 0.50, 0.01);

// Test 9.1: Unclipped scenario (ratio 1.10 in [0.8, 1.2], A = +2.0)
const unclippedRes = ppoEngine.evaluateClippedLoss(
  Math.log(0.20),
  Math.log(0.22), // ratio = 1.10
  2.0,            // Advantage
  10.0,
  10.1,
  10.5,
  0.5
);
assert(!unclippedRes.isClipped, "PPO Ratio 1.10 Unclipped", `Ratio = ${unclippedRes.ratio.toFixed(2)}`);
assert(Math.abs(unclippedRes.surrogate - 2.20) < 1e-4, "PPO Unclipped Surrogate = r * A", `Surrogate = ${unclippedRes.surrogate.toFixed(4)}`);

// Test 9.2: Clipped scenario (ratio 1.50 > 1.20, A = +2.0)
const clippedRes = ppoEngine.evaluateClippedLoss(
  Math.log(0.20),
  Math.log(0.30), // ratio = 1.50
  2.0,            // Advantage
  10.0,
  10.1,
  10.5,
  0.5
);
assert(clippedRes.isClipped, "PPO Ratio 1.50 Clipped", `Ratio = ${clippedRes.ratio.toFixed(2)}`);
assert(Math.abs(clippedRes.surrogate - 2.40) < 1e-4, "PPO Clipped Surrogate = (1+eps) * A = 2.40", `Surrogate = ${clippedRes.surrogate.toFixed(4)}`);

// Test 9.3: Negative advantage clipping
const negClippedRes = ppoEngine.evaluateClippedLoss(
  Math.log(0.20),
  Math.log(0.14), // ratio = 0.70 < 0.80
  -3.0,           // Negative Advantage
  10.0,
  10.0,
  10.0,
  0.5
);
assert(negClippedRes.isClipped, "PPO Negative Advantage Ratio 0.70 Clipped", `Ratio = ${negClippedRes.ratio.toFixed(2)}`);
assert(Math.abs(negClippedRes.surrogate - (-2.40)) < 1e-4, "PPO Negative Advantage Clipped to -2.40", `Surrogate = ${negClippedRes.surrogate.toFixed(4)}`);

console.log("\n=================================================================");
console.log(`     VERIFICATION SUITE COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
console.log("=================================================================\n");
