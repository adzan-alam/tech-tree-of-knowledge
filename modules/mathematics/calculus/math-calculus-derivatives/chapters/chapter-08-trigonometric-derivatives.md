# Chapter 8: Trigonometric Derivatives and Oscillatory Mechanics

> *"To study the straight line is to understand uniform displacement; to master the trigonometric functions is to understand rotation, vibration, and the eternal rhythm of waves. Without trigonometric calculus, the physics of sound, light, alternating electrical current, and orbital dynamics would remain entirely opaque."*

---

## 8.1 The Foundation: Why Radians are Mandatory

Before writing a single derivative of a trigonometric function, we must establish a non-negotiable physical and mathematical truth: **Calculus requires angles to be measured in radians.**

In elementary geometry, angles are often measured in degrees ($360^\circ$ in a circle). But the number $360$ is a human historical convention chosen by ancient astronomers for its divisibility. The circle itself knows nothing of 360 degrees. 

The natural, intrinsic measure of an angle $\theta$ is the ratio of arc length $s$ carved out on a circle to its radius $r$:

$$\theta = \frac{s}{r} \quad (\text{radians})$$

When an angle is measured in radians, the arc length on a unit circle ($r = 1$) is exactly equal to the angle itself: $s = \theta$.

If you attempt to do calculus using degrees, an unwanted scaling factor of $\frac{\pi}{180} \approx 0.01745$ pollutes every formula:

$$\frac{d}{dx}[\sin(x^\circ)] = \frac{\pi}{180} \cos(x^\circ)$$

By adopting radians, that awkward coefficient becomes strictly $1$, allowing trigonometric calculus to achieve its pure, elegant form.

---

## 8.2 The Sovereign Geometric Limit: $\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1$

The cornerstone of all trigonometric differentiation rests on the behavior of $\frac{\sin\theta}{\theta}$ as the angle $\theta$ shrinks toward zero.

Direct substitution yields:

$$\frac{\sin(0)}{0} = \frac{0}{0} \quad (\text{Indeterminate})$$

To resolve this limit, construct a geometric comparison on a unit circle ($r = 1$) for a small positive angle $0 < \theta < \frac{\pi}{2}$:

```
                 y ^
                   |             B (1, tan θ)
                   |            /|
                   |           / |
                   |       P  /  |
                   |       *--+  |
                   |      /|  |  |
                   |     / |  |  |
                   |    /  |  |  |
                   |   /θ  |  |  |
                   +--O----+--A--+-------> x
                          cos θ (1,0)
```

Examine three nested geometric areas:
1. **Inner Triangle $\triangle OAP$:** Base is $OA = 1$ (or base $\cos\theta$ and height $\sin\theta$). The vertices are $(0,0)$, $(\cos\theta, 0)$, and $(\cos\theta, \sin\theta)$. Its area is:
   $$\text{Area}(\triangle OAP) = \frac{1}{2} \cdot \text{base} \cdot \text{height} = \frac{1}{2} \cdot 1 \cdot \sin\theta = \frac{1}{2}\sin\theta$$

2. **Circular Sector $OAP$:** A slice of the unit circle subtending angle $\theta$. The area of a sector of radius $r=1$ with angle $\theta$ radians is:
   $$\text{Area}(\text{Sector } OAP) = \frac{1}{2} r^2 \theta = \frac{1}{2}(1)^2 \theta = \frac{1}{2}\theta$$

3. **Outer Triangle $\triangle OAB$:** A right triangle with base $OA = 1$ along the horizontal axis, and vertical side $AB = \tan\theta$ tangent to the circle at $(1, 0)$. Its area is:
   $$\text{Area}(\triangle OAB) = \frac{1}{2} \cdot \text{base} \cdot \text{height} = \frac{1}{2} \cdot 1 \cdot \tan\theta = \frac{1}{2}\tan\theta$$

From the visual geometry, the circular sector clearly contains the inner triangle, and is itself enclosed within the outer triangle:

$$\text{Area}(\triangle OAP) < \text{Area}(\text{Sector } OAP) < \text{Area}(\triangle OAB)$$

Substitute the algebraic expressions for these three areas:

$$\frac{1}{2}\sin\theta < \frac{1}{2}\theta < \frac{1}{2}\tan\theta$$

Multiply the entire inequality chain by $2$:

$$\sin\theta < \theta < \tan\theta$$

Now recall that $\tan\theta = \frac{\sin\theta}{\cos\theta}$:

$$\sin\theta < \theta < \frac{\sin\theta}{\cos\theta}$$

Since $0 < \theta < \frac{\pi}{2}$, $\sin\theta > 0$. Divide all three terms by $\sin\theta$:

$$1 < \frac{\theta}{\sin\theta} < \frac{1}{\cos\theta}$$

Take the reciprocal of each positive term (which reverses the direction of the inequality):

$$\cos\theta < \frac{\sin\theta}{\theta} < 1$$

Now take the limit as $\theta \to 0^+$:
- $\lim_{\theta \to 0^+} \cos\theta = \cos(0) = 1$
- $\lim_{\theta \to 0^+} 1 = 1$

The ratio $\frac{\sin\theta}{\theta}$ is trapped between $\cos\theta$ and $1$. By the **Squeeze Theorem** (Chapter 3), the middle term is pinched to the exact same value:

$$\lim_{\theta \to 0^+} \frac{\sin\theta}{\theta} = 1$$

Because $\sin(-\theta) = -\sin\theta$, the ratio $\frac{\sin(-\theta)}{-\theta} = \frac{\sin\theta}{\theta}$ is an even function, meaning the left-hand limit $\lim_{\theta \to 0^-} \frac{\sin\theta}{\theta} = 1$ as well.

Therefore, the two-sided fundamental trigonometric limit is established:

$$\mathbf{\lim_{\theta \to 0} \frac{\sin\theta}{\theta} = 1}$$

---

## 8.3 The Companion Limit: $\lim_{\theta \to 0} \frac{\cos\theta - 1}{\theta} = 0$

Now examine the companion limit required for differentiating cosine:

$$\lim_{\theta \to 0} \frac{\cos\theta - 1}{\theta}$$

Multiply numerator and denominator by the conjugate pair $(\cos\theta + 1)$:

$$\lim_{\theta \to 0} \frac{(\cos\theta - 1)(\cos\theta + 1)}{\theta(\cos\theta + 1)} = \lim_{\theta \to 0} \frac{\cos^2\theta - 1}{\theta(\cos\theta + 1)}$$

Recall the fundamental Pythagorean identity $\sin^2\theta + \cos^2\theta = 1 \implies \cos^2\theta - 1 = -\sin^2\theta$:

$$= \lim_{\theta \to 0} \frac{-\sin^2\theta}{\theta(\cos\theta + 1)} = \lim_{\theta \to 0} \left[ -\left(\frac{\sin\theta}{\theta}\right) \cdot \frac{\sin\theta}{\cos\theta + 1} \right]$$

Apply the limit product rule:
- $\lim_{\theta \to 0} \left(\frac{\sin\theta}{\theta}\right) = 1$
- $\lim_{\theta \to 0} \frac{\sin\theta}{\cos\theta + 1} = \frac{\sin(0)}{\cos(0) + 1} = \frac{0}{1 + 1} = \frac{0}{2} = 0$

Therefore:

$$\lim_{\theta \to 0} \frac{\cos\theta - 1}{\theta} = -(1) \cdot 0 = 0$$

$$\mathbf{\lim_{\theta \to 0} \frac{\cos\theta - 1}{\theta} = 0}$$

---

## 8.4 First-Principles Derivation of $\frac{d}{dx}[\sin x]$ and $\frac{d}{dx}[\cos x]$

### 1. The Derivative of $\sin x$
Let $f(x) = \sin x$. Set up the formal derivative limit:

$$f'(x) = \lim_{h \to 0} \frac{\sin(x+h) - \sin x}{h}$$

Use the trigonometric sum identity $\sin(A+B) = \sin A \cos B + \cos A \sin B$:

$$\sin(x+h) = \sin x \cos h + \cos x \sin h$$

Substitute this into the difference quotient:

$$f'(x) = \lim_{h \to 0} \frac{\sin x \cos h + \cos x \sin h - \sin x}{h}$$

Regroup the terms to isolate $\sin x$ and $\cos x$:

$$f'(x) = \lim_{h \to 0} \left[ \sin x \left(\frac{\cos h - 1}{h}\right) + \cos x \left(\frac{\sin h}{h}\right) \right]$$

Now substitute our two fundamental limits:
- $\lim_{h \to 0} \frac{\cos h - 1}{h} = 0$
- $\lim_{h \to 0} \frac{\sin h}{h} = 1$

$$f'(x) = \sin x \cdot (0) + \cos x \cdot (1) = \cos x$$

$$\mathbf{\frac{d}{dx}[\sin x] = \cos x}$$

### 2. The Derivative of $\cos x$
Let $g(x) = \cos x$. Use $\cos(x+h) = \cos x \cos h - \sin x \sin h$:

$$g'(x) = \lim_{h \to 0} \frac{\cos(x+h) - \cos x}{h} = \lim_{h \to 0} \frac{\cos x \cos h - \sin x \sin h - \cos x}{h}$$
$$g'(x) = \lim_{h \to 0} \left[ \cos x \left(\frac{\cos h - 1}{h}\right) - \sin x \left(\frac{\sin h}{h}\right) \right]$$
$$g'(x) = \cos x \cdot (0) - \sin x \cdot (1) = -\sin x$$

$$\mathbf{\frac{d}{dx}[\cos x] = -\sin x}$$

Notice the vital negative sign: when sine is rising at $x = 0$, its derivative is $\cos(0) = +1$. But when cosine is at its maximum at $x = 0$, it begins to decrease, giving a negative slope: $-\sin(x)$.

---

## 8.5 Derivatives of the Four Remaining Trigonometric Functions

Every other trigonometric function is an algebraic quotient of sine and cosine. We derive their derivatives using the **Quotient Rule** (Chapter 6):

### 1. The Derivative of $\tan x$
$$\tan x = \frac{\sin x}{\cos x}$$
$$\frac{d}{dx}[\tan x] = \frac{\cos x \frac{d}{dx}[\sin x] - \sin x \frac{d}{dx}[\cos x]}{(\cos x)^2} = \frac{\cos x(\cos x) - \sin x(-\sin x)}{\cos^2 x} = \frac{\cos^2 x + \sin^2 x}{\cos^2 x}$$
Using the Pythagorean identity $\cos^2 x + \sin^2 x = 1$:
$$= \frac{1}{\cos^2 x} = \sec^2 x$$

$$\mathbf{\frac{d}{dx}[\tan x] = \sec^2 x}$$

### 2. The Derivative of $\sec x$
$$\sec x = \frac{1}{\cos x} = (\cos x)^{-1}$$
Using the chain rule:
$$\frac{d}{dx}[\sec x] = -1(\cos x)^{-2} \cdot (-\sin x) = \frac{\sin x}{\cos^2 x} = \frac{1}{\cos x} \cdot \frac{\sin x}{\cos x} = \sec x \tan x$$

$$\mathbf{\frac{d}{dx}[\sec x] = \sec x \tan x}$$

### 3. The Derivative of $\cot x$
$$\cot x = \frac{\cos x}{\sin x}$$
$$\frac{d}{dx}[\cot x] = \frac{\sin x(-\sin x) - \cos x(\cos x)}{\sin^2 x} = \frac{-\sin^2 x - \cos^2 x}{\sin^2 x} = \frac{-(\sin^2 x + \cos^2 x)}{\sin^2 x} = -\frac{1}{\sin^2 x} = -\csc^2 x$$

$$\mathbf{\frac{d}{dx}[\cot x] = -\csc^2 x}$$

### 4. The Derivative of $\csc x$
$$\csc x = \frac{1}{\sin x} = (\sin x)^{-1}$$
$$\frac{d}{dx}[\csc x] = -1(\sin x)^{-2} \cdot (\cos x) = -\frac{\cos x}{\sin^2 x} = -\frac{1}{\sin x} \cdot \frac{\cos x}{\sin x} = -\csc x \cot x$$

$$\mathbf{\frac{d}{dx}[\csc x] = -\csc x \cot x}$$

> [!NOTE]
> **The Co-Function Negative Rule:** Notice that every trigonometric function starting with "co-" (cosine, cotangent, cosecant) has a **negative** sign in its derivative:
> - $\frac{d}{dx}[\cos x] = -\sin x$
> - $\frac{d}{dx}[\cot x] = -\csc^2 x$
> - $\frac{d}{dx}[\csc x] = -\csc x \cot x$

---

## 8.6 Cyclic Derivatives and Harmonic Oscillators

Examine the sequence of successive derivatives of the sine function:

$$f(x) = \sin x$$
$$f'(x) = \cos x$$
$$f''(x) = -\sin x$$
$$f'''(x) = -\cos x$$
$$f^{(4)}(x) = \sin x$$

The cycle repeats with period $4$!
Look closely at the second derivative:

$$f''(x) = -\sin x = -f(x)$$

Rearranging:

$$\frac{d^2f}{dx^2} + f(x) = 0$$

This is the famous **harmonic oscillator differential equation**! In physics, any system where restoring force is proportional to displacement ($F = -kx$) yields this exact equation. Pendulums, guitar strings, vibrating quartz crystals, radio antennas, and ocean waves are all direct physical realizations of this mathematical cycle.

---

## 8.7 Ten Progressive Worked Numerical Examples

### Example 8.1: Chain Rule with Composite Sine Argument
**Problem:** Differentiate $f(x) = \sin(4x^3 - 7x)$.

**Step 1:** Outer function is $\sin(u)$, inner function is $u = 4x^3 - 7x$.
**Step 2:** $\frac{d}{du}[\sin u] = \cos u$.
**Step 3:** $\frac{du}{dx} = \frac{d}{dx}[4x^3 - 7x] = 12x^2 - 7$.
**Step 4:** By the chain rule:
$$f'(x) = \cos(4x^3 - 7x) \cdot (12x^2 - 7) = (12x^2 - 7)\cos(4x^3 - 7x)$$

---

### Example 8.2: Product Rule with Algebraic and Cosine Factors
**Problem:** Differentiate $y = x^3 \cos(5x)$.

**Step 1:** Let $u = x^3$ and $v = \cos(5x)$.
**Step 2:** Differentiate each component:
- $u' = 3x^2$
- $v' = \frac{d}{dx}[\cos(5x)] = -\sin(5x) \cdot 5 = -5\sin(5x)$ (Chain Rule)

**Step 3:** Apply the product rule:
$$\frac{dy}{dx} = u v' + v u' = x^3(-5\sin(5x)) + \cos(5x)(3x^2)$$
$$\frac{dy}{dx} = -5x^3 \sin(5x) + 3x^2 \cos(5x) = x^2(3\cos(5x) - 5x\sin(5x))$$

---

### Example 8.3: Quotient Rule Involving Tangent
**Problem:** Differentiate $g(t) = \frac{\tan(2t)}{t^2 + 1}$.

**Step 1:** Components:
- Numerator $u = \tan(2t) \implies u' = \sec^2(2t) \cdot 2 = 2\sec^2(2t)$
- Denominator $v = t^2 + 1 \implies v' = 2t$

**Step 2:** Apply the quotient rule:
$$g'(t) = \frac{(t^2 + 1)(2\sec^2(2t)) - \tan(2t)(2t)}{(t^2 + 1)^2}$$
$$g'(t) = \frac{2(t^2 + 1)\sec^2(2t) - 2t\tan(2t)}{(t^2 + 1)^2}$$

---

### Example 8.4: Power of a Trigonometric Function
**Problem:** Differentiate $y = \sin^5(3x) = [\sin(3x)]^5$.

**Step 1:** Recognize the three nested layers:
- Outer: $w^5 \implies 5w^4$
- Middle: $\sin(u) \implies \cos(u)$
- Inner: $u = 3x \implies 3$

**Step 2:** Apply the multi-layer chain rule:
$$\frac{dy}{dx} = 5[\sin(3x)]^4 \cdot \frac{d}{dx}[\sin(3x)] = 5\sin^4(3x) \cdot [\cos(3x) \cdot 3]$$
$$\frac{dy}{dx} = 15\sin^4(3x)\cos(3x)$$

---

### Example 8.5: Tangent Line Equation to $y = \tan x$
**Problem:** Find the equation of the tangent line to $y = \tan x$ at $x_0 = \frac{\pi}{4}$.

**Step 1:** Evaluate $y_0$:
$$y_0 = \tan\left(\frac{\pi}{4}\right) = 1 \implies P\left(\frac{\pi}{4}, 1\right)$$

**Step 2:** Compute slope $m = f'\left(\frac{\pi}{4}\right)$:
$$f'(x) = \sec^2 x$$
Recall that $\sec\left(\frac{\pi}{4}\right) = \frac{1}{\cos(\pi/4)} = \frac{1}{1/\sqrt{2}} = \sqrt{2}$.
$$m = \sec^2\left(\frac{\pi}{4}\right) = (\sqrt{2})^2 = 2$$

**Step 3:** Form the line equation:
$$y - 1 = 2\left(x - \frac{\pi}{4}\right) \implies y - 1 = 2x - \frac{\pi}{2} \implies y = 2x - \frac{\pi}{2} + 1$$

---

### Example 8.6: Physical Oscillator Kinematics
**Problem:** A mass on a spring oscillates with horizontal displacement $x(t) = 0.4 \cos(10t)$ meters, where $t$ is in seconds. Calculate the velocity and acceleration of the mass at $t = \frac{\pi}{30}$ seconds.

**Step 1:** Velocity $v(t) = x'(t)$:
$$v(t) = \frac{d}{dt}[0.4 \cos(10t)] = 0.4(-\sin(10t) \cdot 10) = -4\sin(10t)\text{ m/s}$$

**Step 2:** Acceleration $a(t) = v'(t) = x''(t)$:
$$a(t) = \frac{d}{dt}[-4\sin(10t)] = -4(\cos(10t) \cdot 10) = -40\cos(10t)\text{ m/s}^2$$

**Step 3:** Evaluate at $t = \frac{\pi}{30}$:
$$10t = 10\left(\frac{\pi}{30}\right) = \frac{\pi}{3} = 60^\circ$$
Recall: $\sin(\pi/3) = \frac{\sqrt{3}}{2} \approx 0.8660$, $\cos(\pi/3) = \frac{1}{2} = 0.5000$.

**Step 4:** Calculate numerical outputs:
$$v\left(\frac{\pi}{30}\right) = -4\left(\frac{\sqrt{3}}{2}\right) = -2\sqrt{3} \approx -3.464\text{ m/s}$$
$$a\left(\frac{\pi}{30}\right) = -40\left(\frac{1}{2}\right) = -20\text{ m/s}^2$$

**Conclusion:** At $t = \frac{\pi}{30}\text{ s}$, the mass is moving leftward at $3.464\text{ m/s}$ with a leftward acceleration of $20\text{ m/s}^2$.

---

### Example 8.7: Composite Secant and Cosecant Terms
**Problem:** Differentiate $f(x) = \sec(4x) + \csc(2x)$.

**Step 1:** Differentiate $\sec(4x)$ using chain rule:
$$\frac{d}{dx}[\sec(4x)] = \sec(4x)\tan(4x) \cdot \frac{d}{dx}[4x] = 4\sec(4x)\tan(4x)$$

**Step 2:** Differentiate $\csc(2x)$ using chain rule:
$$\frac{d}{dx}[\csc(2x)] = -\csc(2x)\cot(2x) \cdot \frac{d}{dx}[2x] = -2\csc(2x)\cot(2x)$$

**Step 3:** Assemble:
$$f'(x) = 4\sec(4x)\tan(4x) - 2\csc(2x)\cot(2x)$$

---

### Example 8.8: Fourth-Order Derivative of a Scaled Sine Wave
**Problem:** For $f(x) = \sin(3x)$, compute the 1st, 2nd, 3rd, and 4th derivatives.

- $f'(x) = 3\cos(3x)$
- $f''(x) = 3(-3\sin(3x)) = -9\sin(3x) = -3^2 \sin(3x)$
- $f'''(x) = -9(3\cos(3x)) = -27\cos(3x) = -3^3 \cos(3x)$
- $f^{(4)}(x) = -27(-3\sin(3x)) = +81\sin(3x) = 3^4 \sin(3x)$

Notice that $f^{(4)}(x) = 81 f(x)$. Every 4 derivatives, the original function reappears scaled by $\omega^4 = 3^4 = 81$.

---

### Example 8.9: Rate of Change of Snell's Law Refraction Angle
**Problem:** Light passes from air into water with refractive index $n = 1.33$. Snell's law states:
$$\sin\theta_1 = 1.33 \sin\theta_2$$
If the incident angle increases at a rate of $\frac{d\theta_1}{dt} = 0.05\text{ rad/s}$, find the rate of change of the refracted angle $\frac{d\theta_2}{dt}$ when $\theta_1 = \frac{\pi}{6}$ radians ($30^\circ$).

**Step 1:** Differentiate both sides with respect to time $t$:
$$\frac{d}{dt}[\sin\theta_1] = 1.33 \frac{d}{dt}[\sin\theta_2]$$
$$\cos\theta_1 \frac{d\theta_1}{dt} = 1.33 \cos\theta_2 \frac{d\theta_2}{dt}$$

**Step 2:** Solve for $\frac{d\theta_2}{dt}$:
$$\frac{d\theta_2}{dt} = \frac{\cos\theta_1}{1.33 \cos\theta_2} \cdot \frac{d\theta_1}{dt}$$

**Step 3:** Find $\sin\theta_2$ and $\cos\theta_2$ at $\theta_1 = \frac{\pi}{6}$:
$$\sin\left(\frac{\pi}{6}\right) = 0.5 \implies 0.5 = 1.33 \sin\theta_2 \implies \sin\theta_2 = \frac{0.5}{1.33} \approx 0.37594$$
$$\cos\theta_2 = \sqrt{1 - \sin^2\theta_2} = \sqrt{1 - (0.37594)^2} = \sqrt{1 - 0.14133} = \sqrt{0.85867} \approx 0.92664$$
$$\cos\theta_1 = \cos\left(\frac{\pi}{6}\right) = \frac{\sqrt{3}}{2} \approx 0.86603$$

**Step 4:** Calculate $\frac{d\theta_2}{dt}$:
$$\frac{d\theta_2}{dt} = \frac{0.86603}{1.33(0.92664)} \cdot 0.05 = \frac{0.86603}{1.23243} \cdot 0.05 \approx (0.7027) \cdot 0.05 \approx 0.03514\text{ rad/s}$$

---

### Example 8.10: Rate of Shadow Length of a Vertical Tower
**Problem:** A vertical solar power tower of height $H = 20\text{ meters}$ casts a shadow of length $S(\theta) = \frac{20}{\tan\theta} = 20\cot\theta$, where $\theta$ is the sun's elevation angle. If the sun sinks toward the horizon at a constant rate $\frac{d\theta}{dt} = -0.0005\text{ rad/s}$, calculate how fast the shadow is lengthening when $\theta = \frac{\pi}{4}$ radians ($45^\circ$).

**Step 1:** Differentiate $S(\theta) = 20\cot\theta$ with respect to time $t$ using the chain rule:
$$\frac{dS}{dt} = \frac{dS}{d\theta} \cdot \frac{d\theta}{dt} = 20(-\csc^2\theta) \cdot \frac{d\theta}{dt} = -20\csc^2\theta \frac{d\theta}{dt}$$

**Step 2:** Evaluate at $\theta = \frac{\pi}{4}$:
$$\csc\left(\frac{\pi}{4}\right) = \sqrt{2} \implies \csc^2\left(\frac{\pi}{4}\right) = (\sqrt{2})^2 = 2$$

**Step 3:** Substitute numerical values:
$$\frac{dS}{dt} = -20(2)(-0.0005) = -40(-0.0005) = +0.020\text{ m/s}$$

**Conclusion:** The shadow is lengthening at a rate of $0.020\text{ m/s}$ ($2\text{ cm per second}$).

---

## 8.8 Chapter Mastery Problem Set

Complete step-by-step written solutions are provided immediately following the exercises.

### Tier 1: Direct Basic Trigonometric Derivatives
- **Exercise 8.1:** Differentiate $f(x) = 3\sin x - 4\cos x + 5\tan x$.
- **Exercise 8.2:** Differentiate $g(\theta) = 2\theta^2 - \cot\theta$.

### Tier 2: Product and Quotient Rules with Trigonometric Functions
- **Exercise 8.3:** Differentiate $y = x^2 \sin x$.
- **Exercise 8.4:** Differentiate $f(x) = \frac{\cos x}{x + 1}$.

### Tier 3: Trigonometric Chain Rule Applications
- **Exercise 8.5:** Differentiate $y = \cos(7x^2 - 3)$.
- **Exercise 8.6:** Differentiate $h(t) = \tan^3(4t)$.

### Tier 4: Tangent Geometry & Normal Lines
- **Exercise 8.7:** Find the equation of the line tangent to $y = \sin(2x)$ at $x = \frac{\pi}{6}$.
- **Exercise 8.8:** Find the normal line equation to $y = \cos x$ at $x = \frac{\pi}{2}$.

### Tier 5: Oscillatory Physics & Differential Equations
- **Exercise 8.9:** Verify that $y(t) = 3\cos(5t) - 4\sin(5t)$ satisfies the second-order differential equation $\frac{d^2y}{dt^2} + 25y = 0$.
- **Exercise 8.10:** Evaluate $\lim_{x \to 0} \frac{\sin(6x)}{\sin(2x)}$ using fundamental trigonometric limits.

---

## 8.9 Complete Step-by-Step Solutions to Chapter Exercises

### Solution to Exercise 8.1
Differentiate $f(x) = 3\sin x - 4\cos x + 5\tan x$.
Differentiate term by term:
- $\frac{d}{dx}[3\sin x] = 3\cos x$
- $\frac{d}{dx}[-4\cos x] = -4(-\sin x) = +4\sin x$
- $\frac{d}{dx}[5\tan x] = 5\sec^2 x$
$$f'(x) = 3\cos x + 4\sin x + 5\sec^2 x$$
**Final Answer:** $f'(x) = 3\cos x + 4\sin x + 5\sec^2 x$.

---

### Solution to Exercise 8.2
Differentiate $g(\theta) = 2\theta^2 - \cot\theta$.
- $\frac{d}{d\theta}[2\theta^2] = 4\theta$
- $\frac{d}{d\theta}[-\cot\theta] = -(-\csc^2\theta) = +\csc^2\theta$
$$g'(\theta) = 4\theta + \csc^2\theta$$
**Final Answer:** $g'(\theta) = 4\theta + \csc^2\theta$.

---

### Solution to Exercise 8.3
Differentiate $y = x^2 \sin x$.
Apply the product rule: $u = x^2 (u'=2x)$, $v = \sin x (v'=\cos x)$.
$$\frac{dy}{dx} = x^2 \cos x + \sin x (2x) = x^2 \cos x + 2x \sin x = x(x\cos x + 2\sin x)$$
**Final Answer:** $\frac{dy}{dx} = x^2 \cos x + 2x \sin x$.

---

### Solution to Exercise 8.4
Differentiate $f(x) = \frac{\cos x}{x + 1}$.
Apply the quotient rule:
- Numerator $u = \cos x \implies u' = -\sin x$
- Denominator $v = x + 1 \implies v' = 1$
$$f'(x) = \frac{(x + 1)(-\sin x) - (\cos x)(1)}{(x + 1)^2} = \frac{-(x + 1)\sin x - \cos x}{(x + 1)^2}$$
**Final Answer:** $f'(x) = -\frac{(x + 1)\sin x + \cos x}{(x + 1)^2}$.

---

### Solution to Exercise 8.5
Differentiate $y = \cos(7x^2 - 3)$.
Apply the chain rule:
$$\frac{dy}{dx} = -\sin(7x^2 - 3) \cdot \frac{d}{dx}[7x^2 - 3] = -\sin(7x^2 - 3) \cdot (14x) = -14x \sin(7x^2 - 3)$$
**Final Answer:** $\frac{dy}{dx} = -14x \sin(7x^2 - 3)$.

---

### Solution to Exercise 8.6
Differentiate $h(t) = \tan^3(4t) = [\tan(4t)]^3$.
Apply multi-layer chain rule:
$$h'(t) = 3[\tan(4t)]^2 \cdot \frac{d}{dt}[\tan(4t)] = 3\tan^2(4t) \cdot [\sec^2(4t) \cdot 4] = 12\tan^2(4t)\sec^2(4t)$$
**Final Answer:** $h'(t) = 12\tan^2(4t)\sec^2(4t)$.

---

### Solution to Exercise 8.7
Find tangent line to $y = \sin(2x)$ at $x_0 = \frac{\pi}{6}$.
1. Find $y_0$:
$$y_0 = \sin\left(2 \cdot \frac{\pi}{6}\right) = \sin\left(\frac{\pi}{3}\right) = \frac{\sqrt{3}}{2} \implies P\left(\frac{\pi}{6}, \frac{\sqrt{3}}{2}\right)$$
2. Derivative:
$$y' = \cos(2x) \cdot 2 = 2\cos(2x)$$
3. Slope at $x = \frac{\pi}{6}$:
$$m = 2\cos\left(\frac{\pi}{3}\right) = 2\left(\frac{1}{2}\right) = 1$$
4. Tangent line:
$$y - \frac{\sqrt{3}}{2} = 1\left(x - \frac{\pi}{6}\right) \implies y = x - \frac{\pi}{6} + \frac{\sqrt{3}}{2}$$
**Final Answer:** $y = x - \frac{\pi}{6} + \frac{\sqrt{3}}{2}$.

---

### Solution to Exercise 8.8
Find normal line to $y = \cos x$ at $x_0 = \frac{\pi}{2}$.
1. Find $y_0$:
$$y_0 = \cos\left(\frac{\pi}{2}\right) = 0 \implies P\left(\frac{\pi}{2}, 0\right)$$
2. Tangent slope:
$$y' = -\sin x \implies m_{\text{tan}} = -\sin\left(\frac{\pi}{2}\right) = -1$$
3. Normal slope:
$$m_{\text{norm}} = -\frac{1}{m_{\text{tan}}} = -\frac{1}{-1} = +1$$
4. Normal line equation:
$$y - 0 = 1\left(x - \frac{\pi}{2}\right) \implies y = x - \frac{\pi}{2}$$
**Final Answer:** $y = x - \frac{\pi}{2}$ (or $2x - 2y - \pi = 0$).

---

### Solution to Exercise 8.9
Verify that $y(t) = 3\cos(5t) - 4\sin(5t)$ satisfies $y'' + 25y = 0$.
1. First derivative:
$$y'(t) = 3(-5\sin(5t)) - 4(5\cos(5t)) = -15\sin(5t) - 20\cos(5t)$$
2. Second derivative:
$$y''(t) = -15(5\cos(5t)) - 20(-5\sin(5t)) = -75\cos(5t) + 100\sin(5t)$$
3. Substitute into $y'' + 25y$:
$$y'' + 25y = [-75\cos(5t) + 100\sin(5t)] + 25[3\cos(5t) - 4\sin(5t)]$$
$$= -75\cos(5t) + 100\sin(5t) + 75\cos(5t) - 100\sin(5t) = 0 \quad \blacksquare$$
**Final Answer:** Verified. $y'' + 25y \equiv 0$.

---

### Solution to Exercise 8.10
Evaluate $\lim_{x \to 0} \frac{\sin(6x)}{\sin(2x)}$.
1. Rewrite using fundamental limits by multiplying and dividing by $6x$ and $2x$:
$$\frac{\sin(6x)}{\sin(2x)} = \frac{\frac{\sin(6x)}{6x} \cdot 6x}{\frac{\sin(2x)}{2x} \cdot 2x} = \frac{\frac{\sin(6x)}{6x}}{\frac{\sin(2x)}{2x}} \cdot \frac{6x}{2x}$$
2. For $x \neq 0$, $\frac{6x}{2x} = 3$.
3. Take the limit as $x \to 0$:
- $\lim_{x \to 0} \frac{\sin(6x)}{6x} = 1$
- $\lim_{x \to 0} \frac{\sin(2x)}{2x} = 1$
$$= \frac{1}{1} \cdot 3 = 3$$
**Final Answer:** $3$.
