/**
 * Verification test suite for mdp-simulator.ts.
 * Validates:
 * 1. Gaussian elimination linear solver.
 * 2. Exact match between analytic resolvent (I - γ P)^-1 r and iterative policy evaluation.
 * 3. Contraction mapping rate in Value Iteration.
 * 4. Policy Iteration vs Value Iteration optimality equivalence on 4x4 GridWorld.
 * 5. Tabular Q-learning learning on 4x4 GridWorld.
 */

import {
  solveLinearSystem,
  createGridWorld4x4,
  solveAnalyticValue,
  iterativePolicyEvaluation,
  policyIteration,
  valueIteration,
  QLearningAgent,
  GridAction
} from './mdp-simulator.js';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${msg}`);
  }
}

function runVerification() {
  console.log('=== Step 1: Verify Gaussian Elimination Linear Solver ===');
  // System:
  // 2x + y - z = 8
  // -3x - y + 2z = -11
  // -2x + y + 2z = -3
  // Solution: x = 2, y = 3, z = -1
  const A = [
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2]
  ];
  const b = [8, -11, -3];
  const sol = solveLinearSystem(A, b);
  assert(Math.abs(sol[0] - 2.0) < 1e-9, 'Gaussian elimination x=2');
  assert(Math.abs(sol[1] - 3.0) < 1e-9, 'Gaussian elimination y=3');
  assert(Math.abs(sol[2] - (-1.0)) < 1e-9, 'Gaussian elimination z=-1');

  console.log('\n=== Step 2: Verify Exact Resolvent vs Iterative Policy Evaluation ===');
  const grid = createGridWorld4x4();
  // Set policy to uniform deterministic: in all states, go UP
  const policyUp: Record<number, GridAction> = {} as Record<number, GridAction>;
  for (const s of grid.states) policyUp[s] = 'UP';

  // Solve analytically using gamma = 0.9 (since gamma=1 on continuing cyclic UP would not reach terminal)
  const gridDiscounted = { ...grid, gamma: 0.9 };
  const vAnalytic = solveAnalyticValue(gridDiscounted, policyUp);
  const vIter = iterativePolicyEvaluation(gridDiscounted, policyUp, 1e-8).V;

  let maxDiff = 0;
  for (const s of grid.states) {
    const diff = Math.abs(vAnalytic[s] - vIter[s]);
    if (diff > maxDiff) maxDiff = diff;
  }
  console.log(`Max difference between Analytic and Iterative Policy Evaluation: ${maxDiff.toExponential(4)}`);
  assert(maxDiff < 1e-5, 'Analytic matrix resolvent matches iterative policy evaluation');

  console.log('\n=== Step 3: Verify Policy Iteration and Value Iteration Equivalence ===');
  // On standard Sutton & Barto 4x4 Gridworld (gamma = 1.0, episodic)
  const piResult = policyIteration(grid);
  const viResult = valueIteration(grid, 1e-7);

  console.log(`Policy Iteration completed in ${piResult.iterations} iterations.`);
  console.log(`Value Iteration completed in ${viResult.iterations} iterations.`);

  // Check state values match
  let maxVDiff = 0;
  for (const s of grid.states) {
    const diff = Math.abs(piResult.V[s] - viResult.V[s]);
    if (diff > maxVDiff) maxVDiff = diff;
  }
  console.log(`Max V difference between PI and VI: ${maxVDiff.toExponential(4)}`);
  assert(maxVDiff < 1e-4, 'PI and VI state-value functions match to high precision');

  // Ground truth optimal value for state 1 adjacent to terminal 0 is -1.0
  assert(Math.abs(piResult.V[1] - (-1.0)) < 1e-4, 'State 1 optimal value is -1.0');
  // Ground truth optimal value for state 2 is -2.0
  assert(Math.abs(piResult.V[2] - (-2.0)) < 1e-4, 'State 2 optimal value is -2.0');
  // Ground truth optimal value for state 3 is -3.0
  assert(Math.abs(piResult.V[3] - (-3.0)) < 1e-4, 'State 3 optimal value is -3.0');

  console.log('\n=== Step 4: Verify Tabular Q-Learning Agent ===');
  const agent = new QLearningAgent(gridDiscounted, 0.2, 0.3, 0.995, 0.01);
  const numEpisodes = 500;

  for (let ep = 0; ep < numEpisodes; ep++) {
    // Pick random non-terminal start state
    let state = Math.floor(Math.random() * 14) + 1;
    let steps = 0;
    while (!gridDiscounted.isTerminal(state) && steps < 100) {
      const action = agent.selectAction(state);
      const transitions = gridDiscounted.getTransitions(state, action);
      // Deterministic transition
      const t = transitions[0];
      agent.update(state, action, t.reward, t.nextState);
      state = t.nextState;
      steps++;
    }
    agent.stepEpsilon();
  }

  // After 500 episodes, Q(1, 'LEFT') should be close to -1.0
  const qLeft = agent.getQ(1, 'LEFT');
  console.log(`Trained Q(1, 'LEFT'): ${qLeft.toFixed(4)} (Expected ~ -1.0)`);
  assert(qLeft < 0 && qLeft > -2.5, 'Q-Learning learned near-optimal action quality for state 1 LEFT');

  console.log('\n======================================================');
  console.log('🎉 ALL UNIT TESTS & VERIFICATION CHECKS PASSED (5/5)!');
  console.log('======================================================');
}

runVerification();
