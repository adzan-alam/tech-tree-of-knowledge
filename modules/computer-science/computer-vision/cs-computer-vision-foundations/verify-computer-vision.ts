/**
 * Verification Test Suite for Computer Vision Engine (SMTS-40K)
 * Module: cs-computer-vision-foundations
 */

import {
  ImageMatrix,
  ConvolutionOps,
  CannyEdgeDetector,
  PinholeCamera,
  StereoTriangulator,
  HomographyEngine,
  Conv2DLayer,
  BoundingBoxOps,
  BoundingBox,
  Point2D,
  Point3D
} from "./computer-vision-engine.js";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertClose(actual: number, expected: number, tol: number = 1e-4, message: string = ""): void {
  const diff = Math.abs(actual - expected);
  if (diff > tol) {
    const msg = `FAIL: ${message} - Expected ${expected}, got ${actual} (diff: ${diff} > tol ${tol})`;
    console.error(msg);
    throw new Error(msg);
  }
}

console.log("===============================================================================");
console.log("   VERIFYING PRODUCTION COMPUTER VISION ENGINE (SMTS-40K)");
console.log("===============================================================================");

// ----------------------------------------------------------------------------
// 1. ImageMatrix Tests
// ----------------------------------------------------------------------------
console.log("\n[1/8] Testing ImageMatrix & Bilinear Interpolation...");
{
  const img = new ImageMatrix(4, 4, 1);
  assert(img.width === 4 && img.height === 4 && img.channels === 1, "Image dimensions check");

  img.set(1, 1, 0, 10.0);
  assertClose(img.get(1, 1, 0), 10.0, 1e-6, "Get/Set check");

  // Clamped access
  assertClose(img.getClamped(-2, -3, 0), img.get(0, 0, 0), 1e-6, "Clamped boundary negative");
  assertClose(img.getClamped(10, 10, 0), img.get(3, 3, 0), 1e-6, "Clamped boundary positive");

  // Bilinear interpolation test
  const testPatch = new ImageMatrix(2, 2, 1, [
    10.0, 20.0,
    30.0, 40.0
  ]);
  // Sample exact center (0.5, 0.5): average should be (10 + 20 + 30 + 40) / 4 = 25.0
  const sampledCenter = testPatch.bilinearSample(0.5, 0.5, 0);
  assertClose(sampledCenter, 25.0, 1e-5, "Bilinear interpolation center sample");

  const sampledCorner = testPatch.bilinearSample(0.0, 0.0, 0);
  assertClose(sampledCorner, 10.0, 1e-5, "Bilinear interpolation corner sample");

  console.log("  PASS: ImageMatrix buffer, clamped indexing, and bilinear sampling verified.");
}

// ----------------------------------------------------------------------------
// 2. ConvolutionOps Tests
// ----------------------------------------------------------------------------
console.log("\n[2/8] Testing ConvolutionOps & Separable Gaussian Filtering...");
{
  // Test DC gain preservation of Gaussian kernel
  const gKernel = ConvolutionOps.createGaussianKernel1D(1.0);
  let kSum = 0;
  for (let i = 0; i < gKernel.length; i++) kSum += gKernel[i];
  assertClose(kSum, 1.0, 1e-6, "Gaussian 1D kernel unit sum (energy conservation)");

  // Test uniform image blurring
  const uniformImg = new ImageMatrix(10, 10, 1);
  uniformImg.fill(50.0);
  const blurredUniform = ConvolutionOps.gaussianBlur(uniformImg, 1.5);
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      assertClose(blurredUniform.get(y, x, 0), 50.0, 1e-4, `Uniform blur DC preservation at (${x}, ${y})`);
    }
  }

  // Test Sobel gradient on sharp vertical step edge (Problem 3.2)
  const stepImg = new ImageMatrix(4, 4, 1, [
    10, 10, 80, 80,
    10, 10, 80, 80,
    10, 10, 80, 80,
    10, 10, 80, 80
  ]);
  const { gx, gy, magnitude, orientation } = ConvolutionOps.sobelGradients(stepImg);

  // At pixel (1, 1), Gx = 280, Gy = 0, Magnitude = 280, Orientation = 0 rad
  assertClose(gx.get(1, 1, 0), 280.0, 1e-4, "Sobel horizontal gradient Gx on vertical edge");
  assertClose(gy.get(1, 1, 0), 0.0, 1e-4, "Sobel vertical gradient Gy on vertical edge");
  assertClose(magnitude.get(1, 1, 0), 280.0, 1e-4, "Sobel gradient magnitude on vertical edge");
  assertClose(orientation.get(1, 1, 0), 0.0, 1e-4, "Sobel gradient orientation on vertical edge");

  console.log("  PASS: Gaussian kernel energy conservation and Sobel gradient calculus verified.");
}

// ----------------------------------------------------------------------------
// 3. CannyEdgeDetector Tests
// ----------------------------------------------------------------------------
console.log("\n[3/8] Testing CannyEdgeDetector (Blur -> Sobel -> NMS -> Hysteresis)...");
{
  const edgeImg = new ImageMatrix(8, 8, 1);
  // Vertical step edge: left half 20, right half 200
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      edgeImg.set(y, x, 0, x < 4 ? 20.0 : 200.0);
    }
  }

  const detector = new CannyEdgeDetector(0.8, 30.0, 80.0);
  const edges = detector.detect(edgeImg);

  // The step edge occurs between column 3 and column 4.
  // The detected edge forms a thin 1-pixel-wide line along column 4 (or 3)
  let edgeCount = 0;
  for (let y = 1; y < 7; y++) {
    if (edges.get(y, 4, 0) === 1.0 || edges.get(y, 3, 0) === 1.0) edgeCount++;
  }
  assert(edgeCount >= 4, `Canny edge detector found continuous edge (count: ${edgeCount})`);

  // Ensure non-maximum suppression thinned the edge (no duplicate parallel edges in flat regions)
  assertClose(edges.get(3, 0, 0), 0.0, 1e-6, "Canny NMS suppresses flat background");
  assertClose(edges.get(3, 7, 0), 0.0, 1e-6, "Canny NMS suppresses flat foreground");

  console.log("  PASS: Complete 4-stage Canny edge detector and NMS thinning verified.");
}

// ----------------------------------------------------------------------------
// 4. PinholeCamera Tests
// ----------------------------------------------------------------------------
console.log("\n[4/8] Testing PinholeCamera (Intrinsics, Extrinsics, Ray Back-Projection)...");
{
  // Test forward perspective projection (Problem 5.1)
  const camera = new PinholeCamera({
    fx: 800.0,
    fy: 800.0,
    cx: 640.0,
    cy: 360.0
  });

  const pt3D: Point3D = { x: 1.2, y: -0.6, z: 3.0 };
  const pixel = camera.project(pt3D);
  assertClose(pixel.x, 960.0, 1e-4, "Forward perspective projection u");
  assertClose(pixel.y, 200.0, 1e-4, "Forward perspective projection v");

  // Test ray back-projection (Problem 5.2)
  const ray = camera.backProjectRay({ x: 480.0, y: 200.0 });
  const knownDepth = 2.5;
  const reconstructedPt: Point3D = {
    x: ray.origin.x + ray.direction.x * (knownDepth / ray.direction.z),
    y: ray.origin.y + ray.direction.y * (knownDepth / ray.direction.z),
    z: ray.origin.z + ray.direction.z * (knownDepth / ray.direction.z)
  };
  assertClose(reconstructedPt.x, -0.5, 1e-4, "Ray back-projection reconstructed X");
  assertClose(reconstructedPt.y, -0.5, 1e-4, "Ray back-projection reconstructed Y");
  assertClose(reconstructedPt.z, 2.5, 1e-4, "Ray back-projection reconstructed Z");

  // Test optical center C = -R^T * t
  const cameraWithPose = new PinholeCamera(
    { fx: 800, fy: 800, cx: 400, cy: 300 },
    {
      R: [
        [1, 0, 0],
        [0, -1, 0],
        [0, 0, -1]
      ],
      t: [0.0, 0.5, 2.0]
    }
  );
  const center = cameraWithPose.getOpticalCenter();
  assertClose(center.x, 0.0, 1e-4, "Camera optical center Cx");
  assertClose(center.y, 0.5, 1e-4, "Camera optical center Cy");
  assertClose(center.z, 2.0, 1e-4, "Camera optical center Cz");

  console.log("  PASS: Pinhole forward projection, ray back-projection, and optical center verified.");
}

// ----------------------------------------------------------------------------
// 5. StereoTriangulator Tests
// ----------------------------------------------------------------------------
console.log("\n[5/8] Testing StereoTriangulator (Disparity & Depth Reconstruction)...");
{
  const stereo = new StereoTriangulator(0.20, 800.0, 640.0, 360.0);

  // Problem 8.1: uL = 720, uR = 680, v = 400 => d = 40 => Z = 4.0 m
  const pt3D = stereo.triangulate(720.0, 680.0, 400.0);
  assertClose(pt3D.z, 4.0, 1e-4, "Stereo metric depth Z = (f * b) / d");
  assertClose(pt3D.x, 0.40, 1e-4, "Stereo metric coordinate X");
  assertClose(pt3D.y, 0.20, 1e-4, "Stereo metric coordinate Y");

  // Problem 8.2: Quadratic depth error growth check
  const errAt2m = stereo.depthUncertainty(2.0, 0.5);
  const errAt10m = stereo.depthUncertainty(10.0, 0.5);
  assertClose(errAt2m, 0.0125, 1e-4, "Depth error at Z=2m");
  assertClose(errAt10m, 0.3125, 1e-4, "Depth error at Z=10m");
  assertClose(errAt10m / errAt2m, 25.0, 1e-4, "Quadratic error scaling ratio (10/2)^2 = 25");

  console.log("  PASS: Stereo disparity depth, 3D point cloud, and quadratic error verified.");
}

// ----------------------------------------------------------------------------
// 6. HomographyEngine Tests
// ----------------------------------------------------------------------------
console.log("\n[6/8] Testing HomographyEngine (Planar Warping & Hartley-DLT Solver)...");
{
  // Test forward mapping (Problem 7.2)
  const H = new HomographyEngine([
    [2.0, 0.5, 50.0],
    [0.0, 1.5, 30.0],
    [0.001, 0.002, 1.0]
  ]);
  const mappedPt = H.apply({ x: 100, y: 200 });
  assertClose(mappedPt.x, 233.3333, 1e-3, "Homography forward point mapping u");
  assertClose(mappedPt.y, 220.0, 1e-3, "Homography forward point mapping v");

  // Test homography inversion: H * H^(-1) = I
  const Hinv = H.invert();
  const roundTripPt = Hinv.apply(mappedPt);
  assertClose(roundTripPt.x, 100.0, 1e-4, "Homography round-trip inversion x");
  assertClose(roundTripPt.y, 200.0, 1e-4, "Homography round-trip inversion y");

  // Test Hartley-normalized DLT solver
  const srcCorners: Point2D[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  // Target affine perspective rotation and shift
  const groundTruthH = new HomographyEngine([
    [1.2, 0.1, 50.0],
    [-0.05, 1.1, 30.0],
    [0.0002, 0.0001, 1.0]
  ]);
  const dstCorners: Point2D[] = srcCorners.map(p => groundTruthH.apply(p));

  const estimatedH = HomographyEngine.solveDLT(srcCorners, dstCorners);
  for (let i = 0; i < srcCorners.length; i++) {
    const projected = estimatedH.apply(srcCorners[i]);
    assertClose(projected.x, dstCorners[i].x, 1e-2, `DLT point correspondence ${i} x`);
    assertClose(projected.y, dstCorners[i].y, 1e-2, `DLT point correspondence ${i} y`);
  }

  console.log("  PASS: Homography forward mapping, matrix inversion, and DLT SVD solver verified.");
}

// ----------------------------------------------------------------------------
// 7. Conv2DLayer Tests
// ----------------------------------------------------------------------------
console.log("\n[7/8] Testing Conv2DLayer (Forward & Exact Analytical Backprop Calculus)...");
{
  // Problem 12.4 Setup
  const inChannels = 1;
  const outChannels = 1;
  const kernelSize = 2;
  const stride = 1;
  const padding = 0;

  const weights = new Float64Array([1.0, -1.0, 2.0, 0.0]);
  const biases = new Float64Array([1.0]);

  const layer = new Conv2DLayer(inChannels, outChannels, kernelSize, stride, padding, weights, biases);

  const input = new ImageMatrix(3, 3, 1, [
    2.0, 1.0, 0.0,
    1.0, 3.0, 2.0,
    0.0, 1.0, 1.0
  ]);

  const output = layer.forward(input);
  assert(output.width === 2 && output.height === 2, "Conv2D output dimensions 2x2");
  assertClose(output.get(0, 0, 0), 4.0, 1e-5, "Conv2D forward Y[0, 0]");
  assertClose(output.get(0, 1, 0), 8.0, 1e-5, "Conv2D forward Y[0, 1]");
  assertClose(output.get(1, 0, 0), -1.0, 1e-5, "Conv2D forward Y[1, 0]");
  assertClose(output.get(1, 1, 0), 4.0, 1e-5, "Conv2D forward Y[1, 1]");

  // Backward pass with incoming gradient
  const gradOutput = new ImageMatrix(2, 2, 1, [
    1.0, 2.0,
    0.0, -1.0
  ]);
  const { gradWeights, gradBiases, gradInput } = layer.backward(gradOutput);

  // Bias gradient: 1 + 2 + 0 + (-1) = 2.0
  assertClose(gradBiases[0], 2.0, 1e-5, "Conv2D backward bias gradient dL/db");

  // Weight gradients (Problem 12.4)
  assertClose(gradWeights[0], 1.0, 1e-5, "Conv2D backward weight gradient dL/dW[0, 0]");
  assertClose(gradWeights[1], -1.0, 1e-5, "Conv2D backward weight gradient dL/dW[0, 1]");
  assertClose(gradWeights[2], 6.0, 1e-5, "Conv2D backward weight gradient dL/dW[1, 0]");
  assertClose(gradWeights[3], 6.0, 1e-5, "Conv2D backward weight gradient dL/dW[1, 1]");

  // Numerical gradient check using finite differences: dL/dW approx (L(w+eps) - L(w-eps)) / (2*eps)
  const eps = 1e-6;
  for (let wIdx = 0; wIdx < layer.weights.length; wIdx++) {
    // Loss is defined as sum(gradOutput * Y)
    layer.weights[wIdx] += eps;
    const outPlus = layer.forward(input);
    let lossPlus = 0;
    for (let i = 0; i < 4; i++) lossPlus += gradOutput.data[i] * outPlus.data[i];

    layer.weights[wIdx] -= 2 * eps;
    const outMinus = layer.forward(input);
    let lossMinus = 0;
    for (let i = 0; i < 4; i++) lossMinus += gradOutput.data[i] * outMinus.data[i];

    layer.weights[wIdx] += eps; // restore

    const numericalGrad = (lossPlus - lossMinus) / (2 * eps);
    assertClose(gradWeights[wIdx], numericalGrad, 1e-4, `Numerical gradient check on W[${wIdx}]`);
  }

  console.log("  PASS: Conv2D forward tensor convolution and exact analytical backprop calculus verified.");
}

// ----------------------------------------------------------------------------
// 8. BoundingBoxOps Tests
// ----------------------------------------------------------------------------
console.log("\n[8/8] Testing BoundingBoxOps (IoU, GIoU, and Greedy NMS)...");
{
  const b1: BoundingBox = { xMin: 50, yMin: 50, xMax: 150, yMax: 150 };
  const b2: BoundingBox = { xMin: 100, yMin: 100, xMax: 200, yMax: 200 };

  // Problem 11.1: IoU = 1/7 approx 0.142857
  const iou = BoundingBoxOps.computeIoU(b1, b2);
  assertClose(iou, 1.0 / 7.0, 1e-5, "Bounding box IoU calculation");

  // Problem 11.2: GIoU = -5/63 approx -0.079365
  const giou = BoundingBoxOps.computeGIoU(b1, b2);
  assertClose(giou, -5.0 / 63.0, 1e-5, "Bounding box GIoU calculation");

  // Problem 11.4: Greedy Non-Maximum Suppression
  const boxes: BoundingBox[] = [
    { xMin: 10, yMin: 10, xMax: 30, yMax: 30 }, // Box 0: High score
    { xMin: 12, yMin: 12, xMax: 32, yMax: 32 }, // Box 1: Overlaps heavily with Box 0
    { xMin: 100, yMin: 100, xMax: 120, yMax: 120 } // Box 2: Far away, distinct object
  ];
  const scores = [0.90, 0.85, 0.70];
  const keptIndices = BoundingBoxOps.nonMaximumSuppression(boxes, scores, 0.50);

  assert(keptIndices.length === 2, `NMS kept exactly 2 boxes (got ${keptIndices.length})`);
  assert(keptIndices[0] === 0, "NMS preserved top scoring box 0");
  assert(keptIndices[1] === 2, "NMS preserved disjoint box 2");
  assert(!keptIndices.includes(1), "NMS correctly suppressed duplicate box 1");

  console.log("  PASS: Bounding box IoU, GIoU, and Greedy NMS verified.");
}

console.log("\n===============================================================================");
console.log("   ALL 8 TEST SUITES PASSED CLEANLY WITH ZERO REGRESSIONS (SMTS-40K)");
console.log("===============================================================================");
