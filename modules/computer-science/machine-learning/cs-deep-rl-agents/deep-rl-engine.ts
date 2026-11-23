/**
 * deep-rl-engine.ts
 * ============================================================================
 * Production TypeScript Deep Reinforcement Learning Engine
 * 
 * Implements:
 * 1. Vector and Matrix Mathematics & Autograd Primitives
 * 2. Stable Activations (ReLU, Tanh, Softmax, Sigmoid) with Log-Sum-Exp
 * 3. Robust Loss Functions (Huber / Smooth L1, MSE)
 * 4. Experience Replay (Circular FIFO Ring Buffer & Prioritized SumTree)
 * 5. Target Network Manager (Hard Periodic & Polyak Soft Updates)
 * 6. Generalized Advantage Estimation (GAE; Schulman et al., 2015)
 * 7. Non-linear CartPole Physical Simulator (Analytical Equations of Motion)
 * 8. Deep Q-Network (DQN) Agent
 * 9. Advantage Actor-Critic (A2C) Agent
 * 10. Proximal Policy Optimization (PPO) Clipped Surrogate Engine
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. Vector & Matrix Math Primitives
// ----------------------------------------------------------------------------

export class MathOps {
  static dot(a: number[] | Float64Array, b: number[] | Float64Array): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
  }

  static add(a: number[], b: number[]): number[] {
    return a.map((val, i) => val + b[i]);
  }

  static scale(a: number[], s: number): number[] {
    return a.map(val => val * s);
  }

  static norm2(a: number[] | Float64Array): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * a[i];
    return Math.sqrt(sum);
  }

  static clip(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }

  static clipVec(vec: number[], maxNorm: number): number[] {
    const norm = MathOps.norm2(vec);
    if (norm <= maxNorm || norm === 0) return [...vec];
    const factor = maxNorm / norm;
    return vec.map(v => v * factor);
  }

  // Softmax with log-sum-exp numerical stabilization
  static softmax(logits: number[] | Float64Array): Float64Array {
    let max = -Infinity;
    for (let i = 0; i < logits.length; i++) {
      if (logits[i] > max) max = logits[i];
    }
    const probs = new Float64Array(logits.length);
    let sum = 0;
    for (let i = 0; i < logits.length; i++) {
      probs[i] = Math.exp(logits[i] - max);
      sum += probs[i];
    }
    for (let i = 0; i < logits.length; i++) {
      probs[i] /= sum;
    }
    return probs;
  }

  // Huber / Smooth L1 Loss: 0.5 * delta^2 if |delta| <= kappa else kappa * (|delta| - 0.5 * kappa)
  static huberLoss(tdError: number, kappa: number = 1.0): { loss: number; grad: number } {
    const abs = Math.abs(tdError);
    if (abs <= kappa) {
      return {
        loss: 0.5 * tdError * tdError,
        grad: tdError // derivative dL/d(delta)
      };
    } else {
      return {
        loss: kappa * (abs - 0.5 * kappa),
        grad: kappa * Math.sign(tdError) // strictly clamped to +/- kappa
      };
    }
  }

  // Box-Muller transform for standard Gaussian draw N(0, 1)
  static sampleGaussian(mean: number = 0, std: number = 1): number {
    let u1 = Math.random();
    let u2 = Math.random();
    while (u1 <= 1e-15) u1 = Math.random(); // avoid log(0)
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + std * z0;
  }
}

// ----------------------------------------------------------------------------
// 2. Experience Replay Buffers (Uniform Ring Buffer & Prioritized SumTree)
// ----------------------------------------------------------------------------

export interface Transition<S = number[], A = number> {
  state: S;
  action: A;
  reward: number;
  nextState: S;
  done: boolean;
}

export class ReplayBuffer<S = number[], A = number> {
  private buffer: (Transition<S, A> | null)[];
  private pointer: number = 0;
  private currentSize: number = 0;

  constructor(public readonly capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be positive");
    this.buffer = new Array(capacity).fill(null);
  }

  push(transition: Transition<S, A>): void {
    this.buffer[this.pointer] = transition;
    this.pointer = (this.pointer + 1) % this.capacity;
    if (this.currentSize < this.capacity) this.currentSize++;
  }

  sample(batchSize: number): Transition<S, A>[] {
    if (this.currentSize < batchSize) {
      throw new Error(`Buffer size (${this.currentSize}) is less than batch size (${batchSize})`);
    }
    const batch: Transition<S, A>[] = [];
    const chosen = new Set<number>();
    while (batch.length < batchSize) {
      const idx = Math.floor(Math.random() * this.currentSize);
      if (!chosen.has(idx)) {
        chosen.add(idx);
        batch.push(this.buffer[idx]!);
      }
    }
    return batch;
  }

  size(): number {
    return this.currentSize;
  }
}

// Prioritized Experience Replay via Complete Binary Sum-Tree
export class SumTree {
  public readonly tree: Float64Array;
  public readonly data: any[];
  private writePtr: number = 0;
  public size: number = 0;

  constructor(public readonly capacity: number) {
    this.tree = new Float64Array(2 * capacity);
    this.data = new Array(capacity).fill(null);
  }

  get totalPriority(): number {
    return this.tree[1];
  }

  update(dataIdx: number, priority: number): void {
    const treeIdx = dataIdx + this.capacity;
    const change = priority - this.tree[treeIdx];
    this.tree[treeIdx] = priority;

    let parent = Math.floor(treeIdx / 2);
    while (parent >= 1) {
      this.tree[parent] += change;
      parent = Math.floor(parent / 2);
    }
  }

  add(priority: number, item: any): number {
    const dataIdx = this.writePtr;
    this.data[dataIdx] = item;
    this.update(dataIdx, priority);

    this.writePtr = (this.writePtr + 1) % this.capacity;
    if (this.size < this.capacity) this.size++;
    return dataIdx;
  }

  get(v: number): { dataIdx: number; priority: number; item: any } {
    let parent = 1;
    while (parent < this.capacity) {
      const left = 2 * parent;
      const right = left + 1;
      if (v < this.tree[left]) {
        parent = left;
      } else {
        v -= this.tree[left];
        parent = right;
      }
    }
    const dataIdx = parent - this.capacity;
    return {
      dataIdx,
      priority: this.tree[parent],
      item: this.data[dataIdx]
    };
  }
}

export class PrioritizedReplayBuffer<S = number[], A = number> {
  private tree: SumTree;
  private maxPriority: number = 1.0;

  constructor(
    public readonly capacity: number,
    public readonly alpha: number = 0.6,
    public readonly epsilon: number = 1e-5
  ) {
    this.tree = new SumTree(capacity);
  }

  push(transition: Transition<S, A>): void {
    const p = Math.pow(this.maxPriority, this.alpha);
    this.tree.add(p, transition);
  }

  sample(batchSize: number, beta: number = 0.4): {
    transitions: Transition<S, A>[];
    indices: number[];
    weights: Float64Array;
  } {
    if (this.tree.size < batchSize) throw new Error("Not enough samples in PER");

    const transitions: Transition<S, A>[] = [];
    const indices: number[] = [];
    const rawWeights = new Float64Array(batchSize);

    const segment = this.tree.totalPriority / batchSize;
    let maxWeight = 0;

    for (let i = 0; i < batchSize; i++) {
      const a = segment * i;
      const b = segment * (i + 1);
      const val = a + Math.random() * (b - a);
      const leaf = this.tree.get(val);

      transitions.push(leaf.item);
      indices.push(leaf.dataIdx);

      const prob = leaf.priority / this.tree.totalPriority;
      const weight = Math.pow(this.tree.size * prob, -beta);
      rawWeights[i] = weight;
      if (weight > maxWeight) maxWeight = weight;
    }

    const weights = new Float64Array(batchSize);
    for (let i = 0; i < batchSize; i++) {
      weights[i] = rawWeights[i] / (maxWeight + 1e-8);
    }

    return { transitions, indices, weights };
  }

  updatePriorities(indices: number[], tdErrors: number[]): void {
    for (let i = 0; i < indices.length; i++) {
      const err = Math.abs(tdErrors[i]) + this.epsilon;
      if (err > this.maxPriority) this.maxPriority = err;
      this.tree.update(indices[i], Math.pow(err, this.alpha));
    }
  }

  size(): number {
    return this.tree.size;
  }
}

// ----------------------------------------------------------------------------
// 3. Target Network Synchronization Manager
// ----------------------------------------------------------------------------

export class TargetNetworkManager {
  public stepCount: number = 0;

  // Hard periodic synchronization: target = online
  static hardSync(onlineParams: Float64Array[], targetParams: Float64Array[]): void {
    for (let i = 0; i < onlineParams.length; i++) {
      targetParams[i].set(onlineParams[i]);
    }
  }

  // Soft Polyak exponential moving average: target = tau * online + (1 - tau) * target
  static softSync(onlineParams: Float64Array[], targetParams: Float64Array[], tau: number = 0.005): void {
    const oneMinusTau = 1.0 - tau;
    for (let i = 0; i < onlineParams.length; i++) {
      const online = onlineParams[i];
      const target = targetParams[i];
      for (let j = 0; j < online.length; j++) {
        target[j] = tau * online[j] + oneMinusTau * target[j];
      }
    }
  }
}

// ----------------------------------------------------------------------------
// 4. Generalized Advantage Estimation (GAE)
// ----------------------------------------------------------------------------

export class AdvantageEstimator {
  /**
   * Computes Generalized Advantage Estimation (GAE; Schulman et al., 2015)
   * delta_t = r_{t+1} + gamma * V(s_{t+1}) * (1 - done) - V(s_t)
   * A_t = delta_t + gamma * lambda * (1 - done) * A_{t+1}
   */
  static computeGAE(
    rewards: number[] | Float64Array,
    values: number[] | Float64Array, // Length: T + 1
    dones: boolean[],               // Length: T
    gamma: number = 0.99,
    lambda: number = 0.95
  ): { advantages: Float64Array; targets: Float64Array } {
    const T = rewards.length;
    const advantages = new Float64Array(T);
    const targets = new Float64Array(T);

    let gae = 0;
    const factor = gamma * lambda;

    for (let t = T - 1; t >= 0; t--) {
      const nonTerminal = dones[t] ? 0.0 : 1.0;
      const delta = rewards[t] + gamma * values[t + 1] * nonTerminal - values[t];
      gae = delta + factor * nonTerminal * gae;
      advantages[t] = gae;
      targets[t] = gae + values[t]; // target y_t = A_t + V(s_t)
    }

    return { advantages, targets };
  }

  // Normalize advantage vector to zero mean and unit variance
  static normalize(advantages: Float64Array): Float64Array {
    const n = advantages.length;
    if (n === 0) return advantages;

    let mean = 0;
    for (let i = 0; i < n; i++) mean += advantages[i];
    mean /= n;

    let variance = 0;
    for (let i = 0; i < n; i++) variance += (advantages[i] - mean) ** 2;
    const std = Math.sqrt(variance / n) + 1e-8;

    const norm = new Float64Array(n);
    for (let i = 0; i < n; i++) norm[i] = (advantages[i] - mean) / std;
    return norm;
  }
}

// ----------------------------------------------------------------------------
// 5. Non-Linear CartPole Physical Simulator
// ----------------------------------------------------------------------------

export class CartPoleSim {
  public gravity: number = 9.8;
  public massCart: number = 1.0;
  public massPole: number = 0.1;
  public totalMass: number = 1.1;
  public length: number = 0.5; // half-pole length
  public poleMassLength: number = 0.05;
  public forceMag: number = 10.0;
  public tau: number = 0.02; // seconds per discrete step

  // Angle limit: 12 degrees (~0.2095 rad); Position limit: 2.4 m
  public thetaThreshold: number = (12 * 2 * Math.PI) / 360;
  public xThreshold: number = 2.4;

  public state: Float64Array; // [x, x_dot, theta, theta_dot]
  public steps: number = 0;

  constructor() {
    this.state = new Float64Array(4);
    this.reset();
  }

  reset(): Float64Array {
    // Uniform initial distribution in [-0.05, 0.05]
    for (let i = 0; i < 4; i++) {
      this.state[i] = (Math.random() - 0.5) * 0.1;
    }
    this.steps = 0;
    return new Float64Array(this.state);
  }

  step(action: number): { nextState: Float64Array; reward: number; done: boolean } {
    const x = this.state[0];
    const xDot = this.state[1];
    const theta = this.state[2];
    const thetaDot = this.state[3];

    const force = action === 1 ? this.forceMag : -this.forceMag;
    const costheta = Math.cos(theta);
    const sintheta = Math.sin(theta);

    // Nonlinear equations of motion (Euler-Lagrange)
    const temp = (force + this.poleMassLength * thetaDot * thetaDot * sintheta) / this.totalMass;
    const thetaAcc =
      (this.gravity * sintheta - costheta * temp) /
      (this.length * (4.0 / 3.0 - (this.massPole * costheta * costheta) / this.totalMass));
    const xAcc = temp - (this.poleMassLength * thetaAcc * costheta) / this.totalMass;

    // Euler integration
    this.state[0] += this.tau * xDot;
    this.state[1] += this.tau * xAcc;
    this.state[2] += this.tau * thetaDot;
    this.state[3] += this.tau * thetaAcc;
    this.steps++;

    const done =
      this.state[0] < -this.xThreshold ||
      this.state[0] > this.xThreshold ||
      this.state[2] < -this.thetaThreshold ||
      this.state[2] > this.thetaThreshold ||
      this.steps >= 500;

    const reward = done && this.steps < 500 ? 0.0 : 1.0;

    return {
      nextState: new Float64Array(this.state),
      reward,
      done
    };
  }
}

// ----------------------------------------------------------------------------
// 6. Deep Q-Network (DQN) Agent
// ----------------------------------------------------------------------------

export class DQNAgent {
  public onlineWeights: Float64Array[]; // numActions x stateDim
  public onlineBiases: Float64Array;   // numActions
  public targetWeights: Float64Array[];
  public targetBiases: Float64Array;
  public replayBuffer: ReplayBuffer<number[], number>;
  public epsilon: number = 1.0;
  public epsilonMin: number = 0.05;
  public epsilonDecay: number = 0.995;
  public stepCount: number = 0;

  constructor(
    public readonly stateDim: number,
    public readonly numActions: number,
    public readonly gamma: number = 0.99,
    public readonly lr: number = 0.01,
    public readonly targetSyncInterval: number = 200,
    replayCapacity: number = 10000
  ) {
    this.replayBuffer = new ReplayBuffer(replayCapacity);

    // Initialize online network
    this.onlineWeights = Array.from({ length: numActions }, () => {
      const w = new Float64Array(stateDim);
      for (let i = 0; i < stateDim; i++) w[i] = (Math.random() - 0.5) * 0.2;
      return w;
    });
    this.onlineBiases = new Float64Array(numActions);

    // Initialize target network clone
    this.targetWeights = this.onlineWeights.map(w => new Float64Array(w));
    this.targetBiases = new Float64Array(this.onlineBiases);
  }

  predictQ(weights: Float64Array[], biases: Float64Array, state: number[] | Float64Array): Float64Array {
    const q = new Float64Array(this.numActions);
    for (let a = 0; a < this.numActions; a++) {
      let sum = biases[a];
      const wa = weights[a];
      for (let d = 0; d < this.stateDim; d++) {
        sum += wa[d] * state[d];
      }
      q[a] = sum;
    }
    return q;
  }

  selectAction(state: number[] | Float64Array): number {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * this.numActions);
    }
    const q = this.predictQ(this.onlineWeights, this.onlineBiases, state);
    let bestAction = 0;
    let maxVal = -Infinity;
    for (let a = 0; a < this.numActions; a++) {
      if (q[a] > maxVal) {
        maxVal = q[a];
        bestAction = a;
      }
    }
    return bestAction;
  }

  trainStep(batchSize: number = 32): { loss: number; tdErrorMean: number } {
    if (this.replayBuffer.size() < batchSize) return { loss: 0, tdErrorMean: 0 };

    const batch = this.replayBuffer.sample(batchSize);
    let totalLoss = 0;
    let totalError = 0;

    for (const trans of batch) {
      // 1. Target evaluation via Target Network: y = r + gamma * (1 - done) * max_a' Q_target(s', a')
      const targetQ = this.predictQ(this.targetWeights, this.targetBiases, trans.nextState);
      let maxNextQ = -Infinity;
      for (let a = 0; a < this.numActions; a++) {
        if (targetQ[a] > maxNextQ) maxNextQ = targetQ[a];
      }
      const target = trans.reward + this.gamma * (trans.done ? 0 : 1) * maxNextQ;

      // 2. Online Q prediction
      const onlineQ = this.predictQ(this.onlineWeights, this.onlineBiases, trans.state);
      const currentVal = onlineQ[trans.action];
      const tdError = target - currentVal;
      totalError += Math.abs(tdError);

      // 3. Huber Loss and Gradient
      const { loss, grad } = MathOps.huberLoss(tdError, 1.0);
      totalLoss += loss;

      // 4. Gradient update: onlineWeights[a] += lr * grad * state
      const wa = this.onlineWeights[trans.action];
      for (let d = 0; d < this.stateDim; d++) {
        wa[d] += this.lr * grad * trans.state[d];
      }
      this.onlineBiases[trans.action] += this.lr * grad;
    }

    // Decay epsilon
    if (this.epsilon > this.epsilonMin) {
      this.epsilon *= this.epsilonDecay;
    }

    // Periodic Target Synchronization
    this.stepCount++;
    if (this.stepCount % this.targetSyncInterval === 0) {
      TargetNetworkManager.hardSync(this.onlineWeights, this.targetWeights);
      this.targetBiases.set(this.onlineBiases);
    }

    return {
      loss: totalLoss / batchSize,
      tdErrorMean: totalError / batchSize
    };
  }
}

// ----------------------------------------------------------------------------
// 7. Advantage Actor-Critic (A2C) Agent
// ----------------------------------------------------------------------------

export class ActorCriticAgent {
  public actorWeights: Float64Array[]; // numActions x stateDim
  public criticWeights: Float64Array;  // stateDim
  public criticBias: number = 0;

  constructor(
    public readonly stateDim: number,
    public readonly numActions: number,
    public readonly gamma: number = 0.99,
    public readonly lambda: number = 0.95,
    public readonly lrActor: number = 0.005,
    public readonly lrCritic: number = 0.02,
    public readonly entBeta: number = 0.01
  ) {
    this.actorWeights = Array.from({ length: numActions }, () => {
      const w = new Float64Array(stateDim);
      for (let i = 0; i < stateDim; i++) w[i] = (Math.random() - 0.5) * 0.1;
      return w;
    });
    this.criticWeights = new Float64Array(stateDim);
  }

  predictValue(state: number[] | Float64Array): number {
    let sum = this.criticBias;
    for (let d = 0; d < this.stateDim; d++) {
      sum += this.criticWeights[d] * state[d];
    }
    return sum;
  }

  predictActionProbs(state: number[] | Float64Array): Float64Array {
    const logits = new Float64Array(this.numActions);
    for (let a = 0; a < this.numActions; a++) {
      let sum = 0;
      const wa = this.actorWeights[a];
      for (let d = 0; d < this.stateDim; d++) sum += wa[d] * state[d];
      logits[a] = sum;
    }
    return MathOps.softmax(logits);
  }

  selectAction(state: number[] | Float64Array): { action: number; probs: Float64Array } {
    const probs = this.predictActionProbs(state);
    const r = Math.random();
    let cumulative = 0;
    let chosen = 0;
    for (let a = 0; a < this.numActions; a++) {
      cumulative += probs[a];
      if (r <= cumulative) {
        chosen = a;
        break;
      }
    }
    return { action: chosen, probs };
  }

  updateFromRollout(
    states: Float64Array[],
    actions: number[],
    rewards: number[],
    dones: boolean[],
    nextStateValue: number
  ): { actorLoss: number; criticLoss: number } {
    const T = states.length;
    const values = new Float64Array(T + 1);
    for (let t = 0; t < T; t++) values[t] = this.predictValue(states[t]);
    values[T] = nextStateValue;

    // 1. GAE Advantages
    const { advantages, targets } = AdvantageEstimator.computeGAE(
      rewards,
      values,
      dones,
      this.gamma,
      this.lambda
    );
    const normAdv = AdvantageEstimator.normalize(advantages);

    let totalActorLoss = 0;
    let totalCriticLoss = 0;

    for (let t = 0; t < T; t++) {
      const s = states[t];
      const a = actions[t];
      const targetV = targets[t];
      const adv = normAdv[t];

      // Critic Update (MSE: target - V)
      const currentV = this.predictValue(s);
      const cError = targetV - currentV;
      totalCriticLoss += 0.5 * cError * cError;

      for (let d = 0; d < this.stateDim; d++) {
        this.criticWeights[d] += this.lrCritic * cError * s[d];
      }
      this.criticBias += this.lrCritic * cError;

      // Actor Update
      const probs = this.predictActionProbs(s);
      let entropy = 0;
      for (let i = 0; i < this.numActions; i++) {
        if (probs[i] > 1e-12) entropy -= probs[i] * Math.log(probs[i]);
      }

      totalActorLoss -= Math.log(probs[a] + 1e-12) * adv;

      for (let i = 0; i < this.numActions; i++) {
        const indicator = i === a ? 1.0 : 0.0;
        const pgScore = (indicator - probs[i]) * adv;
        const logP = probs[i] > 1e-12 ? Math.log(probs[i]) : 0;
        const entGrad = -probs[i] * (logP + entropy);
        const updateFactor = pgScore + this.entBeta * entGrad;

        const wa = this.actorWeights[i];
        for (let d = 0; d < this.stateDim; d++) {
          wa[d] += this.lrActor * updateFactor * s[d];
        }
      }
    }

    return {
      actorLoss: totalActorLoss / T,
      criticLoss: totalCriticLoss / T
    };
  }
}

// ----------------------------------------------------------------------------
// 8. Proximal Policy Optimization (PPO) Loss Engine
// ----------------------------------------------------------------------------

export class PPOClippedEngine {
  constructor(
    public readonly clipEps: number = 0.20,
    public readonly vfClipEps: number = 0.20,
    public readonly vfCoef: number = 0.50,
    public readonly entCoef: number = 0.01
  ) {}

  evaluateClippedLoss(
    logProbOld: number,
    logProbNew: number,
    advantage: number,
    valueOld: number,
    valueNew: number,
    valueTarget: number,
    entropy: number
  ): {
    totalLoss: number;
    surrogate: number;
    valueLoss: number;
    ratio: number;
    isClipped: boolean;
  } {
    // 1. Probability ratio r_t(theta) = exp(log_new - log_old)
    const ratio = Math.exp(logProbNew - logProbOld);

    // 2. Clipped surrogate: min(r * A, clip(r, 1-eps, 1+eps) * A)
    const surr1 = ratio * advantage;
    const clippedRatio = MathOps.clip(ratio, 1.0 - this.clipEps, 1.0 + this.clipEps);
    const surr2 = clippedRatio * advantage;
    const isClipped = Math.abs(ratio - 1.0) > this.clipEps;

    // PPO maximizes surrogate -> minimizes negative surrogate
    const policyLoss = -Math.min(surr1, surr2);

    // 3. Clipped Value Loss
    const vUnclipped = (valueNew - valueTarget) ** 2;
    const vClippedPred = valueOld + MathOps.clip(valueNew - valueOld, -this.vfClipEps, this.vfClipEps);
    const vClipped = (vClippedPred - valueTarget) ** 2;
    const valueLoss = 0.5 * Math.max(vUnclipped, vClipped);

    // 4. Combined Loss
    const totalLoss = policyLoss + this.vfCoef * valueLoss - this.entCoef * entropy;

    return {
      totalLoss,
      surrogate: Math.min(surr1, surr2),
      valueLoss,
      ratio,
      isClipped
    };
  }
}
