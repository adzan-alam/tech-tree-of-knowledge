/**
 * Production TypeScript Tape-Based Reverse-Mode Automatic Differentiation Engine
 * Standard: Sovereign Master Treatise Standard (SMTS-40K)
 * 
 * Implements scalar reverse-mode autograd with full DAG topological sorting,
 * numerical stabilization, non-linear activation functions, neural network layers,
 * and AdamW optimization.
 */

export class Value {
  public data: number;
  public grad: number;
  public _backward: () => void;
  public _prev: Set<Value>;
  public _op: string;
  public label: string;

  constructor(data: number, children: Value[] = [], op: string = '', label: string = '') {
    this.data = data;
    this.grad = 0.0;
    this._backward = () => {};
    this._prev = new Set(children);
    this._op = op;
    this.label = label;
  }

  /**
   * Addition: out = this + other
   */
  public add(other: Value | number): Value {
    const o = other instanceof Value ? other : new Value(other);
    const out = new Value(this.data + o.data, [this, o], '+');

    out._backward = () => {
      this.grad += 1.0 * out.grad;
      o.grad += 1.0 * out.grad;
    };

    return out;
  }

  /**
   * Negation: out = -this
   */
  public neg(): Value {
    return this.mul(-1.0);
  }

  /**
   * Subtraction: out = this - other
   */
  public sub(other: Value | number): Value {
    const o = other instanceof Value ? other : new Value(other);
    return this.add(o.neg());
  }

  /**
   * Multiplication: out = this * other
   */
  public mul(other: Value | number): Value {
    const o = other instanceof Value ? other : new Value(other);
    const out = new Value(this.data * o.data, [this, o], '*');

    out._backward = () => {
      this.grad += o.data * out.grad;
      o.grad += this.data * out.grad;
    };

    return out;
  }

  /**
   * Division: out = this / other = this * other^(-1)
   */
  public div(other: Value | number): Value {
    const o = other instanceof Value ? other : new Value(other);
    return this.mul(o.pow(-1.0));
  }

  /**
   * Power: out = this^n
   */
  public pow(n: number): Value {
    const out = new Value(Math.pow(this.data, n), [this], `^${n}`);

    out._backward = () => {
      this.grad += n * Math.pow(this.data, n - 1) * out.grad;
    };

    return out;
  }

  /**
   * Natural Exponential: out = e^this
   */
  public exp(): Value {
    // Clamp to prevent float overflow
    const clamped = Math.max(-80.0, Math.min(80.0, this.data));
    const val = Math.exp(clamped);
    const out = new Value(val, [this], 'exp');

    out._backward = () => {
      this.grad += val * out.grad;
    };

    return out;
  }

  /**
   * Natural Logarithm: out = ln(this)
   */
  public log(): Value {
    // Epsilon clamp to prevent -Infinity
    const eps = 1e-15;
    const val = Math.max(eps, this.data);
    const out = new Value(Math.log(val), [this], 'log');

    out._backward = () => {
      this.grad += (1.0 / val) * out.grad;
    };

    return out;
  }

  /**
   * Rectified Linear Unit (ReLU)
   */
  public relu(): Value {
    const out = new Value(this.data > 0 ? this.data : 0.0, [this], 'ReLU');

    out._backward = () => {
      this.grad += (this.data > 0 ? 1.0 : 0.0) * out.grad;
    };

    return out;
  }

  /**
   * Logistic Sigmoid: out = 1 / (1 + e^-this)
   */
  public sigmoid(): Value {
    const z = Math.max(-80.0, Math.min(80.0, this.data));
    const sig = 1.0 / (1.0 + Math.exp(-z));
    const out = new Value(sig, [this], 'sigmoid');

    out._backward = () => {
      this.grad += sig * (1.0 - sig) * out.grad;
    };

    return out;
  }

  /**
   * Hyperbolic Tangent: out = tanh(this)
   */
  public tanh(): Value {
    const z = Math.max(-20.0, Math.min(20.0, this.data));
    const th = Math.tanh(z);
    const out = new Value(th, [this], 'tanh');

    out._backward = () => {
      this.grad += (1.0 - th * th) * out.grad;
    };

    return out;
  }

  /**
   * Gaussian Error Linear Unit (GELU) fast approximation
   */
  public gelu(): Value {
    const x = this.data;
    // 0.5 * x * (1 + tanh(sqrt(2/pi) * (x + 0.044715 * x^3)))
    const sqrt2OverPi = Math.sqrt(2.0 / Math.PI);
    const inner = sqrt2OverPi * (x + 0.044715 * Math.pow(x, 3));
    const tanhInner = Math.tanh(inner);
    const val = 0.5 * x * (1.0 + tanhInner);
    const out = new Value(val, [this], 'GELU');

    out._backward = () => {
      // Derivative of GELU
      const dInner = sqrt2OverPi * (1.0 + 3.0 * 0.044715 * x * x);
      const sech2 = 1.0 - tanhInner * tanhInner;
      const dGelu = 0.5 * (1.0 + tanhInner) + 0.5 * x * sech2 * dInner;
      this.grad += dGelu * out.grad;
    };

    return out;
  }

  /**
   * Executes reverse-mode automatic differentiation from this terminal node.
   * Performs DFS topological sort across the computation graph.
   */
  public backward(): void {
    const topo: Value[] = [];
    const visited = new Set<Value>();

    const buildTopo = (v: Value) => {
      if (!visited.has(v)) {
        visited.add(v);
        for (const child of v._prev) {
          buildTopo(child);
        }
        topo.push(v);
      }
    };

    buildTopo(this);

    // Initialize root loss adjoint to 1.0
    this.grad = 1.0;

    // Traverse in reverse topological order
    for (let i = topo.length - 1; i >= 0; i--) {
      topo[i]._backward();
    }
  }
}

/**
 * Single Artificial Neuron with Weights and Bias
 */
export class Neuron {
  public w: Value[];
  public b: Value;
  public nonlin: 'relu' | 'sigmoid' | 'tanh' | 'gelu' | 'linear';

  constructor(nin: number, nonlin: 'relu' | 'sigmoid' | 'tanh' | 'gelu' | 'linear' = 'relu') {
    this.nonlin = nonlin;
    // He/Glorot initialization scale
    const scale = nonlin === 'relu' || nonlin === 'gelu' ? Math.sqrt(2.0 / nin) : Math.sqrt(1.0 / nin);
    this.w = Array.from({ length: nin }, () => new Value((Math.random() * 2.0 - 1.0) * scale));
    this.b = new Value(0.0);
  }

  public forward(x: Value[]): Value {
    if (x.length !== this.w.length) {
      throw new Error(`Dimension mismatch: expected ${this.w.length} inputs, got ${x.length}`);
    }
    let act: Value = this.b;
    for (let i = 0; i < this.w.length; i++) {
      act = act.add(this.w[i].mul(x[i]));
    }

    switch (this.nonlin) {
      case 'relu':
        return act.relu();
      case 'sigmoid':
        return act.sigmoid();
      case 'tanh':
        return act.tanh();
      case 'gelu':
        return act.gelu();
      case 'linear':
      default:
        return act;
    }
  }

  public parameters(): Value[] {
    return [...this.w, this.b];
  }
}

/**
 * Neural Network Layer of Parallel Neurons
 */
export class Layer {
  public neurons: Neuron[];

  constructor(nin: number, nout: number, nonlin: 'relu' | 'sigmoid' | 'tanh' | 'gelu' | 'linear' = 'relu') {
    this.neurons = Array.from({ length: nout }, () => new Neuron(nin, nonlin));
  }

  public forward(x: Value[]): Value[] {
    return this.neurons.map(n => n.forward(x));
  }

  public parameters(): Value[] {
    return this.neurons.flatMap(n => n.parameters());
  }
}

/**
 * Multi-Layer Perceptron (MLP)
 */
export class MLP {
  public layers: Layer[];

  constructor(sz: number[], nonlins?: ('relu' | 'sigmoid' | 'tanh' | 'gelu' | 'linear')[]) {
    this.layers = [];
    for (let i = 0; i < sz.length - 1; i++) {
      const isLast = i === sz.length - 2;
      const defaultNonlin = isLast ? 'linear' : 'relu';
      const nonlin = nonlins && nonlins[i] ? nonlins[i] : defaultNonlin;
      this.layers.push(new Layer(sz[i], sz[i + 1], nonlin));
    }
  }

  public forward(x: Value[]): Value[] {
    let out = x;
    for (const layer of this.layers) {
      out = layer.forward(out);
    }
    return out;
  }

  public parameters(): Value[] {
    return this.layers.flatMap(l => l.parameters());
  }

  public zeroGrad(): void {
    for (const p of this.parameters()) {
      p.grad = 0.0;
    }
  }
}

/**
 * AdamW Optimizer with Decoupled Weight Decay
 */
export class AdamW {
  public params: Value[];
  public lr: number;
  public beta1: number;
  public beta2: number;
  public eps: number;
  public weightDecay: number;
  private m: number[];
  private v: number[];
  private t: number;

  constructor(params: Value[], lr: number = 0.01, beta1: number = 0.9, beta2: number = 0.999, eps: number = 1e-8, weightDecay: number = 0.01) {
    this.params = params;
    this.lr = lr;
    this.beta1 = beta1;
    this.beta2 = beta2;
    this.eps = eps;
    this.weightDecay = weightDecay;
    this.m = new Array(params.length).fill(0.0);
    this.v = new Array(params.length).fill(0.0);
    this.t = 0;
  }

  public step(): void {
    this.t += 1;
    for (let i = 0; i < this.params.length; i++) {
      const p = this.params[i];
      const g = p.grad;

      // Update biased 1st and 2nd moment estimates
      this.m[i] = this.beta1 * this.m[i] + (1.0 - this.beta1) * g;
      this.v[i] = this.beta2 * this.v[i] + (1.0 - this.beta2) * (g * g);

      // Compute bias-corrected estimates
      const mHat = this.m[i] / (1.0 - Math.pow(this.beta1, this.t));
      const vHat = this.v[i] / (1.0 - Math.pow(this.beta2, this.t));

      // Decoupled Weight Decay update
      p.data -= this.lr * this.weightDecay * p.data;

      // Adaptive step update
      p.data -= (this.lr / (Math.sqrt(vHat) + this.eps)) * mHat;
    }
  }
}
