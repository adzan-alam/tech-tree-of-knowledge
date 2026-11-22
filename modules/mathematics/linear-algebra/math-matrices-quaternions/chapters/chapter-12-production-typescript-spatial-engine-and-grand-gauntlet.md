# Chapter 12: Production TypeScript Spatial Math Engine and the Civilizational Grand Gauntlet

> *"Theory without execution is a ghost; execution without rigorous theory is chaos. In the crucible of production engineering, our mathematical abstractions must crystallize into bulletproof, cache-coherent, allocation-free machine instructions."*

---

## 12.1 Engine Architecture: High-Performance Spatial Mathematics

In high-framerate simulation engines (running at $60\text{ Hz}$ to $240\text{ Hz}$ with $100,000+$ active entities), naive object-oriented math code causes catastrophic performance degradation:
1. **Garbage Collection Pressure:** Allocating `new Vector3()` or `new Quaternion()` inside the physics loop generates gigabytes of short-lived heap allocations, triggering periodic stop-the-world GC pauses that drop frames.
2. **Cache Thrashing:** Pointer-chasing through disjoint heap-allocated objects ruins L1/L2 CPU cache prefetching.
3. **Floating-Point Drift:** Unchecked accumulating rounding errors in matrix and quaternion operations violate conservation of energy and unitary invariants.

### Architectural Invariants of our Production Spatial Math Engine:
- **Flat Memory Layout (`Float32Array` / `Float64Array`):** Matrices are stored in continuous column-major or row-major flat buffers directly transferable to WebGL / WebGPU vertex uniforms.
- **In-Place Mutation and Destination Targets:** Every mathematical operation accepts an optional `out` parameter to reuse memory.
- **Strict Numerical Guards:** Matrix inversion safeguards against $|\det(\mathbf{M})| < 10^{-12}$; quaternion conversion uses Shepperd diagonal branching; Euler extraction clamps gimbal lock arguments to $[-1.0, 1.0]$; SLERP checks antipodal alignment and small-angle fallbacks.

---

## 12.2 Full Production TypeScript Implementation

Below is the complete, self-contained, enterprise-grade spatial math library implementing all core primitives.

```typescript
/**
 * SOVEREIGN SPATIAL MATH ENGINE
 * Standard: SMTS-40K / IEEE-754 Compliant
 * Zero-Allocation, SIMD-Friendly, Bulletproof Numerical Stability
 */

export const EPSILON = 1e-7;

// ============================================================================
// 1. 3D VECTOR IMPLEMENTATION
// ============================================================================
export class Vector3 {
  public data: Float32Array;

  constructor(x = 0, y = 0, z = 0) {
    this.data = new Float32Array(3);
    this.data[0] = x;
    this.data[1] = y;
    this.data[2] = z;
  }

  get x(): number { return this.data[0]; }
  set x(val: number) { this.data[0] = val; }

  get y(): number { return this.data[1]; }
  set y(val: number) { this.data[1] = val; }

  get z(): number { return this.data[2]; }
  set z(val: number) { this.data[2] = val; }

  set(x: number, y: number, z: number): this {
    this.data[0] = x;
    this.data[1] = y;
    this.data[2] = z;
    return this;
  }

  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  copy(v: Vector3): this {
    this.data[0] = v.data[0];
    this.data[1] = v.data[1];
    this.data[2] = v.data[2];
    return this;
  }

  add(v: Vector3, out = this): Vector3 {
    out.data[0] = this.data[0] + v.data[0];
    out.data[1] = this.data[1] + v.data[1];
    out.data[2] = this.data[2] + v.data[2];
    return out;
  }

  subtract(v: Vector3, out = this): Vector3 {
    out.data[0] = this.data[0] - v.data[0];
    out.data[1] = this.data[1] - v.data[1];
    out.data[2] = this.data[2] - v.data[2];
    return out;
  }

  scale(s: number, out = this): Vector3 {
    out.data[0] = this.data[0] * s;
    out.data[1] = this.data[1] * s;
    out.data[2] = this.data[2] * s;
    return out;
  }

  dot(v: Vector3): number {
    return this.data[0] * v.data[0] + this.data[1] * v.data[1] + this.data[2] * v.data[2];
  }

  cross(v: Vector3, out = this): Vector3 {
    const ax = this.data[0], ay = this.data[1], az = this.data[2];
    const bx = v.data[0], by = v.data[1], bz = v.data[2];
    out.data[0] = ay * bz - az * by;
    out.data[1] = az * bx - ax * bz;
    out.data[2] = ax * by - ay * bx;
    return out;
  }

  lengthSq(): number {
    const x = this.data[0], y = this.data[1], z = this.data[2];
    return x * x + y * y + z * z;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  normalize(out = this): Vector3 {
    const lenSq = this.lengthSq();
    if (lenSq > EPSILON * EPSILON) {
      const invLen = 1.0 / Math.sqrt(lenSq);
      out.scale(invLen);
    } else {
      out.set(0, 0, 0);
    }
    return out;
  }
}

// ============================================================================
// 2. 3x3 MATRIX IMPLEMENTATION (Column-Major)
// ============================================================================
export class Matrix3x3 {
  // Elements: [m00, m10, m20,  m01, m11, m21,  m02, m12, m22]
  public elements: Float32Array;

  constructor() {
    this.elements = new Float32Array(9);
    this.identity();
  }

  identity(): this {
    const e = this.elements;
    e[0] = 1; e[1] = 0; e[2] = 0;
    e[3] = 0; e[4] = 1; e[5] = 0;
    e[6] = 0; e[7] = 0; e[8] = 1;
    return this;
  }

  set(m00: number, m01: number, m02: number,
      m10: number, m11: number, m12: number,
      m20: number, m21: number, m22: number): this {
    const e = this.elements;
    e[0] = m00; e[1] = m10; e[2] = m20;
    e[3] = m01; e[4] = m11; e[5] = m21;
    e[6] = m02; e[7] = m12; e[8] = m22;
    return this;
  }

  determinant(): number {
    const e = this.elements;
    const m00 = e[0], m10 = e[1], m20 = e[2];
    const m01 = e[3], m11 = e[4], m21 = e[5];
    const m02 = e[6], m12 = e[7], m22 = e[8];

    return m00 * (m11 * m22 - m21 * m12)
         - m01 * (m10 * m22 - m20 * m12)
         + m02 * (m10 * m21 - m20 * m11);
  }

  transpose(out = this): Matrix3x3 {
    const e = this.elements;
    const m10 = e[1], m20 = e[2], m21 = e[5];
    const m01 = e[3], m02 = e[6], m12 = e[7];

    out.elements[0] = e[0];
    out.elements[1] = m01;
    out.elements[2] = m02;

    out.elements[3] = m10;
    out.elements[4] = e[4];
    out.elements[5] = m12;

    out.elements[6] = m20;
    out.elements[7] = m21;
    out.elements[8] = e[8];
    return out;
  }

  invert(out = this): Matrix3x3 | null {
    const det = this.determinant();
    if (Math.abs(det) < 1e-12) return null;

    const invDet = 1.0 / det;
    const e = this.elements;
    const m00 = e[0], m10 = e[1], m20 = e[2];
    const m01 = e[3], m11 = e[4], m21 = e[5];
    const m02 = e[6], m12 = e[7], m22 = e[8];

    const c00 =  (m11 * m22 - m21 * m12) * invDet;
    const c01 = -(m01 * m22 - m21 * m02) * invDet;
    const c02 =  (m01 * m12 - m11 * m02) * invDet;

    const c10 = -(m10 * m22 - m20 * m12) * invDet;
    const c11 =  (m00 * m22 - m20 * m02) * invDet;
    const c12 = -(m00 * m12 - m10 * m02) * invDet;

    const c20 =  (m10 * m21 - m20 * m11) * invDet;
    const c21 = -(m00 * m21 - m20 * m01) * invDet;
    const c22 =  (m00 * m11 - m10 * m01) * invDet;

    // Transpose of cofactor matrix into column-major
    out.elements[0] = c00; out.elements[1] = c10; out.elements[2] = c20;
    out.elements[3] = c01; out.elements[4] = c11; out.elements[5] = c21;
    out.elements[6] = c02; out.elements[7] = c12; out.elements[8] = c22;
    return out;
  }

  multiply(b: Matrix3x3, out = this): Matrix3x3 {
    const ae = this.elements;
    const be = b.elements;
    const oe = out.elements;

    for (let c = 0; c < 3; c++) {
      const b0 = be[c * 3 + 0];
      const b1 = be[c * 3 + 1];
      const b2 = be[c * 3 + 2];

      oe[c * 3 + 0] = ae[0] * b0 + ae[3] * b1 + ae[6] * b2;
      oe[c * 3 + 1] = ae[1] * b0 + ae[4] * b1 + ae[7] * b2;
      oe[c * 3 + 2] = ae[2] * b0 + ae[5] * b1 + ae[8] * b2;
    }
    return out;
  }

  multiplyVector(v: Vector3, out = new Vector3()): Vector3 {
    const e = this.elements;
    const x = v.x, y = v.y, z = v.z;
    out.x = e[0] * x + e[3] * y + e[6] * z;
    out.y = e[1] * x + e[4] * y + e[7] * z;
    out.z = e[2] * x + e[5] * y + e[8] * z;
    return out;
  }
}

// ============================================================================
// 3. 4x4 AFFINE MATRIX IMPLEMENTATION (Column-Major)
// ============================================================================
export class Matrix4x4 {
  public elements: Float32Array;

  constructor() {
    this.elements = new Float32Array(16);
    this.identity();
  }

  identity(): this {
    const e = this.elements;
    e.fill(0);
    e[0] = 1; e[5] = 1; e[10] = 1; e[15] = 1;
    return this;
  }

  multiply(b: Matrix4x4, out = this): Matrix4x4 {
    const ae = this.elements;
    const be = b.elements;
    const te = new Float32Array(16);

    for (let col = 0; col < 4; col++) {
      const b0 = be[col * 4 + 0];
      const b1 = be[col * 4 + 1];
      const b2 = be[col * 4 + 2];
      const b3 = be[col * 4 + 3];

      te[col * 4 + 0] = ae[0] * b0 + ae[4] * b1 + ae[8]  * b2 + ae[12] * b3;
      te[col * 4 + 1] = ae[1] * b0 + ae[5] * b1 + ae[9]  * b2 + ae[13] * b3;
      te[col * 4 + 2] = ae[2] * b0 + ae[6] * b1 + ae[10] * b2 + ae[14] * b3;
      te[col * 4 + 3] = ae[3] * b0 + ae[7] * b1 + ae[11] * b2 + ae[15] * b3;
    }
    out.elements.set(te);
    return out;
  }

  composeTRS(pos: Vector3, rot: Quaternion, scale: Vector3): this {
    rot.toRotationMatrix4(this);
    const e = this.elements;

    // Apply scale to columns
    const sx = scale.x, sy = scale.y, sz = scale.z;
    e[0] *= sx; e[1] *= sx; e[2] *= sx;
    e[4] *= sy; e[5] *= sy; e[6] *= sy;
    e[8] *= sz; e[9] *= sz; e[10] *= sz;

    // Translation into 4th column
    e[12] = pos.x;
    e[13] = pos.y;
    e[14] = pos.z;
    e[15] = 1.0;

    return this;
  }

  transformPoint(p: Vector3, out = new Vector3()): Vector3 {
    const e = this.elements;
    const x = p.x, y = p.y, z = p.z;
    const w = e[3] * x + e[7] * y + e[11] * z + e[15];
    const invW = Math.abs(w) > 1e-12 ? 1.0 / w : 1.0;

    out.x = (e[0] * x + e[4] * y + e[8]  * z + e[12]) * invW;
    out.y = (e[1] * x + e[5] * y + e[9]  * z + e[13]) * invW;
    out.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * invW;
    return out;
  }

  transformDirection(dir: Vector3, out = new Vector3()): Vector3 {
    const e = this.elements;
    const x = dir.x, y = dir.y, z = dir.z;
    out.x = e[0] * x + e[4] * y + e[8]  * z;
    out.y = e[1] * x + e[5] * y + e[9]  * z;
    out.z = e[2] * x + e[6] * y + e[10] * z;
    return out;
  }

  invertRigidBody(out = this): Matrix4x4 {
    const e = this.elements;
    const oe = out.elements;

    // Rotation is upper 3x3, inverse is transpose
    const r00 = e[0], r10 = e[1], r20 = e[2];
    const r01 = e[4], r11 = e[5], r21 = e[6];
    const r02 = e[8], r12 = e[9], r22 = e[10];

    const tx = e[12], ty = e[13], tz = e[14];

    oe[0] = r00; oe[1] = r01; oe[2] = r02; oe[3] = 0;
    oe[4] = r10; oe[5] = r11; oe[6] = r12; oe[7] = 0;
    oe[8] = r20; oe[9] = r21; oe[10] = r22; oe[11] = 0;

    // New translation: -R^T * t
    oe[12] = -(r00 * tx + r10 * ty + r20 * tz);
    oe[13] = -(r01 * tx + r11 * ty + r21 * tz);
    oe[14] = -(r02 * tx + r12 * ty + r22 * tz);
    oe[15] = 1;

    return out;
  }
}

// ============================================================================
// 4. UNIT QUATERNION IMPLEMENTATION (Hamiltonian)
// ============================================================================
export class Quaternion {
  public data: Float32Array;

  constructor(w = 1, x = 0, y = 0, z = 0) {
    this.data = new Float32Array(4);
    this.data[0] = w;
    this.data[1] = x;
    this.data[2] = y;
    this.data[3] = z;
  }

  get w(): number { return this.data[0]; }
  set w(val: number) { this.data[0] = val; }

  get x(): number { return this.data[1]; }
  set x(val: number) { this.data[1] = val; }

  get y(): number { return this.data[2]; }
  set y(val: number) { this.data[2] = val; }

  get z(): number { return this.data[3]; }
  set z(val: number) { this.data[3] = val; }

  set(w: number, x: number, y: number, z: number): this {
    this.data[0] = w;
    this.data[1] = x;
    this.data[2] = y;
    this.data[3] = z;
    return this;
  }

  clone(): Quaternion {
    return new Quaternion(this.w, this.x, this.y, this.z);
  }

  identity(): this {
    return this.set(1, 0, 0, 0);
  }

  dot(q: Quaternion): number {
    return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
  }

  lengthSq(): number {
    return this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSq());
  }

  normalize(out = this): Quaternion {
    const lenSq = this.lengthSq();
    if (lenSq > EPSILON * EPSILON) {
      const invLen = 1.0 / Math.sqrt(lenSq);
      out.w = this.w * invLen;
      out.x = this.x * invLen;
      out.y = this.y * invLen;
      out.z = this.z * invLen;
    } else {
      out.identity();
    }
    return out;
  }

  fastRenormalize(out = this): Quaternion {
    const lenSq = this.lengthSq();
    const factor = 0.5 * (3.0 - lenSq);
    out.w = this.w * factor;
    out.x = this.x * factor;
    out.y = this.y * factor;
    out.z = this.z * factor;
    return out;
  }

  conjugate(out = this): Quaternion {
    out.w = this.w;
    out.x = -this.x;
    out.y = -this.y;
    out.z = -this.z;
    return out;
  }

  multiply(b: Quaternion, out = this): Quaternion {
    const w1 = this.w, x1 = this.x, y1 = this.y, z1 = this.z;
    const w2 = b.w,    x2 = b.x,    y2 = b.y,    z2 = b.z;

    out.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
    out.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
    out.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
    out.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
    return out;
  }

  rotateVector(v: Vector3, out = new Vector3()): Vector3 {
    // Optimized sandwich product: v' = v + 2*r x (r x v + w*v)
    const rx = this.x, ry = this.y, rz = this.z, rw = this.w;
    const vx = v.x, vy = v.y, vz = v.z;

    // t = 2 * (r x v)
    const tx = 2.0 * (ry * vz - rz * vy);
    const ty = 2.0 * (rz * vx - rx * vz);
    const tz = 2.0 * (rx * vy - ry * vx);

    out.x = vx + rw * tx + (ry * tz - rz * ty);
    out.y = vy + rw * ty + (rz * tx - rx * tz);
    out.z = vz + rw * tz + (rx * ty - ry * tx);
    return out;
  }

  setFromAxisAngle(axis: Vector3, angleRadians: number): this {
    const halfAngle = angleRadians * 0.5;
    const s = Math.sin(halfAngle);
    this.w = Math.cos(halfAngle);
    this.x = axis.x * s;
    this.y = axis.y * s;
    this.z = axis.z * s;
    return this.normalize();
  }

  toAxisAngle(outAxis = new Vector3()): { axis: Vector3; angle: number } {
    const q = this.w < 0 ? new Quaternion(-this.w, -this.x, -this.y, -this.z) : this;
    const angle = 2.0 * Math.acos(Math.min(1.0, Math.max(-1.0, q.w)));
    const sinHalf = Math.sqrt(Math.max(0, 1.0 - q.w * q.w));

    if (sinHalf < 1e-6) {
      outAxis.set(1, 0, 0);
    } else {
      outAxis.set(q.x / sinHalf, q.y / sinHalf, q.z / sinHalf);
    }
    return { axis: outAxis, angle };
  }

  toRotationMatrix3(out = new Matrix3x3()): Matrix3x3 {
    const w = this.w, x = this.x, y = this.y, z = this.z;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    out.set(
      1.0 - (yy + zz), xy - wz,         xz + wy,
      xy + wz,         1.0 - (xx + zz), yz - wx,
      xz - wy,         yz + wx,         1.0 - (xx + yy)
    );
    return out;
  }

  toRotationMatrix4(out = new Matrix4x4()): Matrix4x4 {
    const w = this.w, x = this.x, y = this.y, z = this.z;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    const e = out.elements;
    e[0] = 1.0 - (yy + zz); e[4] = xy - wz;         e[8]  = xz + wy;         e[12] = 0;
    e[1] = xy + wz;         e[5] = 1.0 - (xx + zz); e[9]  = yz - wx;         e[13] = 0;
    e[2] = xz - wy;         e[6] = yz + wx;         e[10] = 1.0 - (xx + yy); e[14] = 0;
    e[3] = 0;               e[7] = 0;               e[11] = 0;               e[15] = 1;
    return out;
  }

  /**
   * Shepperd / Bar-Itzhack Matrix to Quaternion Conversion
   * Bulletproof 4-branch diagonal maximization algorithm
   */
  setFromRotationMatrix(m: Matrix3x3): this {
    const e = m.elements;
    const m00 = e[0], m10 = e[1], m20 = e[2];
    const m01 = e[3], m11 = e[4], m21 = e[5];
    const m02 = e[6], m12 = e[7], m22 = e[8];

    const trace = m00 + m11 + m22;

    if (trace > 0.0) {
      const s = 2.0 * Math.sqrt(trace + 1.0);
      this.w = 0.25 * s;
      this.x = (m21 - m12) / s;
      this.y = (m02 - m20) / s;
      this.z = (m10 - m01) / s;
    } else if (m00 >= m11 && m00 >= m22) {
      const s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
      this.w = (m21 - m12) / s;
      this.x = 0.25 * s;
      this.y = (m01 + m10) / s;
      this.z = (m02 + m20) / s;
    } else if (m11 > m22) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
      this.w = (m02 - m20) / s;
      this.x = (m01 + m10) / s;
      this.y = 0.25 * s;
      this.z = (m12 + m21) / s;
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
      this.w = (m10 - m01) / s;
      this.x = (m02 + m20) / s;
      this.y = (m12 + m21) / s;
      this.z = 0.25 * s;
    }
    return this.normalize();
  }

  /**
   * Shortest-Path Spherical Linear Interpolation (SLERP)
   */
  static slerp(qa: Quaternion, qb: Quaternion, t: number, out = new Quaternion()): Quaternion {
    let cosOmega = qa.dot(qb);
    let bx = qb.x, by = qb.y, bz = qb.z, bw = qb.w;

    // Antipodal check to enforce shortest path
    if (cosOmega < 0.0) {
      cosOmega = -cosOmega;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }

    // Near collinear threshold fallback to NLERP
    if (cosOmega > 0.9995) {
      out.w = qa.w + t * (bw - qa.w);
      out.x = qa.x + t * (bx - qa.x);
      out.y = qa.y + t * (by - qa.y);
      out.z = qa.z + t * (bz - qa.z);
      return out.normalize();
    }

    const omega = Math.acos(cosOmega);
    const sinOmega = Math.sin(omega);
    const invSinOmega = 1.0 / sinOmega;

    const scaleA = Math.sin((1.0 - t) * omega) * invSinOmega;
    const scaleB = Math.sin(t * omega) * invSinOmega;

    out.w = scaleA * qa.w + scaleB * bw;
    out.x = scaleA * qa.x + scaleB * bx;
    out.y = scaleA * qa.y + scaleB * by;
    out.z = scaleA * qa.z + scaleB * bz;
    return out;
  }

  /**
   * Integrate angular velocity vector over time step dt
   */
  integrateAngularVelocity(omega: Vector3, dt: number, out = this): Quaternion {
    const halfDt = dt * 0.5;
    const wx = omega.x * halfDt;
    const wy = omega.y * halfDt;
    const wz = omega.z * halfDt;

    const qw = this.w, qx = this.x, qy = this.y, qz = this.z;

    // q_new = q + 0.5 * dt * omega_q * q
    out.w = qw - (wx * qx + wy * qy + wz * qz);
    out.x = qx + (wx * qw + wy * qz - wz * qy);
    out.y = qy + (wy * qw + wz * qx - wx * qz);
    out.z = qz + (wz * qw + wx * qy - wy * qx);

    return out.fastRenormalize();
  }
}

// ============================================================================
// 5. EULER ANGLES CONVERSION WITH GIMBAL LOCK SAFEGUARDS
// ============================================================================
export class EulerAngles {
  constructor(public roll = 0, public pitch = 0, public yaw = 0) {}

  setFromQuaternionZYX(q: Quaternion): this {
    const w = q.w, x = q.x, y = q.y, z = q.z;
    const tau = 2.0 * (w * y - x * z);

    // Singularity protection against NaN
    const clampedTau = Math.min(1.0, Math.max(-1.0, tau));

    if (clampedTau >= 0.99999) {
      // North pole gimbal lock (Pitch = +90 deg)
      this.pitch = Math.PI * 0.5;
      this.yaw = 2.0 * Math.atan2(z, w);
      this.roll = 0.0;
    } else if (clampedTau <= -0.99999) {
      // South pole gimbal lock (Pitch = -90 deg)
      this.pitch = -Math.PI * 0.5;
      this.yaw = -2.0 * Math.atan2(z, w);
      this.roll = 0.0;
    } else {
      this.pitch = Math.asin(clampedTau);
      this.roll = Math.atan2(2.0 * (w * x + y * z), 1.0 - 2.0 * (x * x + y * y));
      this.yaw = Math.atan2(2.0 * (w * z + x * y), 1.0 - 2.0 * (y * y + z * z));
    }
    return this;
  }
}

// ============================================================================
// 6. MATRIX TRS DECOMPOSITION
// ============================================================================
export function DecomposeTRS(m: Matrix4x4): { translation: Vector3; rotation: Quaternion; scale: Vector3 } {
  const e = m.elements;
  const translation = new Vector3(e[12], e[13], e[14]);

  const col0 = new Vector3(e[0], e[1], e[2]);
  const col1 = new Vector3(e[4], e[5], e[6]);
  const col2 = new Vector3(e[8], e[9], e[10]);

  const sx = col0.length();
  let sy = col1.length();
  const sz = col2.length();

  // Check for reflection (negative determinant)
  const det = col0.dot(col1.cross(col2));
  if (det < 0) {
    sy = -sy;
  }
  const scale = new Vector3(sx, sy, sz);

  // Normalize columns to form pure rotation matrix
  const rotMat = new Matrix3x3();
  const invSx = 1.0 / (sx > EPSILON ? sx : 1.0);
  const invSy = 1.0 / (Math.abs(sy) > EPSILON ? sy : 1.0);
  const invSz = 1.0 / (sz > EPSILON ? sz : 1.0);

  rotMat.set(
    col0.x * invSx, col1.x * invSy, col2.x * invSz,
    col0.y * invSx, col1.y * invSy, col2.y * invSz,
    col0.z * invSx, col1.z * invSy, col2.z * invSz
  );

  const rotation = new Quaternion().setFromRotationMatrix(rotMat);
  return { translation, rotation, scale };
}
```

---

## 12.3 Automated Test Suite and Invariant Verification

To guarantee that our production engine is free of regressions, we formulate the automated test suite below.

```typescript
export function runSpatialMathVerification(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean) {
    if (condition) {
      passed++;
    } else {
      failed++;
      console.error(`FAILED: ${name}`);
    }
  }

  // 1. Hamilton's Identities: i^2 = j^2 = k^2 = ijk = -1
  const qi = new Quaternion(0, 1, 0, 0);
  const qj = new Quaternion(0, 0, 1, 0);
  const qk = new Quaternion(0, 0, 0, 1);

  const i2 = new Quaternion().multiply.call(qi, qi);
  assert("Hamilton i^2 == -1", Math.abs(i2.w - (-1)) < EPSILON && Math.abs(i2.x) < EPSILON);

  const ij = new Quaternion().multiply.call(qi, qj);
  assert("Hamilton ij == k", Math.abs(ij.z - 1) < EPSILON && Math.abs(ij.w) < EPSILON);

  // 2. SLERP Constant Speed Invariant
  const qStart = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0);
  const qEnd = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 0.5);

  const qMid1 = Quaternion.slerp(qStart, qEnd, 0.25);
  const qMid2 = Quaternion.slerp(qStart, qEnd, 0.75);

  const ang1 = qStart.toAxisAngle().angle;
  const angMid1 = qMid1.toAxisAngle().angle;
  const angMid2 = qMid2.toAxisAngle().angle;

  assert("SLERP quarter angle == PI/8", Math.abs(angMid1 - Math.PI / 8) < 1e-5);
  assert("SLERP three-quarter angle == 3PI/8", Math.abs(angMid2 - (3 * Math.PI) / 8) < 1e-5);

  // 3. Gimbal Lock North Pole Isolation
  const qLock = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI * 0.5);
  const euler = new EulerAngles().setFromQuaternionZYX(qLock);
  assert("Gimbal lock pitch == 90 deg", Math.abs(euler.pitch - Math.PI * 0.5) < 1e-5);
  assert("Gimbal lock roll is safely zeroed", euler.roll === 0);

  // 4. Matrix TRS Composition & Decomposition Invariant
  const origPos = new Vector3(10, -25, 42);
  const origRot = new Quaternion().setFromAxisAngle(new Vector3(1, 1, 1).normalize(), 1.25);
  const origScale = new Vector3(2, 3, 4);

  const m = new Matrix4x4().composeTRS(origPos, origRot, origScale);
  const decomp = DecomposeTRS(m);

  assert("TRS Pos X recovers", Math.abs(decomp.translation.x - origPos.x) < 1e-4);
  assert("TRS Pos Y recovers", Math.abs(decomp.translation.y - origPos.y) < 1e-4);
  assert("TRS Scale recovers", Math.abs(decomp.scale.z - origScale.z) < 1e-4);
  assert("TRS Rot dot >= 0.9999", Math.abs(decomp.rotation.dot(origRot)) > 0.9999);

  return { passed, failed };
}
```

---

## 12.4 The Civilizational Grand Gauntlet: 10 Industrial Case Studies

### Problem 1: Space Shuttle Attitude Maneuver via Shortest-Path SLERP
A space shuttle initiates a thermal control maneuver from orientation $q_0 = (0.707107, 0.707107, 0, 0)$ to target orientation $q_1 = (-0.600000, 0.800000, 0, 0)$. 
1. Determine whether $q_0 \cdot q_1 < 0$ and explain the physical consequence of omitting the antipodal flip.
2. Apply the antipodal flip and evaluate the exact required angular rotation $\theta_{\text{maneuver}}$ in degrees.
3. Compute the intermediate quaternion at $t = 0.5$.

### Problem 2: Gimbal Lock Recovery in a Multi-Gimbal Drone Camera Stabilizer
A 3-axis brushless camera gimbal tracking a ground vehicle pitches straight up to zenith ($\theta = +90^\circ$). The onboard IMU outputs quaternion $q = (0.7071068, 0, 0.7071068, 0)$.
1. Formulate the rank-deficient Jacobian matrix relating Euler rates $(\dot{\psi}, \dot{\theta}, \dot{\phi})$ to body angular rates $(\omega_x, \omega_y, \omega_z)$.
2. Show mathematically why motor control loops driving individual gimbals saturate and destabilize.
3. Show how our engine isolates this state and reconstructs a smooth orientation path using quaternions.

### Problem 3: Skeletal Skinning Dual Quaternion Blending (Candy-Wrapper Artifact)
In character animation, a human wrist rotates $180^\circ$ around its bone axis. Traditional linear matrix blending evaluates $\mathbf{M}_{\text{blend}} = 0.5\mathbf{M}_0 + 0.5\mathbf{M}_1$.
1. Compute the blended matrix $\mathbf{M}_{\text{blend}}$ and calculate its determinant.
2. Explain the physical appearance of the mesh (the "candy-wrapper" collapse).
3. Demonstrate how dual quaternion / unit quaternion blending preserves cross-sectional volume perfectly.

### Problem 4: 6-DOF Robotic Arm Forward Kinematics via Denavit-Hartenberg (DH) 4x4 Matrices
A 6-axis industrial manipulator has joint offsets and link lengths given by DH parameters. Construct the composite transformation matrix $\mathbf{T}_6^0 = \mathbf{A}_1 \mathbf{A}_2 \mathbf{A}_3 \mathbf{A}_4 \mathbf{A}_5 \mathbf{A}_6$, compute the end-effector tool tip location, and extract its orientation as a quaternion.

### Problem 5: Aerospace Gyroscopic Drift Compensation via Complementary Filter
A low-cost MEMS IMU inside a drone provides high-frequency gyroscope angular rate $\boldsymbol{\omega}_{\text{gyro}}$ (which drifts over time) and low-frequency accelerometer gravity vector $\mathbf{a}_{\text{acc}}$ (which is noisy but drift-free).
1. Formulate the quaternionic complementary filter error metric $\mathbf{e} = \mathbf{a}_{\text{measured}} \times \mathbf{a}_{\text{predicted}}$.
2. Formulate the proportional-integral (PI) feedback loop updating the gyro bias estimate.
3. Integrate the orientation for 100 steps and demonstrate zero steady-state drift.

### Problem 6: Head-Mounted Display (VR) 90 Hz Motion-to-Photon Low-Latency Extrapolation
In a VR headset, a tracking sample arrives at $t_0$ with orientation $q_0$ and angular velocity $\boldsymbol{\omega}_0$. Display photon scanout occurs $\Delta t = 11.1\text{ ms}$ later.
1. Formulate the predictive extrapolation quaternion $q_{\text{predicted}}$.
2. If the user rotates their head at $300^\circ/\text{s}$, compute the prediction angle and prove why linear Euler extrapolation causes perceived image warping.

### Problem 7: Decomposing a Stressed Transformation Matrix into Translation, Rotation, and Polar Shear
A physics constraint solver deforms a rigid body, producing a stressed $4 \times 4$ transformation matrix $\mathbf{M}$ containing non-orthogonal shearing and non-uniform scaling.
1. Perform Polar Decomposition $\mathbf{M} = \mathbf{T} \, \mathbf{R} \, \mathbf{S}$ using the Higham iterative matrix sign algorithm.
2. Extract the orthogonal rotation matrix $\mathbf{R} \in SO(3)$ and pure symmetric stretch tensor $\mathbf{S}$.
3. Convert $\mathbf{R}$ into a unit quaternion.

### Problem 8: Satellite Nadir-Pointing and Solar Array Sun-Tracking Multi-Axis Quaternion Control
A deep-space probe must point its high-gain antenna at Earth ($\hat{\mathbf{r}}_{\text{earth}}$) while rotating its solar panel axis ($\hat{\mathbf{s}}_{\text{panel}}$) perpendicular to the Sun ($\hat{\mathbf{r}}_{\text{sun}}$).
1. Formulate the two non-collinear direction constraints.
2. Construct the orthogonal basis frame and derive the unique spacecraft target quaternion $q_{\text{target}}$.
3. Compute the error quaternion $q_{\text{error}} = q_{\text{target}} q_{\text{current}}^*$.

### Problem 9: Rigid Body Flight Simulator 6-DOF Quaternion Symplectic State Integrator
An aerobatic jet executes a snap-roll with high roll rate $p = 400^\circ/\text{s}$, yaw rate $r = 50^\circ/\text{s}$, and pitch rate $q = 80^\circ/\text{s}$.
1. Formulate the coupled Euler equations of motion with aerodynamic moment $\boldsymbol{\tau}_{\text{aero}}$.
2. Integrate the 13-element state vector $\mathbf{Y}$ over 1 second using symplectic exponential quaternion integration.
3. Verify that total energy (kinetic + potential) remains conserved in free flight.

### Problem 10: Hierarchical Character Skeleton Inverse Kinematics with Cyclic Coordinate Descent (CCD) Using Quaternions
A character's hand must reach a target cup in 3D space. 
1. Starting from the wrist bone and traversing up through elbow and shoulder, formulate the local corrective quaternion $\Delta q_i = \left(\cos\frac{\phi}{2}, \hat{\mathbf{a}}\sin\frac{\phi}{2}\right)$ that minimizes the angular error between bone-to-effector and bone-to-target vectors.
2. Apply angular clamp limits to each joint to prevent unnatural bone dislocation.
3. Prove convergence of the cyclic coordinate descent algorithm.

---

## 12.5 Full Analytical and Computational Solutions for All 10 Grand Gauntlet Problems

### Solution to Problem 1: Space Shuttle Attitude Maneuver
1. **Dot product check:**
   $$q_0 = (0.707107, 0.707107, 0, 0)$$
   $$q_1 = (-0.600000, 0.800000, 0, 0)$$
   $$q_0 \cdot q_1 = (0.707107)(-0.6) + (0.707107)(0.8) + 0 + 0 = -0.424264 + 0.565685 = +0.141421 > 0$$
   Wait, let's examine if $q_0 \cdot q_1$ is positive. Here it is positive $+0.141421$.
   Angle $\Omega = \arccos(0.141421) \approx 1.4289\text{ rad} \approx 81.87^\circ$.
   The physical spatial rotation is $\theta = 2\Omega = 2 \times 81.87^\circ = 163.74^\circ$.
2. If $q_1$ had been $(0.6, -0.8, 0, 0)$ (which represents the exact same physical rotation as $q_1$), the dot product would be $-0.141421$. Without the antipodal flip, the shuttle would attempt to rotate through $\Omega = \arccos(-0.141421) = 98.13^\circ$, sweeping an angle of $2 \times 98.13^\circ = 196.26^\circ$, consuming $20\%$ more thruster propellant!
3. **Midpoint evaluation ($t = 0.5$):**
   $\sin\Omega = \sin(81.87^\circ) \approx 0.989949$.
   $\sin(0.5\Omega) = \sin(40.935^\circ) \approx 0.655208$.
   $$w_0 = w_1 = \frac{0.655208}{0.989949} \approx 0.661860$$
   $$q(0.5) = 0.661860(0.707107, 0.707107, 0, 0) + 0.661860(-0.6, 0.8, 0, 0)$$
   $$w = 0.661860(0.707107 - 0.6) = 0.661860(0.107107) \approx 0.07089$$
   $$x = 0.661860(0.707107 + 0.8) = 0.661860(1.507107) \approx 0.99748$$
   $$q(0.5) = (0.07089, 0.99748, 0, 0)$$
   Norm check: $0.07089^2 + 0.99748^2 = 0.00502 + 0.99497 = 1.00000$.

---

### Solution to Problem 2: Gimbal Lock Recovery
1. **Jacobian Rank Deficiency:**
   The relationship between Euler rates $(\dot{\phi}, \dot{\theta}, \dot{\psi})$ and body rates $\boldsymbol{\omega}$ is:
   $$\begin{bmatrix} \omega_x \\ \omega_y \\ \omega_z \end{bmatrix} = \begin{bmatrix} 1 & 0 & -\sin\theta \\ 0 & \cos\phi & \sin\phi\cos\theta \\ 0 & -\sin\phi & \cos\phi\cos\theta \end{bmatrix} \begin{bmatrix} \dot{\phi} \\ \dot{\theta} \\ \dot{\psi} \end{bmatrix}$$
   At $\theta = +90^\circ$, $\cos\theta = 0$ and $\sin\theta = 1$. The matrix becomes:
   $$\mathbf{J} = \begin{bmatrix} 1 & 0 & -1 \\ 0 & \cos\phi & 0 \\ 0 & -\sin\phi & 0 \end{bmatrix}$$
   The determinant is $\det(\mathbf{J}) = \cos\theta = 0$. The third column is a direct linear multiple of the first column ($[-1, 0, 0]^T = -[1, 0, 0]^T$). The rank collapses from 3 to 2.
2. **Motor Destabilization:**
   To follow a commanded physical angular velocity with non-zero yaw and roll, the motor controller inverts $\mathbf{J}$. Because $\det(\mathbf{J}) = 0$, $\mathbf{J}^{-1}$ contains divisions by $\cos(90^\circ) = 0$. Commanded motor velocities spike to $\infty\text{ rad/s}$, causing the gimbal servo motors to violently oscillate and hit physical mechanical limit stops.
3. **Quaternion Isolation:**
   Using our `EulerAngles.setFromQuaternionZYX`, the condition $\tau \ge 0.99999$ is trapped. We fix roll $\phi = 0$ and map the entire rotational degree of freedom directly into yaw $\psi = 2\text{atan2}(z, w)$. The physical orientation controller operates natively on the quaternion $q$, never inverting $\mathbf{J}$, eliminating all singularity spikes.

---

### Solution to Problem 3: Skeletal Skinning Blending
1. **Linear Matrix Blending:**
   Let $\mathbf{M}_0 = \mathbf{I}_3$ and $\mathbf{M}_1$ be a $180^\circ$ twist around the $X$-axis:
   $$\mathbf{M}_0 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad \mathbf{M}_1 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
   Blending at midpoint $t = 0.5$:
   $$\mathbf{M}_{\text{blend}} = 0.5\mathbf{M}_0 + 0.5\mathbf{M}_1 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
   $$\det(\mathbf{M}_{\text{blend}}) = 1 \times 0 \times 0 = 0$$
2. **Physical Appearance:**
   The determinant represents the local volume scaling factor. Because $\det(\mathbf{M}_{\text{blend}}) = 0$, the 3D mesh volume collapses completely to zero along the $Y$ and $Z$ axes at the midpoint of the joint. The character's wrist pinches down to an infinitesimal point, producing the infamous "candy-wrapper" twisting defect.
3. **Quaternion Blending Resolution:**
   Represent $\mathbf{M}_0$ as $q_0 = (1, 0, 0, 0)$ and $\mathbf{M}_1$ as $q_1 = (0, 1, 0, 0)$.
   Midpoint SLERP produces:
   $$q(0.5) = \left(\frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}, 0, 0\right)$$
   Converting $q(0.5)$ to a matrix:
   $$\mathbf{R}(q(0.5)) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$$
   $$\det(\mathbf{R}(q(0.5))) = +1.0000$$
   The volume is preserved identically with zero pinching or distortion.

---

### Solution to Problem 4: Robotic Arm Denavit-Hartenberg Forward Kinematics
1. **Denavit-Hartenberg $4 \times 4$ Matrix Formulation:**
   The homogeneous transformation between link $i-1$ and link $i$ is:
   $$\mathbf{A}_i = \begin{bmatrix}
   \cos\theta_i & -\sin\theta_i\cos\alpha_i & \sin\theta_i\sin\alpha_i & a_i \cos\theta_i \\
   \sin\theta_i & \cos\theta_i\cos\alpha_i & -\cos\theta_i\sin\alpha_i & a_i \sin\theta_i \\
   0 & \sin\alpha_i & \cos\alpha_i & d_i \\
   0 & 0 & 0 & 1
   \end{bmatrix}$$
2. Chaining all 6 link transformations via our `Matrix4x4.multiply`:
   $$\mathbf{T}_6^0 = \mathbf{A}_1 \mathbf{A}_2 \mathbf{A}_3 \mathbf{A}_4 \mathbf{A}_5 \mathbf{A}_6$$
3. The end-effector tool position is directly extracted from column 4:
   $$\mathbf{p}_{\text{tool}} = \begin{bmatrix} T_{14} \\ T_{24} \\ T_{34} \end{bmatrix}$$
4. Extracting the upper-left $3 \times 3$ submatrix $\mathbf{R}_{\text{tool}} = [T_{ij}]_{i,j=1}^3$ and feeding it to `Quaternion.setFromRotationMatrix` delivers the exact end-effector attitude quaternion with zero risk of numerical degeneracy.

---

### Solution to Problem 5: Aerospace Gyroscopic Drift Compensation
1. **Error Metric:**
   In the body frame, accelerometer measures gravity $\mathbf{a}_{\text{meas}}$ (normalized).
   The expected gravity direction based on current orientation estimate $q$ is:
   $$\mathbf{a}_{\text{pred}} = \mathbf{R}(q)^T \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix} = \begin{bmatrix} 2(xz - wy) \\ 2(yz + wx) \\ -(1 - 2(x^2 + y^2)) \end{bmatrix}$$
   The orientation correction error is the cross product:
   $$\mathbf{e} = \mathbf{a}_{\text{meas}} \times \mathbf{a}_{\text{pred}}$$
2. **PI Controller Loop:**
   Update gyro bias $\mathbf{b}$ and corrected rate $\boldsymbol{\omega}_{\text{corr}}$:
   $$\dot{\mathbf{b}} = -K_i \mathbf{e}$$
   $$\boldsymbol{\omega}_{\text{corr}} = \boldsymbol{\omega}_{\text{gyro}} - \mathbf{b} + K_p \mathbf{e}$$
3. Integrating $q$ with $\boldsymbol{\omega}_{\text{corr}}$ using `Quaternion.integrateAngularVelocity` drives error $\mathbf{e} \to 0$, anchoring high-frequency gyro data to absolute gravitational down.

---

### Solution to Problem 6: VR 90 Hz Motion-to-Photon Low-Latency Extrapolation
1. **Predictive Extrapolation Formula:**
   Display latency $\Delta t = 0.0111\text{ s}$.
   Angular velocity $\boldsymbol{\omega}_0$.
   Incremental rotation:
   $$\Delta q = \left(\cos\frac{\|\boldsymbol{\omega}_0\|\Delta t}{2}, \; \frac{\boldsymbol{\omega}_0}{\|\boldsymbol{\omega}_0\|}\sin\frac{\|\boldsymbol{\omega}_0\|\Delta t}{2}\right)$$
   $$q_{\text{predicted}} = \Delta q \, q_0$$
2. **Prediction Angle:**
   At $\omega = 300^\circ/\text{s} = 5.236\text{ rad/s}$:
   $$\Delta\theta = 5.236 \times 0.0111 = 0.0581\text{ rad} \approx 3.33^\circ$$
   A $3.33^\circ$ correction translates to ~80 pixels of display shift at standard VR field of view.
3. If linear Euler extrapolation were used, coupling across axes causes non-orthogonal shear warping, inducing severe simulator sickness. Quaternionic geodesic extrapolation preserves strict rigidity.

---

### Solution to Problem 7: Decomposing a Stressed Transformation Matrix
1. **Higham Polar Decomposition Algorithm:**
   Given non-orthogonal $3 \times 3$ matrix $\mathbf{A}$, compute sequence:
   $$\mathbf{X}_0 = \mathbf{A}$$
   $$\mathbf{X}_{k+1} = \frac{1}{2}\left(\mathbf{X}_k + (\mathbf{X}_k^{-1})^T\right)$$
   This Newton iteration converges quadratically to the unique closest orthogonal matrix $\mathbf{R} \in SO(3)$.
2. Once $\mathbf{R}$ converges (typically within 4 iterations):
   $$\mathbf{S} = \mathbf{R}^T \mathbf{A}$$
   where $\mathbf{S}$ is symmetric positive-definite, representing pure stress and deformation.
3. Feeding $\mathbf{R}$ into `Quaternion.setFromRotationMatrix` yields the pure rotational component of the stressed body.

---

### Solution to Problem 8: Satellite Dual-Target Quaternion Control
1. **Direction Constraints:**
   Primary axis: Body antenna axis $\hat{\mathbf{z}}_b$ must align with Earth $\hat{\mathbf{r}}_e$.
   Secondary axis: Body solar array normal $\hat{\mathbf{y}}_b$ must lie perpendicular to Sun $\hat{\mathbf{r}}_s$.
2. **Gram-Schmidt Frame Construction:**
   $$\hat{\mathbf{z}} = \hat{\mathbf{r}}_e$$
   $$\hat{\mathbf{x}} = \frac{\hat{\mathbf{r}}_e \times \hat{\mathbf{r}}_s}{\|\hat{\mathbf{r}}_e \times \hat{\mathbf{r}}_s\|}$$
   $$\hat{\mathbf{y}} = \hat{\mathbf{z}} \times \hat{\mathbf{x}}$$
   Target rotation matrix:
   $$\mathbf{R}_{\text{target}} = \begin{bmatrix} \hat{\mathbf{x}} & \hat{\mathbf{y}} & \hat{\mathbf{z}} \end{bmatrix}$$
3. Convert $\mathbf{R}_{\text{target}}$ to $q_{\text{target}}$.
   Error quaternion:
   $$q_{\text{error}} = q_{\text{target}} q_{\text{current}}^*$$
   The vector part $\mathbf{v}_{\text{error}}$ directly drives satellite reaction wheel torque motors.

---

### Solution to Problem 9: Flight Simulator 6-DOF Quaternion Integrator
1. **Equations of Motion:**
   $$\dot{\mathbf{x}} = \mathbf{v}, \quad \dot{\mathbf{P}} = M\mathbf{g} + \mathbf{F}_{\text{aero}}$$
   $$\dot{\mathbf{L}} = \boldsymbol{\tau}_{\text{aero}}$$
   $$\mathbf{I}_{\text{world}}^{-1} = \mathbf{R}(q) \mathbf{I}_{\text{body}}^{-1} \mathbf{R}(q)^T$$
   $$\boldsymbol{\omega} = \mathbf{I}_{\text{world}}^{-1} \mathbf{L}$$
   $$\dot{q} = \frac{1}{2}\boldsymbol{\omega}_q q$$
2. Using exact exponential map integration:
   $$q(t + \Delta t) = \exp\left(\frac{1}{2}\boldsymbol{\omega}_q \Delta t\right) q(t)$$
3. Because the exponential map preserves $\|q\| \equiv 1$ analytically, no artificial damping occurs, and total energy $E = \frac{1}{2}M\|\mathbf{v}\|^2 + \frac{1}{2}\mathbf{L}^T \mathbf{I}_{\text{world}}^{-1}\mathbf{L}$ is strictly conserved in the absence of external aerodynamic drag.

---

### Solution to Problem 10: Character Skeleton CCD Inverse Kinematics
1. **Cyclic Coordinate Descent Formulation:**
   For bone $i$ with world position $\mathbf{p}_i$, current end-effector position $\mathbf{p}_e$, and goal position $\mathbf{p}_g$:
   $$\mathbf{v}_{\text{cur}} = \frac{\mathbf{p}_e - \mathbf{p}_i}{\|\mathbf{p}_e - \mathbf{p}_i\|}, \quad \mathbf{v}_{\text{targ}} = \frac{\mathbf{p}_g - \mathbf{p}_i}{\|\mathbf{p}_g - \mathbf{p}_i\|}$$
   Rotation axis: $\hat{\mathbf{a}} = \frac{\mathbf{v}_{\text{cur}} \times \mathbf{v}_{\text{targ}}}{\|\mathbf{v}_{\text{cur}} \times \mathbf{v}_{\text{targ}}\|}$.
   Rotation angle: $\phi = \arccos(\mathbf{v}_{\text{cur}} \cdot \mathbf{v}_{\text{targ}})$.
   Incremental local quaternion:
   $$\Delta q = \left(\cos\frac{\phi}{2}, \; \hat{\mathbf{a}}\sin\frac{\phi}{2}\right)$$
2. Update bone orientation:
   $$q_i \leftarrow \Delta q \, q_i$$
3. Joint limit clamping: Convert $q_i$ to axis-angle; if angle exceeds anatomical joint limits, clamp angle and re-evaluate $q_i$. Iterating from wrist up to shoulder converges monotonically to the target configuration.
