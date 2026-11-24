/**
 * kalman-filter-engine.ts
 *
 * Industrial Zero-Dependency Production TypeScript Kalman Filtering Engine
 * Author: Sovereign Master Treatise Standard (SMTS-40K)
 *
 * Capabilities:
 * - High-performance Vector and Matrix linear algebra subsystem
 * - Cholesky factorization (A = L L^T) with positive-definiteness verification
 * - Gauss-Jordan linear system solver and matrix inversion with partial pivoting
 * - ScalarKalmanFilter (1D analytical DARE, exact belief propagation)
 * - LinearKalmanFilter (Multivariable LKF with Joseph stabilized covariance)
 * - ExtendedKalmanFilter (EKF with analytical or central finite-difference Jacobians & angle wrapping)
 * - UnscentedKalmanFilter (UKF with Merwe scaled unscented transform)
 * - RTSSmoother (Rauch-Tung-Striebel fixed-interval backward smoother)
 * - ChiSquareGating (Normalized Innovation Squared statistical fault detection)
 */

// ============================================================================
// 1. LINEAR ALGEBRA SUBSYSTEM: Vector & Matrix
// ============================================================================

export class Vector {
  constructor(public data: number[]) {}

  static zeros(dim: number): Vector {
    return new Vector(new Array(dim).fill(0));
  }

  static from(arr: number[]): Vector {
    return new Vector([...arr]);
  }

  get dim(): number {
    return this.data.length;
  }

  get(i: number): number {
    return this.data[i];
  }

  set(i: number, val: number): void {
    this.data[i] = val;
  }

  add(other: Vector): Vector {
    if (this.dim !== other.dim) {
      throw new Error(`Vector dimension mismatch: ${this.dim} vs ${other.dim}`);
    }
    const res = new Array(this.dim);
    for (let i = 0; i < this.dim; i++) {
      res[i] = this.data[i] + other.data[i];
    }
    return new Vector(res);
  }

  sub(other: Vector): Vector {
    if (this.dim !== other.dim) {
      throw new Error(`Vector dimension mismatch: ${this.dim} vs ${other.dim}`);
    }
    const res = new Array(this.dim);
    for (let i = 0; i < this.dim; i++) {
      res[i] = this.data[i] - other.data[i];
    }
    return new Vector(res);
  }

  scale(s: number): Vector {
    const res = new Array(this.dim);
    for (let i = 0; i < this.dim; i++) {
      res[i] = this.data[i] * s;
    }
    return new Vector(res);
  }

  dot(other: Vector): number {
    if (this.dim !== other.dim) {
      throw new Error(`Vector dimension mismatch: ${this.dim} vs ${other.dim}`);
    }
    let sum = 0;
    for (let i = 0; i < this.dim; i++) {
      sum += this.data[i] * other.data[i];
    }
    return sum;
  }

  normSq(): number {
    return this.dot(this);
  }

  norm(): number {
    return Math.sqrt(this.normSq());
  }

  outer(other: Vector): Matrix {
    const r = this.dim;
    const c = other.dim;
    const mat: number[][] = [];
    for (let i = 0; i < r; i++) {
      mat[i] = new Array(c);
      const vi = this.data[i];
      for (let j = 0; j < c; j++) {
        mat[i][j] = vi * other.data[j];
      }
    }
    return new Matrix(r, c, mat);
  }

  clone(): Vector {
    return new Vector([...this.data]);
  }

  toArray(): number[] {
    return [...this.data];
  }
}

export class Matrix {
  constructor(public rows: number, public cols: number, public data: number[][]) {}

  static zeros(rows: number, cols: number): Matrix {
    const data: number[][] = [];
    for (let i = 0; i < rows; i++) {
      data[i] = new Array(cols).fill(0);
    }
    return new Matrix(rows, cols, data);
  }

  static eye(dim: number): Matrix {
    const data: number[][] = [];
    for (let i = 0; i < dim; i++) {
      data[i] = new Array(dim).fill(0);
      data[i][i] = 1;
    }
    return new Matrix(dim, dim, data);
  }

  static diag(elements: number[]): Matrix {
    const dim = elements.length;
    const data: number[][] = [];
    for (let i = 0; i < dim; i++) {
      data[i] = new Array(dim).fill(0);
      data[i][i] = elements[i];
    }
    return new Matrix(dim, dim, data);
  }

  static from(arr: number[][]): Matrix {
    const rows = arr.length;
    const cols = arr[0].length;
    const data: number[][] = [];
    for (let i = 0; i < rows; i++) {
      data[i] = [...arr[i]];
    }
    return new Matrix(rows, cols, data);
  }

  get(r: number, c: number): number {
    return this.data[r][c];
  }

  set(r: number, c: number, val: number): void {
    this.data[r][c] = val;
  }

  add(other: Matrix): Matrix {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error(`Matrix dimension mismatch in add: (${this.rows}x${this.cols}) vs (${other.rows}x${other.cols})`);
    }
    const out = Matrix.zeros(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        out.data[i][j] = this.data[i][j] + other.data[i][j];
      }
    }
    return out;
  }

  sub(other: Matrix): Matrix {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error(`Matrix dimension mismatch in sub: (${this.rows}x${this.cols}) vs (${other.rows}x${other.cols})`);
    }
    const out = Matrix.zeros(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        out.data[i][j] = this.data[i][j] - other.data[i][j];
      }
    }
    return out;
  }

  scale(s: number): Matrix {
    const out = Matrix.zeros(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        out.data[i][j] = this.data[i][j] * s;
      }
    }
    return out;
  }

  multiply(other: Matrix): Matrix {
    if (this.cols !== other.rows) {
      throw new Error(`Matrix multiply dimension mismatch: (${this.rows}x${this.cols}) * (${other.rows}x${other.cols})`);
    }
    const out = Matrix.zeros(this.rows, other.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let k = 0; k < this.cols; k++) {
        const aik = this.data[i][k];
        if (aik !== 0) {
          for (let j = 0; j < other.cols; j++) {
            out.data[i][j] += aik * other.data[k][j];
          }
        }
      }
    }
    return out;
  }

  multiplyVector(v: Vector): Vector {
    if (this.cols !== v.dim) {
      throw new Error(`Matrix-Vector multiply mismatch: cols=${this.cols} vs v.dim=${v.dim}`);
    }
    const res = new Array(this.rows).fill(0);
    for (let i = 0; i < this.rows; i++) {
      let sum = 0;
      for (let j = 0; j < this.cols; j++) {
        sum += this.data[i][j] * v.data[j];
      }
      res[i] = sum;
    }
    return new Vector(res);
  }

  transpose(): Matrix {
    const out = Matrix.zeros(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        out.data[j][i] = this.data[i][j];
      }
    }
    return out;
  }

  trace(): number {
    if (this.rows !== this.cols) {
      throw new Error("Trace only defined for square matrices");
    }
    let sum = 0;
    for (let i = 0; i < this.rows; i++) {
      sum += this.data[i][i];
    }
    return sum;
  }

  symmetric(): Matrix {
    if (this.rows !== this.cols) {
      throw new Error("Symmetric enforcement requires square matrix");
    }
    const n = this.rows;
    const out = Matrix.zeros(n, n);
    for (let i = 0; i < n; i++) {
      out.data[i][i] = this.data[i][i];
      for (let j = i + 1; j < n; j++) {
        const avg = 0.5 * (this.data[i][j] + this.data[j][i]);
        out.data[i][j] = avg;
        out.data[j][i] = avg;
      }
    }
    return out;
  }

  /**
   * Fast Cholesky decomposition: A = L L^T
   * where L is lower-triangular.
   * Throws Error if matrix is not positive-definite.
   */
  cholesky(): Matrix {
    if (this.rows !== this.cols) {
      throw new Error("Cholesky decomposition requires a square matrix");
    }
    const n = this.rows;
    const L = Matrix.zeros(n, n);

    for (let j = 0; j < n; j++) {
      let d = 0;
      for (let k = 0; k < j; k++) {
        d += L.data[j][k] * L.data[j][k];
      }
      const val = this.data[j][j] - d;
      if (val <= 0 || isNaN(val)) {
        throw new Error(`Matrix is not positive definite at index ${j} (pivot: ${val})`);
      }
      L.data[j][j] = Math.sqrt(val);

      for (let i = j + 1; i < n; i++) {
        let s = 0;
        for (let k = 0; k < j; k++) {
          s += L.data[i][k] * L.data[j][k];
        }
        L.data[i][j] = (this.data[i][j] - s) / L.data[j][j];
      }
    }
    return L;
  }

  /**
   * Determinant via LU decomposition with partial pivoting
   */
  determinant(): number {
    if (this.rows !== this.cols) {
      throw new Error("Determinant requires a square matrix");
    }
    const n = this.rows;
    const A = this.clone().data;
    let det = 1.0;

    for (let i = 0; i < n; i++) {
      let pivotRow = i;
      let maxVal = Math.abs(A[i][i]);
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > maxVal) {
          maxVal = Math.abs(A[k][i]);
          pivotRow = k;
        }
      }

      if (maxVal < 1e-15) {
        return 0;
      }

      if (pivotRow !== i) {
        const tmp = A[i];
        A[i] = A[pivotRow];
        A[pivotRow] = tmp;
        det = -det;
      }

      det *= A[i][i];

      for (let k = i + 1; k < n; k++) {
        const factor = A[k][i] / A[i][i];
        for (let j = i + 1; j < n; j++) {
          A[k][j] -= factor * A[i][j];
        }
      }
    }
    return det;
  }

  /**
   * Solve A x = b via Gauss-Jordan elimination with partial pivoting
   */
  solve(b: Vector): Vector {
    if (this.rows !== this.cols || this.rows !== b.dim) {
      throw new Error(`Solve dimension mismatch: A is (${this.rows}x${this.cols}), b is ${b.dim}`);
    }
    const n = this.rows;
    const M: number[][] = [];
    for (let i = 0; i < n; i++) {
      M[i] = [...this.data[i], b.data[i]];
    }

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      let maxVal = Math.abs(M[i][i]);
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > maxVal) {
          maxVal = Math.abs(M[k][i]);
          maxRow = k;
        }
      }

      if (maxVal < 1e-14) {
        throw new Error("Matrix is singular or ill-conditioned in solve");
      }

      if (maxRow !== i) {
        const tmp = M[i];
        M[i] = M[maxRow];
        M[maxRow] = tmp;
      }

      const pivot = M[i][i];
      for (let j = i; j <= n; j++) {
        M[i][j] /= pivot;
      }

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = M[k][i];
          for (let j = i; j <= n; j++) {
            M[k][j] -= factor * M[i][j];
          }
        }
      }
    }

    const x = new Array(n);
    for (let i = 0; i < n; i++) {
      x[i] = M[i][n];
    }
    return new Vector(x);
  }

  /**
   * Matrix inversion via Gauss-Jordan with partial pivoting
   */
  inverse(): Matrix {
    if (this.rows !== this.cols) {
      throw new Error("Inverse requires a square matrix");
    }
    const n = this.rows;
    const M: number[][] = [];
    for (let i = 0; i < n; i++) {
      M[i] = new Array(2 * n).fill(0);
      for (let j = 0; j < n; j++) {
        M[i][j] = this.data[i][j];
      }
      M[i][n + i] = 1.0;
    }

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      let maxVal = Math.abs(M[i][i]);
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > maxVal) {
          maxVal = Math.abs(M[k][i]);
          maxRow = k;
        }
      }

      if (maxVal < 1e-15) {
        throw new Error("Matrix is singular and cannot be inverted");
      }

      if (maxRow !== i) {
        const tmp = M[i];
        M[i] = M[maxRow];
        M[maxRow] = tmp;
      }

      const pivot = M[i][i];
      for (let j = 0; j < 2 * n; j++) {
        M[i][j] /= pivot;
      }

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = M[k][i];
          for (let j = 0; j < 2 * n; j++) {
            M[k][j] -= factor * M[i][j];
          }
        }
      }
    }

    const inv = Matrix.zeros(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        inv.data[i][j] = M[i][n + j];
      }
    }
    return inv;
  }

  clone(): Matrix {
    const out = Matrix.zeros(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        out.data[i][j] = this.data[i][j];
      }
    }
    return out;
  }

  toArray(): number[][] {
    const out: number[][] = [];
    for (let i = 0; i < this.rows; i++) {
      out[i] = [...this.data[i]];
    }
    return out;
  }
}

// ============================================================================
// 2. SCALAR KALMAN FILTER (1D)
// ============================================================================

export interface ScalarKFResult {
  xPrior: number;
  pPrior: number;
  xPost: number;
  pPost: number;
  innovation: number;
  innovationVar: number;
  gain: number;
}

export class ScalarKalmanFilter {
  constructor(
    public state: number,
    public variance: number,
    public a: number,
    public b: number,
    public c: number,
    public q: number,
    public r: number
  ) {}

  predict(u: number = 0): { xPrior: number; pPrior: number } {
    const xPrior = this.a * this.state + this.b * u;
    const pPrior = this.a * this.a * this.variance + this.q;
    this.state = xPrior;
    this.variance = pPrior;
    return { xPrior, pPrior };
  }

  update(z: number): ScalarKFResult {
    const xPrior = this.state;
    const pPrior = this.variance;
    const innovation = z - this.c * xPrior;
    const innovationVar = this.c * this.c * pPrior + this.r;
    const gain = (this.c * pPrior) / innovationVar;
    const xPost = xPrior + gain * innovation;
    const pPost = (1.0 - gain * this.c) * pPrior;

    this.state = xPost;
    this.variance = pPost;

    return {
      xPrior,
      pPrior,
      xPost,
      pPost,
      innovation,
      innovationVar,
      gain,
    };
  }

  /**
   * Computes the exact steady-state prior variance p_inf by solving the scalar DARE:
   * c^2 p^2 + [(1 - a^2) r - c^2 q] p - q r = 0
   */
  computeSteadyStateVariance(): number {
    const A = this.c * this.c;
    const B = (1.0 - this.a * this.a) * this.r - this.c * this.c * this.q;
    const C = -this.q * this.r;

    const disc = B * B - 4.0 * A * C;
    if (disc < 0) {
      throw new Error("Negative discriminant in scalar DARE solution");
    }
    const pInf = (-B + Math.sqrt(disc)) / (2.0 * A);
    return pInf;
  }

  computeSteadyStateGain(): number {
    const pInf = this.computeSteadyStateVariance();
    return (this.c * pInf) / (this.c * this.c * pInf + this.r);
  }
}

// ============================================================================
// 3. LINEAR MULTIVARIABLE KALMAN FILTER (with Joseph Form)
// ============================================================================

export interface LinearKFResult {
  xPrior: Vector;
  pPrior: Matrix;
  xPost: Vector;
  pPost: Matrix;
  y: Vector;
  S: Matrix;
  K: Matrix;
}

export class LinearKalmanFilter {
  constructor(
    public state: Vector,
    public covariance: Matrix,
    public F: Matrix,
    public B: Matrix | null,
    public H: Matrix,
    public Q: Matrix,
    public R: Matrix
  ) {
    this.covariance = this.covariance.symmetric();
  }

  predict(u?: Vector): { xPrior: Vector; pPrior: Matrix } {
    let xPred = this.F.multiplyVector(this.state);
    if (this.B && u) {
      xPred = xPred.add(this.B.multiplyVector(u));
    }
    const pPred = this.F.multiply(this.covariance).multiply(this.F.transpose()).add(this.Q).symmetric();

    this.state = xPred;
    this.covariance = pPred;

    return { xPrior: xPred, pPrior: pPred };
  }

  update(z: Vector): LinearKFResult {
    const xPrior = this.state.clone();
    const pPrior = this.covariance.clone();

    // 1. Innovation residual: y = z - H * xPrior
    const zPred = this.H.multiplyVector(xPrior);
    const y = z.sub(zPred);

    // 2. Innovation covariance: S = H * P * H^T + R
    const S = this.H.multiply(pPrior).multiply(this.H.transpose()).add(this.R).symmetric();

    // 3. Optimal Kalman Gain: K = P * H^T * S^-1
    const Sinv = S.inverse().symmetric();
    const K = pPrior.multiply(this.H.transpose()).multiply(Sinv);

    // 4. State update: xPost = xPrior + K * y
    const xPost = xPrior.add(K.multiplyVector(y));

    // 5. Joseph Stabilized Covariance Update:
    // PPost = (I - K H) * P * (I - K H)^T + K * R * K^T
    const I = Matrix.eye(this.state.dim);
    const M = I.sub(K.multiply(this.H));
    const term1 = M.multiply(pPrior).multiply(M.transpose());
    const term2 = K.multiply(this.R).multiply(K.transpose());
    const pPost = term1.add(term2).symmetric();

    this.state = xPost;
    this.covariance = pPost;

    return {
      xPrior,
      pPrior,
      xPost,
      pPost,
      y,
      S,
      K,
    };
  }
}

// ============================================================================
// 4. EXTENDED KALMAN FILTER (EKF)
// ============================================================================

export interface EKFConfig {
  f: (x: Vector, u?: Vector) => Vector;
  h: (x: Vector) => Vector;
  F_jacobian?: (x: Vector, u?: Vector) => Matrix;
  H_jacobian?: (x: Vector) => Matrix;
  Q: Matrix;
  R: Matrix;
}

export class ExtendedKalmanFilter {
  constructor(public state: Vector, public covariance: Matrix, public config: EKFConfig) {
    this.covariance = this.covariance.symmetric();
  }

  /**
   * Central difference numerical Jacobian approximation
   */
  static computeNumericalJacobian(
    func: (x: Vector) => Vector,
    x: Vector,
    outDim: number,
    eps: number = 1e-6
  ): Matrix {
    const n = x.dim;
    const J = Matrix.zeros(outDim, n);

    for (let j = 0; j < n; j++) {
      const xPlus = x.clone();
      const xMinus = x.clone();
      xPlus.set(j, x.get(j) + eps);
      xMinus.set(j, x.get(j) - eps);

      const fPlus = func(xPlus);
      const fMinus = func(xMinus);

      for (let i = 0; i < outDim; i++) {
        J.set(i, j, (fPlus.get(i) - fMinus.get(i)) / (2.0 * eps));
      }
    }
    return J;
  }

  predict(u?: Vector): { xPrior: Vector; pPrior: Matrix } {
    // 1. Nonlinearly propagate mean: xPrior = f(x, u)
    const xPrior = this.config.f(this.state, u);

    // 2. Evaluate State Jacobian F_k
    let F: Matrix;
    if (this.config.F_jacobian) {
      F = this.config.F_jacobian(this.state, u);
    } else {
      F = ExtendedKalmanFilter.computeNumericalJacobian(
        (x) => this.config.f(x, u),
        this.state,
        this.state.dim
      );
    }

    // 3. Propagate covariance: PPrior = F * P * F^T + Q
    const pPrior = F.multiply(this.covariance).multiply(F.transpose()).add(this.config.Q).symmetric();

    this.state = xPrior;
    this.covariance = pPrior;

    return { xPrior, pPrior };
  }

  update(z: Vector, angleWrapIndices?: number[]): LinearKFResult {
    const xPrior = this.state.clone();
    const pPrior = this.covariance.clone();

    // 1. Nonlinear observation: zPred = h(xPrior)
    const zPred = this.config.h(xPrior);

    // 2. Innovation residual
    const yArr = new Array(z.dim);
    for (let i = 0; i < z.dim; i++) {
      let diff = z.get(i) - zPred.get(i);
      // Angle wrap to [-pi, pi] if specified
      if (angleWrapIndices && angleWrapIndices.includes(i)) {
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      }
      yArr[i] = diff;
    }
    const y = new Vector(yArr);

    // 3. Evaluate Measurement Jacobian H_k
    let H: Matrix;
    if (this.config.H_jacobian) {
      H = this.config.H_jacobian(xPrior);
    } else {
      H = ExtendedKalmanFilter.computeNumericalJacobian(
        this.config.h,
        xPrior,
        z.dim
      );
    }

    // 4. Innovation covariance: S = H * P * H^T + R
    const S = H.multiply(pPrior).multiply(H.transpose()).add(this.config.R).symmetric();

    // 5. Kalman gain: K = P * H^T * S^-1
    const Sinv = S.inverse().symmetric();
    const K = pPrior.multiply(H.transpose()).multiply(Sinv);

    // 6. State update: xPost = xPrior + K * y
    let xPost = xPrior.add(K.multiplyVector(y));

    // 7. Joseph form covariance update
    const I = Matrix.eye(this.state.dim);
    const M = I.sub(K.multiply(H));
    const term1 = M.multiply(pPrior).multiply(M.transpose());
    const term2 = K.multiply(this.config.R).multiply(K.transpose());
    const pPost = term1.add(term2).symmetric();

    this.state = xPost;
    this.covariance = pPost;

    return {
      xPrior,
      pPrior,
      xPost,
      pPost,
      y,
      S,
      K,
    };
  }
}

// ============================================================================
// 5. UNSCENTED KALMAN FILTER (UKF) - Merwe Scaled Unscented Transform
// ============================================================================

export interface UKFConfig {
  f: (x: Vector, u?: Vector) => Vector;
  h: (x: Vector) => Vector;
  Q: Matrix;
  R: Matrix;
  alpha?: number; // Spread parameter, default 1e-3 or 1.0
  beta?: number;  // Prior distribution tuning, default 2.0 (optimal for Gaussians)
  kappa?: number; // Secondary scaling parameter, default 0
}

export class UnscentedKalmanFilter {
  public alpha: number;
  public beta: number;
  public kappa: number;

  constructor(public state: Vector, public covariance: Matrix, public config: UKFConfig) {
    this.covariance = this.covariance.symmetric();
    this.alpha = config.alpha ?? 1e-3;
    this.beta = config.beta ?? 2.0;
    this.kappa = config.kappa ?? 0.0;
  }

  /**
   * Deterministic Sigma-Point Generation: 2n + 1 points
   */
  generateSigmaPoints(mean: Vector, cov: Matrix): { points: Vector[]; Wm: number[]; Wc: number[] } {
    const n = mean.dim;
    const lambda = this.alpha * this.alpha * (n + this.kappa) - n;
    const gamma = Math.sqrt(n + lambda);

    const scaledCov = cov.scale(n + lambda).symmetric();
    const L = scaledCov.cholesky(); // Lower triangular Cholesky factor

    const points: Vector[] = [];
    const Wm: number[] = new Array(2 * n + 1);
    const Wc: number[] = new Array(2 * n + 1);

    // Central point
    points[0] = mean.clone();
    Wm[0] = lambda / (n + lambda);
    Wc[0] = lambda / (n + lambda) + (1.0 - this.alpha * this.alpha + this.beta);

    const wOther = 1.0 / (2.0 * (n + lambda));

    for (let i = 0; i < n; i++) {
      // Column i of L
      const colL = new Array(n);
      for (let r = 0; r < n; r++) {
        colL[r] = L.get(r, i);
      }
      const vecL = new Vector(colL);

      points[1 + i] = mean.add(vecL);
      Wm[1 + i] = wOther;
      Wc[1 + i] = wOther;

      points[1 + n + i] = mean.sub(vecL);
      Wm[1 + n + i] = wOther;
      Wc[1 + n + i] = wOther;
    }

    return { points, Wm, Wc };
  }

  predict(u?: Vector): { xPrior: Vector; pPrior: Matrix } {
    const n = this.state.dim;
    const { points, Wm, Wc } = this.generateSigmaPoints(this.state, this.covariance);

    // 1. Propagate each sigma point through nonlinear dynamics
    const propPoints: Vector[] = [];
    for (let i = 0; i < points.length; i++) {
      propPoints[i] = this.config.f(points[i], u);
    }

    // 2. Recombine mean
    let xPrior = Vector.zeros(n);
    for (let i = 0; i < points.length; i++) {
      xPrior = xPrior.add(propPoints[i].scale(Wm[i]));
    }

    // 3. Recombine covariance
    let pPrior = Matrix.zeros(n, n);
    for (let i = 0; i < points.length; i++) {
      const diff = propPoints[i].sub(xPrior);
      const outer = diff.outer(diff).scale(Wc[i]);
      pPrior = pPrior.add(outer);
    }
    pPrior = pPrior.add(this.config.Q).symmetric();

    this.state = xPrior;
    this.covariance = pPrior;

    return { xPrior, pPrior };
  }

  update(z: Vector): LinearKFResult {
    const xPrior = this.state.clone();
    const pPrior = this.covariance.clone();
    const n = xPrior.dim;
    const m = z.dim;

    // 1. Generate sigma points from prior
    const { points, Wm, Wc } = this.generateSigmaPoints(xPrior, pPrior);

    // 2. Propagate through nonlinear measurement function
    const zPoints: Vector[] = [];
    for (let i = 0; i < points.length; i++) {
      zPoints[i] = this.config.h(points[i]);
    }

    // 3. Predicted measurement mean
    let zPred = Vector.zeros(m);
    for (let i = 0; i < points.length; i++) {
      zPred = zPred.add(zPoints[i].scale(Wm[i]));
    }

    // 4. Innovation covariance S and Cross-covariance Pxz
    let S = Matrix.zeros(m, m);
    let Pxz = Matrix.zeros(n, m);

    for (let i = 0; i < points.length; i++) {
      const zDiff = zPoints[i].sub(zPred);
      const xDiff = points[i].sub(xPrior);

      S = S.add(zDiff.outer(zDiff).scale(Wc[i]));
      Pxz = Pxz.add(xDiff.outer(zDiff).scale(Wc[i]));
    }
    S = S.add(this.config.R).symmetric();

    // 5. Kalman gain: K = Pxz * S^-1
    const Sinv = S.inverse().symmetric();
    const K = Pxz.multiply(Sinv);

    // 6. Innovation residual
    const y = z.sub(zPred);

    // 7. Posterior state and covariance update
    const xPost = xPrior.add(K.multiplyVector(y));
    const pPost = pPrior.sub(K.multiply(S).multiply(K.transpose())).symmetric();

    this.state = xPost;
    this.covariance = pPost;

    return {
      xPrior,
      pPrior,
      xPost,
      pPost,
      y,
      S,
      K,
    };
  }
}

// ============================================================================
// 6. RAUCH-TUNG-STRIEBEL (RTS) BACKWARD SMOOTHER
// ============================================================================

export interface ForwardTrajectoryEntry {
  xPrior: Vector;
  pPrior: Matrix;
  xPost: Vector;
  pPost: Matrix;
  F: Matrix;
}

export interface SmoothedTrajectoryEntry {
  xSmooth: Vector;
  pSmooth: Matrix;
  smootherGain: Matrix;
}

export class RTSSmoother {
  /**
   * Optimal fixed-interval backward smoothing pass
   */
  static smooth(trajectory: ForwardTrajectoryEntry[]): SmoothedTrajectoryEntry[] {
    const N = trajectory.length;
    if (N === 0) return [];

    const smoothed: SmoothedTrajectoryEntry[] = new Array(N);

    // Final boundary condition at step N-1
    smoothed[N - 1] = {
      xSmooth: trajectory[N - 1].xPost.clone(),
      pSmooth: trajectory[N - 1].pPost.clone().symmetric(),
      smootherGain: Matrix.zeros(trajectory[N - 1].xPost.dim, trajectory[N - 1].xPost.dim),
    };

    // Backward pass from N-2 down to 0
    for (let k = N - 2; k >= 0; k--) {
      const current = trajectory[k];
      const nextPrior = trajectory[k + 1].pPrior;
      const nextPriorInv = nextPrior.inverse().symmetric();

      // Smoother gain: C_k = P_{k|k} * F_{k+1}^T * P_{k+1|k}^-1
      const Ck = current.pPost.multiply(trajectory[k + 1].F.transpose()).multiply(nextPriorInv);

      // State smoothing: x_{k|N} = x_{k|k} + C_k * (x_{k+1|N} - x_{k+1|k})
      const xDiff = smoothed[k + 1].xSmooth.sub(trajectory[k + 1].xPrior);
      const xSmooth = current.xPost.add(Ck.multiplyVector(xDiff));

      // Covariance smoothing: P_{k|N} = P_{k|k} + C_k * (P_{k+1|N} - P_{k+1|k}) * C_k^T
      const pDiff = smoothed[k + 1].pSmooth.sub(trajectory[k + 1].pPrior);
      const pSmooth = current.pPost.add(Ck.multiply(pDiff).multiply(Ck.transpose())).symmetric();

      smoothed[k] = {
        xSmooth,
        pSmooth,
        smootherGain: Ck,
      };
    }

    return smoothed;
  }
}

// ============================================================================
// 7. CHI-SQUARE STATISTICAL FAULT GATING (NIS)
// ============================================================================

export class ChiSquareGating {
  /**
   * Exact critical quantiles for Chi-Square distribution with dof = 1..6
   * Table: [dof][alpha]
   */
  private static readonly CHI2_TABLE: Record<number, Record<number, number>> = {
    1: { 0.05: 3.841, 0.01: 6.635, 0.001: 10.828 },
    2: { 0.05: 5.991, 0.01: 9.210, 0.001: 13.816 },
    3: { 0.05: 7.815, 0.01: 11.345, 0.001: 16.266 },
    4: { 0.05: 9.488, 0.01: 13.277, 0.001: 18.467 },
    5: { 0.05: 11.07, 0.01: 15.086, 0.001: 20.515 },
    6: { 0.05: 12.592, 0.01: 16.812, 0.001: 22.458 },
  };

  /**
   * Computes the Normalized Innovation Squared (NIS):
   * d_M^2 = y^T * S^-1 * y
   */
  static computeNIS(y: Vector, S: Matrix): number {
    const Sinv = S.inverse();
    const Sinv_y = Sinv.multiplyVector(y);
    return y.dot(Sinv_y);
  }

  static getThreshold(dof: number, alpha: number = 0.01): number {
    const dofTable = this.CHI2_TABLE[dof];
    if (dofTable && dofTable[alpha]) {
      return dofTable[alpha];
    }
    // Wilson-Hilferty transformation approximation for arbitrary dof & alpha
    // Default fallback: 3-sigma equivalent
    return dof + 3.0 * Math.sqrt(2.0 * dof);
  }

  /**
   * Evaluates hypothesis test: returns true if measurement is an outlier (reject)
   */
  static test(
    y: Vector,
    S: Matrix,
    alpha: number = 0.01
  ): { nis: number; threshold: number; isOutlier: boolean } {
    const nis = this.computeNIS(y, S);
    const threshold = this.getThreshold(y.dim, alpha);
    return {
      nis,
      threshold,
      isOutlier: nis > threshold,
    };
  }
}
