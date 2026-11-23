/**
 * Production Zero-Dependency Computer Vision Engine (SMTS-40K Standard)
 * Module: cs-computer-vision-foundations
 * 
 * Provides production-grade algorithms for:
 * 1. ImageMatrix: 2D continuous/discrete multidimensional image buffer
 * 2. ConvolutionOps: 2D spatial convolution, separable Gaussian blur, Sobel, Laplacian
 * 3. CannyEdgeDetector: Complete 4-stage pipeline (Blur, Sobel, NMS, Hysteresis)
 * 4. PinholeCamera: Intrinsics K, Extrinsics [R|t], Radial distortion, Ray back-projection
 * 5. StereoTriangulator: Canonical rectified stereo disparity and metric 3D depth recovery
 * 6. HomographyEngine: Planar projective mapping, Hartley-normalized DLT SVD solver
 * 7. Conv2DLayer: Forward and analytical backward passes for 2D convolutional neural networks
 * 8. BoundingBoxOps: IoU, GIoU, and Greedy Non-Maximum Suppression (NMS)
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface BoundingBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface Ray3D {
  origin: Point3D;
  direction: Point3D;
}

// ============================================================================
// 1. ImageMatrix: 2D Multi-Channel Image Buffer
// ============================================================================

export class ImageMatrix {
  public readonly width: number;
  public readonly height: number;
  public readonly channels: number;
  public readonly data: Float64Array;

  constructor(width: number, height: number, channels: number = 1, initialData?: number[] | Float64Array) {
    if (width <= 0 || height <= 0 || channels <= 0) {
      throw new Error(`Invalid ImageMatrix dimensions: ${width}x${height}x${channels}`);
    }
    this.width = width;
    this.height = height;
    this.channels = channels;
    this.data = new Float64Array(width * height * channels);

    if (initialData) {
      if (initialData.length !== this.data.length) {
        throw new Error(`Initial data length ${initialData.length} does not match buffer size ${this.data.length}`);
      }
      this.data.set(initialData);
    }
  }

  public getIndex(y: number, x: number, c: number = 0): number {
    return (y * this.width + x) * this.channels + c;
  }

  public get(y: number, x: number, c: number = 0): number {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height || c < 0 || c >= this.channels) {
      throw new RangeError(`Coordinates out of bounds: (${x}, ${y}, ${c}) for size ${this.width}x${this.height}x${this.channels}`);
    }
    return this.data[this.getIndex(y, x, c)];
  }

  public set(y: number, x: number, c: number, value: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height || c < 0 || c >= this.channels) {
      throw new RangeError(`Coordinates out of bounds: (${x}, ${y}, ${c}) for size ${this.width}x${this.height}x${this.channels}`);
    }
    this.data[this.getIndex(y, x, c)] = value;
  }

  public getClamped(y: number, x: number, c: number = 0): number {
    const cx = Math.max(0, Math.min(this.width - 1, Math.round(x)));
    const cy = Math.max(0, Math.min(this.height - 1, Math.round(y)));
    const cc = Math.max(0, Math.min(this.channels - 1, Math.round(c)));
    return this.data[this.getIndex(cy, cx, cc)];
  }

  public bilinearSample(x: number, y: number, c: number = 0): number {
    const x1 = Math.floor(x);
    const y1 = Math.floor(y);
    const x2 = x1 + 1;
    const y2 = y1 + 1;

    const alpha = x - x1;
    const beta = y - y1;

    const v11 = this.getClamped(y1, x1, c);
    const v12 = this.getClamped(y1, x2, c);
    const v21 = this.getClamped(y2, x1, c);
    const v22 = this.getClamped(y2, x2, c);

    return (
      (1 - alpha) * (1 - beta) * v11 +
      alpha * (1 - beta) * v12 +
      (1 - alpha) * beta * v21 +
      alpha * beta * v22
    );
  }

  public clone(): ImageMatrix {
    const copy = new ImageMatrix(this.width, this.height, this.channels);
    copy.data.set(this.data);
    return copy;
  }

  public fill(value: number): void {
    this.data.fill(value);
  }

  public minMax(c: number = 0): { min: number; max: number } {
    let min = Infinity;
    let max = -Infinity;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const val = this.get(y, x, c);
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }
    return { min, max };
  }
}

// ============================================================================
// 2. ConvolutionOps: Spatial Filtering, Gradients, and Separable Blur
// ============================================================================

export class ConvolutionOps {
  /**
   * Evaluates 2D direct spatial convolution with clamp boundary padding.
   */
  public static convolve2D(image: ImageMatrix, kernel: number[][]): ImageMatrix {
    const kh = kernel.length;
    const kw = kernel[0].length;
    if (kh % 2 === 0 || kw % 2 === 0) {
      throw new Error(`Kernel dimensions must be odd, got ${kw}x${kh}`);
    }

    const radH = Math.floor(kh / 2);
    const radW = Math.floor(kw / 2);
    const output = new ImageMatrix(image.width, image.height, image.channels);

    for (let c = 0; c < image.channels; c++) {
      for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
          let sum = 0;
          for (let u = -radH; u <= radH; u++) {
            for (let v = -radW; v <= radW; v++) {
              const pixel = image.getClamped(y + u, x + v, c);
              // Convolution flips kernel: K[-u, -v]
              const kVal = kernel[radH - u][radW - v];
              sum += pixel * kVal;
            }
          }
          output.set(y, x, c, sum);
        }
      }
    }
    return output;
  }

  /**
   * Generates a 1D discrete normalized Gaussian kernel.
   */
  public static createGaussianKernel1D(sigma: number, radius?: number): Float64Array {
    if (sigma <= 0) {
      throw new Error(`Gaussian sigma must be positive, got ${sigma}`);
    }
    const r = radius !== undefined ? radius : Math.ceil(3 * sigma);
    const size = 2 * r + 1;
    const kernel = new Float64Array(size);

    let sum = 0;
    for (let i = -r; i <= r; i++) {
      const val = Math.exp(-(i * i) / (2 * sigma * sigma));
      kernel[i + r] = val;
      sum += val;
    }

    // Enforce unit energy sum (DC gain = 1.0)
    for (let i = 0; i < size; i++) {
      kernel[i] /= sum;
    }
    return kernel;
  }

  /**
   * Highly optimized separable 2D Gaussian blur: O(K^2) -> O(2K).
   */
  public static gaussianBlur(image: ImageMatrix, sigma: number): ImageMatrix {
    if (sigma <= 0) return image.clone();

    const kernel = this.createGaussianKernel1D(sigma);
    const r = Math.floor(kernel.length / 2);

    // Pass 1: Horizontal 1D Convolution
    const intermediate = new ImageMatrix(image.width, image.height, image.channels);
    for (let c = 0; c < image.channels; c++) {
      for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
          let sum = 0;
          for (let v = -r; v <= r; v++) {
            sum += image.getClamped(y, x + v, c) * kernel[v + r];
          }
          intermediate.set(y, x, c, sum);
        }
      }
    }

    // Pass 2: Vertical 1D Convolution
    const output = new ImageMatrix(image.width, image.height, image.channels);
    for (let c = 0; c < intermediate.channels; c++) {
      for (let y = 0; y < intermediate.height; y++) {
        for (let x = 0; x < intermediate.width; x++) {
          let sum = 0;
          for (let u = -r; u <= r; u++) {
            sum += intermediate.getClamped(y + u, x, c) * kernel[u + r];
          }
          output.set(y, x, c, sum);
        }
      }
    }
    return output;
  }

  /**
   * Computes horizontal and vertical Sobel gradient components, magnitude, and orientation.
   */
  public static sobelGradients(image: ImageMatrix): {
    gx: ImageMatrix;
    gy: ImageMatrix;
    magnitude: ImageMatrix;
    orientation: ImageMatrix;
  } {
    // Under 2D convolution (which reflects the kernel by 180 degrees),
    // the kernel [1, 0, -1] flips to [-1, 0, 1], computing I[x+1] - I[x-1].
    const sx = [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1]
    ];
    const sy = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ];

    const gx = this.convolve2D(image, sx);
    const gy = this.convolve2D(image, sy);

    const magnitude = new ImageMatrix(image.width, image.height, 1);
    const orientation = new ImageMatrix(image.width, image.height, 1);

    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const dx = gx.get(y, x, 0);
        const dy = gy.get(y, x, 0);

        const mag = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx); // [-PI, PI]

        magnitude.set(y, x, 0, mag);
        orientation.set(y, x, 0, angle);
      }
    }

    return { gx, gy, magnitude, orientation };
  }

  /**
   * Discrete Laplacian operator.
   */
  public static laplacian(image: ImageMatrix, eightConnected: boolean = false): ImageMatrix {
    const kernel = eightConnected
      ? [
          [1, 1, 1],
          [1, -8, 1],
          [1, 1, 1]
        ]
      : [
          [0, 1, 0],
          [1, -4, 1],
          [0, 1, 0]
        ];
    return this.convolve2D(image, kernel);
  }
}

// ============================================================================
// 3. CannyEdgeDetector: Complete 4-Stage Edge Extraction Pipeline
// ============================================================================

export class CannyEdgeDetector {
  public readonly sigma: number;
  public readonly lowThreshold: number;
  public readonly highThreshold: number;

  constructor(sigma: number = 1.0, lowThreshold: number = 30.0, highThreshold: number = 80.0) {
    if (lowThreshold > highThreshold) {
      throw new Error(`Low threshold (${lowThreshold}) cannot exceed high threshold (${highThreshold})`);
    }
    this.sigma = sigma;
    this.lowThreshold = lowThreshold;
    this.highThreshold = highThreshold;
  }

  public detect(image: ImageMatrix): ImageMatrix {
    // Stage 1: Gaussian Smoothing
    const blurred = ConvolutionOps.gaussianBlur(image, this.sigma);

    // Stage 2: Sobel Gradients
    const { magnitude, orientation } = ConvolutionOps.sobelGradients(blurred);

    // Stage 3: Non-Maximum Suppression (NMS)
    const nms = this.nonMaximumSuppression(magnitude, orientation);

    // Stage 4: Dual-Threshold Hysteresis and 8-Connected Edge Tracking
    return this.hysteresisThresholding(nms, this.lowThreshold, this.highThreshold);
  }

  private nonMaximumSuppression(magnitude: ImageMatrix, orientation: ImageMatrix): ImageMatrix {
    const width = magnitude.width;
    const height = magnitude.height;
    const suppressed = new ImageMatrix(width, height, 1);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const mag = magnitude.get(y, x, 0);
        let angle = orientation.get(y, x, 0) * (180 / Math.PI); // degrees
        if (angle < 0) angle += 180;

        let q = 0;
        let r = 0;

        // Sector 0: Horizontal (0 deg)
        if ((angle >= 0 && angle < 22.5) || (angle >= 157.5 && angle <= 180)) {
          q = magnitude.get(y, x + 1, 0);
          r = magnitude.get(y, x - 1, 0);
        }
        // Sector 1: Diagonal Positive (45 deg)
        else if (angle >= 22.5 && angle < 67.5) {
          q = magnitude.get(y - 1, x + 1, 0);
          r = magnitude.get(y + 1, x - 1, 0);
        }
        // Sector 2: Vertical (90 deg)
        else if (angle >= 67.5 && angle < 112.5) {
          q = magnitude.get(y - 1, x, 0);
          r = magnitude.get(y + 1, x, 0);
        }
        // Sector 3: Diagonal Negative (135 deg)
        else if (angle >= 112.5 && angle < 157.5) {
          q = magnitude.get(y - 1, x - 1, 0);
          r = magnitude.get(y + 1, x + 1, 0);
        }

        if (mag >= q && mag >= r) {
          suppressed.set(y, x, 0, mag);
        } else {
          suppressed.set(y, x, 0, 0);
        }
      }
    }
    return suppressed;
  }

  private hysteresisThresholding(nms: ImageMatrix, lowThresh: number, highThresh: number): ImageMatrix {
    const width = nms.width;
    const height = nms.height;
    const edges = new ImageMatrix(width, height, 1);

    // 0: Non-edge, 1: Weak edge, 2: Strong edge
    const state = new Uint8Array(width * height);
    const queue: number[] = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const val = nms.get(y, x, 0);
        const idx = y * width + x;
        if (val >= highThresh) {
          state[idx] = 2;
          queue.push(idx);
          edges.set(y, x, 0, 1.0);
        } else if (val >= lowThresh) {
          state[idx] = 1;
        } else {
          state[idx] = 0;
        }
      }
    }

    // Iterative 8-connected BFS traversal
    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const cy = Math.floor(curr / width);
      const cx = curr % width;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = cy + dy;
          const nx = cx + dx;

          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const nIdx = ny * width + nx;
            if (state[nIdx] === 1) {
              state[nIdx] = 2; // Promote weak to strong
              edges.set(ny, nx, 0, 1.0);
              queue.push(nIdx);
            }
          }
        }
      }
    }
    return edges;
  }
}

// ============================================================================
// 4. PinholeCamera: Intrinsics, Extrinsics, Distortion, and Ray Projection
// ============================================================================

export interface CameraIntrinsics {
  fx: number;
  fy: number;
  cx: number;
  cy: number;
  s?: number;
}

export interface RadialDistortion {
  k1: number;
  k2: number;
}

export class PinholeCamera {
  public readonly fx: number;
  public readonly fy: number;
  public readonly cx: number;
  public readonly cy: number;
  public readonly s: number;
  public readonly distortion: RadialDistortion;

  // Extrinsics: R in SO(3), t in R^3
  public R: number[][];
  public t: number[];

  constructor(
    intrinsics: CameraIntrinsics,
    extrinsics?: { R: number[][]; t: number[] },
    distortion?: RadialDistortion
  ) {
    this.fx = intrinsics.fx;
    this.fy = intrinsics.fy;
    this.cx = intrinsics.cx;
    this.cy = intrinsics.cy;
    this.s = intrinsics.s ?? 0;

    this.distortion = distortion ?? { k1: 0, k2: 0 };
    this.R = extrinsics?.R ?? [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    this.t = extrinsics?.t ?? [0, 0, 0];
  }

  /**
   * Computes the optical center C in world coordinates: C = -R^T * t
   */
  public getOpticalCenter(): Point3D {
    const RT = this.transposeMatrix3x3(this.R);
    return {
      x: -(RT[0][0] * this.t[0] + RT[0][1] * this.t[1] + RT[0][2] * this.t[2]),
      y: -(RT[1][0] * this.t[0] + RT[1][1] * this.t[1] + RT[1][2] * this.t[2]),
      z: -(RT[2][0] * this.t[0] + RT[2][1] * this.t[1] + RT[2][2] * this.t[2])
    };
  }

  /**
   * Projects a 3D world coordinate onto the 2D image plane (with optional radial distortion).
   */
  public project(worldPoint: Point3D, applyDistortion: boolean = false): Point2D {
    // Transform to camera frame: X_C = R * X_W + t
    const xc = this.R[0][0] * worldPoint.x + this.R[0][1] * worldPoint.y + this.R[0][2] * worldPoint.z + this.t[0];
    const yc = this.R[1][0] * worldPoint.x + this.R[1][1] * worldPoint.y + this.R[1][2] * worldPoint.z + this.t[1];
    const zc = this.R[2][0] * worldPoint.x + this.R[2][1] * worldPoint.y + this.R[2][2] * worldPoint.z + this.t[2];

    if (zc <= 0) {
      throw new Error(`Point is behind camera aperture (Z_C = ${zc})`);
    }

    // Normalized coordinates
    let xn = xc / zc;
    let yn = yc / zc;

    // Apply Brown-Conrady radial distortion
    if (applyDistortion && (this.distortion.k1 !== 0 || this.distortion.k2 !== 0)) {
      const r2 = xn * xn + yn * yn;
      const radialFactor = 1 + this.distortion.k1 * r2 + this.distortion.k2 * r2 * r2;
      xn *= radialFactor;
      yn *= radialFactor;
    }

    // Map through intrinsics K
    const u = this.fx * xn + this.s * yn + this.cx;
    const v = this.fy * yn + this.cy;

    return { x: u, y: v };
  }

  /**
   * Back-projects a 2D pixel to an unconstrained 3D ray in world coordinates.
   */
  public backProjectRay(pixel: Point2D): Ray3D {
    const xn = (pixel.x - this.cx) / this.fx;
    const yn = (pixel.y - this.cy) / this.fy;

    // Ray direction in camera frame: [xn, yn, 1]^T
    const RT = this.transposeMatrix3x3(this.R);
    const dx = RT[0][0] * xn + RT[0][1] * yn + RT[0][2] * 1.0;
    const dy = RT[1][0] * xn + RT[1][1] * yn + RT[1][2] * 1.0;
    const dz = RT[2][0] * xn + RT[2][1] * yn + RT[2][2] * 1.0;

    const norm = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const center = this.getOpticalCenter();

    return {
      origin: center,
      direction: { x: dx / norm, y: dy / norm, z: dz / norm }
    };
  }

  /**
   * Intersects a 2D pixel ray with a known world planar surface: n^T * X + d = 0.
   */
  public intersectPlane(pixel: Point2D, planeNormal: Point3D, planeOffset: number): Point3D {
    const ray = this.backProjectRay(pixel);
    const n = planeNormal;
    const c = ray.origin;
    const d = ray.direction;

    const numerator = -(planeOffset + (n.x * c.x + n.y * c.y + n.z * c.z));
    const denominator = n.x * d.x + n.y * d.y + n.z * d.z;

    if (Math.abs(denominator) < 1e-9) {
      throw new Error("Ray is parallel to the plane (no intersection)");
    }

    const lambda = numerator / denominator;
    if (lambda < 0) {
      throw new Error("Plane intersection lies behind camera optical center");
    }

    return {
      x: c.x + lambda * d.x,
      y: c.y + lambda * d.y,
      z: c.z + lambda * d.z
    };
  }

  private transposeMatrix3x3(m: number[][]): number[][] {
    return [
      [m[0][0], m[1][0], m[2][0]],
      [m[0][1], m[1][1], m[2][1]],
      [m[0][2], m[1][2], m[2][2]]
    ];
  }
}

// ============================================================================
// 5. StereoTriangulator: Canonical Rectified Depth and 3D Reprojection
// ============================================================================

export class StereoTriangulator {
  public readonly baseline: number; // meters
  public readonly focalLength: number; // pixels
  public readonly cx: number;
  public readonly cy: number;

  constructor(baseline: number, focalLength: number, cx: number, cy: number) {
    if (baseline <= 0 || focalLength <= 0) {
      throw new Error(`Baseline and focal length must be positive: b=${baseline}, f=${focalLength}`);
    }
    this.baseline = baseline;
    this.focalLength = focalLength;
    this.cx = cx;
    this.cy = cy;
  }

  /**
   * Computes metric depth Z = (f * b) / d.
   */
  public computeDepth(disparity: number): number {
    if (disparity <= 0) {
      throw new Error(`Disparity must be positive, got ${disparity}`);
    }
    return (this.focalLength * this.baseline) / disparity;
  }

  /**
   * Triangulates a 3D metric point (X, Y, Z) in the left camera frame.
   */
  public triangulate(uL: number, uR: number, v: number): Point3D {
    const disparity = uL - uR;
    const z = this.computeDepth(disparity);
    const x = ((uL - this.cx) * z) / this.focalLength;
    const y = ((v - this.cy) * z) / this.focalLength;
    return { x, y, z };
  }

  /**
   * Calculates theoretical depth uncertainty: Delta Z = (Z^2 / (f * b)) * Delta d.
   */
  public depthUncertainty(depth: number, disparityError: number = 0.5): number {
    return ((depth * depth) / (this.focalLength * this.baseline)) * disparityError;
  }
}

// ============================================================================
// 6. HomographyEngine: Planar Projective Transformations & DLT Solver
// ============================================================================

export class HomographyEngine {
  public matrix: number[][];

  constructor(matrix?: number[][]) {
    this.matrix = matrix ?? [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  public apply(point: Point2D): Point2D {
    const x = point.x;
    const y = point.y;
    const h = this.matrix;

    const u = h[0][0] * x + h[0][1] * y + h[0][2];
    const v = h[1][0] * x + h[1][1] * y + h[1][2];
    const w = h[2][0] * x + h[2][1] * y + h[2][2];

    if (Math.abs(w) < 1e-12) {
      throw new Error("Point maps to projective infinity (w = 0)");
    }
    return { x: u / w, y: v / w };
  }

  public invert(): HomographyEngine {
    const m = this.matrix;
    const det =
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    if (Math.abs(det) < 1e-12) {
      throw new Error("Homography matrix is singular and non-invertible");
    }

    const invDet = 1.0 / det;
    const inv: number[][] = [
      [
        (m[1][1] * m[2][2] - m[1][2] * m[2][1]) * invDet,
        (m[0][2] * m[2][1] - m[0][1] * m[2][2]) * invDet,
        (m[0][1] * m[1][2] - m[0][2] * m[1][1]) * invDet
      ],
      [
        (m[1][2] * m[2][0] - m[1][0] * m[2][2]) * invDet,
        (m[0][0] * m[2][2] - m[0][2] * m[2][0]) * invDet,
        (m[0][2] * m[1][0] - m[0][0] * m[1][2]) * invDet
      ],
      [
        (m[1][0] * m[2][1] - m[1][1] * m[2][0]) * invDet,
        (m[0][1] * m[2][0] - m[0][0] * m[2][1]) * invDet,
        (m[0][0] * m[1][1] - m[0][1] * m[1][0]) * invDet
      ]
    ];
    return new HomographyEngine(inv);
  }

  /**
   * Solves planar homography from >= 4 point correspondences via DLT with Hartley normalization.
   */
  public static solveDLT(srcPoints: Point2D[], dstPoints: Point2D[]): HomographyEngine {
    if (srcPoints.length < 4 || dstPoints.length < 4 || srcPoints.length !== dstPoints.length) {
      throw new Error(`DLT requires >= 4 matched point pairs, got ${srcPoints.length} and ${dstPoints.length}`);
    }

    const N = srcPoints.length;

    // Hartley normalization
    const { T: Tsrc, normalized: normSrc } = this.hartleyNormalize(srcPoints);
    const { T: Tdst, normalized: normDst } = this.hartleyNormalize(dstPoints);

    // Build 2N x 9 measurement matrix A
    const A: number[][] = [];
    for (let i = 0; i < N; i++) {
      const x = normSrc[i].x;
      const y = normSrc[i].y;
      const u = normDst[i].x;
      const v = normDst[i].y;

      A.push([-x, -y, -1, 0, 0, 0, u * x, u * y, u]);
      A.push([0, 0, 0, -x, -y, -1, v * x, v * y, v]);
    }

    // Solve Ah = 0 via ATA smallest eigenvector (Power iteration / SVD nullspace)
    const ATA = this.computeATA(A);
    const h = this.smallestEigenvector(ATA);

    const Hnorm: number[][] = [
      [h[0], h[1], h[2]],
      [h[3], h[4], h[5]],
      [h[6], h[7], h[8]]
    ];

    // De-normalize: H = Tdst^(-1) * Hnorm * Tsrc
    const TdstInv = new HomographyEngine(Tdst).invert().matrix;
    const temp = this.multiply3x3(Hnorm, Tsrc);
    const H = this.multiply3x3(TdstInv, temp);

    // Normalize so H[2][2] = 1.0 (if non-zero)
    if (Math.abs(H[2][2]) > 1e-9) {
      const scale = 1.0 / H[2][2];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          H[r][c] *= scale;
        }
      }
    }

    return new HomographyEngine(H);
  }

  private static hartleyNormalize(points: Point2D[]): { T: number[][]; normalized: Point2D[] } {
    let meanX = 0;
    let meanY = 0;
    for (const p of points) {
      meanX += p.x;
      meanY += p.y;
    }
    meanX /= points.length;
    meanY /= points.length;

    let avgDist = 0;
    for (const p of points) {
      const dx = p.x - meanX;
      const dy = p.y - meanY;
      avgDist += Math.sqrt(dx * dx + dy * dy);
    }
    avgDist /= points.length;
    const s = avgDist > 1e-9 ? Math.SQRT2 / avgDist : 1.0;

    const T: number[][] = [
      [s, 0, -s * meanX],
      [0, s, -s * meanY],
      [0, 0, 1]
    ];

    const normalized: Point2D[] = points.map(p => ({
      x: s * (p.x - meanX),
      y: s * (p.y - meanY)
    }));

    return { T, normalized };
  }

  private static computeATA(A: number[][]): number[][] {
    const rows = A.length;
    const cols = A[0].length;
    const ATA: number[][] = Array.from({ length: cols }, () => new Array(cols).fill(0));

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < cols; j++) {
        let sum = 0;
        for (let r = 0; r < rows; r++) {
          sum += A[r][i] * A[r][j];
        }
        ATA[i][j] = sum;
      }
    }
    return ATA;
  }

  /**
   * Computes the eigenvector corresponding to the smallest eigenvalue of symmetric matrix M
   * using the Jacobi eigenvalue decomposition algorithm.
   */
  private static smallestEigenvector(M: number[][]): number[] {
    const n = M.length;
    // Clone M into A
    const A = M.map(row => [...row]);
    // Initialize V as identity matrix
    const V: number[][] = Array.from({ length: n }, (_, i) => {
      const row = new Array(n).fill(0);
      row[i] = 1.0;
      return row;
    });

    const maxSweeps = 50;
    for (let sweep = 0; sweep < maxSweeps; sweep++) {
      let maxOffDiag = 0;
      for (let p = 0; p < n; p++) {
        for (let q = p + 1; q < n; q++) {
          const val = Math.abs(A[p][q]);
          if (val > maxOffDiag) maxOffDiag = val;
        }
      }
      if (maxOffDiag < 1e-12) break;

      for (let p = 0; p < n; p++) {
        for (let q = p + 1; q < n; q++) {
          const apq = A[p][q];
          if (Math.abs(apq) < 1e-15) continue;

          const app = A[p][p];
          const aqq = A[q][q];
          const tau = (aqq - app) / (2.0 * apq);
          let t: number;
          if (tau >= 0) {
            t = 1.0 / (tau + Math.sqrt(1.0 + tau * tau));
          } else {
            t = -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
          }
          const c = 1.0 / Math.sqrt(1.0 + t * t);
          const s = t * c;

          // Apply rotation to A
          A[p][p] = app - t * apq;
          A[q][q] = aqq + t * apq;
          A[p][q] = 0;
          A[q][p] = 0;

          for (let k = 0; k < n; k++) {
            if (k !== p && k !== q) {
              const akp = A[k][p];
              const akq = A[k][q];
              A[k][p] = c * akp - s * akq;
              A[p][k] = A[k][p];
              A[k][q] = s * akp + c * akq;
              A[q][k] = A[k][q];
            }
          }

          // Accumulate rotation in V
          for (let k = 0; k < n; k++) {
            const vkp = V[k][p];
            const vkq = V[k][q];
            V[k][p] = c * vkp - s * vkq;
            V[k][q] = s * vkp + c * vkq;
          }
        }
      }
    }

    // Find column of V corresponding to the smallest eigenvalue A[i][i]
    let minIdx = 0;
    let minVal = A[0][0];
    for (let i = 1; i < n; i++) {
      if (A[i][i] < minVal) {
        minVal = A[i][i];
        minIdx = i;
      }
    }

    const vec: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      vec[i] = V[i][minIdx];
    }
    return vec;
  }

  private static multiply3x3(A: number[][], B: number[][]): number[][] {
    const C: number[][] = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
      }
    }
    return C;
  }
}

// ============================================================================
// 7. Conv2DLayer: Forward and Analytical Backward Neural Network Layer
// ============================================================================

export class Conv2DLayer {
  public readonly inChannels: number;
  public readonly outChannels: number;
  public readonly kernelSize: number;
  public readonly stride: number;
  public readonly padding: number;

  // Weights: [outChannels][inChannels][kernelSize][kernelSize]
  public weights: Float64Array;
  // Biases: [outChannels]
  public biases: Float64Array;

  // Cached forward activations for backprop
  private lastInput: ImageMatrix | null = null;

  constructor(
    inChannels: number,
    outChannels: number,
    kernelSize: number = 3,
    stride: number = 1,
    padding: number = 0,
    initialWeights?: Float64Array,
    initialBiases?: Float64Array
  ) {
    this.inChannels = inChannels;
    this.outChannels = outChannels;
    this.kernelSize = kernelSize;
    this.stride = stride;
    this.padding = padding;

    const numWeights = outChannels * inChannels * kernelSize * kernelSize;
    this.weights = new Float64Array(numWeights);
    this.biases = new Float64Array(outChannels);

    if (initialWeights) {
      this.weights.set(initialWeights);
    } else {
      // He / Kaiming normal initialization
      const std = Math.sqrt(2.0 / (inChannels * kernelSize * kernelSize));
      for (let i = 0; i < numWeights; i++) {
        this.weights[i] = (Math.random() * 2 - 1) * std;
      }
    }

    if (initialBiases) {
      this.biases.set(initialBiases);
    }
  }

  public getWeightIndex(cout: number, cin: number, u: number, v: number): number {
    return ((cout * this.inChannels + cin) * this.kernelSize + u) * this.kernelSize + v;
  }

  public forward(input: ImageMatrix): ImageMatrix {
    if (input.channels !== this.inChannels) {
      throw new Error(`Input channels ${input.channels} does not match layer inChannels ${this.inChannels}`);
    }

    this.lastInput = input.clone();

    const hOut = Math.floor((input.height - this.kernelSize + 2 * this.padding) / this.stride) + 1;
    const wOut = Math.floor((input.width - this.kernelSize + 2 * this.padding) / this.stride) + 1;

    const output = new ImageMatrix(wOut, hOut, this.outChannels);

    for (let cout = 0; cout < this.outChannels; cout++) {
      const bias = this.biases[cout];
      for (let y = 0; y < hOut; y++) {
        for (let x = 0; x < wOut; x++) {
          let sum = bias;
          for (let cin = 0; cin < this.inChannels; cin++) {
            for (let u = 0; u < this.kernelSize; u++) {
              for (let v = 0; v < this.kernelSize; v++) {
                const inY = y * this.stride + u - this.padding;
                const inX = x * this.stride + v - this.padding;

                if (inY >= 0 && inY < input.height && inX >= 0 && inX < input.width) {
                  const pixel = input.get(inY, inX, cin);
                  const w = this.weights[this.getWeightIndex(cout, cin, u, v)];
                  sum += pixel * w;
                }
              }
            }
          }
          output.set(y, x, cout, sum);
        }
      }
    }
    return output;
  }

  /**
   * Computes exact analytical gradients for weights, biases, and input activations.
   */
  public backward(gradOutput: ImageMatrix): {
    gradWeights: Float64Array;
    gradBiases: Float64Array;
    gradInput: ImageMatrix;
  } {
    if (!this.lastInput) {
      throw new Error("Cannot run backward before running forward pass");
    }

    const input = this.lastInput;
    const gradWeights = new Float64Array(this.weights.length);
    const gradBiases = new Float64Array(this.biases.length);
    const gradInput = new ImageMatrix(input.width, input.height, input.channels);

    // 1. Bias gradient: sum over spatial dimensions
    for (let cout = 0; cout < this.outChannels; cout++) {
      let bSum = 0;
      for (let y = 0; y < gradOutput.height; y++) {
        for (let x = 0; x < gradOutput.width; x++) {
          bSum += gradOutput.get(y, x, cout);
        }
      }
      gradBiases[cout] = bSum;
    }

    // 2. Weight gradient & Input gradient
    for (let cout = 0; cout < this.outChannels; cout++) {
      for (let y = 0; y < gradOutput.height; y++) {
        for (let x = 0; x < gradOutput.width; x++) {
          const delta = gradOutput.get(y, x, cout);

          for (let cin = 0; cin < this.inChannels; cin++) {
            for (let u = 0; u < this.kernelSize; u++) {
              for (let v = 0; v < this.kernelSize; v++) {
                const inY = y * this.stride + u - this.padding;
                const inX = x * this.stride + v - this.padding;

                if (inY >= 0 && inY < input.height && inX >= 0 && inX < input.width) {
                  const pixel = input.get(inY, inX, cin);
                  const wIdx = this.getWeightIndex(cout, cin, u, v);

                  // dL/dW += delta * X
                  gradWeights[wIdx] += delta * pixel;

                  // dL/dX += delta * W
                  const currentGradIn = gradInput.get(inY, inX, cin);
                  gradInput.set(inY, inX, cin, currentGradIn + delta * this.weights[wIdx]);
                }
              }
            }
          }
        }
      }
    }

    return { gradWeights, gradBiases, gradInput };
  }
}

// ============================================================================
// 8. BoundingBoxOps: IoU, GIoU, and Non-Maximum Suppression (NMS)
// ============================================================================

export class BoundingBoxOps {
  public static computeArea(b: BoundingBox): number {
    const w = Math.max(0, b.xMax - b.xMin);
    const h = Math.max(0, b.yMax - b.yMin);
    return w * h;
  }

  public static computeIoU(b1: BoundingBox, b2: BoundingBox): number {
    const xMin = Math.max(b1.xMin, b2.xMin);
    const yMin = Math.max(b1.yMin, b2.yMin);
    const xMax = Math.min(b1.xMax, b2.xMax);
    const yMax = Math.min(b1.yMax, b2.yMax);

    const interW = Math.max(0, xMax - xMin);
    const interH = Math.max(0, yMax - yMin);
    const interArea = interW * interH;

    const area1 = this.computeArea(b1);
    const area2 = this.computeArea(b2);
    const unionArea = area1 + area2 - interArea;

    if (unionArea <= 0) return 0.0;
    return interArea / unionArea;
  }

  public static computeGIoU(b1: BoundingBox, b2: BoundingBox): number {
    const iou = this.computeIoU(b1, b2);

    // Smallest enclosing box C
    const cXMin = Math.min(b1.xMin, b2.xMin);
    const cYMin = Math.min(b1.yMin, b2.yMin);
    const cXMax = Math.max(b1.xMax, b2.xMax);
    const cYMax = Math.max(b1.yMax, b2.yMax);

    const cArea = (cXMax - cXMin) * (cYMax - cYMin);
    if (cArea <= 0) return iou;

    const area1 = this.computeArea(b1);
    const area2 = this.computeArea(b2);
    const interW = Math.max(0, Math.min(b1.xMax, b2.xMax) - Math.max(b1.xMin, b2.xMin));
    const interH = Math.max(0, Math.min(b1.yMax, b2.yMax) - Math.max(b1.yMin, b2.yMin));
    const interArea = interW * interH;
    const unionArea = area1 + area2 - interArea;

    const emptyArea = cArea - unionArea;
    return iou - emptyArea / cArea;
  }

  public static nonMaximumSuppression(
    boxes: BoundingBox[],
    scores: number[],
    iouThreshold: number = 0.5
  ): number[] {
    if (boxes.length !== scores.length) {
      throw new Error("Box and score array lengths must match");
    }

    // Sort indices by descending score
    const indices = Array.from({ length: boxes.length }, (_, i) => i);
    indices.sort((a, b) => scores[b] - scores[a]);

    const keep: number[] = [];
    const suppressed = new Uint8Array(boxes.length);

    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      if (suppressed[idx]) continue;

      keep.push(idx);

      for (let j = i + 1; j < indices.length; j++) {
        const nextIdx = indices[j];
        if (suppressed[nextIdx]) continue;

        const iou = this.computeIoU(boxes[idx], boxes[nextIdx]);
        if (iou > iouThreshold) {
          suppressed[nextIdx] = 1;
        }
      }
    }
    return keep;
  }
}
