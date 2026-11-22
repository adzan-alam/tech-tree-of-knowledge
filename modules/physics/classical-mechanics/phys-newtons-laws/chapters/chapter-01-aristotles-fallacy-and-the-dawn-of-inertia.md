# CHAPTER 01: The Layman's Genesis — Aristotle's Fallacy & The Dawn of Inertia

> "Every body perseveres in its state of being at rest or of moving uniformly forward in a straight line, except insofar as it is compelled to change its state by forces impressed."
> — **Sir Isaac Newton**, *Philosophiae Naturalis Principia Mathematica* (1687)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Contrast the Aristotelian teleological view of motion ($v \propto F$) with the Galilean-Newtonian principle of inertia.
2. Reconstruct Galileo's double-inclined-plane thought experiment and explain how varying slope angles lead directly to the concept of perpetual horizontal motion.
3. Formulate Newton's First Law of Motion (Lex I) both as a qualitative physical principle and as a formal mathematical condition on the net force vector: $\vec{F}_{\text{net}} = \vec{0} \iff \vec{a} = \vec{0}$.
4. Define an **Inertial Reference Frame** operationally and distinguish it rigorously from non-inertial (accelerating or rotating) frames.
5. Explain everyday manifestations of inertia (e.g., passengers lurching during automobile braking, cargo shifting on cargo ships) without invoking non-existent "forward forces."
6. Apply the principle of dynamic equilibrium ($\sum \vec{F} = \vec{0}$) to systems moving at constant non-zero velocity.
7. Solve 10 progressive numerical problems and 10 chapter mastery exercises involving balanced force fields, friction balancing, and reference frame transformations.

---

## 1.1 The Two-Thousand-Year Deception

For nearly two millennia, Western civilization embraced a view of the physical world formulated by Aristotle of Stagira (384–322 BCE). 

Aristotle’s physics was intuitive, qualitative, and derived from everyday common sense. If you push a wooden cart across a cobblestone street, it moves. If you stop pushing, the cart slows down and rapidly comes to a dead halt. If you slide a heavy stone across dry soil, the stone stops moving the moment your hand separates from it.

From these ubiquitous everyday observations, Aristotle drew what seemed like an unshakeable, self-evident deduction:
> **The Aristotelian Motion Axiom:** *Motion requires a continuously applied mover. Velocity is proportional to the applied force. To keep an object in motion at a constant speed, an active force must constantly push it.*
> $$v \propto F_{\text{applied}}$$

In Aristotle's universe, rest was the natural, preferred state of all terrestrial matter. Motion was an unnatural, violent disturbance that perished the moment the external cause was removed. 

When ancient critics asked: *"If an arrow requires a continuous mover to fly, why does it keep traveling through the air after it leaves the archer's bowstring?"*, Aristotle was forced to invent an awkward workaround known as *antiperistasis*: the arrow supposedly compressed the air ahead of it, and this displaced air rushed around behind the arrow to push the fletching forward!

For two thousand years, this intellectual dogma froze physics in place. The human mind was trapped by its own everyday sensory environment. Because our world is thoroughly drenched in invisible, ubiquitous resisting forces—atmospheric air drag, ground friction, surface roughness—human beings mistakenly assumed that *resistance* was an inherent property of motion itself.

---

## 1.2 Galileo's Inclined Plane and the Thought Experiment

The liberation of human thought began in the late 16th and early 17th centuries with **Galileo Galilei** (1564–1642).

Galileo realized that everyday experience is contaminated by friction. To understand the true laws of nature, one must engage in what he called *esperimento mentale*—a **thought experiment**—mentally stripping away the parasitic effects of the environment to uncover the pure, uncorrupted behavior of matter.

```
                      Galileo's Double Inclined Plane
                      
 Plane 1 (Release)                       Plane 2 (Ascent)
   \                                           /
    \  Ball released from height h            / Ball climbs to height h
     \  o                                    /   o
      \                                     /
       \                                   /  (Steep Incline)
        \_________________________________/
        
 Plane 1 (Release)                       Plane 2 (Gentler Ascent)
   \                                       /
    \  Ball released from height h        / Ball climbs to same height h!
     \  o                                /   o (Traverses greater distance!)
      \                                 /
       \_______________________________/  (Gentle Incline)
       
 Plane 1 (Release)                       Plane 2 (Zero Incline: Horizontal)
   \
    \  Ball released from height h
     \  o
      \
       \____________________________________________________________________...
        Ball rolls forever at constant speed, seeking its original height!
```

Consider Galileo’s famous double-inclined-plane thought experiment:
1. **The Descent:** When a smooth bronze ball rolls down a polished inclined plane, it accelerates. Its speed increases steadily because gravity has a component pulling it along the slope.
2. **The Ascent:** If the ball transitions smoothly onto a second opposing inclined plane, it rolls up the slope. Its speed decreases steadily because gravity has a component opposing its climb.
3. **Height Conservation:** In the limit of an exceptionally smooth, hard surface where friction is minimized, Galileo observed that the ball always climbs to **precisely the same vertical height ($h$)** from which it was released, regardless of whether the second incline is steep or gentle!
4. **Stretching the Slope:** If the opposing incline is made shallower, the ball must travel a significantly longer distance along the plane to reach the release height $h$.
5. **The Horizontal Limit ($\theta \to 0$):** Now, ask the sovereign question: *What happens if the second plane is not inclined at all, but is made perfectly horizontal?*

The ball, seeking to regain its original height $h$, can never reach it, because the horizontal surface never rises!
Therefore, if all friction and air resistance are completely eliminated, **the ball must roll forward forever at an unchanging, constant speed in a straight line.**

Galileo had unlocked the secret of the cosmos:
- **Speed does not require a force to sustain it.**
- Force is not the cause of velocity; **force is the cause of change in velocity** (acceleration).
- In the absence of an external resisting force, an object in motion will naturally, effortlessly preserve its motion forever!

---

## 1.3 Newton's First Law (Lex I): The Law of Inertia

In 1687, Sir Isaac Newton synthesized Galileo’s insights and René Descartes’ concepts of linear momentum into the foundational axiom of classical dynamics, published in the *Principia* as his **First Law of Motion**:

$$\text{Lex I: The Law of Inertia}$$

> **Lex I (Modern Formulation):** *An object at rest remains at rest, and an object in motion continues in motion with a constant velocity (constant speed in a straight line), unless acted upon by a non-zero net external force.*

Mathematically, let $\vec{F}_{\text{net}}$ represent the vector sum of all external forces acting on a body:
$$\vec{F}_{\text{net}} = \sum_{i=1}^N \vec{F}_i$$

Newton's First Law states with uncompromising mathematical precision:
$$\vec{F}_{\text{net}} = \vec{0} \iff \vec{a} = \frac{d\vec{v}}{dt} = \vec{0} \iff \vec{v}(t) = \text{constant}$$

### The Four Pillars of Lex I:
1. **Velocity is a Vector:** The statement that $\vec{v} = \text{constant}$ means both the **scalar speed** ($|\vec{v}|$) and the **direction of motion** ($\hat{u}_v$) are rigidly preserved. If a spacecraft travels at $20,000\,\text{m/s}$ in deep space and its path bends by even $0.001^\circ$, a net external force must have acted upon it!
2. **Rest is Merely a Special Case of Motion:** Being at rest simply means $\vec{v} = \vec{0}$. In classical mechanics, an object at rest and an object moving at $1,000\,\text{m/s}$ in a straight line are in identically the same physical state: both have zero net force acting upon them ($\vec{F}_{\text{net}} = \vec{0}$).
3. **Inertia is an Inherent Property of Matter:** **Inertia** is the natural tendency of an object to resist any change in its state of motion. A $10,000\,\text{kg}$ asteroid floating in the vacuum of deep space is weightless, but it is emphatically **not** massless. If you attempt to push it with your bare hands, its vast inertia resists your push with immense obstinacy.
4. **Dynamic Equilibrium:** An object can have multiple colossal forces acting upon it simultaneously. As long as those forces balance out vectorially such that $\vec{F}_{\text{net}} = \vec{0}$, the object will continue in pure uniform linear motion with zero acceleration.

---

## 1.4 The Common Layman Misconception: The "Forward Force" Illusion

Consider a passenger riding in an automobile cruising down a highway at $100\,\text{km/h}$ ($27.8\,\text{m/s}$). Suddenly, the driver slams on the brakes. 

The passenger feels violently thrown forward against the seatbelt. 

Ask an untrained layman: *"What force pushed the passenger forward?"*
Nine out of ten will answer: *"The braking force pushed me forward,"* or *"The force of inertia flung me forward."*

**Both answers are physically false.**

There is **no forward force**. None! No invisible phantom hand reached from behind the seat to push the passenger forward.
What actually occurred is pure, unadulterated **inertia**:
1. Before braking, both the car and the passenger were moving forward together at $27.8\,\text{m/s}$.
2. When the brakes were applied, the brake pads clamped onto the wheels, and the road exerted a backward friction force **on the car**.
3. The car began decelerating: its speed dropped to $20\,\text{m/s}$, then $10\,\text{m/s}$.
4. The passenger, being a separate physical body, **simply continued moving forward at $27.8\,\text{m/s}$ in accordance with Newton's First Law** until an external force (the seatbelt pulling backward) compelled them to slow down with the car!

```
                  The Automobile Braking Reality
                  
 Before Braking:
   [Car: 100 km/h ---->]
   (Passenger: 100 km/h ---->)   Both moving together uniformly.
   
 During Braking:
   [Car: F_brake <---- slows to 60 km/h]
   (Passenger: Continues at 100 km/h ----> by Lex I!)
   
   The seatbelt applies a BACKWARD force to decelerate the passenger.
   There is ZERO forward force!
```

---

## 1.5 What is an Inertial Reference Frame?

Newton's First Law is not merely a statement about moving bodies; it is the **fundamental operational test that defines an Inertial Reference Frame**.

> **Definition:** An **Inertial Reference Frame** is any reference frame in which Newton's First Law is valid. That is, it is a frame in which an object subjected to zero net external force moves with constant velocity (or remains at rest).

If you place an air hockey puck on a smooth horizontal table inside a train:
- **Case A (Train cruising at constant velocity on straight tracks):** The puck remains motionless on the table. If you tap it gently, it glides across the table in a perfectly straight line at constant speed. Newton's First Law holds. **The cruising train is an inertial reference frame.**
- **Case B (Train enters a sharp curve or slams on its brakes):** The puck suddenly begins accelerating across the table all by itself, without anything touching it! If you attempt to apply $\vec{F}_{\text{net}} = m\vec{a}$ inside this accelerating carriage, it fails catastrophically: the puck accelerates ($\vec{a} \ne \vec{0}$), yet the net real force on it is zero ($\vec{F}_{\text{net}} = \vec{0}$). **The accelerating train is a NON-INERTIAL reference frame.**

To "save" Newton's laws inside a non-inertial frame, one must invent fictitious forces (like the centrifugal force or Coriolis force), which we will explore rigorously in Chapter 10. But in a true inertial frame, every observed acceleration is driven strictly by a real, identifiable physical interaction (gravity, electromagnetic contact, tension, normal force).

### Is the Earth a Pure Inertial Frame?
Strictly speaking, the Earth is **not** an inertial reference frame. It rotates on its axis once every 24 hours, and it orbits the Sun once every 365.25 days.
However, the centripetal acceleration at Earth's equator due to daily rotation is tiny:
$$a_c = \frac{v^2}{R_E} \approx 0.034\,\text{m/s}^2 \approx 0.0035\,g$$

For most human-scale engineering tasks—automobiles, civil structures, artillery, factory robotics—this acceleration is so minuscule that we can treat the Earth as an **inertial reference frame to exceptional precision**.
For long-range ballistic missiles, atmospheric hurricane rotation, and high-precision ocean currents, however, the Earth's non-inertial rotation must be accounted for via the Coriolis effect.

---

## 1.6 Dynamic Equilibrium: $\sum \vec{F} = \vec{0}$

When an object moves with constant velocity, it is said to be in **Dynamic Equilibrium**.
This means the vector sum of all forces acting on the object along every spatial axis must vanish identically:

$$\sum F_x = 0$$
$$\sum F_y = 0$$
$$\sum F_z = 0$$

```
                           +y
                            ^
                            | Normal Force N
                            |
   Friction f_k <-----------*-----------> Applied Force F_app
                            |
                            | Weight W = mg
                            v
                           -y
   If F_app = f_k and N = mg, then F_net = 0.
   The object moves at CONSTANT VELOCITY forever!
```

Consider pushing a heavy packing crate across a warehouse floor at a constant speed of $1.5\,\text{m/s}$.
You must continuously exert a forward force $F_{\text{applied}} = 250\,\text{N}$.
Does this violate Newton's First Law? **Not at all!**
Your forward push of $250\,\text{N}$ does not act in a vacuum. The floor exerts a kinetic friction force of exactly $f_k = 250\,\text{N}$ pointing backward.
The net horizontal force is:
$$F_{\text{net}, x} = F_{\text{applied}} - f_k = 250\,\text{N} - 250\,\text{N} = 0$$

Because the net force is zero, the crate does not accelerate; it maintains its velocity of $1.5\,\text{m/s}$ in complete accordance with Lex I.

---

## 1.7 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 1.1: Voyager 1 Interstellar Cruise
**Problem:** The Voyager 1 spacecraft has crossed the heliopause and is cruising through interstellar space. Its mass is $m = 722\,\text{kg}$ and its speed is $v = 17.0\,\text{km/s} = 17,000\,\text{m/s}$. Its chemical propulsion thrusters have been extinguished for decades.
1. What is the net external force acting on Voyager 1 (neglecting minuscule interstellar gas drag)?
2. How far will Voyager 1 travel over the next $10.0\,\text{years}$?
3. What thrust force is required from the engines to maintain this speed?

#### Solution
**Step 1: Net force**
Because the spacecraft moves in a vacuum far from massive celestial bodies, external forces are negligible:
$$\vec{F}_{\text{net}} = \vec{0}$$
By Newton's First Law, $\vec{a} = \vec{0}$, so its velocity remains constant at $17,000\,\text{m/s}$.

**Step 2: Distance traversed in 10 years**
$$t = 10.0\,\text{years} \times 365.25\,\frac{\text{days}}{\text{year}} \times 24\,\frac{\text{hours}}{\text{day}} \times 3600\,\frac{\text{seconds}}{\text{hour}} = 3.15576 \times 10^8\,\text{s}$$
$$d = v t = 17000\,\text{m/s} \times 3.15576 \times 10^8\,\text{s} = 5.3648 \times 10^{12}\,\text{m} \approx 5.36 \times 10^9\,\text{km} \approx 35.9\,\text{AU}$$

**Step 3: Required engine thrust**
To maintain constant velocity in a zero-resistance environment:
$$F_{\text{thrust}} = 0\,\text{N}$$
No fuel or thrust is required to maintain motion in a vacuum.

---

### Example 1.2: Crate in Dynamic Equilibrium
**Problem:** A warehouse worker pushes a shipping crate of mass $m = 65.0\,\text{kg}$ across a concrete floor at a steady, unchanging velocity of $v = 1.20\,\text{m/s}$ along a straight line. The kinetic friction coefficient between the crate and the floor is $\mu_k = 0.350$.
1. Calculate the normal force exerted by the floor on the crate.
2. Calculate the kinetic friction force opposing motion.
3. Determine the horizontal push force $F_{\text{push}}$ the worker must exert.
4. What happens to the crate's speed if the worker increases the push force to $300.0\,\text{N}$?

#### Solution
**Step 1: Normal force**
Since there is no vertical motion ($a_y = 0$):
$$\sum F_y = N - m g = 0 \implies N = m g = 65.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 637.0\,\text{N}$$

**Step 2: Kinetic friction**
$$f_k = \mu_k N = 0.350 \times 637.0\,\text{N} = 222.95\,\text{N}$$

**Step 3: Horizontal push force**
Because the crate moves at constant velocity ($a_x = 0$):
$$\sum F_x = F_{\text{push}} - f_k = 0 \implies F_{\text{push}} = f_k = 222.95\,\text{N} \approx 223\,\text{N}$$

**Step 4: Increasing push force to $300.0\,\text{N}$**
$$\sum F_x = F_{\text{new}} - f_k = 300.0\,\text{N} - 222.95\,\text{N} = +77.05\,\text{N}$$
Since $\sum F_x > 0$, the net force is non-zero! The crate will **accelerate** forward at:
$$a = \frac{F_{\text{net}}}{m} = \frac{77.05\,\text{N}}{65.0\,\text{kg}} = 1.185\,\text{m/s}^2$$
Its speed will steadily increase.

---

### Example 1.3: The Sliding Curling Stone
**Problem:** A curling stone of mass $m = 19.1\,\text{kg}$ is released on a sheet of tournament ice with an initial speed of $v_0 = 2.40\,\text{m/s}$. The stone glides in a straight line for a distance of $d = 36.0\,\text{m}$ before coming to rest.
1. Assuming constant deceleration, calculate the acceleration of the stone.
2. Determine the net friction force exerted by the ice on the stone.
3. Compute the coefficient of kinetic friction $\mu_k$.
4. How far would the stone travel if the ice were made twice as slick ($\mu_k' = \mu_k / 2$)?

#### Solution
**Step 1: Acceleration from kinematics**
Using Torricelli's formula: $v^2 = v_0^2 + 2 a d$.
$$0 = (2.40)^2 + 2 a (36.0) \implies 72.0 a = -5.76 \implies a = -\frac{5.76}{72.0} = -0.0800\,\text{m/s}^2$$

**Step 2: Net friction force**
$$F_{\text{net}} = m a = 19.1\,\text{kg} \times (-0.0800\,\text{m/s}^2) = -1.528\,\text{N}$$
The friction force is $1.528\,\text{N}$ directed opposite to the stone's motion.

**Step 3: Kinetic friction coefficient**
$$f_k = \mu_k N = \mu_k m g \implies \mu_k = \frac{|f_k|}{m g} = \frac{1.528\,\text{N}}{19.1\,\text{kg} \times 9.80\,\text{m/s}^2} = \frac{1.528}{187.18} = 0.008163 \approx 0.00816$$
(Tournament curling ice has an exceptionally low friction coefficient of $\approx 0.008$).

**Step 4: Halving the friction coefficient**
If $\mu_k' = \mu_k / 2$, the deceleration halves: $a' = a / 2 = -0.0400\,\text{m/s}^2$.
$$d' = \frac{-v_0^2}{2 a'} = \frac{-(2.40)^2}{2(-0.0400)} = \frac{5.76}{0.0800} = 72.0\,\text{m}$$
Halving friction doubles the sliding distance.

---

### Example 1.4: Coffee Cup on an Airplane Table
**Problem:** A jetliner cruises horizontally in smooth, calm air at a constant speed of $v = 900.0\,\text{km/h} = 250.0\,\text{m/s}$ relative to the ground. A passenger places a $0.300\,\text{kg}$ coffee mug on a flat, horizontal tray table.
1. What is the net horizontal force on the mug while the airplane maintains constant cruising velocity?
2. The pilot suddenly encounters mild turbulence and accelerates horizontally forward at $a = +1.50\,\text{m/s}^2$. If the coefficient of static friction between the mug and tray table is $\mu_s = 0.200$, does the mug slide?
3. Calculate the minimum horizontal plane acceleration required to make the mug slide.

#### Solution
**Step 1: Net horizontal force at constant cruise**
Because the aircraft is cruising at constant velocity, it is an inertial reference frame:
$$a_{\text{plane}} = 0 \implies F_{\text{net}, x} = 0\,\text{N}$$
The coffee surface remains perfectly horizontal, exactly as if the plane were parked on the tarmac.

**Step 2: Accelerating at $a = 1.50\,\text{m/s}^2$**
For the mug to accelerate forward along with the table at $a = 1.50\,\text{m/s}^2$, static friction must provide the necessary force:
$$F_{\text{required}} = m a = 0.300\,\text{kg} \times 1.50\,\text{m/s}^2 = 0.450\,\text{N}$$

The maximum static friction force available is:
$$N = m g = 0.300 \times 9.80 = 2.94\,\text{N}$$
$$f_{s,\text{max}} = \mu_s N = 0.200 \times 2.94\,\text{N} = 0.588\,\text{N}$$
Since $F_{\text{required}} = 0.450\,\text{N} \le f_{s,\text{max}} = 0.588\,\text{N}$, static friction is sufficient. **The mug does not slide.**

**Step 3: Threshold acceleration for sliding**
$$m a_{\text{threshold}} = f_{s,\text{max}} = \mu_s m g \implies a_{\text{threshold}} = \mu_s g = 0.200 \times 9.80\,\text{m/s}^2 = 1.96\,\text{m/s}^2$$
If the plane's forward acceleration exceeds $1.96\,\text{m/s}^2$, static friction is overwhelmed and the mug slides backward relative to the tray table.

---

### Example 1.5: Skydiver Terminal Velocity and Lex I
**Problem:** A skydiver of total mass $m = 85.0\,\text{kg}$ jumps from an aircraft. As her speed increases, aerodynamic drag force builds according to $F_{\text{drag}} = c v^2$, where $c = 0.280\,\text{N}\cdot\text{s}^2/\text{m}^2$.
1. At the instant she exits the plane ($v = 0$), what is her acceleration?
2. What is the net force acting on her when her speed reaches $v = 30.0\,\text{m/s}$?
3. Use Newton's First Law to determine her terminal speed $v_{\text{term}}$.

#### Solution
**Step 1: Instant of release ($v = 0$)**
$$F_{\text{drag}} = c(0)^2 = 0\,\text{N}$$
$$F_{\text{net}} = m g - 0 = 85.0 \times 9.80 = 833.0\,\text{N}\quad (\text{downward})$$
$$a = \frac{F_{\text{net}}}{m} = 9.80\,\text{m/s}^2\quad (\text{free fall})$$

**Step 2: Net force at $v = 30.0\,\text{m/s}$**
$$F_{\text{drag}} = 0.280 \times (30.0)^2 = 0.280 \times 900.0 = 252.0\,\text{N}\quad (\text{upward})$$
$$F_{\text{net}} = m g - F_{\text{drag}} = 833.0\,\text{N} - 252.0\,\text{N} = 581.0\,\text{N}\quad (\text{downward})$$
$$a = \frac{581.0\,\text{N}}{85.0\,\text{kg}} = 6.835\,\text{m/s}^2\quad (\text{downward})$$

**Step 3: Terminal velocity via Lex I**
Terminal velocity is defined as the state where speed ceases to change ($v = \text{constant}$).
By Newton's First Law, constant velocity requires zero net force:
$$F_{\text{net}} = 0 \implies m g - F_{\text{drag}} = 0 \implies F_{\text{drag}} = m g$$
$$c v_{\text{term}}^2 = m g \implies v_{\text{term}} = \sqrt{\frac{m g}{c}}$$
$$v_{\text{term}} = \sqrt{\frac{833.0\,\text{N}}{0.280\,\text{N}\cdot\text{s}^2/\text{m}^2}} = \sqrt{2975.0} = 54.54\,\text{m/s} \approx 54.5\,\text{m/s} \approx 196\,\text{km/h}$$

---

### Example 1.6: Pushing a Heavy Cargo Pallet up an Incline at Constant Speed
**Problem:** A forklift pushes a cargo pallet of mass $m = 450.0\,\text{kg}$ up a frictionless ramp inclined at $\theta = 15.0^\circ$ at a constant speed of $v = 0.800\,\text{m/s}$.
1. What is the net force acting on the pallet?
2. What force $F_{\text{push}}$ directed parallel to the ramp must the forklift exert?
3. If the forklift suddenly stalls and its push drops to zero, what is the pallet's immediate acceleration?

#### Solution
**Step 1: Net force**
Because the pallet moves up the ramp at a constant speed along a straight line, its acceleration is zero: $\vec{a} = \vec{0}$.
By Newton's First Law:
$$\vec{F}_{\text{net}} = \vec{0}$$

**Step 2: Push force parallel to ramp**
Align coordinate axes: $+x$ parallel up the ramp, $+y$ perpendicular to the ramp.
Gravitational force component acting down the ramp:
$$F_{gx} = -m g \sin\theta = -450.0 \times 9.80 \times \sin(15.0^\circ) = -4410.0 \times 0.258819 = -1141.39\,\text{N}$$

For dynamic equilibrium along the ramp:
$$\sum F_x = F_{\text{push}} - m g \sin\theta = 0 \implies F_{\text{push}} = m g \sin\theta = 1141.39\,\text{N} \approx 1141\,\text{N}$$

**Step 3: Forklift stalls ($F_{\text{push}} = 0$)**
$$\sum F_x = 0 - m g \sin\theta = -1141.39\,\text{N}$$
$$a_x = \frac{\sum F_x}{m} = \frac{-1141.39\,\text{N}}{450.0\,\text{kg}} = -g \sin(15.0^\circ) = -9.80 \times 0.258819 = -2.536\,\text{m/s}^2$$
The pallet immediately decelerates at $2.54\,\text{m/s}^2$ down the ramp.

---

### Example 1.7: Accelerometer in an Elevator
**Problem:** An electronic sensor of mass $m = 0.500\,\text{kg}$ hangs from a miniature spring scale inside an elevator cab.
1. What is the scale reading (tension $T$) when the elevator is stationary?
2. What is the scale reading when the elevator ascends at a constant velocity of $v = 4.00\,\text{m/s}$?
3. What is the scale reading when the elevator descends at a constant velocity of $v = 6.00\,\text{m/s}$?
4. What is the scale reading when the elevator cable snaps and the cab falls freely?

#### Solution
**Step 1: Stationary elevator ($a = 0$)**
$$\sum F_y = T - m g = 0 \implies T = m g = 0.500\,\text{kg} \times 9.80\,\text{m/s}^2 = 4.90\,\text{N}$$

**Step 2: Ascending at constant velocity ($v = +4.00\,\text{m/s}, a = 0$)**
By Newton's First Law, because velocity is constant, the acceleration is identically zero ($a = 0$).
$$\sum F_y = T - m g = m(0) = 0 \implies T = m g = 4.90\,\text{N}$$
The scale reading is completely unchanged!

**Step 3: Descending at constant velocity ($v = -6.00\,\text{m/s}, a = 0$)**
Again, velocity is constant, so acceleration is zero ($a = 0$).
$$\sum F_y = T - m g = 0 \implies T = 4.90\,\text{N}$$
Constant downward motion produces the exact same scale reading as being stationary.

**Step 4: Free fall ($a = -g = -9.80\,\text{m/s}^2$)**
$$\sum F_y = T - m g = m(-g) \implies T - m g = -m g \implies T = 0\,\text{N}$$
In free fall, the sensor experiences weightlessness; the scale reads zero.

---

### Example 1.8: Three-Rope Static Equilibrium Knot
**Problem:** A junction ring connects three ropes in a horizontal plane.
- Rope 1 pulls with force $\vec{F}_1 = 150.0\,\text{N}$ along the $+x$ axis.
- Rope 2 pulls with force $\vec{F}_2 = 200.0\,\text{N}$ at an angle $\theta_2 = 120.0^\circ$ relative to the $+x$ axis.
- Rope 3 pulls with force $\vec{F}_3$ such that the ring remains permanently at rest at the origin.
Determine the magnitude $|\vec{F}_3|$ and directional angle $\theta_3$ of the third force.

#### Solution
**Step 1: Component decomposition**
Rope 1:
$$F_{1x} = 150.0\,\text{N}, \quad F_{1y} = 0\,\text{N}$$
Rope 2:
$$F_{2x} = 200.0 \cos(120.0^\circ) = 200.0 \times (-0.500) = -100.0\,\text{N}$$
$$F_{2y} = 200.0 \sin(120.0^\circ) = 200.0 \times \frac{\sqrt{3}}{2} = 173.205\,\text{N}$$

**Step 2: Static equilibrium conditions ($\sum \vec{F} = \vec{0}$)**
$$\sum F_x = F_{1x} + F_{2x} + F_{3x} = 0 \implies 150.0 - 100.0 + F_{3x} = 0 \implies F_{3x} = -50.0\,\text{N}$$
$$\sum F_y = F_{1y} + F_{2y} + F_{3y} = 0 \implies 0 + 173.205 + F_{3y} = 0 \implies F_{3y} = -173.205\,\text{N}$$

**Step 3: Magnitude and direction of $\vec{F}_3$**
$$|\vec{F}_3| = \sqrt{F_{3x}^2 + F_{3y}^2} = \sqrt{(-50.0)^2 + (-173.205)^2} = \sqrt{2500.0 + 30000.0} = \sqrt{32500.0} = 180.278\,\text{N} \approx 180.3\,\text{N}$$

Direction angle:
Since both $F_{3x} < 0$ and $F_{3y} < 0$, $\vec{F}_3$ lies in the third quadrant:
$$\theta_3 = 180.0^\circ + \arctan\left(\frac{-173.205}{-50.0}\right) = 180.0^\circ + \arctan(3.4641) = 180.0^\circ + 73.90^\circ = 253.90^\circ \approx 253.9^\circ$$

---

### Example 1.9: Tension in a Towed Glider
**Problem:** A tow plane tows a sailplane of mass $m = 420.0\,\text{kg}$ through level air at a constant speed of $v = 140.0\,\text{km/h} = 38.89\,\text{m/s}$. The sailplane's wings generate a lift force $L$ vertically upward and an aerodynamic drag force $D = 650.0\,\text{N}$ horizontally backward. The tow cable pulls forward and upward at an angle of $\alpha = 10.0^\circ$ above the horizontal.
1. Formulate the equilibrium equations for the sailplane.
2. Calculate the tension $T$ in the tow cable.
3. Calculate the aerodynamic lift force $L$ generated by the wings.

#### Solution
**Step 1: Equilibrium conditions**
Because velocity is constant, $\vec{a} = \vec{0}$:
$$\sum F_x = T \cos\alpha - D = 0$$
$$\sum F_y = L + T \sin\alpha - m g = 0$$

**Step 2: Solve for cable tension $T$**
From the horizontal equation:
$$T \cos(10.0^\circ) = D \implies T = \frac{D}{\cos(10.0^\circ)} = \frac{650.0\,\text{N}}{\cos(10.0^\circ)} = \frac{650.0}{0.984808} = 660.03\,\text{N} \approx 660.0\,\text{N}$$

**Step 3: Solve for lift force $L$**
Total weight:
$$W = m g = 420.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 4116.0\,\text{N}$$
Vertical tension component:
$$T_y = T \sin(10.0^\circ) = 660.03 \times 0.173648 = 114.61\,\text{N}$$
From the vertical equation:
$$L = m g - T \sin\alpha = 4116.0\,\text{N} - 114.61\,\text{N} = 4001.39\,\text{N} \approx 4001\,\text{N}$$

---

### Example 1.10: Sudden Deceleration and Sliding Cargo
**Problem:** A delivery flatbed truck travels horizontally at $v_0 = 22.0\,\text{m/s}$. A heavy tool chest of mass $m = 80.0\,\text{kg}$ rests on the flatbed at a distance $L = 2.50\,\text{m}$ behind the cab. The static and kinetic friction coefficients between the chest and the truck bed are $\mu_s = 0.400$ and $\mu_k = 0.300$. The driver suddenly applies emergency brakes, producing a constant truck deceleration $a_{\text{truck}} = -6.00\,\text{m/s}^2$.
1. Prove that the tool chest slips relative to the truck bed.
2. Find the acceleration of the chest relative to the road.
3. Find the acceleration of the chest relative to the truck bed.
4. Calculate the time elapsed before the chest crashes into the rear cab wall.

#### Solution
**Step 1: Check for slippage**
The maximum deceleration that static friction can impart to the chest without slipping is:
$$a_{\text{max, static}} = \mu_s g = 0.400 \times 9.80\,\text{m/s}^2 = 3.92\,\text{m/s}^2$$
Since the truck's deceleration is $|a_{\text{truck}}| = 6.00\,\text{m/s}^2 > 3.92\,\text{m/s}^2$, static friction is overwhelmed. **The chest slips immediately.**

**Step 2: Acceleration relative to road**
Once sliding, kinetic friction opposes the relative motion. The truck is decelerating faster than the chest, so the chest slides forward relative to the truck bed. Thus, kinetic friction acts **backward** on the chest:
$$f_k = \mu_k m g = 0.300 \times 80.0 \times 9.80 = 235.2\,\text{N}\quad (\text{backward})$$
Acceleration of chest relative to ground:
$$a_{\text{chest/ground}} = -\frac{f_k}{m} = -\mu_k g = -0.300 \times 9.80 = -2.940\,\text{m/s}^2$$

**Step 3: Acceleration relative to truck bed**
Using Galilean relative acceleration:
$$a_{\text{chest/truck}} = a_{\text{chest/ground}} - a_{\text{truck/ground}} = (-2.940\,\text{m/s}^2) - (-6.000\,\text{m/s}^2) = +3.060\,\text{m/s}^2$$
To an observer standing on the truck, the chest accelerates forward toward the cab at $3.06\,\text{m/s}^2$.

**Step 4: Time to impact cab wall**
The initial relative velocity is zero ($v_{\text{rel}, 0} = 0$). Distance to cab is $L = 2.50\,\text{m}$:
$$L = \frac{1}{2} a_{\text{chest/truck}} t^2 \implies 2.50 = 0.5 \times 3.060 \times t^2 = 1.530 t^2$$
$$t^2 = \frac{2.50}{1.530} = 1.63399 \implies t = \sqrt{1.63399} = 1.278\,\text{s} \approx 1.28\,\text{s}$$

---

## 1.8 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 1.1 (Tier 1: Inertial Horizon)
A puck on an air table is struck and moves with an initial velocity $\vec{v}_0 = 4.50\,\hat{i}\,\text{m/s}$. If air resistance and table friction are zero:
(a) What is the puck's velocity after $15.0\,\text{s}$?
(b) What net external force acts on the puck during this time?

### Exercise 1.2 (Tier 1: Dynamic Equilibrium on Carpet)
A child pushes a toy chest of mass $m = 12.0\,\text{kg}$ across a carpet at a constant speed of $v = 0.500\,\text{m/s}$. The kinetic friction coefficient is $\mu_k = 0.420$.
(a) What is the normal force on the chest?
(b) What horizontal force must the child exert to keep the chest moving at constant speed?

### Exercise 1.3 (Tier 2: The Sled Coasting to Rest)
A sled of mass $m = 35.0\,\text{kg}$ is pushed until its speed reaches $v_0 = 6.00\,\text{m/s}$, then released on horizontal snow. It coasts $d = 30.0\,\text{m}$ before stopping.
(a) Determine the acceleration of the sled.
(b) Calculate the coefficient of kinetic friction $\mu_k$ between the runners and the snow.

### Exercise 1.4 (Tier 2: Traffic Light Suspended by Symmetric Cables)
A traffic light of mass $m = 25.0\,\text{kg}$ is suspended from a horizontal cross-arm by two symmetric cables. Each cable makes an angle of $\theta = 30.0^\circ$ with the horizontal.
(a) Write the equilibrium equations along $x$ and $y$.
(b) Calculate the tension $T$ in each cable.

### Exercise 1.5 (Tier 3: Asymmetric Cable Suspension)
A surveillance camera of mass $m = 8.00\,\text{kg}$ is held at rest by two cables:
- Cable 1 pulls at an angle of $\theta_1 = 45.0^\circ$ above the horizontal to the left.
- Cable 2 pulls at an angle of $\theta_2 = 30.0^\circ$ above the horizontal to the right.
Calculate the tensions $T_1$ and $T_2$ in both cables.

### Exercise 1.6 (Tier 3: Terminal Velocity of a High-Speed Train)
An electric locomotive provides a constant tractive forward force of $F_{\text{tractive}} = 45,000.0\,\text{N}$. The mechanical resistance from the rails is constant at $F_{\text{rolling}} = 5,000.0\,\text{N}$, while aerodynamic drag scales quadratically as $F_{\text{aero}} = 1.25 v^2$ (with $v$ in $\text{m/s}$).
(a) Use Newton's First Law to determine the train's maximum constant cruising speed (terminal speed).
(b) Express this speed in $\text{km/h}$.

### Exercise 1.7 (Tier 4: Dynamic Equilibrium with Angled Handle Pull)
A gardener pulls a lawn roller of mass $m = 75.0\,\text{kg}$ across a lawn at a constant speed of $v = 1.10\,\text{m/s}$. The handle is inclined at an angle $\phi = 35.0^\circ$ above the horizontal. The rolling friction coefficient is $\mu_r = 0.250$.
(a) Formulate the 2D equilibrium equations, noting that the upward pull reduces the normal force.
(b) Calculate the required pull force $P$ along the handle.
(c) Calculate the normal force $N$ exerted by the lawn on the roller.

### Exercise 1.8 (Tier 4: Threshold Acceleration for Pendulum Deflection)
A simple pendulum hangs from the ceiling of an electric commuter bus. When the bus travels at a constant velocity $v = 60.0\,\text{km/h}$ along a straight avenue, the pendulum hangs straight down. The bus then begins to brake with constant deceleration $a$. The pendulum string is observed to deflect and remain stationary relative to the bus at an angle of $\theta = 12.0^\circ$ relative to the vertical.
(a) Draw the FBD of the pendulum bob in an inertial ground frame and determine the bus deceleration $a$.
(b) What is the tension in the pendulum string if the bob has mass $m = 0.200\,\text{kg}$?

### Exercise 1.9 (Tier 5: Coupled Block Friction Balancing)
Block A of mass $m_A = 20.0\,\text{kg}$ sits on a horizontal table ($\mu_k = 0.300$). A horizontal light string connects Block A to Block B of mass $m_B = 10.0\,\text{kg}$, which sits on top of Block A. The friction coefficient between Block A and Block B is $\mu_{AB} = 0.200$. An external force $F$ pulls Block A to the right at constant velocity. Block B is held stationary by a separate wall tether.
Calculate the required pulling force $F$.

### Exercise 1.10 (Tier 5: Relativistic/Interstellar Inertial Boundary Check)
An interstellar propulsion concept accelerates an exploration craft from rest with a constant thrust force of $F = 1.00 \times 10^6\,\text{N}$. The craft has a total mass of $m = 50,000\,\text{kg}$.
(a) In Newtonian mechanics, how many days are required for the craft to reach $10.0\%$ of the speed of light ($c = 3.00 \times 10^8\,\text{m/s}$)?
(b) Once the target speed of $0.100\,c$ is reached, the engines are powered off. How many light-years will the craft travel over the next century under Newton's First Law?

---

## 1.9 Comprehensive Solutions to Chapter Exercises

---

### Solution 1.1
**(a) Velocity after $15.0\,\text{s}$:**
In the absence of external forces, $\vec{F}_{\text{net}} = \vec{0}$. By Newton's First Law:
$$\vec{v}(15.0) = \vec{v}_0 = 4.50\,\hat{i}\,\text{m/s}$$

**(b) Net force:**
$$\vec{F}_{\text{net}} = \vec{0}\,\text{N}$$

---

### Solution 1.2
**(a) Normal force:**
Since there is no vertical motion:
$$N = m g = 12.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 117.6\,\text{N}$$

**(b) Required horizontal push force:**
For dynamic equilibrium ($v = \text{constant} \implies a = 0$):
$$F_{\text{push}} = f_k = \mu_k N = 0.420 \times 117.6\,\text{N} = 49.392\,\text{N} \approx 49.4\,\text{N}$$

---

### Solution 1.3
**(a) Acceleration:**
Using $v^2 = v_0^2 + 2 a d$ with $v = 0, v_0 = 6.00\,\text{m/s}, d = 30.0\,\text{m}$:
$$0 = (6.00)^2 + 2 a (30.0) \implies 60.0 a = -36.0 \implies a = -\frac{36.0}{60.0} = -0.600\,\text{m/s}^2$$

**(b) Friction coefficient $\mu_k$:**
The only horizontal force acting during coasting is kinetic friction:
$$-f_k = m a \implies -\mu_k m g = m a \implies \mu_k = -\frac{a}{g} = \frac{0.600\,\text{m/s}^2}{9.80\,\text{m/s}^2} = 0.06122 \approx 0.0612$$

---

### Solution 1.4
**(a) Equilibrium equations:**
Let $T$ be the tension in each cable.
$$\sum F_x = T \cos(30.0^\circ) - T \cos(30.0^\circ) = 0 \quad (\text{identically satisfied by symmetry})$$
$$\sum F_y = 2 T \sin(30.0^\circ) - m g = 0$$

**(b) Tension $T$:**
Since $\sin(30.0^\circ) = 0.500$:
$$2 T (0.500) = m g \implies T = m g = 25.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 245.0\,\text{N}$$

---

### Solution 1.5
Total weight of camera:
$$W = m g = 8.00\,\text{kg} \times 9.80\,\text{m/s}^2 = 78.40\,\text{N}$$

Equilibrium equations:
$$\sum F_x = -T_1 \cos(45.0^\circ) + T_2 \cos(30.0^\circ) = 0 \implies T_1 \cos(45.0^\circ) = T_2 \cos(30.0^\circ)$$
$$T_1 (0.707107) = T_2 (0.866025) \implies T_1 = 1.22474 T_2$$

Vertical equation:
$$\sum F_y = T_1 \sin(45.0^\circ) + T_2 \sin(30.0^\circ) - 78.40 = 0$$
Substitute $T_1 = 1.22474 T_2$:
$$(1.22474 T_2)(0.707107) + T_2 (0.500) = 78.40$$
Notice that $1.22474 \times 0.707107 = \frac{\sqrt{3}}{\sqrt{2}} \times \frac{1}{\sqrt{2}} = \frac{\sqrt{3}}{2} = 0.866025$:
$$0.866025 T_2 + 0.500 T_2 = 78.40 \implies 1.366025 T_2 = 78.40$$
$$T_2 = \frac{78.40}{1.366025} = 57.39\,\text{N}$$
$$T_1 = 1.22474 \times 57.39\,\text{N} = 70.29\,\text{N}$$

---

### Solution 1.6
**(a) Terminal cruising speed:**
At maximum cruising speed, velocity is constant ($\vec{a} = \vec{0}$).
By Newton's First Law:
$$\sum F = F_{\text{tractive}} - F_{\text{rolling}} - F_{\text{aero}} = 0$$
$$45000.0 - 5000.0 - 1.25 v^2 = 0$$
$$1.25 v^2 = 40000.0 \implies v^2 = \frac{40000.0}{1.25} = 32000.0\,\text{m}^2/\text{s}^2$$
$$v = \sqrt{32000.0} = 178.885\,\text{m/s} \approx 178.9\,\text{m/s}$$

**(b) Speed in km/h:**
$$v = 178.885 \times 3.6 = 643.99\,\text{km/h} \approx 644\,\text{km/h}$$

---

### Solution 1.7
**(a) Formulate 2D equilibrium:**
Let $P$ be the pull force at angle $\phi = 35.0^\circ$.
Vertical equilibrium:
$$\sum F_y = N + P \sin\phi - m g = 0 \implies N = m g - P \sin\phi$$
Horizontal equilibrium:
$$\sum F_x = P \cos\phi - f_r = 0$$
where $f_r = \mu_r N = \mu_r (m g - P \sin\phi)$.

**(b) Solve for pull force $P$:**
$$P \cos\phi - \mu_r (m g - P \sin\phi) = 0$$
$$P \cos\phi + \mu_r P \sin\phi = \mu_r m g$$
$$P (\cos\phi + \mu_r \sin\phi) = \mu_r m g \implies P = \frac{\mu_r m g}{\cos\phi + \mu_r \sin\phi}$$

Substitute numbers:
- $m g = 75.0 \times 9.80 = 735.0\,\text{N}$
- $\mu_r m g = 0.250 \times 735.0 = 183.75\,\text{N}$
- $\cos(35.0^\circ) = 0.819152$
- $\sin(35.0^\circ) = 0.573576 \implies \mu_r \sin(35.0^\circ) = 0.250 \times 0.573576 = 0.143394$
- Denominator: $0.819152 + 0.143394 = 0.962546$

$$P = \frac{183.75\,\text{N}}{0.962546} = 190.90\,\text{N} \approx 190.9\,\text{N}$$

**(c) Normal force $N$:**
$$N = m g - P \sin(35.0^\circ) = 735.0 - (190.90 \times 0.573576) = 735.0 - 109.50 = 625.50\,\text{N} \approx 625.5\,\text{N}$$

---

### Solution 1.8
**(a) Bus deceleration:**
In an inertial ground frame, the only real forces acting on the pendulum bob are:
1. Downward gravity: $W = m g$
2. Cable tension: $T$ directed at angle $\theta = 12.0^\circ$ to the vertical (pulling up and forward to decelerate the bob).

Vertical equilibrium:
$$T \cos\theta - m g = 0 \implies T \cos\theta = m g$$
Horizontal dynamics (deceleration $a$):
$$T \sin\theta = m a$$

Divide horizontal equation by vertical equation:
$$\frac{T \sin\theta}{T \cos\theta} = \frac{m a}{m g} \implies \tan\theta = \frac{a}{g}$$
$$a = g \tan\theta = 9.80\,\text{m/s}^2 \times \tan(12.0^\circ) = 9.80 \times 0.212557 = 2.083\,\text{m/s}^2 \approx 2.08\,\text{m/s}^2$$

**(b) String tension:**
$$T = \frac{m g}{\cos\theta} = \frac{0.200\,\text{kg} \times 9.80\,\text{m/s}^2}{\cos(12.0^\circ)} = \frac{1.960\,\text{N}}{0.978148} = 2.0038\,\text{N} \approx 2.00\,\text{N}$$

---

### Solution 1.9
**Step 1: Normal force on Block B**
$$N_B = m_B g = 10.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 98.0\,\text{N}$$
Friction between Block B and Block A:
$$f_{AB} = \mu_{AB} N_B = 0.200 \times 98.0\,\text{N} = 19.6\,\text{N}$$

**Step 2: Normal force on Block A from the table**
Block A supports both its own mass and Block B's mass:
$$N_{\text{table}} = (m_A + m_B) g = (20.0 + 10.0) \times 9.80 = 30.0 \times 9.80 = 294.0\,\text{N}$$
Friction between table and Block A:
$$f_{\text{table}} = \mu_k N_{\text{table}} = 0.300 \times 294.0\,\text{N} = 88.2\,\text{N}$$

**Step 3: Horizontal equilibrium on Block A**
As Block A moves to the right:
1. Table friction pulls backward on A: $f_{\text{table}} = 88.2\,\text{N}$.
2. Block B (held by wall) exerts backward friction on the top surface of A: $f_{AB} = 19.6\,\text{N}$.
For constant velocity of Block A ($a_A = 0$):
$$\sum F_x = F - f_{\text{table}} - f_{AB} = 0 \implies F = f_{\text{table}} + f_{AB} = 88.2\,\text{N} + 19.6\,\text{N} = 107.8\,\text{N}$$

---

### Solution 1.10
**(a) Time to reach $0.100\,c$:**
Target speed: $v = 0.100 \times (3.00 \times 10^8\,\text{m/s}) = 3.00 \times 10^7\,\text{m/s}$.
Acceleration:
$$a = \frac{F}{m} = \frac{1.00 \times 10^6\,\text{N}}{50000\,\text{kg}} = 20.0\,\text{m/s}^2 \approx 2.04\,g$$
Time to reach speed:
$$t = \frac{v}{a} = \frac{3.00 \times 10^7\,\text{m/s}}{20.0\,\text{m/s}^2} = 1.50 \times 10^6\,\text{s}$$
In days:
$$t_{\text{days}} = \frac{1.50 \times 10^6\,\text{s}}{86400\,\text{s/day}} = 17.36\,\text{days}$$

**(b) Distance traveled over 1 century:**
By Newton's First Law, once engines shut down in a vacuum, velocity remains strictly constant at $v = 0.100\,c$.
In 1 year, light travels $1.00\,\text{light-year}$ (by definition).
Since the craft travels at $0.100\,c$, in 1 year it travels $0.100\,\text{light-years}$.
Over $100\,\text{years}$ (1 century):
$$D = 0.100\,\frac{\text{ly}}{\text{year}} \times 100\,\text{years} = 10.0\,\text{light-years}$$
