# CHAPTER 06: Coulomb Friction — Static, Kinetic, & The Friction Cone

> "Friction is not a mysterious inherent obstruction of nature; it is the collective electrostatic shearing resistance of millions of atomic weld junctions forged wherever two surfaces touch."
> — *The Sovereign Tribology Codex*

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Explain the microscopic origin of dry friction and resolve the apparent paradox of Amontons' Laws: why friction is proportional to normal load yet independent of apparent surface area.
2. Distinguish with mathematical rigor between static friction ($0 \le f_s \le \mu_s N$) and kinetic friction ($f_k = \mu_k N$).
3. Analyze the non-linear stick-slip phenomenon, explaining why $\mu_k \le \mu_s$ and how transition drops produce acoustic screeching and tectonic fault slip.
4. Derive the exact relationship for the **Angle of Repose**: $\tan\theta_{\text{repose}} = \mu_s$, and compute minimum static thresholds on variable inclines.
5. Construct the 3D **Friction Cone** and apply the self-locking condition to screws, wedges, and mechanical jacks.
6. Derive from first principles the optimal pull angle $\theta^* = \arctan(\mu_k)$ that minimizes the required pulling force on a rough horizontal floor.
7. Solve the critical **pushing-jamming singularity** where pushing at a steep downward angle renders sliding mathematically impossible regardless of applied force magnitude.
8. Solve 10 progressive numerical worked examples and 10 chapter mastery exercises with complete, unabridged arithmetic transparency.

---

## 6.1 The Microscopic Reality of Solid Contact

In Chapter 01, we saw how the ubiquitous presence of friction deceived classical antiquity into believing that motion required a continuous mover. Now, we examine friction through the sovereign lens of modern **tribology** (the science of interacting surfaces in relative motion).

If you polish a block of high-strength steel until it shines like an optical mirror, run your hand across it, and view it under an electron microscope, the surface looks like a rugged mountain range: jagged peaks (**asperities**), deep ravines, and jagged plateaus.

```
                  The Microscopic Contact Asperity Model
                  
 Top Solid Object
 +-------------------------------------------------------------------+
 |   \  /    \  /   \  /        \  /   \  /       \  /     \  /      |
 |____\/______\/_____\/__________\/_____\/_________\/_______\/_______|
      /\      /\      /\          /\    /\          /\       /\
 =====**======**======**==========**====**==========**=======**======= (Asperity Welds)
 _____/\______/\______/\__________/\____/\__________/\_______/\_______
 |    / \    /  \    /  \        /  \  /  \        /  \     /  \     |
 |___/____\_/____\_/_____\______/____\/____\______/____\_-_/____\____|
 Bottom Solid Object
 
 Real Contact Area (A_real) = Sum of Asperity Tips << Apparent Area (A_apparent)
```

When two macroscopic surfaces are brought together:
1. **The Real vs. Apparent Area:** The surfaces touch **only at the microscopic tips of their highest asperities**. The true microscopic contact area ($A_{\text{real}}$) is typically less than **$0.01\%$ of the apparent geometric surface area**!
2. **Gigantic Local Pressures:** Because the entire macroscopic load $N$ is concentrated onto these microscopic points, the localized pressure at the asperity tips exceeds the compressive yield strength of the metal ($P_{\text{local}} = N / A_{\text{real}} \sim \text{gigapascals}$).
3. **Cold-Welding:** Under these immense pressures, the atoms of the two objects are pressed into intimate metallic contact, forming miniature atomic **cold-welds** across the interface.
4. **Shearing:** To slide the top surface, you must physically shear through thousands of these microscopic cold-welded junctions and drag the asperities up and over the opposing peaks.

### Resolving Amontons' Paradox:
In 1699, Guillaume Amontons published two experimental laws of dry friction:
1. Friction is directly proportional to normal force ($f \propto N$).
2. Friction is independent of the size of the contact surface.

For centuries, this puzzled thinkers: *If you double the size of a wooden block, why doesn't friction double?*
The microscopic asperity model resolves this instantly:
- If you place a block on a larger face, the apparent area increases, but the normal force $N$ has not changed. The average pressure drops, so fewer asperities touch. The **real contact area $A_{\text{real}}$ remains identically the same!**
- If you double the normal load $N$, the asperities deform plastically until $A_{\text{real}}$ doubles. Twice as many atomic welds form, requiring twice the force to shear them.
Thus, **friction depends strictly on the microscopic real contact area, which scales linearly with normal force $N$!**

---

## 6.2 The Coulomb Model: Static vs. Kinetic Friction

In 1785, Charles-Augustin de Coulomb formalized the classical mathematical model of dry friction. We divide friction into two regimes:

### 1. Static Friction ($f_s$)
When two surfaces are in contact with no relative motion, static friction acts to prevent slipping. 
**Static friction is a self-adjusting constraint force.** It does not have a single fixed value! 
If you push a heavy refrigerator with $10\,\text{N}$, static friction pushes back with exactly $10\,\text{N}$ ($a = 0$). If you push with $50\,\text{N}$, static friction pushes back with exactly $50\,\text{N}$.

However, static friction has an absolute upper threshold, known as the **Maximum Static Friction ($f_{s,\text{max}}$)**:

$$0 \le f_s \le f_{s,\text{max}} = \mu_s N$$

where:
- $\mu_s$ is the dimensionless **coefficient of static friction**.
- $N$ is the normal contact force.

If the applied shear force is less than $\mu_s N$, the object remains locked in static equilibrium.
The instant the applied force exceeds $\mu_s N$, the atomic weld junctions snap, and the object breaks into dynamic motion!

### 2. Kinetic Friction ($f_k$)
Once the surfaces begin sliding relative to each other, the asperities cannot form deep, cold-welded bonds; they skim, bounce, and grind across one another.
The resisting force transitions to **Kinetic Friction ($f_k$)**:

$$f_k = \mu_k N$$

where $\mu_k$ is the dimensionless **coefficient of kinetic friction**.

```
                   The Universal Friction Response Curve
                   
 Friction Force f
        ^
        |                 * Peak Static Friction: f_{s,max} = mu_s * N
        |                /|
        |               / |
        |              /  |  Transition Jerk (Stick-Slip Drop)
        |             /   |
        |  Static    /    +--------------------------------- Kinetic Plateau:
        |  Ramp     /       Kinetic Friction                 f_k = mu_k * N
        |  f_s = F /
        |         /
        +--------+-----------------------------------------> Applied Force F
                 0                                Sliding Motion
```

### The Inequality: $\mu_k \le \mu_s$
For virtually all known material interfaces, **the static friction coefficient is strictly greater than the kinetic friction coefficient**:
$$\mu_k \le \mu_s$$

| Material Interface | Static Friction $\mu_s$ | Kinetic Friction $\mu_k$ |
|:---|:---:|:---:|
| Steel on Steel (dry) | $0.74$ | $0.57$ |
| Rubber tire on dry concrete | $1.00$ | $0.80$ |
| Rubber tire on wet asphalt | $0.60$ | $0.40$ |
| Wood on Wood (clean) | $0.50$ | $0.30$ |
| Ice on Ice | $0.10$ | $0.03$ |
| Teflon on Teflon (PTFE) | $0.04$ | $0.04$ |
| Synovial joint in human knee | $0.01$ | $0.003$ |

### The Stick-Slip Phenomenon
Because $\mu_s > \mu_k$, the force required to **start** an object moving ($f_{s,\text{max}} = \mu_s N$) is significantly greater than the force required to **keep** it moving ($f_k = \mu_k N$).

The moment an object breaks free, the resisting force drops abruptly by:
$$\Delta f = (\mu_s - \mu_k) N$$
This sudden drop creates an instantaneous forward jerk. 
In compliant mechanical systems (e.g., rubber tires, brake pads, violin bows, tectonic fault lines), this drop leads to a rapid, high-frequency oscillatory cycle of sticking, building stress, slipping, and resticking:
- **Violin String:** The bow hairs drag the string sideways (static stick) until tension exceeds $f_{s,\text{max}}$, slipping back rapidly (kinetic slip), and catching again, producing pure acoustic musical tones.
- **Squealing Tires & Brakes:** High-frequency stick-slip resonance between brake pads and rotors.
- **Earthquakes:** Tectonic plates stick along fault lines for centuries as tectonic strain accumulates, until shear stress exceeds $f_{s,\text{max}}$, releasing centuries of stored elastic energy in a catastrophic slip lasting seconds.

---

## 6.3 The Angle of Repose

Consider a block of mass $m$ resting on an inclined plane whose tilt angle $\theta$ can be smoothly varied.

```
                     The Angle of Repose Geometry
                     
                             ^ +y (Normal N)
                             |
                   +---------+---------+
         f_s <-----|         |         |
                   |      m  |         |
                   +---------+---------+  -----> +x (Downhill)
                            / \
                           /   \
                          /     v mg
                         /  theta \
                        /          v
                       +----------------------------
```

Align coordinates: $+x$ down the ramp, $+y$ perpendicular upward from the ramp.
Forces acting on the block:
- Perpendicular gravity: $W_y = -m g \cos\theta$.
- Normal force: $N = m g \cos\theta$.
- Parallel downhill gravity: $W_x = +m g \sin\theta$.
- Uphill static friction: $f_s$.

For the block to remain stationary:
$$\sum F_x = m g \sin\theta - f_s = 0 \implies f_s = m g \sin\theta$$

As the slope angle $\theta$ is gradually increased, the downhill pulling force $m g \sin\theta$ grows, while the normal force $m g \cos\theta$ (and hence $f_{s,\text{max}}$) diminishes!
Sliding begins at the critical **Angle of Repose ($\theta_r$)** where static friction reaches its absolute limit:
$$f_s = f_{s,\text{max}} = \mu_s N$$
$$m g \sin\theta_r = \mu_s (m g \cos\theta_r)$$

Dividing both sides by $m g \cos\theta_r$:
$$\frac{\sin\theta_r}{\cos\theta_r} = \mu_s \implies \tan\theta_r = \mu_s$$

$$\theta_r = \arctan(\mu_s)$$

**The Universal Angle of Repose Theorem:** 
The maximum slope angle at which a block can rest without sliding depends **purely on the coefficient of static friction $\mu_s$**, completely independent of the mass of the block, the surface area, or local gravity!
A tiny $1\,\text{gram}$ pebble and a $10,000\,\text{ton}$ boulder on the same slope will slip at the exact same critical angle.

---

## 6.4 The 3D Friction Cone & Self-Locking Mechanisms

Consider the vector sum of the normal force $\vec{N}$ and the static friction force $\vec{f}_s$. This resultant vector is the total **Contact Reaction Force ($\vec{R}$)** exerted by the surface:

$$\vec{R} = \vec{N} + \vec{f}_s$$

```
                           The Friction Cone
                           
                                  ^ +z (Normal N)
                                  |
                                  |   /| Resultant R
                                  |  / |
                                  | /  |
                           phi_s  |/   |
                                  *----+--------> Friction f_s
                                 /
                                /
                               v
               Cone vertex at contact point; apex half-angle = phi_s
               Any force inside the cone CANNOT cause slipping!
```

The maximum angle $\phi_s$ that the resultant reaction force $\vec{R}$ can make with the normal vector $\vec{N}$ occurs when static friction is at its maximum ($f_s = \mu_s N$):
$$\tan\phi_s = \frac{f_{s,\text{max}}}{N} = \frac{\mu_s N}{N} = \mu_s \implies \phi_s = \arctan(\mu_s)$$

This angle $\phi_s$ is called the **Friction Angle**. 
In three-dimensional space, rotating this angle around the normal axis sweeps out an inverted cone known as the **Friction Cone**:
- **Inside the Cone ($\theta < \phi_s$):** If an external force pushes on the body such that the resultant reaction falls *strictly inside* the cone, **static equilibrium is guaranteed**. The surfaces will lock together.
- **Outside the Cone ($\theta > \phi_s$):** The friction threshold is exceeded; sliding is physically inevitable.

### Self-Locking Engineering Applications:
- **Screws and Bolts:** The helix angle of a standard screw thread is designed to be smaller than the friction angle ($\alpha < \phi_s$). Because the load falls inside the friction cone, the screw is **self-locking**; it cannot un-tighten under load without an active wrench.
- **Mountaineering Camming Devices (SLCDs):** Rock-climbing cams use logarithmic spiral lobes designed so that the contact angle is permanently locked inside the rock's friction cone. The harder a climber falls, the harder the cam bites into the rock face without slipping.

---

## 6.5 The Optimal Pulling Angle

Suppose you must drag a heavy packing crate of mass $m$ across a rough horizontal floor ($\mu_k > 0$) by pulling on a rope. 
At what angle $\theta$ relative to the horizontal should you pull to **minimize the required pulling tension $P$**?

```
                                  Optimal Pull Angle
                                  
                                       P (Pull Force)
                                      ^
                                     /
                                    /  theta
                                   *-------> Horizontal
                                  +-----+
               Friction f_k <---- |  m  |
                                  +-----+
                                     |
                                     v mg
```

### Derivation of $\theta^*$:
Forces acting on the crate:
Horizontal:
$$\sum F_x = P \cos\theta - f_k = 0 \implies P \cos\theta = f_k = \mu_k N$$
Vertical:
$$\sum F_y = N + P \sin\theta - m g = 0 \implies N = m g - P \sin\theta$$

Substitute the expression for $N$ into the horizontal equation:
$$P \cos\theta = \mu_k (m g - P \sin\theta) = \mu_k m g - \mu_k P \sin\theta$$
$$P (\cos\theta + \mu_k \sin\theta) = \mu_k m g$$
$$P(\theta) = \frac{\mu_k m g}{\cos\theta + \mu_k \sin\theta}$$

To minimize $P(\theta)$, we must **maximize the denominator**:
$$D(\theta) = \cos\theta + \mu_k \sin\theta$$

Differentiating with respect to $\theta$ and setting to zero:
$$\frac{dD}{d\theta} = -\sin\theta + \mu_k \cos\theta = 0$$
$$\sin\theta = \mu_k \cos\theta \implies \frac{\sin\theta}{\cos\theta} = \tan\theta^* = \mu_k$$

$$\theta^* = \arctan(\mu_k)$$

**The Optimal Pull Theorem:** 
To minimize pulling effort on a rough floor, **the pull angle must exactly match the kinetic friction angle ($\theta^* = \phi_k = \arctan\mu_k$)**!
- If $\mu_k = 0.50$, pull at $\theta^* = \arctan(0.50) = 26.6^\circ$.
- Pulling horizontally ($\theta = 0$) wastes energy fighting maximum normal weight.
- Pulling too steep ($\theta \to 90^\circ$) wastes effort lifting the crate rather than moving it forward.

The minimum pull force at this optimal angle is:
Since $\cos\theta^* = \frac{1}{\sqrt{1 + \mu_k^2}}$ and $\sin\theta^* = \frac{\mu_k}{\sqrt{1 + \mu_k^2}}$:
$$D_{\text{max}} = \frac{1}{\sqrt{1 + \mu_k^2}} + \frac{\mu_k^2}{\sqrt{1 + \mu_k^2}} = \frac{1 + \mu_k^2}{\sqrt{1 + \mu_k^2}} = \sqrt{1 + \mu_k^2}$$

$$P_{\text{min}} = \frac{\mu_k m g}{\sqrt{1 + \mu_k^2}}$$

---

## 6.6 The Pushing-Jamming Singularity

Now consider the opposite action: pushing a crate forward by pushing **downward and forward** at angle $\theta$ below the horizontal.

```
                                The Pushing Singularity
                                
                                  \  F (Push Force)
                                   \  theta below horizontal
                                    v
                                  +-----+
               Friction f_s <---- |  m  |
                                  +-----+
                                     |
                                     v mg
```

Vertical equilibrium:
$$N = m g + F \sin\theta$$
Notice that pushing downward **increases** the normal force!
The maximum static friction threshold becomes:
$$f_{s,\text{max}} = \mu_s N = \mu_s (m g + F \sin\theta)$$

The forward driving force is:
$$F_x = F \cos\theta$$

To initiate motion, the forward push must exceed maximum static friction:
$$F \cos\theta > \mu_s (m g + F \sin\theta) = \mu_s m g + \mu_s F \sin\theta$$
$$F (\cos\theta - \mu_s \sin\theta) > \mu_s m g$$

Look closely at the coefficient in parentheses:
$$(\cos\theta - \mu_s \sin\theta)$$

If the downward angle is steep enough such that:
$$\cos\theta - \mu_s \sin\theta \le 0 \implies \frac{\cos\theta}{\sin\theta} \le \mu_s \implies \cot\theta \le \mu_s \implies \tan\theta \ge \frac{1}{\mu_s}$$

Then the denominator becomes zero or negative!
**The Jamming Singularity Theorem:** 
If $\tan\theta \ge \frac{1}{\mu_s}$ (or $\theta \ge 90^\circ - \phi_s$), **it is mathematically impossible to move the crate, no matter how immense the push force $F$!**
Even if you push with a million Newtons or use a hydraulic ram, increasing $F$ increases the downward normal force (and therefore friction) faster than it increases the forward component. You will crush the crate into splinters before it slips forward by a single millimeter.

---

## 6.7 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 6.1: Static vs. Kinetic Friction Determination
**Problem:** A heavy crate of mass $m = 40.0\,\text{kg}$ rests on a horizontal wooden floor. The coefficients of friction between the crate and the floor are $\mu_s = 0.500$ and $\mu_k = 0.350$.
Determine the magnitude of the friction force $f$ acting on the crate when an applied horizontal force $P$ is:
1. $P = 0\,\text{N}$
2. $P = 120.0\,\text{N}$
3. $P = 196.0\,\text{N}$
4. $P = 250.0\,\text{N}$

#### Solution
**Step 1: Normal force and thresholds**
$$N = m g = 40.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 392.0\,\text{N}$$
Maximum static friction threshold:
$$f_{s,\text{max}} = \mu_s N = 0.500 \times 392.0\,\text{N} = 196.0\,\text{N}$$
Kinetic friction value (once sliding):
$$f_k = \mu_k N = 0.350 \times 392.0\,\text{N} = 137.2\,\text{N}$$

**Step 2: Case 1 ($P = 0\,\text{N}$)**
With no applied force, no tendency to slide exists:
$$f = 0.0\,\text{N}$$

**Step 3: Case 2 ($P = 120.0\,\text{N}$)**
Since $P = 120.0\,\text{N} < f_{s,\text{max}} = 196.0\,\text{N}$, the crate remains in static equilibrium ($a = 0$).
By Newton's First Law, static friction self-adjusts to match the applied push:
$$f = f_s = P = 120.0\,\text{N}$$

**Step 4: Case 3 ($P = 196.0\,\text{N}$)**
The applied force is precisely at the verge of slipping ($P = f_{s,\text{max}}$).
$$f = f_{s,\text{max}} = 196.0\,\text{N}$$
The crate is in impending motion.

**Step 5: Case 4 ($P = 250.0\,\text{N}$)**
Since $P = 250.0\,\text{N} > f_{s,\text{max}} = 196.0\,\text{N}$, static friction is overwhelmed. The crate slips and accelerates!
The resisting force is now **kinetic friction**:
$$f = f_k = 137.2\,\text{N}$$
Net force: $\sum F_x = 250.0 - 137.2 = 112.8\,\text{N} \implies a = 112.8 / 40.0 = 2.82\,\text{m/s}^2$.

---

### Example 6.2: Experimental Determination of $\mu_s$ via Angle of Repose
**Problem:** In a laboratory materials test, an aluminum block is placed on an adjustable steel ramp. The incline angle is slowly raised until the block suddenly breaks free and begins to slide at $\theta_r = 28.5^\circ$. Once moving, the block slides down the ramp with a constant speed when the angle is lowered to $\theta_k = 19.0^\circ$.
1. Calculate the coefficient of static friction $\mu_s$.
2. Calculate the coefficient of kinetic friction $\mu_k$.
3. Compute the friction angle $\phi_s$.

#### Solution
**Step 1: Coefficient of static friction**
By the Angle of Repose theorem:
$$\mu_s = \tan\theta_r = \tan(28.5^\circ) = 0.54296 \approx 0.543$$

**Step 2: Coefficient of kinetic friction**
At constant sliding speed, acceleration is zero ($a = 0$):
$$\sum F_x = m g \sin\theta_k - f_k = 0 \implies m g \sin\theta_k = \mu_k m g \cos\theta_k$$
$$\mu_k = \tan\theta_k = \tan(19.0^\circ) = 0.34433 \approx 0.344$$

**Step 3: Friction angle $\phi_s$**
$$\phi_s = \theta_r = 28.5^\circ$$

---

### Example 6.3: Optimal Pull Angle Calculation
**Problem:** A warehouse worker needs to pull a pallet of mass $m = 120.0\,\text{kg}$ across a concrete floor where $\mu_k = 0.400$ at a constant velocity.
1. Determine the optimal rope angle $\theta^*$ that minimizes the pulling tension.
2. Calculate the minimum pulling force $P_{\text{min}}$ at this optimal angle.
3. Compare $P_{\text{min}}$ with the force required if pulling purely horizontally ($\theta = 0^\circ$).

#### Solution
**Step 1: Optimal pull angle**
$$\tan\theta^* = \mu_k = 0.400$$
$$\theta^* = \arctan(0.400) = 21.80^\circ \approx 21.8^\circ$$

**Step 2: Minimum pulling force**
Weight of pallet:
$$W = m g = 120.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 1176.0\,\text{N}$$
Using the closed-form minimum force formula:
$$P_{\text{min}} = \frac{\mu_k m g}{\sqrt{1 + \mu_k^2}} = \frac{0.400 \times 1176.0\,\text{N}}{\sqrt{1 + (0.400)^2}} = \frac{470.40\,\text{N}}{\sqrt{1 + 0.160}} = \frac{470.40}{\sqrt{1.160}} = \frac{470.40}{1.07703} = 436.756\,\text{N} \approx 436.8\,\text{N}$$

**Step 3: Horizontal pull ($\theta = 0^\circ$)**
$$P_{\text{horizontal}} = \mu_k m g = 0.400 \times 1176.0\,\text{N} = 470.40\,\text{N}$$
Pulling at the optimal angle saves $33.6\,\text{N}$ of effort ($7.2\%$ reduction).

---

### Example 6.4: The Pushing Jamming Threshold
**Problem:** A filing cabinet of mass $m = 50.0\,\text{kg}$ rests on a high-friction linoleum floor where $\mu_s = 0.700$. An office worker pushes downward and forward on the cabinet at an angle $\theta$ below the horizontal.
1. Determine the critical angle $\theta_{\text{jam}}$ beyond which the cabinet cannot be moved regardless of force.
2. If the worker pushes at $\theta = 60.0^\circ$ with a massive force of $F = 5,000.0\,\text{N}$, prove that the cabinet does not move.

#### Solution
**Step 1: Jamming threshold angle**
Jamming occurs when:
$$\tan\theta_{\text{jam}} = \frac{1}{\mu_s} = \frac{1}{0.700} = 1.42857$$
$$\theta_{\text{jam}} = \arctan(1.42857) = 55.01^\circ \approx 55.0^\circ$$
Any push steeper than $55.0^\circ$ below the horizontal will jam.

**Step 2: Evaluate push at $\theta = 60.0^\circ$ with $F = 5,000.0\,\text{N}$**
Normal force:
$$W = m g = 50.0 \times 9.80 = 490.0\,\text{N}$$
$$F_y = F \sin(60.0^\circ) = 5000.0 \times 0.866025 = 4330.13\,\text{N}$$
$$N = W + F_y = 490.0 + 4330.13 = 4820.13\,\text{N}$$

Maximum static friction:
$$f_{s,\text{max}} = \mu_s N = 0.700 \times 4820.13\,\text{N} = 3374.09\,\text{N}$$

Forward driving force:
$$F_x = F \cos(60.0^\circ) = 5000.0 \times 0.500000 = 2500.00\,\text{N}$$

Comparison:
$$F_x = 2500.0\,\text{N} < f_{s,\text{max}} = 3374.1\,\text{N}$$
Even with five thousand Newtons of brute force, static friction exceeds forward push by over $874\,\text{N}$! The cabinet is permanently jammed.

---

### Example 6.5: Emergency Braking Distance on Wet vs. Dry Road
**Problem:** A vehicle travels at $v_0 = 90.0\,\text{km/h} = 25.0\,\text{m/s}$. The driver applies emergency anti-lock brakes (ABS), which modulate braking right at the threshold of static friction ($\mu_s$).
1. Calculate the minimum stopping distance on dry asphalt ($\mu_s = 0.850$).
2. Calculate the minimum stopping distance on wet asphalt ($\mu_s = 0.450$).
3. Calculate the minimum stopping distance on glare ice ($\mu_s = 0.100$).

#### Solution
**Step 1: Formula for ABS braking distance**
Maximum braking deceleration without skidding:
$$f_{s,\text{max}} = \mu_s m g = m a_{\text{max}} \implies a_{\text{max}} = \mu_s g$$
Stopping distance via Torricelli:
$$d_{\text{stop}} = \frac{v_0^2}{2 a_{\text{max}}} = \frac{v_0^2}{2 \mu_s g}$$
With $v_0 = 25.0\,\text{m/s} \implies v_0^2 = 625.0\,\text{m}^2/\text{s}^2$:
$$d_{\text{stop}} = \frac{625.0}{2 \times 9.80 \times \mu_s} = \frac{625.0}{19.60 \mu_s} = \frac{31.8878}{\mu_s}$$

**Step 2: Numerical evaluation**
1. **Dry Asphalt ($\mu_s = 0.850$):**
   $$d_{\text{dry}} = \frac{31.8878}{0.850} = 37.51\,\text{m} \approx 37.5\,\text{m}$$
2. **Wet Asphalt ($\mu_s = 0.450$):**
   $$d_{\text{wet}} = \frac{31.8878}{0.450} = 70.86\,\text{m} \approx 70.9\,\text{m}$$
3. **Glare Ice ($\mu_s = 0.100$):**
   $$d_{\text{ice}} = \frac{31.8878}{0.100} = 318.88\,\text{m} \approx 319\,\text{m}$$
On ice, stopping distance increases by more than a factor of eight!

---

### Example 6.6: Horizontal Centripetal Acceleration with Tire Friction
**Problem:** A car of mass $m = 1500.0\,\text{kg}$ rounds an unbanked circular curve of radius $R = 80.0\,\text{m}$ on a flat horizontal road. The static friction coefficient between the tires and the asphalt is $\mu_s = 0.800$.
1. What provides the centripetal force required to turn the car?
2. What is the maximum safe speed $v_{\text{max}}$ at which the car can take the curve without skidding out?
3. If an oil slick on the road reduces $\mu_s$ to $0.250$, what is the new maximum safe speed?

#### Solution
**Step 1: Source of centripetal force**
Because the road is unbanked, the normal force is purely vertical ($N = mg$).
The **only horizontal force** acting on the car is the **static friction force ($\vec{f}_s$)** exerted by the pavement on the tire contact patches pointing inward toward the center of curvature:
$$f_s = m \frac{v^2}{R}$$

**Step 2: Maximum safe speed on dry asphalt ($\mu_s = 0.800$)**
To prevent skidding, static friction must not exceed its threshold:
$$m \frac{v^2}{R} \le f_{s,\text{max}} = \mu_s N = \mu_s m g$$
Mass $m$ cancels cleanly:
$$\frac{v^2}{R} \le \mu_s g \implies v \le \sqrt{\mu_s g R}$$
$$v_{\text{max}} = \sqrt{0.800 \times 9.80\,\text{m/s}^2 \times 80.0\,\text{m}} = \sqrt{627.2} = 25.044\,\text{m/s} \approx 25.0\,\text{m/s}$$
Convert to $\text{km/h}$:
$$v_{\text{max}} = 25.044 \times 3.6 = 90.16\,\text{km/h} \approx 90.2\,\text{km/h}$$

**Step 3: Oil slick ($\mu_s = 0.250$)**
$$v_{\text{slick}} = \sqrt{0.250 \times 9.80 \times 80.0} = \sqrt{196.0} = 14.00\,\text{m/s} = 50.4\,\text{km/h}$$

---

### Example 6.7: Block Squeezed Between Hands (Bilateral Friction)
**Problem:** A student holds a heavy textbook of mass $m = 3.20\,\text{kg}$ suspended vertically in the air by squeezing it horizontally between the palms of both hands. The static friction coefficient between the skin and the book cover is $\mu_s = 0.450$.
1. Draw the FBD of the textbook.
2. What minimum horizontal clamping force $F_{\text{clamp}}$ must each hand exert to prevent the book from slipping?

#### Solution
**Step 1: FBD analysis**
Forces acting on the textbook:
- Downward gravity: $W = m g = 3.20\,\text{kg} \times 9.80\,\text{m/s}^2 = 31.36\,\text{N}$.
- Horizontal normal forces from left and right palms: $N_{\text{left}} = F_{\text{clamp}}$ (pushing right), $N_{\text{right}} = F_{\text{clamp}}$ (pushing left).
- Vertical static friction: **Both hands push upward on the book covers!**
  $$f_{\text{total}} = f_{s, \text{left}} + f_{s, \text{right}} = 2 f_s$$

**Step 2: Minimum clamping force**
For vertical equilibrium at the verge of slipping:
$$\sum F_y = 2 f_{s,\text{max}} - m g = 0 \implies 2 f_{s,\text{max}} = m g$$
Since $f_{s,\text{max}} = \mu_s N = \mu_s F_{\text{clamp}}$:
$$2 \mu_s F_{\text{clamp}} = m g \implies F_{\text{clamp}} = \frac{m g}{2 \mu_s}$$
Substitute numbers:
$$F_{\text{clamp}} = \frac{31.36\,\text{N}}{2 \times 0.450} = \frac{31.36}{0.900} = 34.844\,\text{N} \approx 34.8\,\text{N}$$

---

### Example 6.8: Two-Tier Sliding Friction Stack
**Problem:** A block $A$ of mass $m_A = 4.00\,\text{kg}$ rests on top of block $B$ of mass $m_B = 8.00\,\text{kg}$. Block $B$ rests on a frictionless horizontal floor. The static and kinetic friction coefficients between block $A$ and block $B$ are $\mu_s = 0.400$ and $\mu_k = 0.300$. A horizontal force $F$ is applied to block $A$.
1. What is the maximum force $F_{\text{max}}$ that can be applied to block $A$ such that both blocks accelerate together without slipping?
2. If $F = 35.0\,\text{N}$, calculate the acceleration of each block.

#### Solution
**Step 1: Maximum force for no-slip**
Normal force between A and B:
$$N_A = m_A g = 4.00\,\text{kg} \times 9.80\,\text{m/s}^2 = 39.20\,\text{N}$$
Maximum static friction between A and B:
$$f_{s,\text{max}} = \mu_s N_A = 0.400 \times 39.20\,\text{N} = 15.68\,\text{N}$$

Now consider Block B ($m_B = 8.00\,\text{kg}$):
The **only horizontal force** accelerating Block B across the frictionless floor is the static friction force transmitted from Block A:
$$\sum F_{x, B} = f_s = m_B a$$
The maximum acceleration Block B can achieve without slipping is governed by $f_{s,\text{max}}$:
$$a_{\text{max}} = \frac{f_{s,\text{max}}}{m_B} = \frac{15.68\,\text{N}}{8.00\,\text{kg}} = 1.960\,\text{m/s}^2$$

Now consider the entire system accelerating together at $a_{\text{max}}$:
$$F_{\text{max}} = (m_A + m_B) a_{\text{max}} = (4.00 + 8.00)\,\text{kg} \times 1.960\,\text{m/s}^2 = 12.00 \times 1.960 = 23.52\,\text{N}$$
If $F \le 23.52\,\text{N}$, the blocks move as a rigid unit.

**Step 2: Force $F = 35.0\,\text{N} > F_{\text{max}}$**
Since $F > 23.52\,\text{N}$, static friction fails. Block A slips across Block B!
The interaction force is now **kinetic friction**:
$$f_k = \mu_k N_A = 0.300 \times 39.20\,\text{N} = 11.76\,\text{N}$$

Acceleration of Block B:
$$a_B = \frac{f_k}{m_B} = \frac{11.76\,\text{N}}{8.00\,\text{kg}} = 1.470\,\text{m/s}^2$$

Acceleration of Block A:
$$\sum F_{x, A} = F - f_k = 35.0\,\text{N} - 11.76\,\text{N} = 23.24\,\text{N}$$
$$a_A = \frac{\sum F_{x, A}}{m_A} = \frac{23.24\,\text{N}}{4.00\,\text{kg}} = 5.810\,\text{m/s}^2$$
Block A accelerates forward at $5.81\,\text{m/s}^2$ while Block B trails behind at $1.47\,\text{m/s}^2$.

---

### Example 6.9: Self-Locking Screw Thread
**Problem:** A jackscrew has a pitch diameter $d = 20.0\,\text{mm}$ ($r = 10.0\,\text{mm} = 0.0100\,\text{m}$) and a thread lead $p = 4.00\,\text{mm} = 0.00400\,\text{m}$. The coefficient of static friction is $\mu_s = 0.150$.
1. Calculate the helix lead angle $\alpha$ of the thread.
2. Determine whether the jackscrew is self-locking.
3. What is the minimum coefficient of static friction $\mu_{s,\text{min}}$ required to prevent the jack from back-driving under load?

#### Solution
**Step 1: Helix lead angle**
Unwrapping one thread revolution forms a right triangle with base equal to the circumference $\pi d$ and height equal to lead $p$:
$$\tan\alpha = \frac{p}{\pi d} = \frac{4.00\,\text{mm}}{\pi \times 20.0\,\text{mm}} = \frac{4.00}{62.8319} = 0.063662$$
$$\alpha = \arctan(0.063662) = 3.642^\circ \approx 3.64^\circ$$

**Step 2: Self-locking check**
A screw is self-locking if its helix angle is strictly less than the friction angle ($\alpha < \phi_s$), or equivalently:
$$\tan\alpha \le \mu_s$$
Here:
$$\tan\alpha = 0.0637 \le \mu_s = 0.150$$
Since $\tan\alpha < \mu_s$, **the screw is thoroughly self-locking**. It will hold any heavy load without turning backward.

**Step 3: Minimum static friction**
$$\mu_{s,\text{min}} = \tan\alpha = 0.0637$$

---

### Example 6.10: Conveyor Belt Maximum Acceleration
**Problem:** A factory conveyor belt carries packaged electronic units of mass $m = 5.00\,\text{kg}$. The static friction coefficient between the packages and the belt is $\mu_s = 0.350$.
1. What is the maximum horizontal acceleration $a_{\text{max}}$ the conveyor belt can sustain without the packages slipping?
2. If the conveyor belt is inclined upward at $\theta = 15.0^\circ$, what is the maximum upward acceleration $a_{\text{incline}}$ without slipping?

#### Solution
**Step 1: Horizontal conveyor belt**
Static friction must provide the package acceleration:
$$f_s = m a \le \mu_s m g \implies a_{\text{max}} = \mu_s g = 0.350 \times 9.80\,\text{m/s}^2 = 3.430\,\text{m/s}^2$$

**Step 2: Inclined conveyor belt ($\theta = 15.0^\circ$)**
Normal force on incline:
$$N = m g \cos(15.0^\circ) = m \times 9.80 \times 0.965926 = 9.466 m\,\text{N}$$
Maximum static friction available:
$$f_{s,\text{max}} = \mu_s N = 0.350 \times 9.466 m = 3.313 m\,\text{N}$$

Along the incline, gravity pulls down the slope:
$$F_{gx} = m g \sin(15.0^\circ) = m \times 9.80 \times 0.258819 = 2.536 m\,\text{N}$$
For upward acceleration $a$:
$$\sum F_x = f_{s,\text{max}} - m g \sin(15.0^\circ) = m a$$
$$3.313 m - 2.536 m = m a \implies a = 3.313 - 2.536 = 0.777\,\text{m/s}^2$$
The upward incline reduces the maximum acceleration from $3.43\,\text{m/s}^2$ down to $0.78\,\text{m/s}^2$.

---

## 6.8 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 6.1 (Tier 1: Static Friction Inequality)
A block of mass $m = 10.0\,\text{kg}$ rests on a floor where $\mu_s = 0.400$. A horizontal push of $F = 25.0\,\text{N}$ is applied.
(a) What is the maximum static friction force?
(b) What is the actual friction force acting on the block?

### Exercise 6.2 (Tier 1: Angle of Repose Calculation)
A wooden block placed on an adjustable pine plank begins to slip when the plank is tilted to an angle of $\theta = 24.0^\circ$. What is the coefficient of static friction $\mu_s$?

### Exercise 6.3 (Tier 2: Moving Sled Deceleration)
A child slides a sled across level snow. The kinetic friction coefficient is $\mu_k = 0.0800$. The initial speed is $v_0 = 5.00\,\text{m/s}$. How far does the sled travel before coming to rest?

### Exercise 6.4 (Tier 2: Optimal Pull on a Rough Floor)
A box of mass $m = 60.0\,\text{kg}$ is pulled across a floor where $\mu_k = 0.300$.
(a) What is the optimal pull angle $\theta^*$ above horizontal?
(b) Calculate the minimum pulling force $P_{\text{min}}$ required to maintain constant speed.

### Exercise 6.5 (Tier 3: The Jamming Push)
A worker pushes down on a crate ($m = 45.0\,\text{kg}$) with a force $F = 600.0\,\text{N}$ at an angle $\theta = 50.0^\circ$ below the horizontal. The static friction coefficient is $\mu_s = 0.600$. Prove mathematically whether the crate moves or remains jammed.

### Exercise 6.6 (Tier 3: Unbanked Circular Track in Rain)
A sports car takes a flat circular turn of radius $R = 120.0\,\text{m}$.
(a) If dry $\mu_s = 0.900$, what is the maximum speed in $\text{km/h}$?
(b) If rain reduces $\mu_s$ to $0.350$, what is the new maximum speed?

### Exercise 6.7 (Tier 4: Stacked Blocks with Floor Friction)
Block 1 ($m_1 = 3.00\,\text{kg}$) sits on Block 2 ($m_2 = 6.00\,\text{kg}$). Between the blocks, $\mu_s = 0.350$. Block 2 rests on a floor where $\mu_{k,\text{floor}} = 0.150$. A horizontal force $F$ pulls Block 2. What is the maximum force $F$ that can be applied to Block 2 without Block 1 slipping off?

### Exercise 6.8 (Tier 4: Friction on an Incline with External Force)
A block of mass $m = 15.0\,\text{kg}$ sits on a ramp inclined at $\theta = 30.0^\circ$ ($\mu_s = 0.450$). What minimum force $F$ directed parallel up the ramp is required to prevent the block from sliding down the ramp?

### Exercise 6.9 (Tier 5: Two-Force Friction Cone Boundaries)
A machine part of mass $m = 25.0\,\text{kg}$ on a horizontal steel table has static friction coefficient $\mu_s = 0.550$. An external force $P$ is applied at an angle $\beta$ relative to the vertical.
(a) Find the friction angle $\phi_s$.
(b) Using the friction cone concept, determine the range of angles $\beta$ from the vertical within which no slip can occur regardless of the magnitude of $P$ (assume $P \gg mg$).

### Exercise 6.10 (Tier 5: Dynamic Stick-Slip Friction Oscillator)
A block of mass $m = 2.00\,\text{kg}$ on a conveyor belt moving at constant speed $v_{\text{belt}} = 0.200\,\text{m/s}$ is anchored to a rigid wall by a horizontal spring of stiffness $k = 200.0\,\text{N/m}$. The friction coefficients are $\mu_s = 0.600$ and $\mu_k = 0.300$.
(a) As the belt pulls the block, what is the maximum spring extension $\Delta x_{\text{slip}}$ before slip occurs?
(b) Immediately after slipping, what is the initial instantaneous acceleration of the block?

---

## 6.9 Comprehensive Solutions to Chapter Exercises

---

### Solution 6.1
**(a) Maximum static friction:**
$$N = m g = 10.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 98.0\,\text{N}$$
$$f_{s,\text{max}} = \mu_s N = 0.400 \times 98.0\,\text{N} = 39.2\,\text{N}$$

**(b) Actual friction force:**
Since applied force $F = 25.0\,\text{N} < f_{s,\text{max}} = 39.2\,\text{N}$, the block does not move ($a = 0$).
By Newton's First Law:
$$f_s = F = 25.0\,\text{N}$$

---

### Solution 6.2
By the Angle of Repose theorem:
$$\mu_s = \tan\theta = \tan(24.0^\circ) = 0.4452 \approx 0.445$$

---

### Solution 6.3
Deceleration due to kinetic friction:
$$a = -\mu_k g = -0.0800 \times 9.80\,\text{m/s}^2 = -0.784\,\text{m/s}^2$$
Using $v^2 = v_0^2 + 2 a d$ with $v = 0$:
$$d = \frac{v_0^2}{2 |a|} = \frac{(5.00\,\text{m/s})^2}{2 \times 0.784\,\text{m/s}^2} = \frac{25.0}{1.568} = 15.944\,\text{m} \approx 15.9\,\text{m}$$

---

### Solution 6.4
**(a) Optimal pull angle:**
$$\theta^* = \arctan(\mu_k) = \arctan(0.300) = 16.70^\circ \approx 16.7^\circ$$

**(b) Minimum pull force:**
$$W = m g = 60.0 \times 9.80 = 588.0\,\text{N}$$
$$P_{\text{min}} = \frac{\mu_k W}{\sqrt{1 + \mu_k^2}} = \frac{0.300 \times 588.0}{\sqrt{1 + (0.300)^2}} = \frac{176.40}{\sqrt{1.09}} = \frac{176.40}{1.04403} = 168.96\,\text{N} \approx 169.0\,\text{N}$$

---

### Solution 6.5
Normal force:
$$W = m g = 45.0 \times 9.80 = 441.0\,\text{N}$$
$$F_y = F \sin(50.0^\circ) = 600.0 \times 0.766044 = 459.63\,\text{N}$$
$$N = W + F_y = 441.0 + 459.63 = 900.63\,\text{N}$$

Maximum static friction:
$$f_{s,\text{max}} = \mu_s N = 0.600 \times 900.63\,\text{N} = 540.38\,\text{N}$$

Forward driving push:
$$F_x = F \cos(50.0^\circ) = 600.0 \times 0.642788 = 385.67\,\text{N}$$

Comparison:
$$F_x = 385.67\,\text{N} < f_{s,\text{max}} = 540.38\,\text{N}$$
The crate remains completely jammed in static equilibrium ($a = 0$).

---

### Solution 6.6
**(a) Dry track ($\mu_s = 0.900, R = 120.0\,\text{m}$):**
$$v_{\text{max}} = \sqrt{\mu_s g R} = \sqrt{0.900 \times 9.80 \times 120.0} = \sqrt{1058.4} = 32.533\,\text{m/s}$$
Convert to $\text{km/h}$:
$$v_{\text{max}} = 32.533 \times 3.6 = 117.12\,\text{km/h} \approx 117.1\,\text{km/h}$$

**(b) Wet track ($\mu_s = 0.350$):**
$$v_{\text{wet}} = \sqrt{0.350 \times 9.80 \times 120.0} = \sqrt{411.6} = 20.288\,\text{m/s} = 73.04\,\text{km/h} \approx 73.0\,\text{km/h}$$

---

### Solution 6.7
Maximum acceleration of Block 1 without slipping:
$$N_1 = m_1 g = 3.00 \times 9.80 = 29.40\,\text{N}$$
$$f_{s,\text{max}} = \mu_s N_1 = 0.350 \times 29.40 = 10.29\,\text{N}$$
$$a_{\text{max}} = \frac{f_{s,\text{max}}}{m_1} = \frac{10.29\,\text{N}}{3.00\,\text{kg}} = 3.430\,\text{m/s}^2$$

Now look at the combined two-block system ($M = 3.00 + 6.00 = 9.00\,\text{kg}$):
Floor normal force:
$$N_{\text{floor}} = M g = 9.00 \times 9.80 = 88.20\,\text{N}$$
Floor friction:
$$f_{\text{floor}} = \mu_{k,\text{floor}} N_{\text{floor}} = 0.150 \times 88.20\,\text{N} = 13.23\,\text{N}$$
Applying Newton's Second Law to the combined system:
$$\sum F_x = F - f_{\text{floor}} = M a_{\text{max}}$$
$$F = M a_{\text{max}} + f_{\text{floor}} = (9.00\,\text{kg} \times 3.430\,\text{m/s}^2) + 13.23\,\text{N} = 30.87\,\text{N} + 13.23\,\text{N} = 44.10\,\text{N}$$

---

### Solution 6.8
On an incline of $\theta = 30.0^\circ$ ($m = 15.0\,\text{kg}, \mu_s = 0.450$):
Downhill gravity component:
$$F_{gx} = m g \sin(30.0^\circ) = 15.0 \times 9.80 \times 0.500 = 73.50\,\text{N}$$
Normal force:
$$N = m g \cos(30.0^\circ) = 15.0 \times 9.80 \times 0.866025 = 127.306\,\text{N}$$
Maximum static friction pointing **up the ramp**:
$$f_{s,\text{max}} = \mu_s N = 0.450 \times 127.306 = 57.288\,\text{N}$$
To prevent the block from slipping down:
$$\sum F_x = F + f_{s,\text{max}} - F_{gx} \ge 0 \implies F \ge F_{gx} - f_{s,\text{max}}$$
$$F_{\text{min}} = 73.50\,\text{N} - 57.29\,\text{N} = 16.21\,\text{N}$$

---

### Solution 6.9
**(a) Friction angle:**
$$\phi_s = \arctan(\mu_s) = \arctan(0.550) = 28.81^\circ \approx 28.8^\circ$$

**(b) Friction cone angle range:**
When pushing down with a large force $P \gg mg$, the resultant force vector is dominated by $\vec{P}$.
The angle $\beta$ is measured from the vertical normal axis.
As long as the force vector lies **inside the friction cone**, static equilibrium holds and no slip can occur:
$$\beta \le \phi_s = 28.81^\circ$$
Range: $0 \le \beta \le 28.8^\circ$ from the vertical.

---

### Solution 6.10
**(a) Maximum spring extension before slip:**
$$N = m g = 2.00 \times 9.80 = 19.60\,\text{N}$$
$$f_{s,\text{max}} = \mu_s N = 0.600 \times 19.60\,\text{N} = 11.76\,\text{N}$$
At the verge of slipping:
$$F_{\text{spring}} = k \Delta x_{\text{slip}} = f_{s,\text{max}}$$
$$\Delta x_{\text{slip}} = \frac{f_{s,\text{max}}}{k} = \frac{11.76\,\text{N}}{200.0\,\text{N/m}} = 0.0588\,\text{m} = 5.88\,\text{cm}$$

**(b) Instantaneous acceleration immediately after slip:**
The moment slip occurs, the resisting force drops from $f_{s,\text{max}}$ to kinetic friction $f_k$:
$$f_k = \mu_k N = 0.300 \times 19.60\,\text{N} = 5.88\,\text{N}$$
The spring force is still pulling backward with $F_{\text{spring}} = 11.76\,\text{N}$.
Taking the belt direction as positive:
$$\sum F_x = f_k - F_{\text{spring}} = 5.88\,\text{N} - 11.76\,\text{N} = -5.88\,\text{N}$$
$$a = \frac{\sum F_x}{m} = \frac{-5.88\,\text{N}}{2.00\,\text{kg}} = -2.94\,\text{m/s}^2$$
The block snaps backward against the belt with an initial acceleration of $2.94\,\text{m/s}^2$.
