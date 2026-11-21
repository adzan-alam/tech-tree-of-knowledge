# CHAPTER 1: The Layman's Genesis — The Scalar Illusion & The Lost Island

---

## 1.1 What is a Number? Counting Sheep vs. Measuring Physical Space

When you first learned mathematics in elementary school, you were taught to count: $1, 2, 3, 4, 5$. You counted physical objects—apples in a basket, marbles in a pouch, sheep in a meadow, or coins in your pocket. 

In this early world of arithmetic, every question you asked had an answer that was completely described by a **single number**:
- *"How many sheep are in the pen?"* $\to 14$.
- *"How much does this stone weigh?"* $\to 5\text{ kilograms}$.
- *"How long did the race take?"* $\to 42\text{ seconds}$.
- *"What is the temperature outside?"* $\to 28^\circ\text{Celsius}$.

In physics and mathematics, we give these single-number quantities a special name: **Scalars**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE ANATOMY OF A SCALAR                         │
├────────────────────────────────────────────────────────────────────────┤
│  A SCALAR is any physical quantity that is completely and exhaustively │
│  described by two things:                                              │
│                                                                        │
│  1. A MAGNITUDE (an ordinary positive or negative number).            │
│  2. A UNIT OF MEASURE (meters, seconds, kilograms, degrees).           │
│                                                                        │
│  Crucially: A scalar has ZERO direction in physical space.             │
└────────────────────────────────────────────────────────────────────────┘
```

Think about this deeply:
- A rock has a mass of $5\text{ kg}$. Does that mass point North? Does it point South? Does it tilt at an angle of $30^\circ$? Of course not! The question *"In what direction does the rock's mass point?"* is completely meaningless. Mass has no spatial orientation.
- Time advances by $15\text{ seconds}$. While time has an arrow (it flows from the past to the future), it does not point East across your living room floor.
- A glass of water has a temperature of $65^\circ\text{C}$. The heat is distributed throughout the liquid, but temperature itself has no spatial compass heading.

For thousands of years, basic human trade and commerce operated almost entirely with scalars. You could buy 10 bushels of wheat, pay 4 silver coins, and wait 3 days.

---

## 1.2 The Pirate Island Paradox: The Total Failure of Scalars

Now, let us step out of the classroom and onto an uncharted desert island in the Caribbean. 

Imagine you are an adventurer who has discovered the yellowed parchment of an ancient pirate captain. The map features a drawing of an ominous, towering boulder known as **Skull Rock**. 

Underneath the drawing, the pirate captain wrote a single instruction:

> *"To find the iron chest filled with 10,000 gold doubloons, start at Skull Rock and walk exactly 50 meters. Dig there."*

You stand at Skull Rock with a 50-meter measuring tape. You take a deep breath. 

**Can you find the treasure?**

```
                         N
                         ^
                         |
                   ?     |     ?
             ?           |           ?
         ?               |               ?
     ?                   |                   ?
   ?                     |                     ?
  ?                      |                      ?
W <----------------- Skull Rock -----------------> E
  ?                   (0, 0)                    ?
   ?                     |                     ?
     ?                   |                   ?
         ?               |               ?
             ?           |           ?
                   ?     |     ?
                         |
                         v
                         S

   FIGURE 1.1: The 50-meter locus of ignorance. 
   Without a direction, 50 meters defines an infinite circle of despair.
```

**The answer is an absolute NO.**

Why? Because a distance of "50 meters" is a **scalar**. 
- If you walk 50 meters North, you might be digging in a freshwater swamp.
- If you walk 50 meters East, you might be walking off a cliff into the ocean.
- If you walk 50 meters South-West, you might be digging into a cactus grove.

There is not just one spot 50 meters away from Skull Rock; there are **infinitely many spots**. All of these points together form a giant circle with a radius of $R = 50\text{ meters}$. The circumference of this circle is:

$$C = 2\pi R = 2 \times 3.14159 \times 50\text{ m} \approx 314.16\text{ meters}$$

If you dig holes that are 1 meter wide, you would have to dig over **300 separate trenches** all the way around Skull Rock! 

### The Core Epiphany
A scalar quantity is completely, utterly helpless when it comes to navigating physical space. 
To locate the treasure, you need something fundamentally new. You need to know:
1. **How far** to walk (Magnitude: $50\text{ meters}$).
2. **Which way** to face (Direction: $36.87^\circ$ North of East).

The moment you combine a **Magnitude** with a **Direction**, you have left the world of scalars behind. You have stepped into the magnificent, sovereign world of **Vectors**.

---

## 1.3 Socratic Dialogue: Alice and The Vectorist

To cement this intuition, let us eavesdrop on a conversation between a curious beginner named **Alice** and an experienced mentor named **The Vectorist**.

> **Alice:** "Wait a minute! Why do we need fancy mathematical 'vectors'? Why can't the pirate just say: *'Walk 50 meters forward, then turn right and walk 30 meters'*?"
>
> **The Vectorist:** "A brilliant question, Alice! But notice what word you just used: *'Forward'*. Which way is forward?"
>
> **Alice:** "Forward is... well, the way my nose is pointing!"
>
> **The Vectorist:** "Exactly! And what if you are facing North when you read the map, but your friend Bob is facing South-West? Your 'forward' is Bob's 'backward'. Your 'right' is Bob's 'left'."
>
> **Alice:** "Ah! So 'left', 'right', 'forward', and 'backward' are personal opinions. They depend on who is looking!"
>
> **The Vectorist:** "Precisely. Science, engineering, and navigation cannot depend on personal opinions. If an air traffic controller tells a Boeing 747 pilot to turn 'left', the controller and the pilot must agree on an objective, unchanging reality that does not care which way the pilot's head is tilted."
>
> **Alice:** "So we need an objective reference frame—like the cardinal directions: North, South, East, and West."
>
> **The Vectorist:** "Spot on. And once we establish that shared frame, every journey, every force, and every velocity can be written down with absolute mathematical perfection. That is what a vector is: an objective statement about spatial reality."

---

## 1.4 Ten Concrete Worked Numerical Examples: Scalars vs. Vectors

To ensure you have absolute mastery of this distinction before we introduce any formal algebra, study these 10 real-world examples. For each scenario, we analyze whether the quantity is a scalar or a vector, identify its components, and show the arithmetic.

---

### Example 1: The Odometer vs. The GPS Displacement
* **Scenario:** You get into your car in the morning. You drive 15 km North to work, then at lunchtime you drive 5 km South to visit a restaurant, and finally in the evening you drive 10 km South back to your house.
* **Question:** What does your car's odometer show, and what does your GPS displacement vector show?
* **Analysis:**
  * **Odometer:** An odometer measures **Distance** (a scalar). It only counts total wheel revolutions; it does not care which way the wheels rolled.
    $$\text{Distance} = 15\text{ km} + 5\text{ km} + 10\text{ km} = 30\text{ km}$$
  * **GPS Displacement:** Displacement is a **Vector** ($\vec{d}$). It measures the net straight-line change in position from where you started to where you ended.
    $$\text{Net Displacement} = (+15\text{ km North}) + (-5\text{ km North}) + (-10\text{ km North}) = 0\text{ km}$$
* **Sanity Check:** Even though your car burned fuel and traveled 30 km (scalar), your net displacement vector is $\vec{0}$ because you are sleeping in the exact same bed you woke up in!

---

### Example 2: The Marathon Runner's Hydration
* **Scenario:** A marathon runner drinks 0.75 liters of water at checkpoint 1, 0.50 liters at checkpoint 2, and 0.80 liters at the finish line.
* **Question:** Is the volume of water consumed a scalar or a vector? Calculate the total volume.
* **Analysis:**
  * Volume is an isotropic three-dimensional space filling. It has magnitude and units, but no spatial heading. It is a **Scalar**.
  * Total Volume:
    $$V_{\text{total}} = 0.75\text{ L} + 0.50\text{ L} + 0.80\text{ L} = 2.05\text{ Liters}$$
* **Sanity Check:** The water does not have a "Northward" direction inside the runner's stomach. Ordinary scalar addition applies.

---

### Example 3: The Crosswind on a Runway
* **Scenario:** A passenger jet is rolling down a runway aligned pointing directly North. The jet's engines generate a forward thrust pushing it North with a force of $120,000\text{ N}$. A sudden gale-force crosswind strikes the jet from the West, pushing it East with a force of $50,000\text{ N}$.
* **Question:** Can we find the net force by simply adding $120,000 + 50,000$?
* **Analysis:**
  * Forces are **Vectors** ($\vec{F}$). They push in specific directions.
  * If you add them as scalars: $120,000 + 50,000 = 170,000\text{ N}$. This is **catastrophically wrong**! The crosswind is not pushing the plane forward; it is pushing it sideways off the concrete!
  * We must treat them as perpendicular components:
    $$\vec{F}_{\text{net}} = 120,000\text{ N (North)} + 50,000\text{ N (East)}$$
* **Sanity Check:** Sideways forces do not increase forward engine thrust. Treating vectors as scalars will crash an airplane.

---

### Example 4: The Escalator Velocity
* **Scenario:** An airport moving walkway moves due East at a speed of $1.5\text{ m/s}$. A traveler steps onto the walkway and walks forward (East) at $2.0\text{ m/s}$ relative to the moving belt.
* **Question:** What is the traveler's velocity vector relative to a stationary observer sitting on a bench?
* **Analysis:**
  * Both velocities point in the exact same direction (East).
  * Velocity is a vector (Speed + Direction).
  * Because the directions are identical, their magnitudes sum linearly along that axis:
    $$v_{\text{ground}} = 1.5\text{ m/s (East)} + 2.0\text{ m/s (East)} = 3.5\text{ m/s East}$$
* **Sanity Check:** To someone on the bench, the traveler zooms past at $3.5\text{ m/s}$.

---

### Example 5: The Walking-Against-the-Walkway Test
* **Scenario:** A rebellious child steps onto the same Eastward moving walkway ($1.5\text{ m/s East}$) and runs backward due West at $2.5\text{ m/s West}$.
* **Question:** What is the child's velocity vector relative to the floor?
* **Analysis:**
  * Let East be the positive direction ($+$) and West be the negative direction ($-$).
  * Belt velocity: $\vec{v}_{\text{belt}} = +1.5\text{ m/s}$.
  * Child velocity: $\vec{v}_{\text{child}} = -2.5\text{ m/s}$.
  * Net velocity:
    $$\vec{v}_{\text{net}} = +1.5\text{ m/s} + (-2.5\text{ m/s}) = -1.0\text{ m/s}$$
* **Sanity Check:** The negative sign indicates the child is successfully making ground progress due West at $1.0\text{ m/s}$.

---

### Example 6: The Freezing Cold Room (Temperature Field)
* **Scenario:** A thermal sensor measures the temperature in four corners of a server room: $18.5^\circ\text{C}$, $19.2^\circ\text{C}$, $24.1^\circ\text{C}$, and $26.0^\circ\text{C}$.
* **Question:** Does the temperature at corner 4 point toward corner 1?
* **Analysis:**
  * Temperature is a **Scalar field**. Each point in space has a number associated with it, but that number has no direction.
  * The temperature difference is:
    $$\Delta T = 26.0^\circ\text{C} - 18.5^\circ\text{C} = 7.5^\circ\text{C}$$
  * *Note:* While the temperature itself is a scalar, the *rate of change of temperature across space* (the temperature gradient $\nabla T$) IS a vector pointing in the direction of greatest warming!

---

### Example 7: The Tug-of-War Deadlock
* **Scenario:** Team Alpha pulls on a heavy hemp rope with a force of $850\text{ N}$ to the Left (West). Team Beta pulls on the other end with a force of $850\text{ N}$ to the Right (East).
* **Question:** What is the scalar sum of the forces vs. the vector sum of the forces?
* **Analysis:**
  * **Scalar sum of muscular effort:** $850\text{ N} + 850\text{ N} = 1700\text{ N}$. (The rope experiences immense mechanical tension!).
  * **Vector sum (Net Force $\vec{F}_{\text{net}}$):**
    $$\vec{F}_{\text{net}} = (-850\text{ N}) + (+850\text{ N}) = 0\text{ N}$$
* **Sanity Check:** Because the net force vector is zero, the red ribbon in the center of the rope does not accelerate. It remains perfectly stationary ($a = 0$).

---

### Example 8: The Drone Altitude vs. Ground Position
* **Scenario:** A quadcopter hovers at an altitude of $120\text{ meters}$ directly above a launch pad at $(0, 0)$.
* **Question:** Is the altitude a scalar or a vector?
* **Analysis:**
  * "Altitude" as a simple elevation number ($h = 120\text{ m}$) is often used as a scalar.
  * However, as a position displacement from the ground pad, it is a 3D vector: $\vec{p} = (0\text{ m East}, 0\text{ m North}, 120\text{ m Up})$.

---

### Example 9: The Bank Account Balance Trap
* **Scenario:** A bank account has $\$500$. You deposit $\$200$, withdraw $\$350$, and earn $\$15$ in interest.
* **Question:** Why is bank balance a signed scalar and not a vector?
* **Analysis:**
  * Money has positive and negative values (credits and debits), but dollars do not exist at spatial angles. You cannot deposit money at an angle of $45^\circ$. 
  * Signed arithmetic:
    $$\text{Balance} = 500 + 200 - 350 + 15 = \$365$$
  * Sign ($+$ or $-$) in 1D arithmetic indicates polarity, not true multi-dimensional spatial direction.

---

### Example 10: The Ant on a Rotating Record Player
* **Scenario:** An ant sits on a vinyl record spinning on a turntable. The ant is $0.10\text{ m}$ from the center pin. The turntable rotates at a constant speed so the ant covers $0.628\text{ meters}$ every second along its circular track.
* **Question:** Is the ant's speed constant? Is the ant's velocity constant?
* **Analysis:**
  * **Speed (Scalar):** The ant covers $0.628\text{ m}$ of circular arc each second. Its speed is constant at $0.628\text{ m/s}$.
  * **Velocity (Vector):** At one moment the ant is moving North; a quarter-turn later it is moving West; then South; then East. Its direction is changing **every microsecond**.
* **Sanity Check:** Because velocity is a vector, changing direction means **the velocity vector is changing**, even if the scalar speed is completely fixed! This change in vector velocity requires a real physical force (centripetal force) holding the ant's feet to the vinyl.

---

## 1.5 Debunked Traps & Common Misconceptions

### Trap 1: "Speed and Velocity are just synonyms for the same thing."
* **The Reality:** In casual English conversation, people use "speed" and "velocity" interchangeably. In science and engineering, confusing them will cause your code or calculations to fail.
  * **Speed:** A scalar ($\|\vec{v}\|$). It tells you how fast the speedometer needle is pointing (e.g., $100\text{ km/h}$). It can never be negative.
  * **Velocity:** A vector ($\vec{v}$). It includes speed AND spatial heading (e.g., $100\text{ km/h}$ bearing $045^\circ$).

### Trap 2: "Negative numbers mean direction, so all signed numbers are vectors."
* **The Reality:** Temperature can be $-10^\circ\text{C}$. Your bank balance can be $-\$50$. A subatomic electron has an electric charge of $-1.602 \times 10^{-19}\text{ Coulombs}$. None of these are vectors! They are **signed scalars**. Direction in space requires degrees of spatial freedom.

### Trap 3: "Vectors must have physical arrows drawn in the air."
* **The Reality:** Arrows are just a visual tool for human brains. In a computer memory chip, a vector is stored as an array of numbers representing orthogonal coordinates (e.g., `[3.0, -4.5]`). The "arrow" exists in the mathematical relationship between the numbers and the reference frame.

---

## 1.6 Historical Context: The 1714 Scilly Naval Disaster

To understand why vectors are matter of life and death, we must examine the history of navigation.

On the night of October 22, 1714, a fleet of twenty-one British Royal Navy warships commanded by Admiral Sir Cloudesley Shovell was returning to England after operations in the Mediterranean. 

For twelve days, the fleet had been trapped in thick fog and heavy rain. The navigators could not see the sun or the stars. To estimate their location, they used **Dead Reckoning**:
1. They measured their scalar speed by throwing a wooden log attached to a knotted rope overboard and counting the knots slipping through a sailor's fingers over 30 seconds (hence the unit *knots*).
2. They looked at their magnetic compass for direction.

```
       What the Navigators Thought:           What Actually Happened:
       
       Fleet Heading (Assumed)               Fleet Heading Vector + Ocean Current Vector
       ═══════════════════════════►          ═══════════════════════════►
                                                                  │
                                                                  │ Strong Unseen 
                                                                  │ Current Vector
                                                                  ▼
                                             Resultant Vector:
                                             ═══════════════════════════╗
                                                                        ▼ CRASH! 
                                                                   (Scilly Rocks)
```

What the navigators failed to realize was that ocean water is not stationary. A powerful, unseen Northward ocean current vector was sweeping the entire sea beneath them. 

Because they were adding scalar distances along their compass heading while ignoring the **transverse velocity vector of the ocean current**, their calculated position was catastrophically wrong.

The flagship *HMS Association* smashed full speed into the Gilstone Reef off the Isles of Scilly. Within minutes, four massive warships sank to the seabed. Nearly **1,500 sailors and the Admiral himself drowned** within sight of their homeland.

This single disaster shocked the British Empire into passing the **Longitude Act of 1714**, offering a king's ransom of £20,000 (millions of dollars today) to anyone who could solve the problem of precise spatial vector navigation on Earth.

---

## 1.7 Chapter 1 Mastery Problem Set

Consolidate your understanding with these 10 progressive exercises. Do not skip them! Write down your answers before checking the step-by-step solutions below.

### Problems

1. **[Tier 1 - Class 6]** Classify each of the following physical quantities as either a **Scalar** or a **Vector**:
   - (a) The fuel capacity of a rocket ($450,000\text{ liters}$).
   - (b) The drift of a hot air balloon ($12\text{ km/h South-East}$).
   - (c) The atmospheric pressure at sea level ($101.3\text{ kPa}$).
   - (d) The gravitational pull on an astronaut ($700\text{ N downward}$).
   - (e) The age of planet Earth ($4.54\text{ billion years}$).

2. **[Tier 1 - Class 6]** A hiker walks $4\text{ km}$ due North, stops for lunch, and then walks another $3\text{ km}$ due North.
   - What is the total distance traveled (scalar)?
   - What is the net displacement vector?

3. **[Tier 2 - Class 7]** A courier walks $6\text{ km}$ East to deliver a package, and then walks $6\text{ km}$ West back to the post office.
   - What is the total distance walked?
   - What is the courier's net displacement vector from the post office?

4. **[Tier 2 - Class 7]** A submarine is cruising at depth. It travels $800\text{ meters}$ directly downward, and then levels off and travels $1,200\text{ meters}$ horizontally due North.
   - Can you find the straight-line distance from the starting point by adding $800 + 1,200$? Explain why or why not.

5. **[Tier 3 - Class 8]** An elevator in the Burj Khalifa skyscraper starts on the ground floor ($y = 0$). It ascends $400\text{ meters}$ up to the observation deck, descends $150\text{ meters}$ to a restaurant floor, and finally ascends $50\text{ meters}$ to a private lounge.
   - Treating the vertical axis as signed (+ for Up, - for Down), write the displacement vector for each leg.
   - Calculate the final elevation of the elevator.
   - Calculate the total vertical distance traveled by the elevator cables.

6. **[Tier 3 - Class 8]** A swimmer can swim in still water at a speed of $2.0\text{ m/s}$. She dives into a river where the current flows East at $2.0\text{ m/s}$.
   - If she swims directly East (with the current), what is her ground velocity vector?
   - If she swims directly West (against the current), what is her ground velocity vector? What will an observer on the riverbank see?

7. **[Tier 4 - High School]** A cargo ship sails along a straight path described by a vector. The ship moves $30\text{ km}$ East and $40\text{ km}$ North.
   - Sketch this journey on a piece of graph paper.
   - Using the Pythagorean theorem ($a^2 + b^2 = c^2$), calculate the straight-line distance from the harbor to the ship.

8. **[Tier 4 - High School]** A robotic warehouse rover moves along a grid. Its internal motion log records four consecutive displacement vectors:
   - Leg 1: $+12\text{ m}$ in $X$, $0\text{ m}$ in $Y$.
   - Leg 2: $0\text{ m}$ in $X$, $+8\text{ m}$ in $Y$.
   - Leg 3: $-5\text{ m}$ in $X$, $0\text{ m}$ in $Y$.
   - Leg 4: $0\text{ m}$ in $X$, $-8\text{ m}$ in $Y$.
   - Determine the net coordinates $(X, Y)$ of the rover relative to its start.
   - How far is it from its charging dock?

9. **[Tier 5 - University / Concept]** Consider a particle moving in a perfect circle of radius $R = 10\text{ meters}$ at a constant speed of $5\text{ m/s}$.
   - When the particle completes exactly one full revolution, what is the distance traveled?
   - What is the net displacement vector over one full revolution?
   - What is the average velocity vector over one full revolution? (Recall: $\vec{v}_{\text{avg}} = \Delta\vec{r} / \Delta t$).

10. **[Tier 5 - Engineering Challenge]** An autonomous drone's wind sensor reports that air is blowing against its chassis with a force vector of $(-15\text{ N}, +20\text{ N})$.
    - What counter-force vector must the drone's quad-rotors produce to hover completely stationary without drifting?

---

### Step-by-Step Solutions

#### Solution 1:
- (a) **Scalar** (Volume of fuel has no direction).
- (b) **Vector** (Contains speed $12\text{ km/h}$ AND direction South-East).
- (c) **Scalar** (Gas pressure exerts force uniformly in all directions at a point).
- (d) **Vector** (Force of $700\text{ N}$ directed downward toward Earth's center).
- (e) **Scalar** (Elapsed time has no spatial direction).

#### Solution 2:
- Total Distance (scalar sum of lengths):
  $$d_{\text{total}} = 4\text{ km} + 3\text{ km} = 7\text{ km}$$
- Net Displacement Vector:
  $$\vec{d}_{\text{net}} = 4\text{ km North} + 3\text{ km North} = 7\text{ km due North}$$

#### Solution 3:
- Total Distance (odometer walking):
  $$d_{\text{total}} = 6\text{ km} + 6\text{ km} = 12\text{ km}$$
- Net Displacement Vector:
  $$\vec{d}_{\text{net}} = (+6\text{ km East}) + (-6\text{ km East}) = \vec{0}\text{ km}$$
  The courier is back at the origin.

#### Solution 4:
- **No!** $800 + 1200 = 2000\text{ m}$ is the scalar distance traveled through the water.
- Because downward motion and horizontal Northward motion are at a $90^\circ$ right angle, they form the legs of a right triangle. The straight-line distance is the hypotenuse:
  $$\text{Distance} = \sqrt{800^2 + 1200^2} = \sqrt{640,000 + 1,440,000} = \sqrt{2,080,000} \approx 1,442.22\text{ meters}$$
  Adding scalars overestimates the true displacement by more than $550\text{ meters}$!

#### Solution 5:
- Leg vectors: $\vec{d}_1 = +400\text{ m}$, $\vec{d}_2 = -150\text{ m}$, $\vec{d}_3 = +50\text{ m}$.
- Final Elevation:
  $$y_{\text{final}} = 0 + 400 - 150 + 50 = 300\text{ meters above ground}$$
- Total Cable Travel (Distance):
  $$d_{\text{total}} = |+400| + |-150| + |+50| = 400 + 150 + 50 = 600\text{ meters}$$

#### Solution 6:
- (a) Swimming with the current (parallel vectors):
  $$\vec{v}_{\text{ground}} = 2.0\text{ m/s East} + 2.0\text{ m/s East} = 4.0\text{ m/s due East}$$
- (b) Swimming against the current (anti-parallel vectors):
  $$\vec{v}_{\text{ground}} = -2.0\text{ m/s East} + 2.0\text{ m/s East} = 0.0\text{ m/s}$$
  *Observer's view:* The swimmer is kicking furiously, but stays completely frozen relative to the riverbank!

#### Solution 7:
- Sketch: Draw a line 30 units right on the X-axis, then 40 units up on the Y-axis.
- By the Pythagorean theorem:
  $$\text{Hypotenuse} = \sqrt{30^2 + 40^2} = \sqrt{900 + 1600} = \sqrt{2500} = 50\text{ km}$$
  The ship is exactly $50\text{ km}$ from the harbor along a straight heading of $\approx 53.13^\circ$ North of East.

#### Solution 8:
- Sum the components independently:
  $$X_{\text{net}} = +12 + 0 - 5 + 0 = +7\text{ meters}$$
  $$Y_{\text{net}} = 0 + 8 + 0 - 8 = 0\text{ meters}$$
- Rover coordinates: $(7, 0)$.
- Distance from dock: $\sqrt{7^2 + 0^2} = 7\text{ meters}$ along the $+X$ track.

#### Solution 9:
- (a) Distance traveled (Circumference):
  $$C = 2\pi R = 2 \times \pi \times 10 \approx 62.83\text{ meters}$$
- (b) Net displacement vector: $\Delta\vec{r} = \vec{r}_{\text{final}} - \vec{r}_{\text{initial}} = \vec{0}\text{ m}$ (the particle returned to its exact starting point).
- (c) Average velocity vector:
  $$\vec{v}_{\text{avg}} = \frac{\Delta\vec{r}}{\Delta t} = \frac{\vec{0}\text{ m}}{\Delta t} = \vec{0}\text{ m/s}$$
  *Notice:* The average *speed* is $5\text{ m/s}$, but the average *velocity* is $0\text{ m/s}$!

#### Solution 10:
- To stay stationary, Newton's first law requires the net force to equal zero:
  $$\vec{F}_{\text{net}} = \vec{F}_{\text{wind}} + \vec{F}_{\text{rotors}} = \vec{0}$$
- Solving for $\vec{F}_{\text{rotors}}$:
  $$\vec{F}_{\text{rotors}} = -\vec{F}_{\text{wind}} = -(-15\text{ N}, +20\text{ N}) = (+15\text{ N}, -20\text{ N})$$
  The rotors must push with $+15\text{ N}$ horizontally and $-20\text{ N}$ vertically to perfectly cancel the wind vector.
