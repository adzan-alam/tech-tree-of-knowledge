# Atomic Structure, Subatomic Particles, and Periodic Trends

## 1. Conceptual Foundations & Intuitive Overview
All ordinary matter in the universe is composed of **atoms**. An atom is the smallest constituent unit of ordinary matter that possesses the chemical properties of an element.

Historically, atoms were once thought to be indivisible spheres (from the Greek *atomos*). In the late 19th and early 20th centuries, scattering experiments proved that atoms possess an intricate internal architecture:
- A dense, positively charged **nucleus** containing almost all the atom's mass.
- A surrounding cloud of negatively charged **electrons** occupying quantized energy states.

---

## 2. Mathematical Formalism

### 2.1 Subatomic Properties
| Particle | Symbol | Relative Charge | Mass (kg) | Approx. Mass (u) | Location |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Proton** | $p^+$ | $+1$ | $1.6726 \times 10^{-27}$ | $\approx 1.0073$ | Nucleus |
| **Neutron** | $n^0$ | $0$ | $1.6749 \times 10^{-27}$ | $\approx 1.0087$ | Nucleus |
| **Electron** | $e^-$ | $-1$ | $9.1094 \times 10^{-31}$ | $\approx 0.00055$ | Extranuclear Shells |

### 2.2 Atomic and Mass Numbers
For an element symbol $X$:
$$ ^{A}_{Z}X $$
- **Atomic Number ($Z$):** Number of protons. Defines elemental identity.
- **Mass Number ($A$):** Number of nucleons (protons + neutrons):
  $$ A = Z + N \implies N = A - Z $$
- **Average Atomic Mass ($\bar{m}$):**
  $$ \bar{m} = \sum_{i=1}^k f_i m_i $$
  where $f_i$ is the fractional abundance and $m_i$ is the isotopic mass.

### 2.3 Bohr Model of Hydrogen-like Atoms
Niels Bohr proposed that electron angular momentum is quantized ($L = n \hbar$). The energy of an electron in principal quantum shell $n$ is:

$$ E_n = -\frac{13.6 \text{ eV}}{n^2}, \quad n \in \{1, 2, 3, \dots\} $$

Photon energy $\Delta E$ emitted or absorbed during a transition from $n_2$ to $n_1$:
$$ \Delta E = E_2 - E_1 = h \nu = \frac{h c}{\lambda} = 13.6 \text{ eV} \left( \frac{1}{n_1^2} - \frac{1}{n_2^2} \right) $$

---

## 3. Worked Examples

### Example 1: Chlorine Average Atomic Mass
Natural chlorine consists of two major stable isotopes:
- $^{35}\text{Cl}$: Mass $34.969 \text{ u}$, natural abundance $75.78\%$ ($f_1 = 0.7578$)
- $^{37}\text{Cl}$: Mass $36.966 \text{ u}$, natural abundance $24.22\%$ ($f_2 = 0.2422$)

**Solution:**
$$ \bar{m} = (0.7578 \times 34.969) + (0.2422 \times 36.966) $$
$$ \bar{m} = 26.4995 + 8.9532 = 35.453 \text{ u} $$
This matches the standard periodic table value of $\approx 35.45 \text{ u}$.

---

## 4. Interactive Simulation & Practical Computation

```javascript
// Calculate Bohr energy transition wavelength in nanometers
function calculateBohrTransition(nInitial, nFinal) {
  if (nInitial <= nFinal) throw new Error("Emission requires nInitial > nFinal");
  const RydbergConstant = 1.097373e7; // m^-1
  const invLambda = RydbergConstant * (1 / (nFinal * nFinal) - 1 / (nInitial * nInitial));
  const wavelengthMeters = 1 / invLambda;
  return wavelengthMeters * 1e9; // convert to nm
}

// Balmer alpha line (n = 3 to n = 2, famous red hydrogen line)
console.log(calculateBohrTransition(3, 2).toFixed(1)); // ~656.3 nm (Red)
```
