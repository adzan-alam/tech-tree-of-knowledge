/**
 * Robotics Kinematics Engine (phys-robotics-inverse-kinematics)
 * 
 * Production-grade, zero-dependency computational kinematics engine implementing:
 * - Spatial group SE(3), SO(3) unit quaternions, twist coordinates, and Lie algebra
 * - Standard and Modified Denavit-Hartenberg (DH) parameter parsing & Product of Exponentials (PoE)
 * - Geometric Jacobian computation via spatial cross products and recursive frames
 * - Singular Value Decomposition (SVD), Yoshikawa manipulability, and condition number
 * - Damped Least-Squares (DLS) with Nakamura-Hanafusa adaptive damping
 * - Nullspace projection for redundancy resolution (joint limit avoidance, manipulability maximization)
 * - Analytical Pieper decoupling for 6-DoF spherical wrist manipulators
 * - Numerical IK: Newton-Raphson, Jacobian Transpose, DLS, and CLIK drift compensation
 * - Heuristic IK: Cyclic Coordinate Descent (CCD) and FABRIK (Forward And Backward Reaching IK)
 * - Trajectory generation: C^2 quintic polynomials and SO(3) quaternion Slerp
 * 
 * Author: Antigravity Sovereign Master Suite
 * Standards: SMTS-40K / Strict Verification Standard
 */

// ============================================================================
// 1. Vector3D: 3D Euclidean Vector Arithmetic
// ============================================================================

export class Vector3D {
  constructor(
    public readonly x: number = 0,
    public readonly y: number = 0,
    public readonly z: number = 0
  ) {}

  add(v: Vector3D): Vector3D {
    return new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v: Vector3D): Vector3D {
    return new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(s: number): Vector3D {
    return new Vector3D(this.x * s, this.y * s, this.z * s);
  }

  dot(v: Vector3D): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3D): Vector3D {
    return new Vector3D(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  normSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  norm(): number {
    return Math.sqrt(this.normSq());
  }

  normalize(): Vector3D {
    const n = this.norm();
    if (n < 1e-12) return new Vector3D(0, 0, 0);
    return this.scale(1.0 / n);
  }

  distanceTo(v: Vector3D): number {
    return this.subtract(v).norm();
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  static fromArray(arr: number[]): Vector3D {
    return new Vector3D(arr[0] ?? 0, arr[1] ?? 0, arr[2] ?? 0);
  }

  static zero(): Vector3D {
    return new Vector3D(0, 0, 0);
  }
}

// ============================================================================
// 2. Vector6D: Spatial Twist & Wrench Representation [vx, vy, vz, wx, wy, wz]^T
// ============================================================================

export class Vector6D {
  constructor(
    public readonly v1: number = 0,
    public readonly v2: number = 0,
    public readonly v3: number = 0,
    public readonly w1: number = 0,
    public readonly w2: number = 0,
    public readonly w3: number = 0
  ) {}

  get linear(): Vector3D {
    return new Vector3D(this.v1, this.v2, this.v3);
  }

  get angular(): Vector3D {
    return new Vector3D(this.w1, this.w2, this.w3);
  }

  add(v: Vector6D): Vector6D {
    return new Vector6D(
      this.v1 + v.v1, this.v2 + v.v2, this.v3 + v.v3,
      this.w1 + v.w1, this.w2 + v.w2, this.w3 + v.w3
    );
  }

  scale(s: number): Vector6D {
    return new Vector6D(
      this.v1 * s, this.v2 * s, this.v3 * s,
      this.w1 * s, this.w2 * s, this.w3 * s
    );
  }

  norm(): number {
    return Math.sqrt(
      this.v1 * this.v1 + this.v2 * this.v2 + this.v3 * this.v3 +
      this.w1 * this.w1 + this.w2 * this.w2 + this.w3 * this.w3
    );
  }

  toArray(): number[] {
    return [this.v1, this.v2, this.v3, this.w1, this.w2, this.w3];
  }

  static fromParts(linear: Vector3D, angular: Vector3D): Vector6D {
    return new Vector6D(linear.x, linear.y, linear.z, angular.x, angular.y, angular.z);
  }

  static fromArray(arr: number[]): Vector6D {
    return new Vector6D(arr[0] ?? 0, arr[1] ?? 0, arr[2] ?? 0, arr[3] ?? 0, arr[4] ?? 0, arr[5] ?? 0);
  }

  static zero(): Vector6D {
    return new Vector6D(0, 0, 0, 0, 0, 0);
  }
}

// ============================================================================
// 3. Quaternion: Unit Quaternion for SO(3) Rotations and Slerp
// ============================================================================

export class Quaternion {
  constructor(
    public readonly w: number = 1,
    public readonly x: number = 0,
    public readonly y: number = 0,
    public readonly z: number = 0
  ) {}

  norm(): number {
    return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Quaternion {
    const n = this.norm();
    if (n < 1e-12) return new Quaternion(1, 0, 0, 0);
    return new Quaternion(this.w / n, this.x / n, this.y / n, this.z / n);
  }

  conjugate(): Quaternion {
    return new Quaternion(this.w, -this.x, -this.y, -this.z);
  }

  multiply(q: Quaternion): Quaternion {
    return new Quaternion(
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
    );
  }

  dot(q: Quaternion): number {
    return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
  }

  get vector(): Vector3D {
    return new Vector3D(this.x, this.y, this.z);
  }

  toAxisAngle(): { axis: Vector3D; angle: number } {
    const q = this.normalize();
    const angle = 2.0 * Math.acos(Math.max(-1.0, Math.min(1.0, q.w)));
    const s = Math.sqrt(Math.max(0, 1.0 - q.w * q.w));
    if (s < 1e-8) {
      return { axis: new Vector3D(1, 0, 0), angle: 0 };
    }
    return { axis: new Vector3D(q.x / s, q.y / s, q.z / s), angle };
  }

  toRotationMatrix(): number[][] {
    const q = this.normalize();
    const w = q.w, x = q.x, y = q.y, z = q.z;
    return [
      [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
      [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
      [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]
    ];
  }

  static fromAxisAngle(axis: Vector3D, angle: number): Quaternion {
    const halfAngle = angle * 0.5;
    const normAxis = axis.normalize();
    const sinHalf = Math.sin(halfAngle);
    return new Quaternion(
      Math.cos(halfAngle),
      normAxis.x * sinHalf,
      normAxis.y * sinHalf,
      normAxis.z * sinHalf
    ).normalize();
  }

  static fromRotationMatrix(R: number[][]): Quaternion {
    const tr = R[0][0] + R[1][1] + R[2][2];
    let w: number, x: number, y: number, z: number;

    if (tr > 0) {
      const s = Math.sqrt(tr + 1.0) * 2.0; // s = 4 * w
      w = 0.25 * s;
      x = (R[2][1] - R[1][2]) / s;
      y = (R[0][2] - R[2][0]) / s;
      z = (R[1][0] - R[0][1]) / s;
    } else if ((R[0][0] > R[1][1]) && (R[0][0] > R[2][2])) {
      const s = Math.sqrt(1.0 + R[0][0] - R[1][1] - R[2][2]) * 2.0; // s = 4 * x
      w = (R[2][1] - R[1][2]) / s;
      x = 0.25 * s;
      y = (R[0][1] + R[1][0]) / s;
      z = (R[0][2] + R[2][0]) / s;
    } else if (R[1][1] > R[2][2]) {
      const s = Math.sqrt(1.0 + R[1][1] - R[0][0] - R[2][2]) * 2.0; // s = 4 * y
      w = (R[0][2] - R[2][0]) / s;
      x = (R[0][1] + R[1][0]) / s;
      y = 0.25 * s;
      z = (R[1][2] + R[2][1]) / s;
    } else {
      const s = Math.sqrt(1.0 + R[2][2] - R[0][0] - R[1][1]) * 2.0; // s = 4 * z
      w = (R[1][0] - R[0][1]) / s;
      x = (R[0][2] + R[2][0]) / s;
      y = (R[1][2] + R[2][1]) / s;
      z = 0.25 * s;
    }
    return new Quaternion(w, x, y, z).normalize();
  }

  static slerp(q0: Quaternion, q1: Quaternion, t: number): Quaternion {
    let cosOmega = q0.dot(q1);
    let targetQ = q1;

    // Shortest path check: antipodal flip
    if (cosOmega < 0) {
      targetQ = new Quaternion(-q1.w, -q1.x, -q1.y, -q1.z);
      cosOmega = -cosOmega;
    }

    if (cosOmega > 0.9995) {
      // Linear interpolation to prevent 0/0
      return new Quaternion(
        (1 - t) * q0.w + t * targetQ.w,
        (1 - t) * q0.x + t * targetQ.x,
        (1 - t) * q0.y + t * targetQ.y,
        (1 - t) * q0.z + t * targetQ.z
      ).normalize();
    }

    const omega = Math.acos(Math.min(1.0, Math.max(-1.0, cosOmega)));
    const sinOmega = Math.sin(omega);
    const w0 = Math.sin((1.0 - t) * omega) / sinOmega;
    const w1 = Math.sin(t * omega) / sinOmega;

    return new Quaternion(
      w0 * q0.w + w1 * targetQ.w,
      w0 * q0.x + w1 * targetQ.x,
      w0 * q0.y + w1 * targetQ.y,
      w0 * q0.z + w1 * targetQ.z
    ).normalize();
  }

  static identity(): Quaternion {
    return new Quaternion(1, 0, 0, 0);
  }
}

// ============================================================================
// 4. Matrix4x4: SE(3) Homogeneous Transformation Matrix
// ============================================================================

export class Matrix4x4 {
  public readonly data: number[][];

  constructor(elements?: number[][]) {
    if (elements && elements.length === 4 && elements[0].length === 4) {
      this.data = elements.map(row => [...row]);
    } else {
      this.data = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ];
    }
  }

  get translation(): Vector3D {
    return new Vector3D(this.data[0][3], this.data[1][3], this.data[2][3]);
  }

  get rotationMatrix(): number[][] {
    return [
      [this.data[0][0], this.data[0][1], this.data[0][2]],
      [this.data[1][0], this.data[1][1], this.data[1][2]],
      [this.data[2][0], this.data[2][1], this.data[2][2]]
    ];
  }

  get rotationQuaternion(): Quaternion {
    return Quaternion.fromRotationMatrix(this.rotationMatrix);
  }

  get zAxis(): Vector3D {
    return new Vector3D(this.data[0][2], this.data[1][2], this.data[2][2]);
  }

  get xAxis(): Vector3D {
    return new Vector3D(this.data[0][0], this.data[1][0], this.data[2][0]);
  }

  get yAxis(): Vector3D {
    return new Vector3D(this.data[0][1], this.data[1][1], this.data[2][1]);
  }

  multiply(b: Matrix4x4): Matrix4x4 {
    const result = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this.data[i][k] * b.data[k][j];
        }
        result[i][j] = sum;
      }
    }
    return new Matrix4x4(result);
  }

  transformPoint(p: Vector3D): Vector3D {
    const x = this.data[0][0] * p.x + this.data[0][1] * p.y + this.data[0][2] * p.z + this.data[0][3];
    const y = this.data[1][0] * p.x + this.data[1][1] * p.y + this.data[1][2] * p.z + this.data[1][3];
    const z = this.data[2][0] * p.x + this.data[2][1] * p.y + this.data[2][2] * p.z + this.data[2][3];
    return new Vector3D(x, y, z);
  }

  transformVector(v: Vector3D): Vector3D {
    const x = this.data[0][0] * v.x + this.data[0][1] * v.y + this.data[0][2] * v.z;
    const y = this.data[1][0] * v.x + this.data[1][1] * v.y + this.data[1][2] * v.z;
    const z = this.data[2][0] * v.x + this.data[2][1] * v.y + this.data[2][2] * v.z;
    return new Vector3D(x, y, z);
  }

  /**
   * Fast SE(3) inversion: [R, p; 0, 1]^-1 = [R^T, -R^T * p; 0, 1]
   */
  inverse(): Matrix4x4 {
    const R = this.rotationMatrix;
    const p = this.translation;

    // Transpose rotation
    const Rt = [
      [R[0][0], R[1][0], R[2][0]],
      [R[0][1], R[1][1], R[2][1]],
      [R[0][2], R[1][2], R[2][2]]
    ];

    // Compute -Rt * p
    const invPx = -(Rt[0][0] * p.x + Rt[0][1] * p.y + Rt[0][2] * p.z);
    const invPy = -(Rt[1][0] * p.x + Rt[1][1] * p.y + Rt[1][2] * p.z);
    const invPz = -(Rt[2][0] * p.x + Rt[2][1] * p.y + Rt[2][2] * p.z);

    return new Matrix4x4([
      [Rt[0][0], Rt[0][1], Rt[0][2], invPx],
      [Rt[1][0], Rt[1][1], Rt[1][2], invPy],
      [Rt[2][0], Rt[2][1], Rt[2][2], invPz],
      [0, 0, 0, 1]
    ]);
  }

  /**
   * 6x6 Adjoint representation of SE(3):
   * [Ad_T] = [ R,       0 ]
   *          [ [p]x R,  R ]
   */
  adjoint(): number[][] {
    const R = this.rotationMatrix;
    const px = this.data[0][3];
    const py = this.data[1][3];
    const pz = this.data[2][3];

    // [p]x matrix
    // [  0 -pz  py ]
    // [ pz   0 -px ]
    // [-py  px   0 ]
    const pxR = [
      [ -pz * R[1][0] + py * R[2][0],  -pz * R[1][1] + py * R[2][1],  -pz * R[1][2] + py * R[2][2] ],
      [  pz * R[0][0] - px * R[2][0],   pz * R[0][1] - px * R[2][1],   pz * R[0][2] - px * R[2][2] ],
      [ -py * R[0][0] + px * R[1][0],  -py * R[0][1] + px * R[1][1],  -py * R[0][2] + px * R[1][2] ]
    ];

    const Ad: number[][] = Array.from({ length: 6 }, () => Array(6).fill(0));
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        Ad[i][j] = R[i][j];
        Ad[i + 3][j] = pxR[i][j];
        Ad[i + 3][j + 3] = R[i][j];
      }
    }
    return Ad;
  }

  static identity(): Matrix4x4 {
    return new Matrix4x4();
  }

  static fromTranslation(t: Vector3D): Matrix4x4 {
    return new Matrix4x4([
      [1, 0, 0, t.x],
      [0, 1, 0, t.y],
      [0, 0, 1, t.z],
      [0, 0, 0, 1]
    ]);
  }

  static fromTranslationRotation(p: Vector3D, R: number[][]): Matrix4x4 {
    return new Matrix4x4([
      [R[0][0], R[0][1], R[0][2], p.x],
      [R[1][0], R[1][1], R[1][2], p.y],
      [R[2][0], R[2][1], R[2][2], p.z],
      [0, 0, 0, 1]
    ]);
  }

  static fromTranslationQuaternion(p: Vector3D, q: Quaternion): Matrix4x4 {
    return Matrix4x4.fromTranslationRotation(p, q.toRotationMatrix());
  }

  static rotX(rad: number): Matrix4x4 {
    const c = Math.cos(rad), s = Math.sin(rad);
    return new Matrix4x4([
      [1, 0, 0, 0],
      [0, c, -s, 0],
      [0, s, c, 0],
      [0, 0, 0, 1]
    ]);
  }

  static rotY(rad: number): Matrix4x4 {
    const c = Math.cos(rad), s = Math.sin(rad);
    return new Matrix4x4([
      [c, 0, s, 0],
      [0, 1, 0, 0],
      [-s, 0, c, 0],
      [0, 0, 0, 1]
    ]);
  }

  static rotZ(rad: number): Matrix4x4 {
    const c = Math.cos(rad), s = Math.sin(rad);
    return new Matrix4x4([
      [c, -s, 0, 0],
      [s, c, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]);
  }
}

// ============================================================================
// 5. Denavit-Hartenberg Parameters & Conventions
// ============================================================================

export enum DHConvention {
  STANDARD = 'STANDARD',   // Rot_z(theta) * Trans_z(d) * Trans_x(a) * Rot_x(alpha)
  MODIFIED = 'MODIFIED'    // Rot_x(alpha_{i-1}) * Trans_x(a_{i-1}) * Rot_z(theta_i) * Trans_z(d_i)
}

export interface DHJoint {
  a: number;          // link length
  alpha: number;      // link twist
  d: number;          // link offset
  theta: number;      // joint angle
  isRevolute: boolean;
  minLimit?: number;  // joint limit min
  maxLimit?: number;  // joint limit max
}

export class DHParameter {
  constructor(
    public readonly a: number,
    public readonly alpha: number,
    public readonly d: number,
    public readonly theta: number,
    public readonly isRevolute: boolean = true,
    public readonly minLimit: number = -Math.PI,
    public readonly maxLimit: number = Math.PI
  ) {}

  /**
   * Computes transformation matrix A_i(q)
   */
  toMatrix(q: number, convention: DHConvention = DHConvention.STANDARD): Matrix4x4 {
    const th = this.isRevolute ? this.theta + q : this.theta;
    const di = this.isRevolute ? this.d : this.d + q;
    const ai = this.a;
    const al = this.alpha;

    const ct = Math.cos(th), st = Math.sin(th);
    const ca = Math.cos(al), sa = Math.sin(al);

    if (convention === DHConvention.STANDARD) {
      return new Matrix4x4([
        [ct, -st * ca,  st * sa, ai * ct],
        [st,  ct * ca, -ct * sa, ai * st],
        [ 0,       sa,       ca,      di],
        [ 0,        0,        0,       1]
      ]);
    } else {
      // Modified Craig DH: Rot_x(alpha) * Trans_x(a) * Rot_z(theta) * Trans_z(d)
      return new Matrix4x4([
        [      ct,      -st,       0,        ai],
        [ st * ca,  ct * ca,     -sa,  -di * sa],
        [ st * sa,  ct * sa,      ca,   di * ca],
        [       0,        0,       0,         1]
      ]);
    }
  }
}

// ============================================================================
// 6. Matrix & Linear Algebra Helpers
// ============================================================================

export class MatrixMath {
  static transpose(A: number[][]): number[][] {
    const m = A.length;
    const n = A[0].length;
    const At = Array.from({ length: n }, () => Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        At[j][i] = A[i][j];
      }
    }
    return At;
  }

  static multiply(A: number[][], B: number[][]): number[][] {
    const m = A.length;
    const kDim = A[0].length;
    const n = B[0].length;
    const C = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < kDim; k++) {
          sum += A[i][k] * B[k][j];
        }
        C[i][j] = sum;
      }
    }
    return C;
  }

  static multiplyVector(A: number[][], v: number[]): number[] {
    const m = A.length;
    const n = A[0].length;
    const res = Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += A[i][j] * v[j];
      }
      res[i] = sum;
    }
    return res;
  }

  /**
   * Solves linear system A * x = b via Gaussian Elimination with Partial Pivoting.
   */
  static solve(A: number[][], b: number[]): number[] {
    const n = A.length;
    // Clone augmented matrix
    const M = A.map((row, i) => [...row, b[i]]);

    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      let maxVal = Math.abs(M[i][i]);
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > maxVal) {
          maxVal = Math.abs(M[k][i]);
          maxRow = k;
        }
      }
      if (maxVal < 1e-15) {
        // Singular or ill-conditioned
        continue;
      }
      // Swap rows
      if (maxRow !== i) {
        const tmp = M[i];
        M[i] = M[maxRow];
        M[maxRow] = tmp;
      }

      // Eliminate
      const pivot = M[i][i];
      for (let k = i + 1; k < n; k++) {
        const factor = M[k][i] / pivot;
        for (let j = i; j <= n; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }

    // Back substitution
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = M[i][n];
      for (let j = i + 1; j < n; j++) {
        sum -= M[i][j] * x[j];
      }
      x[i] = Math.abs(M[i][i]) > 1e-15 ? sum / M[i][i] : 0;
    }
    return x;
  }

  /**
   * Inverts an n x n matrix via Gauss-Jordan elimination.
   */
  static invert(A: number[][]): number[][] {
    const n = A.length;
    const inv = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) inv[i][i] = 1;

    const M = A.map((row, i) => [...row, ...inv[i]]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      let maxVal = Math.abs(M[i][i]);
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > maxVal) {
          maxVal = Math.abs(M[k][i]);
          maxRow = k;
        }
      }
      if (maxVal < 1e-15) continue;

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

    return M.map(row => row.slice(n));
  }

  /**
   * Symmetric Jacobi Eigenvalue solver for extracting singular values of J*J^T.
   */
  static jacobiEigenvalues(A: number[][], maxIters = 60, tol = 1e-10): { eigenvalues: number[]; eigenvectors: number[][] } {
    const n = A.length;
    const V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0));
    const D = A.map(row => [...row]);

    for (let iter = 0; iter < maxIters; iter++) {
      let maxOff = 0;
      let p = 0, q = 1;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const off = Math.abs(D[i][j]);
          if (off > maxOff) {
            maxOff = off;
            p = i;
            q = j;
          }
        }
      }
      if (maxOff < tol) break;

      const app = D[p][p];
      const aqq = D[q][q];
      const apq = D[p][q];
      const phi = 0.5 * Math.atan2(2 * apq, aqq - app);
      const c = Math.cos(phi);
      const s = Math.sin(phi);

      // Rotate D
      for (let k = 0; k < n; k++) {
        if (k !== p && k !== q) {
          const dkp = D[k][p];
          const dkq = D[k][q];
          D[k][p] = c * dkp - s * dkq;
          D[p][k] = D[k][p];
          D[k][q] = s * dkp + c * dkq;
          D[q][k] = D[k][q];
        }
      }
      D[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
      D[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
      D[p][q] = 0;
      D[q][p] = 0;

      // Accumulate eigenvectors
      for (let k = 0; k < n; k++) {
        const vkp = V[k][p];
        const vkq = V[k][q];
        V[k][p] = c * vkp - s * vkq;
        V[k][q] = s * vkp + c * vkq;
      }
    }

    const eigenvalues = Array.from({ length: n }, (_, i) => Math.max(0, D[i][i]));
    return { eigenvalues, eigenvectors: V };
  }
}

// ============================================================================
// 7. RobotKinematicChain: Forward Kinematics, PoE, and Jacobians
// ============================================================================

export class RobotKinematicChain {
  constructor(
    public readonly joints: DHParameter[],
    public readonly convention: DHConvention = DHConvention.STANDARD,
    public readonly baseTransform: Matrix4x4 = Matrix4x4.identity(),
    public readonly toolTransform: Matrix4x4 = Matrix4x4.identity()
  ) {}

  get dof(): number {
    return this.joints.length;
  }

  /**
   * Forward kinematics: computes end-effector transform and all intermediate link frames.
   */
  forwardKinematics(q: number[]): { endEffector: Matrix4x4; jointFrames: Matrix4x4[] } {
    const jointFrames: Matrix4x4[] = [this.baseTransform];
    let current = this.baseTransform;

    for (let i = 0; i < this.joints.length; i++) {
      const qVal = q[i] ?? 0;
      const Ai = this.joints[i].toMatrix(qVal, this.convention);
      current = current.multiply(Ai);
      jointFrames.push(current);
    }

    const endEffector = current.multiply(this.toolTransform);
    return { endEffector, jointFrames };
  }

  /**
   * Geometric Jacobian computation via spatial cross-products:
   * J_i = [ z_{i-1} x (p_e - p_{i-1}) ]  (linear velocity)
   *       [ z_{i-1}                   ]  (angular velocity)
   */
  geometricJacobian(q: number[]): number[][] {
    const { endEffector, jointFrames } = this.forwardKinematics(q);
    const pe = endEffector.translation;
    const n = this.dof;

    // J is 6 x n
    const J: number[][] = Array.from({ length: 6 }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      const frame_i_minus_1 = jointFrames[i];
      const z_prev = frame_i_minus_1.zAxis;
      const p_prev = frame_i_minus_1.translation;

      if (this.joints[i].isRevolute) {
        // Revolute joint
        const p_diff = pe.subtract(p_prev);
        const j_v = z_prev.cross(p_diff);

        J[0][i] = j_v.x;
        J[1][i] = j_v.y;
        J[2][i] = j_v.z;
        J[3][i] = z_prev.x;
        J[4][i] = z_prev.y;
        J[5][i] = z_prev.z;
      } else {
        // Prismatic joint
        J[0][i] = z_prev.x;
        J[1][i] = z_prev.y;
        J[2][i] = z_prev.z;
        J[3][i] = 0;
        J[4][i] = 0;
        J[5][i] = 0;
      }
    }
    return J;
  }

  /**
   * Singularity and manipulability analysis
   * Automatically adapts to the task space dimension of the arm (2D, 3D, or 6D)
   */
  analyzeManipulability(
    q: number[],
    options?: { mode?: 'auto' | 'position' | 'full' }
  ): {
    singularValues: number[];
    manipulability: number;
    conditionNumber: number;
    isSingular: boolean;
  } {
    const J_full = this.geometricJacobian(q);
    const n = this.dof;
    const mode = options?.mode ?? 'auto';

    // Select task rows based on mode and DoF
    let J: number[][];
    if (mode === 'position') {
      J = J_full.slice(0, 3);
    } else if (mode === 'full') {
      J = J_full;
    } else {
      // auto
      if (n === 2) {
        J = [J_full[0], J_full[1]]; // Planar 2D translation
      } else if (n === 3) {
        J = J_full.slice(0, 3); // 3D spatial translation
      } else {
        J = J_full; // Full 6D spatial twist
      }
    }

    const m = J.length;
    const Jt = MatrixMath.transpose(J);
    // JJt is m x m
    const JJt = MatrixMath.multiply(J, Jt);

    const { eigenvalues } = MatrixMath.jacobiEigenvalues(JJt);
    const singularValues = eigenvalues
      .map(ev => Math.sqrt(Math.max(0, ev)))
      .sort((a, b) => b - a);

    // Yoshikawa index: product of singular values
    let manipulability = 1.0;
    for (const s of singularValues) {
      manipulability *= s;
    }

    const sigmaMax = singularValues[0] ?? 0;
    const sigmaMin = singularValues[singularValues.length - 1] ?? 0;
    const conditionNumber = sigmaMin > 1e-9 ? sigmaMax / sigmaMin : Infinity;
    const isSingular = sigmaMin < 1e-4;

    return { singularValues, manipulability, conditionNumber, isSingular };
  }

  /**
   * Product of Exponentials (PoE) Forward Kinematics
   */
  static forwardKinematicsPoE(
    q: number[],
    M: Matrix4x4,
    screwAxes: { omega: Vector3D; v: Vector3D }[]
  ): Matrix4x4 {
    let T = Matrix4x4.identity();
    for (let i = 0; i < q.length; i++) {
      const theta = q[i];
      const { omega, v } = screwAxes[i];
      const expS = RobotKinematicChain.matrixExponentialSE3(omega, v, theta);
      T = T.multiply(expS);
    }
    return T.multiply(M);
  }

  private static matrixExponentialSE3(omega: Vector3D, v: Vector3D, theta: number): Matrix4x4 {
    const wNorm = omega.norm();
    if (wNorm < 1e-9) {
      // Pure translation along v
      return Matrix4x4.fromTranslation(v.scale(theta));
    }
    const w = omega.normalize();
    const th = theta * wNorm;
    const q = Quaternion.fromAxisAngle(w, th);
    const R = q.toRotationMatrix();

    // G(theta) * v = (I*theta + (1 - cos(theta))*[w]x + (theta - sin(theta))*[w]x^2) * v
    const wx = w.cross(v);
    const wx2 = w.cross(wx);
    const p = v.scale(th).add(wx.scale(1.0 - Math.cos(th))).add(wx2.scale(th - Math.sin(th)));

    return Matrix4x4.fromTranslationRotation(p, R);
  }
}

// ============================================================================
// 8. Analytical Inverse Kinematics Solvers
// ============================================================================

export class AnalyticalIKSolver {
  /**
   * Closed-form Planar 2R Solver
   * Computes both elbow-up and elbow-down configurations.
   */
  static solvePlanar2R(l1: number, l2: number, x: number, y: number): {
    reachable: boolean;
    elbowDown?: [number, number];
    elbowUp?: [number, number];
  } {
    const rSq = x * x + y * y;
    const r = Math.sqrt(rSq);

    if (r > l1 + l2 + 1e-6 || r < Math.abs(l1 - l2) - 1e-6) {
      return { reachable: false };
    }

    const cosTheta2 = (rSq - l1 * l1 - l2 * l2) / (2.0 * l1 * l2);
    const clampedCos2 = Math.max(-1.0, Math.min(1.0, cosTheta2));
    const sinTheta2Positive = Math.sqrt(Math.max(0, 1.0 - clampedCos2 * clampedCos2));

    // Elbow-down (theta2 > 0)
    const theta2Down = Math.atan2(sinTheta2Positive, clampedCos2);
    const k1 = l1 + l2 * clampedCos2;
    const k2 = l2 * sinTheta2Positive;
    const theta1Down = Math.atan2(y, x) - Math.atan2(k2, k1);

    // Elbow-up (theta2 < 0)
    const theta2Up = Math.atan2(-sinTheta2Positive, clampedCos2);
    const k2Up = -k2;
    const theta1Up = Math.atan2(y, x) - Math.atan2(k2Up, k1);

    return {
      reachable: true,
      elbowDown: [theta1Down, theta2Down],
      elbowUp: [theta1Up, theta2Up]
    };
  }

  /**
   * Pieper's Criterion Spherical Wrist Decoupling (for standard 6R manipulators)
   * Decouples arm positioning (joints 1-3) and spherical wrist orientation (joints 4-6).
   */
  static solveSphericalWrist(
    armChain: RobotKinematicChain,
    targetPose: Matrix4x4,
    d6 = 0.1
  ): number[][] {
    const solutions: number[][] = [];
    // Wrist center: p_w = p_d - d6 * a_d (where a_d is z-axis of target)
    const pd = targetPose.translation;
    const ad = targetPose.zAxis;
    const pw = pd.subtract(ad.scale(d6));

    // Assume standard industrial arm:
    // Joint 1: theta1 = atan2(yw, xw) or atan2(-yw, -xw)
    const theta1Branches = [
      Math.atan2(pw.y, pw.x),
      Math.atan2(-pw.y, -pw.x)
    ];

    const l1 = armChain.joints[0]?.d ?? 0.3;
    const l2 = armChain.joints[1]?.a ?? 0.5;
    const l3 = armChain.joints[2]?.a ?? 0.4;

    for (const th1 of theta1Branches) {
      // Coordinate transformation into arm plane
      const r_xy = Math.sqrt(pw.x * pw.x + pw.y * pw.y);
      const z_arm = pw.z - l1;
      const planarSol = AnalyticalIKSolver.solvePlanar2R(l2, l3, r_xy, z_arm);

      if (!planarSol.reachable) continue;

      const armAngles = [planarSol.elbowDown, planarSol.elbowUp].filter(Boolean) as [number, number][];

      for (const [th2, th3] of armAngles) {
        // Forward kinematics of first 3 joints to find R_3^0
        const qArm = [th1, th2, th3, 0, 0, 0];
        const { jointFrames } = armChain.forwardKinematics(qArm);
        const R3 = jointFrames[3].rotationMatrix;

        // R_6^3 = (R_3^0)^T * R_d
        const R3t = MatrixMath.transpose(R3);
        const Rd = targetPose.rotationMatrix;
        const R63 = MatrixMath.multiply(R3t, Rd);

        // Z-Y-Z Euler angles for spherical wrist:
        // R63_33 = cos(theta5)
        const cos5 = Math.max(-1.0, Math.min(1.0, R63[2][2]));
        const sin5Positive = Math.sqrt(Math.max(0, 1.0 - cos5 * cos5));

        if (sin5Positive > 1e-5) {
          // Wrist-flip branch 1: theta5 > 0
          const th5_1 = Math.atan2(sin5Positive, cos5);
          const th4_1 = Math.atan2(R63[1][2], R63[0][2]);
          const th6_1 = Math.atan2(R63[2][1], -R63[2][0]);
          solutions.push([th1, th2, th3, th4_1, th5_1, th6_1]);

          // Wrist-flip branch 2: theta5 < 0
          const th5_2 = Math.atan2(-sin5Positive, cos5);
          const th4_2 = Math.atan2(-R63[1][2], -R63[0][2]);
          const th6_2 = Math.atan2(-R63[2][1], R63[2][0]);
          solutions.push([th1, th2, th3, th4_2, th5_2, th6_2]);
        } else {
          // Wrist singularity: theta5 ~ 0
          const th5 = 0;
          const th4 = 0;
          const th6 = Math.atan2(R63[1][0], R63[0][0]);
          solutions.push([th1, th2, th3, th4, th5, th6]);
        }
      }
    }
    return solutions;
  }
}

// ============================================================================
// 9. Numerical Inverse Kinematics Engines
// ============================================================================

export interface IKSolveOptions {
  maxIters?: number;
  tolerance?: number;
  stepSize?: number;
  dampingLambda?: number;
  adaptiveDamping?: boolean;
  w0?: number;
  enforceJointLimits?: boolean;
}

export class NumericalIKSolver {
  /**
   * Computes spatial pose error vector e = [e_pos; e_ori] in R^6
   */
  static computePoseError(current: Matrix4x4, target: Matrix4x4): Vector6D {
    const ep = target.translation.subtract(current.translation);

    const qc = current.rotationQuaternion;
    const qt = target.rotationQuaternion;

    // Relative rotation: delta_q = qc^-1 * qt
    const deltaQ = qc.conjugate().multiply(qt);
    const sign = deltaQ.w >= 0 ? 1.0 : -1.0;

    // Orientation error in space frame: 2 * sign * R_current * deltaQ.vector
    const eoBody = deltaQ.vector.scale(2.0 * sign);
    const eo = current.transformVector(eoBody);

    return Vector6D.fromParts(ep, eo);
  }

  /**
   * Newton-Raphson IK using Moore-Penrose Pseudoinverse
   */
  static solveNewtonRaphson(
    chain: RobotKinematicChain,
    target: Matrix4x4,
    initialQ: number[],
    options: IKSolveOptions = {}
  ): { converged: boolean; q: number[]; iterations: number; errorNorm: number } {
    const maxIters = options.maxIters ?? 50;
    const tol = options.tolerance ?? 1e-4;
    const stepSize = options.stepSize ?? 0.8;

    let q = [...initialQ];

    for (let iter = 0; iter < maxIters; iter++) {
      const { endEffector } = chain.forwardKinematics(q);
      const e = NumericalIKSolver.computePoseError(endEffector, target);
      const eNorm = e.norm();

      if (eNorm < tol) {
        return { converged: true, q, iterations: iter, errorNorm: eNorm };
      }

      const J = chain.geometricJacobian(q);
      const Jt = MatrixMath.transpose(J);
      const JJt = MatrixMath.multiply(J, Jt);

      // Solve (JJt) * v = e
      const v = MatrixMath.solve(JJt, e.toArray());
      // delta_q = J^T * v
      const deltaQ = MatrixMath.multiplyVector(Jt, v);

      for (let i = 0; i < q.length; i++) {
        q[i] += stepSize * deltaQ[i];
        if (options.enforceJointLimits && chain.joints[i]) {
          q[i] = Math.max(chain.joints[i].minLimit, Math.min(chain.joints[i].maxLimit, q[i]));
        }
      }
    }

    const { endEffector } = chain.forwardKinematics(q);
    const finalNorm = NumericalIKSolver.computePoseError(endEffector, target).norm();
    return { converged: finalNorm < tol, q, iterations: maxIters, errorNorm: finalNorm };
  }

  /**
   * Jacobian Transpose IK (Guaranteed Lyapunov descent)
   */
  static solveJacobianTranspose(
    chain: RobotKinematicChain,
    target: Matrix4x4,
    initialQ: number[],
    options: IKSolveOptions = {}
  ): { converged: boolean; q: number[]; iterations: number; errorNorm: number } {
    const maxIters = options.maxIters ?? 200;
    const tol = options.tolerance ?? 1e-3;

    let q = [...initialQ];

    for (let iter = 0; iter < maxIters; iter++) {
      const { endEffector } = chain.forwardKinematics(q);
      const e = NumericalIKSolver.computePoseError(endEffector, target);
      const eNorm = e.norm();

      if (eNorm < tol) {
        return { converged: true, q, iterations: iter, errorNorm: eNorm };
      }

      const J = chain.geometricJacobian(q);
      const Jt = MatrixMath.transpose(J);
      const eArr = e.toArray();

      // alpha = (e^T * J * J^T * e) / ||J * J^T * e||^2
      const Jt_e = MatrixMath.multiplyVector(Jt, eArr);
      const J_Jt_e = MatrixMath.multiplyVector(J, Jt_e);

      let num = 0;
      let den = 0;
      for (let i = 0; i < eArr.length; i++) {
        num += eArr[i] * J_Jt_e[i];
        den += J_Jt_e[i] * J_Jt_e[i];
      }
      const alpha = den > 1e-9 ? Math.max(0.01, Math.min(2.0, num / den)) : 0.1;

      for (let i = 0; i < q.length; i++) {
        q[i] += alpha * Jt_e[i];
        if (options.enforceJointLimits && chain.joints[i]) {
          q[i] = Math.max(chain.joints[i].minLimit, Math.min(chain.joints[i].maxLimit, q[i]));
        }
      }
    }

    const { endEffector } = chain.forwardKinematics(q);
    const finalNorm = NumericalIKSolver.computePoseError(endEffector, target).norm();
    return { converged: finalNorm < tol, q, iterations: maxIters, errorNorm: finalNorm };
  }

  /**
   * Damped Least-Squares (DLS) IK with Nakamura-Hanafusa Adaptive Damping
   */
  static solveDLS(
    chain: RobotKinematicChain,
    target: Matrix4x4,
    initialQ: number[],
    options: IKSolveOptions = {}
  ): { converged: boolean; q: number[]; iterations: number; errorNorm: number } {
    const maxIters = options.maxIters ?? 80;
    const tol = options.tolerance ?? 1e-4;
    const lambda0 = options.dampingLambda ?? 0.05;
    const w0 = options.w0 ?? 0.05;

    let q = [...initialQ];

    for (let iter = 0; iter < maxIters; iter++) {
      const { endEffector } = chain.forwardKinematics(q);
      const e = NumericalIKSolver.computePoseError(endEffector, target);
      const eNorm = e.norm();

      if (eNorm < tol) {
        return { converged: true, q, iterations: iter, errorNorm: eNorm };
      }

      const J = chain.geometricJacobian(q);
      const m = J.length;
      const Jt = MatrixMath.transpose(J);
      const JJt = MatrixMath.multiply(J, Jt);

      // Compute manipulability for adaptive damping
      const { manipulability } = chain.analyzeManipulability(q);
      let lambdaSq = lambda0 * lambda0;

      if (options.adaptiveDamping ?? true) {
        if (manipulability < w0) {
          const ratio = 1.0 - manipulability / w0;
          lambdaSq = lambda0 * lambda0 * (ratio * ratio);
        } else {
          lambdaSq = 0;
        }
      }

      // JJt + lambda^2 * I
      for (let i = 0; i < m; i++) {
        JJt[i][i] += Math.max(1e-8, lambdaSq);
      }

      // Solve (JJt + lambda^2 * I) * v = e
      const v = MatrixMath.solve(JJt, e.toArray());
      const deltaQ = MatrixMath.multiplyVector(Jt, v);

      for (let i = 0; i < q.length; i++) {
        q[i] += deltaQ[i];
        if (options.enforceJointLimits && chain.joints[i]) {
          q[i] = Math.max(chain.joints[i].minLimit, Math.min(chain.joints[i].maxLimit, q[i]));
        }
      }
    }

    const { endEffector } = chain.forwardKinematics(q);
    const finalNorm = NumericalIKSolver.computePoseError(endEffector, target).norm();
    return { converged: finalNorm < tol, q, iterations: maxIters, errorNorm: finalNorm };
  }

  /**
   * Redundant Nullspace IK with Secondary Objective
   * q_dot = J^+ * v_task + (I - J^+ * J) * v_secondary
   */
  static solveRedundantNullspace(
    chain: RobotKinematicChain,
    target: Matrix4x4,
    initialQ: number[],
    secondaryGradient: (q: number[]) => number[],
    kSecondary = 0.1,
    options: IKSolveOptions = {}
  ): { converged: boolean; q: number[]; iterations: number; errorNorm: number } {
    const maxIters = options.maxIters ?? 100;
    const tol = options.tolerance ?? 1e-4;
    const n = chain.dof;

    let q = [...initialQ];

    for (let iter = 0; iter < maxIters; iter++) {
      const { endEffector } = chain.forwardKinematics(q);
      const e = NumericalIKSolver.computePoseError(endEffector, target);
      const eNorm = e.norm();

      if (eNorm < tol) {
        return { converged: true, q, iterations: iter, errorNorm: eNorm };
      }

      const J = chain.geometricJacobian(q);
      const Jt = MatrixMath.transpose(J);
      const JJt = MatrixMath.multiply(J, Jt);

      // Task space solve
      const v = MatrixMath.solve(JJt, e.toArray());
      const deltaQ_task = MatrixMath.multiplyVector(Jt, v);

      // Compute Nullspace projector P = I - J^+ * J
      // (J^+ * J)_ij = sum_k J^+_ik * J_kj = sum_k (J^T * (JJ^T)^-1)_ik * J_kj
      const JJt_inv = MatrixMath.invert(JJt);
      const Jpinv = MatrixMath.multiply(Jt, JJt_inv); // n x 6
      const Jpinv_J = MatrixMath.multiply(Jpinv, J);   // n x n

      const P = Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => (i === j ? 1 : 0) - Jpinv_J[i][j])
      );

      const grad = secondaryGradient(q);
      const deltaQ_null = MatrixMath.multiplyVector(P, grad).map(val => val * kSecondary);

      for (let i = 0; i < n; i++) {
        q[i] += deltaQ_task[i] + deltaQ_null[i];
        if (options.enforceJointLimits && chain.joints[i]) {
          q[i] = Math.max(chain.joints[i].minLimit, Math.min(chain.joints[i].maxLimit, q[i]));
        }
      }
    }

    const { endEffector } = chain.forwardKinematics(q);
    const finalNorm = NumericalIKSolver.computePoseError(endEffector, target).norm();
    return { converged: finalNorm < tol, q, iterations: maxIters, errorNorm: finalNorm };
  }
}

// ============================================================================
// 10. Heuristic Geometric Solvers: CCD & FABRIK
// ============================================================================

export class FABRIKSolver {
  /**
   * Forward And Backward Reaching Inverse Kinematics for serial point chains.
   */
  static solve(
    base: Vector3D,
    linkLengths: number[],
    initialJointPositions: Vector3D[],
    target: Vector3D,
    maxIters = 20,
    tol = 1e-4
  ): { converged: boolean; positions: Vector3D[]; iterations: number; error: number } {
    const n = linkLengths.length;
    let p = initialJointPositions.map(pt => new Vector3D(pt.x, pt.y, pt.z));

    // Check reachability
    const totalLength = linkLengths.reduce((sum, len) => sum + len, 0);
    const distToTarget = base.distanceTo(target);

    if (distToTarget > totalLength) {
      // Unreachable: stretch towards target
      const dir = target.subtract(base).normalize();
      p[0] = base;
      for (let i = 0; i < n; i++) {
        p[i + 1] = p[i].add(dir.scale(linkLengths[i]));
      }
      return {
        converged: false,
        positions: p,
        iterations: 0,
        error: p[n].distanceTo(target)
      };
    }

    for (let iter = 0; iter < maxIters; iter++) {
      // Forward Reaching Phase: target to base
      p[n] = target;
      for (let i = n - 1; i >= 0; i--) {
        const r = p[i + 1].distanceTo(p[i]);
        const lambda = r > 1e-9 ? linkLengths[i] / r : 0;
        p[i] = p[i + 1].scale(1.0 - lambda).add(p[i].scale(lambda));
      }

      // Backward Reaching Phase: base to end
      p[0] = base;
      for (let i = 0; i < n; i++) {
        const r = p[i + 1].distanceTo(p[i]);
        const lambda = r > 1e-9 ? linkLengths[i] / r : 0;
        p[i + 1] = p[i].scale(1.0 - lambda).add(p[i + 1].scale(lambda));
      }

      const err = p[n].distanceTo(target);
      if (err < tol) {
        return { converged: true, positions: p, iterations: iter + 1, error: err };
      }
    }

    const finalErr = p[n].distanceTo(target);
    return { converged: finalErr < tol, positions: p, iterations: maxIters, error: finalErr };
  }
}

export class CCDSolver {
  /**
   * 2D / 3D Cyclic Coordinate Descent with per-joint angle limit clamping.
   */
  static solve(
    chain: RobotKinematicChain,
    target: Vector3D,
    initialQ: number[],
    maxIters = 40,
    tol = 1e-4
  ): { converged: boolean; q: number[]; iterations: number; error: number } {
    const q = [...initialQ];
    const n = chain.dof;

    for (let iter = 0; iter < maxIters; iter++) {
      for (let i = n - 1; i >= 0; i--) {
        const { endEffector, jointFrames } = chain.forwardKinematics(q);
        const pe = endEffector.translation;
        const err = pe.distanceTo(target);

        if (err < tol) {
          return { converged: true, q, iterations: iter + 1, error: err };
        }

        const pi = jointFrames[i].translation;
        const zi = jointFrames[i].zAxis;

        // Vectors from joint i to end-effector and target
        const ve = pe.subtract(pi);
        const vt = target.subtract(pi);

        // Project onto plane perpendicular to rotation axis zi
        const ue = ve.subtract(zi.scale(ve.dot(zi)));
        const ut = vt.subtract(zi.scale(vt.dot(zi)));

        const ueNorm = ue.norm();
        const utNorm = ut.norm();

        if (ueNorm > 1e-6 && utNorm > 1e-6) {
          const cosTheta = Math.max(-1.0, Math.min(1.0, ue.dot(ut) / (ueNorm * utNorm)));
          const sinTheta = zi.dot(ue.cross(ut)) / (ueNorm * utNorm);
          const deltaTheta = Math.atan2(sinTheta, cosTheta);

          q[i] += deltaTheta;

          // Joint clamping
          if (chain.joints[i]) {
            q[i] = Math.max(chain.joints[i].minLimit, Math.min(chain.joints[i].maxLimit, q[i]));
          }
        }
      }
    }

    const { endEffector } = chain.forwardKinematics(q);
    const finalErr = endEffector.translation.distanceTo(target);
    return { converged: finalErr < tol, q, iterations: maxIters, error: finalErr };
  }
}

// ============================================================================
// 11. Trajectory Generation & Closed-Loop Inverse Kinematics (CLIK)
// ============================================================================

export class TrajectoryGenerator {
  /**
   * C^2 Smooth Minimum-Jerk Quintic Polynomial
   * s(t) = a0 + a1*t + a2*t^2 + a3*t^3 + a4*t^4 + a5*t^5
   */
  static quinticPolynomial(
    q0: number, qf: number,
    v0: number, vf: number,
    a0: number, af: number,
    T: number, t: number
  ): { pos: number; vel: number; acc: number; jerk: number } {
    if (t <= 0) return { pos: q0, vel: v0, acc: a0, jerk: 0 };
    if (t >= T) return { pos: qf, vel: vf, acc: af, jerk: 0 };

    const c0 = q0;
    const c1 = v0;
    const c2 = 0.5 * a0;

    const T2 = T * T;
    const T3 = T2 * T;
    const T4 = T3 * T;
    const T5 = T4 * T;

    const h = qf - q0;

    const c3 = (20 * h - (8 * vf + 12 * v0) * T - (3 * a0 - af) * T2) / (2 * T3);
    const c4 = (-30 * h + (14 * vf + 16 * v0) * T + (3 * a0 - 2 * af) * T2) / (2 * T4);
    const c5 = (12 * h - 6 * (vf + v0) * T + (af - a0) * T2) / (2 * T5);

    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;
    const t5 = t4 * t;

    const pos = c0 + c1 * t + c2 * t2 + c3 * t3 + c4 * t4 + c5 * t5;
    const vel = c1 + 2 * c2 * t + 3 * c3 * t2 + 4 * c4 * t3 + 5 * c5 * t4;
    const acc = 2 * c2 + 6 * c3 * t + 12 * c4 * t2 + 20 * c5 * t3;
    const jerk = 6 * c3 + 24 * c4 * t + 60 * c5 * t2;

    return { pos, vel, acc, jerk };
  }

  /**
   * Operational SE(3) Trajectory Interpolator via Quintic Polynomial and Slerp
   */
  static interpolatePose(
    start: Matrix4x4,
    end: Matrix4x4,
    T: number,
    t: number
  ): { pose: Matrix4x4; linearVel: Vector3D; angularVel: Vector3D } {
    const p0 = start.translation;
    const pf = end.translation;
    const q0 = start.rotationQuaternion;
    const q1 = end.rotationQuaternion;

    // Minimum jerk scalar path parameter
    const tau = Math.max(0, Math.min(1, t / T));
    const s = 10 * Math.pow(tau, 3) - 15 * Math.pow(tau, 4) + 6 * Math.pow(tau, 5);
    const sDot = (30 * Math.pow(tau, 2) - 60 * Math.pow(tau, 3) + 30 * Math.pow(tau, 4)) / T;

    // Linear translation
    const pCurrent = p0.scale(1.0 - s).add(pf.scale(s));
    const vLinear = pf.subtract(p0).scale(sDot);

    // Orientation Slerp
    const qCurrent = Quaternion.slerp(q0, q1, s);

    // Angular velocity: delta_q = q0^-1 * q1
    const deltaQ = q0.conjugate().multiply(q1);
    const { axis, angle } = deltaQ.toAxisAngle();
    const vAngular = axis.scale(angle * sDot);

    const pose = Matrix4x4.fromTranslationQuaternion(pCurrent, qCurrent);
    return { pose, linearVel: vLinear, angularVel: vAngular };
  }
}

export class CLIKController {
  /**
   * Real-time Closed-Loop Inverse Kinematics tick with drift compensation:
   * q_dot = J^+ * (v_ref + Kp * e) + (I - J^+ * J) * v_secondary
   */
  static step(
    chain: RobotKinematicChain,
    qCurrent: number[],
    targetPose: Matrix4x4,
    feedforwardTwist: Vector6D,
    kp: number,
    dt: number,
    secondaryGrad?: (q: number[]) => number[],
    kSecondary = 0.05
  ): { qNext: number[]; qDot: number[]; errorNorm: number } {
    const { endEffector } = chain.forwardKinematics(qCurrent);
    const e = NumericalIKSolver.computePoseError(endEffector, targetPose);
    const eNorm = e.norm();

    const J = chain.geometricJacobian(qCurrent);
    const n = chain.dof;
    const Jt = MatrixMath.transpose(J);
    const JJt = MatrixMath.multiply(J, Jt);

    // Damped Least Squares
    for (let i = 0; i < 6; i++) {
      JJt[i][i] += 1e-4;
    }

    // Reference operational velocity with feedback drift compensation
    const vRef = feedforwardTwist.add(e.scale(kp));
    const vTask = MatrixMath.solve(JJt, vRef.toArray());
    const qDotTask = MatrixMath.multiplyVector(Jt, vTask);

    let qDot = [...qDotTask];

    if (secondaryGrad) {
      const JJt_inv = MatrixMath.invert(JJt);
      const Jpinv = MatrixMath.multiply(Jt, JJt_inv);
      const Jpinv_J = MatrixMath.multiply(Jpinv, J);

      const grad = secondaryGrad(qCurrent);
      for (let i = 0; i < n; i++) {
        let nullComp = 0;
        for (let j = 0; j < n; j++) {
          const P_ij = (i === j ? 1 : 0) - Jpinv_J[i][j];
          nullComp += P_ij * grad[j];
        }
        qDot[i] += nullComp * kSecondary;
      }
    }

    // Integrate
    const qNext = qCurrent.map((qi, i) => {
      let qNew = qi + qDot[i] * dt;
      if (chain.joints[i]) {
        qNew = Math.max(chain.joints[i].minLimit, Math.min(chain.joints[i].maxLimit, qNew));
      }
      return qNew;
    });

    return { qNext, qDot, errorNorm: eNorm };
  }
}
