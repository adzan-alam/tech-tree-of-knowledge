# CHAPTER 05: Newton's Third Law (Lex III) & Action-Reaction Symmetries

> "To every action there is always opposed an equal reaction: or the mutual actions of two bodies upon each other are always equal, and directed to contrary parts."
> — **Sir Isaac Newton**, *Principia Mathematica*, Axioma III (1687)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. State Newton's Third Law (Lex III) in precise vector notation: $\vec{F}_{A \to B} = -\vec{F}_{B \to A}$, and explain why forces can never exist in solitary isolation.
2. Formulate the **Golden Rule of Action-Reaction Pairs**: the two forces act on **two completely different physical bodies** and therefore can never cancel each other on a single Free-Body Diagram.
3. Dissect and resolve the classic "Book on the Table" fallacy, proving why the upward normal force and downward gravitational force on a resting book are not a Third Law pair.
4. Demystify and solve the historical "Horse-Cart Paradox" by conducting isolated multi-body boundary cuts and identifying external ground reaction forces.
5. Apply the principle of reaction momentum to calculate terrestrial recoil, human jumping dynamics, and rocket propulsion in the vacuum of deep space.
6. Prove that the vector sum of all internal forces in an arbitrary $N$-body system vanishes identically ($\sum \vec{F}_{\text{internal}} \equiv \vec{0}$), establishing the foundation for center-of-mass dynamics.
7. Solve 10 progressive numerical worked examples and 10 chapter mastery exercises with rigorous step-by-step mathematical derivation.

---

## 5.1 The Mutual Nature of Physical Interaction

In everyday language, human beings speak of force as if it were a possession: *"The boxer has tremendous force,"* or *"The bulldozer exerts force."*

In physics, **no object can possess force**. An object possesses mass, volume, momentum, and energy. But force is strictly an **interaction between two distinct entities**.

You cannot touch someone without them touching you back. You cannot push against a brick wall with your hand without the brick wall pushing against your hand with the exact same magnitude of force. If you strike a nail with a hammer, the hammer exerts a forward driving force on the nail, and the nail exerts an identical backward stopping force on the hammer.

```
                      The Symmetrical Interaction Pair
                      
               Body A                                 Body B
             +--------+                             +--------+
             |        |       F_{B -> A}            |        |
             |        | <------------------         |        |
             |        |                             |        |
             |        |         F_{A -> B}          |        |
             |        | ------------------>         |        |
             +--------+                             +--------+
             
                         F_{A -> B} == - F_{B -> A}
               (Equal in Magnitude, Opposite in Spatial Direction)
```

Newton recognized this mutual symmetry as an immutable law of nature:

$$\text{Lex III: The Law of Action and Reaction}$$

> **Lex III:** *Whenever body $A$ exerts a force on body $B$ ($\vec{F}_{A \to B}$), body $B$ simultaneously exerts an equal and opposite force on body $A$ ($\vec{F}_{B \to A}$).*

In formal vector notation:
$$\vec{F}_{A \to B} = -\vec{F}_{B \to A}$$

Taking scalar magnitudes:
$$|\vec{F}_{A \to B}| = |\vec{F}_{B \to A}|$$

---

## 5.2 The Golden Rule of Action-Reaction Pairs

More conceptual confusion surrounds Newton's Third Law than almost any other principle in elementary physics. The confusion almost always stems from violating a single, ironclad rule:

> **The Golden Rule of Lex III:**
> **The two forces in an action-reaction pair ALWAYS act on TWO COMPLETELY DIFFERENT BODIES.**

Because $\vec{F}_{A \to B}$ acts on body $B$, and $\vec{F}_{B \to A}$ acts on body $A$:
- **They never appear together on the same Free-Body Diagram!**
- **They can NEVER cancel each other out!**

Cancellation of forces only occurs when two opposing forces act on the **same body** (e.g., $N - mg = 0$).

```
             The Classic "Book on the Table" Fallacy
             
 What Students Mistakenly Think is a Pair:
 
                  ^ Normal Force N (Table pushes UP on Book)
                  |
             +---------+
             |  Book   |   Are N and W an action-reaction pair?
             +---------+   EMPHATICALLY NO!
                  |        Both forces act on the SAME body (Book)!
                  v Gravity W (Earth pulls DOWN on Book)
                  
                  
 The TRUE Physical Action-Reaction Pairs:
 
 Pair 1 (Contact Force):
   - Action: Table pushes UP on Book (Normal N).
   - Reaction: Book pushes DOWN on Table (-N).
   
 Pair 2 (Gravitational Field Force):
   - Action: Earth pulls DOWN on Book (W = mg).
   - Reaction: Book pulls UP on Earth (-W = -mg)!
```

### The Book on the Table Fallacy Dissected
Consider a book resting in static equilibrium on a table:
1. The table exerts an upward normal force on the book: $\vec{N}$.
2. The Earth exerts a downward gravitational force on the book: $\vec{W} = m\vec{g}$.
3. Because the book is at rest, by Newton's **First** Law:
   $$\vec{N} + \vec{W} = \vec{0} \implies N = W$$

Novice students routinely say: *"N and W are equal and opposite, so they are a Newton's Third Law action-reaction pair."*

**This statement is completely false.**
- $N$ and $W$ happen to be equal here only because the book is at rest on a flat surface! If you place the book in an upward accelerating elevator, $N = m(g + a) > W$, yet Newton's Third Law remains $100\%$ valid.
- $N$ is an **electromagnetic contact force** exerted by the table. Its true reaction partner is the downward push exerted by the book on the table's surface.
- $W$ is a **gravitational field force** exerted by the planet Earth. Its true reaction partner is the **upward gravitational pull exerted by the book on the planet Earth**!

---

## 5.3 Resolving the Horse-Cart Paradox

For generations, physics teachers have presented the classic philosophical puzzle known as the **Horse-Cart Paradox**:

> **The Paradox:** A horse is hitched to a heavy wooden cart. The farmer commands the horse to pull. 
> The horse, having read Newton's *Principia*, turns to the farmer and argues:
> *"Newton's Third Law states that whenever I exert a forward pull $F_{\text{pull}}$ on the cart, the cart simultaneously exerts an equal and opposite backward pull $-F_{\text{pull}}$ on me. The two forces are equal in magnitude and opposite in direction. They must cancel out to zero! Therefore, it is mathematically impossible for me to move the cart forward, so I shall not even try."*

How do we break the horse's clever sophistry?

```
                    Resolving the Horse-Cart Paradox
                    
 Isolated Cart FBD:
 
                             ^ N_cart
                             |
         Friction f_cart <---+---> F_{horse -> cart}
                             |
                             v W_cart
                             
         Net horizontal force on Cart = F_{horse -> cart} - f_cart
         If F_{horse -> cart} > f_cart, the CART ACCELERATES FORWARD!
         
 --------------------------------------------------------------------------
 
 Isolated Horse FBD:
 
                             ^ N_horse
                             |
         F_{cart -> horse} <-+---> F_{ground -> horse} (Static friction push!)
                             |
                             v W_horse
                             
         Net horizontal force on Horse = F_{ground -> horse} - F_{cart -> horse}
         If F_{ground -> horse} > F_{cart -> horse}, the HORSE ACCELERATES FORWARD!
```

### The Resolution:
The horse’s error lies in treating the horse and cart as an un-isolated jumble rather than performing proper **Free-Body boundary cuts**:

1. **Look at the Cart:** What forces act **on the cart**?
   - The forward pull of the horse: $F_{\text{horse} \to \text{cart}}$.
   - The backward rolling resistance of the road: $f_{\text{cart}}$.
   $$\sum F_{x, \text{cart}} = F_{\text{horse} \to \text{cart}} - f_{\text{cart}} = m_{\text{cart}} a$$
   The cart does not care what forces act on the horse! As long as $F_{\text{horse} \to \text{cart}} > f_{\text{cart}}$, **the cart accelerates forward**.

2. **Look at the Horse:** What forces act **on the horse**?
   - The backward pull of the cart: $F_{\text{cart} \to \text{horse}}$ (which is indeed equal in magnitude to $F_{\text{horse} \to \text{cart}}$).
   - But there is another critical horizontal force! The horse digs its hooves into the ground, pushing backward on the dirt. By Newton's Third Law, **the ground pushes forward on the horse's hooves** with static friction force $F_{\text{ground} \to \text{horse}}$!
   $$\sum F_{x, \text{horse}} = F_{\text{ground} \to \text{horse}} - F_{\text{cart} \to \text{horse}} = m_{\text{horse}} a$$
   As long as the horse can push against the earth with enough traction such that $F_{\text{ground} \to \text{horse}} > F_{\text{cart} \to \text{horse}}$, **the horse accelerates forward**.

The system moves forward because the **external force from the ground on the horse** exceeds the **external rolling friction on the cart**!

---

## 5.4 Planetary Recoil and Jumping Dynamics

When you stand on the surface of the Earth and jump vigorously upward:
1. Your leg muscles extend, and your feet push downward against the Earth with a normal force $N > mg$.
2. By Newton's Third Law, the Earth pushes upward against your feet with an identical normal force $N$.
3. You accelerate upward into the air.

Does the Earth accelerate downward when you push off?

**Yes! Emphatically, mathematically yes.**

Let your mass be $m = 70.0\,\text{kg}$ and the Earth's mass be $M_E \approx 5.972 \times 10^{24}\,\text{kg}$.
Suppose your leg extension applies an average force of $N = 1400.0\,\text{N}$ (twice your body weight).
- Your upward net force:
  $$F_{\text{net, you}} = N - m g = 1400.0 - (70.0 \times 9.80) = 1400.0 - 686.0 = +714.0\,\text{N}$$
  Your upward acceleration:
  $$a_{\text{you}} = \frac{714.0\,\text{N}}{70.0\,\text{kg}} = +10.20\,\text{m/s}^2$$

- What about the Earth?
  The net downward force on the Earth is:
  $$F_{\text{net, Earth}} = N - M_E g = 1400.0\,\text{N} - 686.0\,\text{N} = 714.0\,\text{N}$$
  The Earth’s downward acceleration:
  $$a_{\text{Earth}} = \frac{714.0\,\text{N}}{5.972 \times 10^{24}\,\text{kg}} \approx 1.196 \times 10^{-22}\,\text{m/s}^2$$

The Earth accelerates downward with an acceleration of $\sim 10^{-22}\,\text{m/s}^2$. 
During your jump duration of $\Delta t \approx 0.3\,\text{s}$, the entire planet Earth is displaced downward by approximately:
$$\Delta y_{\text{Earth}} = \frac{1}{2} a_{\text{Earth}} (\Delta t)^2 \approx \frac{1}{2} (1.2 \times 10^{-22}) (0.09) \approx 5 \times 10^{-24}\,\text{meters}$$
This displacement is ten million times smaller than the diameter of a single atomic proton!
The acceleration is physically real, perfectly preserved by Newton's laws, but completely imperceptible due to the colossal inertial mass of the planet.

---

## 5.5 Rocket Propulsion in the Vacuum of Space

A notorious historical misconception, famously printed in a 1920 editorial by *The New York Times* criticizing rocket pioneer Robert Goddard, claimed:
> *"A rocket cannot work in a vacuum because it has no air to push against."*

(Forty-nine years later, on July 17, 1969, as Apollo 11 was coasting to the Moon, *The New York Times* published a formal retraction).

Why does a rocket accelerate in a pure vacuum?

```
                     Rocket Propulsion in a Vacuum
                     
                   Exhaust Gas (Delta m)         Rocket Body (M)
                 +---------------------+       +----------------+
  v_exhaust <--- |    *  *  *  *  *    | <===  |                | ----> v_rocket
                 +---------------------+   |   +----------------+
                                           |
                                F_{rocket -> gas} = - F_{gas -> rocket}
```

A rocket engine does **not** push against the outside atmosphere. In fact, atmospheric air actively impedes a rocket by creating back-pressure and aerodynamic drag!

Rocket propulsion is the quintessential manifestation of Newton's Third Law:
1. Inside the rocket’s combustion chamber, high-pressure expanding gas is channeled through a de Laval converging-diverging nozzle.
2. The nozzle exerts a colossal mechanical force pushing the exhaust gas molecules backward out of the tail: $\vec{F}_{\text{rocket} \to \text{gas}}$.
3. By Newton's Third Law, the exiting exhaust gas simultaneously exerts an equal and opposite forward reaction force directly on the engine's injector dome and thrust chamber walls:
   $$\vec{F}_{\text{thrust}} = -\vec{F}_{\text{rocket} \to \text{gas}}$$

The rocket moves forward by pushing against its own expelled propellant!

---

## 5.6 Internal Forces and Center-of-Mass Invariance

Consider an arbitrary physical system composed of $N$ interacting particles of masses $m_1, m_2, \dots, m_N$.

The total force acting on particle $i$ consists of external forces from the environment ($\vec{F}_{i,\text{ext}}$) plus the sum of all internal forces exerted on it by all other particles $j$ within the system ($\sum_{j \ne i} \vec{F}_{j \to i}$):
$$\vec{F}_{i,\text{total}} = \vec{F}_{i,\text{ext}} + \sum_{j \ne i} \vec{F}_{j \to i}$$

Now sum the total force across the entire system:
$$\vec{F}_{\text{system}} = \sum_{i=1}^N \vec{F}_{i,\text{total}} = \sum_{i=1}^N \vec{F}_{i,\text{ext}} + \sum_{i=1}^N \sum_{j \ne i} \vec{F}_{j \to i}$$

Look closely at the double summation of internal forces. Every pair of particles $(i, j)$ interacts through an action-reaction pair:
$$\vec{F}_{j \to i} + \vec{F}_{i \to j} = \vec{0}$$

Because every internal force cancels out with its unique Newton's Third Law partner:
$$\sum_{i=1}^N \sum_{j \ne i} \vec{F}_{j \to i} \equiv \vec{0}$$

Thus, we obtain the **Universal System Theorem of Classical Mechanics**:

$$\vec{F}_{\text{net, ext}} = \sum_{i=1}^N m_i \vec{a}_i = M_{\text{total}} \vec{a}_{\text{cm}}$$

**Internal forces cannot alter the motion of the center of mass of a system!**
No matter how violently the parts of an internal system push, pull, collide, or explode against each other:
- A person trapped inside a box cannot move the box by pushing on the inside walls.
- A car cannot be propelled forward by having passengers push on the dashboard.
- An exploding firework shell bursts into thousands of fragments, but its center of mass continues along the exact same original parabolic trajectory under gravity!

---

## 5.7 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 5.1: Two Pushing Skaters on Frictionless Ice
**Problem:** Two ice skaters stand facing each other at rest on frictionless ice. Skater A has mass $m_A = 80.0\,\text{kg}$ and Skater B has mass $m_B = 50.0\,\text{kg}$. Skater A suddenly pushes Skater B horizontally with a constant force of $F = 120.0\,\text{N}$ for a duration of $\Delta t = 0.500\,\text{s}$.
1. What force does Skater B exert on Skater A during the push?
2. Calculate the acceleration of both skaters during the push.
3. Calculate the final velocity of each skater at the moment their hands separate.

#### Solution
**Step 1: Force on Skater A**
By Newton's Third Law:
$$\vec{F}_{B \to A} = -\vec{F}_{A \to B}$$
Since Skater A pushes Skater B forward with $+120.0\,\text{N}$, Skater B exerts an identical backward force of $-120.0\,\text{N}$ on Skater A:
$$F_A = -120.0\,\text{N}$$

**Step 2: Accelerations during the push**
Skater A ($m_A = 80.0\,\text{kg}$):
$$a_A = \frac{F_A}{m_A} = \frac{-120.0\,\text{N}}{80.0\,\text{kg}} = -1.500\,\text{m/s}^2$$
Skater B ($m_B = 50.0\,\text{kg}$):
$$a_B = \frac{F_B}{m_B} = \frac{+120.0\,\text{N}}{50.0\,\text{kg}} = +2.400\,\text{m/s}^2$$
The lighter skater accelerates substantially faster.

**Step 3: Final separation velocities**
$$v_A = a_A \Delta t = -1.500\,\text{m/s}^2 \times 0.500\,\text{s} = -0.750\,\text{m/s}$$
$$v_B = a_B \Delta t = +2.400\,\text{m/s}^2 \times 0.500\,\text{s} = +1.200\,\text{m/s}$$

*Check Total Momentum:*
$$P_{\text{total}} = m_A v_A + m_B v_B = (80.0 \times -0.750) + (50.0 \times 1.200) = -60.0 + 60.0 = 0.00\,\text{kg}\cdot\text{m/s}$$.
Total momentum is perfectly conserved!

---

### Example 5.2: Two Blocks in Direct Contact Pushed Across a Floor
**Problem:** Two blocks rest side-by-side in direct contact on a frictionless horizontal tabletop:
- Block 1 has mass $m_1 = 3.00\,\text{kg}$.
- Block 2 has mass $m_2 = 5.00\,\text{kg}$.
A horizontal push force $F_{\text{push}} = 24.0\,\text{N}$ is applied to the left face of Block 1, pushing both blocks to the right.
1. Determine the common acceleration of the two blocks.
2. Determine the contact force $F_{1 \to 2}$ exerted by Block 1 on Block 2.
3. Determine the contact force $F_{2 \to 1}$ exerted by Block 2 on Block 1.
4. Repeat the calculation if the push is applied to Block 2 from the right instead.

#### Solution
**Step 1: System acceleration**
Total mass $M = m_1 + m_2 = 3.00 + 5.00 = 8.00\,\text{kg}$.
$$a = \frac{F_{\text{push}}}{m_1 + m_2} = \frac{24.0\,\text{N}}{8.00\,\text{kg}} = 3.00\,\text{m/s}^2$$

**Step 2: Contact force on Block 2 ($F_{1 \to 2}$)**
Isolate Block 2 ($m_2 = 5.00\,\text{kg}$):
The only horizontal force acting on Block 2 is the contact push from Block 1:
$$\sum F_x = F_{1 \to 2} = m_2 a = 5.00\,\text{kg} \times 3.00\,\text{m/s}^2 = 15.00\,\text{N}$$

**Step 3: Contact force on Block 1 ($F_{2 \to 1}$)**
By Newton's Third Law:
$$F_{2 \to 1} = -F_{1 \to 2} = -15.00\,\text{N}$$
*Check on Block 1:*
$$\sum F_x = F_{\text{push}} - F_{2 \to 1} = 24.0\,\text{N} - 15.0\,\text{N} = 9.0\,\text{N} = m_1 a = 3.00 \times 3.00 = 9.0\,\text{N}$$. Verified.

**Step 4: Push applied to Block 2 from right to left ($F = -24.0\,\text{N}$)**
Acceleration magnitude is still $a = 3.00\,\text{m/s}^2$ (to the left).
Now isolate Block 1 ($m_1 = 3.00\,\text{kg}$):
The contact force from Block 2 must accelerate Block 1:
$$F_{\text{contact}} = m_1 a = 3.00\,\text{kg} \times 3.00\,\text{m/s}^2 = 9.00\,\text{N}$$
Notice that pushing from the other side changes the internal contact force from $15.0\,\text{N}$ down to $9.0\,\text{N}$!

---

### Example 5.3: Three Blocks in Contact with Friction
**Problem:** Three blocks are pushed across a horizontal floor where $\mu_k = 0.200$:
- $m_1 = 2.00\,\text{kg}$, $m_2 = 3.00\,\text{kg}$, $m_3 = 5.00\,\text{kg}$.
A horizontal force $F_{\text{push}} = 40.0\,\text{N}$ is applied to Block 1.
1. Compute the total friction force opposing motion.
2. Determine the common acceleration of the three blocks.
3. Compute the contact force $F_{1 \to 2}$ between Block 1 and Block 2.
4. Compute the contact force $F_{2 \to 3}$ between Block 2 and Block 3.

#### Solution
**Step 1: Friction force**
Total mass $M = 2.00 + 3.00 + 5.00 = 10.00\,\text{kg}$.
Total normal force:
$$N_{\text{total}} = M g = 10.00 \times 9.80 = 98.00\,\text{N}$$
Total friction:
$$f_{\text{total}} = \mu_k N_{\text{total}} = 0.200 \times 98.00\,\text{N} = 19.60\,\text{N}$$

**Step 2: Acceleration**
$$F_{\text{net}} = F_{\text{push}} - f_{\text{total}} = 40.0\,\text{N} - 19.60\,\text{N} = 20.40\,\text{N}$$
$$a = \frac{F_{\text{net}}}{M} = \frac{20.40\,\text{N}}{10.00\,\text{kg}} = 2.040\,\text{m/s}^2$$

**Step 3: Contact force $F_{1 \to 2}$**
Isolate the combined subsystem of Block 2 and Block 3 ($m_{23} = 3.00 + 5.00 = 8.00\,\text{kg}$):
Forces on this subsystem:
- Forward contact push from Block 1: $F_{1 \to 2}$.
- Backward friction on Blocks 2 and 3:
  $$f_{23} = \mu_k (m_2 + m_3) g = 0.200 \times (8.00 \times 9.80) = 0.200 \times 78.40 = 15.68\,\text{N}$$
By Newton's Second Law:
$$F_{1 \to 2} - f_{23} = m_{23} a$$
$$F_{1 \to 2} = m_{23} a + f_{23} = (8.00\,\text{kg} \times 2.040\,\text{m/s}^2) + 15.68\,\text{N} = 16.32\,\text{N} + 15.68\,\text{N} = 32.00\,\text{N}$$

**Step 4: Contact force $F_{2 \to 3}$**
Isolate Block 3 ($m_3 = 5.00\,\text{kg}$):
Forces on Block 3:
- Forward contact push from Block 2: $F_{2 \to 3}$.
- Backward friction: $f_3 = \mu_k m_3 g = 0.200 \times (5.00 \times 9.80) = 9.80\,\text{N}$.
$$F_{2 \to 3} - f_3 = m_3 a \implies F_{2 \to 3} = m_3 a + f_3 = (5.00 \times 2.040) + 9.80 = 10.20 + 9.80 = 20.00\,\text{N}$$

---

### Example 5.4: Tension in a Non-Uniform Cable with Mass
**Problem:** In elementary physics, cables are assumed massless. Now consider a **real heavy cable** of mass $m_c = 4.00\,\text{kg}$ and length $L = 2.00\,\text{m}$ used to pull a sled of mass $M = 16.0\,\text{kg}$ across frictionless ice with a horizontal force $F_{\text{pull}} = 50.0\,\text{N}$ applied at the free end.
1. Calculate the acceleration of the sled-cable system.
2. Calculate the tension $T_{\text{front}}$ at the front end where the force is applied.
3. Calculate the tension $T_{\text{rear}}$ at the junction where the cable attaches to the sled.
4. Derive an analytical formula for tension $T(x)$ as a function of distance $x$ from the sled ($0 \le x \le L$).

#### Solution
**Step 1: System acceleration**
Total mass $M_{\text{total}} = M + m_c = 16.0 + 4.00 = 20.00\,\text{kg}$.
$$a = \frac{F_{\text{pull}}}{M_{\text{total}}} = \frac{50.0\,\text{N}}{20.00\,\text{kg}} = 2.50\,\text{m/s}^2$$

**Step 2: Tension at the front end ($x = L$)**
At the point of force application, tension must transmit the entire pulling force:
$$T_{\text{front}} = F_{\text{pull}} = 50.00\,\text{N}$$

**Step 3: Tension at the rear end ($x = 0$)**
At the rear junction, the cable is only responsible for accelerating the sled ($M = 16.0\,\text{kg}$):
$$T_{\text{rear}} = M a = 16.0\,\text{kg} \times 2.50\,\text{m/s}^2 = 40.00\,\text{N}$$

**Step 4: Analytical expression $T(x)$**
Consider a segment of cable between $0$ and $x$. The mass of this segment is $m(x) = m_c \left(\frac{x}{L}\right)$.
The tension $T(x)$ at coordinate $x$ must accelerate the sled plus this segment of cable:
$$T(x) = \left[ M + m_c \left(\frac{x}{L}\right) \right] a = \left[ M + m_c \left(\frac{x}{L}\right) \right] \left(\frac{F_{\text{pull}}}{M + m_c}\right)$$
Substitute numerical values:
$$T(x) = \left[ 16.0 + 4.00 \left(\frac{x}{2.00}\right) \right] \times 2.50 = (16.0 + 2.00 x) \times 2.50 = 40.0 + 5.00 x\,\text{N}$$
- At $x = 0$: $T(0) = 40.0\,\text{N}$.
- At $x = 2.00\,\text{m}$: $T(2.00) = 40.0 + 5.00(2.00) = 50.0\,\text{N}$.
Tension varies linearly along the length of a massive rope!

---

### Example 5.5: The Artillery Gun Recoil
**Problem:** A mobile howitzer of mass $M = 8500.0\,\text{kg}$ fires a high-explosive shell of mass $m = 42.0\,\text{kg}$ horizontally with muzzle velocity $v = 820.0\,\text{m/s}$. The firing sequence inside the barrel lasts $\Delta t = 18.0\,\text{ms} = 0.0180\,\text{s}$.
1. Calculate the average force exerted by the expanding propellant gas on the shell.
2. What force does the gas exert backward on the howitzer breech?
3. Calculate the recoil velocity $V_{\text{recoil}}$ of the howitzer immediately after firing (before hydro-pneumatic recoil spades absorb the shock).

#### Solution
**Step 1: Force on the shell**
Acceleration of shell:
$$a_{\text{shell}} = \frac{v}{\Delta t} = \frac{820.0\,\text{m/s}}{0.0180\,\text{s}} = 45555.56\,\text{m/s}^2$$
Average forward force:
$$F_{\text{gas} \to \text{shell}} = m a_{\text{shell}} = 42.0\,\text{kg} \times 45555.56\,\text{m/s}^2 = 1,913,333.3\,\text{N} \approx 1.91 \times 10^6\,\text{N} = 1.91\,\text{MN}$$

**Step 2: Force on the howitzer**
By Newton's Third Law, the gas exerts an identical backward force on the gun breech:
$$F_{\text{gas} \to \text{howitzer}} = -1.91 \times 10^6\,\text{N}$$

**Step 3: Recoil velocity**
By momentum conservation (internal explosion, zero net external horizontal force during the millisecond blast):
$$P_{\text{total}} = M V_{\text{recoil}} + m v = 0$$
$$V_{\text{recoil}} = -\frac{m v}{M} = -\frac{42.0\,\text{kg} \times 820.0\,\text{m/s}}{8500.0\,\text{kg}} = -\frac{34440.0}{8500.0} = -4.0518\,\text{m/s} \approx -4.05\,\text{m/s}$$
The howitzer recoils backward at $4.05\,\text{m/s}$ ($14.6\,\text{km/h}$).

---

### Example 5.6: Walking on a Floating Raft
**Problem:** A researcher of mass $m = 75.0\,\text{kg}$ stands at the right end of a floating wooden observation raft of mass $M = 225.0\,\text{kg}$ and length $L = 6.00\,\text{m}$ resting at rest in calm, frictionless water. The researcher walks from the right end to the left end of the raft.
1. What external horizontal force acts on the researcher-raft system?
2. What happens to the center of mass of the combined system?
3. What distance $D_{\text{raft}}$ does the raft shift relative to the lake shore?

#### Solution
**Step 1: External horizontal forces**
In calm water (neglecting fluid viscosity), there are **zero external horizontal forces** acting on the system:
$$F_{\text{ext}, x} = 0$$

**Step 2: Center of mass behavior**
By the system theorem:
$$F_{\text{ext}, x} = M_{\text{total}} a_{\text{cm}} = 0 \implies v_{\text{cm}} = \text{constant} = 0$$
The center of mass of the system **remains strictly motionless** relative to the shore!

**Step 3: Raft displacement calculation**
Let the initial position of the raft's center of mass be at coordinate $0$.
Let $\Delta x_{\text{raft}}$ be the displacement of the raft relative to the shore.
Relative to the raft, the researcher walks a distance $-L = -6.00\,\text{m}$.
The researcher's displacement relative to the shore is:
$$\Delta x_{\text{person}} = \Delta x_{\text{raft}} - L$$

Because the center of mass displacement must be zero:
$$\Delta X_{\text{cm}} = \frac{m \Delta x_{\text{person}} + M \Delta x_{\text{raft}}}{m + M} = 0$$
$$m (\Delta x_{\text{raft}} - L) + M \Delta x_{\text{raft}} = 0$$
$$(m + M) \Delta x_{\text{raft}} = m L \implies \Delta x_{\text{raft}} = \frac{m L}{m + M}$$

Substitute numbers:
$$\Delta x_{\text{raft}} = \frac{75.0\,\text{kg} \times 6.00\,\text{m}}{75.0 + 225.0} = \frac{450.0}{300.0} = +1.50\,\text{m}$$
As the researcher walks $4.50\,\text{m}$ left relative to the shore, the raft slips $1.50\,\text{m}$ right under their feet.

---

### Example 5.7: Rocket Engine Vacuum Thrust Calculation
**Problem:** A satellite apogee kick motor expels hot exhaust gases at a constant mass flow rate of $R = \frac{dm}{dt} = 2.40\,\text{kg/s}$ with an exhaust velocity $v_e = 3100.0\,\text{m/s}$ relative to the nozzle.
1. Calculate the rocket thrust force $F_{\text{thrust}}$.
2. If the satellite's instantaneous mass is $m_s = 600.0\,\text{kg}$, compute its acceleration in deep space.
3. If an astronaut stands directly behind the exhaust plume in a spacesuit, what force would the exhaust gas exert upon striking their chest plate if the gas is brought to rest?

#### Solution
**Step 1: Rocket thrust**
The rate of momentum imparted to the expelled gas is:
$$F_{\text{thrust}} = R v_e = \frac{dm}{dt} v_e = 2.40\,\text{kg/s} \times 3100.0\,\text{m/s} = 7440.0\,\text{N} = 7.44\,\text{kN}$$
By Newton's Third Law, this exact force pushes the satellite forward.

**Step 2: Satellite acceleration**
$$a = \frac{F_{\text{thrust}}}{m_s} = \frac{7440.0\,\text{N}}{600.0\,\text{kg}} = 12.40\,\text{m/s}^2 \approx 1.27\,g$$

**Step 3: Force on an astronaut**
By Newton's Third Law, if the entire mass flux of $2.40\,\text{kg/s}$ moving at $3100.0\,\text{m/s}$ impacts the astronaut and is brought to rest:
$$F_{\text{impact}} = \frac{\Delta p}{\Delta t} = R v_e = 7440.0\,\text{N}$$
The astronaut would be struck with the exact same $7.44\,\text{kN}$ of force.

---

### Example 5.8: Two Coupled Blocks on an Incline (Tension Analysis)
**Problem:** Two blocks connected by a light string slide down a frictionless ramp inclined at $\theta = 30.0^\circ$:
- Block 1 (trailing) has mass $m_1 = 4.00\,\text{kg}$.
- Block 2 (leading) has mass $m_2 = 8.00\,\text{kg}$.
1. Determine the acceleration of each block if released separately.
2. Determine the acceleration of the connected pair and the tension $T$ in the connecting string.
3. Now suppose friction is introduced: Block 1 has $\mu_1 = 0.100$ and Block 2 has $\mu_2 = 0.300$. Determine the new acceleration and string tension.

#### Solution
**Step 1: Released separately on frictionless ramp**
For any mass on a frictionless ramp:
$$a = g \sin(30.0^\circ) = 9.80 \times 0.500 = 4.90\,\text{m/s}^2$$
Both blocks accelerate at identically $4.90\,\text{m/s}^2$.

**Step 2: Connected pair on frictionless ramp**
Because both blocks accelerate at the exact same natural rate:
$$a = 4.90\,\text{m/s}^2$$
Tension in the connecting string:
$$T = 0\,\text{N}$$
The string remains completely slack!

**Step 3: Differential friction ($\mu_1 = 0.100, \mu_2 = 0.300$)**
Let axes be: $+x$ down the ramp, $+y$ perpendicular to ramp.
Normal forces:
$$N_1 = m_1 g \cos(30^\circ) = 4.00 \times 9.80 \times 0.866025 = 33.948\,\text{N}$$
$$N_2 = m_2 g \cos(30^\circ) = 8.00 \times 9.80 \times 0.866025 = 67.896\,\text{N}$$
Friction forces:
$$f_1 = \mu_1 N_1 = 0.100 \times 33.948 = 3.395\,\text{N}$$
$$f_2 = \mu_2 N_2 = 0.300 \times 67.896 = 20.369\,\text{N}$$

Notice that Block 2 (leading) experiences much higher friction and wants to slide slower, so Block 1 pushes on Block 2 through a **compressed** connecting rod (or if a string, the string bunches up!).
Wait! If connected by a **flexible string**, a string cannot push ($T \ge 0$).
Let's check:
Natural acceleration of Block 1 alone:
$$a_1 = g (\sin 30^\circ - \mu_1 \cos 30^\circ) = 9.80 (0.500 - 0.0866) = 9.80(0.4134) = 4.051\,\text{m/s}^2$$
Natural acceleration of Block 2 alone:
$$a_2 = g (\sin 30^\circ - \mu_2 \cos 30^\circ) = 9.80 (0.500 - 0.2598) = 9.80(0.2402) = 2.354\,\text{m/s}^2$$
Because the trailing block wants to slide **faster** ($a_1 > a_2$) than the leading block, the trailing block catches up and collides with Block 2!
A string goes **completely slack ($T = 0$)**, and the blocks slide together with direct contact push!
Contact force $C$:
$$M_{\text{total}} a = (m_1 + m_2) g \sin(30^\circ) - f_1 - f_2 = (12.00 \times 4.90) - 3.395 - 20.369 = 58.80 - 23.764 = 35.036\,\text{N}$$
$$a = \frac{35.036\,\text{N}}{12.00\,\text{kg}} = 2.920\,\text{m/s}^2$$
Contact force pushing Block 2:
$$C = m_2 a + f_2 - m_2 g \sin(30^\circ) = (8.00 \times 2.920) + 20.369 - 39.20 = 23.36 + 20.37 - 39.20 = 4.53\,\text{N}$$

---

### Example 5.9: Person Pulling Themselves Up in a Bosun's Chair
**Problem:** A window washer of mass $m = 70.0\,\text{kg}$ sits in a bosun's chair of mass $M = 15.0\,\text{kg}$. A rope attached to the chair passes over a fixed frictionless ceiling pulley and down into the window washer's hands. The window washer pulls on the rope to accelerate upward at $a = +0.500\,\text{m/s}^2$.
1. Draw the FBD of the combined person + chair system.
2. Calculate the tension $T$ in the rope (the pull force exerted by the worker's hands).
3. Calculate the normal force $N$ exerted by the chair on the window washer.

#### Solution
**Step 1: FBD of person + chair system**
Combined mass $M_{\text{total}} = m + M = 70.0 + 15.0 = 85.0\,\text{kg}$.
External forces acting upward on the system:
1. The rope attached to the chair pulls upward with tension $T$.
2. The rope held by the worker's hands pulls upward on the worker with tension $T$!
Therefore, **two upward strands of tension $2T$ act on the combined system!**
Downward force:
$$W_{\text{total}} = M_{\text{total}} g = 85.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 833.0\,\text{N}$$

**Step 2: Solve for rope tension $T$**
$$\sum F_y = 2 T - M_{\text{total}} g = M_{\text{total}} a$$
$$2 T = M_{\text{total}} (g + a) = 85.0\,\text{kg} \times (9.80 + 0.500)\,\text{m/s}^2 = 85.0 \times 10.30 = 875.50\,\text{N}$$
$$T = \frac{875.50\,\text{N}}{2} = 437.75\,\text{N} \approx 437.8\,\text{N}$$
The worker needs to exert only $437.8\,\text{N}$ of force (equivalent to lifting $\approx 44.7\,\text{kg}$) to lift their entire $85\,\text{kg}$ body and chair upward!

**Step 3: Normal force $N$ between chair and worker**
Isolate the worker ($m = 70.0\,\text{kg}$):
Forces on worker:
- Upward pull from rope held in hands: $T = 437.75\,\text{N}$.
- Upward normal force from seat: $N$.
- Downward gravity: $m g = 70.0 \times 9.80 = 686.0\,\text{N}$.
$$\sum F_y = N + T - m g = m a$$
$$N = m (g + a) - T = (70.0 \times 10.30) - 437.75 = 721.0 - 437.75 = 283.25\,\text{N} \approx 283.3\,\text{N}$$

---

### Example 5.10: Mutual Gravitational Orbiting Binary System
**Problem:** Two stars in deep space interact solely through mutual gravitational attraction:
- Star A has mass $M_A = 6.00 \times 10^{30}\,\text{kg}$ ($3.0$ solar masses).
- Star B has mass $M_B = 2.00 \times 10^{30}\,\text{kg}$ ($1.0$ solar mass).
The distance separating their centers is $D = 1.50 \times 10^{11}\,\text{m}$ ($1.0\,\text{AU}$). The universal gravitational constant is $G = 6.6743 \times 10^{-11}\,\text{m}^3/(\text{kg}\cdot\text{s}^2)$.
1. Calculate the gravitational force exerted by Star A on Star B, and by Star B on Star A.
2. Determine the acceleration of each star.
3. Locate the center of mass of the binary system relative to Star A.

#### Solution
**Step 1: Gravitational forces**
$$F = G \frac{M_A M_B}{D^2} = (6.6743 \times 10^{-11}) \times \frac{(6.00 \times 10^{30}) \times (2.00 \times 10^{30})}{(1.50 \times 10^{11})^2}$$
$$F = 6.6743 \times 10^{-11} \times \frac{1.20 \times 10^{61}}{2.25 \times 10^{22}} = 6.6743 \times 10^{-11} \times (5.3333 \times 10^{38}) = 3.5596 \times 10^{28}\,\text{N}$$
By Newton's Third Law:
$$F_{A \to B} = F_{B \to A} = 3.56 \times 10^{28}\,\text{N}$$
Both stars pull on each other with identically the same force.

**Step 2: Accelerations**
Star A:
$$a_A = \frac{F}{M_A} = \frac{3.5596 \times 10^{28}\,\text{N}}{6.00 \times 10^{30}\,\text{kg}} = 5.933 \times 10^{-3}\,\text{m/s}^2 = 0.00593\,\text{m/s}^2$$
Star B:
$$a_B = \frac{F}{M_B} = \frac{3.5596 \times 10^{28}\,\text{N}}{2.00 \times 10^{30}\,\text{kg}} = 1.7798 \times 10^{-2}\,\text{m/s}^2 = 0.01780\,\text{m/s}^2$$
Notice that $\frac{a_B}{a_A} = \frac{M_A}{M_B} = \frac{6.00}{2.00} = 3.00$. The lighter star accelerates 3 times faster!

**Step 3: Center of mass location**
Place Star A at $x_A = 0$ and Star B at $x_B = D$:
$$x_{\text{cm}} = \frac{M_A(0) + M_B(D)}{M_A + M_B} = \frac{M_B D}{M_A + M_B} = \frac{2.00 \times 10^{30} \times (1.50 \times 10^{11}\,\text{m})}{8.00 \times 10^{30}} = \frac{1}{4} D = 3.75 \times 10^{10}\,\text{m}$$
The center of mass lies along the line connecting the two stars, exactly $37.5\,\text{million kilometers}$ from Star A. Both stars orbit this motionless barycenter.

---

## 5.8 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 5.1 (Tier 1: Action-Reaction Identification)
For each of the following forces, identify the exact physical partner that constitutes its Newton's Third Law reaction pair (specifying which object exerts the force and which object receives it):
(a) The downward gravitational pull of the Earth on a falling apple.
(b) The horizontal friction force exerted by the road on a accelerating car's tires.
(c) The upward buoyant force exerted by water on a floating submarine.

### Exercise 5.2 (Tier 1: Tug-of-War on Frictionless Ice)
Two astronauts on spacewalk with masses $m_1 = 90.0\,\text{kg}$ and $m_2 = 120.0\,\text{kg}$ hold opposite ends of a $10.0\,\text{m}$ cable while floating at rest in deep space. Astronaut 1 pulls on the cable with tension $T = 60.0\,\text{N}$.
(a) What force acts on Astronaut 1?
(b) What force acts on Astronaut 2?
(c) Calculate the accelerations of both astronauts.

### Exercise 5.3 (Tier 2: Contact Force Between Two Accelerating Crates)
A $40.0\,\text{kg}$ crate and a $60.0\,\text{kg}$ crate are placed in contact on a frictionless floor. A horizontal force of $F = 250.0\,\text{N}$ is applied to the $40.0\,\text{kg}$ crate, pushing both forward. What is the contact force between the crates?

### Exercise 5.4 (Tier 2: High-Power Fire Hose Recoil)
A firefighter holds a fire hose that expels water at a mass flow rate of $R = 25.0\,\text{kg/s}$ with a nozzle exit velocity of $v = 32.0\,\text{m/s}$. What backward reaction force must the firefighter exert to hold the hose stationary?

### Exercise 5.5 (Tier 3: The Bosun's Chair in Static Equilibrium)
A painter of mass $m = 72.0\,\text{kg}$ sits in a bosun's chair of mass $M = 18.0\,\text{kg}$. The rope from the chair passes over a frictionless pulley and down to the painter's hands. What force must the painter pull on the rope with to hold themselves suspended in static equilibrium?

### Exercise 5.6 (Tier 3: Recoil of an Anti-Tank Rifle)
An anti-materiel rifle of mass $M = 15.0\,\text{kg}$ fires a projectile of mass $m = 50.0\,\text{g} = 0.0500\,\text{kg}$ at muzzle velocity $v = 900.0\,\text{m/s}$.
(a) What is the free recoil velocity of the rifle?
(b) If the shooter's shoulder cushions the recoil over a distance of $d = 3.00\,\text{cm} = 0.0300\,\text{m}$, what average force is exerted on the shoulder?

### Exercise 5.7 (Tier 4: Two Connected Masses with Inverted Friction on an Incline)
Two blocks connected by a light rigid rod slide down an incline of $\theta = 35.0^\circ$:
- Upper block $m_1 = 5.00\,\text{kg}$ has kinetic friction coefficient $\mu_1 = 0.400$.
- Lower block $m_2 = 3.00\,\text{kg}$ has kinetic friction coefficient $\mu_2 = 0.150$.
Calculate the common acceleration of the blocks and the tension (or compression) in the connecting rod.

### Exercise 5.8 (Tier 4: Jumping off a Rowboat)
A person of mass $m = 65.0\,\text{kg}$ stands at the stern of an initially stationary rowboat of mass $M = 130.0\,\text{kg}$ floating on calm water. The person leaps horizontally off the stern toward a dock with a speed of $u = 3.60\,\text{m/s}$ relative to the water.
(a) What is the recoil velocity of the rowboat relative to the water?
(b) If the leap duration (foot contact) was $\Delta t = 0.250\,\text{s}$, what average horizontal force was exchanged between the person and the boat?

### Exercise 5.9 (Tier 5: Helicopter Hovering Downwash)
A heavy cargo helicopter of total mass $M = 8000.0\,\text{kg}$ hovers motionless in midair. Its rotor disk sweeps out a circular area of radius $R = 8.00\,\text{m}$. The rotor accelerates air of density $\rho = 1.20\,\text{kg/m}^3$ vertically downward through the disk with a uniform downwash speed $v_{\text{downwash}}$.
Using momentum flux theory ($F = \rho A v^2$):
(a) Determine the mass flow rate of air $\frac{dm}{dt}$ pumped downward by the rotor.
(b) Compute the downwash velocity $v_{\text{downwash}}$.

### Exercise 5.10 (Tier 5: N-Body Center of Mass Invariance Proof)
Three mobile exploratory rovers with masses $m_1 = 100.0\,\text{kg}, m_2 = 200.0\,\text{kg}, m_3 = 300.0\,\text{kg}$ are tethered together by internal winch cables on a flat frictionless planetary plateau.
- Winch cable A pulls between Rover 1 and Rover 2 with tension $T_A = 500.0\,\text{N}$.
- Winch cable B pulls between Rover 2 and Rover 3 with tension $T_B = 800.0\,\text{N}$.
Prove by direct vector summation that the acceleration of the center of mass of the three-rover fleet is identically zero ($\vec{a}_{\text{cm}} = \vec{0}$).

---

## 5.9 Comprehensive Solutions to Chapter Exercises

---

### Solution 5.1
**(a) Earth's gravity on apple:**
The action-reaction partner is the **upward gravitational pull exerted by the apple on the planet Earth**. (Magnitude: identical $m_{\text{apple}} g$; direction: straight up toward apple).

**(b) Road friction on car tires:**
The action-reaction partner is the **backward horizontal friction force exerted by the car's tire tread on the road surface**.

**(c) Upward buoyant force on submarine:**
The action-reaction partner is the **downward force exerted by the submarine's hull on the surrounding water** (displacing it downward).

---

### Solution 5.2
**(a) Force on Astronaut 1:**
The cable pulls on Astronaut 1 with tension $T$:
$$F_1 = 60.0\,\text{N}\quad (\text{toward Astronaut 2})$$

**(b) Force on Astronaut 2:**
By Newton's Third Law, the cable pulls on Astronaut 2 with the exact same tension magnitude:
$$F_2 = 60.0\,\text{N}\quad (\text{toward Astronaut 1})$$

**(c) Accelerations:**
$$a_1 = \frac{T}{m_1} = \frac{60.0\,\text{N}}{90.0\,\text{kg}} = 0.6667\,\text{m/s}^2 \approx 0.667\,\text{m/s}^2$$
$$a_2 = \frac{T}{m_2} = \frac{60.0\,\text{N}}{120.0\,\text{kg}} = 0.5000\,\text{m/s}^2$$

---

### Solution 5.3
Total mass: $M = 40.0 + 60.0 = 100.0\,\text{kg}$.
Common acceleration:
$$a = \frac{F}{M} = \frac{250.0\,\text{N}}{100.0\,\text{kg}} = 2.50\,\text{m/s}^2$$
Isolate the $60.0\,\text{kg}$ crate:
The contact force $F_{\text{contact}}$ is the only horizontal force accelerating it:
$$F_{\text{contact}} = m_2 a = 60.0\,\text{kg} \times 2.50\,\text{m/s}^2 = 150.0\,\text{N}$$

---

### Solution 5.4
The rate of momentum leaving the nozzle is:
$$F_{\text{reaction}} = R v = 25.0\,\text{kg/s} \times 32.0\,\text{m/s} = 800.0\,\text{N}$$
The firefighter must exert an equal forward force of $800.0\,\text{N}$ (equivalent to supporting $\approx 81.6\,\text{kg}$) to hold the nozzle stationary.

---

### Solution 5.5
Let $T$ be the rope tension.
The painter pulls with force $T$. As established in Section 5.7 (Example 5.9), two strands of tension support the painter and chair:
Total mass: $M_{\text{total}} = 72.0 + 18.0 = 90.0\,\text{kg}$.
Weight: $W = M_{\text{total}} g = 90.0 \times 9.80 = 882.0\,\text{N}$.
In static equilibrium:
$$2 T = W \implies T = \frac{882.0\,\text{N}}{2} = 441.0\,\text{N}$$

---

### Solution 5.6
**(a) Free recoil velocity:**
By momentum conservation ($M V + m v = 0$):
$$V_{\text{recoil}} = -\frac{m v}{M} = -\frac{0.0500\,\text{kg} \times 900.0\,\text{m/s}}{15.0\,\text{kg}} = -\frac{45.0}{15.0} = -3.00\,\text{m/s}$$

**(b) Average shoulder force:**
Using Torricelli's formula: $V^2 = 2 a d \implies a = \frac{V^2}{2d}$.
$$a = \frac{(3.00\,\text{m/s})^2}{2 \times 0.0300\,\text{m}} = \frac{9.00}{0.0600} = 150.0\,\text{m/s}^2$$
$$F_{\text{shoulder}} = M a = 15.0\,\text{kg} \times 150.0\,\text{m/s}^2 = 2250.0\,\text{N} = 2.25\,\text{kN}$$

---

### Solution 5.7
$\theta = 35.0^\circ$.
Upper block ($m_1 = 5.00\,\text{kg}, \mu_1 = 0.400$):
- Gravity component down slope: $m_1 g \sin(35^\circ) = 5.00 \times 9.80 \times 0.573576 = 28.105\,\text{N}$.
- Normal force: $N_1 = m_1 g \cos(35^\circ) = 5.00 \times 9.80 \times 0.819152 = 40.138\,\text{N}$.
- Friction: $f_1 = \mu_1 N_1 = 0.400 \times 40.138 = 16.055\,\text{N}$.

Lower block ($m_2 = 3.00\,\text{kg}, \mu_2 = 0.150$):
- Gravity down slope: $m_2 g \sin(35^\circ) = 3.00 \times 9.80 \times 0.573576 = 16.863\,\text{N}$.
- Normal force: $N_2 = m_2 g \cos(35^\circ) = 3.00 \times 9.80 \times 0.819152 = 24.083\,\text{N}$.
- Friction: $f_2 = \mu_2 N_2 = 0.150 \times 24.083 = 3.612\,\text{N}$.

Notice: The lower block has much less friction and wants to accelerate faster than the upper block! Therefore, the lower block pulls the upper block, putting the connecting rod in **tension ($T > 0$)**.
Total mass: $M = 5.00 + 3.00 = 8.00\,\text{kg}$.
Total net force down slope:
$$F_{\text{net}} = (m_1 + m_2) g \sin(35^\circ) - f_1 - f_2 = (28.105 + 16.863) - 16.055 - 3.612 = 44.968 - 19.667 = 25.301\,\text{N}$$
Common acceleration:
$$a = \frac{25.301\,\text{N}}{8.00\,\text{kg}} = 3.1626\,\text{m/s}^2 \approx 3.16\,\text{m/s}^2$$

Tension in connecting rod:
Isolate upper block ($m_1 = 5.00\,\text{kg}$):
Forces down slope: $m_1 g \sin\theta + T - f_1 = m_1 a$.
$$T = m_1 a + f_1 - m_1 g \sin\theta = (5.00 \times 3.1626) + 16.055 - 28.105 = 15.813 + 16.055 - 28.105 = 3.763\,\text{N} \approx 3.76\,\text{N}$$

---

### Solution 5.8
**(a) Recoil velocity of rowboat:**
By momentum conservation ($m u + M V = 0$):
$$V = -\frac{m u}{M} = -\frac{65.0\,\text{kg} \times 3.60\,\text{m/s}}{130.0\,\text{kg}} = -\frac{234.0}{130.0} = -1.80\,\text{m/s}$$

**(b) Average force:**
$$J = m u = 65.0 \times 3.60 = 234.0\,\text{N}\cdot\text{s}$$
$$F_{\text{avg}} = \frac{J}{\Delta t} = \frac{234.0\,\text{N}\cdot\text{s}}{0.250\,\text{s}} = 936.0\,\text{N}$$

---

### Solution 5.9
**(a) Rotor thrust balance:**
To hover motionless, upward rotor thrust must equal total weight:
$$F_{\text{thrust}} = M g = 8000.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 78400.0\,\text{N}$$

Rotor swept area:
$$A = \pi R^2 = \pi (8.00\,\text{m})^2 = 64\pi \approx 201.062\,\text{m}^2$$

**(b) Downwash velocity:**
By momentum flux theory, $F_{\text{thrust}} = \rho A v_{\text{downwash}}^2$:
$$v_{\text{downwash}}^2 = \frac{F_{\text{thrust}}}{\rho A} = \frac{78400.0\,\text{N}}{1.20\,\text{kg/m}^3 \times 201.062\,\text{m}^2} = \frac{78400.0}{241.274} = 324.94\,\text{m}^2/\text{s}^2$$
$$v_{\text{downwash}} = \sqrt{324.94} = 18.026\,\text{m/s} \approx 18.0\,\text{m/s} \approx 64.9\,\text{km/h}$$

Mass flow rate:
$$\frac{dm}{dt} = \rho A v_{\text{downwash}} = 1.20 \times 201.062 \times 18.026 = 4349.3\,\text{kg/s} \approx 4.35\,\text{tons/s}$$

---

### Solution 5.10
Total mass of the three rovers:
$$M_{\text{total}} = m_1 + m_2 + m_3 = 100.0 + 200.0 + 300.0 = 600.0\,\text{kg}$$
Let the rovers lie along a line ($+x$).
Internal forces:
- On Rover 1: $+T_A\,\hat{i}$ from Cable A.
- On Rover 2: $-T_A\,\hat{i}$ from Cable A, and $+T_B\,\hat{i}$ from Cable B.
- On Rover 3: $-T_B\,\hat{i}$ from Cable B.

Individual equations of motion:
$$m_1 \vec{a}_1 = +T_A\,\hat{i}$$
$$m_2 \vec{a}_2 = (-T_A + T_B)\,\hat{i}$$
$$m_3 \vec{a}_3 = -T_B\,\hat{i}$$

Summing all three equations:
$$\sum_{i=1}^3 m_i \vec{a}_i = (+T_A - T_A + T_B - T_B)\,\hat{i} = \vec{0}$$
Since the center of mass acceleration satisfies $M_{\text{total}} \vec{a}_{\text{cm}} = \sum m_i \vec{a}_i$:
$$600.0\,\vec{a}_{\text{cm}} = \vec{0} \implies \vec{a}_{\text{cm}} = \vec{0}$$
The internal cable winching cannot alter the motion of the fleet's center of mass.
