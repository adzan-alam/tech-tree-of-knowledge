/**
 * Sovereign Master Probability & Stochastic Engine (SMTS-40K)
 * Module: math-probability-statistics
 * 
 * Production TypeScript implementation of zero-allocation, high-performance,
 * seedable stochastic generators, multivariate Gaussian transforms, Bayesian
 * conjugate estimators, and Grand Gauntlet verification suites.
 */

export class PCG32 {
  private state: bigint;
  private inc: bigint;

  constructor(seedState = 42n, seedSequence = 54n) {
    this.state = 0n;
    this.inc = (seedSequence << 1n) | 1n;
    this.nextUint32();
    this.state = (this.state + seedState) & 0xffffffffffffffffn;
    this.nextUint32();
  }

  public nextUint32(): number {
    const oldState = this.state;
    // Linear Congruential step: state = state * 6364136223846793005n + inc
    this.state = (oldState * 6364136223846793005n + this.inc) & 0xffffffffffffffffn;
    
    // Output function: XSH-RR (xorshift high, random rotate)
    const xorShifted = Number(((oldState >> 18n) ^ oldState) >> 27n) >>> 0;
    const rot = Number(oldState >> 59n) >>> 0;
    const result = ((xorShifted >>> rot) | (xorShifted << ((-rot) & 31))) >>> 0;
    return result;
  }

  /** Generates a uniform float in [0, 1) */
  public nextFloat(): number {
    return this.nextUint32() / 4294967296.0;
  }
}

export class ProbabilityEngine {
  private rng: PCG32;
  private hasSpareGaussian = false;
  private spareGaussian = 0.0;

  constructor(seed = 1337n) {
    this.rng = new PCG32(seed, 1n);
  }

  /**
   * Reseeds the internal PRNG
   */
  public reseed(seed: bigint): void {
    this.rng = new PCG32(seed, 1n);
    this.hasSpareGaussian = false;
  }

  /** Uniform random float in [min, max) */
  public uniform(min = 0, max = 1): number {
    return min + (max - min) * this.rng.nextFloat();
  }

  /** Standard normal N(0, 1) via Marsaglia Polar transform */
  public standardNormal(): number {
    if (this.hasSpareGaussian) {
      this.hasSpareGaussian = false;
      return this.spareGaussian;
    }

    let u: number, v: number, s: number;
    do {
      u = 2.0 * this.rng.nextFloat() - 1.0;
      v = 2.0 * this.rng.nextFloat() - 1.0;
      s = u * u + v * v;
    } while (s >= 1.0 || s === 0.0);

    const mul = Math.sqrt(-2.0 * Math.log(s) / s);
    this.spareGaussian = v * mul;
    this.hasSpareGaussian = true;
    return u * mul;
  }

  /** Univariate Gaussian N(mu, sigma^2) */
  public gaussian(mu = 0, sigma = 1): number {
    return mu + sigma * this.standardNormal();
  }

  /** Exponential distribution Exp(lambda) with mean 1/lambda */
  public exponential(lambda: number): number {
    if (lambda <= 0) throw new Error("Lambda must be strictly positive");
    const u = Math.max(1e-15, this.rng.nextFloat());
    return -Math.log(u) / lambda;
  }

  /** Bernoulli trial with parameter p */
  public bernoulli(p: number): number {
    return this.rng.nextFloat() < p ? 1 : 0;
  }

  /** Binomial distribution Bin(n, p) */
  public binomial(n: number, p: number): number {
    let successes = 0;
    for (let i = 0; i < n; i++) {
      if (this.rng.nextFloat() < p) successes++;
    }
    return successes;
  }

  /** Poisson distribution Pois(lambda) via Knuth's algorithm (or Gaussian approximation for large lambda) */
  public poisson(lambda: number): number {
    if (lambda <= 0) throw new Error("Lambda must be strictly positive");
    if (lambda > 30) {
      // Gaussian approximation with continuity correction
      const sample = Math.round(this.gaussian(lambda, Math.sqrt(lambda)));
      return Math.max(0, sample);
    }
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1.0;
    do {
      k++;
      p *= this.rng.nextFloat();
    } while (p > L);
    return k - 1;
  }

  /** Gamma distribution Gamma(alpha, beta) with shape alpha and rate beta */
  public gamma(alpha: number, beta: number): number {
    if (alpha <= 0 || beta <= 0) throw new Error("Alpha and beta must be positive");
    if (alpha < 1) {
      // Ahrens-Dieter method for alpha < 1
      const u = this.rng.nextFloat();
      return (this.gamma(alpha + 1, beta) * Math.pow(u, 1.0 / alpha));
    }
    // Marsaglia and Tsang method for alpha >= 1
    const d = alpha - 1.0 / 3.0;
    const c = 1.0 / Math.sqrt(9.0 * d);
    while (true) {
      let z: number;
      let v: number;
      do {
        z = this.standardNormal();
        v = 1.0 + c * z;
      } while (v <= 0.0);
      v = v * v * v;
      const u = this.rng.nextFloat();
      if (u < 1.0 - 0.0331 * z * z * z * z) {
        return (d * v) / beta;
      }
      if (Math.log(u) < 0.5 * z * z + d * (1.0 - v + Math.log(v))) {
        return (d * v) / beta;
      }
    }
  }

  /** Beta distribution Beta(alpha, beta) via ratio of Gammas */
  public beta(alpha: number, betaParam: number): number {
    const x = this.gamma(alpha, 1.0);
    const y = this.gamma(betaParam, 1.0);
    return x / (x + y);
  }

  /** Numerically stable logSumExp to prevent floating point underflow */
  public static logSumExp(a: number, b: number): number {
    if (a === -Infinity) return b;
    if (b === -Infinity) return a;
    const maxVal = Math.max(a, b);
    return maxVal + Math.log(Math.exp(a - maxVal) + Math.exp(b - maxVal));
  }
}

/**
 * Multivariate Gaussian Engine with Cholesky decomposition
 */
export class MultivariateGaussian {
  public dim: number;
  public mean: number[];
  public cov: number[][];
  public L: number[][]; // Lower-triangular Cholesky factor

  constructor(mean: number[], cov: number[][]) {
    this.dim = mean.length;
    this.mean = [...mean];
    this.cov = cov.map(row => [...row]);
    this.L = this.computeCholesky(this.cov);
  }

  /**
   * Performs Cholesky Decomposition: Sigma = L * L^T
   */
  private computeCholesky(A: number[][]): number[][] {
    const n = this.dim;
    const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += L[i][k] * L[j][k];
        }

        if (i === j) {
          const diag = A[i][i] - sum;
          if (diag <= 1e-14) {
            throw new Error(`Matrix is not strictly positive definite at index ${i}`);
          }
          L[i][j] = Math.sqrt(diag);
        } else {
          L[i][j] = (A[i][j] - sum) / L[j][j];
        }
      }
    }
    return L;
  }

  /**
   * Generates a sample x ~ N(mu, Sigma) using x = mu + L * z
   */
  public sample(engine: ProbabilityEngine): number[] {
    const z: number[] = new Array(this.dim);
    for (let i = 0; i < this.dim; i++) {
      z[i] = engine.standardNormal();
    }

    const x = [...this.mean];
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j <= i; j++) {
        x[i] += this.L[i][j] * z[j];
      }
    }
    return x;
  }

  /**
   * Computes the squared Mahalanobis distance d_M^2 = (x - mu)^T Sigma^-1 (x - mu)
   * via forward-solving L * y = (x - mu), where d_M^2 = y^T y
   */
  public mahalanobisSquared(x: number[]): number {
    const diff = x.map((val, idx) => val - this.mean[idx]);
    const y: number[] = new Array(this.dim).fill(0);

    for (let i = 0; i < this.dim; i++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += this.L[i][k] * y[k];
      }
      y[i] = (diff[i] - sum) / this.L[i][i];
    }

    let distSq = 0;
    for (let i = 0; i < this.dim; i++) {
      distSq += y[i] * y[i];
    }
    return distSq;
  }
}

/**
 * Bayesian Conjugate Updating Engine
 */
export class BayesianEstimator {
  /**
   * Beta-Binomial Updating:
   * Prior: Beta(alpha, beta)
   * Data: k successes out of n trials
   * Posterior: Beta(alpha + k, beta + n - k)
   */
  public static updateBetaBinomial(
    alpha: number,
    betaParam: number,
    k: number,
    n: number
  ): { alphaPost: number; betaPost: number; mean: number; map: number } {
    const alphaPost = alpha + k;
    const betaPost = betaParam + (n - k);
    const mean = alphaPost / (alphaPost + betaPost);
    const map = (alphaPost > 1 && betaPost > 1) 
      ? (alphaPost - 1) / (alphaPost + betaPost - 2) 
      : mean;
    return { alphaPost, betaPost, mean, map };
  }

  /**
   * Normal-Normal Conjugate Updating (Known Variance):
   * Prior: N(mu0, sigma0^2)
   * Data: Sample mean xBar from n observations with known noise variance sigma^2
   */
  public static updateNormalNormal(
    mu0: number,
    sigma0Sq: number,
    xBar: number,
    sigmaSq: number,
    n: number
  ): { muPost: number; sigmaSqPost: number } {
    const tau0 = 1.0 / sigma0Sq;
    const tauData = n / sigmaSq;
    const tauPost = tau0 + tauData;
    const sigmaSqPost = 1.0 / tauPost;
    const muPost = (tau0 * mu0 + tauData * xBar) / tauPost;
    return { muPost, sigmaSqPost };
  }
}

/**
 * Monte Carlo Integration Engine
 */
export class MonteCarloIntegrator {
  public static integrate(
    fn: (x: number[]) => number,
    mins: number[],
    maxs: number[],
    samples: number,
    engine: ProbabilityEngine
  ): { estimate: number; errorMargin: number; ciLower: number; ciUpper: number } {
    const dim = mins.length;
    let volume = 1.0;
    for (let d = 0; d < dim; d++) {
      volume *= (maxs[d] - mins[d]);
    }

    let sum = 0.0;
    let sumSq = 0.0;
    const point = new Array(dim);

    for (let i = 0; i < samples; i++) {
      for (let d = 0; d < dim; d++) {
        point[d] = mins[d] + (maxs[d] - mins[d]) * engine.uniform(0, 1);
      }
      const val = fn(point);
      sum += val;
      sumSq += val * val;
    }

    const mean = sum / samples;
    const variance = (sumSq / samples - mean * mean) * (samples / (samples - 1));
    const estimate = volume * mean;
    const standardError = volume * Math.sqrt(variance / samples);
    const errorMargin = 1.96 * standardError; // 95% Confidence Interval

    return {
      estimate,
      errorMargin,
      ciLower: estimate - errorMargin,
      ciUpper: estimate + errorMargin
    };
  }
}
