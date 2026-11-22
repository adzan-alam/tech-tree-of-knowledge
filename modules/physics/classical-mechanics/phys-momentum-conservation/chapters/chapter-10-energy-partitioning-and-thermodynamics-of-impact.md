# Chapter 10: Energy Partitioning and the Thermodynamics of Impact

> "Energy cannot be created or destroyed; it can only be transferred from one form to another, or degraded into disordered thermal motion."  
> — First Law of Thermodynamics

---

## 1. Introduction: The Disappearance of Mechanical Energy

Throughout elementary mechanics, collisions with coefficient of restitution $e < 1$ are labeled "inelastic," and textbook problems routinely conclude with a perfunctory line: *"Kinetic energy is lost."*

In physics, energy never vanishes. When two cars crash at a highway intersection, when a lead bullet buries itself in an oak block, or when an iron meteorite slams into the Siberian tundra at $20\text{ km/s}$, total energy is strictly conserved. What actually happens is a cascade of **thermodynamic and material degradation**: ordered, macroscopic kinetic energy is violently converted into microscopic, disordered internal energy:
- **Plastic Deformation Work:** Irreversible distortion of crystal lattices via dislocation glide and twin boundaries.
- **Acoustic Shock Waves:** Coherent compressional wavefronts traveling through the bulk solid.
- **Fracture Energy:** Breaking of chemical bonds to create new surface area.
- **Thermal Dissipation:** Local flash heating, frictional melting, and incandescence.

In this chapter, we bridge Newtonian impact mechanics with continuum mechanics, shock physics, and thermodynamics. We analyze the classic **ballistic pendulum**, derive the hydrodynamic penetration depth of high-speed jets, and examine the extreme thermodynamic regimes of hypervelocity cratering.

---

## 2. Microscopic Energy Channels During an Inelastic Impact

When two real bodies collide, the mechanical energy loss $\Delta K_{\text{loss}}$ identified in Chapter 6 partitions into four primary physical channels:

```
                      Total Kinetic Energy Loss: Delta K_loss
                                        |
      +--------------------+------------+------------+--------------------+
      |                    |                         |                    |
      v                    v                         v                    v
Plastic Work (W_p)   Thermal Energy (Q)      Acoustic Shock (E_wave)   Fracture (E_frac)
(Dislocation slip)   (Lattice vibrations)    (Radiated sound/stress)   (New surfaces)
   [~ 85 - 95%]         [~ 85 - 95%]                [~ 1 - 5%]            [< 1%]
```

### 2.1 The Taylor-Quinney Coefficient ($\beta$)

In 1934, G. I. Taylor and H. Quinney performed pioneering experiments measuring how much mechanical plastic work is converted directly into heat. The **Taylor-Quinney coefficient** $\beta$ is defined as:
$$\beta \equiv \frac{\Delta Q_{\text{thermal}}}{W_{\text{plastic}}}$$

For most structural metals (steel, aluminum, titanium, copper) under dynamic impact loading:
$$\beta \approx 0.90 \text{ to } 0.95$$

Between $90\%$ and $95\%$ of the mechanical work required to permanently deform the material ends up immediately as **heat**! The remaining $5\%$ to $10\%$ is stored elastically within the crystal lattice as the internal energy of residual stress fields surrounding dislocation tangles.

### 2.2 Dynamic Temperature Rise

If the collision occurs rapidly (as in ballistic impacts where $\Delta t < 10^{-3}\text{ s}$), there is insufficient time for heat to conduct away into the surrounding bulk. The process is locally **adiabatic**. The instantaneous temperature rise in the deformation zone is given by:
$$\Delta T \approx \frac{\beta \cdot \Delta K_{\text{loss}}}{m_{\text{zone}} c_p}$$
where $m_{\text{zone}}$ is the mass of the localized plastic zone and $c_p$ is the specific heat capacity. In hypervelocity impacts, $\Delta T$ readily exceeds the melting temperature of metals, creating molten ejecta spray!

---

## 3. The Ballistic Pendulum and Kinetic Energy Partitioning

Invented in 1742 by the English mathematician and military engineer Benjamin Robins, the **ballistic pendulum** revolutionized 18th-century exterior ballistics by enabling the first accurate measurements of musket ball muzzle velocities.

```
                  Ceiling Anchor
                       ||
                       || Suspension wires of length L
                       ||
                       \/
                   +--------+
      Bullet       | Wooden |
       (m) ------> | Block  | (M)
        v0         |        |
                   +--------+
                       |
                       | Swings up by height h (angle theta)
                       v
```

### 3.1 Two-Stage Analysis: The Momentum-Energy Boundary

The ballistic pendulum is the archetype of two distinct physical phases that must never be conflated:

1. **Phase 1: Inelastic Impact (Duration $\Delta t \sim 10^{-4}\text{ s}$):**
   - The bullet of mass $m$ penetrates the wooden block of mass $M$.
   - Because gravity is an external force of finite magnitude, during the infinitesimal impact duration $\Delta t \to 0$, the gravitational impulse $J_g = \int (m+M)g\,dt \to 0$.
   - **Horizontal momentum is conserved:**
     $$m v_0 = (m + M) V$$
     $$V = \frac{m}{m + M} v_0$$
   - **Mechanical kinetic energy is violently destroyed:**
     $$\Delta K_{\text{loss}} = \frac{1}{2}m v_0^2 - \frac{1}{2}(m + M)V^2$$

2. **Phase 2: Conservative Swing (Duration $t_{\text{swing}} \sim 1\text{ s}$):**
   - Now moving with initial speed $V$, the block-bullet composite swings upward like a simple pendulum against gravity.
   - Tension does no work ($T \perp \vec{v}$). Air resistance is negligible.
   - **Mechanical energy is strictly conserved:**
     $$\frac{1}{2}(m + M) V^2 = (m + M) g h$$
     $$V = \sqrt{2gh}$$
   - Where $h = L(1 - \cos\theta)$.

### 3.2 Deducing the Initial Muzzle Velocity

Equating the velocity $V$ from both stages:
$$\frac{m}{m + M} v_0 = \sqrt{2gh}$$

$$\mathbf{v_0 = \left(\frac{m + M}{m}\right) \sqrt{2gh} = \left(\frac{m + M}{m}\right) \sqrt{2gL(1 - \cos\theta)}}$$

### 3.3 The Kinetic Efficiency Paradox

What fraction of the bullet's original kinetic energy is converted into potential energy of the swinging pendulum?
$$\eta_K \equiv \frac{K_{\text{swing}}}{K_{\text{bullet}}} = \frac{\frac{1}{2}(m + M)V^2}{\frac{1}{2}m v_0^2} = \frac{(m + M) \left(\frac{m}{m+M} v_0\right)^2}{m v_0^2} = \mathbf{\frac{m}{m + M}}$$

In a typical experiment:
- Bullet mass $m = 10\text{ g} = 0.010\text{ kg}$.
- Pendulum block mass $M = 5.0\text{ kg}$.
$$\eta_K = \frac{0.010}{5.010} \approx 0.0020 = \mathbf{0.2\%}$$

**Over $99.8\%$ of the bullet's kinetic energy is converted into heat and wood splintering!** The ballistic pendulum works precisely *because* it captures the invariant momentum while absorbing almost all kinetic energy in destructive internal work.

---

## 4. Hypervelocity Impacts and Shock Wave Physics

When impact velocities exceed the sound speed of the colliding materials ($v_0 > c_s \approx 3\text{ to }6\text{ km/s}$)—as in meteoroid impacts, planetary accretion, or orbital debris collisions—stress waves outrun the elastic sound speed, forming violent **shock waves**.

```
                Unshocked target           Shock front (u_s)
            [ P0, rho0, E0, u0=0 ]  <======|====== [ P1, rho1, E1, u_p ] Shocked zone
```

### 4.1 The Rankine-Hugoniot Jump Conditions

Across the infinitesimal thickness of a shock front moving at shock speed $u_s$ that accelerates target material to particle velocity $u_p$:
1. **Conservation of Mass:**
   $$\rho_0 u_s = \rho_1 (u_s - u_p)$$
2. **Conservation of Momentum:**
   $$P_1 - P_0 = \rho_0 u_s u_p$$
3. **Conservation of Energy:**
   $$E_1 - E_0 = \frac{1}{2}(P_1 + P_0)\left(\frac{1}{\rho_0} - \frac{1}{\rho_1}\right)$$

At pressures exceeding hundreds of gigapascals ($P > 100\text{ GPa} = 1\text{ Mbar}$), the shear strength of solid rock or steel (typically $\sim 0.1\text{ to } 1\text{ GPa}$) is utterly negligible by comparison. Under these extreme conditions, **solids behave as compressible inviscid fluids**!

---

## 5. Hydrodynamic Penetration: The Birkhoff Jet Formula

During World War II, the American mathematician Garrett Birkhoff and colleagues analyzed the penetration of high-explosive anti-tank (HEAT) shaped-charge metal jets into steel armor.

```
       Metal Jet (rho_j, length L, speed v_j)
       =======>                               | Target Armor (rho_t)
       =======>                               |
                                              | Stagnation point S
```

### 5.1 Pressure Balance at the Stagnation Point

Let a long, continuous metal jet of density $\rho_j$ and length $L$ travel at speed $v_j$ into a target of density $\rho_t$. Let the penetration front advance into the target at speed $u$.
- In the reference frame of the moving penetration front (speed $u$):
  - Jet material approaches from the left at relative speed $(v_j - u)$.
  - Unpenetrated target approaches from the right at speed $u$.
- Applying Bernoulli's equation for hydrodynamic fluid flow at the stagnation interface $S$:
  $$\frac{1}{2} \rho_j (v_j - u)^2 = \frac{1}{2} \rho_t u^2$$

Taking the square root:
$$\sqrt{\rho_j}(v_j - u) = \sqrt{\rho_t}\,u$$
$$u = \frac{\sqrt{\rho_j}}{\sqrt{\rho_j} + \sqrt{\rho_t}} v_j$$

### 5.2 Total Penetration Depth ($P$)

The jet of length $L$ is consumed over a total duration:
$$\Delta t_{\text{jet}} = \frac{L}{v_j - u}$$
During this time, the penetration front advances by a distance $P = u\,\Delta t_{\text{jet}}$:
$$P = u \left(\frac{L}{v_j - u}\right) = L \left(\frac{u}{v_j - u}\right)$$

From the Bernoulli balance, $\frac{u}{v_j - u} = \sqrt{\frac{\rho_j}{\rho_t}}$.

Therefore:
$$\mathbf{P = L \sqrt{\frac{\rho_j}{\rho_t}}}$$

### 5.3 Consequences of the Birkhoff Formula

1. **Velocity Independence:** Notice that jet speed $v_j$ has cancelled out completely! Once the impact velocity is sufficiently high to enter the hydrodynamic regime ($v_j > 2-3\text{ km/s}$), the penetration depth depends **only on the length of the jet and the square root of the density ratio**!
2. **Dense Penetrators:** To maximize penetration, military engineers select ultra-dense metals for shaped-charge liners and kinetic armor penetrators:
   - Copper ($\rho \approx 8.96\text{ g/cm}^3$)
   - Tantalum ($\rho \approx 16.6\text{ g/cm}^3$)
   - Depleted Uranium ($\rho \approx 19.1\text{ g/cm}^3$)
   - Tungsten ($\rho \approx 19.3\text{ g/cm}^3$)
   A tungsten penetrator ($\rho_j = 19.3$) striking rolled homogeneous steel armor ($\rho_t = 7.85$) penetrates $P = L\sqrt{19.3 / 7.85} \approx 1.57\,L$, tunneling more than $1.5$ times its own length through solid steel!

---

## 6. Planetary Impact Cratering Mechanics

When an asteroid or comet impacts a planetary surface, the kinetic energy is so massive that the impactor vaporizes almost instantaneously upon shock decompression.

### 6.1 Why Craters Are Circular

A common misconception is that an asteroid hitting at an oblique angle ($45^\circ$) should carve an elongated, elliptical trench. In reality, over $95\%$ of all impact craters on the Moon, Mars, and Earth are **nearly perfect circles**!

Why? Because a hypervelocity impact is not a mechanical "plow." The kinetic energy $E_K = \frac{1}{2} m v^2$ at $v \approx 20\text{ km/s}$ is:
$$\frac{E_K}{m} = \frac{1}{2}(20,000)^2 = 2.0 \times 10^8\text{ J/kg} = 200\text{ MJ/kg}$$
For comparison, TNT releases $4.184\text{ MJ/kg}$. An asteroid moving at $20\text{ km/s}$ possesses **nearly 50 times more energy per kilogram than high-explosive TNT**!

Upon impact, this energy is released within milliseconds from a point-like source, generating a spherical hemispherical shock wave that detonates like an buried nuclear bomb. The crater is excavated by the expanding spherical shock, producing a circular cavity regardless of entry angle down to glancing trajectories ($< 10^\circ$).

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 10.1: Classical Ballistic Pendulum Bullet Speed
*A rifle fires a lead bullet of mass $m = 12.0\text{ g}$ into a ballistic pendulum wooden block of mass $M = 4.50\text{ kg}$ suspended by cords of length $L = 2.00\text{ m}$. The bullet embeds itself in the block, causing the pendulum to swing through an arc with maximum angular deflection $\theta = 18.0^\circ$. (Take $g = 9.80\text{ m/s}^2$). Compute: (a) the maximum vertical height $h$ reached by the pendulum, (b) the velocity $V$ of the composite system immediately after impact, (c) the muzzle velocity $v_0$ of the bullet, and (d) the percentage of kinetic energy lost.*

#### Solution
1. **Given:**
   - $m = 0.0120\text{ kg}$, $M = 4.50\text{ kg}$
   - $L = 2.00\text{ m}$, $\theta = 18.0^\circ$, $g = 9.80\text{ m/s}^2$
2. **Part (a): Vertical Height $h$:**
   $$h = L(1 - \cos\theta) = 2.00 \times [1 - \cos(18.0^\circ)] = 2.00 \times [1 - 0.951057] = 2.00 \times 0.048943 \approx \mathbf{0.09789\text{ m} = 9.79\text{ cm}}$$
3. **Part (b): Velocity $V$ Immediately After Impact:**
   $$V = \sqrt{2gh} = \sqrt{2 \times 9.80 \times 0.09789} = \sqrt{1.9186} \approx \mathbf{1.385\text{ m/s}}$$
4. **Part (c): Bullet Muzzle Velocity $v_0$:**
   $$m v_0 = (m + M) V \implies v_0 = \frac{m + M}{m} V$$
   $$\frac{m + M}{m} = \frac{0.0120 + 4.50}{0.0120} = \frac{4.5120}{0.0120} = 376.0$$
   $$v_0 = 376.0 \times 1.3851\text{ m/s} \approx \mathbf{520.8\text{ m/s}}$$
5. **Part (d): Kinetic Energy Loss:**
   - Initial KE of bullet:
     $$K_i = \frac{1}{2}(0.0120)(520.8)^2 = 0.0060 \times 271,233 \approx 1,627.4\text{ J}$$
   - Final KE of block+bullet:
     $$K_f = \frac{1}{2}(4.5120)(1.3851)^2 = 2.256 \times 1.9186 \approx 4.33\text{ J}$$
   - Energy lost:
     $$\% \text{lost} = \frac{1,627.4 - 4.33}{1,627.4} \times 100\% = \frac{1,623.1}{1,627.4} \times 100\% = \mathbf{99.73\%}$$

---

### Worked Example 10.2: Lead Bullet Melting on Steel Armor
*A pure lead bullet of mass $m = 15.0\text{ g}$ at initial temperature $T_0 = 25.0^\circ\text{C}$ strikes a rigid, immovable thick armor plate head-on at speed $v_0 = 420\text{ m/s}$ and stops completely ($e = 0$). Assume that $70.0\%$ of the lost kinetic energy is retained within the bullet as thermal heat, while $30.0\%$ dissipates into the armor plate. Lead properties: specific heat $c_p = 128\text{ J}/(\text{kg}\cdot^\circ\text{C})$, melting point $T_m = 327.5^\circ\text{C}$, latent heat of fusion $L_f = 2.45 \times 10^4\text{ J/kg}$. (a) Calculate the total kinetic energy of the bullet. (b) Determine whether the bullet reaches its melting point. (c) If it reaches the melting point, what percentage of the lead bullet melts into liquid?*

#### Solution
1. **Part (a): Total Kinetic Energy:**
   $$K_0 = \frac{1}{2} m v_0^2 = \frac{1}{2}(0.0150)(420)^2 = 0.0075 \times 176,400 = \mathbf{1,323.0\text{ J}}$$
2. **Thermal Heat Absorbed by Bullet:**
   $$Q_{\text{absorbed}} = 0.700 \times K_0 = 0.700 \times 1,323.0 = \mathbf{926.1\text{ J}}$$
3. **Part (b): Heat Required to Raise Bullet to Melting Point:**
   $$\Delta T = T_m - T_0 = 327.5 - 25.0 = 302.5^\circ\text{C}$$
   $$Q_{\text{warm}} = m c_p \Delta T = (0.0150\text{ kg}) \times (128\text{ J/kg}\cdot^\circ\text{C}) \times 302.5^\circ\text{C} = 1.92 \times 302.5 = \mathbf{580.8\text{ J}}$$
   - Since $Q_{\text{absorbed}} = 926.1\text{ J} > Q_{\text{warm}} = 580.8\text{ J}$, the bullet **definitely reaches its melting point**!
4. **Part (c): Latent Heat and Mass Melted:**
   - Remaining heat available for melting:
     $$Q_{\text{melt}} = Q_{\text{absorbed}} - Q_{\text{warm}} = 926.1 - 580.8 = 345.3\text{ J}$$
   - Heat required to completely melt the entire bullet:
     $$Q_{\text{full melt}} = m L_f = (0.0150) \times (2.45 \times 10^4) = 367.5\text{ J}$$
   - Fraction melted:
     $$\text{Fraction} = \frac{Q_{\text{melt}}}{Q_{\text{full melt}}} = \frac{345.3\text{ J}}{367.5\text{ J}} \approx 0.9396 = \mathbf{94.0\%}$$
   - Over **$94\%$ of the bullet liquefies into molten lead splatter** simply from the destruction of its own kinetic energy!

---

### Worked Example 10.3: Shaped-Charge Jet Penetration into Armor Steel
*A shaped-charge warhead generates a continuous copper jet ($\rho_j = 8,960\text{ kg/m}^3$) of effective length $L = 25.0\text{ cm}$ traveling at $v_j = 6,500\text{ m/s}$. The jet impacts a rolled homogeneous steel armor plate ($\rho_t = 7,850\text{ kg/m}^3$). (a) Compute the hydrodynamic penetration speed $u$ into the armor. (b) Calculate the total penetration depth $P$ according to Birkhoff's formula. (c) If a tungsten jet ($\rho_w = 19,300\text{ kg/m}^3$) of the same length were used, what would be the penetration depth?*

#### Solution
1. **Given:**
   - Copper density: $\rho_j = 8,960\text{ kg/m}^3 \implies \sqrt{\rho_j} = \sqrt{8,960} \approx 94.657$
   - Steel density: $\rho_t = 7,850\text{ kg/m}^3 \implies \sqrt{\rho_t} = \sqrt{7,850} \approx 88.600$
   - $L = 0.250\text{ m}$, $v_j = 6,500\text{ m/s}$
2. **Part (a): Penetration Front Speed $u$:**
   $$u = \frac{\sqrt{\rho_j}}{\sqrt{\rho_j} + \sqrt{\rho_t}} v_j = \frac{94.657}{94.657 + 88.600} \times 6,500 = \frac{94.657}{183.257} \times 6,500 \approx 0.5165 \times 6,500 \approx \mathbf{3,357.5\text{ m/s}}$$
3. **Part (b): Total Penetration Depth for Copper Jet:**
   $$P_{\text{Cu}} = L \sqrt{\frac{\rho_j}{\rho_t}} = 0.250 \times \frac{94.657}{88.600} = 0.250 \times 1.06836 \approx \mathbf{0.267\text{ m} = 26.7\text{ cm}}$$
4. **Part (c): Penetration Depth for Tungsten Jet:**
   - $\rho_w = 19,300\text{ kg/m}^3 \implies \sqrt{\rho_w} = \sqrt{19,300} \approx 138.924$
   $$P_{\text{W}} = L \sqrt{\frac{\rho_w}{\rho_t}} = 0.250 \times \frac{138.924}{88.600} = 0.250 \times 1.5680 \approx \mathbf{0.392\text{ m} = 39.2\text{ cm}}$$
   (Tungsten penetrates nearly $12.5\text{ cm}$ deeper through the steel armor!).

---

### Worked Example 10.4: Meteorite Atmospheric Reentry and Cratering Energy
*An iron meteorite of mass $M = 5.00 \times 10^7\text{ kg}$ (radius $\approx 11.5\text{ m}$) impacts Earth at speed $v_0 = 18.0\text{ km/s}$. (a) Calculate the kinetic energy of the meteorite in Joules. (b) Convert this energy into megatons of TNT equivalent ($1\text{ megaton TNT} = 4.184 \times 10^{15}\text{ J}$). (c) If $85.0\%$ of this energy goes into excavating a circular crater, and the excavation energy required per cubic meter of rock is $\mathcal{E}_{\text{rock}} = 2.00 \times 10^7\text{ J/m}^3$, estimate the excavated crater volume.*

#### Solution
1. **Part (a): Kinetic Energy:**
   $$v_0 = 18,000\text{ m/s}$$
   $$E_K = \frac{1}{2} M v_0^2 = \frac{1}{2}(5.00 \times 10^7)(18,000)^2 = 2.50 \times 10^7 \times 3.24 \times 10^8 = \mathbf{8.10 \times 10^{15}\text{ J}}$$
2. **Part (b): Megatons of TNT Equivalent:**
   $$E_{\text{megatons}} = \frac{8.10 \times 10^{15}\text{ J}}{4.184 \times 10^{15}\text{ J/Mton}} \approx \mathbf{1.936\text{ Megatons of TNT}}$$
   (Nearly 130 times the energy of the Hiroshima atomic bomb!).
3. **Part (c): Crater Excavation Volume:**
   - Energy available for excavation:
     $$E_{\text{crater}} = 0.850 \times (8.10 \times 10^{15}\text{ J}) = 6.885 \times 10^{15}\text{ J}$$
   - Volume excavated:
     $$V_{\text{crater}} = \frac{E_{\text{crater}}}{\mathcal{E}_{\text{rock}}} = \frac{6.885 \times 10^{15}\text{ J}}{2.00 \times 10^7\text{ J/m}^3} = \mathbf{3.44 \times 10^8\text{ m}^3}$$
   - If modeled as a parabolic bowl with diameter $D$ and depth $d = D/5$:
     $$V = \frac{1}{2}\pi \left(\frac{D}{2}\right)^2 d = \frac{\pi D^3}{40} \implies D = \left(\frac{40 V}{\pi}\right)^{1/3} = \left(\frac{40 \times 3.44 \times 10^8}{3.14159}\right)^{1/3} \approx (4.38 \times 10^9)^{1/3} \approx \mathbf{1,636\text{ m} \approx 1.64\text{ km}}$$
   (Directly matches the scale of the famous Barringer Meteor Crater in Arizona!).

---

### Worked Example 10.5: Hugoniot Shock Pressure Calculation in Aluminum
*A flyer plate of 6061-T6 aluminum strikes a stationary target of the identical aluminum alloy at impact velocity $v_{\text{imp}} = 2.00\text{ km/s}$. The initial density of aluminum is $\rho_0 = 2,700\text{ kg/m}^3$. The shock velocity $u_s$ is related to particle velocity $u_p$ by the linear Hugoniot relation $u_s = c_0 + s u_p$, where $c_0 = 5.35\text{ km/s}$ and $s = 1.34$. Calculate: (a) the particle velocity $u_p$ behind the shock, (b) the shock propagation speed $u_s$, and (c) the peak shock pressure $P_1$ in Gigapascals.*

#### Solution
1. **Part (a): Particle Velocity by Symmetry:**
   - For identical materials colliding symmetrically:
     $$u_p = \frac{v_{\text{imp}}}{2} = \frac{2,000\text{ m/s}}{2} = \mathbf{1,000\text{ m/s} = 1.00\text{ km/s}}$$
2. **Part (b): Shock Speed $u_s$:**
   $$u_s = c_0 + s u_p = 5.35\text{ km/s} + (1.34)(1.00\text{ km/s}) = 5.35 + 1.34 = \mathbf{6.69\text{ km/s} = 6,690\text{ m/s}}$$
3. **Part (c): Peak Shock Pressure $P_1$:**
   - Hugoniot momentum jump condition ($P_0 \approx 0$ compared to GPa range):
     $$P_1 = \rho_0 u_s u_p = (2,700\text{ kg/m}^3) \times (6,690\text{ m/s}) \times (1,000\text{ m/s})$$
     $$P_1 = 1.8063 \times 10^{10}\text{ Pa} = \mathbf{18.06\text{ GPa}}$$
   (Over 180,000 atmospheres of pressure!).

---

### Worked Example 10.6: Adiabatic Shear Band Local Flash Temperature
*In a high-speed machining process, a steel chip undergoes severe plastic shear deformation. The shear yield stress is $\tau_y = 600\text{ MPa}$, and the plastic shear strain inside an adiabatic shear band is $\gamma = 4.0$. If the steel has density $\rho = 7,850\text{ kg/m}^3$ and specific heat $c_p = 460\text{ J}/(\text{kg}\cdot^\circ\text{C})$, and $90.0\%$ of the plastic work is converted into heat ($\beta = 0.90$), find the adiabatic temperature rise $\Delta T$.*

#### Solution
1. **Volumetric Plastic Work:**
   $$w_p = \int \tau_y\,d\gamma = \tau_y \gamma = (600 \times 10^6\text{ Pa}) \times 4.0 = \mathbf{2.40 \times 10^9\text{ J/m}^3}$$
2. **Volumetric Heat Generated:**
   $$q_v = \beta w_p = 0.90 \times (2.40 \times 10^9) = \mathbf{2.16 \times 10^9\text{ J/m}^3}$$
3. **Volumetric Heat Capacity:**
   $$C_v = \rho c_p = 7,850 \times 460 = 3.611 \times 10^6\text{ J}/(\text{m}^3\cdot^\circ\text{C})$$
4. **Adiabatic Temperature Rise:**
   $$\Delta T = \frac{q_v}{C_v} = \frac{2.16 \times 10^9}{3.611 \times 10^6} \approx \mathbf{598.2^\circ\text{C}}$$
   If initial ambient temperature was $20^\circ\text{C}$, the material in the shear band instantly jumps to over $618^\circ\text{C}$, causing severe thermal softening!

---

### Worked Example 10.7: Automotive Frontal Crash Energy Dissipation
*A passenger vehicle of mass $M = 1,800\text{ kg}$ traveling at $v_0 = 64.0\text{ km/h}$ ($17.78\text{ m/s}$) impacts a rigid concrete barrier head-on ($e = 0$). The vehicle's front crumple zone collapses progressively over a stroke distance $d = 0.750\text{ m}$. (a) Calculate the total kinetic energy that must be dissipated. (b) Determine the average crash deceleration $a_{\text{avg}}$ in $\text{m/s}^2$ and in units of $g$. (c) Find the average dynamic crushing force $F_{\text{crush}}$ exerted by the crumple zone.*

#### Solution
1. **Part (a): Kinetic Energy:**
   $$K_0 = \frac{1}{2} M v_0^2 = \frac{1}{2}(1,800)(17.78)^2 = 900 \times 316.13 \approx \mathbf{284,500\text{ J} = 284.5\text{ kJ}}$$
2. **Part (b): Deceleration:**
   - Using kinematic relation $v^2 = v_0^2 - 2 a d = 0$:
     $$a_{\text{avg}} = \frac{v_0^2}{2d} = \frac{(17.78)^2}{2 \times 0.750} = \frac{316.13}{1.500} \approx \mathbf{210.75\text{ m/s}^2}$$
   - In units of Earth gravity ($g = 9.80\text{ m/s}^2$):
     $$a_g = \frac{210.75}{9.80} \approx \mathbf{21.5\text{ g}}$$
3. **Part (c): Average Crushing Force:**
   $$F_{\text{crush}} = M a_{\text{avg}} = 1,800 \times 210.75 = \mathbf{379,350\text{ N} \approx 379.4\text{ kN}}$$
   (Work-energy check: $W = F d = 379,350 \times 0.750 = 284,512\text{ J} \approx K_0$).

---

### Worked Example 10.8: Fracture Surface Energy in Impact Fragmentation
*A brittle glass sphere of radius $R_0 = 5.00\text{ cm}$ falls onto a hard anvil and shatters completely into $N = 1.00 \times 10^6$ identical tiny spherical fragments. The surface energy of glass (energy needed to create new surface area by breaking covalent bonds) is $\gamma_{\text{surface}} = 0.300\text{ J/m}^2$. Calculate: (a) the radius $r_f$ of each fragment, (b) the total surface area created, and (c) the total energy absorbed purely by chemical bond cleavage.*

#### Solution
1. **Part (a): Fragment Radius:**
   - Total volume is conserved:
     $$V_{\text{total}} = \frac{4}{3}\pi R_0^3 = N \left(\frac{4}{3}\pi r_f^3\right) \implies r_f = \frac{R_0}{N^{1/3}}$$
     $$N^{1/3} = (1.00 \times 10^6)^{1/3} = 100$$
     $$r_f = \frac{0.0500\text{ m}}{100} = \mathbf{5.00 \times 10^{-4}\text{ m} = 0.500\text{ mm}}$$
2. **Part (b): Surface Area Created:**
   - Initial surface area:
     $$A_0 = 4\pi R_0^2 = 4\pi (0.050)^2 = 4\pi \times 0.0025 = 0.010\pi \approx 0.03142\text{ m}^2$$
   - Total final surface area of $10^6$ fragments:
     $$A_f = N (4\pi r_f^2) = 10^6 \times 4\pi (5.00 \times 10^{-4})^2 = 10^6 \times 4\pi \times (2.50 \times 10^{-7}) = 1.00\pi \approx 3.14159\text{ m}^2$$
   - New surface area created:
     $$\Delta A = A_f - A_0 = 3.14159 - 0.03142 = \mathbf{3.110\text{ m}^2}$$
3. **Part (c): Fracture Energy:**
   $$E_{\text{fracture}} = \gamma_{\text{surface}} \Delta A = (0.300\text{ J/m}^2) \times (3.110\text{ m}^2) = \mathbf{0.933\text{ J}}$$
4. **Physical Insight:**
   Notice how tiny this is! Less than $1\text{ Joule}$ is needed to smash the glass into a million pieces. The vast majority of impact kinetic energy goes into acoustic sound and thermal vibrations, with surface fracture absorbing less than $0.1\%$!

---

### Worked Example 10.9: Hydrodynamic Jet with Unequal Densities
*A shaped-charge liner made of depleted uranium ($\rho_j = 19,100\text{ kg/m}^3$) of length $L = 30.0\text{ cm}$ strikes a target composed of granite rock ($\rho_t = 2,650\text{ kg/m}^3$). Calculate the theoretical hydrodynamic penetration depth in the rock.*

#### Solution
1. **Given:**
   - $\rho_j = 19,100\text{ kg/m}^3$
   - $\rho_t = 2,650\text{ kg/m}^3$
   - $L = 0.300\text{ m}$
2. **Density Ratio:**
   $$\frac{\rho_j}{\rho_t} = \frac{19,100}{2,650} \approx 7.2075$$
   $$\sqrt{\frac{\rho_j}{\rho_t}} = \sqrt{7.2075} \approx 2.6847$$
3. **Penetration Depth:**
   $$P = L \sqrt{\frac{\rho_j}{\rho_t}} = 0.300 \times 2.6847 \approx \mathbf{0.8054\text{ m} = 80.5\text{ cm}}$$
   The uranium jet tunnels over $80\text{ cm}$ into solid granite—more than $2.68$ times its own length!

---

### Worked Example 10.10: Acoustic Energy Radiated by Bouncing Steel Spheres
*Two large steel spheres of radius $R = 10.0\text{ cm}$ and mass $m = 32.9\text{ kg}$ collide elastically at relative speed $v = 1.00\text{ m/s}$. According to Hunter's acoustic radiation theory for Hertzian impacts, the total fraction of kinetic energy radiated away as acoustic sound waves is:*
$$\frac{\Delta E_{\text{acoustic}}}{K} \approx 0.057 \left(\frac{v}{c_0}\right)^{3/5}$$
*where $c_0 = 5,000\text{ m/s}$ is the longitudinal sound speed in steel. (a) Calculate the acoustic energy fraction. (b) Calculate the total acoustic energy radiated in Joules.*

#### Solution
1. **Part (a): Acoustic Energy Fraction:**
   $$\frac{v}{c_0} = \frac{1.00\text{ m/s}}{5,000\text{ m/s}} = 2.00 \times 10^{-4}$$
   $$\left(2.00 \times 10^{-4}\right)^{3/5} = \left[(2.00 \times 10^{-4})^3\right]^{1/5} = (8.00 \times 10^{-12})^{0.2} \approx 0.006085$$
   $$\frac{\Delta E_{\text{acoustic}}}{K} = 0.057 \times 0.006085 \approx \mathbf{3.47 \times 10^{-4} = 0.0347\%}$$
2. **Part (b): Total Acoustic Energy Radiated:**
   - Total initial kinetic energy (in C-frame with each sphere moving at $0.50\text{ m/s}$):
     $$K = 2 \times \left[\frac{1}{2}(32.9)(0.50)^2\right] = 32.9 \times 0.25 = 8.225\text{ J}$$
   - Energy radiated:
     $$\Delta E_{\text{acoustic}} = (3.47 \times 10^{-4}) \times 8.225\text{ J} \approx \mathbf{2.85 \times 10^{-3}\text{ J} = 2.85\text{ mJ}}$$
3. **Conclusion:**
   Even though the loud metallic "CLANG!" of colliding steel spheres sounds deafening to human ears, it accounts for less than $0.04\%$ of the total collision energy! The human ear is sensitive down to $10^{-12}\text{ W/m}^2$, making minuscule mechanical acoustic losses sound intensely loud.

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 10.1:** Why does an automobile crash structure designed to crush plastically protect passengers far better than an ultra-rigid steel cage that does not deform at all during a collision?  
**Exercise 10.2:** In a completely inelastic collision between two identical clay balls moving toward each other at equal speeds, what happens to their initial kinetic energy? State the thermodynamic form it takes.

### Tier 2: Quantitative Mechanics
**Exercise 10.3:** A ballistic pendulum with a block of mass $M = 2.40\text{ kg}$ suspended by a $1.20\text{ m}$ cord is struck by a bullet of mass $m = 8.00\text{ g}$. The block swings to a maximum height $h = 5.00\text{ cm}$. Find: (a) the muzzle velocity of the bullet, and (b) the mechanical energy lost during penetration.  
**Exercise 10.4:** A $2.00\text{ kg}$ lead block at $20.0^\circ\text{C}$ is dropped from a height $H = 50.0\text{ m}$ onto an insulated floor ($e = 0$). Assuming all dissipated energy remains in the lead ($c_p = 128\text{ J}/(\text{kg}\cdot^\circ\text{C})$), calculate the temperature increase $\Delta T$ of the block.

### Tier 3: Multi-Stage Dynamics
**Exercise 10.5:** A shaped-charge weapon shoots a copper jet ($\rho_j = 8,960\text{ kg/m}^3$) of length $L = 20.0\text{ cm}$ against composite ceramic-steel armor consisting of a $10.0\text{ cm}$ faceplate of alumina ceramic ($\rho_{\text{alumina}} = 3,900\text{ kg/m}^3$) backed by steel ($\rho_{\text{steel}} = 7,850\text{ kg/m}^3$). Calculate the residual length of the jet after perforating the alumina faceplate, and find how far it penetrates into the steel backing.  
**Exercise 10.6:** An asteroid of diameter $D = 50.0\text{ m}$ and density $\rho = 3,000\text{ kg/m}^3$ strikes Earth at $v = 20.0\text{ km/s}$. Compute its kinetic energy in petajoules ($10^{15}\text{ J}$) and compare it with the 1908 Tunguska event ($\approx 15\text{ Megatons of TNT}$).

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 10.7:** A high-speed copper projectile ($c_p = 385\text{ J}/(\text{kg}\cdot^\circ\text{C})$) impacts an armored wall. What is the minimum impact speed $v_{\min}$ required to raise its temperature by $400^\circ\text{C}$, assuming $80.0\%$ of its initial kinetic energy is converted into internal thermal heat of the projectile?  
**Exercise 10.8:** Derive the Rankine-Hugoniot energy jump condition $E_1 - E_0 = \frac{1}{2}(P_1 + P_0)(V_0 - V_1)$ (where $V = 1/\rho$ is specific volume) directly from the mass and momentum jump conditions across a steady planar shock front.

### Tier 5: Olympiad / Research Challenge
**Exercise 10.9:** The Hydrodynamic Stagnation Jet: If a hypervelocity jet has a linear velocity gradient along its length (the jet tip travels at $v_{\text{tip}} = 8.0\text{ km/s}$ while the tail travels at $v_{\text{tail}} = 2.0\text{ km/s}$), derive an integral expression for the total penetration depth into a target of density $\rho_t$ and evaluate it analytically for a jet of initial length $L_0$ and density $\rho_j$.  
**Exercise 10.10:** Nuclear Impact Vaporization: When an asteroid strikes a planet at $v_0 = 35.0\text{ km/s}$, the shock pressure reaches several terapascals ($10^{12}\text{ Pa}$). Using the Mie-Grüneisen equation of state, prove that upon complete isentropic release (decompression to zero pressure), the internal entropy created by the irreversible shock exceeds the entropy of vaporization, causing the entire impactor to undergo explosive phase transition into a supercritical ionized gas bubble.

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 10.1
By the Work-Energy Theorem and Impulse-Momentum Theorem:
- In a rigid vehicle that does not deform ($d \to 0$), the deceleration distance is microscopic, causing the impact duration $\Delta t$ to be extremely small ($< 10\text{ ms}$). Consequently, the deceleration $a = v^2 / (2d)$ and peak impact forces $F = m a$ reach catastrophic levels ($> 100\text{ g}$), causing fatal internal organ trauma, aorta rupture, and basilar skull fractures to occupants.
- A controlled crumple zone deforms plastically over $0.6\text{ to }1.0\text{ meter}$, absorbing the vehicle's kinetic energy as plastic deformation work ($\int F_{\text{crush}} dx = \Delta K$). This extends the deceleration time $\Delta t$ to $80-120\text{ ms}$, capping the maximum acceleration experienced by the passenger compartment to survivable human limits ($< 20-25\text{ g}$).

---

### Solution to Exercise 10.2
In a completely inelastic head-on collision between two identical clay balls with equal and opposite initial velocities ($\vec{v}_1 = v\hat{i}, \vec{v}_2 = -v\hat{i}$):
1. By conservation of momentum: $\vec{P}_{\text{total}} = m(v\hat{i}) + m(-v\hat{i}) = \vec{0} \implies$ the balls come to a dead stop ($V_f = 0$).
2. Total initial mechanical kinetic energy: $K_i = \frac{1}{2}m v^2 + \frac{1}{2}m v^2 = m v^2$.
3. All $100\%$ of this kinetic energy is converted into microscopic **internal thermal energy**: irreversible plastic shear work of the clay platelets and random thermal vibrations of atoms ($Q = m v^2$). The clay balls will be physically warm to the touch!

---

### Solution to Exercise 10.3
1. **Pendulum Speed Immediately After Impact:**
   $$V = \sqrt{2gh} = \sqrt{2 \times 9.80 \times 0.0500} = \sqrt{0.980} \approx 0.98995\text{ m/s}$$
2. **Part (a): Bullet Muzzle Velocity:**
   - $m = 0.00800\text{ kg}$, $M = 2.40\text{ kg} \implies m + M = 2.408\text{ kg}$.
   $$v_0 = \frac{m + M}{m} V = \frac{2.408}{0.00800} \times 0.98995 = 301.0 \times 0.98995 \approx \mathbf{297.97\text{ m/s} \approx 298.0\text{ m/s}}$$
3. **Part (b): Mechanical Energy Lost:**
   - $K_i = \frac{1}{2}(0.00800)(297.97)^2 \approx 0.0040 \times 88,788 \approx 355.15\text{ J}$.
   - $K_f = \frac{1}{2}(2.408)(0.98995)^2 \approx 1.204 \times 0.980 \approx 1.18\text{ J}$.
   - Energy lost:
     $$\Delta K_{\text{loss}} = 355.15 - 1.18 = \mathbf{353.97\text{ J} \approx 354.0\text{ J}}$$

---

### Solution to Exercise 10.4
1. **Potential Energy Lost:**
   $$E_{\text{pot}} = m g H = (2.00\text{ kg}) \times (9.80\text{ m/s}^2) \times (50.0\text{ m}) = 980.0\text{ J}$$
2. **Thermal Heat Conversion:**
   $$Q = 980.0\text{ J}$$
3. **Temperature Rise:**
   $$Q = m c_p \Delta T \implies \Delta T = \frac{Q}{m c_p} = \frac{980.0\text{ J}}{(2.00\text{ kg}) \times (128\text{ J/kg}\cdot^\circ\text{C})} = \frac{980.0}{256.0} \approx \mathbf{3.83^\circ\text{C}}$$

---

### Solution to Exercise 10.5
1. **Perforation of Alumina Faceplate ($d_1 = 0.100\text{ m}$):**
   - Jet length consumed to penetrate distance $d_1$:
     $$d_1 = L_{\text{consumed}} \sqrt{\frac{\rho_j}{\rho_{\text{alumina}}}} \implies L_{\text{consumed}} = d_1 \sqrt{\frac{\rho_{\text{alumina}}}{\rho_j}}$$
     $$L_{\text{consumed}} = 0.100 \times \sqrt{\frac{3,900}{8,960}} = 0.100 \times \sqrt{0.43527} = 0.100 \times 0.65975 \approx 0.0660\text{ m} = 6.60\text{ cm}$$
2. **Residual Length of Copper Jet:**
   $$L_{\text{residual}} = L_0 - L_{\text{consumed}} = 20.0 - 6.60 = \mathbf{13.40\text{ cm} = 0.1340\text{ m}}$$
3. **Penetration into Steel Backing:**
   $$P_{\text{steel}} = L_{\text{residual}} \sqrt{\frac{\rho_j}{\rho_{\text{steel}}}} = 0.1340 \times \sqrt{\frac{8,960}{7,850}} = 0.1340 \times \sqrt{1.1414} = 0.1340 \times 1.06836 \approx \mathbf{0.1432\text{ m} = 14.32\text{ cm}}$$

---

### Solution to Exercise 10.6
1. **Asteroid Mass:**
   - Radius $R = 25.0\text{ m}$.
   - Volume: $V = \frac{4}{3}\pi R^3 = \frac{4}{3}\pi (25.0)^3 \approx 65,450\text{ m}^3$.
   - Mass: $M = \rho V = 3,000 \times 65,450 \approx 1.9635 \times 10^8\text{ kg}$.
2. **Kinetic Energy:**
   $$E_K = \frac{1}{2} M v^2 = \frac{1}{2}(1.9635 \times 10^8)(20,000)^2 = 0.98175 \times 10^8 \times 4.0 \times 10^8 \approx \mathbf{3.927 \times 10^{16}\text{ J} = 39.27\text{ PJ}}$$
3. **TNT Megaton Equivalent:**
   $$E_{\text{Mton}} = \frac{3.927 \times 10^{16}\text{ J}}{4.184 \times 10^{15}\text{ J/Mton}} \approx \mathbf{9.39\text{ Megatons of TNT}}$$
   (Slightly below the estimated $10-15\text{ Mton}$ Tunguska impact of 1908).

---

### Solution to Exercise 10.7
1. **Thermal Heat Required per Kilogram:**
   $$q = c_p \Delta T = (385\text{ J/kg}\cdot^\circ\text{C}) \times 400^\circ\text{C} = 154,000\text{ J/kg}$$
2. **Energy Balance:**
   - Kinetic energy per kilogram: $\frac{1}{2} v^2$.
   - Heat absorbed: $0.800 \times \left(\frac{1}{2} v^2\right) = 0.400 v^2$.
   $$0.400 v^2 = 154,000 \implies v^2 = \frac{154,000}{0.400} = 385,000\text{ m}^2/\text{s}^2$$
   $$v_{\min} = \sqrt{385,000} \approx \mathbf{620.5\text{ m/s}}$$

---

### Solution to Exercise 10.8
1. In the frame where the shock is at rest:
   - Mass conservation: $\rho_0 u_0 = \rho_1 u_1 \equiv j$ (mass flux).
     Using specific volume $V = 1/\rho$: $u_0 = j V_0$ and $u_1 = j V_1$.
   - Momentum conservation:
     $$P_0 + \rho_0 u_0^2 = P_1 + \rho_1 u_1^2 \implies P_1 - P_0 = j^2 (V_0 - V_1)$$
   - Energy conservation (enthalpy flux):
     $$E_0 + P_0 V_0 + \frac{1}{2} u_0^2 = E_1 + P_1 V_1 + \frac{1}{2} u_1^2$$
2. Rearranging energy:
   $$E_1 - E_0 = P_0 V_0 - P_1 V_1 + \frac{1}{2}(u_0^2 - u_1^2)$$
   Substitute $u_0^2 - u_1^2 = j^2(V_0^2 - V_1^2) = j^2(V_0 - V_1)(V_0 + V_1)$:
   $$u_0^2 - u_1^2 = (P_1 - P_0)(V_0 + V_1)$$
3. Combine terms:
   $$E_1 - E_0 = P_0 V_0 - P_1 V_1 + \frac{1}{2}(P_1 V_0 + P_1 V_1 - P_0 V_0 - P_0 V_1)$$
   $$E_1 - E_0 = \frac{1}{2} P_1 V_0 - \frac{1}{2} P_1 V_1 + \frac{1}{2} P_0 V_0 - \frac{1}{2} P_0 V_1 = \mathbf{\frac{1}{2}(P_1 + P_0)(V_0 - V_1)}$$
   $$\blacksquare$$

---

### Solution to Exercise 10.9
1. For a stretching jet with variable velocity profile $v(z)$ along its length $z \in [0, L_0]$:
   - The penetration speed of each element is $u(z) = \frac{\gamma}{1 + \gamma} v(z)$, where $\gamma = \sqrt{\rho_j / \rho_t}$.
   - The element of jet $dz$ contributes an incremental penetration $dP = \gamma\,dz$.
2. Integrating over the entire length of the stretching jet from tail to tip:
   $$P_{\text{total}} = \int_0^{L_0} \sqrt{\frac{\rho_j}{\rho_t}} dz = \mathbf{L_0 \sqrt{\frac{\rho_j}{\rho_t}}}$$
   Remarkably, as long as each element reaches the target before the penetration cavity closes, the total hydrodynamic penetration remains strictly $L_0 \sqrt{\rho_j / \rho_t}$!

---

### Solution to Exercise 10.10
1. Specific kinetic energy at $v_0 = 35\text{ km/s}$:
   $$e_k = \frac{1}{2}(35,000)^2 = 6.125 \times 10^8\text{ J/kg} \approx 612.5\text{ MJ/kg}$$
2. Peak Hugoniot shock pressure reaches $P_1 > 2\text{ TPa}$.
3. The shock compression is non-isentropic (produces massive irreversible entropy jump $\Delta S = \int \frac{T dS}{T} > 0$).
4. When the shock reflects from free surfaces, rarefaction waves decompress the material back to $P = 0$.
5. Because the decompression path follows the high-entropy isentrope, the residual internal energy $E_{\text{waste}}$ after reaching zero pressure far exceeds the enthalpy of vaporization of rock ($\sim 13\text{ MJ/kg}$). The entire impactor instantaneously flashes into a superheated expanding plasma fireball!
