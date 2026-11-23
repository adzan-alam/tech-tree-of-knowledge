/**
 * Production Zero-Dependency TypeScript Discrete Markov Decision Process (MDP)
 * and Dynamic Programming Simulator Engine.
 *
 * Implements:
 * 1. Exact Matrix Resolvent Solver: (I - γ P_π)^{-1} r_π via Gaussian Elimination.
 * 2. Iterative Policy Evaluation (Synchronous and Gauss-Seidel In-Place).
 * 3. Policy Iteration with Greedy Policy Improvement.
 * 4. Value Iteration with Banach Contraction Tolerance.
 * 5. Tabular Q-Learning with ε-Greedy Exploration.
 * 6. Standard Benchmarks: 4x4 Gridworld and Cliff Walking.
 */

// ============================================================================
// 1. Linear Algebra Core: Gaussian Elimination with Partial Pivoting
// ============================================================================

export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  // Create augmented matrix clone
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    // Partial pivoting for numerical stability
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }

    if (Math.abs(M[maxRow][i]) < 1e-12) {
      throw new Error(`Matrix is singular or ill-conditioned at pivot ${i}.`);
    }

    // Swap rows
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    // Elimination
    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  // Back-substitution
  const x: number[] = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }

  return x;
}

// ============================================================================
// 2. Generic MDP Interfaces
// ============================================================================

export interface Transition<S> {
  nextState: S;
  probability: number;
  reward: number;
}

export interface MDPModel<S extends string | number, A extends string | number> {
  states: S[];
  actions: A[];
  gamma: number;
  isTerminal: (s: S) => boolean;
  getTransitions: (s: S, a: A) => Transition<S>[];
}

// ============================================================================
// 3. Exact Analytical Matrix Resolvent Solver
// ============================================================================

export function solveAnalyticValue<S extends string | number, A extends string | number>(
  mdp: MDPModel<S, A>,
  policy: Record<S, A>
): Record<S, number> {
  const nonTerminalStates = mdp.states.filter((s) => !mdp.isTerminal(s));
  const n = nonTerminalStates.length;
  const stateIndex: Record<S, number> = {} as Record<S, number>;
  nonTerminalStates.forEach((s, idx) => {
    stateIndex[s] = idx;
  });

  // Construct (I - γ P_π) and r_π
  const A_mat: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const b_vec: number[] = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    const s = nonTerminalStates[i];
    const a = policy[s];
    const transitions = mdp.getTransitions(s, a);

    A_mat[i][i] = 1.0; // Identity diagonal

    let expectedReward = 0;
    for (const t of transitions) {
      expectedReward += t.probability * t.reward;
      if (!mdp.isTerminal(t.nextState)) {
        const j = stateIndex[t.nextState];
        A_mat[i][j] -= mdp.gamma * t.probability;
      }
    }
    b_vec[i] = expectedReward;
  }

  const solution = solveLinearSystem(A_mat, b_vec);

  const V: Record<S, number> = {} as Record<S, number>;
  for (const s of mdp.states) {
    if (mdp.isTerminal(s)) {
      V[s] = 0.0;
    } else {
      V[s] = solution[stateIndex[s]];
    }
  }

  return V;
}

// ============================================================================
// 4. Iterative Policy Evaluation (Synchronous & Gauss-Seidel)
// ============================================================================

export function iterativePolicyEvaluation<S extends string | number, A extends string | number>(
  mdp: MDPModel<S, A>,
  policy: Record<S, A>,
  theta: number = 1e-7,
  maxIterations: number = 10000,
  inPlace: boolean = false
): { V: Record<S, number>; iterations: number } {
  const V: Record<S, number> = {} as Record<S, number>;
  for (const s of mdp.states) V[s] = 0.0;

  let iter = 0;
  for (; iter < maxIterations; iter++) {
    let delta = 0;
    const V_next = inPlace ? V : ({ ...V } as Record<S, number>);

    for (const s of mdp.states) {
      if (mdp.isTerminal(s)) {
        V_next[s] = 0.0;
        continue;
      }

      const a = policy[s];
      let sum = 0;
      for (const t of mdp.getTransitions(s, a)) {
        sum += t.probability * (t.reward + mdp.gamma * V[t.nextState]);
      }

      delta = Math.max(delta, Math.abs(V[s] - sum));
      V_next[s] = sum;
    }

    if (!inPlace) {
      for (const s of mdp.states) V[s] = V_next[s];
    }

    if (delta < theta) {
      iter++;
      break;
    }
  }

  return { V, iterations: iter };
}

// ============================================================================
// 5. Policy Iteration (Howard 1960)
// ============================================================================

export function policyIteration<S extends string | number, A extends string | number>(
  mdp: MDPModel<S, A>,
  theta: number = 1e-7
): { policy: Record<S, A>; V: Record<S, number>; iterations: number } {
  // Initialize arbitrary deterministic policy
  const policy: Record<S, A> = {} as Record<S, A>;
  for (const s of mdp.states) {
    policy[s] = mdp.actions[0];
  }

  let outerIterations = 0;
  let V: Record<S, number> = {} as Record<S, number>;

  while (true) {
    outerIterations++;

    // 1. Policy Evaluation
    const evalResult = iterativePolicyEvaluation(mdp, policy, theta);
    V = evalResult.V;

    // 2. Policy Improvement
    let policyStable = true;
    for (const s of mdp.states) {
      if (mdp.isTerminal(s)) continue;

      const oldAction = policy[s];
      let bestAction = oldAction;
      let maxQ = -Infinity;

      for (const a of mdp.actions) {
        let q = 0;
        for (const t of mdp.getTransitions(s, a)) {
          q += t.probability * (t.reward + mdp.gamma * V[t.nextState]);
        }
        if (q > maxQ + 1e-12) {
          maxQ = q;
          bestAction = a;
        }
      }

      if (bestAction !== oldAction) {
        policy[s] = bestAction;
        policyStable = false;
      }
    }

    if (policyStable || outerIterations > 1000) break;
  }

  return { policy, V, iterations: outerIterations };
}

// ============================================================================
// 6. Value Iteration (Bellman 1957)
// ============================================================================

export function valueIteration<S extends string | number, A extends string | number>(
  mdp: MDPModel<S, A>,
  theta: number = 1e-7,
  maxIterations: number = 10000
): { policy: Record<S, A>; V: Record<S, number>; iterations: number } {
  const V: Record<S, number> = {} as Record<S, number>;
  for (const s of mdp.states) V[s] = 0.0;

  let iter = 0;
  for (; iter < maxIterations; iter++) {
    let delta = 0;
    const V_next = { ...V };

    for (const s of mdp.states) {
      if (mdp.isTerminal(s)) {
        V_next[s] = 0.0;
        continue;
      }

      let maxQ = -Infinity;
      for (const a of mdp.actions) {
        let q = 0;
        for (const t of mdp.getTransitions(s, a)) {
          q += t.probability * (t.reward + mdp.gamma * V[t.nextState]);
        }
        if (q > maxQ) maxQ = q;
      }

      delta = Math.max(delta, Math.abs(V[s] - maxQ));
      V_next[s] = maxQ;
    }

    for (const s of mdp.states) V[s] = V_next[s];

    if (delta < theta) {
      iter++;
      break;
    }
  }

  // Extract greedy optimal policy
  const policy: Record<S, A> = {} as Record<S, A>;
  for (const s of mdp.states) {
    if (mdp.isTerminal(s)) {
      policy[s] = mdp.actions[0];
      continue;
    }

    let bestAction = mdp.actions[0];
    let maxQ = -Infinity;
    for (const a of mdp.actions) {
      let q = 0;
      for (const t of mdp.getTransitions(s, a)) {
        q += t.probability * (t.reward + mdp.gamma * V[t.nextState]);
      }
      if (q > maxQ + 1e-12) {
        maxQ = q;
        bestAction = a;
      }
    }
    policy[s] = bestAction;
  }

  return { policy, V, iterations: iter };
}

// ============================================================================
// 7. Tabular Q-Learning Agent (Watkins 1989)
// ============================================================================

export class QLearningAgent<S extends string | number, A extends string | number> {
  public Q: Record<string, number> = {};
  public mdp: MDPModel<S, A>;
  public alpha: number;
  public epsilon: number;
  public epsilonDecay: number;
  public minEpsilon: number;

  constructor(
    mdp: MDPModel<S, A>,
    alpha: number = 0.1,
    epsilon: number = 0.2,
    epsilonDecay: number = 0.999,
    minEpsilon: number = 0.01
  ) {
    this.mdp = mdp;
    this.alpha = alpha;
    this.epsilon = epsilon;
    this.epsilonDecay = epsilonDecay;
    this.minEpsilon = minEpsilon;

    // Initialize Q-table
    for (const s of mdp.states) {
      for (const a of mdp.actions) {
        this.Q[`${s}::${a}`] = 0.0;
      }
    }
  }

  public getQ(s: S, a: A): number {
    return this.Q[`${s}::${a}`] ?? 0.0;
  }

  public setQ(s: S, a: A, val: number): void {
    this.Q[`${s}::${a}`] = val;
  }

  public selectAction(s: S): A {
    if (Math.random() < this.epsilon) {
      const idx = Math.floor(Math.random() * this.mdp.actions.length);
      return this.mdp.actions[idx];
    }

    let bestAction = this.mdp.actions[0];
    let maxQ = -Infinity;
    for (const a of this.mdp.actions) {
      const q = this.getQ(s, a);
      if (q > maxQ) {
        maxQ = q;
        bestAction = a;
      }
    }
    return bestAction;
  }

  public update(s: S, a: A, r: number, sNext: S): void {
    let maxNextQ = 0.0;
    if (!this.mdp.isTerminal(sNext)) {
      maxNextQ = -Infinity;
      for (const aNext of this.mdp.actions) {
        const q = this.getQ(sNext, aNext);
        if (q > maxNextQ) maxNextQ = q;
      }
    }

    const currentQ = this.getQ(s, a);
    const target = r + this.mdp.gamma * maxNextQ;
    const tdError = target - currentQ;
    this.setQ(s, a, currentQ + this.alpha * tdError);
  }

  public stepEpsilon(): void {
    this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
  }
}

// ============================================================================
// 8. Benchmark Environments: 4x4 GridWorld and Cliff Walking
// ============================================================================

export type GridAction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function createGridWorld4x4(): MDPModel<number, GridAction> {
  const states: number[] = Array.from({ length: 16 }, (_, i) => i);
  const actions: GridAction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

  const isTerminal = (s: number) => s === 0 || s === 15;

  const getTransitions = (s: number, a: GridAction): Transition<number>[] => {
    if (isTerminal(s)) {
      return [{ nextState: s, probability: 1.0, reward: 0.0 }];
    }

    const row = Math.floor(s / 4);
    const col = s % 4;

    let nextRow = row;
    let nextCol = col;

    if (a === 'UP') nextRow = Math.max(0, row - 1);
    if (a === 'DOWN') nextRow = Math.min(3, row + 1);
    if (a === 'LEFT') nextCol = Math.max(0, col - 1);
    if (a === 'RIGHT') nextCol = Math.min(3, col + 1);

    const nextState = nextRow * 4 + nextCol;
    return [{ nextState, probability: 1.0, reward: -1.0 }];
  };

  return {
    states,
    actions,
    gamma: 1.0,
    isTerminal,
    getTransitions
  };
}

export function createCliffWalking(): MDPModel<number, GridAction> {
  // 4 rows x 12 cols = 48 states
  const states: number[] = Array.from({ length: 48 }, (_, i) => i);
  const actions: GridAction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

  const startState = 36; // (row 3, col 0)
  const goalState = 47;  // (row 3, col 11)
  const isCliff = (s: number) => s >= 37 && s <= 46;
  const isTerminal = (s: number) => s === goalState;

  const getTransitions = (s: number, a: GridAction): Transition<number>[] => {
    if (isTerminal(s)) {
      return [{ nextState: s, probability: 1.0, reward: 0.0 }];
    }

    const row = Math.floor(s / 12);
    const col = s % 12;

    let nextRow = row;
    let nextCol = col;

    if (a === 'UP') nextRow = Math.max(0, row - 1);
    if (a === 'DOWN') nextRow = Math.min(3, row + 1);
    if (a === 'LEFT') nextCol = Math.max(0, col - 1);
    if (a === 'RIGHT') nextCol = Math.min(11, col + 1);

    const nextCandidate = nextRow * 12 + nextCol;

    if (isCliff(nextCandidate)) {
      // Fall off cliff -> reset to start with penalty -100
      return [{ nextState: startState, probability: 1.0, reward: -100.0 }];
    }

    return [{ nextState: nextCandidate, probability: 1.0, reward: -1.0 }];
  };

  return {
    states,
    actions,
    gamma: 0.99,
    isTerminal,
    getTransitions
  };
}
