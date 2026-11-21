# CHAPTER 8: The Bridge Between Systems — Trigonometry, Angles, and Polar Coordinates

---

## 8.1 Polar Coordinates vs. Cartesian Coordinates

Up to this point, we have represented every vector using **Cartesian Components**: how far to step horizontally ($v_x$) and how far to step vertically ($v_y$).

This is the language of a city street grid: *"Walk 4 blocks East and 3 blocks North."*

```
             CARTESIAN SYSTEM                      POLAR SYSTEM
             (Rectangular Grid)                 (Radar / Compass)
             
                 Y ^                                Y ^
                   │                                  │        ● (r, θ)
                   │      ● (v_x, v_y)                │       /
                   │     /│                           │   r  /
               v_y │    / │                       r   │     /
                   │   /  │ (Hypotenuse)              │    /  Angle θ
                   │  /   │                           │   / )
             ──────┼─●────┴──────► X            ──────┼──●────────────► X
                  0│   v_x                           0│
```

Now imagine you are a submarine sonar operator watching a green phosphor radar screen, an air traffic controller tracking incoming flights, or an archer drawing a longbow.

You do not think: *"I will aim my arrow 12.4 centimeters East and 18.6 centimeters North."*

Instead, you think naturally in two completely different terms:
1. **How far away is the target?** (Range or Radius: $r$).
2. **In what direction am I aiming?** (Angle or Compass Heading: $\theta$).

This alternative language is called the **Polar Coordinate System**.

Both systems describe the exact same physical space. To be a master of computational mechanics, physics, and robotics, you must be able to translate back and forth between Cartesian $(x, y)$ and Polar $(r, \theta)$ instantaneously with zero friction.

---

## 8.2 From Polar to Cartesian: Projecting with Sine and Cosine

Suppose you are given an arrow described in Polar Coordinates:
- Length (Magnitude): $r = \|\vec{v}\|$
- Counter-Clockwise Angle from $+X$ axis: $\theta$

How do you find the rectangular components $(v_x, v_y)$?

We return to our faithful right-angled triangle. In elementary trigonometry, the three primary ratios are defined as:

$$\sin\theta = \frac{\text{Opposite}}{\text{Hypotenuse}} = \frac{v_y}{\|\vec{v}\|}$$
$$\cos\theta = \frac{\text{Adjacent}}{\text{Hypotenuse}} = \frac{v_x}{\|\vec{v}\|}$$

Now, multiply both sides by the hypotenuse length $\|\vec{v}\|$:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   POLAR TO CARTESIAN TRANSFORMATION                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│         v_x = ||v|| * cos(θ)    (Horizontal Component)                 │
│         v_y = ||v|| * sin(θ)    (Vertical Component)                   │
│                                                                        │
│  In column format:                                                     │
│         v = ||v|| * [ cos(θ) ]                                         │
│                     [ sin(θ) ]                                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

Notice that $\begin{bmatrix} \cos\theta \\ \sin\theta \end{bmatrix}$ is simply our old friend: **The Unit Vector $\hat{v}$**!
Because $\cos^2\theta + \sin^2\theta \equiv 1.0$, the vector $(\cos\theta, \sin\theta)$ always has a length of $1.0$ for any angle in the universe.

---

## 8.3 From Cartesian to Polar: The Angle Extraction Dilemma

Now consider the reverse problem. 

You have the components $\vec{v} = (v_x, v_y)$. You already know how to find the radius $r$ using Pythagoras:
$$r = \|\vec{v}\| = \sqrt{v_x^2 + v_y^2}$$

**But how do you find the angle $\theta$?**

From right-triangle trigonometry:
$$\tan\theta = \frac{\text{Opposite}}{\text{Adjacent}} = \frac{v_y}{v_x}$$

To isolate $\theta$, the naive high school textbook says to take the inverse tangent (arctangent):

$$\theta \stackrel{?}{=} \arctan\left(\frac{v_y}{v_x}\right)$$

### The Fatal Flaw of $\arctan(y / x)$
This naive formula will **destroy your computer code** if you put it in a game engine or robot controller!

Why? Two devastating mathematical reasons:

1. **Division by Zero:**
   If your vector points straight North $(0, 5)$ or straight South $(0, -5)$, then $v_x = 0$.
   $$\frac{v_y}{v_x} = \frac{5}{0} \implies \text{CRASH! (Division by zero / Infinity)}$$

2. **The Lost Sign Information (Quadrant Confusion):**
   Consider two completely opposing vectors:
   - Vector $A$ in **Quadrant I**: $\vec{u} = (+3, +4) \implies \frac{v_y}{v_x} = \frac{+4}{+3} = +1.333$
   - Vector $B$ in **Quadrant III**: $\vec{w} = (-3, -4) \implies \frac{v_y}{v_x} = \frac{-4}{-3} = +1.333$

Notice that both divisions produce the **exact same scalar number: $+1.333$**!
When you pass $+1.333$ into standard `arctan`, the function outputs:
$$\theta = \arctan(1.333) \approx +53.13^\circ$$

Vector $A$ indeed points at $53.13^\circ$ (North-East). But Vector $B$ points at $233.13^\circ$ (South-West)! 
The standard arctangent function is **completely blind** to the difference between Quadrant I and Quadrant III. It points your robot $180^\circ$ in the wrong direction!

---

## 8.4 The Hero of Computational Geometry: `atan2(y, x)`

In the late 1960s, computer scientists and aerospace engineers solving lunar landing trajectories realized that standard trigonometry was inadequate for computer software.

They invented a new, universal primitive function: **The 2-Argument Arctangent: `atan2(y, x)`**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE atan2(y, x) ENGINE                          │
├────────────────────────────────────────────────────────────────────────┤
│  Unlike standard atan(y / x), atan2 takes TWO separate arguments:      │
│  It inspects the INDIVIDUAL SIGNS of both x and y before dividing.     │
│                                                                        │
│  1. Quadrant I   (x > 0, y > 0): θ = arctan(y/x)                       │
│  2. Quadrant II  (x < 0, y > 0): θ = arctan(y/x) + π  (+180°)          │
│  3. Quadrant III (x < 0, y < 0): θ = arctan(y/x) - π  (-180°)          │
│  4. Quadrant IV  (x > 0, y < 0): θ = arctan(y/x)                       │
│  5. Positive Y   (x = 0, y > 0): θ = +π/2             (+90°)           │
│  6. Negative Y   (x = 0, y < 0): θ = -π/2             (-90°)           │
│  7. Origin       (x = 0, y = 0): θ = 0.0              (Undefined safe) │
│                                                                        │
│  Outputs a continuous, safe angle spanning the full 360° circle:       │
│  Range: -π to +π radians (-180° to +180°).                             │
└────────────────────────────────────────────────────────────────────────┘
```

Every major programming language in modern history—TypeScript, C++, Python, Rust, Java, GLSL—implements `Math.atan2(y, x)`. 

---

## 8.5 Radians vs. Degrees: The True Currency of Angles

In daily life, humans measure angles in **Degrees** ($0^\circ$ to $360^\circ$). We divide a circle into 360 degrees because ancient Babylonian astronomers noticed that the sun takes approximately 365 days to travel through the constellations.

In mathematics and physics, 360 is an arbitrary human convention. The natural, universal unit of angular measurement is the **Radian**.

```
                                  Y ^ +90° (π/2)
                                    │
                                    │
                                    │
               180° (π)             │             0° (0 rad)
             ───────────────────────┼───────────────────────► X
                                    │             360° (2π)
                                    │
                                    │
                                    │
                                    v -90° or 270° (3π/2)
```

### The Definition of a Radian
One radian is the angle subtended at the center of a circle by an arc whose length is **exactly equal to the radius $R$**.

Because the total circumference of a circle is $C = 2\pi R$, there are **$2\pi$ radians** in a full $360^\circ$ turn:

$$360^\circ = 2\pi\text{ radians} \implies 180^\circ = \pi\text{ radians}$$

### Conversion Formulas
$$\text{Radians} = \text{Degrees} \times \left(\frac{\pi}{180^\circ}\right)$$
$$\text{Degrees} = \text{Radians} \times \left(\frac{180^\circ}{\pi}\right)$$

*Common Conversions to Memorize:*
- $30^\circ = \pi / 6 \approx 0.5236\text{ rad}$
- $45^\circ = \pi / 4 \approx 0.7854\text{ rad}$
- $60^\circ = \pi / 3 \approx 1.0472\text{ rad}$
- $90^\circ = \pi / 2 \approx 1.5708\text{ rad}$
- $180^\circ = \pi \approx 3.14159\text{ rad}$

---

## 8.6 Socratic Dialogue: The Analog Joystick Paradox

> **Alice:** "Why do game controllers care about polar coordinates? My thumb just pushes the analog stick around."
>
> **The Vectorist:** "An analog joystick uses two internal potentiometers that output Cartesian voltages: $X$ and $Y$ between $-1.0$ and $+1.0$.
> Suppose a player pushes the stick hard into the top-right diagonal corner: $x = 1.0$ and $y = 1.0$.
> What is the magnitude of that joystick vector?"
>
> **Alice:** "$\sqrt{1.0^2 + 1.0^2} = \sqrt{2} \approx 1.414$!"
>
> **The Vectorist:** "Aha! If you don't use polar math, pushing diagonally makes your character run **41% faster** than pushing straight forward! This was a famous bug in early 3D video games like *GoldenEye 007* and *Quake* called 'Strafe-Running'!"
>
> **Alice:** "Gamers could run faster by running sideways at an angle?"
>
> **The Vectorist:** "Yes! To fix this bug, modern game developers convert the $(x, y)$ joystick input to Polar $(r, \theta)$. If $r > 1.0$, they clamp $r = 1.0$, preserving the angle $\theta$, and then convert back to Cartesian coordinates. The player runs at a uniform speed in every direction."

---

## 8.7 Ten Concrete Worked Numerical Examples: Polar & Cartesian

---

### Example 1: Polar to Cartesian (Quadrant I)
* **Problem:** A radar station detects an aircraft at range $r = 50\text{ km}$ at an angle of $\theta = 30^\circ$ North of East. Find its Cartesian coordinates $(x, y)$.
* **Calculation:**
  - Recall: $\cos(30^\circ) = \frac{\sqrt{3}}{2} \approx 0.8660$, $\sin(30^\circ) = 0.5000$.
  $$x = r \cos\theta = 50 \times \cos(30^\circ) = 50 \times 0.8660 = 43.30\text{ km}$$
  $$y = r \sin\theta = 50 \times \sin(30^\circ) = 50 \times 0.5000 = 25.00\text{ km}$$
  Cartesian Vector: $\vec{p} = (43.30, 25.00)\text{ km}$.

---

### Example 2: Polar to Cartesian (Quadrant II)
* **Problem:** A naval vessel steams with speed $v = 20\text{ knots}$ at heading $\theta = 135^\circ$. Calculate its velocity components.
* **Calculation:**
  - $135^\circ$ is in Quadrant II. $\cos(135^\circ) = -\frac{\sqrt{2}}{2} \approx -0.7071$, $\sin(135^\circ) = +\frac{\sqrt{2}}{2} \approx +0.7071$.
  $$v_x = 20 \cos(135^\circ) = 20 \times (-0.7071) = -14.14\text{ knots}$$
  $$v_y = 20 \sin(135^\circ) = 20 \times (+0.7071) = +14.14\text{ knots}$$
  Velocity: $\vec{v} = (-14.14, +14.14)\text{ knots}$.

---

### Example 3: Polar to Cartesian (Quadrant IV)
* **Problem:** A force of magnitude $F = 100\text{ N}$ pulls at an angle of $\theta = -60^\circ$ (or $300^\circ$). Find the force components.
* **Calculation:**
  - $\cos(-60^\circ) = 0.5000$, $\sin(-60^\circ) = -\frac{\sqrt{3}}{2} \approx -0.8660$.
  $$F_x = 100 \cos(-60^\circ) = 100 \times 0.5 = +50.0\text{ N}$$
  $$F_y = 100 \sin(-60^\circ) = 100 \times (-0.8660) = -86.6\text{ N}$$
  Force: $\vec{F} = (50.0, -86.6)\text{ N}$.

---

### Example 4: Cartesian to Polar (Quadrant I)
* **Problem:** Convert $\vec{v} = (3, 4)$ into polar coordinates $(r, \theta)$.
* **Calculation:**
  1. Magnitude: $r = \sqrt{3^2 + 4^2} = \sqrt{25} = 5.0$.
  2. Angle:
     $$\theta = \text{atan2}(4, 3) \approx 0.9273\text{ radians}$$
     $$\theta_{\text{deg}} = 0.9273 \times \left(\frac{180}{\pi}\right) \approx 53.13^\circ$$
  Polar form: $(r = 5.0, \theta = 53.13^\circ)$.

---

### Example 5: Cartesian to Polar (Quadrant II)
* **Problem:** Convert $\vec{w} = (-6, 8)$ into polar coordinates $(r, \theta)$.
* **Calculation:**
  1. Magnitude: $r = \sqrt{(-6)^2 + 8^2} = \sqrt{36 + 64} = 10.0$.
  2. Angle using `atan2(y, x)`:
     $$\theta = \text{atan2}(8, -6) \approx 2.2143\text{ radians}$$
     $$\theta_{\text{deg}} = 2.2143 \times \left(\frac{180}{\pi}\right) \approx 126.87^\circ$$
* **Sanity Check:** $126.87^\circ$ lies comfortably between $90^\circ$ and $180^\circ$ in Quadrant II. Correct!

---

### Example 6: Cartesian to Polar (Quadrant III)
* **Problem:** Convert $\vec{s} = (-5, -5)$ into polar coordinates.
* **Calculation:**
  1. Magnitude: $r = \sqrt{(-5)^2 + (-5)^2} = \sqrt{50} = 5\sqrt{2} \approx 7.071$.
  2. Angle:
     $$\theta = \text{atan2}(-5, -5) = -\frac{3\pi}{4}\text{ rad} = -135^\circ\text{ (or }+225^\circ)$$
  Polar form: $(r = 7.071, \theta = 225^\circ)$.

---

### Example 7: Projectile Launch Velocity
* **Problem:** A cannon fires an artillery shell with a muzzle speed of $v_0 = 250\text{ m/s}$ at an elevation angle of $\theta = 37^\circ$ above the horizontal. (Given: $\cos 37^\circ \approx 0.80$, $\sin 37^\circ \approx 0.60$).
  Calculate the initial velocity vector $\vec{v}_0$.
* **Calculation:**
  $$v_{0x} = v_0 \cos\theta = 250 \times 0.80 = 200\text{ m/s}$$
  $$v_{0y} = v_0 \sin\theta = 250 \times 0.60 = 150\text{ m/s}$$
  $$\vec{v}_0 = \begin{bmatrix} 200 \\ 150 \end{bmatrix}\text{ m/s}$$

---

### Example 8: Steering a Robot Toward a Target Waypoint
* **Problem:** An autonomous robot is at position $(10, 10)$ facing East ($\theta_{\text{robot}} = 0^\circ$). It must travel to waypoint $(40, 50)$. What angle $\theta_{\text{target}}$ should its wheels turn?
* **Calculation:**
  1. Displacement vector: $\vec{d} = (40 - 10, 50 - 10) = (30, 40)\text{ meters}$.
  2. Desired steering angle:
     $$\theta_{\text{target}} = \text{atan2}(40, 30) = \text{atan2}(4, 3) \approx 53.13^\circ$$
  3. Turn delta: $\Delta\theta = 53.13^\circ - 0^\circ = +53.13^\circ$ (turn $53.13^\circ$ to the left / counter-clockwise).

---

### Example 9: Rotating a Vector by $90^\circ$ (Orthogonal Turn)
* **Problem:** Let vector $\vec{v} = (x, y)$ have polar form $(r, \theta)$. Rotate this vector counter-clockwise by $+90^\circ$ ($+\pi/2$ radians).
* **Trigonometric Derivation:**
  New angle is $\theta' = \theta + 90^\circ$.
  $$x' = r \cos(\theta + 90^\circ) = r (-\sin\theta) = -r\sin\theta = -y$$
  $$y' = r \sin(\theta + 90^\circ) = r (\cos\theta) = r\cos\theta = +x$$
* **The Magic $90^\circ$ 2D Rotation Rule:**
  $$\text{Rotate90}(\begin{bmatrix} x \\ y \end{bmatrix}) = \begin{bmatrix} -y \\ x \end{bmatrix}$$
  You don't need any trigonometric functions to rotate a 2D vector by $90^\circ$! Just swap the components and negate the new $X$.
  *Example:* $(3, 4)$ rotated $90^\circ$ becomes $(-4, 3)$.
  Length check: $\sqrt{(-4)^2 + 3^2} = 5$. Length is completely preserved!

---

### Example 10: Clamping Analog Joystick Inputs in Software
* **Problem:** Write a production-grade TypeScript function that takes raw joystick axes $(x, y)$ and clamps the magnitude to $1.0$ while strictly preserving the steering angle.
* **Implementation:**
  ```typescript
  function processJoystickInput(rawX: number, rawY: number): { x: number; y: number; angle: number } {
    const deadzone = 0.08; // Ignore noise near center
    const lenSq = rawX * rawX + rawY * rawY;
    
    if (lenSq < deadzone * deadzone) {
      return { x: 0, y: 0, angle: 0 };
    }

    const len = Math.sqrt(lenSq);
    const angle = Math.atan2(rawY, rawX); // Safe angle in radians

    // Clamp radius to 1.0 to prevent diagonal speed boosting!
    const clampedLen = Math.min(len, 1.0);

    return {
      x: clampedLen * Math.cos(angle),
      y: clampedLen * Math.sin(angle),
      angle: angle
    };
  }
  ```

---

## 8.8 Debunked Misconceptions & Software Traps

### Software Trap 1: The `atan2(y, x)` Parameter Order Trap!
In standard coordinate geometry, we always say $(x, y)$ ($X$ first, $Y$ second).
In virtually every programming language (JavaScript, C++, Python):
`Math.atan2(y, x)` $\to$ **$Y$ IS PASSED FIRST! $X$ IS PASSED SECOND!**
If you accidentally write `Math.atan2(x, y)`, your code will compile without errors, but your robot or game character will steer reflected across the diagonal axis!

### Software Trap 2: Degrees vs. Radians in Programming Languages
Human minds think in degrees ($45^\circ, 90^\circ$).
Standard math libraries (`Math.sin()`, `Math.cos()`, `Math.atan2()`) **STRICTLY OPERATE IN RADIANS**.
If you write `Math.cos(60)`, expecting $0.5$, you will get $-0.9524$ because JavaScript evaluates $60\text{ radians}$ ($\approx 3437^\circ$)!
Always convert: `Math.cos(deg * Math.PI / 180)`.

---

## 8.9 Historical Context: From Babylon to Islamic Trigonometry

The word *Trigonometry* comes from Greek (*trigonon* = triangle, *metron* = measure).

The Greek astronomer **Hipparchus of Nicaea** (190–120 BCE) produced the first table of "Chords"—measuring the straight-line chord across circular arcs to calculate planetary orbits.

However, modern trigonometry was truly forged during the **Islamic Golden Age** in Baghdad and Damascus. 

In the 9th century, Persian polymath **Al-Battani** (858–929 CE) abandoned cumbersome chords and introduced the clean mathematical functions of **Sine** (*al-Jayb*) and **Cosine**. The Arabic word *jayb* means a "fold" or "pocket" of a garment. 

When European scholars in Toledo, Spain, translated Arabic mathematical texts into Latin in the 12th century, the translator Robert of Chester mistook *jayb* for the Arabic word *jaib* (meaning "bay" or "cove"). He translated it into the Latin word for a bay or fold: **Sinus**. 

From the Latin *sinus*, we inherited our modern word **Sine**. Every time you calculate a vector component $v_y = \|\vec{v}\| \sin\theta$, you are using an intellectual lineage stretching from ancient Baghdad to medieval Toledo to modern silicon microprocessors.

---

## 8.10 Chapter 8 Mastery Problem Set

Consolidate your mastery of trigonometry, polar coordinates, and angles with these 10 exercises.

### Problems

1. **[Tier 1 - Class 6]** Convert the following angles between degrees and radians:
   - (a) $90^\circ$ to radians
   - (b) $45^\circ$ to radians
   - (c) $\pi / 3\text{ radians}$ to degrees
   - (d) $\pi\text{ radians}$ to degrees

2. **[Tier 1 - Class 6]** A radar beacon measures an airborne helicopter at polar coordinates $(r = 20\text{ km}, \theta = 0^\circ)$.
   - What are the helicopter's Cartesian coordinates $(x, y)$?
   - What if the helicopter is at $(r = 20\text{ km}, \theta = 90^\circ)$?

3. **[Tier 2 - Class 7]** Convert the polar vector $\vec{v} = (r = 10, \theta = 60^\circ)$ into Cartesian coordinates $(v_x, v_y)$. (Use $\cos 60^\circ = 0.50$, $\sin 60^\circ \approx 0.866$).

4. **[Tier 2 - Class 7]** A submarine sonar detects an underwater vessel at Cartesian displacement $\vec{s} = (12, 12)\text{ km}$.
   - What is the sonar range (magnitude $r$)?
   - What is the compass bearing angle $\theta$ in degrees?

5. **[Tier 3 - Class 8]** Using `atan2`, calculate the polar angle $\theta$ (in degrees, between $-180^\circ$ and $+180^\circ$) for each of the following four vectors:
   - (a) $\vec{a} = (4, 4)$
   - (b) $\vec{b} = (-4, 4)$
   - (c) $\vec{c} = (-4, -4)$
   - (d) $\vec{d} = (4, -4)$

6. **[Tier 3 - Class 8]** An archer releases an arrow with speed $v_0 = 50\text{ m/s}$ at an angle of $\theta = 45^\circ$ above the horizontal.
   - Calculate the initial horizontal velocity $v_{0x}$.
   - Calculate the initial vertical velocity $v_{0y}$.

7. **[Tier 4 - High School]** A wind turbine blade is rotating counter-clockwise. At a certain instant, the blade tip vector is $\vec{r} = (15, 20)\text{ meters}$ relative to the rotor hub.
   - Using the $90^\circ$ rotation rule, write the velocity direction vector perpendicular to the blade.
   - Confirm that the rotated vector has the exact same length as the original blade.

8. **[Tier 4 - High School]** A robotic arm joint at $(0, 0)$ has a forearm of length $L_1 = 30\text{ cm}$ at angle $\theta_1 = 30^\circ$, and an attached hand of length $L_2 = 20\text{ cm}$ angled at $\theta_2 = 60^\circ$ relative to the horizontal.
   - Find the Cartesian position $(x_1, y_1)$ of the elbow joint.
   - Find the Cartesian position $(x_2, y_2)$ of the fingertip.

9. **[Tier 5 - University / Robotics]** An autonomous vacuum cleaner is at position $(0, 0)$ facing heading $\theta = 45^\circ$ ($+0.7854\text{ rad}$). It senses a charging dock at position $(20, 0)\text{ cm}$.
   - Calculate the angle of the charging dock relative to the global $+X$ axis.
   - Calculate the angular steering correction $\Delta\theta = \theta_{\text{dock}} - \theta_{\text{robot}}$. Does the robot turn left or right?

10. **[Tier 5 - Game Dev / Mechanics]** A player character moves with velocity vector $\vec{v} = (7, -7)\text{ m/s}$.
    - Express this velocity vector in Polar form $(r, \theta)$.
    - The player hits an ice patch that rotates their velocity vector counter-clockwise by $\Delta\theta = +30^\circ$. Calculate the new velocity components $(v_x', v_y')$ after the rotation.

---

### Step-by-Step Solutions

#### Solution 1:
- (a) $90^\circ \times (\pi / 180) = \pi / 2\text{ radians} \approx 1.571\text{ rad}$.
- (b) $45^\circ \times (\pi / 180) = \pi / 4\text{ radians} \approx 0.7854\text{ rad}$.
- (c) $(\pi / 3) \times (180 / \pi) = 60^\circ$.
- (d) $\pi \times (180 / \pi) = 180^\circ$.

#### Solution 2:
- At $\theta = 0^\circ$: $x = 20\cos(0^\circ) = 20$, $y = 20\sin(0^\circ) = 0 \implies (20, 0)\text{ km}$.
- At $\theta = 90^\circ$: $x = 20\cos(90^\circ) = 0$, $y = 20\sin(90^\circ) = 20 \implies (0, 20)\text{ km}$.

#### Solution 3:
- $v_x = 10 \cos(60^\circ) = 10 \times 0.50 = 5.0$.
- $v_y = 10 \sin(60^\circ) = 10 \times 0.8660 = 8.66$.
- Cartesian vector: $\vec{v} = (5.0, 8.66)$.

#### Solution 4:
- Sonar range:
  $$r = \sqrt{12^2 + 12^2} = \sqrt{144 + 144} = \sqrt{288} = 12\sqrt{2} \approx 16.97\text{ km}$$
- Compass bearing:
  $$\theta = \text{atan2}(12, 12) = 45^\circ\text{ (North-East)}$$

#### Solution 5:
- (a) $\vec{a}(4, 4) \implies$ Quadrant I $\implies \text{atan2}(4, 4) = +45^\circ$.
- (b) $\vec{b}(-4, 4) \implies$ Quadrant II $\implies \text{atan2}(4, -4) = +135^\circ$.
- (c) $\vec{c}(-4, -4) \implies$ Quadrant III $\implies \text{atan2}(-4, -4) = -135^\circ\text{ (or } 225^\circ)$.
- (d) $\vec{d}(4, -4) \implies$ Quadrant IV $\implies \text{atan2}(-4, 4) = -45^\circ\text{ (or } 315^\circ)$.

#### Solution 6:
- $\cos(45^\circ) = \sin(45^\circ) = \frac{\sqrt{2}}{2} \approx 0.7071$.
- $v_{0x} = 50 \times 0.7071 = 35.36\text{ m/s}$.
- $v_{0y} = 50 \times 0.7071 = 35.36\text{ m/s}$.

#### Solution 7:
- Perpendicular vector using rule $(x, y) \to (-y, x)$:
  $$\vec{v}_{\text{perp}} = (-20, 15)\text{ meters}$$
- Length confirmation:
  $$\|\vec{r}\| = \sqrt{15^2 + 20^2} = \sqrt{225 + 400} = \sqrt{625} = 25\text{ m}$$
  $$\|\vec{v}_{\text{perp}}\| = \sqrt{(-20)^2 + 15^2} = \sqrt{400 + 225} = \sqrt{625} = 25\text{ m}$$
  Lengths are identical.

#### Solution 8:
- Elbow position $P_1$:
  $$x_1 = 30 \cos(30^\circ) = 30 \times 0.8660 = 25.98\text{ cm}$$
  $$y_1 = 30 \sin(30^\circ) = 30 \times 0.5000 = 15.00\text{ cm}$$
  $P_1(25.98, 15.00)\text{ cm}$.
- Fingertip position $P_2$:
  $$x_2 = x_1 + 20 \cos(60^\circ) = 25.98 + (20 \times 0.50) = 25.98 + 10.0 = 35.98\text{ cm}$$
  $$y_2 = y_1 + 20 \sin(60^\circ) = 15.00 + (20 \times 0.8660) = 15.00 + 17.32 = 32.32\text{ cm}$$
  $P_2(35.98, 32.32)\text{ cm}$.

#### Solution 9:
- Dock displacement: $\vec{d} = (20 - 0, 0 - 0) = (20, 0)\text{ cm}$.
- Dock angle: $\theta_{\text{dock}} = \text{atan2}(0, 20) = 0^\circ$.
- Turn correction:
  $$\Delta\theta = \theta_{\text{dock}} - \theta_{\text{robot}} = 0^\circ - 45^\circ = -45^\circ$$
- Negative sign indicates the robot must turn **$45^\circ$ clockwise (to the right)**.

#### Solution 10:
- Polar form of $(7, -7)$:
  $$r = \sqrt{7^2 + (-7)^2} = \sqrt{49 + 49} = \sqrt{98} \approx 9.899\text{ m/s}$$
  $$\theta = \text{atan2}(-7, 7) = -45^\circ$$
- New angle after $+30^\circ$ rotation:
  $$\theta' = -45^\circ + 30^\circ = -15^\circ$$
- New velocity components:
  $$v_x' = 9.899 \cos(-15^\circ) = 9.899 \times 0.9659 \approx 9.56\text{ m/s}$$
  $$v_y' = 9.899 \sin(-15^\circ) = 9.899 \times (-0.2588) \approx -2.56\text{ m/s}$$
  $\vec{v}' = (9.56, -2.56)\text{ m/s}$.
