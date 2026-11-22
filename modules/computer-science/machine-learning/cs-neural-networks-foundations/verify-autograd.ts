/**
 * Automated Verification Suite for TypeScript Autograd Engine
 * Standard: Sovereign Master Treatise Standard (SMTS-40K)
 */

import { Value, MLP, AdamW } from './autograd.js';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

function testElementaryOps() {
  console.log('Testing elementary arithmetic and activations...');

  const a = new Value(2.0);
  const b = new Value(-3.0);
  const c = new Value(10.0);
  const e = a.mul(b); // -6
  const d = e.add(c); // 4
  const f = new Value(-2.0);
  const L = d.mul(f); // -8
  L.backward();

  assert(Math.abs(L.data - (-8.0)) < 1e-6, `L.data should be -8, got ${L.data}`);
  assert(Math.abs(f.grad - 4.0) < 1e-6, `f.grad should be 4, got ${f.grad}`);
  assert(Math.abs(d.grad - (-2.0)) < 1e-6, `d.grad should be -2, got ${d.grad}`);
  assert(Math.abs(c.grad - (-2.0)) < 1e-6, `c.grad should be -2, got ${c.grad}`);
  assert(Math.abs(a.grad - 6.0) < 1e-6, `a.grad should be 6, got ${a.grad}`);
  assert(Math.abs(b.grad - (-4.0)) < 1e-6, `b.grad should be -4, got ${b.grad}`);

  console.log('Elementary operations passed.');
}

function testNumericalGradientChecking() {
  console.log('Running finite-difference gradient checking suite...');

  // Test complex composite function: f(x, y) = (x^2 * y + sin/sigmoid/tanh/gelu)
  const fn = (xVal: number, yVal: number): number => {
    const x = new Value(xVal);
    const y = new Value(yVal);
    const z1 = x.pow(2).mul(y);
    const z2 = x.sigmoid().mul(y.tanh());
    const z3 = x.gelu().add(y.relu());
    const out = z1.add(z2).add(z3);
    return out.data;
  };

  const xVal = 1.25;
  const yVal = -0.75;
  const eps = 1e-6;

  // Autograd gradients
  const x = new Value(xVal);
  const y = new Value(yVal);
  const z1 = x.pow(2).mul(y);
  const z2 = x.sigmoid().mul(y.tanh());
  const z3 = x.gelu().add(y.relu());
  const out = z1.add(z2).add(z3);
  out.backward();

  const gAutoX = x.grad;
  const gAutoY = y.grad;

  // Numerical gradients
  const gNumX = (fn(xVal + eps, yVal) - fn(xVal - eps, yVal)) / (2 * eps);
  const gNumY = (fn(xVal, yVal + eps) - fn(xVal, yVal - eps)) / (2 * eps);

  const relErrX = Math.abs(gAutoX - gNumX) / (Math.max(Math.abs(gAutoX), Math.abs(gNumX)) + 1e-8);
  const relErrY = Math.abs(gAutoY - gNumY) / (Math.max(Math.abs(gAutoY), Math.abs(gNumY)) + 1e-8);

  console.log(`RelErr X: ${relErrX.toExponential(4)}, RelErr Y: ${relErrY.toExponential(4)}`);
  assert(relErrX < 1e-4, `Gradient check for X failed: relErr = ${relErrX}`);
  assert(relErrY < 1e-4, `Gradient check for Y failed: relErr = ${relErrY}`);
  console.log('Finite-difference gradient checking PASSED (< 1e-4).');
}

function testXORConvergence() {
  console.log('Testing Non-Linear XOR Convergence with AdamW...');

  // Setup 2-4-1 MLP with Tanh activations
  const model = new MLP([2, 4, 1], ['tanh', 'sigmoid']);
  const optimizer = new AdamW(model.parameters(), 0.1, 0.9, 0.999, 1e-8, 0.0);

  // XOR dataset
  const dataset = [
    { x: [new Value(0.0), new Value(0.0)], y: 0.0 },
    { x: [new Value(0.0), new Value(1.0)], y: 1.0 },
    { x: [new Value(1.0), new Value(0.0)], y: 1.0 },
    { x: [new Value(1.0), new Value(1.0)], y: 0.0 },
  ];

  let finalLoss = 1.0;
  for (let epoch = 0; epoch < 200; epoch++) {
    model.zeroGrad();
    let totalLoss = new Value(0.0);

    for (const sample of dataset) {
      const pred = model.forward(sample.x)[0];
      // Binary Cross-Entropy Loss: -(y * log(p) + (1-y) * log(1-p))
      const p = pred;
      const target = sample.y;
      const bce = target === 1.0 
        ? p.log().neg() 
        : (new Value(1.0).sub(p)).log().neg();
      totalLoss = totalLoss.add(bce);
    }

    const loss = totalLoss.div(dataset.length);
    finalLoss = loss.data;
    loss.backward();
    optimizer.step();

    if (finalLoss < 0.05) {
      console.log(`XOR converged early at epoch ${epoch} with loss ${finalLoss.toFixed(5)}`);
      break;
    }
  }

  console.log(`Final XOR training loss: ${finalLoss.toFixed(5)}`);
  assert(finalLoss < 0.20, `XOR failed to converge: finalLoss = ${finalLoss}`);

  // Test predictions
  for (const sample of dataset) {
    const pred = model.forward(sample.x)[0].data;
    const expected = sample.y;
    console.log(`Input: [${sample.x[0].data}, ${sample.x[1].data}] -> Pred: ${pred.toFixed(4)}, Target: ${expected}`);
    assert(Math.abs(pred - expected) < 0.35, `Prediction mismatch on XOR sample`);
  }

  console.log('Non-Linear XOR Convergence PASSED.');
}

function runAll() {
  console.log('=== RUNNING PRODUCTION AUTOGRAD VERIFICATION SUITE ===');
  testElementaryOps();
  testNumericalGradientChecking();
  testXORConvergence();
  console.log('=== ALL VERIFICATIONS PASSED SUCCESSFULLY ===');
}

runAll();
