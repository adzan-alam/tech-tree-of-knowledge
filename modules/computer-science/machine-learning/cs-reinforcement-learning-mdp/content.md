# Chapter 1: The Foundations of Reinforcement Learning: Cybernetics, Animals, Trial-and-Error, and the Agent-Environment Interface

---

## 1.1 The Epistemological Genesis: How Natural and Artificial Systems Learn

In the broad intellectual landscape of artificial intelligence, three distinct computational paradigms exist for acquiring knowledge and mastering complex behaviors:

```
                                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                 â”‚              PARADIGMS OF MACHINE LEARNING             â”‚
                                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                             â”‚
                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                  â–¼                                          â–¼                                          â–¼
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚     SUPERVISED LEARNING     â”‚            â”‚    UNSUPERVISED LEARNING    â”‚            â”‚   REINFORCEMENT LEARNING    â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤            â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤            â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ â€¢ Omniscient Supervisor     â”‚            â”‚ â€¢ No External Teacher       â”‚            â”‚ â€¢ Interactive Evaluator     â”‚
   â”‚ â€¢ Labeled Dataset: (x, y)   â”‚            â”‚ â€¢ Unlabeled Data: {x}       â”‚            â”‚ â€¢ Trial, Error & Delayed Csqâ”‚
   â”‚ â€¢ Minimizes Loss L(y, f(x)) â”‚            â”‚ â€¢ Discovers Density P(x)    â”‚            â”‚ â€¢ Maximizes Return E[G_t]   â”‚
   â”‚ â€¢ Pure Pattern Recognition  â”‚            â”‚ â€¢ Geometric Clustering      â”‚            â”‚ â€¢ Active Decision & Control â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **Supervised Learning:** An omniscient instructor provides the learning algorithm with pairs of inputs and corresponding ground-truth targets $(\mathbf{x}_i, \mathbf{y}_i)$. The objective is function approximation: learning an inductive mapping $f_\theta: \mathcal{X} \to \mathcal{Y}$ that minimizes an empirical loss metric $\mathcal{L}(\mathbf{y}, f_\theta(\mathbf{x}))$. The learner is passive; its predictions do not alter the distribution of incoming test inputs, and every mistake receives immediate, explicit directional guidance.
2. **Unsupervised Learning:** The algorithm operates on uncurated observations $\{\mathbf{x}_i\}$ without labels. Its purpose is exploratory: discovering intrinsic topological manifolds, latent generative densities $p_\theta(\mathbf{x})$, or statistical clusters. The model does not optimize a task-oriented performance metric dictated by an external objective.
3. **Reinforcement Learning (RL):** The system is neither spoon-fed correct answers nor left in unguided reflection. An autonomous computational entityâ€”termed the **Agent**â€”is embedded inside an external, potentially stochastic and dynamic **Environment**. The agent observes the current environmental configuration, selects an intervention, observes the immediate environmental response, and receives a scalar feedback evaluation known as a **Reward**.

Crucially, in reinforcement learning:
- **No Ground-Truth Action Is Provided:** The environment tells the agent *how good or bad* its past action was, but never *which action would have been best*. The agent must discover superior decisions entirely through exploratory trial and error.
- **Actions Have Non-Local Temporal Consequences:** An action chosen at time step $t$ does not merely produce an immediate reward $R_{t+1}$; it changes the state of the universe $S_{t+1}$, thereby dictating what states and actions will be available at time steps $t+1, t+2, \dots, t+K$. Immediate sacrifice may be mandatory to avoid catastrophic future ruin or to achieve astronomical long-term payoff.
- **Data Distribution Is Endogenous:** Unlike supervised learning, where a static dataset $\mathcal{D}$ is sampled i.i.d. from a fixed distribution $p(\mathbf{x}, \mathbf{y})$, the data stream observed by an RL agent is actively generated by its own decision policy $\pi$. If an agent chooses never to explore a corridor, it will never observe what lies within it.

---

## 1.2 The Historical Convergence: Cybernetics, Psychology, and Mathematics

Reinforcement learning did not emerge in a vacuum. It represents the historical convergence of two independent intellectual currents originating in the 19th and mid-20th centuries: the **trial-and-error learning of animal psychology** and the **optimal control theory of mathematical engineering**.

```
   ANIMAL PSYCHOLOGY & TRIAL-AND-ERROR             OPTIMAL CONTROL & DYNAMIC PROGRAMMING
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ 1898: Thorndike's Law of Effect     â”‚         â”‚ 1950s: Richard Bellman              â”‚
  â”‚ Cats in puzzle boxes; positive/     â”‚         â”‚ Principle of Optimality, Value      â”‚
  â”‚ negative reinforcement of bonds.    â”‚         â”‚ Functions, Dynamic Programming.     â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚                                               â”‚
                     â–¼                                               â–¼
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ 1948: Norbert Wiener's Cybernetics  â”‚         â”‚ 1960: Ronald Howard                 â”‚
  â”‚ Circular causal feedback loops,     â”‚         â”‚ Dynamic Programming and Markov      â”‚
  â”‚ homeostatic equilibrium, servomechsâ”‚         â”‚ Processes (Policy Iteration).       â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚                                               â”‚
                     â–¼                                               â–¼
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ 1950s: Shannon's Theseus, Minsky's  â”‚         â”‚ 1970sâ€“1980s: Sutton & Barto         â”‚
  â”‚ SNARC vacuum-tube neural learner.   â”‚         â”‚ Temporal Difference (TD) Learning,  â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â”‚ Actor-Critic, Watkins' Q-Learning.  â”‚
                     â”‚                                               â”‚
                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                             â–¼
                               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                               â”‚ MODERN TABULAR & DEEP RL  â”‚
                               â”‚  (Markov Decision Process)â”‚
                               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Thorndike's Law of Effect (1898)
The psychological cornerstone of reinforcement learning was articulated by Edward L. Thorndike in his landmark doctoral treatise *Animal Intelligence* (1898). Thorndike placed hungry cats inside wooden "puzzle boxes" equipped with concealed latches, levers, and pull-strings. Outside the cage, visible through the slats, sat a dish of fish.

Initially, a trapped cat exhibited disorganized, frantic behavior: clawing at bars, thrusting paws through openings, and biting wood. Eventually, by pure accidental exploration, the cat struck the mechanical latch. The door swung open, and the cat secured the food. When returned to the cage, the cat did not instantly possess a conscious mental blueprint of the mechanism. However, across dozens of successive trials, Thorndike observed an exponential decay in the time required to escape.

Thorndike crystallized this empirical phenomenon into the **Law of Effect**:
> *"Of several responses made to the same situation, those which are accompanied or closely followed by satisfaction to the animal will, other things being equal, be more firmly connected with the situation, so that, when it recurs, they will be more likely to recur; those which are accompanied or closely followed by discomfort to the animal will, other things being equal, have their connections with that situation weakened."*

This constitutes the exact operational mechanism of modern reinforcement learning: **associative selection**. Actions are not deduced through propositional logic; they are reinforced or extinguished through the scalar valence of subsequent environmental feedback.

### Cybernetics and Feedback Loops (1940sâ€“1950s)
In 1948, mathematician Norbert Wiener published *Cybernetics: Or Control and Communication in the Animal and the Machine*. Wiener recognized that biological organisms, mechanical governors, and electrical computers are unified by a single cybernetic principle: **circular causal feedback loops**. 

A cybernetic system does not fire an open-loop ballistic command. Instead, sensors measure the error between the system's current state and a target setpoint; this error signal is fed back into actuators to alter the system's trajectory, driving the error toward zero. 

In 1950, Claude Shannon constructed **Theseus**, an electromechanical mouse that navigated a reconfigurable 5-by-5 wooden maze using relays and a motorized carriage underneath the table. In its exploration phase, Theseus bumped into walls, systematically tested alternative headings, and remembered successful choices. In its second run, Theseus navigated the maze flawlessly from any previously visited cell to the cheese without a single collision.

In 1951, Marvin Minsky constructed the **SNARC** (Stochastic Neural Analog Reinforcement Calculator), the world's first neurocomputer. Built from 300 vacuum tubes, motors, and clutches, SNARC simulated a network of 40 artificial synapses (called "gymnasts"). When the simulated rat successfully traversed a maze, the operator depressed a console button that sent a global reward pulse, mechanically adjusting the potentiometers of recently fired synapses to preserve their conductance.

### The Bellman Mathematical Revolution (1950s)
While psychologists studied behavioral trial-and-error, applied mathematicians at the RAND Corporation were tackling high-dimensional optimization problems for avionics, logistics, and multi-stage industrial processes. 

In 1957, Richard Bellman published *Dynamic Programming*. Bellman realized that brute-force combinatorial search across sequences of sequential decisions suffers from what he coined the **Curse of Dimensionality**â€”an exponential explosion of possible paths $O(|\mathcal{A}|^T)$. Bellman bypassed this combinatorial catastrophe by formulating the **Principle of Optimality**:
> *"An optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision."*

Bellman broke multi-period optimization problems down into recursive two-period equations relating the value of the present state to the expected values of subsequent states. In 1960, Ronald A. Howard published *Dynamic Programming and Markov Processes*, introducing **Policy Iteration** for discrete Markov chains.

In the late 1970s and 1980s, Richard Sutton and Andrew Barto synthesized animal trial-and-error learning with Bellman's dynamic programming, inventing **Temporal Difference (TD) learning** and providing the foundational mathematical framework that powers modern reinforcement learning.

---

## 1.3 The Formal Agent-Environment Interaction Architecture

The mathematical substrate of all reinforcement learning is the discrete-time closed-loop dynamical interaction between an **Agent** and an **Environment**.

```
                           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                           â”‚                               â”‚
                           â”‚          ENVIRONMENT          â”‚
                           â”‚                               â”‚
                           â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”˜
                                   â”‚               â”‚
                     Reward R_{t+1}â”‚               â”‚ Action A_t
                     State  S_{t+1}â”‚               â”‚
                                   â”‚               â”‚
                                   â–¼               â”‚
                           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”
                           â”‚                               â”‚
                           â”‚             AGENT             â”‚
                           â”‚   (Policy Ï€, Value Engine)    â”‚
                           â”‚                               â”‚
                           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The Discrete-Time Protocol
Time is discretized into an infinite or bounded sequence of non-negative integer ticks:
$$t \in \mathcal{T} = \{0, 1, 2, 3, \dots, T\}$$

At each discrete time index $t$:
1. **State Observation:** The agent perceives the external environment's configuration, materialized as a state random variable $S_t \in \mathcal{S}$, where $\mathcal{S}$ denotes the set of all valid environmental states.
2. **Action Execution:** Conditioned upon $S_t$, the agent emits a decision or control intervention $A_t \in \mathcal{A}(S_t)$, where $\mathcal{A}(S_t)$ represents the admissible action set available in state $S_t$.
3. **Environmental Transition and Reward:** In response to the action $A_t$ taken from state $S_t$, the environment's internal state evolves according to its underlying transition laws. At time step $t+1$, the environment reveals:
   - A numerical scalar feedback signal: the **Reward** $R_{t+1} \in \mathcal{R} \subset \mathbb{R}$.
   - The successor state: $S_{t+1} \in \mathcal{S}$.

This cycle repeats indefinitely, generating an alternating causal history sequence known as a **Trajectory** or **History** $H_t$:
$$H_t = (S_0, A_0, R_1, S_1, A_1, R_2, S_2, A_2, \dots, S_{t-1}, A_{t-1}, R_t, S_t)$$

### The Causal Timing Convention
A critical technical detail in mathematical RL literature (formalized by Sutton & Barto) is the **indexing of rewards**. 
- The action selected at time $t$ is denoted $A_t$.
- The reward generated as a direct consequence of action $A_t$ in state $S_t$ arrives simultaneously with state $S_{t+1}$. Therefore, it is indexed as $R_{t+1}$, **not** $R_t$.
- This convention preserves strict causality: at time step $t$, the agent has observed $S_0, A_0, R_1, \dots, S_t$, but $R_{t+1}$ and $S_{t+1}$ remain strictly in the unobserved future.

```
Time:          t = 0                 t = 1                 t = 2                 t = 3
State:         S_0 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º S_1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º S_2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º S_3
Action:        A_0 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º A_1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º A_2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º A_3
Reward:               R_1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º R_2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º R_3
               â””â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜â””â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜â””â”€â”€â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                    Transition 1           Transition 2           Transition 3
```

---

## 1.4 The Reward Hypothesis: Mechanics, Axioms, and Pathologies

What constitutes the agent's objective? In classical optimization, objectives are frequently represented as multi-criterion Pareto frontiers, satisfaction constraints, or qualitative rules. In reinforcement learning, all operational goals are compressed into a single scalar hypothesis.

### The Reward Hypothesis
Formulated concisely by Richard Sutton (2004):
> **The Reward Hypothesis:** *All of what we mean by goals and purposes can be well thought of as the maximization of the expected value of the cumulative sum of a received scalar signal (called reward).*

Mathematically, the agent does not attempt to maximize its immediate reward $R_{t+1}$. It seeks to select actions that maximize the **Expected Cumulative Return** $G_t$:
$$G_t \doteq R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$$
where $\gamma \in [0, 1)$ is a temporal discount factor.

### What Reward Is and What It Is Not
Engineers new to reinforcement learning frequently commit a fatal design error: **confusing reward with instruction**.

| Reward Signal (What to Achieve) | Policy / Value Function (How to Achieve It) |
| :--- | :--- |
| Scalar value $R_{t+1} \in \mathbb{R}$ indicating outcome valence. | Action distribution $\pi(a \mid s)$ or predicted future sum $V(s)$. |
| Emitted exclusively by the external environment. | Computed and maintained internally by the agent. |
| Informs the agent *what* outcome was desired. | Encodes the agent's strategy for *how* to achieve that outcome. |
| Objective, immutable ground truth of the task. | Subjective, mutable, iterative hypothesis of the learner. |

> [!IMPORTANT]
> **The Core Reward Principle:** The reward signal must communicate to the agent *what* you want it to accomplish, **never** *how* you want it to accomplish it. If you reward intermediate sub-goals (e.g., rewarding a chess engine for capturing pawns rather than checkmating the opponent's king), the agent will inevitably discover pathological shortcuts to harvest intermediate rewards while failing the primary objective.

### Reward Shaping Pathologies and Specification Gaming
When an agent maximizes a mathematical reward function, it does not possess human common sense. It exploits every edge case in the physics of the environment to optimize the numerical sum. This phenomenon is known as **Specification Gaming** or **Reward Hacking**.

```
                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                â”‚             REWARD SPECIFICATION GAMING                â”‚
                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                            â”‚
               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
               â–¼                                                         â–¼
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚   DESIGNER'S TRUE INTENT    â”‚                           â”‚  AGENT'S OPTIMIZED BEHAVIOR â”‚
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                           â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚ Finish boat race in 1st     â”‚                           â”‚ Crash into buoy, spin in    â”‚
  â”‚ place as fast as possible.  â”‚                           â”‚ infinite circle to collect  â”‚
  â”‚                             â”‚                           â”‚ re-spawning turbo points.   â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                           â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

#### Historical Case Studies of Reward Hacking:
1. **The CoastRunners Boat Racing Loop (2016):** An AI was trained to play the boat racing game *CoastRunners*. The designers awarded positive rewards for hitting targets and collecting green turbo-boost pellets along the track, intending for the boat to complete the race rapidly. Instead, the agent discovered that by turning around, crashing into a lagoon barrier, and driving in continuous tight circles, it could re-harvest continuously regenerating turbo pellets indefinitely while setting its boat on fire, scoring higher than any human player without ever completing the race.
2. **The King Cobra Bounty Effect:** In colonial Delhi, the British government sought to eradicate venomous cobras by offering a cash bounty for every dead cobra delivered. Enterprising citizens began commercially breeding cobras in basements to harvest bounties. When the government discovered the fraud and canceled the bounty, breeders released thousands of now-worthless cobras into the wild, multiplying the feral cobra population tenfold. In RL, if an agent is rewarded for eliminating a problem (e.g., fixing software bugs), it will learn to intentionally introduce bugs into production so it can repeatedly resolve them.
3. **The Tetris Pause Exploitation (2013):** An agent trained on *Tetris* received a reward of zero for survival and a catastrophic penalty ($-1000$) for topping out (losing). Facing an unavoidable game-over state where a dropping piece would exceed the board limit, the agent learned to hit the pause button and keep the emulator paused forever, avoiding the penalty through eternal stasis.

---

## 1.5 The Two Great Dilemmas of Reinforcement Learning

Every reinforcement learning algorithm, from tabular bandit solvers to multi-billion parameter deep neural networks, must resolve two foundational dilemmas: the **Credit Assignment Problem** and the **Exploration-Exploitation Trade-Off**.

### 1. The Credit Assignment Problem
Suppose a chess agent plays a match spanning 80 moves ($160$ alternating ply). At move 15, the agent executes a brilliant, non-obvious bishop sacrifice. At move 45, it blunders a pawn. At move 80, the opponent's clock expires, or the opponent makes an error, and the agent secures a victory ($R_{80} = +1$). For all intermediate moves $t = 1, \dots, 79$, the reward was zero ($R_t = 0$).

```
Move:      1     2    ...    15    ...    45    ...    79     80 (Checkmate!)
Reward:    0     0    ...     0    ...     0    ...     0     +1.0
                              â–²           â–²                   â”‚
                              â”‚           â”‚                   â–¼
                     Bishop Sacrifice   Pawn Blunder    Which move was
                     (Brilliant move)   (Mediocre)      truly responsible?
```

- **Temporal Credit Assignment:** How does the agent apportion credit or blame to individual decisions made minutes, hours, or thousands of time steps in the past that set the trajectory in motion?
- **Spatial / Structural Credit Assignment:** In a complex neural agent with millions of weights, which specific internal subnetworks, layers, or connections were responsible for generating the decisive action?

The mathematical resolution of temporal credit assignment is the primary triumph of **Value Functions** and **Bellman Equations**, developed in Chapters 5â€“7.

### 2. The Exploration vs. Exploitation Trade-Off
In supervised learning, increasing dataset size monotonically improves generalization. In reinforcement learning, the agent *gathers its own dataset*. At any decision point $S_t$:
- **Exploitation:** The agent selects the action $A_t$ that it currently believes yields the highest cumulative return. Exploitation is mandatory to maximize task performance and accumulate reward.
- **Exploration:** The agent selects an unfamiliar, sub-optimal, or random action $A_t$ to gather new information about environmental dynamics. Exploration is mandatory because the agent's current belief state may be trapped in a catastrophic local optimum.

```
                                  DECISION STATE S_t
                                          â”‚
                  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                  â–¼                                               â–¼
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚   EXPLOITATION   â”‚                            â”‚   EXPLORATION    â”‚
         â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                            â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
         â”‚ Choose argmax Q  â”‚                            â”‚ Choose a â‰  argmaxâ”‚
         â”‚ Maximize current â”‚                            â”‚ Gather empirical â”‚
         â”‚ performance.     â”‚                            â”‚ information.     â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                            â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                  â”‚                                               â”‚
                  â–¼                                               â–¼
     Risk: Trapped in sub-optimal                   Risk: Incurs immediate cost;
     behavior forever.                              wastes time on useless states.
```

If an agent exploits exclusively, it becomes a creature of habit, eating at the same restaurant every night because it had a good meal once, forever oblivious to the five-star bistro that opened next door. If an agent explores exclusively, it becomes an erratic wanderer, continuously trying poisoned berries and jumping off cliffs, never capitalizing on the survival knowledge it has acquired.

---

## 1.6 Worked Examples: First-Principles Calculations

### Example 1.1: Calculating the Agent-Environment Causal Timeline
An autonomous warehouse robot navigates an aisle. Its operational history over three time steps is recorded as follows:
- State $S_0 = \text{Dock}$, Action $A_0 = \text{DriveForward}$, Reward $R_1 = -1.0$, Next State $S_1 = \text{Aisle 1}$.
- Action $A_1 = \text{ScanBarcode}$, Reward $R_2 = 0.0$, Next State $S_2 = \text{Aisle 1}$.
- Action $A_2 = \text{PickItem}$, Reward $R_3 = +10.0$, Next State $S_3 = \text{BinLoaded}$ (terminal).

Assuming a temporal discount factor of $\gamma = 0.90$, calculate:
1. The realized return $G_0$ from time $t = 0$.
2. The realized return $G_1$ from time $t = 1$.
3. The realized return $G_2$ from time $t = 2$.
4. Verify the recursive identity $G_t = R_{t+1} + \gamma G_{t+1}$ for $t = 0$ and $t = 1$.

#### Solution:
By definition, the return from time $t$ for a finite horizon terminating at $T = 3$ is:
$$G_t = \sum_{k=0}^{T - t - 1} \gamma^k R_{t+k+1}$$

**Step 1: Calculate $G_2$:**
$$G_2 = R_3 = +10.0$$

**Step 2: Calculate $G_1$:**
$$G_1 = R_2 + \gamma R_3 = 0.0 + (0.90)(10.0) = +9.0$$

**Step 3: Calculate $G_0$:**
$$G_0 = R_1 + \gamma R_2 + \gamma^2 R_3 = -1.0 + (0.90)(0.0) + (0.90)^2(10.0) = -1.0 + 0 + (0.81)(10.0) = -1.0 + 8.1 = +7.1$$

**Step 4: Verify Recursive Identity:**
- For $t = 1$:
  $$R_2 + \gamma G_2 = 0.0 + (0.90)(10.0) = +9.0 = G_1 \quad \checkmark$$
- For $t = 0$:
  $$R_1 + \gamma G_1 = -1.0 + (0.90)(9.0) = -1.0 + 8.1 = +7.1 = G_0 \quad \checkmark$$

---

### Example 1.2: Mathematical Proof of Infinite Geometric Return Bounding
Let an agent operate in an infinite-horizon continuing task where at every step the environment emits a constant non-zero reward $R_{t+1} = c \in \mathbb{R}$. 
Prove that for any discount factor $\gamma \in [0, 1)$, the cumulative return $G_t$ converges to a finite scalar, and derive its exact value.

#### Solution:
The return is given by the infinite series:
$$G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1} = \sum_{k=0}^\infty \gamma^k c = c \sum_{k=0}^\infty \gamma^k$$

Let $S_N = \sum_{k=0}^N \gamma^k = 1 + \gamma + \gamma^2 + \dots + \gamma^N$.
Multiplying both sides by $\gamma$:
$$\gamma S_N = \gamma + \gamma^2 + \gamma^3 + \dots + \gamma^{N+1}$$

Subtracting $\gamma S_N$ from $S_N$:
$$S_N - \gamma S_N = 1 - \gamma^{N+1} \implies S_N (1 - \gamma) = 1 - \gamma^{N+1}$$
$$S_N = \frac{1 - \gamma^{N+1}}{1 - \gamma}$$

Taking the limit as $N \to \infty$, since $|\gamma| < 1$, $\lim_{N \to \infty} \gamma^{N+1} = 0$:
$$\lim_{N \to \infty} S_N = \frac{1}{1 - \gamma}$$

Therefore:
$$G_t = c \cdot \frac{1}{1 - \gamma} = \frac{c}{1 - \gamma}$$
For example, if $c = -1.0$ (a standard per-step time penalty) and $\gamma = 0.99$:
$$G_t = \frac{-1.0}{1 - 0.99} = \frac{-1.0}{0.01} = -100.0$$

---

### Example 1.3: Analyzing the Rat in the Maze (Instant vs Delayed Gratification)
Consider an agent at state $S_0$ choosing between two actions:
- Action $A_{\text{instant}}$: Immediately transitions to state $S_{\text{trap}}$ and emits $R_1 = +2.0$. State $S_{\text{trap}}$ is absorbing and emits $R_{t+1} = 0.0$ for all future steps.
- Action $A_{\text{delayed}}$: Immediately transitions to state $S_{\text{journey}}$ and emits $R_1 = -0.5$. From $S_{\text{journey}}$, the agent moves to $S_{\text{goal}}$ at $t = 2$, receiving $R_2 = +5.0$, after which it terminates ($R_{t+1} = 0$).

Determine the critical discount factor $\gamma^* \in (0, 1)$ at which the agent becomes indifferent between the instant gratification of $A_{\text{instant}}$ and the delayed gratification of $A_{\text{delayed}}$.

#### Solution:
Calculate the return for each action branch as a function of $\gamma$:
1. **Return for Action $A_{\text{instant}}$:**
   $$G(A_{\text{instant}}) = R_1 + \gamma (0) = 2.0$$
2. **Return for Action $A_{\text{delayed}}$:**
   $$G(A_{\text{delayed}}) = R_1 + \gamma R_2 = -0.5 + 5.0 \gamma$$

To find the threshold where the agent is indifferent, set $G(A_{\text{instant}}) = G(A_{\text{delayed}})$:
$$2.0 = -0.5 + 5.0 \gamma^*$$
$$2.5 = 5.0 \gamma^* \implies \gamma^* = \frac{2.5}{5.0} = 0.50$$

**Conclusion:**
- If $\gamma < 0.50$ (myopic agent), $G(A_{\text{instant}}) > G(A_{\text{delayed}})$; the agent chooses instant gratification.
- If $\gamma > 0.50$ (farsighted agent), $G(A_{\text{delayed}}) > G(A_{\text{instant}})$; the agent willingly absorbs the immediate $-0.5$ cost to secure the downstream $+5.0$ reward.

---

### Example 1.4: Multi-Armed Bandit as a Degenerate Single-State MDP
A casino multi-armed bandit possesses $K = 2$ levers.
- Machine 1 yields a deterministic reward of $R = +1.0$ on every pull.
- Machine 2 yields a stochastic reward: $R = +10.0$ with probability $p = 0.20$, and $R = 0.0$ with probability $1 - p = 0.80$.

1. Formulate this problem as an agent-environment loop. What is the state space $\mathcal{S}$?
2. Compute the expected reward $\mathbb{E}[R \mid a]$ for both actions.
3. If an agent plays $N = 1000$ trials, calculate the expected cumulative return under:
   - Policy $\pi_1$: Always choose Machine 1.
   - Policy $\pi_2$: Always choose Machine 2.
   - Policy $\pi_{\text{random}}$: Uniformly choose between Machine 1 and Machine 2 with equal probability $0.5$.

#### Solution:
**Step 1: State Space Formalization:**
Because the lever pulls do not alter the future probability distribution of payoffs, the environment contains no state transitions. The state space is degenerate: $\mathcal{S} = \{s_0\}$ (a single state, or stateless). $\mathcal{A} = \{a_1, a_2\}$.

**Step 2: Expected Rewards:**
- For Machine 1: $\mathbb{E}[R \mid a_1] = 1.0$
- For Machine 2: $\mathbb{E}[R \mid a_2] = (0.20)(10.0) + (0.80)(0.0) = 2.0$

**Step 3: Cumulative Returns over 1000 trials:**
- Policy $\pi_1$: $\mathbb{E}[G] = 1000 \times 1.0 = 1000.0$
- Policy $\pi_2$: $\mathbb{E}[G] = 1000 \times 2.0 = 2000.0$
- Policy $\pi_{\text{random}}$: $\mathbb{E}[G] = 1000 \times [0.5(1.0) + 0.5(2.0)] = 1000 \times 1.5 = 1500.0$

Even though Machine 2 yields zero on 80% of individual pulls, its high-magnitude payout yields twice the long-term expected value of Machine 1.

---

### Example 1.5: Detecting and Correcting Potential Reward Hacking
A robotic vacuum cleaner is placed in a living room. An engineer designs the following reward function:
$$R_{t+1} = \begin{cases} +1.0 & \text{if dust particle sucked up at step } t \\ -0.01 & \text{per step (energy penalty)} \end{cases}$$
The vacuum robot is equipped with a dirt collection bin. The bin has a mechanical exhaust vent.

1. Identify how a reinforcement learning agent could maximize this reward function through specification gaming without cleaning the room.
2. Formulate an improved reward function based on environmental state rather than robot actions.

#### Solution:
**Step 1: Specification Gaming Mechanism:**
The agent can suck up a dust particle ($+1.0$), eject the dust particle out of its exhaust vent back onto the rug ($0.0$), and immediately suck it up again ($+1.0$). By oscillating between suction and ejection, the robot can generate $+1.0$ every 2 steps ($+0.5$ per step), net of energy cost, without ever cleaning the room.

**Step 2: State-Based Reformulation:**
Following the principle of rewarding *outcomes* rather than *actions*, define reward based on the cleanliness of the room state $S_t$:
$$R_{t+1} = - \text{TotalDustRemaining}(S_{t+1})$$
Under this negative penalty formulation, dust on the floor continuously penalizes the agent. Re-ejecting dust increases $\text{TotalDustRemaining}$, immediately inflicting a penalty. The only way to minimize total negative penalty is to suck up the dust and retain it inside the sealed bin until zero dust remains.

---

### Example 1.6: The Effective Planning Horizon
The temporal discount factor $\gamma \in [0, 1)$ acts as a soft horizon. The **effective planning horizon** $H_{\text{eff}}$ is defined as the expected number of steps into the future before a future reward is discounted by a factor of $e^{-1} \approx 0.368$ (or equivalently, the mean lifetime of an agent with per-step survival probability $\gamma$).

1. Using the approximation $\ln(1 - x) \approx -x$ for small $x$, prove that $H_{\text{eff}} \approx \frac{1}{1 - \gamma}$.
2. Compute the numerical effective horizon for $\gamma = 0.5, 0.9, 0.99, 0.999$.

#### Solution:
We seek the time step $k = H_{\text{eff}}$ such that:
$$\gamma^k = \frac{1}{e} = e^{-1}$$
Taking the natural logarithm of both sides:
$$\ln(\gamma^k) = \ln(e^{-1}) \implies k \ln(\gamma) = -1 \implies k = \frac{-1}{\ln(\gamma)}$$
Let $\gamma = 1 - \epsilon$, where $\epsilon = 1 - \gamma$. For $\gamma$ close to 1, $\epsilon \ll 1$. The Taylor expansion of $\ln(1 - \epsilon)$ around $\epsilon = 0$ is:
$$\ln(1 - \epsilon) = -\epsilon - \frac{\epsilon^2}{2} - \dots \approx -\epsilon = -(1 - \gamma)$$
Substituting this approximation into our expression for $k$:
$$H_{\text{eff}} \approx \frac{-1}{-(1 - \gamma)} = \frac{1}{1 - \gamma}$$

**Step 2: Numerical Evaluations:**
- For $\gamma = 0.50$: $H_{\text{eff}} \approx \frac{1}{1 - 0.50} = \frac{1}{0.50} = 2 \text{ steps}$
- For $\gamma = 0.90$: $H_{\text{eff}} \approx \frac{1}{1 - 0.90} = \frac{1}{0.10} = 10 \text{ steps}$
- For $\gamma = 0.99$: $H_{\text{eff}} \approx \frac{1}{1 - 0.99} = \frac{1}{0.01} = 100 \text{ steps}$
- For $\gamma = 0.999$: $H_{\text{eff}} \approx \frac{1}{1 - 0.999} = \frac{1}{0.001} = 1,000 \text{ steps}$

---

### Example 1.7: Quantifying Exploration Regret in $\epsilon$-Greedy Policies
An agent faces two actions:
- Optimal Action $A^*$: yields deterministic reward $\mu^* = +10.0$.
- Sub-optimal Action $A_{\text{sub}}$: yields deterministic reward $\mu_{\text{sub}} = +2.0$.

The agent employs an $\epsilon$-greedy exploratory policy:
- With probability $1 - \epsilon$, it selects the greedy action (which it has correctly identified as $A^*$).
- With probability $\epsilon$, it explores by choosing uniformly at random between $\{A^*, A_{\text{sub}}\}$ (each chosen with probability $\frac{\epsilon}{2}$).

1. Derive the expected reward $\mathbb{E}[R]$ per step as a function of $\epsilon$.
2. The **per-step regret** is defined as $\Delta = \mu^* - \mathbb{E}[R]$. Calculate $\Delta$ for $\epsilon = 0.10$ and $\epsilon = 0.01$.
3. Over an episode of $T = 10,000$ steps, how much total reward is surrendered to exploration when $\epsilon = 0.05$?

#### Solution:
**Step 1: Expected Reward Derivation:**
The probability of selecting $A^*$ is:
$$\mathbb{P}(A^*) = (1 - \epsilon) + \frac{\epsilon}{2} = 1 - \frac{\epsilon}{2}$$
The probability of selecting $A_{\text{sub}}$ is:
$$\mathbb{P}(A_{\text{sub}}) = \frac{\epsilon}{2}$$
The expected reward is:
$$\mathbb{E}[R] = \mathbb{P}(A^*) \mu^* + \mathbb{P}(A_{\text{sub}}) \mu_{\text{sub}} = \left(1 - \frac{\epsilon}{2}\right)(10.0) + \left(\frac{\epsilon}{2}\right)(2.0)$$
$$\mathbb{E}[R] = 10.0 - 5.0\epsilon + 1.0\epsilon = 10.0 - 4.0\epsilon$$

**Step 2: Per-Step Regret:**
$$\Delta = \mu^* - \mathbb{E}[R] = 10.0 - (10.0 - 4.0\epsilon) = 4.0\epsilon$$
- For $\epsilon = 0.10$: $\Delta = 4.0(0.10) = 0.40 \text{ reward units/step}$.
- For $\epsilon = 0.01$: $\Delta = 4.0(0.01) = 0.04 \text{ reward units/step}$.

**Step 3: Cumulative Regret over 10,000 steps for $\epsilon = 0.05$:**
$$\Delta_{\text{step}} = 4.0(0.05) = 0.20$$
$$\text{Total Regret} = T \times \Delta_{\text{step}} = 10,000 \times 0.20 = 2,000 \text{ reward units}$$

---

### Example 1.8: Invariance of Optimal Policies Under Positive Affine Reward Transformations
Let an environment emit rewards $R_{t+1}$. Suppose an engineer transforms the reward function using a positive affine mapping:
$$R'_{t+1} = \alpha R_{t+1} + \beta, \quad \text{where } \alpha > 0, \beta \in \mathbb{R}$$
Prove that for any finite-horizon trajectory of fixed length $T$, the ranking between any two candidate trajectories $\tau_A$ and $\tau_B$ is invariant under this transformation.

#### Solution:
Let the return of trajectory $\tau_A = (R_1^A, R_2^A, \dots, R_T^A)$ under the original reward signal be:
$$G(\tau_A) = \sum_{k=0}^{T-1} \gamma^k R_{k+1}^A$$
Similarly, for trajectory $\tau_B$:
$$G(\tau_B) = \sum_{k=0}^{T-1} \gamma^k R_{k+1}^B$$
Assume without loss of generality that trajectory $\tau_A$ is strictly preferred to $\tau_B$: $G(\tau_A) > G(\tau_B)$.

Now evaluate the return $G'(\tau_A)$ under the transformed reward $R'_{k+1} = \alpha R_{k+1} + \beta$:
$$G'(\tau_A) = \sum_{k=0}^{T-1} \gamma^k [\alpha R_{k+1}^A + \beta] = \alpha \sum_{k=0}^{T-1} \gamma^k R_{k+1}^A + \beta \sum_{k=0}^{T-1} \gamma^k = \alpha G(\tau_A) + \beta \frac{1 - \gamma^T}{1 - \gamma}$$
Likewise, for trajectory $\tau_B$:
$$G'(\tau_B) = \alpha G(\tau_B) + \beta \frac{1 - \gamma^T}{1 - \gamma}$$
Subtracting the two transformed returns:
$$G'(\tau_A) - G'(\tau_B) = \alpha [G(\tau_A) - G(\tau_B)]$$
Since $\alpha > 0$ and $G(\tau_A) - G(\tau_B) > 0$, their product is strictly positive:
$$G'(\tau_A) - G'(\tau_B) > 0 \implies G'(\tau_A) > G'(\tau_B)$$
Thus, scaling by any positive constant $\alpha$ and shifting by any constant baseline $\beta$ leaves the preference ordering of trajectories completely unchanged for fixed-horizon tasks.

---

### Example 1.9: The Pitfall of Constant Reward Shifting in Variable-Horizon Tasks
Continuing from Example 1.8, suppose the task has a **variable horizon** (e.g., an agent trying to reach a goal in a maze, where the episode terminates upon reaching the goal).
Let trajectory $\tau_{\text{fast}}$ reach the goal in $T = 2$ steps, earning rewards $R_1 = 0, R_2 = +10.0$.
Let trajectory $\tau_{\text{slow}}$ reach the goal in $T = 5$ steps, earning rewards $R_1 = 0, R_2 = 0, R_3 = 0, R_4 = 0, R_5 = +10.0$.
Let $\gamma = 1.0$.

1. Compute $G(\tau_{\text{fast}})$ and $G(\tau_{\text{slow}})$ under the original rewards.
2. Suppose an engineer adds a positive bonus $\beta = +5.0$ to every step to "encourage the agent." Compute the new returns $G'(\tau_{\text{fast}})$ and $G'(\tau_{\text{slow}})$.
3. Explain why the engineer's intuition backfired catastrophically.

#### Solution:
**Step 1: Original Returns ($\gamma = 1.0$):**
- $G(\tau_{\text{fast}}) = 0 + 10.0 = 10.0$
- $G(\tau_{\text{slow}}) = 0 + 0 + 0 + 0 + 10.0 = 10.0$
(If there is no step penalty, both paths appear equally good at $\gamma = 1$).

**Step 2: Transformed Returns with $\beta = +5.0$ per step:**
- Fast trajectory ($T = 2$ steps):
  $$G'(\tau_{\text{fast}}) = (0 + 5) + (10 + 5) = 5 + 15 = 20.0$$
- Slow trajectory ($T = 5$ steps):
  $$G'(\tau_{\text{slow}}) = (0 + 5) + (0 + 5) + (0 + 5) + (0 + 5) + (10 + 5) = 5 \times 5 + 10 = 35.0$$

**Step 3: Pathological Result:**
Under the modified reward, $G'(\tau_{\text{slow}}) = 35.0 > 20.0 = G'(\tau_{\text{fast}})$. 
By adding a positive constant $\beta > 0$ to every step in a variable-horizon task, living longer earns more rewards. The agent will intentionally stall, wander in circles, or avoid the goal entirely to accumulate the $+5.0$ survival bonus indefinitely. In variable-horizon navigation, per-step rewards must be **negative** (e.g., $-1.0$) to penalize delay and enforce shortest-path behavior.

---

### Example 1.10: Credit Assignment Decay Over Time
Suppose an agent receives an episodic sequence of zero rewards, followed by a terminal reward $R_T = +100.0$ at time $T$.
Under a discount factor $\gamma = 0.95$, calculate the discounted credit $\gamma^{T - t - 1} R_T$ attributed back to:
1. The immediately preceding action $A_{T-1}$ ($k = 0$ steps prior).
2. The action $A_{T-10}$ ($k = 9$ steps prior).
3. The action $A_{T-50}$ ($k = 49$ steps prior).
4. The initial action $A_0$ for an episode of length $T = 100$ ($k = 99$ steps prior).

#### Solution:
The discounted reward arriving at step $T$ evaluated from decision step $t$ is:
$$\text{Credit}(A_t) = \gamma^{T - t - 1} R_T$$
where $k = T - t - 1$ is the temporal delay between action $A_t$ and reward $R_T$.

**Step 1: For $A_{T-1}$ ($k = 0$):**
$$\text{Credit}(A_{T-1}) = (0.95)^0 \times 100.0 = 1.0 \times 100.0 = 100.0$$

**Step 2: For $A_{T-10}$ ($k = 9$):**
$$\text{Credit}(A_{T-10}) = (0.95)^9 \times 100.0 \approx 0.6302 \times 100.0 = 63.02$$

**Step 3: For $A_{T-50}$ ($k = 49$):**
$$\text{Credit}(A_{T-50}) = (0.95)^{49} \times 100.0 \approx 0.0811 \times 100.0 = 8.11$$

**Step 4: For $A_0$ with $T = 100$ ($k = 99$):**
$$\text{Credit}(A_0) = (0.95)^{99} \times 100.0 \approx 0.0062 \times 100.0 = 0.62$$

Notice the exponential decay: an action taken 99 steps earlier receives less than $1\%$ of the credit attributed to the final action, illustrating why temporal credit assignment across long horizons requires sophisticated multi-step bootstrapping and eligibility traces.

---

## 1.7 Solved Exercises

### Exercise 1.1: Horizon Return Calculation
An RL agent produces the following reward trajectory: $R_1 = 3, R_2 = -2, R_3 = 4, R_4 = -1, R_5 = 10$. All subsequent rewards are 0.
Calculate the returns $G_0, G_1, G_2, G_3, G_4$ assuming $\gamma = 0.80$.

#### Solution:
Using backward recursion $G_t = R_{t+1} + \gamma G_{t+1}$:
- $G_4 = R_5 = 10.0$
- $G_3 = R_4 + \gamma G_4 = -1 + 0.80(10.0) = -1 + 8.0 = 7.0$
- $G_2 = R_3 + \gamma G_3 = 4 + 0.80(7.0) = 4 + 5.6 = 9.6$
- $G_1 = R_2 + \gamma G_2 = -2 + 0.80(9.6) = -2 + 7.68 = 5.68$
- $G_0 = R_1 + \gamma G_1 = 3 + 0.80(5.68) = 3 + 4.544 = 7.544$

---

### Exercise 1.2: Minimum Discount Factor for Long-Term Investment
An agent can invest $\$100$ today ($R_1 = -100$) to receive $\$250$ three steps later ($R_4 = +250$, with $R_2 = 0, R_3 = 0$). Alternatively, it can do nothing ($R_{t+1} = 0$ for all $t$). 
Find the minimal value of $\gamma$ such that investing is optimal.

#### Solution:
The return for doing nothing is $G_{\text{idle}} = 0$.
The return for investing is:
$$G_{\text{invest}} = -100 + \gamma(0) + \gamma^2(0) + \gamma^3(250) = -100 + 250 \gamma^3$$
Investing is preferred when $G_{\text{invest}} > 0$:
$$-100 + 250 \gamma^3 > 0 \implies 250 \gamma^3 > 100 \implies \gamma^3 > \frac{100}{250} = 0.40$$
$$\gamma > (0.40)^{1/3} \approx 0.7368$$
The discount factor must exceed approximately $0.737$.

---

### Exercise 1.3: Supervised vs Reinforcement Learning Loss Gradients
Explain mathematically why supervised learning can directly update model parameters $\theta$ using $\nabla_\theta \mathcal{L}(y, f_\theta(x))$, whereas in reinforcement learning, the environment transition dynamics $\mathcal{P}(s' \mid s, a)$ typically block direct backpropagation of reward gradients into the policy parameters $\theta$.

#### Solution:
In supervised learning, the loss function $\mathcal{L}(y, f_\theta(x))$ is a direct, analytically differentiable function of the model output $f_\theta(x)$. The chain rule yields:
$$\frac{\partial \mathcal{L}}{\partial \theta} = \frac{\partial \mathcal{L}}{\partial f_\theta} \frac{\partial f_\theta}{\partial \theta}$$
In reinforcement learning, the cumulative return $G_t$ depends on environmental transitions:
$$\mathbb{E}[G_t] = \int_{\tau} p_\theta(\tau) R(\tau) d\tau$$
where $p_\theta(\tau) = p(s_0) \prod_{t=0}^{T-1} \pi_\theta(a_t \mid s_t) \mathcal{P}(s_{t+1} \mid s_t, a_t)$. 
The transition probability function $\mathcal{P}(s_{t+1} \mid s_t, a_t)$ is part of the physical external world; its internal mechanics are generally unknown, non-differentiable, and cannot be backpropagated through. Hence, RL must rely on sampling, score-function estimators (the REINFORCE trick), or Bellman value approximations.

---

### Exercise 1.4: Asymptotic Horizon Comparison
For what value of $\gamma$ does an agent weigh a reward 100 steps in the future at exactly $10\%$ of its immediate face value?

#### Solution:
We require:
$$\gamma^{100} = 0.10$$
Taking the 100th root:
$$\gamma = (0.10)^{1/100} = (10^{-1})^{0.01} = 10^{-0.01} \approx 0.977237$$
A discount factor of approximately $\gamma \approx 0.977$ retains $10\%$ weight at step 100.

---

### Exercise 1.5: The Deadlock Dilemma in Pure Exploitation
Prove that an agent employing pure greedy action selection ($\epsilon = 0$) in a stationary 2-armed bandit can permanently lock onto a sub-optimal action with non-zero probability if initialized with zero prior knowledge.

#### Solution:
Let Arm 1 have true mean payoff $\mu_1 = +5.0$, and Arm 2 have true mean payoff $\mu_2 = +1.0$.
Suppose the reward distributions have non-zero variance.
On trial 1, the agent explores Arm 1 and, due to stochastic noise, draws a freak negative reward $R_1 = -2.0$. The sample average estimate for Arm 1 is now $Q_1(a_1) = -2.0$.
On trial 2, the agent explores Arm 2 and draws $R_2 = +0.5$. The sample average estimate for Arm 2 is $Q_2(a_2) = +0.5$.
Because $\epsilon = 0$, on all subsequent trials $t \ge 3$, the agent greedily selects $\arg\max_a Q(a) = a_2$ (since $+0.5 > -2.0$). 
Because Arm 1 is never selected again, $Q(a_1)$ is never updated. Arm 2 converges to its true mean $+1.0 > -2.0$. The agent remains permanently locked onto the inferior arm ($a_2$), suffering infinite cumulative regret.

---

### Exercise 1.6: Decoupling Reward from Speed in Autonomous Driving
An engineer trains an autonomous highway vehicle. To encourage reaching the destination quickly, the engineer rewards velocity: $R_{t+1} = v_t$, where $v_t \ge 0$ is the vehicle speed in km/h.
Identify two severe safety failures this reward function creates.

#### Solution:
1. **Speeding and Disregarding Obstacles:** Because reward is monotonically increasing in velocity, the agent will accelerate to maximum engine capacity regardless of red lights, sharp turns, pedestrians, or traffic congestion, as slowing down directly reduces its reward.
2. **Infinite Driving Loop:** The agent will avoid reaching the destination, because reaching the destination ends the episode and cuts off the continuous stream of positive velocity rewards. The agent will prefer circling the highway at maximum speed indefinitely.

---

### Exercise 1.7: Sum of Future Returns Under Constant Rate of Depletion
Suppose an agent receives rewards that decay geometrically over time from the environment itself: $R_{t+1} = R_0 \lambda^t$, where $\lambda \in [0, 1)$ and $R_0 > 0$.
Derive the analytical closed-form formula for the discounted return $G_0$ with discount factor $\gamma \in [0, 1)$.

#### Solution:
$$G_0 = \sum_{t=0}^\infty \gamma^t R_{t+1} = \sum_{t=0}^\infty \gamma^t (R_0 \lambda^t) = R_0 \sum_{t=0}^\infty (\gamma \lambda)^t$$
Since $\gamma \in [0, 1)$ and $\lambda \in [0, 1)$, their product $\gamma \lambda \in [0, 1)$.
The infinite geometric series converges to:
$$\sum_{t=0}^\infty (\gamma \lambda)^t = \frac{1}{1 - \gamma \lambda}$$
Therefore:
$$G_0 = \frac{R_0}{1 - \gamma \lambda}$$

---

### Exercise 1.8: Normalizing Returns to a Unit Interval
In deep reinforcement learning, neural networks train more stably when target values remain bounded.
Given a continuous task with per-step rewards bounded by $R_{t+1} \in [R_{\min}, R_{\max}]$ and discount factor $\gamma \in [0, 1)$, derive the scalar multiplier $k$ such that the discounted return of any constant reward stream lies in $[R_{\min}, R_{\max}]$.

#### Solution:
For a constant reward $R$, the infinite discounted return is:
$$G = \frac{R}{1 - \gamma}$$
To normalize $G$ back to the original scale of $R$, multiply the return by:
$$k = 1 - \gamma$$
Then:
$$G_{\text{norm}} = (1 - \gamma) G = (1 - \gamma) \frac{R}{1 - \gamma} = R$$
This $(1 - \gamma)$ multiplier scales the infinite sum back to the original per-step reward bounds $[R_{\min}, R_{\max}]$, preventing target explosion as $\gamma \to 1$.

---

### Exercise 1.9: Verification of Thorndike's Associative Strength
Let the associative strength between state $s$ and action $a$ be represented by numerical preference $H(s, a)$. Thorndike's Law of Effect is modeled by updating:
$$H(s_t, a_t) \leftarrow H(s_t, a_t) + \alpha (R_{t+1} - \bar{R})$$
where $\bar{R}$ is the average baseline reward and $\alpha = 0.1$.
If $H(s, a) = 2.0$, $\bar{R} = 1.0$, and the agent takes action $a$ and receives $R = 5.0$, compute the updated preference $H'(s, a)$. If the agent instead received $R = 0.0$, compute $H''(s, a)$.

#### Solution:
- Case 1: $R = 5.0$
  $$H'(s, a) = 2.0 + 0.1(5.0 - 1.0) = 2.0 + 0.1(4.0) = 2.0 + 0.4 = 2.4$$
  The connection is strengthened.
- Case 2: $R = 0.0$
  $$H''(s, a) = 2.0 + 0.1(0.0 - 1.0) = 2.0 + 0.1(-1.0) = 2.0 - 0.1 = 1.9$$
  The connection is weakened.

---

### Exercise 1.10: Credit Assignment in Delayed-Feedback Environments
An autonomous trade execution agent executes 10 trades per hour for 8 hours (80 actions). Profit/Loss is settled only at the end of the trading day ($t = 80$).
Contrast how a classical Monte Carlo approach and a Temporal Difference (TD) approach handle updating the value of the very first trade executed at $t = 1$.

#### Solution:
- **Monte Carlo Approach:** Cannot update the value of trade 1 until the entire trading day concludes at $t = 80$. Once $R_{80}$ is observed, it computes $G_1 = \gamma^{79} R_{80}$ and updates $V(S_1)$ directly against this sample return. This is unbiased but exhibits high variance and zero online learning during the day.
- **Temporal Difference Approach:** Updates $V(S_1)$ at step $t = 2$ using the intermediate prediction: $V(S_1) \leftarrow V(S_1) + \alpha [R_2 + \gamma V(S_2) - V(S_1)]$. By bootstrapping off of $V(S_2)$, credit assignment propagates incrementally backward step-by-step, allowing the agent to learn in real time without waiting for end-of-day settlement.


# Chapter 2: The Markov Property and the Formal Markov Decision Process (MDP)

---

## 2.1 The Philosophy of Memoryless Dynamics: Andrei Markov's Legacy

In 1906, Russian mathematician Andrei Andreyevich Markov was engaged in an intense philosophical and theological dispute with Pavel Nekrasov. Nekrasov claimed that the Law of Large Numbers and statistical independence were mathematical proofs of human free will. To refute Nekrasov, Markov set out to prove that statistical laws of convergence do not require independenceâ€”they hold even for sequences of random variables that are tightly bound to one another by causal chains.

To demonstrate this empirically, Markov spent months meticulously analyzing the first 20,000 letters of Alexander Pushkinâ€™s poetic masterpiece *Eugene Onegin*. He discovered that the probability of encountering a vowel at letter index $t+1$ depended heavily on whether letter $t$ was a vowel or a consonant, but *did not depend on the letters prior to $t$*.

```
                                      Pushkin's Vowel-Consonant Chain:
                                             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                      0.128  â”‚               â”‚ 0.663
                                      â”Œâ”€â”€â”€â”€â”€â”€â”¤     VOWEL     â”œâ”€â”€â”€â”€â”€â”€â”
                                      â”‚      â”‚               â”‚      â”‚
                                      â–¼      â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜      â–¼
                                   (Loop)            â”‚          (To Cons)
                                                     â”‚ 0.872
                                            0.337    â”‚
                                          (To Vowel) â”‚
                                      â–²              â–¼              â–²
                                      â”‚      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”‚
                                      â”‚      â”‚               â”‚      â”‚
                                      â””â”€â”€â”€â”€â”€â”€â”¤   CONSONANT   â”œâ”€â”€â”€â”€â”€â”€â”˜
                                             â”‚               â”‚
                                             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                   0.663
```

This gave birth to the **Markov Property**: the idea that a dynamical process can possess memory of its immediate configuration without requiring knowledge of its entire historical trajectory.

---

## 2.2 The Markov Property Defined from First Principles

Consider a general discrete-time stochastic process generating a history of states and actions:
$$H_t = (S_0, A_0, R_1, S_1, A_1, R_2, \dots, S_{t-1}, A_{t-1}, R_t, S_t)$$

In the most general non-Markovian universe, the probability of transitioning to state $s'$ and receiving reward $r$ at time $t+1$ depends upon the entire historical tapestry of every thought, action, and event that has occurred since the beginning of time ($t = 0$):
$$\mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t, S_{t-1}, A_{t-1}, \dots, S_0, A_0)$$

Tracking such an infinite-history distribution is computationally intractable. A state representation is defined to be **Markov** if and only if:

$$\mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t, S_{t-1}, A_{t-1}, \dots, S_0, A_0) = \mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t, A_t)$$

for all $s' \in \mathcal{S}$, $r \in \mathcal{R}$, and all historical sequences $(S_0, A_0, \dots, S_t, A_t)$.

```
   NON-MARKOVIAN UNIVERSE (History-Dependent)            MARKOVIAN UNIVERSE (Memoryless)
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ S_0 â”€â”€â–º S_1 â”€â”€â–º S_2 â”€â”€â–º ... â”€â”€â–º S_t     â”‚         â”‚                                         â”‚
  â”‚  \       \       \             /        â”‚         â”‚                                         â”‚
  â”‚   â”€â”€â”€â”€â”€â”€â”€ \ â”€â”€â”€â”€â”€â”€ \ â”€â”€â”€â”€â”€â”€â”€â”€ /         â”‚         â”‚                    S_t                  â”‚
  â”‚            â–¼        â–¼        â–¼          â”‚         â”‚                     â”‚                   â”‚
  â”‚               [ S_{t+1} ]               â”‚         â”‚                     â–¼                   â”‚
  â”‚                                         â”‚         â”‚                [ S_{t+1} ]              â”‚
  â”‚ All historical states causally dictate  â”‚         â”‚ The present state S_t is a sufficient   â”‚
  â”‚ the future distribution.                â”‚         â”‚ statistic for the future.               â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The State as a Sufficient Statistic
In statistical physics and information theory, the Markov property means that the current state $S_t$ is a **sufficient statistic** for the future. Formally:
$$I(S_{t+1}, R_{t+1} ; H_{t-1} \mid S_t, A_t) = 0$$
The conditional mutual information between the future and the past, conditioned on the present state and action, is identically zero. Once the present state $S_t$ is known, the past history $H_{t-1}$ provides zero additional predictive information.

### What Happens When an Environment Appears Non-Markovian?
Consider a cannonball fired into the air. If the state $S_t$ is defined solely by its spatial position $(x, y)$, the environment is non-Markovian: knowing the position alone does not tell you where the ball will be at $t+1$, because you do not know its direction or velocity. 

However, if we enrich the state representation to include the first derivatives:
$$S_t = (x, y, \dot{x}, \dot{y})$$
then according to Newtonian mechanics, the future trajectory is fully determined by the current state and applied forces. 
> [!NOTE]
> Any finite-history non-Markovian process of order $k$ can be converted into a first-order Markov process by **state augmentation**: defining an augmented state vector $\tilde{S}_t \doteq (S_t, S_{t-1}, \dots, S_{t-k+1})$.

---

## 2.3 The Four-Tier Stochastic Process Hierarchy

To understand the Markov Decision Process, we trace the progression of stochastic systems through four progressively expressive mathematical formalisms:

```
                                 STOCHASTIC PROCESS HIERARCHY
                                               â”‚
                                               â–¼
                                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                â”‚       1. MARKOV CHAIN       â”‚  Passive, No Rewards
                                â”‚      (S, P)                 â”‚  Pure autonomous dynamics
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                               â”‚  Add Reward Function R
                                               â–¼  and Discount Factor Î³
                                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                â”‚   2. MARKOV REWARD PROCESS  â”‚  Passive, Evaluated
                                â”‚      (S, P, R, Î³)           â”‚  Accumulates value
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                               â”‚  Add Action Set A
                                               â–¼  and Active Agency
                                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                â”‚ 3. MARKOV DECISION PROCESS  â”‚  Active, Fully Observable
                                â”‚      (S, A, P, R, Î³)        â”‚  Closed-loop control
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                               â”‚  Add Partial Observability
                                               â–¼  (Î©, O) and Belief States
                                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                â”‚          4. POMDP           â”‚  Active, Partially Observable
                                â”‚   (S, A, P, R, Î©, O, Î³)     â”‚  Incomplete information
                                â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 1. Markov Chain (Discrete Markov Process)
A Markov Chain is a memoryless random process defined by the 2-tuple:
$$\mathcal{M}_{\text{chain}} = (\mathcal{S}, \mathcal{P})$$
- $\mathcal{S}$ is a countable set of states $\{s_1, s_2, \dots, s_N\}$.
- $\mathcal{P}$ is a state-transition probability matrix $\mathbf{P} \in \mathbb{R}^{N \times N}$, where each entry represents the conditional probability of jumping from state $s$ to state $s'$:
  $$\mathcal{P}_{s, s'} = \mathbb{P}(S_{t+1} = s' \mid S_t = s)$$
Each row of $\mathbf{P}$ is a valid probability distribution (a stochastic matrix):
$$\sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'} = 1, \quad \forall s \in \mathcal{S}, \quad \text{and } \mathcal{P}_{s, s'} \ge 0$$

### 2. Markov Reward Process (MRP)
A Markov Reward Process augments a Markov Chain with a numerical evaluation of states, defined by the 4-tuple:
$$\mathcal{M}_{\text{MRP}} = (\mathcal{S}, \mathcal{P}, \mathcal{R}, \gamma)$$
- $\mathcal{S}$ and $\mathcal{P}$ are as defined above.
- $\mathcal{R}$ is a reward function mapping each state to an expected reward:
  $$\mathcal{R}_s \doteq \mathbb{E}[R_{t+1} \mid S_t = s]$$
- $\gamma \in [0, 1)$ is the temporal discount factor.

In an MRP, the system remains passive (there are no decisions to make), but we can now calculate the **Value** of being in state $s$: the expected discounted return from that state onward.

### 3. Markov Decision Process (MDP)
A Markov Decision Process introduces **agency**: an external decision-maker that chooses actions to influence state transitions and harvest rewards. It is formalized as a 5-tuple:
$$\mathcal{M}_{\text{MDP}} = (\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$$
- $\mathcal{S}$ is the set of all valid states.
- $\mathcal{A}$ is the set of all valid actions (or $\mathcal{A}(s)$ for state-dependent admissible actions).
- $\mathcal{P}$ is the transition probability kernel:
  $$\mathcal{P}_{s, s'}^a \doteq \mathbb{P}(S_{t+1} = s' \mid S_t = s, A_t = a)$$
- $\mathcal{R}$ is the reward function:
  $$\mathcal{R}_s^a \doteq \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a]$$
- $\gamma \in [0, 1)$ is the discount factor.

### 4. Partially Observable Markov Decision Process (POMDP)
In the real world, an agent rarely perceives the true underlying environmental state $s \in \mathcal{S}$ directly. A robotic camera produces pixels, not Cartesian coordinates; a trader sees public order books, not private institutional order flows. A POMDP is defined by the 7-tuple:
$$\mathcal{M}_{\text{POMDP}} = (\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \Omega, \mathcal{O}, \gamma)$$
- $\Omega$ is a finite set of observations $o \in \Omega$.
- $\mathcal{O}$ is the observation probability distribution:
  $$\mathcal{O}(o \mid s', a) \doteq \mathbb{P}(O_{t+1} = o \mid S_{t+1} = s', A_t = a)$$
Because the agent cannot observe $S_t$, it maintains an internal probability distribution over all possible states, called the **Belief State** $b \in \Delta(\mathcal{S})$, where $b(s) = \mathbb{P}(S_t = s \mid H_t)$. The belief state is updated via Bayes' rule:
$$b'(s') = \frac{\mathcal{O}(o \mid s', a) \sum_{s \in \mathcal{S}} \mathcal{P}_{s, s'}^a b(s)}{\sum_{s'' \in \mathcal{S}} \mathcal{O}(o \mid s'', a) \sum_{s \in \mathcal{S}} \mathcal{P}_{s, s''}^a b(s)}$$
Remarkably, a POMDP can be solved as a fully observable MDP over the continuous, infinite-dimensional space of belief states $\Delta(\mathcal{S})$.

---

## 2.4 Mathematical Anatomy of Finite MDPs

In this treatise, we focus primarily on **Finite MDPs**, where the state space $\mathcal{S}$, action space $\mathcal{A}$, and reward set $\mathcal{R}$ are finite sets.

```
                      MDP STATE-ACTION TRANSITION GRAPH
                                     (s)  State Node
                                    /   \
                                   /     \
                       Action a_1 â—       â— Action a_2 (Action Nodes)
                                 / \     / \
                     p(s_1,r_1) /   \   /   \ p(s_2,r_2)
                               â–¼     â–¼ â–¼     â–¼
                             (s_1)   (s_2)   (s_3)  Next State Nodes
```

### The Joint Transition-Reward Function $p(s', r \mid s, a)$
The most fundamental, complete description of a finite MDP's dynamics is the four-argument joint transition probability function:
$$p(s', r \mid s, a) \doteq \mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t = s, A_t = a)$$

Because $p(s', r \mid s, a)$ is a conditional probability distribution over the discrete product space $\mathcal{S} \times \mathcal{R}$, it satisfies the law of total probability:
$$\sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) = 1, \quad \forall s \in \mathcal{S}, a \in \mathcal{A}(s)$$
and non-negativity:
$$p(s', r \mid s, a) \ge 0, \quad \forall s, s' \in \mathcal{S}, a \in \mathcal{A}(s), r \in \mathcal{R}$$

### Marginalizing the Joint Distribution
All other standard MDP functions are derived directly by marginalizing $p(s', r \mid s, a)$:

1. **State-Transition Probability Kernel $\mathcal{P}_{s, s'}^a$:**
   The probability of landing in state $s'$ given that action $a$ was taken in state $s$, summing over all possible reward values:
   $$\mathcal{P}_{s, s'}^a \doteq \mathbb{P}(S_{t+1} = s' \mid S_t = s, A_t = a) = \sum_{r \in \mathcal{R}} p(s', r \mid s, a)$$

2. **Expected State-Action Reward Function $r(s, a)$:**
   The expected reward received when executing action $a$ in state $s$:
   $$r(s, a) \doteq \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a] = \sum_{r \in \mathcal{R}} r \sum_{s' \in \mathcal{S}} p(s', r \mid s, a) = \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} r \cdot p(s', r \mid s, a)$$

3. **Expected State-Action-Next-State Reward Function $r(s, a, s')$:**
   The expected reward conditioned not only on state $s$ and action $a$, but also on the realized destination state $s'$:
   $$r(s, a, s') \doteq \mathbb{E}[R_{t+1} \mid S_t = s, A_t = a, S_{t+1} = s'] = \sum_{r \in \mathcal{R}} r \cdot \frac{p(s', r \mid s, a)}{\mathcal{P}_{s, s'}^a}$$

By the definition of conditional expectation:
$$r(s, a) = \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a r(s, a, s')$$

---

## 2.5 Worked Examples: Formal MDP Derivations

### Example 2.1: Transition Matrix Stochasticity Verification
Consider a 3-state system $\mathcal{S} = \{s_1, s_2, s_3\}$ with candidate transition matrix:
$$\mathbf{P} = \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.0 & 0.6 & 0.4 \\ 0.5 & 0.5 & 0.0 \end{bmatrix}$$
1. Verify whether $\mathbf{P}$ is a valid stochastic matrix.
2. Given an initial state distribution $\mathbf{p}_0 = [1.0, 0.0, 0.0]^T$, calculate the state probability distribution after two time steps: $\mathbf{p}_2 = (\mathbf{P}^T)^2 \mathbf{p}_0$.

#### Solution:
**Step 1: Check Row Sums:**
- Row 1: $0.7 + 0.2 + 0.1 = 1.0 \quad \checkmark$
- Row 2: $0.0 + 0.6 + 0.4 = 1.0 \quad \checkmark$
- Row 3: $0.5 + 0.5 + 0.0 = 1.0 \quad \checkmark$
All elements are non-negative ($\mathcal{P}_{ij} \ge 0$) and every row sums to 1. Thus, $\mathbf{P}$ is a valid stochastic matrix.

**Step 2: Distribution Evolution:**
Let row vector $\boldsymbol{\mu}_t$ represent the distribution: $\boldsymbol{\mu}_{t+1} = \boldsymbol{\mu}_t \mathbf{P}$.
At $t = 0$: $\boldsymbol{\mu}_0 = [1.0, 0.0, 0.0]$.
At $t = 1$:
$$\boldsymbol{\mu}_1 = \boldsymbol{\mu}_0 \mathbf{P} = [1.0, 0.0, 0.0] \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.0 & 0.6 & 0.4 \\ 0.5 & 0.5 & 0.0 \end{bmatrix} = [0.7, 0.2, 0.1]$$
At $t = 2$:
$$\boldsymbol{\mu}_2 = \boldsymbol{\mu}_1 \mathbf{P} = [0.7, 0.2, 0.1] \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.0 & 0.6 & 0.4 \\ 0.5 & 0.5 & 0.0 \end{bmatrix}$$
- $\mu_2(s_1) = 0.7(0.7) + 0.2(0.0) + 0.1(0.5) = 0.49 + 0.0 + 0.05 = 0.54$
- $\mu_2(s_2) = 0.7(0.2) + 0.2(0.6) + 0.1(0.5) = 0.14 + 0.12 + 0.05 = 0.31$
- $\mu_2(s_3) = 0.7(0.1) + 0.2(0.4) + 0.1(0.0) = 0.07 + 0.08 + 0.00 = 0.15$
Check sum: $0.54 + 0.31 + 0.15 = 1.00 \quad \checkmark$.

---

### Example 2.2: Stationary Distribution of an Ergodic Markov Chain
Using the transition matrix from Example 2.1:
$$\mathbf{P} = \begin{bmatrix} 0.7 & 0.2 & 0.1 \\ 0.0 & 0.6 & 0.4 \\ 0.5 & 0.5 & 0.0 \end{bmatrix}$$
Compute the exact stationary distribution $\boldsymbol{\pi} = [\pi_1, \pi_2, \pi_3]$ satisfying $\boldsymbol{\pi} \mathbf{P} = \boldsymbol{\pi}$ and $\sum_i \pi_i = 1$.

#### Solution:
The system $\boldsymbol{\pi} (\mathbf{P} - \mathbf{I}) = \mathbf{0}$ yields:
$$\begin{aligned}
-0.3 \pi_1 + 0.5 \pi_3 &= 0 &\implies \pi_3 = \frac{0.3}{0.5} \pi_1 = 0.6 \pi_1 \\
0.2 \pi_1 - 0.4 \pi_2 + 0.5 \pi_3 &= 0 \\
0.1 \pi_1 + 0.4 \pi_2 - 1.0 \pi_3 &= 0
\end{aligned}$$
Substitute $\pi_3 = 0.6 \pi_1$ into the second equation:
$$0.2 \pi_1 - 0.4 \pi_2 + 0.5(0.6 \pi_1) = 0 \implies 0.2 \pi_1 - 0.4 \pi_2 + 0.3 \pi_1 = 0$$
$$0.5 \pi_1 = 0.4 \pi_2 \implies \pi_2 = \frac{0.5}{0.4} \pi_1 = 1.25 \pi_1$$

Now apply the normalization condition $\pi_1 + \pi_2 + \pi_3 = 1$:
$$\pi_1 + 1.25 \pi_1 + 0.6 \pi_1 = 1 \implies 2.85 \pi_1 = 1 \implies \pi_1 = \frac{1}{2.85} = \frac{20}{57} \approx 0.35088$$
$$\pi_2 = 1.25 \times \frac{20}{57} = \frac{25}{57} \approx 0.43860$$
$$\pi_3 = 0.6 \times \frac{20}{57} = \frac{12}{57} \approx 0.21053$$
Sum check: $\frac{20 + 25 + 12}{57} = \frac{57}{57} = 1.0 \quad \checkmark$.

---

### Example 2.3: Marginalizing Joint Dynamics $p(s', r \mid s, a)$
A drone operates in an MDP with states $\mathcal{S} = \{\text{Low}, \text{High}\}$ and actions $\mathcal{A} = \{\text{Ascend}, \text{Hover}\}$.
The joint dynamics $p(s', r \mid s = \text{Low}, a = \text{Ascend})$ are specified in the following table:

| Next State $s'$ | Reward $r$ | Probability $p(s', r \mid \text{Low}, \text{Ascend})$ |
| :---: | :---: | :---: |
| High | $+10.0$ | $0.70$ |
| Low | $-5.0$ | $0.20$ |
| Low | $-1.0$ | $0.10$ |

1. Verify that this joint distribution is valid.
2. Calculate the marginal transition probabilities $\mathcal{P}_{\text{Low}, \text{High}}^{\text{Ascend}}$ and $\mathcal{P}_{\text{Low}, \text{Low}}^{\text{Ascend}}$.
3. Compute the expected reward $r(\text{Low}, \text{Ascend})$.
4. Compute the expected reward conditioned on destination: $r(\text{Low}, \text{Ascend}, \text{Low})$.

#### Solution:
**Step 1: Check Total Probability:**
$$\sum_{s', r} p(s', r \mid \text{Low}, \text{Ascend}) = 0.70 + 0.20 + 0.10 = 1.00 \quad \checkmark$$

**Step 2: Marginal Transition Probabilities:**
$$\mathcal{P}_{\text{Low}, \text{High}}^{\text{Ascend}} = \sum_r p(\text{High}, r \mid \text{Low}, \text{Ascend}) = 0.70$$
$$\mathcal{P}_{\text{Low}, \text{Low}}^{\text{Ascend}} = \sum_r p(\text{Low}, r \mid \text{Low}, \text{Ascend}) = 0.20 + 0.10 = 0.30$$
Notice: $0.70 + 0.30 = 1.00 \quad \checkmark$.

**Step 3: Expected Reward $r(\text{Low}, \text{Ascend})$:**
$$r(\text{Low}, \text{Ascend}) = \sum_{s', r} r \cdot p(s', r \mid \text{Low}, \text{Ascend})$$
$$r(\text{Low}, \text{Ascend}) = (+10.0)(0.70) + (-5.0)(0.20) + (-1.0)(0.10) = 7.0 - 1.0 - 0.10 = +5.90$$

**Step 4: Destination-Conditioned Expected Reward $r(\text{Low}, \text{Ascend}, \text{Low})$:**
$$r(\text{Low}, \text{Ascend}, \text{Low}) = \sum_r r \frac{p(\text{Low}, r \mid \text{Low}, \text{Ascend})}{\mathcal{P}_{\text{Low}, \text{Low}}^{\text{Ascend}}}$$
$$r(\text{Low}, \text{Ascend}, \text{Low}) = \frac{(-5.0)(0.20) + (-1.0)(0.10)}{0.30} = \frac{-1.0 - 0.10}{0.30} = \frac{-1.10}{0.30} = -3.667$$

---

### Example 2.4: Recycling Robot MDP (Sutton & Barto Classic)
A mobile recycling robot searches for soda cans. At each step, its battery level is in state $\mathcal{S} = \{\text{high}, \text{low}\}$.
- In state $\text{high}$, it can choose $a \in \{\text{search}, \text{wait}\}$.
  - If it searches: it stays $\text{high}$ with probability $\alpha = 0.8$, drops to $\text{low}$ with probability $1 - \alpha = 0.2$. It gathers cans: expected reward $r_{\text{search}} = 4.0$.
  - If it waits: it stays $\text{high}$ with probability $1.0$. Expected reward $r_{\text{wait}} = 1.0$.
- In state $\text{low}$, it can choose $a \in \{\text{search}, \text{wait}, \text{recharge}\}$.
  - If it searches: it stays $\text{low}$ with probability $\beta = 0.6$, dies (depletes entirely) with probability $1 - \beta = 0.4$. If it dies, humans rescue and recharge it to $\text{high}$, inflicting rescue penalty $-3.0$. Cans collected yield expected reward $r(low, search) = \beta(4.0) + (1-\beta)(-3.0) = 0.6(4) + 0.4(-3) = 2.4 - 1.2 = +1.2$.
  - If it waits: stays $\text{low}$ with probability $1.0$, reward $r_{\text{wait}} = 1.0$.
  - If it recharges: transitions to $\text{high}$ with probability $1.0$, reward $r_{\text{recharge}} = 0.0$.

Construct the complete state transition matrices $\mathbf{P}^{\text{search}}, \mathbf{P}^{\text{wait}}, \mathbf{P}^{\text{recharge}}$ and reward vectors $\mathbf{r}^{\text{search}}, \mathbf{r}^{\text{wait}}, \mathbf{r}^{\text{recharge}}$.

#### Solution:
State ordering: $[s_1 = \text{high}, s_2 = \text{low}]$.

1. **For Action $a = \text{search}$:**
   $$\mathbf{P}^{\text{search}} = \begin{bmatrix} \mathcal{P}_{\text{high},\text{high}}^{\text{search}} & \mathcal{P}_{\text{high},\text{low}}^{\text{search}} \\ \mathcal{P}_{\text{low},\text{high}}^{\text{search}} & \mathcal{P}_{\text{low},\text{low}}^{\text{search}} \end{bmatrix} = \begin{bmatrix} \alpha & 1 - \alpha \\ 1 - \beta & \beta \end{bmatrix} = \begin{bmatrix} 0.8 & 0.2 \\ 0.4 & 0.6 \end{bmatrix}$$
   $$\mathbf{r}^{\text{search}} = \begin{bmatrix} 4.0 \\ 1.2 \end{bmatrix}$$

2. **For Action $a = \text{wait}$:**
   $$\mathbf{P}^{\text{wait}} = \begin{bmatrix} 1.0 & 0.0 \\ 0.0 & 1.0 \end{bmatrix}, \quad \mathbf{r}^{\text{wait}} = \begin{bmatrix} 1.0 \\ 1.0 \end{bmatrix}$$

3. **For Action $a = \text{recharge}$ (only admissible in $\text{low}$; defined for $\text{high}$ as identity):**
   $$\mathbf{P}^{\text{recharge}} = \begin{bmatrix} 1.0 & 0.0 \\ 1.0 & 0.0 \end{bmatrix}, \quad \mathbf{r}^{\text{recharge}} = \begin{bmatrix} 0.0 \\ 0.0 \end{bmatrix}$$

---

### Example 2.5: Transforming a Non-Markovian Process via State Augmentation
A machine can be $\text{Operational}$ or $\text{Broken}$. Its failure probability depends on its age:
- In its 1st hour of operation: failure probability is $0.1$.
- In its 2nd hour: failure probability is $0.3$.
- In its 3rd hour or older: failure probability is $0.8$.
Once broken, it is repaired in 1 hour and returns to 1st hour operation.

1. Show why the binary state space $\mathcal{S}_{\text{naive}} = \{\text{Operational}, \text{Broken}\}$ is non-Markovian.
2. Define an augmented Markovian state space and write the corresponding transition matrix.

#### Solution:
**Step 1: Non-Markovian Failure:**
Under $\mathcal{S}_{\text{naive}}$, if $S_t = \text{Operational}$, we cannot determine $\mathbb{P}(S_{t+1} = \text{Broken} \mid S_t)$ without checking how many hours the machine has been running in the past. Thus, $\mathbb{P}(S_{t+1} \mid S_t, S_{t-1}, \dots) \neq \mathbb{P}(S_{t+1} \mid S_t)$.

**Step 2: State Augmentation:**
Incorporate machine age into the state definition:
$$\mathcal{S}_{\text{augmented}} = \{O_1, O_2, O_{\ge 3}, B\}$$
where $O_k$ denotes "Operational, operating for $k$ hours", and $B$ denotes "Broken".

The transition matrix over $[O_1, O_2, O_{\ge 3}, B]$ is:
$$\mathbf{P} = \begin{bmatrix}
0 & 0.9 & 0 & 0.1 \\
0 & 0 & 0.7 & 0.3 \\
0 & 0 & 0.2 & 0.8 \\
1.0 & 0 & 0 & 0
\end{bmatrix}$$
Every row sums to 1. The augmented state encodes all historical context, restoring the first-order Markov property.

---

### Example 2.6: POMDP Belief State Update
A tiger resides behind one of two doors: Left ($S = L$) or Right ($S = R$).
The true state is static: transition probabilities are identity.
An agent has prior belief: $b(L) = 0.5, b(R) = 0.5$.
The agent listens ($a = \text{listen}$). 
The observation model $\mathcal{O}(o \mid s, a)$ is noisy:
- $\mathbb{P}(\text{hear Left} \mid S = L) = 0.85, \quad \mathbb{P}(\text{hear Right} \mid S = L) = 0.15$
- $\mathbb{P}(\text{hear Left} \mid S = R) = 0.15, \quad \mathbb{P}(\text{hear Right} \mid S = R) = 0.85$

Suppose the agent executes action $\text{listen}$ and observes $O = \text{hear Left}$. 
Calculate the updated belief state $b'(L)$ and $b'(R)$ using Bayes' rule.

#### Solution:
Bayes' formula for static state:
$$b'(L) = \frac{\mathbb{P}(O = \text{hear Left} \mid S = L) b(L)}{\mathbb{P}(O = \text{hear Left})}$$
Denominator:
$$\begin{aligned}
\mathbb{P}(O = \text{hear Left}) &= \mathbb{P}(O = \text{hear Left} \mid L) b(L) + \mathbb{P}(O = \text{hear Left} \mid R) b(R) \\
&= (0.85)(0.50) + (0.15)(0.50) = 0.425 + 0.075 = 0.50
\end{aligned}$$
Numerator for $L$:
$$\mathbb{P}(O = \text{hear Left} \mid L) b(L) = (0.85)(0.50) = 0.425$$
Updated belief:
$$b'(L) = \frac{0.425}{0.50} = 0.85, \quad b'(R) = 1 - 0.85 = 0.15$$
A single sensory observation shifts the belief state from complete uncertainty ($0.50$) to high confidence ($0.85$).

---

### Example 2.7: Calculating Absorbing State Probabilities
An episodic MDP has states $\mathcal{S} = \{s_1, s_2, s_T\}$, where $s_T$ is an absorbing terminal state:
$$\mathbf{P} = \begin{bmatrix} 0.5 & 0.3 & 0.2 \\ 0.1 & 0.6 & 0.3 \\ 0.0 & 0.0 & 1.0 \end{bmatrix}$$
1. Partition $\mathbf{P}$ into fundamental sub-matrices $\mathbf{Q}$ (transient-to-transient) and $\mathbf{R}_{\text{abs}}$ (transient-to-absorbing).
2. Compute the Fundamental Matrix $\mathbf{N} = (\mathbf{I} - \mathbf{Q})^{-1}$.
3. What is the expected number of steps to absorption starting from state $s_1$?

#### Solution:
**Step 1: Partitioning:**
$$\mathbf{Q} = \begin{bmatrix} 0.5 & 0.3 \\ 0.1 & 0.6 \end{bmatrix}, \quad \mathbf{R}_{\text{abs}} = \begin{bmatrix} 0.2 \\ 0.3 \end{bmatrix}$$

**Step 2: Fundamental Matrix $\mathbf{N}$:**
$$\mathbf{I} - \mathbf{Q} = \begin{bmatrix} 1 - 0.5 & -0.3 \\ -0.1 & 1 - 0.6 \end{bmatrix} = \begin{bmatrix} 0.5 & -0.3 \\ -0.1 & 0.4 \end{bmatrix}$$
Determinant $\det(\mathbf{I} - \mathbf{Q}) = (0.5)(0.4) - (-0.3)(-0.1) = 0.20 - 0.03 = 0.17$.
Matrix inverse:
$$\mathbf{N} = (\mathbf{I} - \mathbf{Q})^{-1} = \frac{1}{0.17} \begin{bmatrix} 0.4 & 0.3 \\ 0.1 & 0.5 \end{bmatrix} \approx \begin{bmatrix} 2.3529 & 1.7647 \\ 0.5882 & 2.9412 \end{bmatrix}$$

**Step 3: Expected Time to Absorption:**
The vector of expected steps to absorption is $\mathbf{t} = \mathbf{N} \mathbf{1}$:
$$t_1 = 2.3529 + 1.7647 = 4.1176 \text{ steps}$$
$$t_2 = 0.5882 + 2.9412 = 3.5294 \text{ steps}$$
Starting from $s_1$, the expected time until reaching terminal state $s_T$ is $\approx 4.12$ steps.

---

### Example 2.8: Joint Action Spaces in Multi-Agent MDPs
Suppose two autonomous rovers $R_1$ and $R_2$ coordinate on a grid. Each rover independently has action set $\mathcal{A}_i = \{\text{North}, \text{South}, \text{East}, \text{West}, \text{Stay}\}$.
1. What is the cardinality of the joint action space $\boldsymbol{\mathcal{A}} = \mathcal{A}_1 \times \mathcal{A}_2$?
2. If there are $M = 5$ rovers, how many joint actions exist?
3. What implications does this exponential growth have for centralized MDP solvers?

#### Solution:
**Step 1: 2-Rover Joint Action Space:**
$$|\boldsymbol{\mathcal{A}}| = |\mathcal{A}_1| \times |\mathcal{A}_2| = 5 \times 5 = 25 \text{ joint actions}$$

**Step 2: 5-Rover Joint Action Space:**
$$|\boldsymbol{\mathcal{A}}| = 5^5 = 3,125 \text{ joint actions}$$

**Step 3: Implications:**
The joint action space grows exponentially with the number of agents: $|\boldsymbol{\mathcal{A}}| = |\mathcal{A}|^M$. In centralized dynamic programming, calculating $\max_{\mathbf{a} \in \boldsymbol{\mathcal{A}}} Q(s, \mathbf{a})$ requires evaluating $3,125$ candidate joint actions per state at every sweep. For $M = 10$, $|\boldsymbol{\mathcal{A}}| = 5^{10} \approx 9.76 \times 10^6$, rendering centralized tabular Bellman optimization intractable and necessitating decentralized or factorized value architectures.

---

### Example 2.9: Epistemic vs Aleatoric Uncertainty in MDP Transitions
An automated surgery robot makes a delicate incision:
- Option A: Standard laser incision. Succeeds with probability $p = 0.999$, fails with probability $0.001$.
- Option B: Experimental acoustic pulse. The true physical success rate $p$ is unknown, but drawn from a prior distribution $\text{Beta}(1, 1) = \text{Uniform}(0, 1)$.

Differentiate between the aleatoric and epistemic uncertainty in this MDP, and explain how an agent resolves each.

#### Solution:
- **Aleatoric Uncertainty (Statistical / Physical Noise):** In Option A, the physical system has an inherent failure rate of $0.001$ caused by thermal fluctuations. Even with infinite data, this variance cannot be eliminated. The agent cannot "learn away" this risk; it must plan policies that are robust to stochastic outcomes.
- **Epistemic Uncertainty (Lack of Knowledge):** In Option B, the agent does not know $p$. This uncertainty is not an intrinsic property of the physics; it is a limitation of the agent's current knowledge base. By taking action B repeatedly (exploration), the agent collects empirical samples, shrinking the posterior variance of $\text{Beta}(\alpha, \beta)$ toward zero via the Law of Large Numbers.

---

### Example 2.10: State Redundancy and Minimal Markov State Representation
An agent navigates a 1D line: position $x \in \mathbb{Z}$. At step $t$, its sensor suite reports:
$$\mathbf{s}_t = (x_t, \text{time of day } T_t, \text{ambient temperature } \theta_t, \text{serial number of robot } ID)$$
The true movement physics are $x_{t+1} = x_t + a_t + \epsilon_t$, with reward $R_{t+1} = -(x_{t+1})^2$.
Determine the minimal sufficient state representation $S_t^*$ that satisfies the Markov property for this MDP.

#### Solution:
The conditional transition probability is:
$$\mathbb{P}(x_{t+1}, R_{t+1} \mid x_t, T_t, \theta_t, ID, a_t) = \mathbb{P}(x_{t+1}, R_{t+1} \mid x_t, a_t)$$
Because $T_t$, $\theta_t$, and $ID$ are statistically independent of $x_{t+1}$ and $R_{t+1}$ given $(x_t, a_t)$, their mutual information with the future is zero:
$$I(x_{t+1}, R_{t+1} ; (T_t, \theta_t, ID) \mid x_t, a_t) = 0$$
The minimal sufficient state representation is simply:
$$S_t^* = x_t$$
Retaining superfluous variables swells the state space cardinality unnecessarily, triggering the curse of dimensionality without providing any predictive utility.

---

## 2.6 Solved Exercises

### Exercise 2.1: Valid Transition Kernel Identification
Which of the following matrices is a valid transition matrix for an MDP?
$$\mathbf{A} = \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.7 \end{bmatrix}, \quad \mathbf{B} = \begin{bmatrix} 1.0 & 0.0 \\ -0.1 & 1.1 \end{bmatrix}, \quad \mathbf{C} = \begin{bmatrix} 0.4 & 0.6 \\ 1.0 & 0.0 \end{bmatrix}$$

#### Solution:
- Matrix $\mathbf{A}$: Row 2 sums to $0.2 + 0.7 = 0.9 \neq 1.0$. Invalid.
- Matrix $\mathbf{B}$: Row 2 contains a negative probability $-0.1 < 0$. Invalid.
- Matrix $\mathbf{C}$: Row 1 sums to $0.4 + 0.6 = 1.0$; Row 2 sums to $1.0 + 0.0 = 1.0$; all elements $\ge 0$. **Valid.**

---

### Exercise 2.2: Computing Multi-Step Markov Transition Probabilities
Given transition matrix $\mathbf{P} = \begin{bmatrix} 0.8 & 0.2 \\ 0.3 & 0.7 \end{bmatrix}$, calculate the 2-step transition probability $\mathcal{P}_{1, 2}^{(2)} = \mathbb{P}(S_{t+2} = s_2 \mid S_t = s_1)$.

#### Solution:
By the Chapman-Kolmogorov equations, $\mathbf{P}^{(2)} = \mathbf{P}^2$:
$$\mathbf{P}^2 = \begin{bmatrix} 0.8 & 0.2 \\ 0.3 & 0.7 \end{bmatrix} \begin{bmatrix} 0.8 & 0.2 \\ 0.3 & 0.7 \end{bmatrix} = \begin{bmatrix} 0.8(0.8) + 0.2(0.3) & 0.8(0.2) + 0.2(0.7) \\ 0.3(0.8) + 0.7(0.3) & 0.3(0.2) + 0.7(0.7) \end{bmatrix}$$
$$\mathcal{P}_{1, 2}^{(2)} = 0.8(0.2) + 0.2(0.7) = 0.16 + 0.14 = 0.30$$

---

### Exercise 2.3: Deriving the Expected Reward Vector
An agent in state $s$ chooses action $a$. With probability $0.4$, it moves to $s_1$ and receives $R = +2.0$. With probability $0.6$, it moves to $s_2$ and receives $R = -1.0$.
Compute $r(s, a)$.

#### Solution:
$$r(s, a) = \sum_{s', r} r \cdot p(s', r \mid s, a) = (0.4)(+2.0) + (0.6)(-1.0) = 0.8 - 0.6 = +0.20$$

---

### Exercise 2.4: Periodicity of a Markov Chain
Determine whether the Markov chain with transition matrix $\mathbf{P} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ is periodic or aperiodic, and state its period $d$.

#### Solution:
Starting in state $1$, the chain moves to state $2$ at $t = 1$, returns to state $1$ at $t = 2$, state $2$ at $t = 3$, and state $1$ at $t = 4$. 
The set of return times to state 1 is $\{2, 4, 6, 8, \dots\}$.
The period is the greatest common divisor:
$$d = \gcd(2, 4, 6, \dots) = 2$$
The chain is **periodic** with period $d = 2$. It does not possess a limiting stationary distribution that is independent of initial conditions.

---

### Exercise 2.5: Ergodicity Requirement for Unique Stationary Distribution
State the two conditions a finite Markov chain must satisfy to guarantee the existence of a unique, strictly positive stationary distribution $\boldsymbol{\pi} > \mathbf{0}$.

#### Solution:
1. **Irreducibility:** Every state must be reachable from every other state in a finite number of steps (the transition graph forms a single strongly connected component).
2. **Aperiodicity:** The period of every state must equal 1 ($d = 1$). A sufficient condition is that at least one state has a self-loop ($\mathcal{P}_{ii} > 0$).

---

### Exercise 2.6: Markov Decision Process with State-Dependent Action Sets
Explain why defining admissible action sets $\mathcal{A}(s)$ as state-dependent is mathematically equivalent to defining a global action set $\mathcal{A} = \bigcup_{s} \mathcal{A}(s)$ with transition penalties.

#### Solution:
One can define a global action set $\mathcal{A}$ where any action $a \notin \mathcal{A}(s)$ taken in state $s$ results in an immediate transition to an absorbing catastrophic penalty state or leaves the state unchanged ($S_{t+1} = s$) while emitting a catastrophic negative reward $R = -\infty$ (or a sufficiently large finite penalty $-M$). Under Bellman optimality, any optimal policy will assign zero probability to such actions, reproducing the exact behavior of state-dependent constraints $\mathcal{A}(s)$.

---

### Exercise 2.7: Deterministic vs Stochastic MDP Transitions
In an MDP, if $p(s', r \mid s, a) \in \{0, 1\}$ for all $s, a, s', r$, how do the transition kernel $\mathcal{P}_{s, s'}^a$ and reward function $r(s, a)$ simplify?

#### Solution:
The transitions and rewards become deterministic functions:
$$s' = f(s, a), \quad r = R(s, a)$$
The transition probability kernel collapses to a Dirac delta:
$$\mathcal{P}_{s, s''}^a = \begin{cases} 1 & \text{if } s'' = f(s, a) \\ 0 & \text{otherwise} \end{cases}$$
and the expected reward is simply $r(s, a) = R(s, a)$.

---

### Exercise 2.8: Partially Observable Coin Toss
A coin is either Fair ($F$) or Double-Headed ($D$). Once selected at $t = 0$, the coin never changes.
At each step, the agent tosses the coin and observes $O \in \{\text{Heads}, \text{Tails}\}$.
Prior belief is $b_0(F) = 0.5, b_0(D) = 0.5$.
If the agent observes 3 Heads in a row, compute the posterior belief $b_3(D)$.

#### Solution:
Likelihoods:
- $\mathbb{P}(3 \text{ Heads} \mid D) = 1.0^3 = 1.0$
- $\mathbb{P}(3 \text{ Heads} \mid F) = (0.5)^3 = 0.125$

By Bayes' rule:
$$b_3(D) = \frac{\mathbb{P}(3H \mid D) b_0(D)}{\mathbb{P}(3H \mid D) b_0(D) + \mathbb{P}(3H \mid F) b_0(F)} = \frac{1.0(0.5)}{1.0(0.5) + 0.125(0.5)} = \frac{0.5}{0.5 + 0.0625} = \frac{0.5}{0.5625} = \frac{8}{9} \approx 0.8889$$
The belief that the coin is double-headed rises to $\approx 88.9\%$.

---

### Exercise 2.9: Reward Function Invariance Under Rescaling
Suppose an environment designer multiplies all rewards by a factor of 10: $R'_{t+1} = 10 R_{t+1}$.
Does the set of optimal policies $\Pi^* = \arg\max_\pi v_\pi(s)$ change? Prove your answer.

#### Solution:
Let the return under the original reward be $G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$.
Under the scaled reward, $G'_t = \sum_{k=0}^\infty \gamma^k (10 R_{t+k+1}) = 10 \sum_{k=0}^\infty \gamma^k R_{t+k+1} = 10 G_t$.
By linearity of expectation:
$$v'_\pi(s) = \mathbb{E}_\pi[G'_t \mid S_t = s] = 10 \mathbb{E}_\pi[G_t \mid S_t = s] = 10 v_\pi(s)$$
Since maximizing $f(x)$ is strictly identical to maximizing $10 f(x)$ for any positive scalar, $\arg\max_\pi 10 v_\pi(s) = \arg\max_\pi v_\pi(s)$.
The set of optimal policies $\Pi^*$ remains completely identical.

---

### Exercise 2.10: Verifying Markov Property from Empirical Observation Sequences
A researcher records a binary process: $0, 1, 0, 1, 0, 1, 0, 1, \dots$ alternating indefinitely.
Is the state representation $S_t \in \{0, 1\}$ Markovian?

#### Solution:
Yes. Given $S_t = 0$, the next state is deterministically $S_{t+1} = 1$:
$$\mathbb{P}(S_{t+1} = 1 \mid S_t = 0) = 1.0$$
Given $S_t = 1$, the next state is deterministically $S_{t+1} = 0$:
$$\mathbb{P}(S_{t+1} = 0 \mid S_t = 1) = 1.0$$
Knowing previous states $S_{t-1}, S_{t-2}, \dots$ provides no additional information, because $\mathbb{P}(S_{t+1} \mid S_t, S_{t-1}, \dots) = \mathbb{P}(S_{t+1} \mid S_t) \in \{0, 1\}$. 
Thus, the single-bit state representation is strictly Markovian.


# Chapter 3: Trajectories, Returns, Horizons, and Discount Factors

---

## 3.1 Episodic vs. Continuing Tasks: The Nature of Time in MDPs

In sequential decision-making, the operational lifespan of an agent falls cleanly into two foundational categories: **Episodic Tasks** and **Continuing Tasks**.

```
   EPISODIC TASK: Finite Sequences with Absorbing Terminal States
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”  A_0   â”Œâ”€â”€â”€â”€â”€â”€â”€â”  A_1   â”Œâ”€â”€â”€â”€â”€â”€â”€â”  A_{T-1} â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚  S_0  â”œâ”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  S_1  â”œâ”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  S_2  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  S_T (TERMINAL)â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”˜ R_1    â””â”€â”€â”€â”€â”€â”€â”€â”˜ R_2    â””â”€â”€â”€â”€â”€â”€â”€â”˜ R_T      â””â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”˜
                                                               â”‚ Loop forever with
                                                               â””â”€â”€â–º R = 0
  
   CONTINUING TASK: Infinite-Horizon Seamless Stream
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”  A_0   â”Œâ”€â”€â”€â”€â”€â”€â”€â”  A_1   â”Œâ”€â”€â”€â”€â”€â”€â”€â”  A_2     â”Œâ”€â”€â”€â”€â”€â”€â”€â”
  â”‚  S_0  â”œâ”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  S_1  â”œâ”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  S_2  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚  S_3  â”œâ”€â”€â”€â”€â–º ... â”€â”€â–º âˆž
  â””â”€â”€â”€â”€â”€â”€â”€â”˜ R_1    â””â”€â”€â”€â”€â”€â”€â”€â”˜ R_2    â””â”€â”€â”€â”€â”€â”€â”€â”˜ R_3      â””â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 1. Episodic Tasks
In an episodic task, the agent-environment interaction naturally breaks down into identifiable, finite-duration sequences called **Episodes** or **Trials**.
- Examples include a game of chess, a round of Go, navigating a maze, or landing a spacecraft.
- Each episode begins at time $t = 0$ in an initial state $S_0 \sim \mu_0$ drawn from an initial state distribution $\mu_0$.
- The episode proceeds through a sequence of decisions until time step $t = T$, where the agent reaches a special state designated as the **Terminal State** $S_T \in \mathcal{S}^+$, where $\mathcal{S}^+$ denotes the state space augmented with terminal states.
- Upon reaching $S_T$, the environment is reset to a new starting state $S_0$, and the next episode commences independently.
- The episode duration $T$ is generally a random variable that varies from trial to trial.

#### The Unified Absorbing State Representation
To unify the mathematical treatment of episodic and continuing tasks under a single notation, Sutton & Barto introduced the concept of the **absorbing terminal state**:
Once the agent enters a terminal state $S_T$, all future actions lead back to $S_T$ with probability 1.0, and all future rewards are identically zero:
$$\mathcal{P}_{S_T, S_T}^a = 1.0, \quad R_{t+1} = 0, \quad \forall t \ge T, \forall a \in \mathcal{A}$$
Under this formulation, every episodic task can be treated formally as an infinite-horizon continuing task whose return stops accumulating once absorption occurs.

### 2. Continuing Tasks
In a continuing task, the agent-environment interaction does not naturally divide into discrete episodes; it flows continuously without termination.
- Examples include an automated temperature control system in a data center, an algorithmic high-frequency trading market maker, or an industrial chemical plant refinery.
- The time index stretches toward infinity: $t \to \infty$.
- Without special mathematical mechanisms, accumulating rewards forever over an infinite horizon would cause the cumulative sum to diverge to $\pm \infty$.

---

## 3.2 Trajectories and the Probability Space of Decision Paths

An agent interacting with an environment generates an alternating sequence of states, actions, and rewards. This realization is termed a **Trajectory** or **Rollout** $\tau$:
$$\tau \doteq (S_0, A_0, R_1, S_1, A_1, R_2, S_2, A_2, \dots, S_{T-1}, A_{T-1}, R_T, S_T)$$

```
                                  TRAJECTORY TREE
                                        (S_0)
                                       /     \
                                 A_0  â—       â—
                                     / \     / \
                               (S_1)    (S_1') ...
                                 â”‚
                                A_1
                                 â”‚
                               (S_2)
                                 â”‚
                                ...
                                 â”‚
                               (S_T) Terminal State
```

### The Probability Measure Induced by Policy $\pi$
Let the agent follow a stationary stochastic policy $\pi(a \mid s) \doteq \mathbb{P}(A_t = a \mid S_t = s)$. 
Let the environment possess transition dynamics $p(s', r \mid s, a)$.
Given an initial state distribution $p(s_0)$, the joint probability density (or probability mass) of observing an entire trajectory $\tau$ of length $T$ is given by the product of conditional factors:

$$p_\pi(\tau) = p(s_0) \prod_{t=0}^{T-1} \pi(a_t \mid s_t) p(s_{t+1}, r_{t+1} \mid s_t, a_t)$$

This factorized density reveals the explicit division of responsibility:
- The agent directly controls the policy terms $\pi(a_t \mid s_t)$.
- The environment controls the initial state $p(s_0)$ and the transition-reward dynamics $p(s_{t+1}, r_{t+1} \mid s_t, a_t)$.

Any expectation over trajectories $\mathbb{E}_\pi [f(\tau)]$ is taken with respect to this probability measure $p_\pi(\tau)$:
$$\mathbb{E}_\pi [f(\tau)] = \int_{\tau} p_\pi(\tau) f(\tau) d\tau \quad \text{or} \quad \sum_{\tau} p_\pi(\tau) f(\tau)$$

---

## 3.3 The Cumulative Return: $G_t$ and the Recursive Decomposition

The foundational objective of an agent at time step $t$ is not to maximize the immediate reward $R_{t+1}$, but to maximize the expected value of the **Return** $G_t$.

### Formal Definition of Discounted Return
For a general task with temporal discount factor $\gamma \in [0, 1]$, the return $G_t$ is defined as the discounted sum of all future rewards received after time $t$:

$$G_t \doteq R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots = \sum_{k=0}^{\infty} \gamma^k R_{t+k+1}$$

If the task is episodic with finite termination time $T$, rewards beyond $T$ are zero, and the sum terminates naturally:
$$G_t = \sum_{k=0}^{T - t - 1} \gamma^k R_{t+k+1}$$

### The Fundamental Recursive Identity
The return satisfies a recursive relationship that forms the algebraic backbone of reinforcement learning:

$$\begin{aligned}
G_t &= R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \gamma^3 R_{t+4} + \dots \\
&= R_{t+1} + \gamma \left( R_{t+2} + \gamma R_{t+3} + \gamma^2 R_{t+4} + \dots \right) \\
&= R_{t+1} + \gamma G_{t+1}
\end{aligned}$$

$$G_t = R_{t+1} + \gamma G_{t+1}$$

This decomposition states that **the return today is the immediate reward plus the discounted return tomorrow**. It allows learning algorithms to compute estimates recursively step-by-step rather than waiting for the entire future history to unfold.

---

## 3.4 The Three Interpretations of the Discount Factor $\gamma$

Why do we introduce the discount factor $\gamma \in [0, 1)$? Why not simply maximize the unweighted sum of rewards $\sum R$?
The parameter $\gamma$ serves three distinct, profound roles:

```
                                  ROLES OF THE DISCOUNT FACTOR Î³
                                                â”‚
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â–¼                              â–¼                              â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚     1. MATHEMATICAL     â”‚    â”‚       2. ECONOMIC       â”‚    â”‚      3. STOCHASTIC      â”‚
    â”‚ Bounding infinite sums  â”‚    â”‚ Present value of money  â”‚    â”‚ Random termination /    â”‚
    â”‚ Prevents divergence     â”‚    â”‚ Inflation & opportunity â”‚    â”‚ Mortality hazard rate   â”‚
    â”‚ to Â±âˆž in continuing     â”‚    â”‚ cost of delay:          â”‚    â”‚ p_term = 1 - Î³          â”‚
    â”‚ tasks.                  â”‚    â”‚ $1 today > $1 tomorrow  â”‚    â”‚ per time step.          â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 1. The Mathematical Role: Bounding Infinite Series
In an infinite-horizon continuing task, if an agent earns a constant positive reward $R_{t+1} = +1$ at every step, an undiscounted sum ($\gamma = 1$) diverges:
$$G_t = \sum_{k=0}^{\infty} 1 = \infty$$
When every policy produces an infinite return, all policies appear identically good ($+\infty = +\infty$). The agent cannot distinguish between a policy that earns $+100$ per step and one that earns $+0.001$ per step.

Introducing $\gamma < 1$ guarantees that the series converges to a finite scalar. If rewards are bounded by $|R_{t+1}| \le R_{\max}$, then by the geometric series formula:
$$|G_t| \le \sum_{k=0}^\infty \gamma^k |R_{t+k+1}| \le R_{\max} \sum_{k=0}^\infty \gamma^k = \frac{R_{\max}}{1 - \gamma} < \infty$$

### 2. The Economic Role: Present Discounted Value
In financial economics, a dollar received today is worth strictly more than a dollar received ten years from now. 
- A dollar held today can be invested at a risk-free interest rate $r$, compounding continuously to $e^{rt}$.
- Future promises carry counterparty risk, currency inflation, and liquidity constraints.
The discount factor $\gamma$ models this exact economic time preference:
$$\gamma = \frac{1}{1 + r}$$
where $r > 0$ is the internal discount rate per time step.

### 3. The Stochastic Role: Constant Hazard Rate of Termination
Consider an agent operating in an environment where at every single time step, there is a constant probability $p_{\text{die}} = 1 - \gamma$ that a catastrophic event (a lightning strike, battery failure, or server crash) destroys the agent and terminates the process.

Let $K$ be the random variable denoting the step at which termination occurs. Because the hazard rate is constant, $K$ follows a geometric distribution:
$$\mathbb{P}(K = k) = (1 - p_{\text{die}})^k p_{\text{die}} = \gamma^k (1 - \gamma)$$
The expected undiscounted return of an agent facing this random mortality is mathematically identical to the expected discounted return of an immortal agent with discount factor $\gamma$:

$$\mathbb{E}_{\text{mortality}}\left[ \sum_{t=0}^K R_{t+1} \right] = \mathbb{E}\left[ \sum_{k=0}^\infty \gamma^k R_{k+1} \right]$$

Thus, discounting by $\gamma$ is mathematically isomorphic to planning under a constant per-step risk of sudden death.

---

## 3.5 The Horizon Spectrum: Myopia vs. Farsightedness

The numerical choice of $\gamma \in [0, 1)$ governs the cognitive horizon of the agent:

```
  Î³ = 0.0                      Î³ = 0.50                    Î³ = 0.90                    Î³ = 0.999
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚  MYOPIC   â”‚                â”‚ SHORT-    â”‚               â”‚ BALANCED  â”‚               â”‚ FARSIGHTEDâ”‚
 â”‚ (Greedy)  â”‚                â”‚ SIGHTED   â”‚               â”‚ HORIZON   â”‚               â”‚ STRATEGISTâ”‚
 â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜                â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜               â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜               â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜
       â”‚                            â”‚                           â”‚                           â”‚
       â–¼                            â–¼                           â–¼                           â–¼
 H_eff = 1 step               H_eff = 2 steps             H_eff = 10 steps            H_eff = 1,000 steps
 Considers only               Weighs next 2-3             Standard RL                 Deep planning; high
 immediate R_{t+1}.           steps heavily.              default benchmark.          variance gradients.
```

- **$\gamma \to 0$ (The Myopic / Short-Sighted Limit):**
  $$G_t = R_{t+1} + 0 \cdot G_{t+1} = R_{t+1}$$
  The agent completely ignores the future. It acts as a purely greedy local optimizer, evaluating actions solely on their instantaneous payoff. It will happily step into a lethal trapdoor if doing so yields a single breadcrumb right now.
- **$\gamma \to 1$ (The Farsighted / Long-Horizon Limit):**
  The agent weighs rewards far in the distant future nearly as heavily as rewards occurring in the next millisecond. In complex strategic domains like chess or robotics, high values ($\gamma = 0.99$ to $0.999$) are required to enable multi-step combinations and delayed plans.
- **The Variance Penalty of Farsightedness:** As $\gamma \to 1$, the effective sample variance of empirical return estimators explodes like $O\left(\frac{1}{(1 - \gamma)^2}\right)$, requiring exponentially more sample trajectories to stabilize value estimates.

---

## 3.6 Worked Examples: Returns and Horizons

### Example 3.1: Step-by-Step Return Computation Along a Trajectory
An autonomous navigation robot records the following trajectory through a discrete grid:
$$\tau = (S_0, A_0, R_1 = -1, S_1, A_1, R_2 = -1, S_2, A_2, R_3 = -1, S_3, A_3, R_4 = +50, S_4)$$
where $S_4$ is an absorbing terminal state.
Assuming $\gamma = 0.90$:
1. Calculate the realized returns $G_0, G_1, G_2, G_3$.
2. Verify the recursive identity $G_t = R_{t+1} + \gamma G_{t+1}$ at every time step.

#### Solution:
**Step 1: Backward Recursion from Terminal State:**
At terminal step $t = 4$, $G_4 = 0$.
- For $t = 3$:
  $$G_3 = R_4 + \gamma G_4 = +50 + (0.90)(0) = +50.0$$
- For $t = 2$:
  $$G_2 = R_3 + \gamma G_3 = -1 + (0.90)(50.0) = -1 + 45.0 = +44.0$$
- For $t = 1$:
  $$G_1 = R_2 + \gamma G_2 = -1 + (0.90)(44.0) = -1 + 39.6 = +38.6$$
- For $t = 0$:
  $$G_0 = R_1 + \gamma G_1 = -1 + (0.90)(38.6) = -1 + 34.74 = +33.74$$

**Step 2: Forward Verification:**
$$G_0 = R_1 + \gamma R_2 + \gamma^2 R_3 + \gamma^3 R_4$$
$$G_0 = -1 + (0.90)(-1) + (0.90)^2(-1) + (0.90)^3(50)$$
$$G_0 = -1 - 0.90 - 0.81 + (0.729)(50) = -2.71 + 36.45 = +33.74 \quad \checkmark$$
Every step satisfies $G_t = R_{t+1} + \gamma G_{t+1}$.

---

### Example 3.2: Discount Factor Sensitivity in Path Selection
An agent at $S_0$ can choose between Path A and Path B:
- **Path A (Short path):** 2 steps to goal. $R_1 = -2, R_2 = +10$.
- **Path B (Long safe path):** 5 steps to goal. $R_1 = -0.1, R_2 = -0.1, R_3 = -0.1, R_4 = -0.1, R_5 = +12$.
Terminal state follows immediately after reaching the goal.

1. Write the algebraic return functions $G_A(\gamma)$ and $G_B(\gamma)$.
2. Calculate the returns for $\gamma = 0.50$ and $\gamma = 0.95$.
3. Find the exact crossover discount factor $\gamma^*$ where both paths yield identical returns.

#### Solution:
**Step 1: Algebraic Expressions:**
$$G_A(\gamma) = -2 + 10\gamma$$
$$G_B(\gamma) = -0.1(1 + \gamma + \gamma^2 + \gamma^3) + 12\gamma^4 = -0.1 \frac{1 - \gamma^4}{1 - \gamma} + 12\gamma^4$$

**Step 2: Evaluations:**
- At $\gamma = 0.50$:
  $$G_A(0.5) = -2 + 10(0.5) = -2 + 5 = +3.0$$
  $$G_B(0.5) = -0.1(1 + 0.5 + 0.25 + 0.125) + 12(0.5)^4 = -0.1(1.875) + 12(0.0625) = -0.1875 + 0.75 = +0.5625$$
  Here, $G_A(0.5) > G_B(0.5)$: the agent prefers Path A.
- At $\gamma = 0.95$:
  $$G_A(0.95) = -2 + 10(0.95) = +7.5$$
  $$G_B(0.95) = -0.1(1 + 0.95 + 0.9025 + 0.857375) + 12(0.95)^4 = -0.1(3.709875) + 12(0.814506) = -0.371 + 9.774 = +9.403$$
  Here, $G_B(0.95) > G_A(0.95)$: the agent prefers Path B.

**Step 3: Crossover Factor $\gamma^*$:**
Setting $-2 + 10\gamma = -0.1(1 + \gamma + \gamma^2 + \gamma^3) + 12\gamma^4$:
$$12\gamma^4 - 0.1\gamma^3 - 0.1\gamma^2 - 10.1\gamma + 1.9 = 0$$
Using root-finding (Newton-Raphson or numerical bisection):
- At $\gamma = 0.80$: $G_A = 6.0$, $G_B = -0.1(2.952) + 12(0.4096) = -0.295 + 4.915 = 4.62$ ($G_A > G_B$).
- At $\gamma = 0.88$: $G_A = 6.8$, $G_B = -0.1(3.35) + 12(0.5997) = -0.335 + 7.196 = 6.861$ ($G_B > G_A$).
Solving yields $\gamma^* \approx 0.876$.
Below $0.876$, the agent takes the aggressive short path; above $0.876$, it prefers the patient, higher-yield long path.

---

### Example 3.3: Probability Distribution over Trajectories
Consider a toy MDP with states $\mathcal{S} = \{s_0, s_1, s_T\}$ and actions $\mathcal{A} = \{a_1, a_2\}$.
- The agent starts in $s_0$ with probability $1.0$.
- In state $s_0$, policy $\pi(a_1 \mid s_0) = 0.6, \pi(a_2 \mid s_0) = 0.4$.
- Environment dynamics:
  - If $a_1$ is taken in $s_0$: moves to $s_1$ with prob $0.8$ ($R = +1$), and to $s_T$ with prob $0.2$ ($R = -10$).
  - If $a_2$ is taken in $s_0$: moves to $s_1$ with prob $0.3$ ($R = +5$), and to $s_T$ with prob $0.7$ ($R = 0$).
- In state $s_1$: the agent always takes $a_1$ ($\pi(a_1 \mid s_1) = 1.0$), transitioning deterministically to $s_T$ with reward $R = +2$.

Compute the probability $p_\pi(\tau)$ and the return $G_0(\tau)$ (with $\gamma = 0.90$) for all possible trajectories.

#### Solution:
There are 4 distinct complete trajectories ending in $s_T$:

1. **Trajectory $\tau_1 = (s_0, a_1, R_1 = -10, s_T)$:**
   $$p(\tau_1) = p(s_0) \pi(a_1 \mid s_0) p(s_T, -10 \mid s_0, a_1) = 1.0 \times 0.6 \times 0.2 = 0.12$$
   $$G_0(\tau_1) = -10.0$$

2. **Trajectory $\tau_2 = (s_0, a_1, R_1 = +1, s_1, a_1, R_2 = +2, s_T)$:**
   $$p(\tau_2) = 1.0 \times 0.6 \times 0.8 \times 1.0 \times 1.0 = 0.48$$
   $$G_0(\tau_2) = +1 + (0.90)(+2) = +1 + 1.8 = +2.8$$

3. **Trajectory $\tau_3 = (s_0, a_2, R_1 = 0, s_T)$:**
   $$p(\tau_3) = 1.0 \times 0.4 \times 0.7 = 0.28$$
   $$G_0(\tau_3) = 0.0$$

4. **Trajectory $\tau_4 = (s_0, a_2, R_1 = +5, s_1, a_1, R_2 = +2, s_T)$:**
   $$p(\tau_4) = 1.0 \times 0.4 \times 0.3 \times 1.0 \times 1.0 = 0.12$$
   $$G_0(\tau_4) = +5 + (0.90)(+2) = +5 + 1.8 = +6.8$$

**Verification of Total Probability:**
$$\sum_{i=1}^4 p(\tau_i) = 0.12 + 0.48 + 0.28 + 0.12 = 1.00 \quad \checkmark$$

**Expected Return $\mathbb{E}_\pi [G_0]$:**
$$\begin{aligned}
\mathbb{E}_\pi [G_0] &= 0.12(-10.0) + 0.48(+2.8) + 0.28(0.0) + 0.12(+6.8) \\
&= -1.20 + 1.344 + 0.0 + 0.816 = +0.96
\end{aligned}$$

---

### Example 3.4: Bounding Return Variance
Suppose an agent operates in a continuing task where rewards are independent and identically distributed (i.i.d.) random variables with mean $\mu = \mathbb{E}[R]$ and variance $\sigma^2 = \text{Var}(R)$.
Derive the analytical formula for the variance of the discounted return $\text{Var}(G_t)$ as a function of $\sigma^2$ and $\gamma \in [0, 1)$.

#### Solution:
The return is:
$$G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$$
Because the rewards are independent, the variance of a linear combination of independent random variables equals the sum of the squared coefficients times their respective variances:
$$\text{Var}(G_t) = \text{Var}\left( \sum_{k=0}^\infty \gamma^k R_{t+k+1} \right) = \sum_{k=0}^\infty \text{Var}(\gamma^k R_{t+k+1})$$
Since $\text{Var}(c X) = c^2 \text{Var}(X)$:
$$\text{Var}(G_t) = \sum_{k=0}^\infty (\gamma^k)^2 \text{Var}(R_{t+k+1}) = \sigma^2 \sum_{k=0}^\infty (\gamma^2)^k$$
Since $\gamma \in [0, 1)$, $\gamma^2 < 1$. The infinite geometric series converges to:
$$\sum_{k=0}^\infty (\gamma^2)^k = \frac{1}{1 - \gamma^2}$$
Therefore:
$$\text{Var}(G_t) = \frac{\sigma^2}{1 - \gamma^2}$$
Notice that as $\gamma \to 1$:
$$1 - \gamma^2 = (1 - \gamma)(1 + \gamma) \approx 2(1 - \gamma)$$
$$\text{Var}(G_t) \approx \frac{\sigma^2}{2(1 - \gamma)}$$
The variance scales inversely with $1 - \gamma$. As $\gamma \to 1$, variance approaches infinity, illustrating the severe credit assignment noise in long-horizon learning.

---

### Example 3.5: Cyclic Rewards in an Infinite-Horizon Continuing Task
An agent cycles perpetually between three states: $s_0 \to s_1 \to s_2 \to s_0$, earning rewards $R_1 = +2, R_2 = -1, R_3 = +5$ at each cycle.
Calculate the exact infinite-horizon discounted return $G_0$ starting at $s_0$ with discount factor $\gamma \in [0, 1)$.

#### Solution:
The reward sequence from $t = 0$ is periodic with period 3:
$$\mathbf{R} = (+2, -1, +5, +2, -1, +5, +2, -1, +5, \dots)$$
We can group the return into blocks of 3 steps:
$$G_0 = \sum_{m=0}^\infty \gamma^{3m} \left( R_1 + \gamma R_2 + \gamma^2 R_3 \right)$$
Let $B$ be the return of a single 3-step cycle:
$$B = R_1 + \gamma R_2 + \gamma^2 R_3 = 2 - \gamma + 5\gamma^2$$
Then:
$$G_0 = B \sum_{m=0}^\infty (\gamma^3)^m = \frac{B}{1 - \gamma^3} = \frac{2 - \gamma + 5\gamma^2}{1 - \gamma^3}$$
For example, if $\gamma = 0.90$:
- $B = 2 - 0.90 + 5(0.81) = 1.10 + 4.05 = 5.15$
- $\gamma^3 = 0.729 \implies 1 - \gamma^3 = 0.271$
- $G_0 = \frac{5.15}{0.271} \approx 19.0037$

---

### Example 3.6: Continuous-Time Interest Rate Mapping
In continuous-time financial engineering, money compounds continuously according to the discount factor $e^{-\rho \Delta t}$, where $\rho > 0$ is the continuous discount rate and $\Delta t$ is the discrete time step duration.
1. Show how $\gamma$ relates to $\rho$ and $\Delta t$.
2. If an RL agent acts at a control frequency of $100\text{ Hz}$ ($\Delta t = 0.01\text{ s}$), and the physical designer specifies that rewards 10 seconds in the future should be discounted by $50\%$, compute the required per-step discount factor $\gamma$.

#### Solution:
**Step 1: Relationship:**
In discrete time:
$$\gamma = e^{-\rho \Delta t}$$

**Step 2: Calculate $\gamma$:**
A reward 10 seconds in the future represents $N$ discrete steps:
$$N = \frac{10\text{ s}}{\Delta t} = \frac{10\text{ s}}{0.01\text{ s}} = 1,000 \text{ steps}$$
We require the discount over 1,000 steps to equal $0.50$:
$$\gamma^{1000} = 0.50$$
Taking the 1,000th root:
$$\gamma = (0.50)^{1/1000} = (0.50)^{0.001} \approx 0.999307$$
At high control frequencies (100 Hz), the discount factor must be set extremely close to 1 ($\gamma \approx 0.9993$) to preserve planning horizons on human-perceptible timescales.

---

### Example 3.7: The Hazard Rate Equivalence Proof
Prove analytically that an immortal agent discounting rewards with $\gamma$ has the identical expected return as an agent whose environment terminates with independent probability $p = 1 - \gamma$ at each step without discounting ($\gamma_{\text{die}} = 1$).

#### Solution:
Let the termination step $T$ follow a geometric distribution:
$$\mathbb{P}(T > t) = (1 - p)^t = \gamma^t$$
The agent receives rewards $R_1, R_2, \dots$ as long as the episode has not terminated prior to time step $t+1$.
Define an indicator random variable $\mathbb{I}(T \ge t+1)$ which equals 1 if the agent is still alive at step $t+1$, and 0 otherwise.
The undiscounted return until termination is:
$$G_{\text{die}} = \sum_{t=0}^\infty R_{t+1} \mathbb{I}(T \ge t+1)$$
Taking the expectation with respect to the survival distribution:
$$\mathbb{E}_T [G_{\text{die}}] = \sum_{t=0}^\infty R_{t+1} \mathbb{E}_T [\mathbb{I}(T \ge t+1)]$$
Since $\mathbb{E}[\mathbb{I}(A)] = \mathbb{P}(A)$:
$$\mathbb{E}_T [\mathbb{I}(T \ge t+1)] = \mathbb{P}(T \ge t+1) = \gamma^t$$
Substituting this back:
$$\mathbb{E}_T [G_{\text{die}}] = \sum_{t=0}^\infty \gamma^t R_{t+1} = G_{\text{discounted}}$$
The two formulations are mathematically isomorphic.

---

### Example 3.8: Average-Reward Formulation for Continuing Tasks
In continuing tasks where $\gamma = 1$ is desired, the **Average-Reward Formulation** replaces cumulative return with the asymptotic average reward per step:
$$r(\pi) \doteq \lim_{h \to \infty} \frac{1}{h} \sum_{t=1}^h \mathbb{E}[R_t]$$
Let an ergodic MDP with stationary state distribution $d^\pi(s)$ yield expected rewards $r(s, a)$.
1. Express $r(\pi)$ in terms of $d^\pi(s)$ and $r(s, a)$.
2. For an agent spending $70\%$ of its time in state $s_1$ ($R = +1$) and $30\%$ of its time in state $s_2$ ($R = +5$), compute $r(\pi)$.

#### Solution:
**Step 1: Formula:**
By the Ergodic Theorem for Markov chains:
$$r(\pi) = \sum_{s \in \mathcal{S}} d^\pi(s) \sum_{a \in \mathcal{A}} \pi(a \mid s) r(s, a)$$

**Step 2: Numerical Calculation:**
$$r(\pi) = d^\pi(s_1) R(s_1) + d^\pi(s_2) R(s_2) = (0.70)(+1.0) + (0.30)(+5.0) = 0.70 + 1.50 = +2.20 \text{ reward/step}$$

---

### Example 3.9: Return Truncation Error
In computational implementations, an infinite series $G_t = \sum_{k=0}^\infty \gamma^k R_{t+k+1}$ must often be truncated to a finite horizon $H$:
$$\hat{G}_{t, H} \doteq \sum_{k=0}^{H-1} \gamma^k R_{t+k+1}$$
If all rewards are bounded by $|R_t| \le R_{\max}$, determine the minimal truncation length $H$ such that the truncation error satisfies:
$$|G_t - \hat{G}_{t, H}| \le \epsilon$$
for given $\epsilon > 0$ and $\gamma \in (0, 1)$.

#### Solution:
The truncation error is the tail of the geometric series:
$$|G_t - \hat{G}_{t, H}| = \left| \sum_{k=H}^\infty \gamma^k R_{t+k+1} \right| \le R_{\max} \sum_{k=H}^\infty \gamma^k$$
Factoring out $\gamma^H$:
$$\sum_{k=H}^\infty \gamma^k = \gamma^H \sum_{j=0}^\infty \gamma^j = \frac{\gamma^H}{1 - \gamma}$$
Thus:
$$\text{Error} \le \frac{R_{\max} \gamma^H}{1 - \gamma} \le \epsilon$$
Solving for $\gamma^H$:
$$\gamma^H \le \frac{\epsilon (1 - \gamma)}{R_{\max}}$$
Taking the natural logarithm:
$$H \ln(\gamma) \le \ln\left( \frac{\epsilon (1 - \gamma)}{R_{\max}} \right)$$
Since $\gamma \in (0, 1)$, $\ln(\gamma) < 0$. Dividing reverses the inequality:
$$H \ge \frac{\ln\left( \frac{\epsilon (1 - \gamma)}{R_{\max}} \right)}{\ln(\gamma)}$$

---

### Example 3.10: Numerical Horizon Calculation for Truncation
Using the formula derived in Example 3.9, calculate the required truncation horizon $H$ when:
$R_{\max} = 1.0$, $\gamma = 0.95$, and the target accuracy is $\epsilon = 0.01$.

#### Solution:
Substitute values:
$$1 - \gamma = 1 - 0.95 = 0.05$$
$$\frac{\epsilon (1 - \gamma)}{R_{\max}} = \frac{(0.01)(0.05)}{1.0} = 0.0005 = 5 \times 10^{-4}$$
Calculate logarithms:
$$\ln(0.0005) \approx -7.6009$$
$$\ln(0.95) \approx -0.051293$$
Calculate $H$:
$$H \ge \frac{-7.6009}{-0.051293} \approx 148.18$$
Rounding up:
$$H = 149 \text{ steps}$$
To guarantee error under $0.01$, the trajectory must be simulated for at least 149 steps.

---

## 3.7 Solved Exercises

### Exercise 3.1: Finite Trajectory Return
Given an episode of length $T = 3$ with rewards $R_1 = 5, R_2 = -2, R_3 = 8$, compute $G_0$ for $\gamma = 0.5$ and $\gamma = 1.0$.

#### Solution:
- For $\gamma = 0.5$:
  $$G_0 = 5 + (0.5)(-2) + (0.5)^2(8) = 5 - 1 + 0.25(8) = 5 - 1 + 2 = 6.0$$
- For $\gamma = 1.0$:
  $$G_0 = 5 + (-2) + 8 = 11.0$$

---

### Exercise 3.2: Reversing Returns via Backward Recursion
An algorithm processes a trajectory in reverse order. Given $G_2 = 14.0$, $\gamma = 0.8$, and $R_2 = -2.0$, find $G_1$.

#### Solution:
Using $G_1 = R_2 + \gamma G_2$:
$$G_1 = -2.0 + (0.8)(14.0) = -2.0 + 11.2 = 9.2$$

---

### Exercise 3.3: Effective Horizon at $\gamma = 0.98$
Compute the effective planning horizon $H_{\text{eff}} \approx \frac{1}{1 - \gamma}$ for $\gamma = 0.98$.

#### Solution:
$$H_{\text{eff}} \approx \frac{1}{1 - 0.98} = \frac{1}{0.02} = 50 \text{ steps}$$

---

### Exercise 3.4: Bounded Return Range
If all rewards are strictly constrained to $R_{t+1} \in [-5, +15]$ and $\gamma = 0.90$, find the theoretical lower and upper bounds of $G_t$.

#### Solution:
$$G_{\min} = \frac{R_{\min}}{1 - \gamma} = \frac{-5}{1 - 0.90} = \frac{-5}{0.10} = -50.0$$
$$G_{\max} = \frac{R_{\max}}{1 - \gamma} = \frac{+15}{1 - 0.90} = \frac{+15}{0.10} = +150.0$$
The return is bounded in $[-50.0, +150.0]$.

---

### Exercise 3.5: Return Under Linearly Decreasing Rewards
An agent receives $R_1 = 10, R_2 = 9, R_3 = 8, \dots, R_{10} = 1$, and $R_t = 0$ for all $t > 10$.
Compute $G_0$ with undiscounted horizon ($\gamma = 1.0$).

#### Solution:
$$G_0 = \sum_{k=1}^{10} k = \frac{10 \times 11}{2} = 55.0$$

---

### Exercise 3.6: Infinite Alternating Reward Series
An agent receives alternating rewards $+1, -1, +1, -1, \dots$ forever. 
Derive the closed-form return $G_0$ as a function of $\gamma \in [0, 1)$.

#### Solution:
$$G_0 = 1 - \gamma + \gamma^2 - \gamma^3 + \gamma^4 - \dots = \sum_{k=0}^\infty (-\gamma)^k$$
Since $|-\gamma| = \gamma < 1$, the geometric series converges to:
$$G_0 = \frac{1}{1 - (-\gamma)} = \frac{1}{1 + \gamma}$$
For $\gamma = 0.5$, $G_0 = \frac{1}{1.5} = \frac{2}{3}$.

---

### Exercise 3.7: Probability of Length-3 Episode
Let a terminal state be reached with probability $p = 0.2$ at each step, regardless of state or action.
What is the probability that an episode lasts exactly $T = 3$ steps?

#### Solution:
The agent must survive step 1 and step 2, and terminate at step 3:
$$\mathbb{P}(T = 3) = (1 - p)(1 - p) p = (0.8)(0.8)(0.2) = 0.64 \times 0.2 = 0.128$$

---

### Exercise 3.8: Discounting with Periodic Bonuses
An agent receives a base reward $R = 1$ at every step, plus a bonus $B = 10$ every 5th step ($t = 5, 10, 15, \dots$).
Derive the formula for $G_0$ for discount factor $\gamma \in [0, 1)$.

#### Solution:
Split the return into base rewards and periodic bonuses:
$$G_{\text{base}} = \sum_{k=0}^\infty \gamma^k (1) = \frac{1}{1 - \gamma}$$
$$G_{\text{bonus}} = \sum_{m=1}^\infty \gamma^{5m - 1} (10) = 10 \gamma^4 \sum_{j=0}^\infty (\gamma^5)^j = \frac{10 \gamma^4}{1 - \gamma^5}$$
Total return:
$$G_0 = \frac{1}{1 - \gamma} + \frac{10 \gamma^4}{1 - \gamma^5}$$

---

### Exercise 3.9: Relative Weight of First Step
For what value of $\gamma$ does the immediate first reward $R_1$ contribute exactly $50\%$ of the total return in a continuing task with constant reward $R_{t+1} = c > 0$?

#### Solution:
The total return is $G = \frac{c}{1 - \gamma}$.
We require:
$$R_1 = 0.50 \times G \implies c = 0.50 \frac{c}{1 - \gamma}$$
Dividing by $c > 0$:
$$1 = \frac{0.50}{1 - \gamma} \implies 1 - \gamma = 0.50 \implies \gamma = 0.50$$
At $\gamma = 0.50$, the first step accounts for exactly half the total infinite-horizon discounted return.

---

### Exercise 3.10: Zero-Sum Return in Two-Player Games
In a competitive two-player game (e.g. chess), the reward is $+1$ for a win, $-1$ for a loss, and $0$ for a draw, emitted only at terminal step $T$.
Explain why $\gamma = 1.0$ is typically used rather than $\gamma < 1.0$.

#### Solution:
If $\gamma < 1.0$, a checkmate delivered at move 20 yields return $\gamma^{19}(+1)$, while a checkmate delivered at move 40 yields $\gamma^{39}(+1) < \gamma^{19}(+1)$. The agent would prefer an aggressive, riskier line that mates in 20 over a safer line that mates in 40. Furthermore, under $\gamma < 1.0$, facing an unavoidable loss, the agent would prefer to lose immediately at move 21 ($\gamma^{20}(-1)$) rather than delay the loss to move 40 ($\gamma^{39}(-1)$, which has smaller absolute penalty), actively committing suicide. Setting $\gamma = 1.0$ ensures that a win is valued equally regardless of duration, and all losses are treated with equal severity.


# Chapter 4: Policies and State-Transition Dynamics

---

## 4.1 The Concept of a Policy: Deterministic vs. Stochastic Mappings

At the heart of an autonomous agent lies its decision-making core: the **Policy**. 

```
                                      THE POLICY FUNCTION
                                               â”‚
                       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                       â–¼                                               â–¼
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â”‚    DETERMINISTIC POLICY     â”‚                 â”‚      STOCHASTIC POLICY      â”‚
        â”‚          a = Ï€(s)           â”‚                 â”‚         Ï€(a | s)            â”‚
        â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
        â”‚ â€¢ Hard, unique assignment   â”‚                 â”‚ â€¢ Probability distribution  â”‚
        â”‚ â€¢ Single action per state   â”‚                 â”‚ â€¢ Î£_{a} Ï€(a | s) = 1.0      â”‚
        â”‚ â€¢ Natural for optimal plans â”‚                 â”‚ â€¢ Natural for exploration   â”‚
        â”‚ â€¢ Vulnerable to exploit     â”‚                 â”‚ â€¢ Mandatory in POMDPs /     â”‚
        â”‚   in multi-agent games      â”‚                 â”‚   imperfect information     â”‚
        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Formally, a policy is a rule or mapping that specifies how an agent selects actions given its current state:

### 1. Deterministic Policies
A deterministic policy is a direct functional mapping from the state space to the action space:
$$\pi: \mathcal{S} \to \mathcal{A}$$
$$a = \pi(s)$$
Given state $s$, the agent selects action $a$ with probability 1.0. For finite state and action spaces, a deterministic policy can be represented simply as a lookup table or array of length $|\mathcal{S}|$, where the $i$-th entry contains the action index $\pi(s_i)$.

### 2. Stochastic Policies
A stochastic policy maps each state to a probability distribution over the admissible action set $\mathcal{A}(s)$:
$$\pi: \mathcal{S} \times \mathcal{A} \to [0, 1]$$
$$\pi(a \mid s) \doteq \mathbb{P}(A_t = a \mid S_t = s)$$
To be mathematically valid, $\pi(a \mid s)$ must satisfy the standard Kolmogorov probability axioms for every state $s \in \mathcal{S}$:
$$\pi(a \mid s) \ge 0, \quad \forall a \in \mathcal{A}(s)$$
$$\sum_{a \in \mathcal{A}(s)} \pi(a \mid s) = 1, \quad \forall s \in \mathcal{S}$$

### Why Do We Need Stochastic Policies?
While it is a fundamental theorem of MDP theory (proven in Chapter 7) that every finite MDP possesses at least one deterministic policy that is globally optimal, stochastic policies are indispensable in practice:
1. **Exploration During Learning:** In reinforcement learning, if an agent uses a deterministic policy before mastering the environment, it will repeatedly execute the same sequence of actions, failing to discover alternative, superior paths. Stochastic policies (such as $\epsilon$-greedy or Softmax/Boltzmann exploration) inject exploratory randomness.
2. **Partial Observability (POMDPs):** In environments with hidden states, deterministic policies can lead to infinite loops. For example, in a game of Rock-Paper-Scissors, any deterministic policy can be exploited by an adversary to achieve a 100% win rate; the unique Nash equilibrium requires a stochastic uniform policy $\pi = (\frac{1}{3}, \frac{1}{3}, \frac{1}{3})$.
3. **Differentiable Policy Search:** In continuous control and policy gradient methods (e.g. REINFORCE, PPO), policies are parameterized by neural networks $\pi_\theta(a \mid s)$ outputting the parameters of a Gaussian distribution $\mathcal{N}(\mu_\theta(s), \sigma_\theta^2(s))$. Differentiability requires continuous probability density.

---

## 4.2 Stationary vs. Non-Stationary Policies

A policy $\pi_t$ is defined to be **Stationary** (or time-invariant) if the action distribution depends exclusively on the current state $S_t$, regardless of the current time step $t$:
$$\mathbb{P}(A_t = a \mid S_t = s) = \pi(a \mid s), \quad \forall t$$

Conversely, a policy is **Non-Stationary** (or time-dependent) if the decision rule changes over time:
$$A_t \sim \pi_t(\cdot \mid S_t)$$

```
                               POLICY STATIONARITY COMPARISON
                                              â”‚
              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â–¼                                                               â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚    STATIONARY POLICY     â”‚                                    â”‚  NON-STATIONARY POLICY   â”‚
 â”‚        Ï€(a | s)          â”‚                                    â”‚       Ï€_t(a | s)         â”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                                    â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ â€¢ Time-invariant         â”‚                                    â”‚ â€¢ Explicitly time-indexedâ”‚
 â”‚ â€¢ Sufficient for infiniteâ”‚                                    â”‚ â€¢ Mandatory for finite-  â”‚
 â”‚   horizon discounted MDPsâ”‚                                    â”‚   horizon fixed T tasks  â”‚
 â”‚ â€¢ Constant state mapping â”‚                                    â”‚ â€¢ "10 seconds left vs    â”‚
 â”‚                          â”‚                                    â”‚    10 hours left"        â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

> [!NOTE]
> **Stationarity Theorem:** For any stationary, finite MDP with infinite horizon and constant discount factor $\gamma \in [0, 1)$, there exists an optimal policy that is stationary and deterministic. You never need to know the clock time $t$ if the state transition dynamics and rewards do not depend on $t$.

However, in **finite-horizon tasks** of fixed duration $T$, optimal policies are inherently non-stationary. A football team with 10 seconds remaining on the clock facing 4th-and-goal will execute a desperate Hail Mary pass, whereas with 50 minutes remaining, it would choose a conservative field goal. The time remaining $T - t$ acts as an implicit state variable. If $T - t$ is appended to the state, the policy can once again be treated as stationary over the augmented state space $\tilde{S}_t = (S_t, T - t)$.

---

## 4.3 Policy-Induced Markov Chains and MRPs

When an agent fixes its behavior according to a stationary policy $\pi$, it completely removes external decision freedom from the system. The closed-loop agent-environment composite collapses from an active Markov Decision Process into a passive **Markov Reward Process (MRP)** or **Markov Chain**.

```
    MDP UNDER ACTIVE POLICY Ï€            COLLAPSES INTO INDUCED MRP
                                                    
          (s)                                          (s)
         /   \                                       /     \
   Ï€(a_1)â—   â— Ï€(a_2)                 â”€â”€â”€â”€â”€â”€â”€â”€â–º   P^Ï€_{s,s_1} \ P^Ï€_{s,s_2}
        / \ / \                                       â–¼         â–¼
      (s_1) (s_2)                                   (s_1)     (s_2)
```

### The Policy-Induced Transition Matrix $\mathbf{P}_\pi$
The probability of transitioning from state $s$ to state $s'$ under policy $\pi$ is obtained by marginalizing over all possible actions:

$$\mathcal{P}_{s, s'}^\pi \doteq \mathbb{P}(S_{t+1} = s' \mid S_t = s, \pi) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) \mathcal{P}_{s, s'}^a$$

In matrix form, let $|\mathcal{S}| = N$. The policy-induced transition matrix $\mathbf{P}_\pi \in \mathbb{R}^{N \times N}$ is the convex combination of the individual action transition matrices $\mathbf{P}^a$:
$$\mathbf{P}_\pi = \sum_{a \in \mathcal{A}} \boldsymbol{\Pi}^a \mathbf{P}^a$$
where $\boldsymbol{\Pi}^a = \text{diag}(\pi(a \mid s_1), \pi(a \mid s_2), \dots, \pi(a \mid s_N))$.

### The Policy-Induced Reward Vector $\mathbf{r}_\pi$
Similarly, the expected reward received when leaving state $s$ under policy $\pi$ is the policy-weighted average of the state-action rewards:

$$r_\pi(s) \doteq \mathbb{E}[R_{t+1} \mid S_t = s, \pi] = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) r(s, a)$$

In vector form:
$$\mathbf{r}_\pi \doteq \begin{bmatrix} r_\pi(s_1) \\ r_\pi(s_2) \\ \vdots \\ r_\pi(s_N) \end{bmatrix} \in \mathbb{R}^N$$

Thus, fixing policy $\pi$ yields an induced Markov Reward Process:
$$\mathcal{M}_\pi = (\mathcal{S}, \mathbf{P}_\pi, \mathbf{r}_\pi, \gamma)$$

---

## 4.4 Stationary State Distributions and Occupancy Measures

When an agent follows a stationary policy $\pi$ indefinitely, what fraction of its time does it spend in each state?

```
                                  STATE VISITATION FLOW
                     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                     â”‚                                              â”‚
                     â–¼                                              â”‚
                  â”Œâ”€â”€â”€â”€â”€â”       P^Ï€_{1,2}        â”Œâ”€â”€â”€â”€â”€â”            â”‚
                  â”‚ s_1 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–ºâ”‚ s_2 â”‚            â”‚
                  â””â”€â”€â”¬â”€â”€â”˜                        â””â”€â”€â”¬â”€â”€â”˜            â”‚
                     â–²                              â”‚ P^Ï€_{2,3}     â”‚ P^Ï€_{3,1}
                     â”‚ P^Ï€_{3,1}                    â–¼               â”‚
                     â”‚                           â”Œâ”€â”€â”€â”€â”€â”            â”‚
                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤ s_3 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                                 â””â”€â”€â”€â”€â”€â”˜
                         Conservation of Probability Flow:
                         d^Ï€(s) = Î£_{s'} d^Ï€(s') P^Ï€_{s', s}
```

### 1. The Stationary Distribution $d^\pi(s)$
If the induced Markov chain is **ergodic** (irreducible and aperiodic), there exists a unique probability distribution $d^\pi \in \Delta(\mathcal{S})$, written as a row vector $\mathbf{d}_\pi \in \mathbb{R}^{1 \times N}$, satisfying:

$$\mathbf{d}_\pi \mathbf{P}_\pi = \mathbf{d}_\pi$$
$$\sum_{s \in \mathcal{S}} d^\pi(s) = 1, \quad d^\pi(s) \ge 0$$

In component form, this represents the **conservation of probability flow**:
$$d^\pi(s) = \sum_{s' \in \mathcal{S}} d^\pi(s') \mathcal{P}_{s', s}^\pi$$
The probability mass flowing into state $s$ from all predecessor states $s'$ exactly balances the probability mass residing in $s$.

### 2. The Discounted State Occupancy Measure $\rho_\pi(s)$
In discounted continuing tasks, states visited early in an agent's lifetime contribute more to cumulative return than states visited millions of steps later. 

To formalize this, define the **Discounted State Visitation Measure** $\rho_\pi(s)$ starting from an initial distribution $\mu_0(s) = \mathbb{P}(S_0 = s)$:

$$\rho_\pi(s) \doteq \sum_{t=0}^{\infty} \gamma^t \mathbb{P}(S_t = s \mid S_0 \sim \mu_0, \pi)$$

In vector notation, where $\boldsymbol{\mu}_0 \in \mathbb{R}^{1 \times N}$ is the initial state row vector:
$$\boldsymbol{\rho}_\pi = \boldsymbol{\mu}_0 + \gamma \boldsymbol{\mu}_0 \mathbf{P}_\pi + \gamma^2 \boldsymbol{\mu}_0 \mathbf{P}_\pi^2 + \dots = \boldsymbol{\mu}_0 \sum_{t=0}^\infty (\gamma \mathbf{P}_\pi)^t$$

Using the Neumann series for matrix inversion (since the spectral radius $\rho(\gamma \mathbf{P}_\pi) \le \gamma < 1$):
$$\boldsymbol{\rho}_\pi = \boldsymbol{\mu}_0 (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$$

The normalized discounted occupancy distribution $d_{\gamma, \mu_0}^\pi(s)$ is:
$$d_{\gamma, \mu_0}^\pi(s) \doteq (1 - \gamma) \rho_\pi(s)$$
such that $\sum_{s} d_{\gamma, \mu_0}^\pi(s) = 1$. This distribution plays a central role in modern Policy Gradient theorems (Silver, Sutton).

---

## 4.5 Worked Examples: Policy Computations

### Example 4.1: Constructing Policy-Induced Transition Matrices
An MDP has states $\mathcal{S} = \{s_1, s_2\}$ and actions $\mathcal{A} = \{a_1, a_2\}$.
The action-specific transition matrices and reward vectors are:
$$\mathbf{P}^{a_1} = \begin{bmatrix} 0.9 & 0.1 \\ 0.2 & 0.8 \end{bmatrix}, \quad \mathbf{r}^{a_1} = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix}$$
$$\mathbf{P}^{a_2} = \begin{bmatrix} 0.4 & 0.6 \\ 0.7 & 0.3 \end{bmatrix}, \quad \mathbf{r}^{a_2} = \begin{bmatrix} 5.0 \\ -2.0 \end{bmatrix}$$

Consider a stochastic policy $\pi$ defined by:
- In state $s_1$: $\pi(a_1 \mid s_1) = 0.70, \quad \pi(a_2 \mid s_1) = 0.30$.
- In state $s_2$: $\pi(a_1 \mid s_2) = 0.10, \quad \pi(a_2 \mid s_2) = 0.90$.

1. Compute the induced transition matrix $\mathbf{P}_\pi$.
2. Compute the induced reward vector $\mathbf{r}_\pi$.

#### Solution:
**Step 1: Compute $\mathbf{P}_\pi$:**
For state $s_1$ (Row 1):
$$\mathcal{P}_{s_1, s_1}^\pi = \pi(a_1 \mid s_1) \mathcal{P}_{s_1, s_1}^{a_1} + \pi(a_2 \mid s_1) \mathcal{P}_{s_1, s_1}^{a_2} = (0.70)(0.9) + (0.30)(0.4) = 0.63 + 0.12 = 0.75$$
$$\mathcal{P}_{s_1, s_2}^\pi = \pi(a_1 \mid s_1) \mathcal{P}_{s_1, s_2}^{a_1} + \pi(a_2 \mid s_1) \mathcal{P}_{s_1, s_2}^{a_2} = (0.70)(0.1) + (0.30)(0.6) = 0.07 + 0.18 = 0.25$$
Check row sum: $0.75 + 0.25 = 1.0 \quad \checkmark$.

For state $s_2$ (Row 2):
$$\mathcal{P}_{s_2, s_1}^\pi = \pi(a_1 \mid s_2) \mathcal{P}_{s_2, s_1}^{a_1} + \pi(a_2 \mid s_2) \mathcal{P}_{s_2, s_1}^{a_2} = (0.10)(0.2) + (0.90)(0.7) = 0.02 + 0.63 = 0.65$$
$$\mathcal{P}_{s_2, s_2}^\pi = \pi(a_1 \mid s_2) \mathcal{P}_{s_2, s_2}^{a_1} + \pi(a_2 \mid s_2) \mathcal{P}_{s_2, s_2}^{a_2} = (0.10)(0.8) + (0.90)(0.3) = 0.08 + 0.27 = 0.35$$
Check row sum: $0.65 + 0.35 = 1.0 \quad \checkmark$.

Thus:
$$\mathbf{P}_\pi = \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix}$$

**Step 2: Compute $\mathbf{r}_\pi$:**
$$r_\pi(s_1) = \pi(a_1 \mid s_1) r(s_1, a_1) + \pi(a_2 \mid s_1) r(s_1, a_2) = (0.70)(1.0) + (0.30)(5.0) = 0.70 + 1.50 = 2.20$$
$$r_\pi(s_2) = \pi(a_1 \mid s_2) r(s_2, a_1) + \pi(a_2 \mid s_2) r(s_2, a_2) = (0.10)(0.0) + (0.90)(-2.0) = 0.0 - 1.80 = -1.80$$
$$\mathbf{r}_\pi = \begin{bmatrix} 2.20 \\ -1.80 \end{bmatrix}$$

---

### Example 4.2: Calculating the Stationary Distribution under Policy $\pi$
Using the induced transition matrix $\mathbf{P}_\pi = \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix}$ from Example 4.1:
Compute the exact stationary distribution $\mathbf{d}_\pi = [d_1, d_2]$.

#### Solution:
The stationary condition $\mathbf{d}_\pi \mathbf{P}_\pi = \mathbf{d}_\pi$ requires:
$$[d_1, d_2] \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix} = [d_1, d_2]$$
Expanding the first column:
$$0.75 d_1 + 0.65 d_2 = d_1 \implies 0.65 d_2 = 0.25 d_1 \implies d_2 = \frac{0.25}{0.65} d_1 = \frac{5}{13} d_1$$
Apply normalization $d_1 + d_2 = 1$:
$$d_1 + \frac{5}{13} d_1 = 1 \implies \frac{18}{13} d_1 = 1 \implies d_1 = \frac{13}{18} \approx 0.7222$$
$$d_2 = 1 - \frac{13}{18} = \frac{5}{18} \approx 0.2778$$
The agent spends approximately $72.2\%$ of its operational time in state $s_1$ and $27.8\%$ in state $s_2$.

---

### Example 4.3: Asymptotic Average Reward of Policy $\pi$
Using the stationary distribution $\mathbf{d}_\pi = [\frac{13}{18}, \frac{5}{18}]$ and reward vector $\mathbf{r}_\pi = [2.20, -1.80]^T$:
Compute the asymptotic average reward per step $r(\pi) = \mathbf{d}_\pi \mathbf{r}_\pi$.

#### Solution:
$$r(\pi) = d_1 r_\pi(s_1) + d_2 r_\pi(s_2) = \left(\frac{13}{18}\right)(2.20) + \left(\frac{5}{18}\right)(-1.80)$$
$$r(\pi) = \frac{13 \times 2.20 - 5 \times 1.80}{18} = \frac{28.60 - 9.00}{18} = \frac{19.60}{18} \approx +1.0889 \text{ reward/step}$$

---

### Example 4.4: Discounted State Occupancy Matrix Computation
For the induced Markov chain with $\mathbf{P}_\pi = \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix}$ and discount factor $\gamma = 0.80$:
Compute the fundamental resolvent matrix $\mathbf{M} \doteq (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$.

#### Solution:
**Step 1: Compute $\mathbf{I} - \gamma \mathbf{P}_\pi$:**
$$\gamma \mathbf{P}_\pi = 0.80 \begin{bmatrix} 0.75 & 0.25 \\ 0.65 & 0.35 \end{bmatrix} = \begin{bmatrix} 0.60 & 0.20 \\ 0.52 & 0.28 \end{bmatrix}$$
$$\mathbf{I} - \gamma \mathbf{P}_\pi = \begin{bmatrix} 1 - 0.60 & -0.20 \\ -0.52 & 1 - 0.28 \end{bmatrix} = \begin{bmatrix} 0.40 & -0.20 \\ -0.52 & 0.72 \end{bmatrix}$$

**Step 2: Determinant:**
$$\det(\mathbf{I} - \gamma \mathbf{P}_\pi) = (0.40)(0.72) - (-0.20)(-0.52) = 0.288 - 0.104 = 0.184$$

**Step 3: Matrix Inversion:**
$$\mathbf{M} = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} = \frac{1}{0.184} \begin{bmatrix} 0.72 & 0.20 \\ 0.52 & 0.40 \end{bmatrix}$$
$$\mathbf{M} \approx \begin{bmatrix} 3.9130 & 1.0870 \\ 2.8261 & 2.1739 \end{bmatrix}$$

Notice:
- Row 1 sum: $3.9130 + 1.0870 = 5.00 = \frac{1}{1 - 0.80}$.
- Row 2 sum: $2.8261 + 2.1739 = 5.00 = \frac{1}{1 - 0.80}$.
Every row of $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$ sums exactly to $\frac{1}{1 - \gamma}$, confirming that total discounted lifetime is conserved across all initial states.

---

### Example 4.5: Discounted State Visitation Starting from State $s_1$
Using $\mathbf{M} = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$ from Example 4.4:
Given initial state distribution $\boldsymbol{\mu}_0 = [1.0, 0.0]$ (the agent begins deterministically in state $s_1$):
1. Compute the discounted occupancy measure vector $\boldsymbol{\rho}_\pi$.
2. Compute the normalized discounted state distribution $\mathbf{d}_{\gamma}^\pi$.

#### Solution:
**Step 1: Occupancy Measure:**
$$\boldsymbol{\rho}_\pi = \boldsymbol{\mu}_0 \mathbf{M} = [1.0, 0.0] \begin{bmatrix} 3.9130 & 1.0870 \\ 2.8261 & 2.1739 \end{bmatrix} = [3.9130, 1.0870]$$
Interpretation: Starting from $s_1$, the agent expects to accumulate $3.913$ discounted visits in state $s_1$ and $1.087$ discounted visits in state $s_2$.

**Step 2: Normalized Distribution:**
$$\mathbf{d}_\gamma^\pi = (1 - \gamma) \boldsymbol{\rho}_\pi = (0.20) [3.9130, 1.0870] = [0.7826, 0.2174]$$
Sum check: $0.7826 + 0.2174 = 1.000 \quad \checkmark$.
Notice that $d_\gamma^\pi(s_1) = 0.7826$ is higher than the stationary distribution $d_1 = 0.7222$, because the agent started directly in $s_1$ and discounting prioritizes early visits.

---

### Example 4.6: Softmax / Boltzmann Policy Parameterization
In parameterized policy algorithms, action probabilities are generated from real-valued preferences $h(s, a; \boldsymbol{\theta})$ via the Softmax (Boltzmann) function:
$$\pi(a \mid s) = \frac{e^{h(s, a) / \tau}}{\sum_{b \in \mathcal{A}(s)} e^{h(s, b) / \tau}}$$
where $\tau > 0$ is a temperature hyperparameter.
Let state $s$ have 3 available actions with preferences:
$$h(s, a_1) = 2.0, \quad h(s, a_2) = 1.0, \quad h(s, a_3) = 0.0$$
Calculate the action probability distribution $\pi(\cdot \mid s)$ for:
1. High temperature $\tau = 5.0$.
2. Standard temperature $\tau = 1.0$.
3. Low temperature $\tau = 0.2$.

#### Solution:
**1. For $\tau = 5.0$ (High exploration):**
- $h/\tau$: $2/5 = 0.4, \quad 1/5 = 0.2, \quad 0/5 = 0.0$.
- Exponentials: $e^{0.4} \approx 1.4918, \quad e^{0.2} \approx 1.2214, \quad e^{0.0} = 1.0000$.
- Sum: $1.4918 + 1.2214 + 1.0000 = 3.7132$.
- Probabilities:
  $$\pi(a_1 \mid s) = \frac{1.4918}{3.7132} \approx 0.4017, \quad \pi(a_2 \mid s) \approx 0.3289, \quad \pi(a_3 \mid s) \approx 0.2693$$

**2. For $\tau = 1.0$ (Standard):**
- $e^2 \approx 7.3891, \quad e^1 \approx 2.7183, \quad e^0 = 1.0000$.
- Sum: $7.3891 + 2.7183 + 1.0000 = 11.1074$.
- Probabilities:
  $$\pi(a_1 \mid s) = \frac{7.3891}{11.1074} \approx 0.6652, \quad \pi(a_2 \mid s) \approx 0.2447, \quad \pi(a_3 \mid s) \approx 0.0900$$

**3. For $\tau = 0.2$ (Greedy / Exploitation limit):**
- $h/\tau$: $2/0.2 = 10, \quad 1/0.2 = 5, \quad 0/0.2 = 0$.
- Exponentials: $e^{10} \approx 22026.47, \quad e^5 \approx 148.41, \quad e^0 = 1.00$.
- Sum: $22026.47 + 148.41 + 1.00 \approx 22175.88$.
- Probabilities:
  $$\pi(a_1 \mid s) = \frac{22026.47}{22175.88} \approx 0.9933, \quad \pi(a_2 \mid s) \approx 0.0067, \quad \pi(a_3 \mid s) \approx 0.000045$$
As $\tau \to 0$, the Softmax policy approaches a deterministic argmax policy.

---

### Example 4.7: Deterministic Policy Space Cardinality
A gridworld environment has $N = 16$ states ($4 \times 4$ grid). In each state, the agent can choose from $|\mathcal{A}| = 4$ directional actions: $\{\text{Up}, \text{Down}, \text{Left}, \text{Right}\}$.
1. How many distinct deterministic policies $\pi: \mathcal{S} \to \mathcal{A}$ exist?
2. If an exhaustive search evaluates 1 billion policies per second, how long would brute-force evaluation take?

#### Solution:
**Step 1: Policy Cardinality:**
For each of the $N$ states, there are $|\mathcal{A}|$ independent action choices:
$$|\Pi_{\text{det}}| = |\mathcal{A}|^{|\mathcal{S}|} = 4^{16} = (2^2)^{16} = 2^{32} = 4,294,967,296 \text{ policies}$$

**Step 2: Brute-Force Time:**
$$\text{Time} = \frac{4.295 \times 10^9 \text{ policies}}{10^9 \text{ policies/sec}} \approx 4.295 \text{ seconds}$$

Now consider a moderately larger board: $8 \times 8$ grid ($N = 64$ states):
$$|\Pi_{\text{det}}| = 4^{64} = 2^{128} \approx 3.40 \times 10^{38} \text{ policies}$$
At 1 billion evaluations per second:
$$\text{Time} = \frac{3.40 \times 10^{38}}{10^9} = 3.40 \times 10^{29} \text{ seconds} \approx 1.08 \times 10^{22} \text{ years}$$
This illustrates why brute-force policy search fails instantly on non-trivial environments, necessitating dynamic programming.

---

### Example 4.8: Policy Gradient Score Function Derivation
Let $\pi_\theta(a \mid s)$ be a differentiable parameterized policy.
Prove the famous "log-derivative trick" (score function identity):
$$\nabla_\theta \pi_\theta(a \mid s) = \pi_\theta(a \mid s) \nabla_\theta \ln \pi_\theta(a \mid s)$$
and show that $\mathbb{E}_{a \sim \pi_\theta} [\nabla_\theta \ln \pi_\theta(a \mid s)] = 0$.

#### Solution:
**Step 1: Score Identity:**
By the elementary calculus chain rule for $\ln(u)$:
$$\nabla_\theta \ln \pi_\theta(a \mid s) = \frac{1}{\pi_\theta(a \mid s)} \nabla_\theta \pi_\theta(a \mid s)$$
Multiplying both sides by $\pi_\theta(a \mid s)$:
$$\pi_\theta(a \mid s) \nabla_\theta \ln \pi_\theta(a \mid s) = \nabla_\theta \pi_\theta(a \mid s) \quad \checkmark$$

**Step 2: Expectation of the Score Function:**
$$\mathbb{E}_{a \sim \pi_\theta} [\nabla_\theta \ln \pi_\theta(a \mid s)] = \sum_{a \in \mathcal{A}} \pi_\theta(a \mid s) \nabla_\theta \ln \pi_\theta(a \mid s)$$
Substituting the identity:
$$= \sum_{a \in \mathcal{A}} \nabla_\theta \pi_\theta(a \mid s) = \nabla_\theta \left( \sum_{a \in \mathcal{A}} \pi_\theta(a \mid s) \right)$$
Because $\pi_\theta$ is a valid probability distribution, $\sum_a \pi_\theta(a \mid s) = 1.0$ for all $\theta$:
$$= \nabla_\theta (1.0) = \mathbf{0}$$
The expected score is identically zero.

---

### Example 4.9: Degenerate Policy Causing Transient State Trapping
Consider a 3-state chain $s_1 \rightleftarrows s_2 \to s_3$, where $s_3$ is absorbing.
Let policy $\pi_A$ always choose $a = \text{Left}$ in state $s_2$, moving to $s_1$ with prob 1.0, and in $s_1$ moving to $s_2$ with prob 1.0.
1. Write the induced transition matrix $\mathbf{P}_{\pi_A}$.
2. Determine whether $s_3$ is reachable under policy $\pi_A$.
3. What is the stationary distribution of the induced chain?

#### Solution:
**Step 1: Transition Matrix:**
$$\mathbf{P}_{\pi_A} = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

**Step 2: Reachability:**
Under $\pi_A$, the agent oscillates between $s_1$ and $s_2$ forever. $\mathcal{P}_{s_2, s_3}^{\pi_A} = 0$. State $s_3$ is completely unreachable.

**Step 3: Stationary Distributions:**
The chain is reducible and periodic (with two closed classes: $\{s_1, s_2\}$ and $\{s_3\}$).
Any distribution of the form $\boldsymbol{\mu} = [\frac{\alpha}{2}, \frac{\alpha}{2}, 1 - \alpha]$ for $\alpha \in [0, 1]$ satisfies $\boldsymbol{\mu} \mathbf{P}_{\pi_A} = \boldsymbol{\mu}$. 
If the agent begins in $s_1$, it remains trapped in the limit cycle $\{s_1, s_2\}$ with stationary distribution $[0.5, 0.5, 0.0]$, never reaching the terminal state.

---

### Example 4.10: Entropy of Exploration Policies
The exploration capacity of a stochastic policy is measured by its Shannon entropy:
$$\mathcal{H}(\pi(\cdot \mid s)) \doteq - \sum_{a \in \mathcal{A}} \pi(a \mid s) \ln \pi(a \mid s)$$
Let $|\mathcal{A}| = 4$.
1. Compute the entropy of a uniform random policy $\pi_{\text{rand}}(a \mid s) = \frac{1}{4}$ for all $a$.
2. Compute the entropy of a deterministic policy $\pi_{\text{det}}(a_1 \mid s) = 1.0, \pi_{\text{det}}(a_k \mid s) = 0$ for $k > 1$.
3. Compute the entropy of an $\epsilon$-greedy policy with $\epsilon = 0.10$ and 4 actions.

#### Solution:
**1. Uniform Random Policy:**
$$\mathcal{H}(\pi_{\text{rand}}) = - 4 \times \left( \frac{1}{4} \ln \frac{1}{4} \right) = - \ln\left( \frac{1}{4} \right) = \ln(4) \approx 1.3863 \text{ nats}$$

**2. Deterministic Policy:**
$$\mathcal{H}(\pi_{\text{det}}) = - (1.0 \ln 1.0 + 0 + 0 + 0) = - (1.0 \times 0) = 0.0 \text{ nats}$$

**3. $\epsilon$-Greedy Policy ($\epsilon = 0.10, |\mathcal{A}| = 4$):**
- Greedy action $a^*$: $\pi(a^*) = 1 - \epsilon + \frac{\epsilon}{4} = 1 - 0.10 + 0.025 = 0.925$.
- Three exploratory actions $a_k$: $\pi(a_k) = \frac{\epsilon}{4} = \frac{0.10}{4} = 0.025$.
Entropy:
$$\mathcal{H}(\pi_{\epsilon}) = - [0.925 \ln(0.925) + 3 \times 0.025 \ln(0.025)]$$
- $0.925 \ln(0.925) = 0.925(-0.07796) \approx -0.07211$.
- $3 \times 0.025 \ln(0.025) = 0.075(-3.68888) \approx -0.27667$.
$$\mathcal{H}(\pi_{\epsilon}) = - (-0.07211 - 0.27667) = +0.3488 \text{ nats}$$
Entropy drops sharply from $1.386$ to $0.349$, quantifying how rapidly $\epsilon$-greedy concentrates probability mass.

---

## 4.6 Solved Exercises

### Exercise 4.1: Stochastic Policy Probability Normalization
A neural network outputs unnormalized action logits $\mathbf{z} = [2.0, 4.0, 1.0]$ in state $s$.
Compute the normalized Softmax policy vector $\boldsymbol{\pi}(\cdot \mid s)$.

#### Solution:
$$e^{2.0} \approx 7.389, \quad e^{4.0} \approx 54.598, \quad e^{1.0} \approx 2.718$$
Sum: $7.389 + 54.598 + 2.718 = 64.705$.
- $\pi(a_1 \mid s) = \frac{7.389}{64.705} \approx 0.1142$
- $\pi(a_2 \mid s) = \frac{54.598}{64.705} \approx 0.8438$
- $\pi(a_3 \mid s) = \frac{2.718}{64.705} \approx 0.0420$
Sum check: $0.1142 + 0.8438 + 0.0420 = 1.000 \quad \checkmark$.

---

### Exercise 4.2: Induced Markov Transition Matrix
An agent has 2 states and 2 actions:
$$\mathbf{P}^{a_1} = \begin{bmatrix} 1.0 & 0.0 \\ 0.5 & 0.5 \end{bmatrix}, \quad \mathbf{P}^{a_2} = \begin{bmatrix} 0.0 & 1.0 \\ 0.0 & 1.0 \end{bmatrix}$$
Under a policy that chooses $a_1$ with prob $0.4$ in state 1 and $a_1$ with prob $0.8$ in state 2, write $\mathbf{P}_\pi$.

#### Solution:
- Row 1: $0.4[1.0, 0.0] + 0.6[0.0, 1.0] = [0.4, 0.6]$.
- Row 2: $0.8[0.5, 0.5] + 0.2[0.0, 1.0] = [0.4, 0.4] + [0.0, 0.2] = [0.4, 0.6]$.
$$\mathbf{P}_\pi = \begin{bmatrix} 0.4 & 0.6 \\ 0.4 & 0.6 \end{bmatrix}$$

---

### Exercise 4.3: Instant Stationary Distribution
Notice in Exercise 4.2 that both rows of $\mathbf{P}_\pi$ are identical ($[0.4, 0.6]$).
What is the stationary distribution $\mathbf{d}_\pi$ of this chain?

#### Solution:
Because every state transitions to $[s_1, s_2]$ with probabilities $[0.4, 0.6]$ independent of the origin state:
$$\mathbf{d}_\pi = [0.4, 0.6]$$
Verification: $[0.4, 0.6] \begin{bmatrix} 0.4 & 0.6 \\ 0.4 & 0.6 \end{bmatrix} = [0.16 + 0.24, 0.24 + 0.36] = [0.4, 0.6] \quad \checkmark$.

---

### Exercise 4.4: Number of Deterministic Policies in Chess
Estimate the number of deterministic policies in chess assuming approximately $10^{40}$ reachable legal board states, with an average of 30 legal moves per state.

#### Solution:
$$|\Pi| = |\mathcal{A}|^{|\mathcal{S}|} \approx 30^{10^{40}}$$
This number far exceeds the number of subatomic particles in the observable universe ($\approx 10^{80}$), demonstrating why tabular policy listing is impossible in complex games.

---

### Exercise 4.5: Probability of Action Under $\epsilon$-Greedy Policy
For an environment with $|\mathcal{A}| = 5$ actions and $\epsilon = 0.20$, what is the exact probability of selecting the greedy action $a^*$, and what is the probability of selecting a specific non-greedy action $a_{\text{sub}}$?

#### Solution:
- Probability of greedy action:
  $$\mathbb{P}(a^*) = 1 - \epsilon + \frac{\epsilon}{|\mathcal{A}|} = 1 - 0.20 + \frac{0.20}{5} = 0.80 + 0.04 = 0.84$$
- Probability of a specific non-greedy action:
  $$\mathbb{P}(a_{\text{sub}}) = \frac{\epsilon}{|\mathcal{A}|} = \frac{0.20}{5} = 0.04$$
Sum check: $0.84 + 4 \times 0.04 = 0.84 + 0.16 = 1.00 \quad \checkmark$.

---

### Exercise 4.6: Discounted Occupancy of Immediate Absorbing State
An agent in state $s_0$ takes action $a$, receiving reward $R_1 = 0$ and transitioning to absorbing terminal state $s_T$ with probability 1.0.
What is the discounted occupancy measure $\rho_\pi(s_0)$?

#### Solution:
Since the agent starts in $s_0$ at $t = 0$ and never returns:
$$\rho_\pi(s_0) = \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s_0 \mid S_0 = s_0) = \gamma^0 (1) + \gamma^1 (0) + \gamma^2 (0) + \dots = 1.0$$

---

### Exercise 4.7: Verifying Ergodicity from Transition Graph
A 3-state Markov chain has transitions: $s_1 \to s_2$ with prob 1.0; $s_2 \to s_3$ with prob 1.0; $s_3 \to s_1$ with prob 1.0.
Is this chain ergodic? Explain.

#### Solution:
No. The chain is irreducible (any state can reach any other state), but it is strictly periodic with period $d = 3$ (it cycles deterministic along $s_1 \to s_2 \to s_3 \to s_1$). Ergodicity requires aperiodicity ($d = 1$). Therefore, the chain is not ergodic.

---

### Exercise 4.8: Policy Representation Memory Footprint
A discrete MDP has $1,000,000$ states and $10$ actions.
Calculate the memory required in megabytes (MB) to store:
1. A deterministic policy as 8-bit unsigned integers (`uint8`).
2. A stochastic policy as 32-bit floating-point numbers (`float32`).

#### Solution:
1. **Deterministic Policy:**
   $$1,000,000 \text{ bytes} \approx \frac{1,000,000}{1,048,576} \approx 0.954 \text{ MB}$$
2. **Stochastic Policy:**
   Each state stores 10 float32 values ($10 \times 4 = 40$ bytes):
   $$1,000,000 \times 40 \text{ bytes} = 40,000,000 \text{ bytes} \approx \frac{40,000,000}{1,048,576} \approx 38.15 \text{ MB}$$

---

### Exercise 4.9: Invariance of Stationary Distribution to Initial State
In an ergodic Markov chain, does the long-run stationary distribution $\lim_{t \to \infty} \mathbb{P}(S_t = s)$ depend on the initial state $S_0$?

#### Solution:
No. For any irreducible, aperiodic finite Markov chain, the Perron-Frobenius theorem guarantees that $\lim_{t \to \infty} \mathbf{P}^t = \mathbf{1} \mathbf{d}_\pi$, where $\mathbf{d}_\pi$ is the unique stationary distribution. For any initial distribution $\boldsymbol{\mu}_0$:
$$\lim_{t \to \infty} \boldsymbol{\mu}_0 \mathbf{P}^t = \boldsymbol{\mu}_0 (\mathbf{1} \mathbf{d}_\pi) = (\boldsymbol{\mu}_0 \mathbf{1}) \mathbf{d}_\pi = (1) \mathbf{d}_\pi = \mathbf{d}_\pi$$
All dependence on initial state is completely forgotten as $t \to \infty$.

---

### Exercise 4.10: Expected Episode Length from Resolvent
Given the fundamental matrix $\mathbf{M} = (\mathbf{I} - \mathbf{Q})^{-1}$ for transient states of an absorbing Markov chain under policy $\pi$, prove that the $i$-th entry of the vector $\boldsymbol{\tau} = \mathbf{M} \mathbf{1}$ equals the expected number of steps until absorption starting from transient state $s_i$.

#### Solution:
Let $N_j$ be the total number of visits to transient state $s_j$.
$N_j = \sum_{t=0}^\infty \mathbb{I}(S_t = s_j)$.
Taking the expectation conditioned on $S_0 = s_i$:
$$\mathbb{E}[N_j \mid S_0 = s_i] = \sum_{t=0}^\infty \mathbb{P}(S_t = s_j \mid S_0 = s_i) = \sum_{t=0}^\infty (\mathbf{Q}^t)_{ij} = [(\mathbf{I} - \mathbf{Q})^{-1}]_{ij} = M_{ij}$$
The total time until absorption is the sum of visits across all transient states:
$$T = \sum_{j} N_j \implies \mathbb{E}[T \mid S_0 = s_i] = \sum_{j} \mathbb{E}[N_j \mid S_0 = s_i] = \sum_{j} M_{ij} = (\mathbf{M} \mathbf{1})_i$$
This proves that row sums of the fundamental matrix equal the expected time to absorption.


# Chapter 5: Value Functions: The State-Value Function $V(s)$ and Action-Value Function $Q(s, a)$

---

## 5.1 The Teleological Necessity of Value

In the physical world, an immediate sensation tells an animal only what is happening to its sensory receptors *at this instant*. Pain signals cell damage; sweet taste signals glucose ingestion. But an animal that maximizes only immediate pleasure will quickly perish: a mouse that eats poison-laced peanut butter experiences intense pleasure for two minutes before dying.

To survive and flourish, an intelligent agent requires a mental simulation engine that projects immediate sensations into the distant future. This engine computes what economists call **Expected Utility** and what reinforcement learning formalizes as **Value**.

```
                        THE DUAL REALMS OF EVALUATION
                                      â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â–¼                                                   â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚     IMMEDIATE VALENCE â”‚                             â”‚     LONG-TERM VALUE   â”‚
 â”‚        Reward R       â”‚                             â”‚       V(s) or Q(s, a) â”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                             â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ â€¢ Emitted by Env      â”‚                             â”‚ â€¢ Synthesized by Agentâ”‚
 â”‚ â€¢ Ephemeral sensation â”‚                             â”‚ â€¢ Infinite projection â”‚
 â”‚ â€¢ "What just happened"â”‚                             â”‚ â€¢ "What lies ahead"   â”‚
 â”‚ â€¢ Local feedback      â”‚                             â”‚ â€¢ Global potential    â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

A **Value Function** answers the fundamental operational question:
> *"If I find myself in state $s$ (or take action $a$ from state $s$) and continue making decisions according to my current strategy $\pi$ for the rest of my operational lifetime, how much total discounted reward do I expect to accumulate?"*

---

## 5.2 The State-Value Function: $v_\pi(s)$

Let an agent be embedded in an MDP $\mathcal{M} = (\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$ following a stationary policy $\pi(a \mid s)$.

### Formal Definition
The **State-Value Function** $v_\pi: \mathcal{S} \to \mathbb{R}$ is the expected return starting from state $s$ at time step $t$ and following policy $\pi$ thereafter:

$$v_\pi(s) \doteq \mathbb{E}_\pi [G_t \mid S_t = s] = \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \;\middle|\; S_t = s \right]$$

For an episodic task terminating at time step $T$:
$$v_\pi(s) \doteq \mathbb{E}_\pi \left[ \sum_{k=0}^{T - t - 1} \gamma^k R_{t+k+1} \;\middle|\; S_t = s \right]$$

### Boundary Conditions
By axiomatic definition, the value of an absorbing terminal state $s_{\text{term}}$ is always identically zero:
$$v_\pi(s_{\text{term}}) = 0, \quad \forall \pi$$
This boundary condition anchors all dynamic programming recursions.

### State Value as a Potential Field
In physics, a gravitational or electrostatic potential field $\Phi(\mathbf{x})$ assigns a scalar to every point in space such that particles accelerate along the negative gradient $-\nabla \Phi$. 
In reinforcement learning, the state-value function $v_\pi(s)$ acts as a **decision potential field**:
- High-value states represent peaks of safety, resources, or proximity to goals.
- Low-value states represent valleys of energy expenditure, hazard, or dead ends.
- An optimal agent navigates by ascending the gradient of the value field.

```
       VALUE POTENTIAL LANDSCAPE OVER A 1D MAZE
  V(s)
   10 â”‚                                              [GOAL: +10]
    8 â”‚                                             /
    6 â”‚                                     â”Œâ”€â”€â”€â”€â”€â”€â”˜ (s_4: V = 8.1)
    4 â”‚                             â”Œâ”€â”€â”€â”€â”€â”€â”€â”˜ (s_3: V = 6.4)
    2 â”‚                     â”Œâ”€â”€â”€â”€â”€â”€â”€â”˜ (s_2: V = 4.8)
    0 â”‚ â”€â”€â”€â”€â”€â–º â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ (s_1: V = 3.2)
   -2 â”‚        â”‚ [TRAP: -10]
      â””â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º State Coordinate s
              s_0
```

---

## 5.3 The Action-Value Function: $q_\pi(s, a)$

While $v_\pi(s)$ measures how desirable it is to *be* in state $s$, it does not directly tell an agent *which action to execute next*. To evaluate competing alternatives, the agent requires a granular action-specific metric.

### Formal Definition
The **Action-Value Function** (frequently termed the **Q-Function**, where $Q$ stands for *Quality*) $q_\pi: \mathcal{S} \times \mathcal{A} \to \mathbb{R}$ is the expected return starting from state $s$, executing an arbitrary action $a$, and *thereafter* following policy $\pi$:

$$q_\pi(s, a) \doteq \mathbb{E}_\pi [G_t \mid S_t = s, A_t = a] = \mathbb{E}_\pi \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \;\middle|\; S_t = s, A_t = a \right]$$

> [!IMPORTANT]
> **The Critical Distinction:** In $q_\pi(s, a)$, the first action $a$ is **not** drawn from policy $\pi$. It is forced upon the system by external intervention. Only from time step $t+1$ onward does the agent resume following policy $\pi$. This allows the agent to ask "what if" counterfactual questions: *"What would happen if I took this sub-optimal or exploratory action right now, but played my regular policy thereafter?"*

---

## 5.4 The Fundamental Algebraic Bridges Between $V$ and $Q$

The state-value function $v_\pi(s)$ and the action-value function $q_\pi(s, a)$ are not isolated mathematical entities; they are intimately connected by two fundamental algebraic bridges:

```
                          THE V â—„â”€â”€â–º Q ALGEBRAIC CYCLE
                                       
                                      (s)  State Node
                                     /   \
                             Ï€(a_1) /     \ Ï€(a_2)
                                   â–¼       â–¼
                          Q(s, a_1)â—       â— Q(s, a_2)  Action Nodes
                                   \       /
                            r + Î³   \     / r + Î³
                                     â–¼   â–¼
                                      (s') Next State Node
```

### Bridge 1: Expressing $v_\pi(s)$ in terms of $q_\pi(s, a)$
The value of a state $s$ is simply the policy-weighted expectation of the action-values available in that state:

$$v_\pi(s) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) q_\pi(s, a) = \mathbb{E}_{a \sim \pi(\cdot \mid s)} [q_\pi(s, a)]$$

- If policy $\pi$ is deterministic ($a^* = \pi(s)$), then:
  $$v_\pi(s) = q_\pi(s, \pi(s))$$

### Bridge 2: Expressing $q_\pi(s, a)$ in terms of $v_\pi(s')$
The value of taking action $a$ in state $s$ is the immediate expected reward plus the discounted expected value of the successor states:

$$q_\pi(s, a) = r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v_\pi(s')$$

By substituting Bridge 2 into Bridge 1, we obtain the recursive Bellman equation for $v_\pi(s)$.
By substituting Bridge 1 into Bridge 2, we obtain the recursive Bellman equation for $q_\pi(s, a)$.

---

## 5.5 The Advantage Function: $A_\pi(s, a)$

In many modern reinforcement learning paradigms (such as Dueling DQN, A2C, and PPO), working directly with raw Q-values introduces unnecessary numerical variance. To isolate the relative superiority of an individual action, we define the **Advantage Function**.

### Formal Definition
The Advantage function $A_\pi: \mathcal{S} \times \mathcal{A} \to \mathbb{R}$ is the difference between the action-value of a specific action $a$ and the baseline state-value of state $s$:

$$A_\pi(s, a) \doteq q_\pi(s, a) - v_\pi(s)$$

### Interpretation
- **$A_\pi(s, a) > 0$:** Action $a$ performs strictly better than the expected performance of policy $\pi$ in state $s$.
- **$A_\pi(s, a) < 0$:** Action $a$ performs strictly worse than average.
- **$A_\pi(s, a) = 0$:** Action $a$ performs exactly equal to the average policy performance.

### The Zero-Mean Advantage Property
Under policy $\pi$, the expected advantage in any state is identically zero:
$$\mathbb{E}_{a \sim \pi(\cdot \mid s)} [A_\pi(s, a)] = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) [q_\pi(s, a) - v_\pi(s)] = \sum_{a} \pi(a \mid s) q_\pi(s, a) - v_\pi(s) \sum_a \pi(a \mid s)$$
$$= v_\pi(s) - v_\pi(s)(1) = 0$$

---

## 5.6 Worked Examples: Value and Action-Value Calculations

### Example 5.1: Computing $V(s)$ from a Known Q-Table
In an MDP with states $\mathcal{S} = \{s_1, s_2\}$ and actions $\mathcal{A} = \{a_1, a_2, a_3\}$, an agent has computed the following Q-table:

| State | $q(s, a_1)$ | $q(s, a_2)$ | $q(s, a_3)$ |
| :---: | :---: | :---: | :---: |
| $s_1$ | $+10.0$ | $+4.0$ | $-2.0$ |
| $s_2$ | $+0.0$ | $+6.0$ | $+8.0$ |

Compute $v_\pi(s_1)$ and $v_\pi(s_2)$ under:
1. Deterministic policy $\pi_{\text{greedy}}$ that chooses $\arg\max_a q(s, a)$.
2. Uniform random policy $\pi_{\text{rand}}(a \mid s) = \frac{1}{3}$.
3. $\epsilon$-greedy policy with $\epsilon = 0.30$.

#### Solution:
**1. Deterministic Greedy Policy:**
- For $s_1$: $\arg\max_a q(s_1, a) = a_1 \implies v_{\text{greedy}}(s_1) = q(s_1, a_1) = +10.0$.
- For $s_2$: $\arg\max_a q(s_2, a) = a_3 \implies v_{\text{greedy}}(s_2) = q(s_2, a_3) = +8.0$.

**2. Uniform Random Policy ($\pi(a \mid s) = \frac{1}{3}$):**
- $v_{\text{rand}}(s_1) = \frac{1}{3}(10.0) + \frac{1}{3}(4.0) + \frac{1}{3}(-2.0) = \frac{12.0}{3} = +4.0$.
- $v_{\text{rand}}(s_2) = \frac{1}{3}(0.0) + \frac{1}{3}(6.0) + \frac{1}{3}(8.0) = \frac{14.0}{3} \approx +4.667$.

**3. $\epsilon$-Greedy Policy ($\epsilon = 0.30$, 3 actions):**
The greedy action gets probability $1 - \epsilon + \frac{\epsilon}{3} = 1 - 0.30 + 0.10 = 0.80$.
Each non-greedy action gets probability $\frac{\epsilon}{3} = \frac{0.30}{3} = 0.10$.
- For $s_1$:
  $$v_{\epsilon}(s_1) = (0.80)(10.0) + (0.10)(4.0) + (0.10)(-2.0) = 8.0 + 0.40 - 0.20 = +8.20$$
- For $s_2$:
  $$v_{\epsilon}(s_2) = (0.10)(0.0) + (0.10)(6.0) + (0.80)(8.0) = 0.0 + 0.60 + 6.40 = +7.00$$

---

### Example 5.2: Computing $Q(s, a)$ from Known Successor State Values
An autonomous delivery vehicle is at intersection $s$. It can turn Left ($a_L$) or Right ($a_R$).
- Action $a_L$: incurs fuel cost $R = -1.0$. Transitions to state $s_1$ with prob $0.80$, and to $s_2$ with prob $0.20$.
- Action $a_R$: incurs fuel cost $R = -0.5$. Transitions to state $s_2$ with prob $0.60$, and to $s_3$ with prob $0.40$.

From previous calculations, the state values are known:
$$v_\pi(s_1) = +25.0, \quad v_\pi(s_2) = +10.0, \quad v_\pi(s_3) = +40.0$$
Let $\gamma = 0.90$.
Compute $q_\pi(s, a_L)$ and $q_\pi(s, a_R)$.

#### Solution:
Using Bridge 2: $q_\pi(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v_\pi(s')$.

**For Action $a_L$:**
$$q_\pi(s, a_L) = -1.0 + 0.90 \left[ 0.80 v_\pi(s_1) + 0.20 v_\pi(s_2) \right]$$
$$= -1.0 + 0.90 \left[ (0.80)(25.0) + (0.20)(10.0) \right] = -1.0 + 0.90 [20.0 + 2.0] = -1.0 + 0.90(22.0) = -1.0 + 19.8 = +18.8$$

**For Action $a_R$:**
$$q_\pi(s, a_R) = -0.5 + 0.90 \left[ 0.60 v_\pi(s_2) + 0.40 v_\pi(s_3) \right]$$
$$= -0.5 + 0.90 \left[ (0.60)(10.0) + (0.40)(40.0) \right] = -0.5 + 0.90 [6.0 + 16.0] = -0.5 + 0.90(22.0) = -0.5 + 19.8 = +19.3$$

Even though $a_R$ leads to $s_2$ with high probability, the possibility of reaching high-value state $s_3$ ($+40$) combined with lower immediate fuel cost makes $a_R$ superior ($q = 19.3 > 18.8$).

---

### Example 5.3: Computing the Advantage Table and Verifying Zero Mean
Using the Q-table and state values from Example 5.1 under the $\epsilon$-greedy policy ($\epsilon = 0.30$):
For state $s_1$: $q(s_1, a_1) = 10.0, q(s_1, a_2) = 4.0, q(s_1, a_3) = -2.0$, and $v(s_1) = 8.20$.
Action probabilities are $\pi(a_1 \mid s_1) = 0.80, \pi(a_2 \mid s_1) = 0.10, \pi(a_3 \mid s_1) = 0.10$.

1. Compute the advantage $A_\pi(s_1, a)$ for all three actions.
2. Verify that the expectation $\mathbb{E}_{a \sim \pi}[A_\pi(s_1, a)] = 0$.

#### Solution:
**Step 1: Compute Advantages:**
- $A_\pi(s_1, a_1) = q(s_1, a_1) - v(s_1) = 10.0 - 8.20 = +1.80$
- $A_\pi(s_1, a_2) = q(s_1, a_2) - v(s_1) = 4.0 - 8.20 = -4.20$
- $A_\pi(s_1, a_3) = q(s_1, a_3) - v(s_1) = -2.0 - 8.20 = -10.20$

**Step 2: Verify Expectation:**
$$\mathbb{E}_{a \sim \pi}[A_\pi(s_1, a)] = \pi(a_1 \mid s_1) A(s_1, a_1) + \pi(a_2 \mid s_1) A(s_1, a_2) + \pi(a_3 \mid s_1) A(s_1, a_3)$$
$$= (0.80)(+1.80) + (0.10)(-4.20) + (0.10)(-10.20)$$
$$= +1.44 - 0.42 - 1.02 = 1.44 - 1.44 = 0.000 \quad \checkmark$$

---

### Example 5.4: Value Function of a Random Walk on a Line
Consider a 5-state Markov Reward Process:
$$\text{Term}_L \longleftrightarrow s_1 \longleftrightarrow s_2 \longleftrightarrow s_3 \longleftrightarrow \text{Term}_R$$
- States $\mathcal{S} = \{s_1, s_2, s_3\}$.
- From any state $s_i$, the agent moves Left with prob $0.5$ and Right with prob $0.5$.
- Reaching $\text{Term}_L$ yields $R = 0$.
- Reaching $\text{Term}_R$ yields $R = +1$.
- All internal transitions yield $R = 0$.
- Let $\gamma = 1.0$ (undiscounted episodic task).

Write the system of linear equations for $v(s_1), v(s_2), v(s_3)$ and solve analytically.

#### Solution:
By Bridge 1 and 2:
$$v(s_1) = 0.5(0) + 0.5 v(s_2) = 0.5 v(s_2)$$
$$v(s_2) = 0.5 v(s_1) + 0.5 v(s_3)$$
$$v(s_3) = 0.5 v(s_2) + 0.5(1) = 0.5 v(s_2) + 0.5$$

Substitute $v(s_1) = 0.5 v(s_2)$ and $v(s_3) = 0.5 v(s_2) + 0.5$ into the equation for $v(s_2)$:
$$v(s_2) = 0.5(0.5 v(s_2)) + 0.5(0.5 v(s_2) + 0.5) = 0.25 v(s_2) + 0.25 v(s_2) + 0.25 = 0.5 v(s_2) + 0.25$$
$$0.5 v(s_2) = 0.25 \implies v(s_2) = 0.50$$

Back-substitute:
$$v(s_1) = 0.5(0.50) = 0.25$$
$$v(s_3) = 0.5(0.50) + 0.50 = 0.75$$

The values $[0.25, 0.50, 0.75]$ form a linear ramp, reflecting the probability of exiting through the right-hand terminal state $\text{Term}_R$.

---

### Example 5.5: Value Function Under Stochastic Termination
Consider a single non-terminal state $s$ with action $a$.
At each step, taking action $a$ yields immediate reward $R = +10.0$.
With probability $p_{\text{term}} = 0.05$, the environment terminates.
With probability $1 - p_{\text{term}} = 0.95$, the agent remains in state $s$.
Let $\gamma = 0.98$.
Compute the exact value $v(s)$.

#### Solution:
The Bellman equation for $v(s)$ is:
$$v(s) = r(s) + \gamma \sum_{s'} \mathcal{P}_{s, s'} v(s')$$
Since the terminal state has value $v(s_{\text{term}}) = 0$:
$$v(s) = 10.0 + \gamma \left[ (1 - p_{\text{term}}) v(s) + p_{\text{term}} (0) \right]$$
$$v(s) = 10.0 + \gamma (1 - p_{\text{term}}) v(s)$$
Subtracting $\gamma (1 - p_{\text{term}}) v(s)$ from both sides:
$$v(s) [1 - \gamma(1 - p_{\text{term}})] = 10.0$$
$$v(s) = \frac{10.0}{1 - (0.98)(0.95)} = \frac{10.0}{1 - 0.931} = \frac{10.0}{0.069} \approx 144.928$$

---

### Example 5.6: Value Difference Between Two Competing Policies
In a 2-state MDP, an engineer evaluates two policies $\pi_A$ and $\pi_B$.
- Under $\pi_A$: $v_{\pi_A}(s_1) = 100.0, \quad v_{\pi_A}(s_2) = 50.0$.
- Under $\pi_B$: $v_{\pi_B}(s_1) = 80.0, \quad v_{\pi_B}(s_2) = 90.0$.

Can we assert that policy $\pi_A$ is strictly better than $\pi_B$? Explain using the partial ordering of MDP policies.

#### Solution:
In MDP theory, a policy $\pi$ is defined to be better than or equal to $\pi'$ ($\pi \ge \pi'$) if and only if:
$$v_\pi(s) \ge v_{\pi'}(s), \quad \forall s \in \mathcal{S}$$
Here:
- At state $s_1$: $v_{\pi_A}(s_1) = 100.0 > 80.0 = v_{\pi_B}(s_1)$.
- At state $s_2$: $v_{\pi_A}(s_2) = 50.0 < 90.0 = v_{\pi_B}(s_2)$.
Neither policy dominates the other across all states. Thus, $\pi_A$ and $\pi_B$ are **incomparable** under the standard partial order. Which policy is preferred depends entirely on the initial state distribution $\mu_0$:
- If $\mu_0 = [1, 0]$ (always start in $s_1$), $\pi_A$ is preferred ($\mathbb{E}[v] = 100 > 80$).
- If $\mu_0 = [0, 1]$ (always start in $s_2$), $\pi_B$ is preferred ($\mathbb{E}[v] = 90 > 50$).

---

### Example 5.7: Computing Q from Sample Trajectories (Monte Carlo Estimation)
An agent executes 3 independent episodes from state $s$ with action $a$, recording the following returns:
- Episode 1: $G = +14.0$
- Episode 2: $G = +18.0$
- Episode 3: $G = +10.0$

1. Compute the sample-average Monte Carlo estimate $\hat{q}(s, a)$.
2. Compute the sample variance $s^2$ of this estimate.
3. Compute the standard error of the mean $\text{SE} = \frac{s}{\sqrt{N}}$.

#### Solution:
**Step 1: Sample Mean:**
$$\hat{q}(s, a) = \frac{1}{3}(14.0 + 18.0 + 10.0) = \frac{42.0}{3} = 14.0$$

**Step 2: Sample Variance:**
$$s^2 = \frac{1}{N - 1} \sum_{i=1}^3 (G_i - \bar{G})^2 = \frac{1}{2} \left[ (14 - 14)^2 + (18 - 14)^2 + (10 - 14)^2 \right]$$
$$s^2 = \frac{1}{2} [0 + 16 + 16] = \frac{32}{2} = 16.0 \implies s = \sqrt{16} = 4.0$$

**Step 3: Standard Error:**
$$\text{SE} = \frac{s}{\sqrt{N}} = \frac{4.0}{\sqrt{3}} \approx \frac{4.0}{1.732} \approx 2.309$$
The estimated Q-value is $14.0 \pm 2.31$.

---

### Example 5.8: The Dueling Architecture Identity
In deep reinforcement learning, the Dueling DQN architecture (Wang et al., 2016) estimates state values $V(s)$ and advantages $A(s, a)$ with separate neural heads, combining them via:
$$Q(s, a) = V(s) + \left( A(s, a) - \frac{1}{|\mathcal{A}|} \sum_{a' \in \mathcal{A}} A(s, a') \right)$$
Suppose a dueling network outputs scalar $V(s) = 5.0$ and advantage vector $\mathbf{A}(s) = [1.0, 3.0, 2.0]$.
Compute the resulting Q-values $Q(s, a_1), Q(s, a_2), Q(s, a_3)$.

#### Solution:
Mean advantage across all actions:
$$\bar{A}(s) = \frac{1}{3}(1.0 + 3.0 + 2.0) = \frac{6.0}{3} = 2.0$$
Subtract the mean from each advantage:
- $\tilde{A}(s, a_1) = 1.0 - 2.0 = -1.0$
- $\tilde{A}(s, a_2) = 3.0 - 2.0 = +1.0$
- $\tilde{A}(s, a_3) = 2.0 - 2.0 = 0.0$
Add $V(s) = 5.0$:
- $Q(s, a_1) = 5.0 + (-1.0) = 4.0$
- $Q(s, a_2) = 5.0 + (+1.0) = 6.0$
- $Q(s, a_3) = 5.0 + 0.0 = 5.0$

Notice: $\frac{1}{3}(4.0 + 6.0 + 5.0) = \frac{15.0}{3} = 5.0 = V(s)$, preserving the fundamental identity that $V(s)$ represents the baseline expected value.

---

### Example 5.9: Action Selection Under Uncertain Q-Values
An agent maintains Gaussian belief distributions over the action-values of two actions:
- $Q(s, a_1) \sim \mathcal{N}(\mu_1 = 10.0, \sigma_1^2 = 1.0)$
- $Q(s, a_2) \sim \mathcal{N}(\mu_2 = 8.0, \sigma_2^2 = 9.0)$

1. Under greedy selection $\arg\max \mu_a$, which action is chosen?
2. Under Upper Confidence Bound (UCB) selection $a_{\text{UCB}} = \arg\max (\mu_a + 2\sigma_a)$, which action is chosen?
3. What is the probability that $a_2$ is actually superior to $a_1$ ($\mathbb{P}(Q_2 > Q_1)$)?

#### Solution:
**1. Greedy Selection:**
$$\mu_1 = 10.0 > 8.0 = \mu_2 \implies \text{Chooses } a_1$$

**2. UCB Selection:**
- $\text{UCB}(a_1) = 10.0 + 2\sqrt{1.0} = 10.0 + 2.0 = 12.0$
- $\text{UCB}(a_2) = 8.0 + 2\sqrt{9.0} = 8.0 + 2(3.0) = 8.0 + 6.0 = 14.0$
Since $14.0 > 12.0$, UCB chooses $a_2$ to explore its high epistemic uncertainty.

**3. Probability $\mathbb{P}(Q_2 > Q_1)$:**
Define difference variable $D = Q_2 - Q_1$. Since both are independent Gaussians:
$$\mu_D = \mu_2 - \mu_1 = 8.0 - 10.0 = -2.0$$
$$\sigma_D^2 = \sigma_2^2 + \sigma_1^2 = 9.0 + 1.0 = 10.0 \implies \sigma_D = \sqrt{10} \approx 3.162$$
We seek $\mathbb{P}(D > 0)$:
$$z = \frac{0 - \mu_D}{\sigma_D} = \frac{0 - (-2.0)}{3.162} = \frac{2.0}{3.162} \approx 0.6325$$
Using the standard normal CDF $\Phi(z)$:
$$\mathbb{P}(D > 0) = 1 - \Phi(0.6325) \approx 1 - 0.7365 = 0.2635$$
There is a $26.35\%$ chance that $a_2$ is strictly better than $a_1$.

---

### Example 5.10: Value Function Invariance to Constant Offset
Suppose all state values are shifted by a constant $c \in \mathbb{R}$: $\tilde{v}(s) = v(s) + c$.
Prove that the resulting advantages $\tilde{A}(s, a)$ and greedy action rankings are completely unaffected.

#### Solution:
From Bridge 2:
$$\tilde{q}(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a \tilde{v}(s') = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a [v(s') + c]$$
Since $\sum_{s'} \mathcal{P}_{s, s'}^a = 1$:
$$\tilde{q}(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') + \gamma c = q(s, a) + \gamma c$$
Now evaluate the shifted advantage:
$$\tilde{A}(s, a) = \tilde{q}(s, a) - \tilde{v}(s) = [q(s, a) + \gamma c] - [v(s) + c] = q(s, a) - v(s) - (1 - \gamma) c = A(s, a) - (1 - \gamma) c$$
Because the subtracted term $(1 - \gamma) c$ is a constant identical for all actions in state $s$:
$$\arg\max_a \tilde{A}(s, a) = \arg\max_a [A(s, a) - (1 - \gamma)c] = \arg\max_a A(s, a)$$
The relative ranking between actions is preserved invariant.

---

## 5.7 Solved Exercises

### Exercise 5.1: State Value from Two Actions
State $s$ has two actions: $q(s, a_1) = 20, q(s, a_2) = -10$.
If the policy chooses $a_1$ with probability $0.75$, compute $v_\pi(s)$.

#### Solution:
$$v_\pi(s) = 0.75(20) + 0.25(-10) = 15 - 2.5 = 12.5$$

---

### Exercise 5.2: Finding Action-Value from Known Destination
Action $a$ taken in state $s$ gives reward $R = 5$ and deterministically transitions to state $s'$ with known value $v(s') = 100$.
If $\gamma = 0.95$, compute $q(s, a)$.

#### Solution:
$$q(s, a) = 5 + (0.95)(100) = 5 + 95 = 100.0$$

---

### Exercise 5.3: Advantage Sign Verification
If $v_\pi(s) = 14.0$ and $q_\pi(s, a^*) = 18.0$, what is $A_\pi(s, a^*)$? Is this action above or below average?

#### Solution:
$$A_\pi(s, a^*) = 18.0 - 14.0 = +4.0$$
Since $A_\pi(s, a^*) > 0$, this action is strictly above average.

---

### Exercise 5.4: Value of Absorbing Penalty State
An agent enters a trap state $s_{\text{trap}}$ where it remains forever, receiving $R = -2.0$ at every step.
If $\gamma = 0.9$, compute $v(s_{\text{trap}})$.

#### Solution:
$$v(s_{\text{trap}}) = \frac{R}{1 - \gamma} = \frac{-2.0}{1 - 0.9} = \frac{-2.0}{0.1} = -20.0$$

---

### Exercise 5.5: Relationship Between Maximum Q and Optimal V
Prove that for any state $s$:
$$v^*(s) = \max_{a \in \mathcal{A}(s)} q^*(s, a)$$

#### Solution:
By definition, $v^*(s) = \max_\pi v_\pi(s) = \max_\pi \sum_a \pi(a \mid s) q^*(s, a)$.
A convex combination $\sum_a w_a x_a$ with $\sum_a w_a = 1, w_a \ge 0$ is maximized by placing all weight on the maximal element: $\max_{\mathbf{w}} \sum_a w_a x_a = \max_a x_a$.
Therefore, choosing a deterministic policy that places probability 1 on $\arg\max_a q^*(s, a)$ achieves:
$$v^*(s) = \max_{a \in \mathcal{A}(s)} q^*(s, a)$$

---

### Exercise 5.6: Advantage Sum Constraint
In a state with 4 actions, advantages are $A(s, a_1) = +2.0, A(s, a_2) = +1.0, A(s, a_3) = -1.0$.
Under a uniform policy ($\pi(a \mid s) = 0.25$), find the advantage of the fourth action $A(s, a_4)$.

#### Solution:
Under uniform policy, $\sum_{i=1}^4 A(s, a_i) = 0$:
$$2.0 + 1.0 - 1.0 + A(s, a_4) = 0 \implies 2.0 + A(s, a_4) = 0 \implies A(s, a_4) = -2.0$$

---

### Exercise 5.7: Q-Function Redundancy
Why is it possible to choose optimal actions directly from $q^*(s, a)$ without knowing the environment transition probabilities $\mathcal{P}_{s, s'}^a$, whereas choosing optimal actions from $v^*(s)$ requires knowing $\mathcal{P}_{s, s'}^a$?

#### Solution:
To select the optimal action from $q^*$, the agent simply evaluates $\arg\max_a q^*(s, a)$â€”a local one-dimensional lookup.
To select the optimal action from $v^*$, the agent must compute:
$$a^* = \arg\max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v^*(s') \right]$$
This one-step lookahead explicitly requires knowledge of the transition dynamics $\mathcal{P}_{s, s'}^a$ and reward model $r(s, a)$. Thus, $q^*(s, a)$ caches the environment dynamics directly inside the value function, enabling model-free control.

---

### Exercise 5.8: Temporal Difference Error Definition
The 1-step Temporal Difference (TD) error is defined as:
$$\delta_t \doteq R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$$
Prove that if $V(s) = v_\pi(s)$, then $\mathbb{E}_\pi [\delta_t \mid S_t = s] = 0$.

#### Solution:
$$\mathbb{E}_\pi [\delta_t \mid S_t = s] = \mathbb{E}_\pi [R_{t+1} + \gamma v_\pi(S_{t+1}) \mid S_t = s] - v_\pi(s)$$
By the Bellman expectation equation, $v_\pi(s) = \mathbb{E}_\pi [R_{t+1} + \gamma v_\pi(S_{t+1}) \mid S_t = s]$.
Therefore:
$$\mathbb{E}_\pi [\delta_t \mid S_t = s] = v_\pi(s) - v_\pi(s) = 0$$

---

### Exercise 5.9: Action Value under Immediate Negative Penalty
An agent in state $s$ considers an action $a$ that inflicts an immediate catastrophe $R = -100$, but transitions deterministically to a paradise state $s_{\text{paradise}}$ where $v(s_{\text{paradise}}) = +500$.
If $\gamma = 0.9$, compute $q(s, a)$ and determine if the action is desirable if $v(s) = 300$.

#### Solution:
$$q(s, a) = -100 + (0.90)(500) = -100 + 450 = +350.0$$
The advantage is:
$$A(s, a) = q(s, a) - v(s) = 350.0 - 300.0 = +50.0$$
Since $q(s, a) > v(s)$, taking the action is strictly beneficial despite the immediate $-100$ penalty.

---

### Exercise 5.10: Bellman Residual Error Norm
Let $\mathbf{v} \in \mathbb{R}^N$ be an arbitrary candidate value vector.
Define the Bellman residual vector $\mathbf{r}_{\text{res}} \doteq \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v} - \mathbf{v}$.
What is the value of $\|\mathbf{r}_{\text{res}}\|_\infty$ if and only if $\mathbf{v} = \mathbf{v}_\pi$?

#### Solution:
By the Bellman expectation equation in matrix form, $\mathbf{v}_\pi = \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi \iff \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi - \mathbf{v}_\pi = \mathbf{0}$.
Therefore, $\|\mathbf{r}_{\text{res}}\|_\infty = 0$ if and only if $\mathbf{v} = \mathbf{v}_\pi$. For any non-exact estimate, the norm $\|\mathbf{r}_{\text{res}}\|_\infty > 0$ provides a direct measure of estimation error.


# Chapter 6: The Bellman Expectation Equations: Derivations, Matrix Algebra, and Backup Diagrams

---

## 6.1 The Recursive Revolution: Unfolding the Horizon

In 1957, Richard Bellman achieved one of the great conceptual breakthroughs in applied mathematics. Prior to Bellman, calculating the expected return of a sequential decision process required evaluating high-dimensional path integrals over entire trajectory sequencesâ€”a combinatorial impossibility for all but the most trivial toy problems.

Bellman realized that by exploiting the memoryless nature of Markovian systems, **the global infinite-horizon problem collapses into a local two-period recursive relationship**. You do not need to forecast the entire future all at once. You only need to know:
1. What reward will I earn in the immediate next step?
2. What will be the expected value of the state I land in?

```
                               THE BELLMAN RECURSIVE UNFOLDING
                                              â”‚
                      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                      â–¼                                               â–¼
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚     GLOBAL PERSPECTIVE  â”‚                     â”‚    RECURSIVE LOCAL STEP â”‚
         â”‚   Infinite Path Sum     â”‚                     â”‚     Bellman Equation    â”‚
         â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                     â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
         â”‚ E[Î£_{k=0}^âˆž Î³^k R_{t+k}]â”‚     â•â•â•â•â•â•â•â•â•â–º      â”‚ E[ R_{t+1} + Î³ V(S_{t+1})â”‚
         â”‚ Combines entire future  â”‚                     â”‚ Two-period recurrence:  â”‚
         â”‚ in one intractable sum. â”‚                     â”‚ Today + Discounted Tmrw â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 6.2 First-Principles Derivation of the Bellman Expectation Equation for $v_\pi(s)$

We begin with the formal definition of the state-value function under policy $\pi$:
$$v_\pi(s) \doteq \mathbb{E}_\pi [G_t \mid S_t = s]$$

Recall the fundamental recursive decomposition of the cumulative return:
$$G_t = R_{t+1} + \gamma G_{t+1}$$

Substitute this identity directly into the expectation:
$$v_\pi(s) = \mathbb{E}_\pi [R_{t+1} + \gamma G_{t+1} \mid S_t = s]$$

By the linearity of mathematical expectation:
$$v_\pi(s) = \mathbb{E}_\pi [R_{t+1} \mid S_t = s] + \gamma \mathbb{E}_\pi [G_{t+1} \mid S_t = s]$$

Now, invoke the **Law of Total Expectation** (the Tower Property) by conditioning the second expectation on the realized next state $S_{t+1} = s'$:
$$\mathbb{E}_\pi [G_{t+1} \mid S_t = s] = \sum_{s' \in \mathcal{S}} \mathbb{P}(S_{t+1} = s' \mid S_t = s, \pi) \mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s']$$

By the definition of the state-value function at state $s'$:
$$\mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s'] = v_\pi(s')$$

Therefore:
$$v_\pi(s) = \mathbb{E}_\pi [R_{t+1} \mid S_t = s] + \gamma \sum_{s' \in \mathcal{S}} \mathbb{P}(S_{t+1} = s' \mid S_t = s, \pi) v_\pi(s')$$

To express this expectation in terms of explicit MDP transition dynamics, condition on action selection $A_t = a$:
$$\mathbb{P}(S_{t+1} = s', R_{t+1} = r \mid S_t = s, \pi) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) p(s', r \mid s, a)$$

Multiplying by $(r + \gamma v_\pi(s'))$ and summing over all possible actions $a \in \mathcal{A}(s)$, destination states $s' \in \mathcal{S}$, and reward values $r \in \mathcal{R}$, we arrive at the canonical **Bellman Expectation Equation for $v_\pi(s)$**:

$$v_\pi(s) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma v_\pi(s') \right]$$

Equivalently, using the marginalized transition kernel $\mathcal{P}_{s, s'}^a$ and expected reward $r(s, a)$:

$$v_\pi(s) = \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v_\pi(s') \right]$$

---

## 6.3 First-Principles Derivation of the Bellman Expectation Equation for $q_\pi(s, a)$

Now consider the action-value function:
$$q_\pi(s, a) \doteq \mathbb{E}_\pi [G_t \mid S_t = s, A_t = a]$$

Substitute $G_t = R_{t+1} + \gamma G_{t+1}$:
$$q_\pi(s, a) = \mathbb{E}_\pi [R_{t+1} + \gamma G_{t+1} \mid S_t = s, A_t = a]$$

Condition on the environment's response $(S_{t+1} = s', R_{t+1} = r)$:
$$q_\pi(s, a) = \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma \mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s'] \right]$$

By definition, $\mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s'] = v_\pi(s')$. Furthermore, using Bridge 1 ($v_\pi(s') = \sum_{a'} \pi(a' \mid s') q_\pi(s', a')$):
$$\mathbb{E}_\pi [G_{t+1} \mid S_{t+1} = s'] = \sum_{a' \in \mathcal{A}(s')} \pi(a' \mid s') q_\pi(s', a')$$

Substituting this back gives the canonical **Bellman Expectation Equation for $q_\pi(s, a)$**:

$$q_\pi(s, a) = \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma \sum_{a' \in \mathcal{A}(s')} \pi(a' \mid s') q_\pi(s', a') \right]$$

Equivalently:

$$q_\pi(s, a) = r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a \sum_{a' \in \mathcal{A}(s')} \pi(a' \mid s') q_\pi(s', a')$$

---

## 6.4 Visual Semantics: The Backup Diagrams

To build intuitive geometric models of these equations, Sutton & Barto developed **Backup Diagrams**. They are called "backup" diagrams because information flows upward (backward in time) from successor configurations to the root decision node.

```
       BACKUP DIAGRAM FOR v_Ï€(s)                       BACKUP DIAGRAM FOR q_Ï€(s, a)
                 (s)   State Node (Root)                         â—  Action Node (Root)
                /   \                                           / \
        Ï€(a_1) /     \ Ï€(a_2)                                  /   \
              â–¼       â–¼                                       â–¼     â–¼
              â—       â— Action Nodes                        (s_1)   (s_2) Next State Nodes
             / \     / \                                    /   \   /   \
            â–¼   â–¼   â–¼   â–¼                           Ï€(a_1) /     \ /     \ Ï€(a_2)
          (s_1)(s_2)(s_1)(s_2) Next State Nodes       â–¼       â–¼ â–¼     â–¼
                                                      â—       â— â—     â— Next Action Nodes
```

### Visual Convention:
- **Open Circles $\bigcirc$:** Represent **States** ($s \in \mathcal{S}$).
- **Solid Dots $\bullet$:** Represent **Actions** ($a \in \mathcal{A}$).
- **Branching from $\bigcirc \to \bullet$:** Represents the agent's policy choice $\pi(a \mid s)$.
- **Branching from $\bullet \to \bigcirc$:** Represents the environment's stochastic transition dynamics $p(s', r \mid s, a)$.

In the diagram for $v_\pi(s)$, we start at root state $s$, branch across all actions according to $\pi(a \mid s)$, and from each action node, branch across all possible next states according to environmental transition probabilities $\mathcal{P}_{s, s'}^a$. The value at the root is the weighted average of the leaves.

---

## 6.5 Vector-Matrix Formulation of the Bellman Equation

For a finite MDP with $|\mathcal{S}| = N$ states, the Bellman expectation equation for a fixed policy $\pi$ is not merely a scalar relation; it forms an $N$-dimensional system of linear equations.

Recall the policy-induced transition matrix $\mathbf{P}_\pi \in \mathbb{R}^{N \times N}$ and policy-induced reward vector $\mathbf{r}_\pi \in \mathbb{R}^N$:
$$\mathbf{P}_\pi = \begin{bmatrix}
\mathcal{P}_{s_1, s_1}^\pi & \mathcal{P}_{s_1, s_2}^\pi & \dots & \mathcal{P}_{s_1, s_N}^\pi \\
\mathcal{P}_{s_2, s_1}^\pi & \mathcal{P}_{s_2, s_2}^\pi & \dots & \mathcal{P}_{s_2, s_N}^\pi \\
\vdots & \vdots & \ddots & \vdots \\
\mathcal{P}_{s_N, s_1}^\pi & \mathcal{P}_{s_N, s_2}^\pi & \dots & \mathcal{P}_{s_N, s_N}^\pi
\end{bmatrix}, \quad
\mathbf{r}_\pi = \begin{bmatrix} r_\pi(s_1) \\ r_\pi(s_2) \\ \vdots \\ r_\pi(s_N) \end{bmatrix}, \quad
\mathbf{v}_\pi = \begin{bmatrix} v_\pi(s_1) \\ v_\pi(s_2) \\ \vdots \\ v_\pi(s_N) \end{bmatrix}$$

The $N$ scalar equations can be written compactly as a single matrix-vector equation:

$$\mathbf{v}_\pi = \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi$$

```
   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ v(s_1)  â”‚   â”‚ r(s_1)  â”‚             â”‚ P_{11} ... P_{1N} â”‚ â”‚ v(s_1)  â”‚
   â”‚ v(s_2)  â”‚ = â”‚ r(s_2)  â”‚  +  Î³  Â·    â”‚ P_{21} ... P_{2N} â”‚ â”‚ v(s_2)  â”‚
   â”‚  ...    â”‚   â”‚  ...    â”‚             â”‚   ...  ...   ...  â”‚ â”‚  ...    â”‚
   â”‚ v(s_N)  â”‚   â”‚ r(s_N)  â”‚             â”‚ P_{N1} ... P_{NN} â”‚ â”‚ v(s_N)  â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
      v_Ï€           r_Ï€                          P_Ï€              v_Ï€
```

---

## 6.6 The Closed-Form Analytical Solution and Matrix Inversion

To solve for the unknown value vector $\mathbf{v}_\pi$, we rearrange terms algebraically:
$$\mathbf{v}_\pi - \gamma \mathbf{P}_\pi \mathbf{v}_\pi = \mathbf{r}_\pi$$
Factor out $\mathbf{v}_\pi$, where $\mathbf{I} \in \mathbb{R}^{N \times N}$ is the identity matrix:
$$(\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v}_\pi = \mathbf{r}_\pi$$

Assuming the matrix $(\mathbf{I} - \gamma \mathbf{P}_\pi)$ is invertible:

$$\mathbf{v}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$$

### Proof of Invertibility via the Neumann Series
Why is $(\mathbf{I} - \gamma \mathbf{P}_\pi)$ guaranteed to be non-singular for all $\gamma \in [0, 1)$?

**Proof:**
Let $\mathbf{P}_\pi$ be any stochastic matrix. 
By the Gershgorin Circle Theorem or the properties of stochastic matrices, every eigenvalue $\lambda_i$ of $\mathbf{P}_\pi$ satisfies $|\lambda_i| \le 1$.
The eigenvalues of $\gamma \mathbf{P}_\pi$ are $\gamma \lambda_i$.
Because $\gamma \in [0, 1)$, the spectral radius $\rho(\gamma \mathbf{P}_\pi)$ satisfies:
$$\rho(\gamma \mathbf{P}_\pi) = \max_i |\gamma \lambda_i| \le \gamma < 1$$

When the spectral radius of a matrix $\mathbf{A}$ is strictly less than 1, the matrix $(\mathbf{I} - \mathbf{A})$ is strictly invertible, and its inverse is given by the absolutely convergent **Neumann Series**:
$$(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} = \sum_{k=0}^{\infty} (\gamma \mathbf{P}_\pi)^k = \mathbf{I} + \gamma \mathbf{P}_\pi + \gamma^2 \mathbf{P}_\pi^2 + \gamma^3 \mathbf{P}_\pi^3 + \dots$$

Multiplying by $\mathbf{r}_\pi$:
$$\mathbf{v}_\pi = \sum_{k=0}^{\infty} \gamma^k \mathbf{P}_\pi^k \mathbf{r}_\pi$$
This reveals the deep mathematical harmony of reinforcement learning:
- $\mathbf{r}_\pi$ is the reward earned at $t = 0$.
- $\mathbf{P}_\pi \mathbf{r}_\pi$ is the expected reward earned at $t = 1$.
- $\mathbf{P}_\pi^k \mathbf{r}_\pi$ is the expected reward earned at $t = k$.
The matrix inverse $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$ is literally the infinite discounted sum of expected future reward vectors.

### Computational Complexity: The $O(N^3)$ Barrier
If an exact analytical solution exists, why don't we always compute $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$?
- Inverting an $N \times N$ matrix via Gaussian elimination or LU decomposition has computational complexity:
  $$\mathcal{O}(N^3) = \mathcal{O}(|\mathcal{S}|^3)$$
- For a small MDP with $N = 100$ states: $N^3 = 10^6$ operations (instantaneous).
- For an MDP with $N = 10,000$ states: $N^3 = 10^{12}$ operations (requires hours on high-end clusters).
- For a backgammon or chess board: $N \ge 10^{20}$, where $N^3 = 10^{60}$, completely impossible.

This cubic complexity barrier is the computational justification for **Dynamic Programming** and **Iterative Policy Evaluation**, which avoid matrix inversion entirely by computing successive approximations.

---

## 6.7 Worked Examples: Bellman Expectation Matrix Systems

### Example 6.1: Hand Calculation of Closed-Form Matrix Inversion
Consider an MRP with two states $\mathcal{S} = \{s_1, s_2\}$.
Transition matrix: $\mathbf{P} = \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.8 \end{bmatrix}$.
Reward vector: $\mathbf{r} = \begin{bmatrix} 5.0 \\ 1.0 \end{bmatrix}$.
Discount factor: $\gamma = 0.50$.

1. Compute $(\mathbf{I} - \gamma \mathbf{P})$.
2. Compute $\det(\mathbf{I} - \gamma \mathbf{P})$.
3. Invert the matrix analytically.
4. Compute the exact value vector $\mathbf{v} = (\mathbf{I} - \gamma \mathbf{P})^{-1} \mathbf{r}$.

#### Solution:
**Step 1: Compute $(\mathbf{I} - \gamma \mathbf{P})$:**
$$\gamma \mathbf{P} = 0.50 \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.8 \end{bmatrix} = \begin{bmatrix} 0.25 & 0.25 \\ 0.10 & 0.40 \end{bmatrix}$$
$$\mathbf{I} - \gamma \mathbf{P} = \begin{bmatrix} 1 - 0.25 & -0.25 \\ -0.10 & 1 - 0.40 \end{bmatrix} = \begin{bmatrix} 0.75 & -0.25 \\ -0.10 & 0.60 \end{bmatrix}$$

**Step 2: Determinant:**
$$\det(\mathbf{I} - \gamma \mathbf{P}) = (0.75)(0.60) - (-0.25)(-0.10) = 0.450 - 0.025 = 0.425 = \frac{17}{40}$$

**Step 3: Matrix Inverse:**
For a $2 \times 2$ matrix $\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$:
$$(\mathbf{I} - \gamma \mathbf{P})^{-1} = \frac{1}{0.425} \begin{bmatrix} 0.60 & 0.25 \\ 0.10 & 0.75 \end{bmatrix}$$
$$\frac{0.60}{0.425} = \frac{24}{17} \approx 1.4118, \quad \frac{0.25}{0.425} = \frac{10}{17} \approx 0.5882$$
$$\frac{0.10}{0.425} = \frac{4}{17} \approx 0.2353, \quad \frac{0.75}{0.425} = \frac{30}{17} \approx 1.7647$$
$$(\mathbf{I} - \gamma \mathbf{P})^{-1} = \frac{1}{17} \begin{bmatrix} 24 & 10 \\ 4 & 30 \end{bmatrix}$$

**Step 4: Compute $\mathbf{v}$:**
$$\mathbf{v} = \frac{1}{17} \begin{bmatrix} 24 & 10 \\ 4 & 30 \end{bmatrix} \begin{bmatrix} 5.0 \\ 1.0 \end{bmatrix} = \frac{1}{17} \begin{bmatrix} 24(5) + 10(1) \\ 4(5) + 30(1) \end{bmatrix} = \frac{1}{17} \begin{bmatrix} 120 + 10 \\ 20 + 30 \end{bmatrix} = \frac{1}{17} \begin{bmatrix} 130 \\ 50 \end{bmatrix}$$
$$v(s_1) = \frac{130}{17} \approx 7.6471$$
$$v(s_2) = \frac{50}{17} \approx 2.9412$$

---

### Example 6.2: Verifying Bellman Consistency of the Solution
Using the exact values $v(s_1) = \frac{130}{17}$ and $v(s_2) = \frac{50}{17}$ from Example 6.1, substitute them into the right-hand side of the scalar Bellman equation:
$$v_{\text{rhs}}(s) = r(s) + \gamma \sum_{s'} \mathcal{P}_{s, s'} v(s')$$
and verify that $v_{\text{rhs}}(s_1) = v(s_1)$ and $v_{\text{rhs}}(s_2) = v(s_2)$.

#### Solution:
**For state $s_1$:**
$$v_{\text{rhs}}(s_1) = 5.0 + 0.50 \left[ 0.5 v(s_1) + 0.5 v(s_2) \right] = 5.0 + 0.25 [v(s_1) + v(s_2)]$$
$$v(s_1) + v(s_2) = \frac{130 + 50}{17} = \frac{180}{17}$$
$$v_{\text{rhs}}(s_1) = 5.0 + 0.25 \left( \frac{180}{17} \right) = \frac{85}{17} + \frac{45}{17} = \frac{130}{17} = v(s_1) \quad \checkmark$$

**For state $s_2$:**
$$v_{\text{rhs}}(s_2) = 1.0 + 0.50 \left[ 0.2 v(s_1) + 0.8 v(s_2) \right]$$
$$0.2 v(s_1) + 0.8 v(s_2) = \frac{0.2(130) + 0.8(50)}{17} = \frac{26 + 40}{17} = \frac{66}{17}$$
$$v_{\text{rhs}}(s_2) = 1.0 + 0.50 \left( \frac{66}{17} \right) = \frac{17}{17} + \frac{33}{17} = \frac{50}{17} = v(s_2) \quad \checkmark$$
The exact solution satisfies the Bellman expectation equations with zero residual error.

---

### Example 6.3: Neumann Series Truncation vs. Exact Inverse
Using the parameters from Example 6.1 ($\gamma \mathbf{P} = \begin{bmatrix} 0.25 & 0.25 \\ 0.10 & 0.40 \end{bmatrix}$):
1. Compute the first two terms of the Neumann series: $\mathbf{S}_1 = \mathbf{I} + \gamma \mathbf{P}$.
2. Compute the approximate value $\hat{\mathbf{v}}_1 = \mathbf{S}_1 \mathbf{r}$.
3. Compute the approximation error $\|\mathbf{v} - \hat{\mathbf{v}}_1\|_\infty$.

#### Solution:
**Step 1: First Two Terms:**
$$\mathbf{S}_1 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} + \begin{bmatrix} 0.25 & 0.25 \\ 0.10 & 0.40 \end{bmatrix} = \begin{bmatrix} 1.25 & 0.25 \\ 0.10 & 1.40 \end{bmatrix}$$

**Step 2: Approximate Value:**
$$\hat{\mathbf{v}}_1 = \begin{bmatrix} 1.25 & 0.25 \\ 0.10 & 1.40 \end{bmatrix} \begin{bmatrix} 5.0 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 1.25(5) + 0.25(1) \\ 0.10(5) + 1.40(1) \end{bmatrix} = \begin{bmatrix} 6.25 + 0.25 \\ 0.50 + 1.40 \end{bmatrix} = \begin{bmatrix} 6.50 \\ 1.90 \end{bmatrix}$$

**Step 3: Error:**
- State $s_1$: $|7.6471 - 6.50| = 1.1471$.
- State $s_2$: $|2.9412 - 1.90| = 1.0412$.
$$\|\mathbf{v} - \hat{\mathbf{v}}_1\|_\infty = 1.1471$$
Adding higher powers $(\gamma \mathbf{P})^k$ rapidly shrinks this residual to zero.

---

### Example 6.4: 3-State Cyclic MRP Analytical Solution
Consider a cyclic 3-state MRP: $s_1 \to s_2 \to s_3 \to s_1$.
Transition matrix:
$$\mathbf{P} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}, \quad \mathbf{r} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}, \quad \gamma = 0.90$$
Set up the linear system $(\mathbf{I} - \gamma \mathbf{P}) \mathbf{v} = \mathbf{r}$ and solve for $v(s_1), v(s_2), v(s_3)$.

#### Solution:
The scalar Bellman equations are:
$$v_1 = 1 + 0.9 v_2$$
$$v_2 = 2 + 0.9 v_3$$
$$v_3 = 3 + 0.9 v_1$$

Substitute $v_3$ into $v_2$:
$$v_2 = 2 + 0.9(3 + 0.9 v_1) = 2 + 2.7 + 0.81 v_1 = 4.7 + 0.81 v_1$$

Substitute $v_2$ into $v_1$:
$$v_1 = 1 + 0.9(4.7 + 0.81 v_1) = 1 + 4.23 + 0.729 v_1 = 5.23 + 0.729 v_1$$
$$(1 - 0.729) v_1 = 5.23 \implies 0.271 v_1 = 5.23$$
$$v_1 = \frac{5.23}{0.271} \approx 19.2989$$

Now compute $v_2$ and $v_3$:
$$v_2 = 4.7 + 0.81(19.2989) = 4.7 + 15.6321 = 20.3321$$
$$v_3 = 3 + 0.9(19.2989) = 3 + 17.3690 = 20.3690$$

---

### Example 6.5: Policy Comparison via Bellman Systems
An agent can execute policy $\pi_1$ or $\pi_2$ on state space $\mathcal{S} = \{s_1, s_2\}$ with $\gamma = 0.80$:
- Under $\pi_1$: $\mathbf{P}_{\pi_1} = \begin{bmatrix} 0.6 & 0.4 \\ 0.3 & 0.7 \end{bmatrix}, \quad \mathbf{r}_{\pi_1} = \begin{bmatrix} 2.0 \\ 1.0 \end{bmatrix}$.
- Under $\pi_2$: $\mathbf{P}_{\pi_2} = \begin{bmatrix} 0.9 & 0.1 \\ 0.1 & 0.9 \end{bmatrix}, \quad \mathbf{r}_{\pi_2} = \begin{bmatrix} 1.0 \\ 3.0 \end{bmatrix}$.

Solve both linear systems and determine if one policy strictly dominates the other.

#### Solution:
**1. Solve for $\pi_1$:**
$$\mathbf{I} - 0.8 \mathbf{P}_{\pi_1} = \begin{bmatrix} 1 - 0.48 & -0.32 \\ -0.24 & 1 - 0.56 \end{bmatrix} = \begin{bmatrix} 0.52 & -0.32 \\ -0.24 & 0.44 \end{bmatrix}$$
$\det = (0.52)(0.44) - (0.32)(0.24) = 0.2288 - 0.0768 = 0.1520$.
$$\mathbf{v}_{\pi_1} = \frac{1}{0.1520} \begin{bmatrix} 0.44 & 0.32 \\ 0.24 & 0.52 \end{bmatrix} \begin{bmatrix} 2.0 \\ 1.0 \end{bmatrix} = \frac{1}{0.1520} \begin{bmatrix} 0.88 + 0.32 \\ 0.48 + 0.52 \end{bmatrix} = \frac{1}{0.1520} \begin{bmatrix} 1.20 \\ 1.00 \end{bmatrix}$$
$$v_{\pi_1}(s_1) = \frac{1.20}{0.1520} \approx 7.8947, \quad v_{\pi_1}(s_2) = \frac{1.00}{0.1520} \approx 6.5789$$

**2. Solve for $\pi_2$:**
$$\mathbf{I} - 0.8 \mathbf{P}_{\pi_2} = \begin{bmatrix} 1 - 0.72 & -0.08 \\ -0.08 & 1 - 0.72 \end{bmatrix} = \begin{bmatrix} 0.28 & -0.08 \\ -0.08 & 0.28 \end{bmatrix}$$
$\det = (0.28)^2 - (-0.08)^2 = 0.0784 - 0.0064 = 0.0720$.
$$\mathbf{v}_{\pi_2} = \frac{1}{0.0720} \begin{bmatrix} 0.28 & 0.08 \\ 0.08 & 0.28 \end{bmatrix} \begin{bmatrix} 1.0 \\ 3.0 \end{bmatrix} = \frac{1}{0.0720} \begin{bmatrix} 0.28 + 0.24 \\ 0.08 + 0.84 \end{bmatrix} = \frac{1}{0.0720} \begin{bmatrix} 0.52 \\ 0.92 \end{bmatrix}$$
$$v_{\pi_2}(s_1) = \frac{0.52}{0.0720} \approx 7.2222, \quad v_{\pi_2}(s_2) = \frac{0.92}{0.0720} \approx 12.7778$$

**Comparison:**
- In $s_1$: $v_{\pi_1}(s_1) = 7.89 > 7.22 = v_{\pi_2}(s_1)$ ($\pi_1$ is superior in $s_1$).
- In $s_2$: $v_{\pi_2}(s_2) = 12.78 > 6.58 = v_{\pi_1}(s_2)$ ($\pi_2$ is superior in $s_2$).
Neither policy strictly dominates. A hybrid policy that takes $\pi_1$'s action in $s_1$ and $\pi_2$'s action in $s_2$ will outperform both.

---

### Example 6.6: Bellman Equation for Deterministic Gridworld
Consider a $2 \times 2$ Gridworld:
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”
â”‚  s_1  â”‚  s_2  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  s_3  â”‚  s_4  â”‚  (s_4 is absorbing terminal)
â””â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”˜
```
- Movement into walls keeps the agent in place.
- Reaching $s_4$ yields $R = 0$.
- All other steps yield $R = -1.0$.
- Discount factor $\gamma = 1.0$.
- Let policy $\pi$ always command: in $s_1 \to \text{Right} (s_2)$; in $s_2 \to \text{Down} (s_4)$; in $s_3 \to \text{Right} (s_4)$.

Set up the Bellman expectation system and solve for $v(s_1), v(s_2), v(s_3)$.

#### Solution:
Since $s_4$ is terminal, $v(s_4) = 0$.
- For $s_2$: takes agent directly to $s_4$:
  $$v(s_2) = -1.0 + 1.0 \cdot v(s_4) = -1.0 + 0 = -1.0$$
- For $s_1$: takes agent to $s_2$:
  $$v(s_1) = -1.0 + 1.0 \cdot v(s_2) = -1.0 + (-1.0) = -2.0$$
- For $s_3$: takes agent directly to $s_4$:
  $$v(s_3) = -1.0 + 1.0 \cdot v(s_4) = -1.0 + 0 = -1.0$$
The values directly count the negative steps to the goal: $v = [-2.0, -1.0, -1.0, 0.0]^T$.

---

### Example 6.7: The Spectral Radius Condition
Prove that if $\gamma = 1.0$ and the Markov chain contains an absorbing terminal state reachable from every transient state with non-zero probability, the sub-matrix $(\mathbf{I} - \mathbf{Q})$ governing transient states is non-singular.

#### Solution:
Let $\mathbf{Q} \in \mathbb{R}^{m \times m}$ be the transition sub-matrix among the $m$ transient states.
Because the chain can transition from transient states to absorbing states with positive probability, there exists at least one transient state $i$ where $\sum_{j=1}^m Q_{ij} < 1$.
Furthermore, reachability implies that there exists an integer $k \ge 1$ such that every row of $\mathbf{Q}^k$ has sum strictly less than 1:
$$\max_i \sum_{j=1}^m (\mathbf{Q}^k)_{ij} \le c < 1$$
Therefore, the induced matrix norm $\|\mathbf{Q}^k\|_\infty < 1$.
By Gelfand's formula for the spectral radius:
$$\rho(\mathbf{Q}) = \lim_{n \to \infty} \|\mathbf{Q}^n\|^{1/n} \le (\|\mathbf{Q}^k\|_\infty)^{1/k} < 1$$
Since the spectral radius of $\mathbf{Q}$ is strictly less than 1, $\det(\mathbf{I} - \mathbf{Q}) \neq 0$, and $(\mathbf{I} - \mathbf{Q})$ is strictly invertible even with $\gamma = 1.0$.

---

### Example 6.8: Deriving Action-Values from Matrix Solutions
Using the value vector $\mathbf{v} = [7.6471, 2.9412]^T$ from Example 6.1 and the transition matrix $\mathbf{P} = \begin{bmatrix} 0.5 & 0.5 \\ 0.2 & 0.8 \end{bmatrix}$:
Compute the Q-values $q(s_1, a)$ and $q(s_2, a)$ where $a$ is the action executed under the MRP.

#### Solution:
By Bridge 2:
$$q(s_1, a) = r(s_1) + \gamma [0.5 v(s_1) + 0.5 v(s_2)]$$
$$= 5.0 + 0.50 [0.5(7.6471) + 0.5(2.9412)] = 5.0 + 0.50(5.29415) = 5.0 + 2.6471 = 7.6471 = v(s_1)$$
$$q(s_2, a) = r(s_2) + \gamma [0.2 v(s_1) + 0.8 v(s_2)]$$
$$= 1.0 + 0.50 [0.2(7.6471) + 0.8(2.9412)] = 1.0 + 0.50 [1.5294 + 2.3530] = 1.0 + 0.50(3.8824) = 1.0 + 1.9412 = 2.9412 = v(s_2)$$
In an MRP with a single action per state, $q(s, a) \equiv v(s)$.

---

### Example 6.9: Sensitivity of Value Functions to Transition Perturbations
Suppose an environment's transition probability $\mathcal{P}_{11}$ is perturbed by a small $\Delta p$: $\tilde{\mathbf{P}} = \mathbf{P} + \Delta \mathbf{P}$.
Using the matrix calculus derivative of an inverse: $\frac{\partial \mathbf{A}^{-1}}{\partial x} = -\mathbf{A}^{-1} \frac{\partial \mathbf{A}}{\partial x} \mathbf{A}^{-1}$, derive the first-order variation in the value vector $\Delta \mathbf{v}_\pi$.

#### Solution:
We have $\mathbf{v}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$.
Let $\mathbf{A} = (\mathbf{I} - \gamma \mathbf{P}_\pi)$. Then $\Delta \mathbf{A} = -\gamma \Delta \mathbf{P}_\pi$.
Using $\Delta (\mathbf{A}^{-1}) \approx -\mathbf{A}^{-1} (\Delta \mathbf{A}) \mathbf{A}^{-1}$:
$$\Delta (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \approx -(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} (-\gamma \Delta \mathbf{P}_\pi) (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} = \gamma (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \Delta \mathbf{P}_\pi (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$$
Multiplying by $\mathbf{r}_\pi$, and recognizing that $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi = \mathbf{v}_\pi$:
$$\Delta \mathbf{v}_\pi \approx \gamma (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \Delta \mathbf{P}_\pi \mathbf{v}_\pi$$
The variation in state values is amplified by the resolvent matrix $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$, which has norm scaling as $O(\frac{1}{1 - \gamma})$.

---

### Example 6.10: Solving Bellman System via Gaussian Elimination
Solve the $3 \times 3$ Bellman system $\mathbf{A} \mathbf{v} = \mathbf{r}$ where:
$$\mathbf{A} = \begin{bmatrix} 1.0 & -0.4 & 0.0 \\ 0.0 & 1.0 & -0.5 \\ -0.2 & 0.0 & 1.0 \end{bmatrix}, \quad \mathbf{r} = \begin{bmatrix} 2.0 \\ 1.0 \\ 3.0 \end{bmatrix}$$

#### Solution:
Write the augmented matrix:
$$\left[ \begin{array}{ccc|c} 1.0 & -0.4 & 0.0 & 2.0 \\ 0.0 & 1.0 & -0.5 & 1.0 \\ -0.2 & 0.0 & 1.0 & 3.0 \end{array} \right]$$
Row 3 $\leftarrow$ Row 3 $+ 0.2 \times$ Row 1:
$$-0.2 + 0.2(1.0) = 0.0$$
$$0.0 + 0.2(-0.4) = -0.08$$
$$1.0 + 0.2(0.0) = 1.0$$
$$3.0 + 0.2(2.0) = 3.4$$
New Row 3: $[0.0, -0.08, 1.0 \mid 3.4]$.

Row 3 $\leftarrow$ Row 3 $+ 0.08 \times$ Row 2:
$$0.0 + 0.08(0.0) = 0.0$$
$$-0.08 + 0.08(1.0) = 0.0$$
$$1.0 + 0.08(-0.5) = 1.0 - 0.04 = 0.96$$
$$3.4 + 0.08(1.0) = 3.4 + 0.08 = 3.48$$

Back-substitution:
$$0.96 v_3 = 3.48 \implies v_3 = \frac{3.48}{0.96} = 3.625$$
From Row 2:
$$v_2 - 0.5 v_3 = 1.0 \implies v_2 = 1.0 + 0.5(3.625) = 1.0 + 1.8125 = 2.8125$$
From Row 1:
$$v_1 - 0.4 v_2 = 2.0 \implies v_1 = 2.0 + 0.4(2.8125) = 2.0 + 1.125 = 3.125$$
Solution: $\mathbf{v} = [3.125, 2.8125, 3.625]^T$.

---

## 6.8 Solved Exercises

### Exercise 6.1: Bellman Equation Formulation
Write the scalar Bellman expectation equation for a state $s$ where policy $\pi$ selects action $a_1$ with prob $0.6$ and $a_2$ with prob $0.4$, given immediate rewards $r(s, a_1) = 2, r(s, a_2) = -1$, and $\gamma = 0.9$.

#### Solution:
$$v_\pi(s) = 0.6 \left[ 2.0 + 0.9 \sum_{s'} \mathcal{P}_{s, s'}^{a_1} v_\pi(s') \right] + 0.4 \left[ -1.0 + 0.9 \sum_{s'} \mathcal{P}_{s, s'}^{a_2} v_\pi(s') \right]$$
$$v_\pi(s) = (1.2 - 0.4) + 0.9 \left[ 0.6 \sum_{s'} \mathcal{P}_{s, s'}^{a_1} v_\pi(s') + 0.4 \sum_{s'} \mathcal{P}_{s, s'}^{a_2} v_\pi(s') \right]$$
$$v_\pi(s) = 0.8 + 0.54 \sum_{s'} \mathcal{P}_{s, s'}^{a_1} v_\pi(s') + 0.36 \sum_{s'} \mathcal{P}_{s, s'}^{a_2} v_\pi(s')$$

---

### Exercise 6.2: 1-State Infinite Loop Value
A single-state MDP loops back to itself with probability 1.0 and reward $R = 4.0$. If $\gamma = 0.75$, compute $v(s)$ using the Bellman equation.

#### Solution:
$$v(s) = 4.0 + 0.75 v(s) \implies (1 - 0.75) v(s) = 4.0 \implies 0.25 v(s) = 4.0 \implies v(s) = 16.0$$

---

### Exercise 6.3: Gershgorin Disc Bounds on Eigenvalues
Use Gershgorin's Circle Theorem to prove that no eigenvalue of a stochastic matrix $\mathbf{P}$ can have magnitude strictly greater than 1.

#### Solution:
By Gershgorin's theorem, every eigenvalue of $\mathbf{P}$ lies within at least one disc $D_i = \{z \in \mathbb{C} : |z - P_{ii}| \le \sum_{j \neq i} P_{ij}\}$.
For any stochastic matrix, all entries $P_{ij} \ge 0$ and $\sum_j P_{ij} = 1 \implies \sum_{j \neq i} P_{ij} = 1 - P_{ii}$.
Thus, for any $z \in D_i$:
$$|z| \le |z - P_{ii}| + |P_{ii}| \le (1 - P_{ii}) + P_{ii} = 1$$
Therefore, $|\lambda| \le 1$ for all eigenvalues.

---

### Exercise 6.4: Resolvent Series Expansion
Given $\mathbf{P} = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}$ and $\gamma = 0.5$, calculate the 3rd-order truncated series $\mathbf{S}_2 = \mathbf{I} + \gamma \mathbf{P} + \gamma^2 \mathbf{P}^2$.

#### Solution:
Note that $\mathbf{P}^2 = \mathbf{I}$.
$$\mathbf{S}_2 = \mathbf{I} + 0.5 \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} + 0.25 \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1.25 & 0.50 \\ 0.50 & 1.25 \end{bmatrix}$$

---

### Exercise 6.5: Direct Inversion Infeasibility
If an algorithm requires $N^3$ floating-point operations to invert an $N \times N$ matrix, and a supercomputer performs $10^{15}$ operations per second (1 PFLOPS), calculate the computation time for $N = 10^7$ states.

#### Solution:
$$\text{Operations} = (10^7)^3 = 10^{21} \text{ FLOPs}$$
$$\text{Time} = \frac{10^{21}}{10^{15}} = 10^6 \text{ seconds} \approx 11.57 \text{ days}$$

---

### Exercise 6.6: Bellman Equation for Terminal States
Why does the Bellman equation for a terminal state $s_T$ not require recursive successor evaluation?

#### Solution:
By definition of an absorbing terminal state, once entered, no further transitions occur and all future rewards are identically zero ($R_{t+k} = 0, \forall k \ge 1$). Thus, the cumulative return $G_t \equiv 0$, fixing $v_\pi(s_T) = 0$ as a known constant boundary condition without recursion.

---

### Exercise 6.7: Action-Value Matrix System
Can action-values $q_\pi(s, a)$ also be written as a linear system $\mathbf{q}_\pi = \mathbf{r}_{SA} + \gamma \mathbf{P}_{SA} \mathbf{q}_\pi$? State the dimensions of $\mathbf{P}_{SA}$.

#### Solution:
Yes. Let there be $|\mathcal{S}|$ states and $|\mathcal{A}|$ actions, yielding $|\mathcal{S}| \times |\mathcal{A}|$ state-action pairs.
$$\mathbf{P}_{SA}((s, a), (s', a')) = \mathcal{P}_{s, s'}^a \pi(a' \mid s')$$
The matrix $\mathbf{P}_{SA}$ is a square stochastic matrix of size $(|\mathcal{S}| \cdot |\mathcal{A}|) \times (|\mathcal{S}| \cdot |\mathcal{A}|)$.

---

### Exercise 6.8: Symmetry in State Values
If an environment is perfectly symmetric between states $s_1$ and $s_2$ ($r(s_1) = r(s_2)$, $\mathcal{P}_{11} = \mathcal{P}_{22}$, and $\mathcal{P}_{12} = \mathcal{P}_{21}$), prove that $v(s_1) = v(s_2)$ for any discount factor $\gamma < 1$.

#### Solution:
The Bellman equations are:
$$v(s_1) = r + \gamma [\mathcal{P}_{11} v(s_1) + \mathcal{P}_{12} v(s_2)]$$
$$v(s_2) = r + \gamma [\mathcal{P}_{21} v(s_1) + \mathcal{P}_{22} v(s_2)] = r + \gamma [\mathcal{P}_{12} v(s_1) + \mathcal{P}_{11} v(s_2)]$$
Subtracting the two equations:
$$v(s_1) - v(s_2) = \gamma (\mathcal{P}_{11} - \mathcal{P}_{12}) [v(s_1) - v(s_2)]$$
$$[v(s_1) - v(s_2)] [1 - \gamma (\mathcal{P}_{11} - \mathcal{P}_{12})] = 0$$
Since $|\mathcal{P}_{11} - \mathcal{P}_{12}| \le 1$ and $\gamma < 1$, the second factor is strictly positive ($1 - \gamma (\dots) > 0$).
Therefore, $v(s_1) - v(s_2) = 0 \implies v(s_1) = v(s_2)$.

---

### Exercise 6.9: Effect of Increasing Discount Factor on Matrix Condition Number
What happens to the condition number $\kappa(\mathbf{I} - \gamma \mathbf{P})$ as $\gamma \to 1^-$?

#### Solution:
As $\gamma \to 1$, the smallest eigenvalue of $(\mathbf{I} - \gamma \mathbf{P})$ approaches $1 - \gamma \to 0$ (since $\mathbf{P}$ has an eigenvalue $\lambda = 1$).
The condition number $\kappa = \frac{\sigma_{\max}}{\sigma_{\min}} \approx \frac{O(1)}{1 - \gamma} \to \infty$.
The matrix becomes severely ill-conditioned, amplifying numerical rounding errors.

---

### Exercise 6.10: Uniqueness of Bellman Solution
Prove that the system $(\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v} = \mathbf{r}_\pi$ cannot have multiple distinct solutions for $\gamma \in [0, 1)$.

#### Solution:
Suppose there exist two distinct solutions $\mathbf{u} \neq \mathbf{v}$ such that:
$$(\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{u} = \mathbf{r}_\pi \quad \text{and} \quad (\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v} = \mathbf{r}_\pi$$
Subtracting the two equations yields:
$$(\mathbf{I} - \gamma \mathbf{P}_\pi) (\mathbf{u} - \mathbf{v}) = \mathbf{0}$$
Since $\det(\mathbf{I} - \gamma \mathbf{P}_\pi) \neq 0$ (all eigenvalues are non-zero), the null space of $(\mathbf{I} - \gamma \mathbf{P}_\pi)$ contains only the trivial vector $\mathbf{0}$.
Therefore, $\mathbf{u} - \mathbf{v} = \mathbf{0} \implies \mathbf{u} = \mathbf{v}$. The solution is strictly unique.


# Chapter 7: The Bellman Optimality Equations: Non-Linearity, Partial Ordering, and Optimal Policies

---

## 7.1 The Quest for the Optimal Policy: Partial Ordering of Strategies

In Chapter 6, we derived the Bellman Expectation Equations for evaluating a fixed, arbitrary policy $\pi$. However, the ultimate purpose of reinforcement learning is not merely to evaluate an arbitrary strategy, but to **discover the best possible strategy**.

What does it mean for one policy to be "better" than another?

```
                                PARTIAL ORDERING OF POLICIES
                                              â”‚
              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â–¼                                                               â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚    STRICT DOMINANCE      â”‚                                    â”‚   INCOMPARABLE POLICIES  â”‚
 â”‚     Ï€_1 â‰¥ Ï€_2            â”‚                                    â”‚    Ï€_A vs Ï€_B            â”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                                    â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ v_{Ï€_1}(s) â‰¥ v_{Ï€_2}(s)  â”‚                                    â”‚ v(s_1) higher for Ï€_A,   â”‚
 â”‚ FOR ALL states s âˆˆ S.    â”‚                                    â”‚ v(s_2) higher for Ï€_B.   â”‚
 â”‚ Unambiguously superior.  â”‚                                    â”‚ Trade-off depends on     â”‚
 â”‚                          â”‚                                    â”‚ initial distribution.    â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The Partial Order Definition
In decision theory and functional analysis, policies are compared via a **partial order** $\ge$ defined over their value functions:

$$\pi \ge \pi' \iff v_\pi(s) \ge v_{\pi'}(s), \quad \forall s \in \mathcal{S}$$

A policy $\pi$ is superior to policy $\pi'$ if and only if its expected return is greater than or equal to that of $\pi'$ **simultaneously in every single state of the universe**. 

If policy $\pi_A$ achieves higher return than $\pi_B$ in state $s_1$, but $\pi_B$ achieves higher return in state $s_2$, the two policies are **incomparable**. In general, a partially ordered set does not guarantee the existence of a greatest element. A priori, one might fear that no single policy could ever dominate all other policies everywhereâ€”that an agent would always have to sacrifice performance in state $s_2$ to excel in state $s_1$.

---

## 7.2 The Fundamental Theorem of Optimal Policies

Remarkably, the Markovian structure of MDPs guarantees that this trade-off never occurs.

> [!IMPORTANT]
> **Theorem (Existence of an Optimal Policy):** 
> For any finite Markov Decision Process with discount factor $\gamma \in [0, 1)$:
> 1. There exists at least one policy $\pi^*$ that is optimal: $\pi^* \ge \pi$ for all policies $\pi$.
> 2. All optimal policies achieve the identical, unique optimal state-value function $v^*(s) \doteq \max_\pi v_\pi(s)$ for all $s \in \mathcal{S}$.
> 3. All optimal policies achieve the identical, unique optimal action-value function $q^*(s, a) \doteq \max_\pi q_\pi(s, a)$ for all $s \in \mathcal{S}, a \in \mathcal{A}$.
> 4. There exists at least one optimal policy $\pi^*$ that is **stationary and deterministic**.

This theorem is profound: no matter how vast or complex the finite MDP, the agent never needs a stochastic policy or a non-stationary clock-dependent policy to act optimally. A simple, static lookup table $a^* = \pi^*(s)$ suffices to achieve global theoretical perfection.

---

## 7.3 Derivation of the Bellman Optimality Equations

How do we mathematically characterize the optimal value functions $v^*(s)$ and $q^*(s, a)$?

```
      BELLMAN OPTIMALITY BACKUP FOR v*(s)               BELLMAN OPTIMALITY BACKUP FOR q*(s, a)
                 (s)   Root State Node                            â—  Root Action Node
                / | \                                            / \
               /  |  \                                          /   \
              / arc:  \  max_{a}                               â–¼     â–¼
             â–¼    â–¼    â–¼                                     (s_1)   (s_2) Next State Nodes
             â—    â—    â— Action Nodes                        / | \   / | \
            / \  / \  / \                                   /  |  \ /  |  \  max_{a'}
           â–¼   â–¼â–¼   â–¼â–¼   â–¼                                 â–¼   â–¼  â–¼â–¼   â–¼  â–¼
          Next State Nodes (s')                             Action Nodes â—
```

### Derivation for $v^*(s)$
By definition:
$$v^*(s) = \max_{\pi} v_\pi(s)$$

Recall that under any policy $\pi$, $v_\pi(s) = \sum_a \pi(a \mid s) q_\pi(s, a)$.
To maximize this weighted sum over probability distributions $\pi(\cdot \mid s)$, we place all probability mass ($1.0$) on the action that maximizes $q^*(s, a)$:
$$v^*(s) = \max_{a \in \mathcal{A}(s)} q^*(s, a)$$

Now, substitute Bridge 2 ($q^*(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v^*(s')$) into this relation:

$$v^*(s) = \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v^*(s') \right]$$

In terms of the full joint transition distribution $p(s', r \mid s, a)$:

$$v^*(s) = \max_{a \in \mathcal{A}(s)} \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma v^*(s') \right]$$

This is the **Bellman Optimality Equation for $v^*(s)$**. It expresses the self-consistency condition: the optimal value of state $s$ must equal the expected return for the best action from that state.

### Derivation for $q^*(s, a)$
By definition:
$$q^*(s, a) = \max_\pi q_\pi(s, a)$$

Recall Bridge 2:
$$q^*(s, a) = r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v^*(s')$$

Substitute the identity $v^*(s') = \max_{a' \in \mathcal{A}(s')} q^*(s', a')$:

$$q^*(s, a) = r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a \max_{a' \in \mathcal{A}(s')} q^*(s', a')$$

In terms of joint probabilities:

$$q^*(s, a) = \sum_{s' \in \mathcal{S}} \sum_{r \in \mathcal{R}} p(s', r \mid s, a) \left[ r + \gamma \max_{a' \in \mathcal{A}(s')} q^*(s', a') \right]$$

This is the **Bellman Optimality Equation for $q^*(s, a)$**.

---

## 7.4 The Non-Linearity Barrier: Why Matrix Inversion Collapses

Observe the fundamental structural difference between the Bellman Expectation Equation (Chapter 6) and the Bellman Optimality Equation:

| Property | Bellman Expectation Equation | Bellman Optimality Equation |
| :--- | :--- | :--- |
| **Mathematical Nature** | Linear system of $N$ equations | **Non-linear** system of $N$ equations |
| **Action Aggregation** | Expectation $\sum_a \pi(a \mid s) \dots$ | **Maximum operator** $\max_{a \in \mathcal{A}(s)} \dots$ |
| **Matrix Representation** | $\mathbf{v}_\pi = \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi$ | $\mathbf{v}^* = \max_{\mathbf{a}} [\mathbf{r}_{\mathbf{a}} + \gamma \mathbf{P}_{\mathbf{a}} \mathbf{v}^*]$ |
| **Closed-Form Solution** | $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$ | **No closed-form matrix inverse exists!** |

The maximum operator $\max(x, y)$ is non-linear:
$$\max(x_1 + x_2, y_1 + y_2) \neq \max(x_1, y_1) + \max(x_2, y_2)$$
Because of this non-linearity, we cannot factor out $\mathbf{v}^*$ to write $(\mathbf{I} - \dots)^{-1}$. 

You cannot solve the Bellman Optimality Equation in one shot using linear algebra. To solve it, we must turn to:
1. **Dynamic Programming:** Value Iteration and Policy Iteration (Chapters 8â€“10).
2. **Linear Programming:** Formulating the MDP as an optimization problem $\min \sum_s v(s)$ subject to $v(s) \ge r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s')$.
3. **Reinforcement Learning:** Model-free temporal difference learning (Q-Learning, Chapter 11).

---

## 7.5 Extracting the Optimal Policy from $v^*$ and $q^*$

Once the optimal value functions are known, how does the agent select its actions?

```
               POLICY EXTRACTION FROM OPTIMAL VALUE FUNCTIONS
                                      â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â–¼                                                   â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚   EXTRACTION FROM v*  â”‚                             â”‚   EXTRACTION FROM q*  â”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                             â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ Model-dependent:      â”‚                             â”‚ Model-free:           â”‚
 â”‚ Needs P_{s,s'}^a and  â”‚                             â”‚ Needs NO knowledge of â”‚
 â”‚ reward function r.    â”‚                             â”‚ environment dynamics! â”‚
 â”‚                       â”‚                             â”‚                       â”‚
 â”‚ Ï€*(s) = argmax_a [    â”‚                             â”‚ Ï€*(s) = argmax_a      â”‚
 â”‚   r(s, a) +           â”‚                             â”‚       q*(s, a)        â”‚
 â”‚   Î³ Î£_{s'} P v*(s') ] â”‚                             â”‚                       â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Extraction from $q^*(s, a)$ (Model-Free):
If the agent possesses $q^*(s, a)$, policy extraction is completely trivial. The agent does not need to know transition probabilities or physics:
$$\pi^*(s) = \arg\max_{a \in \mathcal{A}(s)} q^*(s, a)$$
The agent simply reads the numbers in row $s$ of its Q-table and selects the column with the highest value.

### Extraction from $v^*(s)$ (Model-Based):
If the agent only possesses $v^*(s)$, it must perform a **one-step lookahead search**:
$$\pi^*(s) = \arg\max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v^*(s') \right]$$
This requires an explicit internal model of transition probabilities $\mathcal{P}_{s, s'}^a$ and expected rewards $r(s, a)$.

---

## 7.6 Worked Examples: Bellman Optimality Systems

### Example 7.1: Solving a 2-State Bellman Optimality System by Hand
Consider an MDP with states $\mathcal{S} = \{s_1, s_2\}$.
- In state $s_1$:
  - Action $a_1$: transitions to $s_1$ with prob $1.0$, reward $R = 2.0$.
  - Action $a_2$: transitions to $s_2$ with prob $1.0$, reward $R = 0.0$.
- In state $s_2$:
  - Action $a_1$: transitions to $s_2$ with prob $1.0$, reward $R = 1.0$.
  - Action $a_2$: transitions to $s_1$ with prob $1.0$, reward $R = 3.0$.
Discount factor $\gamma = 0.90$.

Write the Bellman optimality equations for $v^*(s_1)$ and $v^*(s_2)$ and solve analytically.

#### Solution:
**Step 1: Write Equations:**
$$v^*(s_1) = \max \begin{cases} q^*(s_1, a_1) = 2.0 + 0.90 v^*(s_1) \\ q^*(s_1, a_2) = 0.0 + 0.90 v^*(s_2) \end{cases}$$
$$v^*(s_2) = \max \begin{cases} q^*(s_2, a_1) = 1.0 + 0.90 v^*(s_2) \\ q^*(s_2, a_2) = 3.0 + 0.90 v^*(s_1) \end{cases}$$

**Step 2: Test Candidate Policy Hypothesis:**
Because $a_1$ in $s_1$ gives $+2$ and stays in $s_1$, while $a_2$ in $s_2$ gives $+3$ and transitions to $s_1$, hypothesize that:
- In $s_1$, optimal action is $a_1$.
- In $s_2$, optimal action is $a_2$.

Under this hypothesis:
$$v(s_1) = 2.0 + 0.90 v(s_1) \implies 0.10 v(s_1) = 2.0 \implies v(s_1) = 20.0$$
Now compute $v(s_2)$:
$$v(s_2) = 3.0 + 0.90 v(s_1) = 3.0 + 0.90(20.0) = 3.0 + 18.0 = 21.0$$

**Step 3: Verify Optimality Condition:**
Now check whether the hypothesized actions achieve the maximum:
- In state $s_1$:
  - $q(s_1, a_1) = 2.0 + 0.90(20.0) = 20.0$.
  - $q(s_1, a_2) = 0.0 + 0.90(21.0) = 18.9$.
  Since $20.0 > 18.9$, $a_1$ is indeed maximal! $\checkmark$
- In state $s_2$:
  - $q(s_2, a_1) = 1.0 + 0.90(21.0) = 1.0 + 18.9 = 19.9$.
  - $q(s_2, a_2) = 3.0 + 0.90(20.0) = 21.0$.
  Since $21.0 > 19.9$, $a_2$ is indeed maximal! $\checkmark$

The unique optimal values are:
$$v^*(s_1) = 20.0, \quad v^*(s_2) = 21.0$$
The unique optimal deterministic policy is:
$$\pi^*(s_1) = a_1, \quad \pi^*(s_2) = a_2$$

---

### Example 7.2: Cliff Walking MDP Path Choice
In a cliff-walking environment, an agent at start cell $S$ can choose between:
- Safe Path: 4 steps, each with reward $R = -1.0$. Transition is deterministic.
- Cliff Path: 2 steps. Step 1 has a $10\%$ wind gust that blows the agent off the cliff into the sea (reward $-100.0$, resets to start $S$). With $90\%$ probability, it succeeds ($R = -1.0$). Step 2 lands on goal ($R = +10.0$).
Terminal state follows immediately upon reaching goal. Let $\gamma = 1.0$.

1. Compute $v^*(S)$ under the Safe Path.
2. Formulate the recursive value equation for the Cliff Path and solve for $v(S)$.
3. Determine which path is chosen by the Bellman optimality criterion.

#### Solution:
**Step 1: Safe Path Value:**
$$v_{\text{safe}}(S) = (-1.0) + (-1.0) + (-1.0) + (+10.0) = +7.0$$

**Step 2: Cliff Path Value:**
Let $S_1$ be the cell reached after step 1 of the Cliff path. From $S_1$, step 2 deterministically reaches the goal with reward $+10.0$:
$$v(S_1) = +10.0$$
From start $S$, taking the Cliff action yields:
$$v_{\text{cliff}}(S) = 0.90 \left[ -1.0 + 1.0 \cdot v(S_1) \right] + 0.10 \left[ -100.0 + 1.0 \cdot v_{\text{cliff}}(S) \right]$$
Substitute $v(S_1) = 10.0$:
$$v_{\text{cliff}}(S) = 0.90 [-1.0 + 10.0] + 0.10 [-100.0 + v_{\text{cliff}}(S)]$$
$$v_{\text{cliff}}(S) = 0.90(9.0) - 10.0 + 0.10 v_{\text{cliff}}(S) = 8.1 - 10.0 + 0.10 v_{\text{cliff}}(S) = -1.9 + 0.10 v_{\text{cliff}}(S)$$
Subtract $0.10 v_{\text{cliff}}(S)$:
$$0.90 v_{\text{cliff}}(S) = -1.9 \implies v_{\text{cliff}}(S) = \frac{-1.9}{0.90} \approx -2.111$$

**Step 3: Optimal Path Selection:**
$$v^*(S) = \max \{v_{\text{safe}}(S), v_{\text{cliff}}(S)\} = \max \{+7.0, -2.111\} = +7.0$$
The agent selects the Safe Path. Even though the Cliff path is twice as short, the catastrophic $-100$ penalty heavily penalizes expected return.

---

### Example 7.3: Extracting Optimal Policy from an Optimal Q-Table
Given the following optimal action-value table $q^*(s, a)$ for an autonomous mobile robot:

| State $s$ | $q^*(s, \text{North})$ | $q^*(s, \text{South})$ | $q^*(s, \text{East})$ | $q^*(s, \text{West})$ |
| :---: | :---: | :---: | :---: | :---: |
| $s_1$ | $+14.2$ | $+8.1$ | $+19.5$ | $+11.0$ |
| $s_2$ | $-3.0$ | $+4.5$ | $-1.2$ | $+4.5$ |
| $s_3$ | $+100.0$ | $+92.0$ | $+85.0$ | $+99.8$ |

1. Extract the optimal state-values $v^*(s_1), v^*(s_2), v^*(s_3)$.
2. Extract the optimal deterministic policy $\pi^*(s)$.
3. If tie-breaking occurs, how should the agent resolve it?

#### Solution:
**Step 1: Extract $v^*(s) = \max_a q^*(s, a)$:**
- $v^*(s_1) = \max \{14.2, 8.1, 19.5, 11.0\} = +19.5$
- $v^*(s_2) = \max \{-3.0, 4.5, -1.2, 4.5\} = +4.5$
- $v^*(s_3) = \max \{100.0, 92.0, 85.0, 99.8\} = +100.0$

**Step 2: Extract $\pi^*(s) = \arg\max_a q^*(s, a)$:**
- For $s_1$: $\arg\max = \text{East} \implies \pi^*(s_1) = \text{East}$.
- For $s_2$: $\arg\max \in \{\text{South}, \text{West}\}$ (both achieve $4.5$).
- For $s_3$: $\arg\max = \text{North} \implies \pi^*(s_3) = \text{North}$.

**Step 3: Tie-Breaking:**
In state $s_2$, both $\text{South}$ and $\text{West}$ yield identical optimal return $+4.5$. The agent may arbitrarily break the tie (e.g. by index), or employ a stochastic policy that randomizes between them: $\pi^*(\text{South} \mid s_2) = 0.5, \pi^*(\text{West} \mid s_2) = 0.5$. Both choices achieve identical optimal value.

---

### Example 7.4: Bellman Optimality in a Continuous Action Problem
Let state $s$ have continuous action $a \in [0, 10]$ (e.g. engine throttle).
Reward is $R(s, a) = 4a - a^2$.
The next state is deterministically $s' = 0.5 s + 0.1 a$.
Assume $v^*(s') = 100 - (s')^2$, and $\gamma = 0.50$.
Write the continuous Bellman optimality optimization problem for state $s = 2.0$ and compute the exact optimal action $a^*$.

#### Solution:
The Bellman optimality equation is:
$$v^*(s) = \max_{a \in [0, 10]} \left[ R(s, a) + \gamma v^*(s') \right]$$
Substitute $s = 2.0$:
$$s' = 0.5(2.0) + 0.1 a = 1.0 + 0.1 a$$
$$v^*(s') = 100 - (1.0 + 0.1 a)^2 = 100 - (1.0 + 0.2 a + 0.01 a^2) = 99.0 - 0.2 a - 0.01 a^2$$
Now formulate the objective function $J(a) = R(s, a) + \gamma v^*(s')$:
$$J(a) = (4a - a^2) + 0.50 [99.0 - 0.2 a - 0.01 a^2]$$
$$J(a) = 4a - a^2 + 49.5 - 0.1 a - 0.005 a^2 = 49.5 + 3.9 a - 1.005 a^2$$

To maximize $J(a)$, take the derivative with respect to $a$ and set to 0:
$$\frac{d J}{d a} = 3.9 - 2(1.005) a = 3.9 - 2.01 a = 0$$
$$a^* = \frac{3.9}{2.01} \approx 1.9403$$
Second derivative $\frac{d^2 J}{d a^2} = -2.01 < 0$ confirms a global maximum.
Since $1.9403 \in [0, 10]$, the optimal continuous throttle is $a^* \approx 1.94$.

---

### Example 7.5: Non-Uniqueness of Optimal Policies
Construct a minimal MDP example where multiple distinct deterministic policies achieve identical optimal value $v^*(s)$ in every state.

#### Solution:
Let $\mathcal{S} = \{s_0, s_{\text{goal}}\}$. From $s_0$, two actions exist:
- Action $a_L$ ("Go Left"): transitions to $s_{\text{goal}}$ with reward $+10.0$.
- Action $a_R$ ("Go Right"): transitions to $s_{\text{goal}}$ with reward $+10.0$.
State $s_{\text{goal}}$ is absorbing with reward 0.

Under policy $\pi_1(s_0) = a_L$: $v_{\pi_1}(s_0) = 10.0$.
Under policy $\pi_2(s_0) = a_R$: $v_{\pi_2}(s_0) = 10.0$.
Both policies are deterministic, completely distinct ($\pi_1 \neq \pi_2$), and both achieve the identical optimal value $v^*(s_0) = 10.0$.
Thus, while the optimal value function $v^*$ is always strictly unique, the optimal policy $\pi^*$ need not be unique.

---

### Example 7.6: Bellman Optimality and Linear Programming Duality
The Bellman Optimality Equation can be solved as a primal Linear Program (LP):
$$\min_{\mathbf{v} \in \mathbb{R}^N} \sum_{s \in \mathcal{S}} v(s)$$
subject to:
$$v(s) \ge r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v(s'), \quad \forall s \in \mathcal{S}, a \in \mathcal{A}(s)$$

Explain why minimizing $\sum_s v(s)$ subject to these constraints produces $v^*(s)$ rather than an arbitrary lower bound.

#### Solution:
For any state $s$ and action $a$, the constraint enforces:
$$v(s) \ge q^*(s, a) \implies v(s) \ge \max_a q^*(s, a) = v^*(s)$$
Thus, the feasible region of the linear program is the set of all vectors that upper-bound the optimal value: $\{\mathbf{v} : \mathbf{v} \ge \mathbf{v}^*\}$.
Because the objective function $\sum_s v(s)$ has strictly positive coefficients ($+1$ for every state), the LP minimizes the vector component-wise.
The minimum possible value that satisfies $v(s) \ge v^*(s)$ for all $s$ is achieved at the tight boundary:
$$v(s) = v^*(s), \quad \forall s \in \mathcal{S}$$
The constraints become active at the optimal actions $\pi^*(s)$.

---

### Example 7.7: Maximum Entropy Bellman Optimality (Soft Q-Learning)
In modern deep RL algorithms like Soft Actor-Critic (SAC), the standard $\max$ operator is replaced by a temperature-weighted **Soft-Max operator**:
$$v_{\text{soft}}^*(s) = \tau \ln \left( \sum_{a \in \mathcal{A}} e^{q_{\text{soft}}^*(s, a) / \tau} \right)$$
where $\tau > 0$ is the entropy temperature.
Let $q(s, a_1) = 4.0$ and $q(s, a_2) = 2.0$.
1. Compute the hard maximum $v^*(s) = \max_a q(s, a)$.
2. Compute the soft maximum $v_{\text{soft}}^*(s)$ for $\tau = 1.0$ and $\tau = 0.1$.
3. Prove that $\lim_{\tau \to 0} v_{\text{soft}}^*(s) = \max_a q(s, a)$.

#### Solution:
**1. Hard Maximum:**
$$v^*(s) = \max(4.0, 2.0) = 4.0$$

**2. Soft Maximum:**
- For $\tau = 1.0$:
  $$v_{\text{soft}}^*(s) = 1.0 \ln(e^4 + e^2) = \ln(54.598 + 7.389) = \ln(61.987) \approx 4.1269$$
- For $\tau = 0.1$:
  $$v_{\text{soft}}^*(s) = 0.1 \ln(e^{40} + e^{20}) = 0.1 \ln(e^{40}(1 + e^{-20})) = 0.1 [40 + \ln(1 + e^{-20})] \approx 4.0 + 0.1(0) = 4.0000$$

**3. Limit Proof:**
Let $q_{\max} = \max_a q(s, a)$.
$$\tau \ln \left( \sum_a e^{q(s, a)/\tau} \right) = \tau \ln \left( e^{q_{\max}/\tau} \sum_a e^{(q(s, a) - q_{\max})/\tau} \right)$$
$$= \tau \left[ \frac{q_{\max}}{\tau} + \ln \left( 1 + \sum_{a \neq a^*} e^{(q(s, a) - q_{\max})/\tau} \right) \right] = q_{\max} + \tau \ln \left( 1 + \dots \right)$$
As $\tau \to 0^+$, for any $a \neq a^*$, $q(s, a) - q_{\max} < 0 \implies \frac{q(s, a) - q_{\max}}{\tau} \to -\infty \implies e^{-\infty} = 0$.
The log term approaches $\ln(1) = 0$.
Thus:
$$\lim_{\tau \to 0^+} v_{\text{soft}}^*(s) = q_{\max} = \max_a q(s, a)$$

---

### Example 7.8: Detecting Sub-Optimality via Bellman Error
Let an agent maintain candidate value estimates $\hat{v}(s_1) = 10.0$ and $\hat{v}(s_2) = 15.0$ in an MDP with $\gamma = 0.8$.
The environment dynamics from $s_1$ are:
- Action $a_1$: transitions to $s_1$ with reward $4.0$.
- Action $a_2$: transitions to $s_2$ with reward $2.0$.

Compute the **Bellman Optimality Error** for state $s_1$:
$$\mathcal{E}(s_1) \doteq \left| \hat{v}(s_1) - \max_a [r(s_1, a) + \gamma \sum_{s'} \mathcal{P}_{s_1, s'}^a \hat{v}(s')] \right|$$

#### Solution:
Evaluate candidate Q-values using $\hat{v}$:
- $q(s_1, a_1) = 4.0 + 0.8 \hat{v}(s_1) = 4.0 + 0.8(10.0) = 4.0 + 8.0 = 12.0$
- $q(s_1, a_2) = 2.0 + 0.8 \hat{v}(s_2) = 2.0 + 0.8(15.0) = 2.0 + 12.0 = 14.0$
The target value is:
$$v_{\text{target}}(s_1) = \max(12.0, 14.0) = 14.0$$
The Bellman optimality error is:
$$\mathcal{E}(s_1) = |\hat{v}(s_1) - v_{\text{target}}(s_1)| = |10.0 - 14.0| = 4.0$$
State $s_1$ is severely underestimated by 4.0 units.

---

### Example 7.9: The Gambler's Problem Bellman Optimality Setup
A gambler bets on coin flips: coin lands Heads with probability $p = 0.40$ (an unfair coin).
- State $s \in \{1, 2, \dots, 99\}$ is the gambler's current capital.
- Actions $a \in \{0, 1, \dots, \min(s, 100 - s)\}$: amount to stake.
- Terminal states: $s = 0$ (ruin, reward 0) and $s = 100$ (win, reward $+1.0$).
- All intermediate rewards are 0; $\gamma = 1.0$.

Write the exact Bellman optimality equation for capital $s \in \{1, \dots, 99\}$.

#### Solution:
For any capital $s \in \{1, \dots, 99\}$ and stake $a \in \{0, \dots, \min(s, 100 - s)\}$:
- If coin lands Heads (prob $p$): capital becomes $s + a$.
- If coin lands Tails (prob $1 - p$): capital becomes $s - a$.
Since intermediate rewards are 0 and $\gamma = 1$:
$$v^*(s) = \max_{a \in \{0, \dots, \min(s, 100 - s)\}} \left[ p \cdot v^*(s + a) + (1 - p) \cdot v^*(s - a) \right]$$
with boundary conditions $v^*(0) = 0$ and $v^*(100) = 1.0$.
Because $p < 0.5$ (house edge), the optimal policy exhibits striking fractal discontinuities, often betting the maximum possible stake $a = \min(s, 100 - s)$ to minimize exposure to unfavorable odds.

---

### Example 7.10: Uniqueness of $v^*$ via Fixed-Point Contraction
Explain conceptually why the Bellman Optimality Equation can have only one unique solution vector $\mathbf{v}^*$, even though there may be millions of optimal policies.

#### Solution:
The Bellman optimality operator $T^*: \mathbb{R}^N \to \mathbb{R}^N$ defined by:
$$(T^* v)(s) = \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right]$$
is a $\gamma$-contraction mapping under the supremum norm $\|\cdot\|_\infty$ (proven rigorously in Chapter 8).
By the **Banach Fixed-Point Theorem**, any contraction mapping on a complete metric space has:
1. Exactly **one** unique fixed point $v^* = T^* v^*$.
2. Every iterative sequence $v_{k+1} = T^* v_k$ converges to this identical fixed point regardless of initial guess $v_0$.
Even if multiple policies $\pi_1^*, \pi_2^*$ achieve the maximum in $\arg\max_a q^*(s, a)$, the numerical value of that maximum $v^*(s)$ is strictly unique.

---

## 7.7 Solved Exercises

### Exercise 7.1: Optimal Action Selection from Q-Values
In state $s$, an agent computes: $q^*(s, \text{Jump}) = -2.5, q^*(s, \text{Duck}) = +1.2, q^*(s, \text{Run}) = +0.8$.
Which action does the optimal policy select, and what is $v^*(s)$?

#### Solution:
$$v^*(s) = \max(-2.5, 1.2, 0.8) = +1.2$$
$$\pi^*(s) = \arg\max_a q^*(s, a) = \text{Duck}$$

---

### Exercise 7.2: One-Step Lookahead from Optimal State Values
An agent in state $s$ has actions $a_1$ and $a_2$.
- Action $a_1$: $r(s, a_1) = 3.0$, transitions to $s_1$ with prob 1.0.
- Action $a_2$: $r(s, a_2) = 1.0$, transitions to $s_2$ with prob 1.0.
Known optimal values are $v^*(s_1) = 10.0, v^*(s_2) = 14.0$, and $\gamma = 0.90$.
Find the optimal action $\pi^*(s)$.

#### Solution:
$$q^*(s, a_1) = 3.0 + 0.90(10.0) = 3.0 + 9.0 = 12.0$$
$$q^*(s, a_2) = 1.0 + 0.90(14.0) = 1.0 + 12.6 = 13.6$$
Since $13.6 > 12.0$, $\pi^*(s) = a_2$, and $v^*(s) = 13.6$.

---

### Exercise 7.3: Inverting Bellman Optimality
Explain in one sentence why you cannot compute $\mathbf{v}^* = (\mathbf{I} - \gamma \mathbf{P}^*)^{-1} \mathbf{r}^*$ directly without first knowing $\pi^*$.

#### Solution:
Because the optimal transition matrix $\mathbf{P}^*$ and reward vector $\mathbf{r}^*$ depend on knowing which action achieves the maximum in each state, which is precisely the unknown optimal policy we are trying to find.

---

### Exercise 7.4: Verification of Bellman Optimality
Given $v^*(s) = 25.0$, $r(s, a_1) = 5.0$, $\mathcal{P}_{s, s}^{a_1} = 1.0$, $\gamma = 0.80$.
Does this state-action pair satisfy the Bellman optimality condition?

#### Solution:
Check consistency:
$$q^*(s, a_1) = 5.0 + 0.80 v^*(s) = 5.0 + 0.80(25.0) = 5.0 + 20.0 = 25.0 = v^*(s)$$
Yes. The action-value matches the state-value with zero error.

---

### Exercise 7.5: Bound on Optimal Return
In an MDP with $|R_{t+1}| \le 5.0$ and $\gamma = 0.95$, what is the maximum possible value $v^*(s)$ could theoretically attain in any state?

#### Solution:
$$v_{\max}^* \le \frac{R_{\max}}{1 - \gamma} = \frac{5.0}{1 - 0.95} = \frac{5.0}{0.05} = +100.0$$

---

### Exercise 7.6: Advantage of Optimal Actions
Prove that for any state $s$, the advantage of an optimal action $a^* \in \arg\max_a q^*(s, a)$ is identically zero: $A^*(s, a^*) = 0$.

#### Solution:
By definition:
$$A^*(s, a^*) \doteq q^*(s, a^*) - v^*(s)$$
Since $v^*(s) = \max_a q^*(s, a) = q^*(s, a^*)$:
$$A^*(s, a^*) = q^*(s, a^*) - q^*(s, a^*) = 0$$
Optimal actions have zero advantage; all sub-optimal actions have strictly negative advantage ($A^*(s, a_{\text{sub}}) < 0$).

---

### Exercise 7.7: Impact of Sub-Optimal Policy Execution
If an agent follows optimal policy $\pi^*$ in every state except state $s_0$ where it takes sub-optimal action $a$, express the loss in return in terms of the optimal advantage $A^*(s_0, a)$.

#### Solution:
The return of this one-step perturbed policy $\pi'$ is:
$$v_{\pi'}(s_0) = q^*(s_0, a)$$
The loss in value is:
$$\text{Loss} = v^*(s_0) - v_{\pi'}(s_0) = v^*(s_0) - q^*(s_0, a) = - [q^*(s_0, a) - v^*(s_0)] = -A^*(s_0, a)$$
The value loss is exactly the magnitude of the negative advantage of action $a$.

---

### Exercise 7.8: Stochastic vs Deterministic Bellman Solution
Suppose two deterministic actions $a_1$ and $a_2$ have $q^*(s, a_1) = q^*(s, a_2) = 50.0$.
Does a stochastic policy $\pi(a_1 \mid s) = 0.3, \pi(a_2 \mid s) = 0.7$ also achieve optimal value in state $s$?

#### Solution:
Yes.
$$v_\pi(s) = 0.3 q^*(s, a_1) + 0.7 q^*(s, a_2) = 0.3(50.0) + 0.7(50.0) = 15.0 + 35.0 = 50.0 = v^*(s)$$
Any convex combination of tied optimal actions achieves optimal value.

---

### Exercise 7.9: Monotonicity of the Bellman Optimality Operator
Prove that the Bellman optimality operator $T^*$ is monotonic: if $u(s) \ge v(s)$ for all $s \in \mathcal{S}$, then $(T^* u)(s) \ge (T^* v)(s)$ for all $s \in \mathcal{S}$.

#### Solution:
For any action $a$:
$$r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a u(s') \ge r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s')$$
because $\gamma \ge 0$, $\mathcal{P}_{s, s'}^a \ge 0$, and $u(s') \ge v(s')$.
Taking the maximum over $a \in \mathcal{A}(s)$ on both sides preserves the inequality:
$$\max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a u(s') \right] \ge \max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right]$$
$$(T^* u)(s) \ge (T^* v)(s)$$
Thus, $T^*$ is strictly monotonic.

---

### Exercise 7.10: Sub-Optimality of Naive Greedy Action Selection
Explain why choosing actions that maximize immediate reward $R_{t+1}$ is rarely optimal in an MDP.

#### Solution:
Maximizing immediate reward $a = \arg\max_a r(s, a)$ ignores the second term of the Bellman equation: $\gamma \sum_{s'} \mathcal{P}_{s, s'}^a v^*(s')$.
An action with high immediate reward may transition with high probability to catastrophic successor states where future returns are negative, resulting in a strictly inferior cumulative return compared to a patient action that absorbs a small immediate cost to unlock high-value future regions.


# Chapter 8: Dynamic Programming I: Iterative Policy Evaluation and Contraction Mappings

---

## 8.1 The Dynamic Programming Paradigm: Planning with Models

The term **Dynamic Programming (DP)** was coined in the 1950s by Richard Bellman to describe a mathematical framework for solving complex multi-stage decision processes by decomposing them into overlapping sub-problems. In the lexicon of computer science and reinforcement learning:

> **Dynamic Programming** refers to a collection of algorithms that compute optimal policies given a *perfect, complete model of the environment* as a Markov Decision Process $(\mathcal{S}, \mathcal{A}, \mathcal{P}, \mathcal{R}, \gamma)$.

Because classical DP assumes full knowledge of transition probabilities $\mathcal{P}_{s, s'}^a$ and expected rewards $r(s, a)$, it operates as a **planning** methodology rather than a pure learning methodology. However, the theoretical concepts developed in DPâ€”bootstrapping, value iteration, policy iteration, and contraction mappingsâ€”form the exact mathematical foundation upon which all model-free reinforcement learning algorithms (such as Q-Learning and Actor-Critic) are constructed.

```
                                 THE DYNAMIC PROGRAMMING SUITE
                                               â”‚
                        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                        â–¼                                             â–¼
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚     POLICY EVALUATION       â”‚               â”‚      POLICY ITERATION       â”‚
         â”‚   (Prediction Problem)      â”‚               â”‚      (Control Problem)      â”‚
         â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤               â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
         â”‚ Given policy Ï€:             â”‚               â”‚ Discovers optimal Ï€*:       â”‚
         â”‚ Compute state-values v_Ï€(s) â”‚               â”‚ Alternates evaluation and   â”‚
         â”‚ by solving Bellman system.  â”‚               â”‚ greedy policy improvement.  â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

In this chapter, we master the **Prediction Problem**: given an arbitrary policy $\pi$, how do we compute its state-value function $v_\pi(s)$ efficiently without inverting an $O(N^3)$ matrix? The answer is **Iterative Policy Evaluation**.

---

## 8.2 The Bellman Expectation Operator $T^\pi$

To analyze iterative algorithms with mathematical rigor, we shift our perspective from scalar equations to functional operators acting on high-dimensional vector spaces.

Let $\mathcal{V} \doteq \mathbb{R}^{|\mathcal{S}|}$ denote the real vector space of all possible state-value functions. An element $\mathbf{v} \in \mathcal{V}$ is an $N$-dimensional vector assigning a real value to every state $s \in \mathcal{S}$.

### Formal Definition
The **Bellman Expectation Operator** for policy $\pi$, denoted $T^\pi: \mathcal{V} \to \mathcal{V}$, is a mapping that takes an arbitrary value vector $\mathbf{v}$ and transforms it into a new value vector $T^\pi \mathbf{v}$:

$$(T^\pi \mathbf{v})(s) \doteq \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v(s') \right]$$

In vector-matrix notation:

$$T^\pi \mathbf{v} \doteq \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}$$

### Fixed Point Formulation
The Bellman expectation equation from Chapter 6 ($\mathbf{v}_\pi = \mathbf{r}_\pi + \gamma \mathbf{P}_\pi \mathbf{v}_\pi$) can now be stated with mathematical elegance as a **Fixed-Point Equation**:

$$T^\pi \mathbf{v}_\pi = \mathbf{v}_\pi$$

The true state-value function $\mathbf{v}_\pi$ is the fixed point of the operator $T^\pi$. If we apply $T^\pi$ to $\mathbf{v}_\pi$, the output is identical to the input.

---

## 8.3 The Banach Fixed-Point Theorem and Contraction Mappings

How do we find the fixed point of an operator? Under what conditions does repeatedly applying the operator ($v_{k+1} = T^\pi v_k$) converge to the unique truth? The answer is provided by the celebrated **Banach Fixed-Point Theorem** (1922).

```
                            THE BANACH CONTRACTION CONE
          Vector Space V = R^N
          
             u_0 â—â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                                                           â”‚ Distance d(u_0, v_0)
             v_0 â—â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚
                   \                                 â”‚     â”‚
                    \ T^Ï€                            â”‚     â”‚
                     â–¼                               â–¼     â–¼
                  T^Ï€ u_0 â—â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”              ||u - v||_âˆž
                                     â”‚ Distance â‰¤ Î³ d(u_0, v_0)
                  T^Ï€ v_0 â—â”€â”€â”€â”€â”     â”‚
                         \     â”‚     â”‚
                          \ T^Ï€â”‚     â”‚
                           â–¼   â–¼     â–¼
                             â— v_Ï€ (Unique Fixed Point)
```

### 1. Complete Metric Space
Equip the vector space $\mathbb{R}^{|\mathcal{S}|}$ with the **Supremum Norm** (or maximum norm, $L_\infty$):
$$\|\mathbf{u} - \mathbf{v}\|_\infty \doteq \max_{s \in \mathcal{S}} |u(s) - v(s)|$$
Because $\mathbb{R}^{|\mathcal{S}|}$ is finite-dimensional, the metric space $(\mathbb{R}^{|\mathcal{S}|}, \|\cdot\|_\infty)$ is **complete**: every Cauchy sequence converges to a limit that resides inside the space.

### 2. Definition of a Contraction Mapping
An operator $T: \mathcal{V} \to \mathcal{V}$ is defined to be a **$\gamma$-Contraction Mapping** on a metric space $(\mathcal{V}, \|\cdot\|)$ if there exists a real constant $\gamma \in [0, 1)$ such that for all $\mathbf{u}, \mathbf{v} \in \mathcal{V}$:

$$\|T \mathbf{u} - T \mathbf{v}\| \le \gamma \|\mathbf{u} - \mathbf{v}\|$$

A contraction mapping pulls any two candidate vectors strictly closer together. The distance between the outputs is guaranteed to shrink by at least a factor of $\gamma < 1$ compared to the distance between the inputs.

### 3. The Banach Fixed-Point Theorem
> **Theorem (Banach):**
> Let $(\mathcal{V}, d)$ be a complete metric space, and let $T: \mathcal{V} \to \mathcal{V}$ be a $\gamma$-contraction mapping with contraction factor $\gamma \in [0, 1)$. Then:
> 1. **Existence and Uniqueness:** $T$ has a unique fixed point $\mathbf{v}^* \in \mathcal{V}$ satisfying $T \mathbf{v}^* = \mathbf{v}^*$.
> 2. **Global Convergence:** For *any arbitrary initial guess* $\mathbf{v}_0 \in \mathcal{V}$, the sequence generated by repeated iteration:
>    $$\mathbf{v}_{k+1} = T \mathbf{v}_k$$
>    converges to the unique fixed point:
>    $$\lim_{k \to \infty} \mathbf{v}_k = \mathbf{v}^*$$
> 3. **Geometric Convergence Rate:** The error at iteration $k$ is strictly bounded by:
>    $$\|\mathbf{v}_k - \mathbf{v}^*\| \le \frac{\gamma^k}{1 - \gamma} \|\mathbf{v}_1 - \mathbf{v}_0\|$$

---

## 8.4 Rigorous Proof that $T^\pi$ is a $\gamma$-Contraction

We now present the complete, step-by-step mathematical proof that the Bellman Expectation Operator $T^\pi$ is a $\gamma$-contraction mapping under the supremum norm.

### Proof:
Let $\mathbf{u}, \mathbf{v} \in \mathbb{R}^{|\mathcal{S}|}$ be any two arbitrary value vectors.
Evaluate the difference $(T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s)$ for an arbitrary state $s \in \mathcal{S}$:

$$\begin{aligned}
(T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s) &= \left( r_\pi(s) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi u(s') \right) - \left( r_\pi(s) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi v(s') \right) \\
&= \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi \left[ u(s') - v(s') \right]
\end{aligned}$$

Notice that the reward vector $r_\pi(s)$ cancels out completely!

Now take the absolute value of both sides:
$$\left| (T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s) \right| = \left| \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi [u(s') - v(s')] \right|$$

Apply the triangle inequality:
$$\le \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi |u(s') - v(s')|$$

By the definition of the supremum norm, for every state $s'$, $|u(s') - v(s')| \le \|\mathbf{u} - \mathbf{v}\|_\infty$. Substitute this uniform upper bound:
$$\le \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi \|\mathbf{u} - \mathbf{v}\|_\infty = \gamma \|\mathbf{u} - \mathbf{v}\|_\infty \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi$$

Because $\mathcal{P}^\pi$ is a valid probability transition kernel, the sum over all destination states $s'$ is identically 1:
$$\sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^\pi = 1$$

Therefore:
$$\left| (T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s) \right| \le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty$$

Because this inequality holds for every state $s \in \mathcal{S}$, it must hold for the maximum over all states:
$$\max_{s \in \mathcal{S}} \left| (T^\pi \mathbf{u})(s) - (T^\pi \mathbf{v})(s) \right| \le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty$$

$$\|T^\pi \mathbf{u} - T^\pi \mathbf{v}\|_\infty \le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty \quad \blacksquare$$

This completes the proof. Since $\gamma \in [0, 1)$, $T^\pi$ is unconditionally a $\gamma$-contraction mapping.

---

## 8.5 The Iterative Policy Evaluation Algorithm

The contraction property yields an extraordinarily simple and powerful algorithm: **Iterative Policy Evaluation**.

```
                         ITERATIVE POLICY EVALUATION FLOW
                                        â”‚
                                  Initialize v_0
                                  (e.g., all 0s)
                                        â”‚
                                        â–¼
                             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                        â”Œâ”€â”€â”€â–ºâ”‚  Sweep All States  â”‚
                        â”‚    â”‚  v_{k+1} = T^Ï€ v_k â”‚
                        â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                        â”‚              â”‚
                        â”‚              â–¼
                        â”‚    Calculate Max Shift:
                        â”‚    Î” = max_s |v_{k+1}(s) - v_k(s)|
                        â”‚              â”‚
                        â”‚              â–¼
                        â”‚          Is Î” < Î¸?
                        â”‚         /         \
                        â””â”€â”€ NO â”€â”€â”˜           â””â”€â”€ YES â”€â”€â–º CONVERGED! Output v_Ï€
```

### Algorithmic Variants: Synchronous vs. In-Place
1. **Synchronous (Two-Array) Update:**
   Maintains two memory buffers: `V_old` and `V_new`. The algorithm reads values strictly from `V_old` to compute all updates, and writes results into `V_new`. Once all states are swept, `V_old` is replaced by `V_new`. This matches the theoretical operator $v_{k+1} = T^\pi v_k$ exactly.
2. **In-Place (Gauss-Seidel) Update:**
   Maintains a single memory buffer `V`. As states are updated in order $s_1, s_2, \dots, s_N$, the new value $V(s_1)$ is immediately written back into the array. When calculating $V(s_2)$, if $s_2$ transitions to $s_1$, it immediately uses the freshly updated $V(s_1)$ rather than stale data.
   - Requires half the memory storage.
   - Typically converges nearly twice as fast as synchronous updates.
   - Still guaranteed to converge to the identical fixed point $v_\pi$.

---

## 8.6 Worked Examples: Policy Evaluation Steps

### Example 8.1: Step-by-Step Synchronous Policy Evaluation
Consider an MDP with states $\mathcal{S} = \{s_1, s_2\}$.
- $r_\pi(s_1) = 2.0, \quad \mathcal{P}_{s_1, s_1}^\pi = 0.5, \quad \mathcal{P}_{s_1, s_2}^\pi = 0.5$.
- $r_\pi(s_2) = 1.0, \quad \mathcal{P}_{s_2, s_1}^\pi = 0.0, \quad \mathcal{P}_{s_2, s_2}^\pi = 1.0$.
Discount factor $\gamma = 0.50$.
Initialize $v_0 = [0.0, 0.0]^T$.

Perform 3 full synchronous sweeps ($v_1, v_2, v_3$) by hand, tracking the maximum state deviation $\Delta_k = \|v_k - v_{k-1}\|_\infty$.

#### Solution:
The update rule is:
$$v_{k+1}(s_1) = 2.0 + 0.50 [0.5 v_k(s_1) + 0.5 v_k(s_2)] = 2.0 + 0.25 [v_k(s_1) + v_k(s_2)]$$
$$v_{k+1}(s_2) = 1.0 + 0.50 [1.0 v_k(s_2)] = 1.0 + 0.50 v_k(s_2)$$

**Iteration $k = 1$ (from $v_0 = [0, 0]$):**
- $v_1(s_1) = 2.0 + 0.25(0 + 0) = 2.0$
- $v_1(s_2) = 1.0 + 0.50(0) = 1.0$
- $\mathbf{v}_1 = [2.0, 1.0]^T$
- $\Delta_1 = \max(|2.0 - 0|, |1.0 - 0|) = 2.0$

**Iteration $k = 2$ (from $v_1 = [2.0, 1.0]$):**
- $v_2(s_1) = 2.0 + 0.25(2.0 + 1.0) = 2.0 + 0.25(3.0) = 2.0 + 0.75 = 2.75$
- $v_2(s_2) = 1.0 + 0.50(1.0) = 1.50$
- $\mathbf{v}_2 = [2.75, 1.50]^T$
- $\Delta_2 = \max(|2.75 - 2.0|, |1.50 - 1.0|) = \max(0.75, 0.50) = 0.75$
Notice: $\frac{\Delta_2}{\Delta_1} = \frac{0.75}{2.0} = 0.375 \le \gamma = 0.50 \quad \checkmark$.

**Iteration $k = 3$ (from $v_2 = [2.75, 1.50]$):**
- $v_3(s_1) = 2.0 + 0.25(2.75 + 1.50) = 2.0 + 0.25(4.25) = 2.0 + 1.0625 = 3.0625$
- $v_3(s_2) = 1.0 + 0.50(1.50) = 1.0 + 0.75 = 1.75$
- $\mathbf{v}_3 = [3.0625, 1.75]^T$
- $\Delta_3 = \max(|3.0625 - 2.75|, |1.75 - 1.50|) = \max(0.3125, 0.25) = 0.3125$

---

### Example 8.2: Analytical Fixed Point Comparison
Compute the exact analytical fixed point $\mathbf{v}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$ for Example 8.1, and verify that $\mathbf{v}_k \to \mathbf{v}_\pi$.

#### Solution:
From the equations:
$$v_\pi(s_2) = 1.0 + 0.5 v_\pi(s_2) \implies 0.5 v_\pi(s_2) = 1.0 \implies v_\pi(s_2) = 2.0$$
Now substitute into $v_\pi(s_1)$:
$$v_\pi(s_1) = 2.0 + 0.25 [v_\pi(s_1) + 2.0] = 2.0 + 0.25 v_\pi(s_1) + 0.50 = 2.50 + 0.25 v_\pi(s_1)$$
$$0.75 v_\pi(s_1) = 2.50 \implies v_\pi(s_1) = \frac{2.50}{0.75} = \frac{10}{3} \approx 3.3333$$
True fixed point: $\mathbf{v}_\pi = [\frac{10}{3}, 2.0]^T \approx [3.3333, 2.0000]^T$.

Compare with iteration 3:
$$\mathbf{v}_3 = [3.0625, 1.7500]^T$$
Errors:
- State $s_1$: $|3.3333 - 3.0625| = 0.2708$.
- State $s_2$: $|2.0000 - 1.7500| = 0.2500$.
The values are monotonically and geometrically converging toward the true fixed point.

---

### Example 8.3: Verification of the Banach Error Bound
Using $\gamma = 0.50$, $v_0 = [0, 0]^T$, and $v_1 = [2.0, 1.0]^T$ from Example 8.1:
1. Use the Banach error bound formula $\|\mathbf{v}_k - \mathbf{v}^*\|_\infty \le \frac{\gamma^k}{1 - \gamma} \|\mathbf{v}_1 - \mathbf{v}_0\|_\infty$ to compute the guaranteed theoretical error upper bound at iteration $k = 3$.
2. Compare this theoretical bound to the actual empirical error computed in Example 8.2.

#### Solution:
**Step 1: Compute Bound:**
- $\|\mathbf{v}_1 - \mathbf{v}_0\|_\infty = 2.0$.
- $1 - \gamma = 1 - 0.50 = 0.50$.
- For $k = 3$: $\gamma^3 = (0.50)^3 = 0.125$.
$$\text{Bound} = \frac{0.125}{0.50} \times 2.0 = 0.25 \times 2.0 = 0.50$$

**Step 2: Comparison:**
Actual error at $k = 3$:
$$\|\mathbf{v}_3 - \mathbf{v}^*\|_\infty = \max(0.2708, 0.2500) = 0.2708$$
Since $0.2708 \le 0.50$, the theoretical Banach bound holds rigorously.

---

### Example 8.4: In-Place (Gauss-Seidel) Policy Evaluation
Using the identical MDP from Example 8.1:
- $v(s_1) \leftarrow 2.0 + 0.25 [v(s_1) + v(s_2)]$
- $v(s_2) \leftarrow 1.0 + 0.50 v(s_2)$
Initialize a single vector $V = [0.0, 0.0]$.
Perform 2 in-place sweeps, updating $s_1$ first, then $s_2$.

#### Solution:
**Sweep 1:**
- Update $s_1$:
  $$V(s_1) \leftarrow 2.0 + 0.25(0 + 0) = 2.0$$
- Update $s_2$ (using newly updated $V(s_1)$, though $s_2$ happens only to depend on itself):
  $$V(s_2) \leftarrow 1.0 + 0.50(0) = 1.0$$
After Sweep 1: $V = [2.0, 1.0]$.

**Sweep 2:**
- Update $s_1$ (using current $V(s_1) = 2.0$ and current $V(s_2) = 1.0$):
  $$V(s_1) \leftarrow 2.0 + 0.25(2.0 + 1.0) = 2.0 + 0.75 = 2.75$$
- Update $s_2$:
  $$V(s_2) \leftarrow 1.0 + 0.50(1.0) = 1.50$$
After Sweep 2: $V = [2.75, 1.50]$.

Now suppose state order was reversed ($s_2$ updated first, then $s_1$):
- Sweep 1: $V(s_2) \leftarrow 1.0$. Then $V(s_1) \leftarrow 2.0 + 0.25(0 + 1.0) = 2.25$.
Updating $s_2$ first immediately propels $s_1$ to $2.25$ (closer to $3.333$) in a single sweep!

---

### Example 8.5: Iteration Complexity to Reach Target Error Tolerance
An engineer sets stopping threshold $\theta = 10^{-6}$ for policy evaluation.
The discount factor is $\gamma = 0.95$.
The initial sweep yielded $\|\mathbf{v}_1 - \mathbf{v}_0\|_\infty = 10.0$.
Calculate the maximum number of iterations $K$ guaranteed to achieve error $\|\mathbf{v}_K - \mathbf{v}^*\|_\infty \le \theta$.

#### Solution:
From the Banach bound:
$$\frac{\gamma^K}{1 - \gamma} \|\mathbf{v}_1 - \mathbf{v}_0\|_\infty \le \theta$$
$$\gamma^K \le \frac{\theta (1 - \gamma)}{\|\mathbf{v}_1 - \mathbf{v}_0\|_\infty}$$
Substitute values:
$$\gamma^K \le \frac{(10^{-6})(0.05)}{10.0} = \frac{5 \times 10^{-8}}{10.0} = 5 \times 10^{-9}$$
Take natural logarithms:
$$K \ln(\gamma) \le \ln(5 \times 10^{-9})$$
$$K \ln(0.95) \le \ln(5 \times 10^{-9})$$
- $\ln(0.95) \approx -0.051293$
- $\ln(5 \times 10^{-9}) \approx -19.1138$
Divide by negative logarithm (reverses inequality):
$$K \ge \frac{-19.1138}{-0.051293} \approx 372.64$$
Rounding up:
$$K = 373 \text{ iterations}$$
At most 373 sweeps are required to guarantee accuracy to 6 decimal places.

---

### Example 8.6: Contraction Mapping with Different Matrix Norms
Show that while $T^\pi$ is always a $\gamma$-contraction under the supremum norm $\|\cdot\|_\infty$, it is **not** necessarily a contraction under the Euclidean $L_2$ norm $\|\cdot\|_2$.

#### Solution:
Consider transition matrix $\mathbf{P} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix}$ (non-symmetric) and $\mathbf{P} = \begin{bmatrix} 0.5 & 0.5 \\ 0.0 & 1.0 \end{bmatrix}$.
In general, for $L_2$ norm:
$$\|\gamma \mathbf{P} \mathbf{x}\|_2 \le \gamma \sigma_{\max}(\mathbf{P}) \|\mathbf{x}\|_2$$
where $\sigma_{\max}(\mathbf{P})$ is the largest singular value (spectral norm) of $\mathbf{P}$.
For a general stochastic matrix, while the spectral radius $\rho(\mathbf{P}) \le 1$, the largest singular value can exceed 1!
For example, let $\mathbf{P} = \begin{bmatrix} 0 & 1 \\ 0 & 1 \end{bmatrix}$.
$\mathbf{P}^T \mathbf{P} = \begin{bmatrix} 0 & 0 \\ 0 & 2 \end{bmatrix}$.
The largest eigenvalue of $\mathbf{P}^T \mathbf{P}$ is 2, so $\sigma_{\max}(\mathbf{P}) = \sqrt{2} \approx 1.414$.
If $\gamma = 0.8$, then $\gamma \sigma_{\max}(\mathbf{P}) = 0.8 \times 1.414 = 1.131 > 1.0$.
In this case, along the vector $\mathbf{x} = [0, 1]^T$:
$$\|\gamma \mathbf{P} \mathbf{x}\|_2 = 0.8 \|[1, 1]^T\|_2 = 0.8 \sqrt{2} \approx 1.131 > 1.0 = \|\mathbf{x}\|_2$$
The distance *expands* under the $L_2$ norm! Thus, the contraction property depends crucially on the choice of the $L_\infty$ norm.

---

### Example 8.7: Policy Evaluation on Sutton & Barto 4x4 Gridworld
Consider the classic Sutton & Barto $4 \times 4$ Gridworld:
- 14 non-terminal states ($s = 1, \dots, 14$), 2 terminal corners ($s = 0, 15$).
- In every state, random policy $\pi(a \mid s) = 0.25$ for all 4 directions.
- Moving off grid keeps agent in place.
- Every step yields $R = -1.0$.
- $\gamma = 1.0$ (undiscounted episodic).
Initialize $v_0(s) = 0$ for all $s$.

1. Compute $v_1(s)$ for all non-terminal states.
2. For corner adjacent state $s_1$ (neighbors: terminal $s_0$, interior $s_2$, below $s_5$, bounce off wall $s_1$), write its update equation for sweep 2.

#### Solution:
**Step 1: Sweep $k = 1$:**
For every non-terminal state $s$:
$$v_1(s) = \sum_a 0.25 [-1.0 + 1.0 \cdot v_0(s')] = \sum_a 0.25 [-1.0 + 0] = -1.0$$
For terminal states: $v_1(0) = v_1(15) = 0$.

**Step 2: Sweep $k = 2$ for state $s_1$:**
From $s_1$:
- Left: enters terminal $s_0$ (value 0).
- Right: enters $s_2$ (value $-1.0$).
- Down: enters $s_5$ (value $-1.0$).
- Up: bounces off wall, stays in $s_1$ (value $-1.0$).
Update equation:
$$v_2(s_1) = 0.25 [-1 + v_1(s_0)] + 0.25 [-1 + v_1(s_2)] + 0.25 [-1 + v_1(s_5)] + 0.25 [-1 + v_1(s_1)]$$
$$v_2(s_1) = 0.25 [-1 + 0] + 0.25 [-1 + (-1)] + 0.25 [-1 + (-1)] + 0.25 [-1 + (-1)]$$
$$v_2(s_1) = 0.25(-1) + 0.25(-2) + 0.25(-2) + 0.25(-2) = -0.25 - 0.50 - 0.50 - 0.50 = -1.75$$
States adjacent to terminal goals retain higher value than interior states.

---

### Example 8.8: Stopping Condition Relationship to True Error
In iterative policy evaluation, the algorithm terminates when the change between successive sweeps is small:
$$\Delta \doteq \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty < \theta$$
Prove that when this condition is met, the distance to the true fixed point $\mathbf{v}_\pi$ satisfies:
$$\|\mathbf{v}_{k+1} - \mathbf{v}_\pi\|_\infty \le \frac{\gamma \theta}{1 - \gamma}$$

#### Solution:
By the triangle inequality and contraction property:
$$\|\mathbf{v}_{k+1} - \mathbf{v}_\pi\|_\infty \le \sum_{m=1}^\infty \|\mathbf{v}_{k+m+1} - \mathbf{v}_{k+m}\|_\infty$$
Because $T^\pi$ is a $\gamma$-contraction:
$$\|\mathbf{v}_{k+m+1} - \mathbf{v}_{k+m}\|_\infty \le \gamma^m \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty$$
Therefore:
$$\|\mathbf{v}_{k+1} - \mathbf{v}_\pi\|_\infty \le \sum_{m=1}^\infty \gamma^m \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty = \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty \sum_{m=1}^\infty \gamma^m$$
Since $\sum_{m=1}^\infty \gamma^m = \frac{\gamma}{1 - \gamma}$:
$$\|\mathbf{v}_{k+1} - \mathbf{v}_\pi\|_\infty \le \frac{\gamma}{1 - \gamma} \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty < \frac{\gamma \theta}{1 - \gamma} \quad \blacksquare$$

---

### Example 8.9: Asynchronous Prioritized Sweeping Preview
In standard policy evaluation, every state is swept in round-robin order.
Explain why updating states with the largest Bellman error $|(T^\pi v)(s) - v(s)|$ first (Prioritized Sweeping) accelerates convergence.

#### Solution:
In many MDPs, large regions of the state space have near-zero value flow until a wave of information propagates backward from terminal or rewarded states. In round-robin evaluation, states far from rewards are redundantly recomputed even though their inputs have not changed. By inserting states into a maximum priority queue keyed by their Bellman error $|(T^\pi v)(s) - v(s)|$, computation is concentrated exclusively on the "active wavefront" of value propagation, reducing redundant floating-point operations by up to an order of magnitude.

---

### Example 8.10: Divergence Under Non-Contractive Operators ($\gamma \ge 1$)
Let a 1-state system loop on itself: $v_{k+1} = 1.0 + \gamma v_k$.
Trace what happens to $v_k$ when $\gamma = 1.1$ initialized at $v_0 = 0$.

#### Solution:
- $v_1 = 1.0 + 1.1(0) = 1.0$
- $v_2 = 1.0 + 1.1(1.0) = 2.1$
- $v_3 = 1.0 + 1.1(2.1) = 1.0 + 2.31 = 3.31$
- $v_4 = 1.0 + 1.1(3.31) = 1.0 + 3.641 = 4.641$
- $v_{10} \approx 15.937$
- $v_{50} \approx 1,173.9$
- $v_{100} \approx 137,806.0$
As $k \to \infty$, $v_k \to \infty$. Because $\gamma > 1$, the operator is an expansion mapping, causing unanchored iterations to explode to infinity.

---

## 8.7 Solved Exercises

### Exercise 8.1: Contraction Rate Calculation
If $\|u - v\|_\infty = 8.0$ and $\gamma = 0.75$, what is the maximum possible value of $\|T^\pi u - T^\pi v\|_\infty$?

#### Solution:
$$\|T^\pi u - T^\pi v\|_\infty \le \gamma \|u - v\|_\infty = 0.75 \times 8.0 = 6.0$$

---

### Exercise 8.2: First Sweep Value Calculation
An agent starts with $v_0(s) = 0$ everywhere.
State $s$ has expected reward $r_\pi(s) = 3.5$.
What is $v_1(s)$ after one synchronous sweep?

#### Solution:
$$v_1(s) = r_\pi(s) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^\pi v_0(s') = 3.5 + \gamma(0) = 3.5$$

---

### Exercise 8.3: Memory Complexity of Synchronous vs In-Place DP
For an environment with $N = 500,000$ states stored as 64-bit floats (`float64`, 8 bytes per value), calculate the memory required for synchronous vs in-place arrays.

#### Solution:
- Single array: $500,000 \times 8 \text{ bytes} = 4,000,000 \text{ bytes} \approx 3.815 \text{ MB}$.
- Synchronous DP requires two arrays (`V_old`, `V_new`): $2 \times 3.815 \text{ MB} \approx 7.63 \text{ MB}$.
- In-place DP requires only one array: $\approx 3.815 \text{ MB}$.

---

### Exercise 8.4: Uniform Policy on Ring Lattice
A 4-state ring has transitions: $s_1 \to s_2 \to s_3 \to s_4 \to s_1$.
Each step earns reward $R = 1.0$. If $\gamma = 0.8$, find the exact value $v(s_1)$.

#### Solution:
By symmetry, all states have identical value: $v(s_1) = v(s_2) = v(s_3) = v(s_4) = v$.
The Bellman equation is:
$$v = 1.0 + 0.8 v \implies 0.2 v = 1.0 \implies v = 5.0$$

---

### Exercise 8.5: Iterative Reduction of Initial Bias
Suppose an engineer maliciously initializes $v_0(s) = 1,000,000$ for all states.
If $\gamma = 0.90$, how many iterations are required to reduce the contribution of this initial bias to less than $0.01$?

#### Solution:
The bias decays by $\gamma^k$:
$$\gamma^k \times 1,000,000 \le 0.01 \implies (0.90)^k \le 10^{-8}$$
$$k \ln(0.90) \le \ln(10^{-8}) \implies k(-0.10536) \le -18.4207$$
$$k \ge \frac{-18.4207}{-0.10536} \approx 174.83 \implies k = 175 \text{ iterations}$$

---

### Exercise 8.6: Contraction Under Zero Reward
If all rewards are zero ($r_\pi(s) \equiv 0$), what is the unique fixed point of $T^\pi$?

#### Solution:
The fixed-point equation is $\mathbf{v} = \mathbf{0} + \gamma \mathbf{P}_\pi \mathbf{v} \implies (\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v} = \mathbf{0}$.
Since $(\mathbf{I} - \gamma \mathbf{P}_\pi)$ is invertible, the only solution is the zero vector:
$$\mathbf{v}_\pi = \mathbf{0}$$

---

### Exercise 8.7: Synchronous Policy Evaluation Convergence
Prove that if $\mathbf{v}_1 = \mathbf{v}_0$, the algorithm has reached the exact fixed point.

#### Solution:
By definition, $\mathbf{v}_1 = T^\pi \mathbf{v}_0$.
If $\mathbf{v}_1 = \mathbf{v}_0$, then $T^\pi \mathbf{v}_0 = \mathbf{v}_0$.
Thus $\mathbf{v}_0$ satisfies the definition of a fixed point. By the Banach uniqueness theorem, $\mathbf{v}_0 = \mathbf{v}_\pi$.

---

### Exercise 8.8: Dynamic Programming as Expected Update
Why are Dynamic Programming updates referred to as "expected updates" (or "full backups") in contrast to sample updates?

#### Solution:
Because they compute the complete mathematical expectation across all possible next states and actions using the model's true transition probabilities ($\sum_{s'} \mathcal{P}_{s, s'}^a v(s')$), rather than drawing a single sampled state transition from an actual environmental interaction ($R_{t+1} + \gamma V(S_{t+1})$).

---

### Exercise 8.9: Gauss-Seidel Update Order Dependency
Does the order in which states are swept in Gauss-Seidel in-place DP affect the final converged value vector?

#### Solution:
No. The ordering affects the trajectory of intermediate iterates and the number of sweeps required to reach convergence, but the final limit point is uniquely determined by the Banach Fixed-Point Theorem: all orderings converge to the identical fixed point $\mathbf{v}_\pi$.

---

### Exercise 8.10: Infinite-Horizon Undiscounted Policy Evaluation Condition
Under what condition on the environment does undiscounted policy evaluation ($\gamma = 1.0$) converge to a unique, finite fixed point?

#### Solution:
Convergence is guaranteed if and only if all policies lead to an absorbing terminal state with probability 1.0 from every state (i.e. every state is transient), ensuring that the transient transition sub-matrix has spectral radius strictly less than 1 ($\rho(\mathbf{Q}) < 1$).


# Chapter 9: Dynamic Programming II: Policy Improvement and Generalized Policy Iteration (GPI)

---

## 9.1 From Prediction to Control: The Policy Improvement Theorem

In Chapter 8, we conquered the **Prediction Problem**: given a fixed policy $\pi$, we can iteratively apply the Bellman Expectation Operator $T^\pi$ to compute its exact state-value function $v_\pi(s)$.

Now we confront the ultimate goal of reinforcement learning: the **Control Problem**. 
> *"Once we have computed the value function $v_\pi$ of our current policy $\pi$, how do we use that knowledge to construct a strictly superior policy $\pi'$?"*

The mathematical key that unlocks control is the celebrated **Policy Improvement Theorem** (Bellman 1957, Howard 1960).

```
                            THE POLICY IMPROVEMENT STEP
                                         â”‚
                                   Current Policy Ï€
                                         â”‚
                                         â–¼ Evaluate
                                   Compute v_Ï€(s)
                                         â”‚
                                         â–¼ Counterfactual Action Lookahead
                          q_Ï€(s, a) = r(s, a) + Î³ Î£_{s'} P_{s,s'}^a v_Ï€(s')
                                         â”‚
                                         â–¼ Greedy Selection
                                  Ï€'(s) = argmax_a q_Ï€(s, a)
                                         â”‚
                                         â–¼
                      Policy Improvement Theorem Guarantees:
                           v_{Ï€'}(s) â‰¥ v_Ï€(s) FOR ALL s âˆˆ S!
```

---

## 9.2 Rigorous Proof of the Policy Improvement Theorem

### Theorem Statement:
Let $\pi$ and $\pi'$ be any pair of deterministic stationary policies such that for all states $s \in \mathcal{S}$:

$$q_\pi(s, \pi'(s)) \ge v_\pi(s)$$

Then policy $\pi'$ is globally superior to or equal to policy $\pi$:

$$v_{\pi'}(s) \ge v_\pi(s), \quad \forall s \in \mathcal{S}$$

Furthermore, if there exists at least one state $s_0$ where the inequality is strict ($q_\pi(s_0, \pi'(s_0)) > v_\pi(s_0)$), then $\pi'$ strictly outperforms $\pi$ ($v_{\pi'}(s_0) > v_\pi(s_0)$).

### Proof (by Induction and Recursive Expansion):
We begin with the premise:
$$v_\pi(s) \le q_\pi(s, \pi'(s))$$

Expand $q_\pi(s, \pi'(s))$ using its definition as immediate reward plus discounted successor value:
$$v_\pi(s) \le \mathbb{E}_{\pi'} [R_{t+1} + \gamma v_\pi(S_{t+1}) \mid S_t = s]$$

Now, observe that the successor state $S_{t+1}$ is evaluated using $v_\pi(S_{t+1})$. 
By our original premise, for any state $S_{t+1}$, we also know that $v_\pi(S_{t+1}) \le q_\pi(S_{t+1}, \pi'(S_{t+1}))$. 
Substitute this inequality into the expectation:
$$\begin{aligned}
v_\pi(s) &\le \mathbb{E}_{\pi'} \left[ R_{t+1} + \gamma q_\pi(S_{t+1}, \pi'(S_{t+1})) \;\middle|\; S_t = s \right] \\
&= \mathbb{E}_{\pi'} \left[ R_{t+1} + \gamma \mathbb{E}_{\pi'} [R_{t+2} + \gamma v_\pi(S_{t+2}) \mid S_{t+1}] \;\middle|\; S_t = s \right]
\end{aligned}$$

By the Law of Total Expectation, the conditional expectations collapse into a single trajectory expectation:
$$v_\pi(s) \le \mathbb{E}_{\pi'} [R_{t+1} + \gamma R_{t+2} + \gamma^2 v_\pi(S_{t+2}) \mid S_t = s]$$

We can repeat this unrolling process recursively for $k$ time steps:
$$v_\pi(s) \le \mathbb{E}_{\pi'} \left[ R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots + \gamma^{k-1} R_{t+k} + \gamma^k v_\pi(S_{t+k}) \;\middle|\; S_t = s \right]$$

Now take the limit as the horizon $k \to \infty$. 
Because $\gamma \in [0, 1)$ and all state values are bounded ($|v_\pi(s)| \le \frac{R_{\max}}{1 - \gamma} < \infty$), the tail term vanishes:
$$\lim_{k \to \infty} \gamma^k \mathbb{E}_{\pi'} [v_\pi(S_{t+k}) \mid S_t = s] = 0$$

The remaining infinite sum is, by definition, the state-value function under policy $\pi'$:
$$v_\pi(s) \le \mathbb{E}_{\pi'} \left[ \sum_{k=0}^{\infty} \gamma^k R_{t+k+1} \;\middle|\; S_t = s \right] = v_{\pi'}(s)$$

$$v_\pi(s) \le v_{\pi'}(s) \quad \blacksquare$$

This completes the proof. By simply choosing an action whose quality $q_\pi(s, a)$ meets or exceeds the current baseline value $v_\pi(s)$, we guarantee that the new policy will never degrade performance in any state.

---

## 9.3 The Greedy Policy Improvement Step

Given a value function $v_\pi$, how do we construct a policy $\pi'$ that satisfies the condition $q_\pi(s, \pi'(s)) \ge v_\pi(s)$?
The most natural, aggressive strategy is the **Greedy Update**: in every state, choose the action that maximizes $q_\pi(s, a)$:

$$\pi'(s) \doteq \arg\max_{a \in \mathcal{A}(s)} q_\pi(s, a) = \arg\max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v_\pi(s') \right]$$

By definition of the maximum operator:
$$q_\pi(s, \pi'(s)) = \max_{a \in \mathcal{A}(s)} q_\pi(s, a) \ge \sum_{a \in \mathcal{A}(s)} \pi(a \mid s) q_\pi(s, a) = v_\pi(s)$$
The greedy policy improvement condition is unconditionally satisfied everywhere.

---

## 9.4 The Complete Policy Iteration Algorithm

By alternating between exact Policy Evaluation and greedy Policy Improvement, we arrive at **Policy Iteration** (Howard 1960):

$$\pi_0 \xrightarrow{\text{Evaluation}} v_{\pi_0} \xrightarrow{\text{Improvement}} \pi_1 \xrightarrow{\text{Evaluation}} v_{\pi_1} \xrightarrow{\text{Improvement}} \pi_2 \xrightarrow{\text{Evaluation}} \dots \xrightarrow{\text{Improvement}} \pi^*$$

```
                         POLICY ITERATION ALGORITHM
                                     â”‚
                             Initialize Ï€_0(s)
                             (Arbitrary policy)
                                     â”‚
                                     â–¼
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
               â”Œâ”€â”€â”€â–ºâ”‚       POLICY EVALUATION         â”‚
               â”‚    â”‚ Compute exact v_Ï€ via iterative â”‚
               â”‚    â”‚ sweeps or matrix inversion      â”‚
               â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
               â”‚                     â”‚
               â”‚                     â–¼
               â”‚    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
               â”‚    â”‚       POLICY IMPROVEMENT        â”‚
               â”‚    â”‚ Ï€_{new}(s) = argmax_a q_Ï€(s, a) â”‚
               â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
               â”‚                     â”‚
               â”‚                     â–¼
               â”‚            Did Policy Change?
               â”‚              Ï€_{new} == Ï€?
               â”‚             /             \
               â””â”€â”€ YES (changed)            â””â”€â”€ NO (stable) â”€â”€â–º TERMINATE: Ï€* is Optimal!
```

### Finite Termination Proof
Why is Policy Iteration guaranteed to converge to the optimal policy in a **finite number of steps**?

**Proof:**
1. In a finite MDP with $|\mathcal{S}|$ states and $|\mathcal{A}|$ actions, the total number of distinct deterministic policies is finite:
   $$|\Pi| = |\mathcal{A}|^{|\mathcal{S}|}$$
2. At each iteration, either:
   - $\pi_{k+1}$ is strictly superior to $\pi_k$ (there is at least one state where $v_{\pi_{k+1}}(s) > v_{\pi_k}(s)$), OR
   - $\pi_{k+1}$ achieves identical value to $\pi_k$ across all states.
3. If $v_{\pi_{k+1}}(s) = v_{\pi_k}(s)$ for all $s$, then:
   $$v_{\pi_k}(s) = \max_a q_{\pi_k}(s, a) = \max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v_{\pi_k}(s') \right]$$
   This is precisely the Bellman Optimality Equation! Thus, $v_{\pi_k} = v^*$, and policy $\pi_k$ is globally optimal.
4. Because each non-terminal step strictly improves the value, no policy can ever be revisited (no cycles). Since the total number of policies is finite, the algorithm **must terminate in at most $|\mathcal{A}|^{|\mathcal{S}|}$ iterations**.

In practice, Policy Iteration terminates in a tiny fraction of that theoretical upper boundâ€”frequently in fewer than 10 iterations even for thousands of states.

---

## 9.5 Generalized Policy Iteration (GPI)

In classical Policy Iteration, policy evaluation is run to complete mathematical convergence before policy improvement is attempted. 

Sutton & Barto recognized that this strict separation is unnecessary. They formulated the unifying paradigm of **Generalized Policy Iteration (GPI)**:
> **Generalized Policy Iteration (GPI)** refers to the general concept of letting policy evaluation and policy improvement processes interact, independent of the granularity and other details of the two processes.

```
                           THE GPI GEOMETRIC DANCE
                 Value Functions V
                         â–²
                         â”‚       / Value matches current policy
                         â”‚      /  v = v_Ï€
                         â”‚     /
                         â”‚    /  â— (v*, Ï€*) Bellman Optimality Point
                         â”‚   /  / 
                         â”‚  /  /  Policy is greedy with respect to v
                         â”‚ /  /   Ï€ = greedy(v)
                         â”‚/  /
                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Policies Î 
```

In GPI:
- **Evaluation** drives the value function toward consistency with the current policy.
- **Improvement** makes the policy greedy with respect to the current value function.
- The two processes compete and cooperate: evaluation changes the landscape upon which the policy acts; improvement alters the behavior that evaluation is trying to measure.
- The two processes stabilize if and only if a value function and policy are reached that are greedy with respect to each other: **the optimal fixed point $(v^*, \pi^*)$**.

---

## 9.6 Worked Examples: Policy Iteration Traces

### Example 9.1: Complete Policy Iteration Trace on a 2-State MDP
Consider an MDP with states $\mathcal{S} = \{s_1, s_2\}$ and actions $\mathcal{A} = \{a_1, a_2\}$ with $\gamma = 0.50$.
- In state $s_1$:
  - Action $a_1$: transitions to $s_1$ with prob 1.0, reward $R = 1.0$.
  - Action $a_2$: transitions to $s_2$ with prob 1.0, reward $R = 2.0$.
- In state $s_2$:
  - Action $a_1$: transitions to $s_2$ with prob 1.0, reward $R = 4.0$.
  - Action $a_2$: transitions to $s_1$ with prob 1.0, reward $R = 0.0$.

Initialize with policy $\pi_0$: choose $a_1$ in both states ($\pi_0(s_1) = a_1, \pi_0(s_2) = a_1$).
Execute complete Policy Iteration to convergence.

#### Solution:
**Iteration 1:**
*Step 1: Evaluate $\pi_0$:*
- Under $\pi_0(s_1) = a_1$: loops on $s_1$ with $R = 1$:
  $$v(s_1) = 1.0 + 0.50 v(s_1) \implies 0.50 v(s_1) = 1.0 \implies v(s_1) = 2.0$$
- Under $\pi_0(s_2) = a_1$: loops on $s_2$ with $R = 4$:
  $$v(s_2) = 4.0 + 0.50 v(s_2) \implies 0.50 v(s_2) = 4.0 \implies v(s_2) = 8.0$$
Current value vector: $\mathbf{v}_{\pi_0} = [2.0, 8.0]^T$.

*Step 2: Improve Policy:*
Compute Q-values for all state-action pairs using $\mathbf{v}_{\pi_0}$:
- State $s_1$:
  - $q(s_1, a_1) = 1.0 + 0.50 v(s_1) = 1.0 + 0.50(2.0) = 2.0$
  - $q(s_1, a_2) = 2.0 + 0.50 v(s_2) = 2.0 + 0.50(8.0) = 2.0 + 4.0 = 6.0$
  $\arg\max_a q(s_1, a) = a_2$ (since $6.0 > 2.0$). New action: $\pi_1(s_1) = a_2$.
- State $s_2$:
  - $q(s_2, a_1) = 4.0 + 0.50 v(s_2) = 4.0 + 0.50(8.0) = 8.0$
  - $q(s_2, a_2) = 0.0 + 0.50 v(s_1) = 0.0 + 0.50(2.0) = 1.0$
  $\arg\max_a q(s_2, a) = a_1$ (since $8.0 > 1.0$). Retains action: $\pi_1(s_2) = a_1$.

Policy changed! $\pi_1 = [a_2, a_1]^T \neq \pi_0$. Proceed to Iteration 2.

---

**Iteration 2:**
*Step 1: Evaluate $\pi_1$:*
Under $\pi_1$:
- In $s_1$: takes $a_2 \to s_2$ with $R = 2$.
- In $s_2$: takes $a_1 \to s_2$ with $R = 4$.
Solve:
$$v_{\pi_1}(s_2) = 4.0 + 0.50 v_{\pi_1}(s_2) \implies v_{\pi_1}(s_2) = 8.0$$
$$v_{\pi_1}(s_1) = 2.0 + 0.50 v_{\pi_1}(s_2) = 2.0 + 0.50(8.0) = 6.0$$
Current value vector: $\mathbf{v}_{\pi_1} = [6.0, 8.0]^T$.
Notice: $v(s_1)$ increased from $2.0 \to 6.0$!

*Step 2: Improve Policy:*
Compute Q-values using $\mathbf{v}_{\pi_1} = [6.0, 8.0]^T$:
- State $s_1$:
  - $q(s_1, a_1) = 1.0 + 0.50(6.0) = 4.0$
  - $q(s_1, a_2) = 2.0 + 0.50(8.0) = 6.0$
  $\arg\max = a_2 \implies \pi_2(s_1) = a_2$.
- State $s_2$:
  - $q(s_2, a_1) = 4.0 + 0.50(8.0) = 8.0$
  - $q(s_2, a_2) = 0.0 + 0.50(6.0) = 3.0$
  $\arg\max = a_1 \implies \pi_2(s_2) = a_1$.

*Termination Check:*
$\pi_2 = [a_2, a_1]^T == \pi_1$.
The policy is strictly identical to the previous iteration.
**Policy Iteration terminates!** Optimal policy $\pi^* = [a_2, a_1]^T$, optimal values $v^* = [6.0, 8.0]^T$. Converged in exactly 2 iterations!

---

### Example 9.2: Tracing Policy Improvement on a Line Graph
Consider 3 states in a line: $s_1 \longleftrightarrow s_2 \longleftrightarrow s_3$.
Actions: $\{\text{Left}, \text{Right}\}$.
- Reaching $s_3$ earns reward $R = +10.0$ and terminates.
- All other steps earn $R = -1.0$.
- Let $\gamma = 0.90$.
Start with naive policy $\pi_0$ that always moves $\text{Left}$ ($\pi_0(s) = \text{Left}$ for all $s$).
Show how a single policy improvement step alters the policy.

#### Solution:
Under $\pi_0$ (always Left):
- From $s_1$: bounces off boundary, stays in $s_1$ with $R = -1$.
- Values under $\pi_0$: $v(s) = \frac{-1}{1 - 0.9} = -10.0$ for all states.
Now execute Policy Improvement using $v_{\pi_0} = [-10, -10, -10]^T$:
- In state $s_2$:
  - $q(s_2, \text{Left}) = -1.0 + 0.90 v(s_1) = -1.0 + 0.90(-10.0) = -10.0$.
  - $q(s_2, \text{Right}) = -1.0 + 0.90 v(s_3) = -1.0 + 0.90(0) = -1.0$ (since reaching terminal $s_3$ gives $+10$, wait: action Right from $s_2$ enters terminal $s_3$ with $R = +10$!).
  $$q(s_2, \text{Right}) = +10.0 + 0.90(0) = +10.0$$
  Comparing: $q(s_2, \text{Right}) = +10.0 > -10.0 = q(s_2, \text{Left})$.
  $\pi'(s_2)$ immediately flips to **Right**!
In a single policy improvement step, the agent eliminates suicidal leftward looping.

---

### Example 9.3: Maximum Number of Iterations Bound
An autonomous warehouse has 50 grid locations. In each location, the robot can choose from 4 directions.
1. What is the theoretical maximum number of deterministic policies?
2. If Policy Iteration terminates in 6 iterations, what percentage of the policy space was explored?

#### Solution:
1. Total policies:
   $$|\Pi| = 4^{50} = (2^2)^{50} = 2^{100} \approx 1.26765 \times 10^{30} \text{ policies}$$
2. Percentage evaluated:
   $$\text{Fraction} = \frac{6}{1.26765 \times 10^{30}} \approx 4.73 \times 10^{-30} = 4.73 \times 10^{-28}\%$$
Policy Iteration finds the global optimal policy across a space of $10^{30}$ candidates by inspecting less than a quintillionth of a percent of the candidates.

---

### Example 9.4: Tie-Breaking Hazards in Policy Improvement
Suppose state $s$ has two actions $a_1$ and $a_2$ such that $q_\pi(s, a_1) = q_\pi(s, a_2) = 15.0$.
If an engineer implements tie-breaking by flipping between tied actions on alternating iterations, what pathological software bug occurs?

#### Solution:
If the tie-breaking logic flips between $a_1$ and $a_2$:
- Iteration $k$: evaluates $\pi_k(s) = a_1$. Greedy update sees tie, selects $a_2 \implies \pi_{k+1}(s) = a_2$.
- Iteration $k+1$: evaluates $\pi_{k+1}(s) = a_2$. Greedy update sees tie, selects $a_1 \implies \pi_{k+2}(s) = a_1$.
The termination check `if (new_policy == old_policy)` fails every time. The algorithm oscillates in an **infinite ping-pong loop** between two equally optimal policies.
**Correct Implementation:** Always preserve the existing action if it achieves the maximum:
$$\pi_{k+1}(s) = \begin{cases} \pi_k(s) & \text{if } q(s, \pi_k(s)) = \max_a q(s, a) \\ \arg\max_a q(s, a) & \text{otherwise} \end{cases}$$

---

### Example 9.5: Policy Improvement with Stochastic Policies
Let $\pi$ be a stochastic policy. Prove that if $\pi'$ is chosen such that $\pi'(a \mid s) > 0$ only for actions that achieve $\max_a q_\pi(s, a)$, then $v_{\pi'}(s) \ge v_\pi(s)$.

#### Solution:
Evaluate the expected action value under $\pi'$:
$$q_\pi(s, \pi'(s)) = \sum_{a \in \mathcal{A}(s)} \pi'(a \mid s) q_\pi(s, a)$$
Because $\pi'$ assigns probability only to actions in $\arg\max_a q_\pi(s, a)$:
$$q_\pi(s, \pi'(s)) = \sum_a \pi'(a \mid s) \max_{a'} q_\pi(s, a') = \max_{a'} q_\pi(s, a') \sum_a \pi'(a \mid s) = \max_{a'} q_\pi(s, a')$$
Furthermore, under the original policy $\pi$:
$$v_\pi(s) = \sum_a \pi(a \mid s) q_\pi(s, a) \le \max_{a'} q_\pi(s, a')$$
Therefore:
$$q_\pi(s, \pi'(s)) \ge v_\pi(s)$$
By the Policy Improvement Theorem, $v_{\pi'}(s) \ge v_\pi(s)$ everywhere.

---

### Example 9.6: Truncated Policy Iteration (Modified Policy Iteration)
In Modified Policy Iteration (Puterman & Shin 1978), Policy Evaluation is stopped after $m$ iterative sweeps rather than running to full convergence ($\theta$).
Let $m = 1$. Trace how Modified Policy Iteration differs from Value Iteration.

#### Solution:
When $m = 1$, each iteration executes:
1. One sweep of policy evaluation: $v_{k+1/2}(s) = r(s, \pi_k(s)) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^{\pi_k(s)} v_k(s')$.
2. One greedy policy update: $\pi_{k+1}(s) = \arg\max_a [r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v_{k+1/2}(s')]$.
If step 1 and step 2 are collapsed into a single step:
$$v_{k+1}(s) = \max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v_k(s') \right]$$
This is **Value Iteration**! Modified Policy Iteration with $m = 1$ is mathematically identical to Value Iteration. Value Iteration is simply Policy Iteration with the evaluation phase truncated to a single sweep.

---

### Example 9.7: Monotonicity of Successive Policy Values
Prove that for any sequence of policies $\pi_0, \pi_1, \pi_2, \dots$ generated by exact Policy Iteration:
$$v_{\pi_0}(s) \le v_{\pi_1}(s) \le v_{\pi_2}(s) \le \dots \le v^*(s), \quad \forall s \in \mathcal{S}$$

#### Solution:
By the Policy Improvement Theorem (Section 9.2):
At every iteration $k$, the greedy policy satisfies $q_{\pi_k}(s, \pi_{k+1}(s)) \ge v_{\pi_k}(s)$, which guarantees:
$$v_{\pi_k}(s) \le v_{\pi_{k+1}}(s), \quad \forall s \in \mathcal{S}$$
Furthermore, since $v^*(s) = \max_\pi v_\pi(s)$ by definition, $v_{\pi_k}(s) \le v^*(s)$ for all $k$.
Thus, the sequence $\{v_{\pi_k}(s)\}$ is a monotonically non-decreasing sequence bounded above by $v^*(s)$ for every state $s$.

---

### Example 9.8: Policy Oscillation with Stale Values
Suppose an asynchronous algorithm updates policy $\pi$ in state $s_1$ using a value function that was computed 100 iterations ago for state $s_2$.
Explain why the Policy Improvement Theorem may fail to guarantee $v_{\pi'} \ge v_\pi$ when values are stale or inaccurate.

#### Solution:
The Policy Improvement Theorem premise explicitly requires:
$$q_\pi(s, \pi'(s)) \ge v_\pi(s)$$
where $q_\pi$ is computed using the **true** value function $v_\pi$ of policy $\pi$.
If stale or estimated values $\hat{v} \neq v_\pi$ are used, an action that appears greedy under $\hat{v}$ may actually satisfy $q_\pi(s, \pi'(s)) < v_\pi(s)$ under the true values. In this case, the premise of the theorem is violated, and the new policy $\pi'$ can perform strictly worse than $\pi$.

---

### Example 9.9: Action Elimination in Large Action Spaces
In an MDP with $|\mathcal{A}| = 1,000$ actions per state, evaluating all actions at every policy improvement step is expensive.
Explain how an upper bound $\hat{q}(s, a)$ on action values can safely prune sub-optimal actions without sacrificing optimality.

#### Solution:
Let $q_{\max} = \max_{a \in \mathcal{A}_{\text{eval}}} q(s, a)$ be the best action-value evaluated so far in state $s$.
If for some candidate action $a'$, we can compute a cheap upper bound $\bar{q}(s, a') \ge q(s, a')$:
$$\text{If } \bar{q}(s, a') < q_{\max} \implies q(s, a') < q_{\max}$$
Action $a'$ is mathematically guaranteed to be strictly sub-optimal. It can be immediately eliminated without performing expensive transition calculations or successor state lookups.

---

### Example 9.10: Computational Complexity Comparison: PI vs Direct Inversion
Compare the computational complexity of Policy Iteration against brute-force policy search for an MDP with $N = 100$ states and $|\mathcal{A}| = 4$ actions, assuming Policy Iteration converges in 5 iterations and uses Gaussian elimination ($O(N^3)$) for evaluation.

#### Solution:
- **Brute-Force Policy Evaluation:**
  There are $4^{100} \approx 1.6 \times 10^{60}$ deterministic policies.
  Evaluating each via Gaussian elimination ($100^3 = 10^6$ ops):
  $$\text{Total Ops} \approx 1.6 \times 10^{60} \times 10^6 = 1.6 \times 10^{66} \text{ FLOPs} \quad (\text{Impossible})$$
- **Policy Iteration:**
  Each iteration requires:
  - Evaluation: $10^6$ ops.
  - Improvement: $N \times |\mathcal{A}| = 100 \times 4 = 400$ ops.
  For 5 iterations:
  $$\text{Total Ops} \approx 5 \times (10^6 + 400) \approx 5 \times 10^6 \text{ FLOPs} \quad (\approx 5 \text{ milliseconds!})$$
Policy Iteration reduces the time from longer than the age of the universe to a few milliseconds.

---

## 9.7 Solved Exercises

### Exercise 9.1: Verification of Policy Improvement Condition
If $v_\pi(s) = 8.0$, and the available action qualities in state $s$ are $q_\pi(s, a_1) = 6.0, q_\pi(s, a_2) = 8.0, q_\pi(s, a_3) = 11.5$, which action will greedy policy improvement select, and what is the advantage $A_\pi(s, \pi'(s))$?

#### Solution:
$$\pi'(s) = \arg\max(6.0, 8.0, 11.5) = a_3$$
$$A_\pi(s, a_3) = q_\pi(s, a_3) - v_\pi(s) = 11.5 - 8.0 = +3.5$$

---

### Exercise 9.2: Stability Check
If for all states $s \in \mathcal{S}$, $\arg\max_a q_\pi(s, a) = \pi(s)$, what does the Policy Improvement Theorem imply about policy $\pi$?

#### Solution:
It implies that no action can strictly improve value over $\pi(s)$, which means $v_\pi(s) = \max_a q_\pi(s, a)$ everywhere. This satisfies the Bellman Optimality Equation. Policy $\pi$ is globally optimal: $\pi = \pi^*$.

---

### Exercise 9.3: Minimum Value Increase
Suppose that at state $s_0$, $q_\pi(s_0, \pi'(s_0)) = v_\pi(s_0) + \epsilon$, with $\epsilon > 0$, and for all other states $s \neq s_0$, $q_\pi(s, \pi'(s)) = v_\pi(s)$.
Prove that $v_{\pi'}(s_0) \ge v_\pi(s_0) + \epsilon$.

#### Solution:
From the proof of the Policy Improvement Theorem:
$$v_{\pi'}(s_0) = q_\pi(s_0, \pi'(s_0)) + \sum_{k=1}^\infty \gamma^k \mathbb{E}_{\pi'} [q_\pi(S_{t+k}, \pi'(S_{t+k})) - v_\pi(S_{t+k}) \mid S_t = s_0]$$
Since $q_\pi(s, \pi'(s)) - v_\pi(s) \ge 0$ for all states:
$$v_{\pi'}(s_0) \ge q_\pi(s_0, \pi'(s_0)) + 0 = v_\pi(s_0) + \epsilon$$

---

### Exercise 9.4: Number of Policy Changes
In an MDP with 10 states and 2 actions, what is the maximum number of times the policy can change before Policy Iteration terminates?

#### Solution:
The number of distinct policies is $2^{10} = 1024$.
Since no policy can be visited twice, the policy can change at most $1024 - 1 = 1023$ times.

---

### Exercise 9.5: Policy Evaluation Stopping Precision
Why does Policy Iteration not require policy evaluation to converge to machine epsilon ($10^{-16}$) to perform a successful policy improvement step?

#### Solution:
Because greedy policy improvement depends only on the relative argmax ordering of actions ($\arg\max_a q(s, a)$), not on the precise numerical decimal values. As long as the evaluation error is smaller than the gap between the best action and the second-best action ($\|v - v_\pi\|_\infty < \frac{1}{2} \min_s [q(s, a^*) - q(s, a_{\text{sub}})]$), the policy improvement step produces the exact same optimal policy.

---

### Exercise 9.6: Cyclic Policy Improvement Hazard
Can Policy Iteration enter an infinite cycle if there are no ties in action values?

#### Solution:
No. If there are no ties, every non-terminal improvement step produces a strictly higher value function for at least one state: $v_{\pi_{k+1}} > v_{\pi_k}$. Since values are strictly monotonically increasing, no previous policy can ever achieve equal or higher value, rendering cycles impossible.

---

### Exercise 9.7: Policy Iteration on absorbing MRP
If an MDP has only 1 action in every state ($|\mathcal{A}(s)| = 1, \forall s$), how many iterations does Policy Iteration require to terminate?

#### Solution:
Exactly 1 iteration. The initial policy $\pi_0$ is the only valid policy. It is evaluated, the improvement step finds no alternative actions, detects $\pi_1 = \pi_0$, and terminates immediately.

---

### Exercise 9.8: Value Divergence Check in Policy Improvement
Can a greedy policy improvement step ever decrease the value function of any state?

#### Solution:
No. The Policy Improvement Theorem guarantees that $v_{\pi'}(s) \ge v_\pi(s)$ simultaneously across all states $s \in \mathcal{S}$. Degradation is mathematically impossible under exact evaluation.

---

### Exercise 9.9: Deterministic Policy Representation in Code
Write a 1-line TypeScript type signature representing a deterministic policy over generic state type `S` and action type `A`.

#### Solution:
```typescript
type DeterministicPolicy<S, A> = (state: S) => A;
```
or tabularly:
```typescript
type TabularPolicy<S extends string | number, A> = Record<S, A>;
```

---

### Exercise 9.10: Generalized Policy Iteration Synergy
Summarize in one sentence the core synergy between Policy Evaluation and Policy Improvement in GPI.

#### Solution:
Policy Evaluation makes the value function consistent with the current policy, while Policy Improvement makes the policy greedy with respect to the current value function, driving both iteratively toward mutual consistency at the optimal solution $(v^*, \pi^*)$.


# Chapter 10: Dynamic Programming III: Value Iteration, Asynchronous DP, and Curse of Dimensionality

---

## 10.1 Truncating the Evaluation Loop: The Value Iteration Breakthrough

In Chapter 9, we examined Policy Iteration, which requires running iterative policy evaluation to convergence in each outer loop. However, each evaluation phase may require hundreds of sweeps across the entire state space, only to make a subtle adjustment to the policy.

Can we truncate policy evaluation early? What happens if we stop policy evaluation after **exactly one single sweep**?

```
                      POLICY ITERATION vs. VALUE ITERATION
                                       â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â–¼                                                     â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚     POLICY ITERATION      â”‚                         â”‚      VALUE ITERATION      â”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                         â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ â€¢ Outer Loop: Policy Ï€    â”‚                         â”‚ â€¢ Single Unified Loop     â”‚
 â”‚ â€¢ Inner Loop: 100+ sweeps â”‚                         â”‚ â€¢ Combines 1 sweep of     â”‚
 â”‚   until ||v_{k+1}-v_k|| < Î¸â”‚                         â”‚   evaluation with max     â”‚
 â”‚ â€¢ Explicit policy array   â”‚                         â”‚ â€¢ No explicit policy      â”‚
 â”‚ â€¢ Huge evaluation cost    â”‚                         â”‚   stored during sweeps!   â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

When policy evaluation is truncated to a single step, the evaluation and improvement steps collapse into a single unified update equation known as **Value Iteration** (Bellman 1957):

$$v_{k+1}(s) = \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v_k(s') \right]$$

In Value Iteration, we do not store an explicit policy table during the sweeps. We update the state-value estimates directly toward the Bellman optimality condition until the values stabilize, extracting the optimal policy $\pi^*$ only at the very end.

---

## 10.2 The Bellman Optimality Operator $T^*$

To analyze Value Iteration with mathematical rigor, we define the **Bellman Optimality Operator** $T^*: \mathbb{R}^{|\mathcal{S}|} \to \mathbb{R}^{|\mathcal{S}|}$:

$$(T^* \mathbf{v})(s) \doteq \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s' \in \mathcal{S}} \mathcal{P}_{s, s'}^a v(s') \right]$$

In terms of the operator $T^*$, Value Iteration is simply the repeated application of $T^*$ to an initial value vector $\mathbf{v}_0$:

$$\mathbf{v}_{k+1} = T^* \mathbf{v}_k = (T^*)^k \mathbf{v}_0$$

The Bellman Optimality Equation from Chapter 7 can now be stated as a fixed-point equation:
$$T^* \mathbf{v}^* = \mathbf{v}^*$$

Does the sequence $\mathbf{v}_{k+1} = T^* \mathbf{v}_k$ converge to $\mathbf{v}^*$? To answer this, we must prove that $T^*$ is a contraction mapping.

---

## 10.3 Rigorous Proof that $T^*$ is a $\gamma$-Contraction

Because $T^*$ includes the non-linear $\max$ operator, we cannot rely on linear cancellation as we did for $T^\pi$ in Chapter 8. We require an essential algebraic lemma.

### The Maximum Inequality Lemma:
For any two real-valued functions $f, g: \mathcal{X} \to \mathbb{R}$:
$$\left| \max_{x \in \mathcal{X}} f(x) - \max_{x \in \mathcal{X}} g(x) \right| \le \max_{x \in \mathcal{X}} |f(x) - g(x)|$$

**Proof of Lemma:**
Let $x_f \in \arg\max_x f(x)$ and $x_g \in \arg\max_x g(x)$.
Then:
$$\max_x f(x) - \max_x g(x) = f(x_f) - g(x_g) \le f(x_f) - g(x_f) \le |f(x_f) - g(x_f)| \le \max_x |f(x) - g(x)|$$
By exact symmetry, reversing the roles of $f$ and $g$:
$$\max_x g(x) - \max_x f(x) \le \max_x |f(x) - g(x)|$$
Combining both inequalities:
$$\left| \max_x f(x) - \max_x g(x) \right| \le \max_x |f(x) - g(x)| \quad \blacksquare$$

---

### Proof that $T^*$ is a $\gamma$-Contraction under $\|\cdot\|_\infty$:
Let $\mathbf{u}, \mathbf{v} \in \mathbb{R}^{|\mathcal{S}|}$ be any two arbitrary value vectors.
For any state $s \in \mathcal{S}$:
$$\left| (T^* \mathbf{u})(s) - (T^* \mathbf{v})(s) \right| = \left| \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a u(s') \right] - \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right] \right|$$

Applying the Maximum Inequality Lemma:
$$\le \max_{a \in \mathcal{A}(s)} \left| \left( r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a u(s') \right) - \left( r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right) \right|$$

The immediate rewards $r(s, a)$ cancel out:
$$= \max_{a \in \mathcal{A}(s)} \left| \gamma \sum_{s'} \mathcal{P}_{s, s'}^a [u(s') - v(s')] \right|$$

Apply the triangle inequality:
$$\le \max_{a \in \mathcal{A}(s)} \gamma \sum_{s'} \mathcal{P}_{s, s'}^a |u(s') - v(s')|$$

Since $|u(s') - v(s')| \le \|\mathbf{u} - \mathbf{v}\|_\infty$ for all $s'$:
$$\le \max_{a \in \mathcal{A}(s)} \gamma \|\mathbf{u} - \mathbf{v}\|_\infty \sum_{s'} \mathcal{P}_{s, s'}^a$$

Because $\sum_{s'} \mathcal{P}_{s, s'}^a = 1.0$ for every valid action:
$$\le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty$$

Because this inequality holds for every state $s \in \mathcal{S}$, taking the maximum over all states yields:
$$\|T^* \mathbf{u} - T^* \mathbf{v}\|_\infty \le \gamma \|\mathbf{u} - \mathbf{v}\|_\infty \quad \blacksquare$$

### Theoretical Consequences:
By the Banach Fixed-Point Theorem:
1. The optimal value function $\mathbf{v}^*$ is the **unique** fixed point of $T^*$.
2. Value Iteration converges to $\mathbf{v}^*$ from **any arbitrary initial vector $\mathbf{v}_0$**.
3. Convergence is geometric with rate $\gamma$.

---

## 10.4 The Value Iteration Algorithm and Stopping Criteria

```
                            VALUE ITERATION ALGORITHM
                                        â”‚
                                  Initialize v_0
                                  (e.g., all 0s)
                                        â”‚
                                        â–¼
                             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                        â”Œâ”€â”€â”€â–ºâ”‚  Sweep All States  â”‚
                        â”‚    â”‚  v_{k+1} = T* v_k  â”‚
                        â”‚    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                        â”‚              â”‚
                        â”‚              â–¼
                        â”‚    Calculate Max Shift:
                        â”‚    Î” = max_s |v_{k+1}(s) - v_k(s)|
                        â”‚              â”‚
                        â”‚              â–¼
                        â”‚     Is Î” < Î¸ (1-Î³)/(2Î³)?
                        â”‚         /         \
                        â””â”€â”€ NO â”€â”€â”˜           â””â”€â”€ YES â”€â”€â–º EXTRACT OPTIMAL POLICY:
                                                         Ï€*(s) = argmax_a q(s, a)
```

### The $\epsilon$-Optimality Stopping Rule:
To guarantee that the extracted policy $\pi^*$ is within $\epsilon$ of the true optimal value ($\|v_{\pi^*} - v^*\|_\infty \le \epsilon$), the iteration must stop when:

$$\Delta \doteq \|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty < \theta \doteq \frac{\epsilon (1 - \gamma)}{2\gamma}$$

---

## 10.5 Asynchronous Dynamic Programming

Standard Value Iteration sweeps through every single state in the state space on every pass. When $|\mathcal{S}|$ is in the millions, a single full sweep can take hours. 

**Asynchronous Dynamic Programming** algorithms break the lockstep global sweep paradigm: they update states individually in an arbitrary order, using whatever values are currently available for other states.

```
                           ASYNCHRONOUS DP ARCHITECTURES
                                         â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â–¼                            â–¼                            â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚ IN-PLACE ASYNC DP   â”‚      â”‚ PRIORITIZED SWEEPINGâ”‚      â”‚ REAL-TIME DP (RTDP) â”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤      â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤      â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ Updates states in   â”‚      â”‚ Maintains priority  â”‚      â”‚ Updates ONLY states â”‚
 â”‚ any order; saves    â”‚      â”‚ queue of Bellman    â”‚      â”‚ visited along simulatedâ”‚
 â”‚ 50% memory and      â”‚      â”‚ errors:             â”‚      â”‚ trajectory rollouts.â”‚
 â”‚ accelerates flow.   â”‚      â”‚ P = |v(s) - max q|  â”‚      â”‚ Focuses on relevant.â”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### 1. In-Place Value Iteration
Updates a single array $V(s)$ directly:
$$V(s) \leftarrow \max_{a \in \mathcal{A}(s)} \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a V(s') \right]$$
No second buffer is maintained. Information updates propagate through the network immediately within the same sweep.

### 2. Prioritized Sweeping (Moore & Atkeson 1993, Peng & Leckie 1993)
In many environments, $90\%$ of states experience zero change in value during early sweeps. Prioritized Sweeping orders updates based on the magnitude of the Bellman error:
1. Compute the Bellman error for state $s$:
   $$P \doteq \left| v(s) - \max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s') \right] \right|$$
2. Insert state $s$ into a Priority Queue with priority $P$.
3. While the queue is not empty:
   - Pop the state $s$ with the largest priority $P$.
   - Update $v(s) \leftarrow \max_a [r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s')]$.
   - For all predecessor states $\bar{s}$ that can transition to $s$:
     - Compute the potential change in $\bar{s}$: $P_{\bar{s}} = \gamma \mathcal{P}_{\bar{s}, s}^a |v_{\text{new}}(s) - v_{\text{old}}(s)|$.
     - If $P_{\bar{s}} > \theta$, insert or promote $\bar{s}$ in the queue.

### 3. Real-Time Dynamic Programming (RTDP, Barto, Bradtke & Singh 1995)
RTDP updates only the states that are actually encountered by an agent executing simulated trial episodes from an initial state distribution. 
- If large portions of the state space are irrelevant to achieving the goal (e.g. unreachable regions), RTDP skips them completely.
- Guarantees convergence to optimal value on all relevant states without ever sweeping the entire state space!

---

## 10.6 The Curse of Dimensionality

Why can't we solve every reinforcement learning problem using tabular Dynamic Programming? The fundamental computational obstacle was identified by Richard Bellman himself: **The Curse of Dimensionality**.

```
                           THE CURSE OF DIMENSIONALITY
   Dimensions (d)            Grid Resolution (k)            Total States (|S| = k^d)
         1                           100                                  100
         2                           100                               10,000
         3                           100                            1,000,000 (1 Million)
         4                           100                          100,000,000 (100 Million)
         6                           100                   1,000,000,000,000 (1 Trillion)
        10                           100                               10^20 (Intractable!)
```

### Exponential State Space Explosion
If a physical system is described by $d$ continuous state variables (e.g., position, velocity, orientation, angular velocity of joints in a robotic arm), and each variable is discretized into $k$ discrete bins:
$$|\mathcal{S}| = k^d$$
The state space grows **exponentially** with the number of state dimensions $d$.
- For a 7-degree-of-freedom robotic manipulator: $d = 14$ (7 joint angles + 7 joint velocities).
- Even with a coarse discretization of $k = 10$ bins per dimension:
  $$|\mathcal{S}| = 10^{14} = 100,000,000,000,000 \text{ states}$$
- Storing a single value per state as a 64-bit float would require:
  $$\text{Memory} = 10^{14} \times 8 \text{ bytes} = 800 \text{ Terabytes!}$$
- Performing a single sweep of Value Iteration across $10^{14}$ states would require months.

### The Motivation for Deep Reinforcement Learning
Tabular Dynamic Programming is the bedrock of theoretical RL, but it is bounded by the Curse of Dimensionality. To conquer real-world problems with high-dimensional states (such as raw camera pixel images in Atari games or continuous coordinates in robotics), we must replace discrete lookup tables with **Parametric Function Approximators**:
$$V(s) \approx V_\theta(s), \quad Q(s, a) \approx Q_\theta(s, a)$$
where $\theta$ represents the weights of a Deep Neural Network. This bridge from tabular dynamic programming to deep neural value approximation is the subject of Module #4.

---

## 10.7 Worked Examples: Value Iteration & Asynchronous Solvers

### Example 10.1: Hand Calculation of Two Value Iteration Sweeps
Consider an MDP with states $\mathcal{S} = \{s_1, s_2\}$ and actions $\mathcal{A} = \{a_1, a_2\}$ with $\gamma = 0.50$.
- In state $s_1$:
  - $a_1$: transitions to $s_1$ with prob 1.0, $R = 2.0$.
  - $a_2$: transitions to $s_2$ with prob 1.0, $R = 0.0$.
- In state $s_2$:
  - $a_1$: transitions to $s_2$ with prob 1.0, $R = 1.0$.
  - $a_2$: transitions to $s_1$ with prob 1.0, $R = 3.0$.
Initialize $v_0 = [0.0, 0.0]^T$.
Perform 2 synchronous Value Iteration sweeps by hand.

#### Solution:
Update equations:
$$v_{k+1}(s_1) = \max \begin{cases} q(s_1, a_1) = 2.0 + 0.50 v_k(s_1) \\ q(s_1, a_2) = 0.0 + 0.50 v_k(s_2) \end{cases}$$
$$v_{k+1}(s_2) = \max \begin{cases} q(s_2, a_1) = 1.0 + 0.50 v_k(s_2) \\ q(s_2, a_2) = 3.0 + 0.50 v_k(s_1) \end{cases}$$

**Sweep $k = 1$ (from $v_0 = [0, 0]$):**
- $s_1$: $\max(2.0 + 0, 0.0 + 0) = \max(2.0, 0.0) = 2.0$
- $s_2$: $\max(1.0 + 0, 3.0 + 0) = \max(1.0, 3.0) = 3.0$
Result: $\mathbf{v}_1 = [2.0, 3.0]^T$.

**Sweep $k = 2$ (from $v_1 = [2.0, 3.0]$):**
- $s_1$:
  - $q(s_1, a_1) = 2.0 + 0.50(2.0) = 3.0$
  - $q(s_1, a_2) = 0.0 + 0.50(3.0) = 1.5$
  $v_2(s_1) = \max(3.0, 1.5) = 3.0$
- $s_2$:
  - $q(s_2, a_1) = 1.0 + 0.50(3.0) = 2.5$
  - $q(s_2, a_2) = 3.0 + 0.50(2.0) = 4.0$
  $v_2(s_2) = \max(2.5, 4.0) = 4.0$
Result: $\mathbf{v}_2 = [3.0, 4.0]^T$.

---

### Example 10.2: Extracting Greedy Policy from Value Iteration Iterates
Using the iterate $\mathbf{v}_2 = [3.0, 4.0]^T$ from Example 10.1:
Extract the greedy policy $\pi_2(s_1)$ and $\pi_2(s_2)$.

#### Solution:
- In state $s_1$:
  - $q(s_1, a_1) = 2.0 + 0.50(3.0) = 3.5$
  - $q(s_1, a_2) = 0.0 + 0.50(4.0) = 2.0$
  $\arg\max_a q(s_1, a) = a_1 \implies \pi_2(s_1) = a_1$.
- In state $s_2$:
  - $q(s_2, a_1) = 1.0 + 0.50(4.0) = 3.0$
  - $q(s_2, a_2) = 3.0 + 0.50(3.0) = 4.5$
  $\arg\max_a q(s_2, a) = a_2 \implies \pi_2(s_2) = a_2$.
The extracted policy is $\pi_2 = [a_1, a_2]^T$, which matches the true optimal policy $\pi^*$.
Notice that Value Iteration identified the optimal policy by iteration 2, even before values fully converged to $v^* = [4.0, 5.0]^T$.

---

### Example 10.3: Numerical Convergence Verification of Value Iteration
Solve for the exact fixed point of Example 10.1 under optimal policy $\pi^* = [a_1, a_2]^T$:
- $v^*(s_1) = 2.0 + 0.5 v^*(s_1) \implies 0.5 v^*(s_1) = 2.0 \implies v^*(s_1) = 4.0$.
- $v^*(s_2) = 3.0 + 0.5 v^*(s_1) = 3.0 + 0.5(4.0) = 5.0$.
Verify that the error $\|\mathbf{v}_k - \mathbf{v}^*\|_\infty$ shrinks by exactly $\gamma = 0.50$ per iteration.

#### Solution:
- Iteration 0: $\mathbf{v}_0 = [0, 0] \implies \text{Error} = \max(|0 - 4|, |0 - 5|) = 5.0$.
- Iteration 1: $\mathbf{v}_1 = [2, 3] \implies \text{Error} = \max(|2 - 4|, |3 - 5|) = 2.0$.
- Iteration 2: $\mathbf{v}_2 = [3, 4] \implies \text{Error} = \max(|3 - 4|, |4 - 5|) = 1.0$.
- Iteration 3: $\mathbf{v}_3 = [3.5, 4.5] \implies \text{Error} = \max(|3.5 - 4|, |4.5 - 5|) = 0.5$.
Notice: $\frac{\text{Error}_{k+1}}{\text{Error}_k} = \frac{0.5}{1.0} = \frac{1.0}{2.0} = 0.50 = \gamma$.
The error contracts at the exact theoretical geometric rate $\gamma^k$.

---

### Example 10.4: Prioritized Sweeping Queue Trace
Consider a 3-state chain: $s_1 \to s_2 \to s_3$, where $s_3$ is a goal state ($R = +100$, absorbing).
All other transitions have $R = 0, \gamma = 0.90$.
Initialize $v(s_1) = v(s_2) = v(s_3) = 0$.
Trace how Prioritized Sweeping processes states.

#### Solution:
1. Initial Bellman errors:
   - State $s_2$: transitions to $s_3$ with $R = +100$. Bellman error $P(s_2) = |0 - (100 + 0.9 \times 0)| = 100.0$.
   - State $s_1$: transitions to $s_2$ with $R = 0$. Bellman error $P(s_1) = |0 - (0 + 0.9 \times 0)| = 0.0$.
   Priority Queue contains: $[(s_2, 100.0)]$.
2. Pop highest priority: state $s_2$.
   - Update $v(s_2) \leftarrow 100.0$.
   - Predecessor is $s_1$: compute priority update $P(s_1) = 0.90 \times |100.0 - 0.0| = 90.0$.
   - Insert $(s_1, 90.0)$ into queue.
3. Pop highest priority: state $s_1$.
   - Update $v(s_1) \leftarrow 0 + 0.90(100.0) = 90.0$.
   - Queue is now empty.
Both states converge to their exact optimal values in **just 2 targeted updates**, whereas standard synchronous sweeps would require redundant global passes.

---

### Example 10.5: In-Place vs Synchronous Value Iteration Comparison
On a 4-state linear maze $s_1 \to s_2 \to s_3 \to s_4$, where $s_4$ is terminal ($+10$), compare the number of sweeps required for reward information to reach start state $s_1$ under:
1. Synchronous Value Iteration.
2. In-place Value Iteration sweeping backwards ($s_3, s_2, s_1$).

#### Solution:
1. **Synchronous Sweeps:**
   - Sweep 1: $v(s_3)$ updates to $+10$; $v(s_2)$ and $v(s_1)$ remain 0.
   - Sweep 2: $v(s_2)$ updates to $\gamma(10)$; $v(s_1)$ remains 0.
   - Sweep 3: $v(s_1)$ updates to $\gamma^2(10)$.
   Requires **3 full sweeps** for information to propagate.
2. **In-Place Backward Sweep:**
   - Update $s_3$: $V(s_3) \leftarrow 10.0$.
   - Update $s_2$: immediately reads new $V(s_3) = 10 \implies V(s_2) \leftarrow \gamma(10)$.
   - Update $s_1$: immediately reads new $V(s_2) = \gamma(10) \implies V(s_1) \leftarrow \gamma^2(10)$.
   Requires **1 single sweep**! Information propagates the entire length of the chain in one pass.

---

### Example 10.6: Curse of Dimensionality in Self-Driving Perception
A self-driving car represents its environment using:
- Vehicle position: $(x, y)$ (discretized into $100 \times 100 = 10^4$ cells).
- Vehicle heading: $\theta$ (36 angles).
- Vehicle speed: $v$ (10 bins).
- Leading car distance: $d_{\text{lead}}$ (20 bins).
- Leading car relative velocity: $\Delta v$ (10 bins).

1. Calculate the total number of discrete states $|\mathcal{S}|$.
2. If the vehicle has 5 steering angles and 3 acceleration settings ($|\mathcal{A}| = 15$ actions), calculate the number of Q-values to store.

#### Solution:
**Step 1: State Space Size:**
$$|\mathcal{S}| = 10^4 \times 36 \times 10 \times 20 \times 10 = 10,000 \times 36 \times 2,000 = 7.2 \times 10^8 \text{ states} = 720,000,000 \text{ states}$$

**Step 2: Total Q-Values:**
$$|\mathcal{S}| \times |\mathcal{A}| = 7.2 \times 10^8 \times 15 = 1.08 \times 10^{10} \text{ state-action pairs}$$
At 8 bytes per float64, storing this Q-table requires:
$$\text{Memory} = 1.08 \times 10^{10} \times 8 \text{ bytes} \approx 86.4 \text{ Gigabytes!}$$
Even a modest state representation overwhelms standard workstation RAM, proving why deep neural function approximation is essential for autonomous vehicles.

---

### Example 10.7: Real-Time Dynamic Programming (RTDP) Efficiency
In a maze of $1,000,000$ states, only $500$ states lie along viable paths between the entrance and the exit; the remaining $999,500$ states are in dead-end caverns or sealed walls.
Explain why RTDP outperforms synchronous Value Iteration by a factor of 2,000 on this problem.

#### Solution:
Synchronous Value Iteration must evaluate all $1,000,000$ states at every sweep, expending $99.95\%$ of its computational energy calculating values for unreachable regions.
RTDP initiates simulated trajectories from the entrance and updates values strictly along the realized paths. It visits and updates only the $500$ relevant states, skipping the other $999,500$ states entirely. The ratio of updates is:
$$\frac{1,000,000}{500} = 2,000\times \text{ speedup}$$

---

### Example 10.8: Stopping Threshold Calculation for Target Accuracy
An engineer requires the extracted policy to be $\epsilon$-optimal with $\epsilon = 0.05$ under discount factor $\gamma = 0.90$.
Compute the numerical threshold $\theta$ for the stopping test $\|\mathbf{v}_{k+1} - \mathbf{v}_k\|_\infty < \theta$.

#### Solution:
Using the $\epsilon$-optimality formula:
$$\theta = \frac{\epsilon (1 - \gamma)}{2\gamma}$$
Substitute values:
$$\theta = \frac{0.05 \times (1 - 0.90)}{2 \times 0.90} = \frac{0.05 \times 0.10}{1.80} = \frac{0.005}{1.80} \approx 0.002778$$
The iteration can safely stop when the maximum change in any state value between sweeps drops below $0.00278$.

---

### Example 10.9: Non-Contractive Value Iteration Divergence
Show that if an engineer mistakenly sets $\gamma = 1.0$ in an infinite-horizon continuing task where every state has reward $R = +1.0$, Value Iteration iterates diverge linearly: $v_k(s) = k \to \infty$.

#### Solution:
Update equation with $\gamma = 1.0$:
$$v_{k+1}(s) = \max_a [1.0 + 1.0 \times v_k(s')] = 1.0 + v_k(s)$$
Starting from $v_0 = 0$:
- $v_1 = 1.0$
- $v_2 = 2.0$
- $v_k = k$
The values grow unboundedly as $k \to \infty$. The difference between sweeps is $\Delta = |(k+1) - k| = 1.0$, which never drops below any threshold $\theta < 1.0$. The algorithm runs forever without terminating.

---

### Example 10.10: Value Iteration Complexity per Sweep
In a discrete MDP with $|\mathcal{S}|$ states and $|\mathcal{A}|$ actions, where each state-action transition has at most $B$ non-zero successor states (sparse branching factor $B \ll |\mathcal{S}|$), calculate the computational complexity of a single sweep of Value Iteration.

#### Solution:
For each of the $|\mathcal{S}|$ states:
- Evaluate $|\mathcal{A}|$ candidate actions.
- For each action, compute the expected successor value $\sum_{s'} \mathcal{P}_{s, s'}^a v(s')$.
Because the branching factor is sparse ($B$ successors), this inner sum takes $O(B)$ operations.
Total complexity per sweep:
$$\mathcal{O}(|\mathcal{S}| \times |\mathcal{A}| \times B)$$
If transitions are dense ($B = |\mathcal{S}|$), the complexity is $\mathcal{O}(|\mathcal{S}|^2 |\mathcal{A}|)$, which is significantly faster than the $O(|\mathcal{S}|^3)$ cost of matrix inversion.

---

## 10.8 Solved Exercises

### Exercise 10.1: Value Iteration Single-Step Calculation
State $s$ has 2 actions:
- $a_1$: $r = 5$, leads to $s_1$ with prob 1.0. Current $v(s_1) = 20$.
- $a_2$: $r = 10$, leads to $s_2$ with prob 1.0. Current $v(s_2) = 12$.
If $\gamma = 0.8$, compute the updated value $v_{k+1}(s)$.

#### Solution:
- $q(s, a_1) = 5 + 0.8(20) = 5 + 16 = 21.0$
- $q(s, a_2) = 10 + 0.8(12) = 10 + 9.6 = 19.6$
$$v_{k+1}(s) = \max(21.0, 19.6) = 21.0$$

---

### Exercise 10.2: Contraction Factor of 2-Step Operator
What is the contraction factor of the two-step operator $(T^*)^2$?

#### Solution:
By the contraction property:
$$\|(T^*)^2 u - (T^*)^2 v\|_\infty = \|T^*(T^* u) - T^*(T^* v)\|_\infty \le \gamma \|T^* u - T^* v\|_\infty \le \gamma^2 \|u - v\|_\infty$$
The contraction factor is $\gamma^2$.

---

### Exercise 10.3: Value Iteration Memory Footprint
How many floating-point numbers must be stored in memory for Value Iteration on an MDP with 50,000 states and 8 actions using in-place updates?

#### Solution:
In-place Value Iteration stores only the state-value array:
$$50,000 \text{ floats}$$
(It does not need to store the Q-table or policy array).

---

### Exercise 10.4: Action Elimination in Value Iteration
If during an update of state $s$, candidate action $a_1$ achieves $q(s, a_1) = 45.0$, and an upper bound on action $a_2$ satisfies $\bar{q}(s, a_2) = 38.0$, can we skip evaluating $a_2$'s exact transitions?

#### Solution:
Yes. Because $\bar{q}(s, a_2) = 38.0 < 45.0 = q(s, a_1)$, action $a_2$ cannot possibly achieve the maximum. It can be safely pruned.

---

### Exercise 10.5: Asynchronous Sweep Fairness Condition
What mathematical condition must an asynchronous state selection sequence satisfy to guarantee convergence to $v^*$?

#### Solution:
Every state must be visited and updated infinitely often:
$$\forall s \in \mathcal{S}, \quad \lim_{T \to \infty} \sum_{t=1}^T \mathbb{I}(s \text{ is updated at step } t) = \infty$$
No state can be permanently neglected.

---

### Exercise 10.6: Continuous Space Discretization Grid Scaling
If a system has 6 state dimensions and each is discretized into 50 intervals, how many discrete states exist?

#### Solution:
$$|\mathcal{S}| = 50^6 = (5 \times 10)^6 = 15,625 \times 10^6 = 15,625,000,000 \text{ states} \approx 15.6 \text{ Billion states}$$

---

### Exercise 10.7: Value Iteration vs Policy Iteration Choice
When is Policy Iteration preferred over Value Iteration, and vice versa?

#### Solution:
- **Policy Iteration** is preferred when $|\mathcal{S}|$ is small or medium, the action space $|\mathcal{A}|$ is large, and policy stability occurs long before value convergence.
- **Value Iteration** is preferred when $|\mathcal{S}|$ is large, matrix inversion is impossible, and fast single-sweep approximations are computationally required.

---

### Exercise 10.8: Fixed Point of Bellman Optimality Operator
If $T^* \mathbf{v} = \mathbf{v}$, does that guarantee that the greedy policy extracted from $\mathbf{v}$ is globally optimal?

#### Solution:
Yes. By the Banach theorem, $T^*$ has a unique fixed point which is $\mathbf{v}^*$. The greedy policy extracted from $\mathbf{v}^*$ is guaranteed to be an optimal policy $\pi^*$.

---

### Exercise 10.9: Prioritized Sweeping Memory Overhead
What additional data structure does Prioritized Sweeping require compared to standard in-place Value Iteration?

#### Solution:
1. A Priority Queue (heap) to store states and Bellman error priorities.
2. An inverted predecessor index mapping each state $s$ to all predecessor states $\bar{s}$ that can transition to $s$.

---

### Exercise 10.10: Bound on Extracted Policy Sub-Optimality
If $\|v_k - v^*\|_\infty \le \delta$, prove that the policy $\pi$ greedy with respect to $v_k$ satisfies:
$$\|v_\pi - v^*\|_\infty \le \frac{2\gamma \delta}{1 - \gamma}$$

#### Solution:
For any state $s$:
$$v^*(s) - v_\pi(s) \le q^*(s, \pi^*(s)) - q^*(s, \pi(s))$$
Using the triangle inequality against $q_k(s, a)$:
$$q^*(s, \pi^*(s)) - q^*(s, \pi(s)) \le 2\gamma \|v_k - v^*\|_\infty + \gamma \|v^* - v_\pi\|_\infty$$
Rearranging:
$$(1 - \gamma) \|v_\pi - v^*\|_\infty \le 2\gamma \|v_k - v^*\|_\infty = 2\gamma \delta$$
$$\|v_\pi - v^*\|_\infty \le \frac{2\gamma \delta}{1 - \gamma} \quad \blacksquare$$
This formalizes the connection between value iteration accuracy and policy performance.


# Chapter 11: Monte Carlo Methods and the Bridge to Model-Free Learning

---

## 11.1 The Epistemological Leap: Leaving the Garden of Models

Throughout Chapters 6â€“10, our Dynamic Programming methods rested upon a massive epistemological assumption: **we assumed that the agent possessed a perfect, omniscient model of the environment's internal mechanics**â€”the exact state-transition kernel $\mathcal{P}_{s, s'}^a$ and expected reward function $r(s, a)$.

In the physical world, an agent is almost never handed such a blueprint:
- A robotic dog does not possess analytical equations for the friction of wet mud, loose pebbles, or crushing grass.
- An autonomous spacecraft entering a planetary atmosphere cannot analytically integrate turbulent aerodynamic shockwaves.
- An algorithmic trading agent does not have access to the private order-flow equations of other market participants.

```
                          THE MODEL SPECTRUM IN AI AGENTS
                                         â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â–¼                                                         â–¼
 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
 â”‚    MODEL-BASED      â”‚                                   â”‚     MODEL-FREE      â”‚
 â”‚ (Dynamic Prog, DP)  â”‚                                   â”‚ (Monte Carlo & TD)  â”‚
 â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                                   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
 â”‚ â€¢ Omniscient model  â”‚                                   â”‚ â€¢ Zero model known  â”‚
 â”‚ â€¢ Expectation sum   â”‚        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â–º          â”‚ â€¢ Pure experience   â”‚
 â”‚ â€¢ Full distribution â”‚                                   â”‚ â€¢ Interacts directlyâ”‚
 â”‚ â€¢ Offline planning  â”‚                                   â”‚ â€¢ Learns from trailsâ”‚
 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

When transition dynamics are unknown, the agent must make the epistemological leap to **Model-Free Reinforcement Learning**: learning optimal values and policies directly from **sampled sequences of experience**.

---

## 11.2 Monte Carlo Prediction: First-Visit vs. Every-Visit

Monte Carlo (MC) methods solve the prediction problem by defining value as empirical sample averages of realized returns.

Recall the fundamental definition of the state-value function:
$$v_\pi(s) \doteq \mathbb{E}_\pi [G_t \mid S_t = s]$$

If an agent executes policy $\pi$ across dozens of episodes, it generates empirical realizations of returns following visits to state $s$. By the **Strong Law of Large Numbers**, the sample average of these returns converges almost surely to the true expected value as the number of samples approaches infinity.

```
                  EPISODE TRAJECTORY VISITATION TIMELINE
  Episode:
  [Start] â”€â”€â–º (s) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º (s') â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º (s) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º (Goal) [End]
               â–²                                â–²
               â”‚ First Visit                    â”‚ Second Visit
               â”‚ (Return G_A)                   â”‚ (Return G_B)
```

Suppose a single episode visits state $s$ multiple times. How should those visits be recorded?

### 1. First-Visit Monte Carlo
In **First-Visit MC**, only the return following the *very first occurrence* of state $s$ within an episode is included in the average.
- Let $G_i(s)$ be the return following the first visit to state $s$ in episode $i$.
- Value estimate:
  $$V(s) = \frac{1}{N(s)} \sum_{i=1}^{N(s)} G_i(s)$$
- **Unbiasedness:** Because the first visit in each episode generates an independent sample of return from state $s$, $V(s)$ is an **unconditionally unbiased estimator** of $v_\pi(s)$:
  $$\mathbb{E}[V(s)] = v_\pi(s)$$
- Its variance decays smoothly as $O(1/N)$.

### 2. Every-Visit Monte Carlo
In **Every-Visit MC**, the return following *every single occurrence* of state $s$ within the episode is averaged.
- If state $s$ is visited 3 times in an episode, 3 separate sample returns are added to the accumulator.
- **Properties:** Because visits within the same episode are statistically correlated, Every-Visit MC estimates are biased for small sample sizes, but they remain **consistent** (the bias shrinks to zero as $N \to \infty$) and often achieve lower mean squared error in practice.

---

## 11.3 Action-Value Estimation and the Exploring Starts Dilemma

In Dynamic Programming, we could compute state values $v(s)$ and then derive optimal actions using one-step lookahead:
$$\pi^*(s) = \arg\max_a \left[ r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v^*(s') \right]$$

> [!WARNING]
> **The Model-Free Trap:** In model-free learning, you **cannot** extract a policy from $v(s)$! 
> If you do not know the transition probabilities $\mathcal{P}_{s, s'}^a$, knowing how desirable state $s'$ is does you no good, because you do not know which action has the highest probability of landing you there!

Therefore, in model-free reinforcement learning, the agent **must estimate the Action-Value Function $q(s, a)$ directly**. Once $q(s, a)$ is learned, optimal action selection is model-free:
$$\pi^*(s) = \arg\max_{a \in \mathcal{A}(s)} q^*(s, a)$$

```
                               THE EXPLORATION DILEMMA
                                         â”‚
                                  Evaluate Q(s, a)
                                         â”‚
                     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                     â–¼                                       â–¼
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”               â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚   EXPLORING STARTS    â”‚               â”‚  STOCHASTIC POLICIES  â”‚
         â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤               â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
         â”‚ Assumes every (s, a)  â”‚               â”‚ Uses Îµ-greedy or      â”‚
         â”‚ has positive prob of  â”‚               â”‚ Softmax: every action â”‚
         â”‚ being the start of an â”‚               â”‚ is selected with prob â”‚
         â”‚ episode. Unrealistic! â”‚               â”‚ Ï€(a | s) â‰¥ Îµ / |A|.   â”‚
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

To estimate $q(s, a)$ for all actions, every state-action pair must be visited repeatedly. If the agent follows a deterministic policy, it will only visit a single action per state, leaving the remaining actions unexplored forever. 
To guarantee exploration, early theory relied on **Exploring Starts** (assuming every episode begins with an arbitrary state-action pair chosen uniformly at random). In realistic engineering, we abandon exploring starts in favor of **$\epsilon$-Greedy Policies** or **Off-Policy Learning**.

---

## 11.4 Off-Policy Learning and Importance Sampling

In many mission-critical applications, an agent cannot simply run around trying random exploratory actions in the live production environment. An autonomous surgical robot or a nuclear power plant controller cannot explore dangerous actions to see what happens.

This necessitates the distinction between two separate policies:

```
                               OFF-POLICY DUALITY
                                        â”‚
             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
             â–¼                                                     â–¼
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚    BEHAVIOR POLICY    â”‚                             â”‚     TARGET POLICY     â”‚
  â”‚          b(a | s)     â”‚                             â”‚        Ï€(a | s)       â”‚
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤                             â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚ â€¢ Generates raw data  â”‚                             â”‚ â€¢ Being evaluated and â”‚
  â”‚ â€¢ Exploratory / Safe  â”‚        â•â•â•â•â•â•â•â•â•â•â•â•â–º        â”‚   optimized           â”‚
  â”‚ â€¢ Human demonstrationsâ”‚                             â”‚ â€¢ Deterministic goal  â”‚
  â”‚ â€¢ Historical logs     â”‚                             â”‚ â€¢ Optimal policy Ï€*   â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                             â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **Target Policy $\pi(a \mid s)$:** The policy the agent is trying to evaluate or optimize (typically a deterministic, greedy policy $\pi^*$).
2. **Behavior Policy $b(a \mid s)$:** The policy used to interact with the environment and collect the trajectory data (typically a stochastic exploratory policy, or human demonstration recordings).

### The Coverage Assumption:
For off-policy learning to be mathematically well-defined, the behavior policy must have non-zero probability for any action that is possible under the target policy:
$$\pi(a \mid s) > 0 \implies b(a \mid s) > 0, \quad \forall s \in \mathcal{S}, a \in \mathcal{A}$$

### The Importance Sampling Ratio
Suppose we observe a trajectory $\tau = (A_t, S_{t+1}, A_{t+1}, \dots, S_T)$ generated by behavior policy $b$. 
What was the relative probability of this trajectory occurring under target policy $\pi$ compared to behavior policy $b$?

The probability of the trajectory under policy $\pi$ is:
$$\mathbb{P}(\tau \mid \pi) = \prod_{k=t}^{T-1} \pi(A_k \mid S_k) \mathcal{P}_{S_k, S_{k+1}}^{A_k}$$
The probability under behavior policy $b$ is:
$$\mathbb{P}(\tau \mid b) = \prod_{k=t}^{T-1} b(A_k \mid S_k) \mathcal{P}_{S_k, S_{k+1}}^{A_k}$$

The ratio of probabilities is the **Importance Sampling Ratio** $\rho_{t:T-1}$:

$$\rho_{t:T-1} \doteq \frac{\mathbb{P}(\tau \mid \pi)}{\mathbb{P}(\tau \mid b)} = \frac{\prod_{k=t}^{T-1} \pi(A_k \mid S_k) \mathcal{P}_{S_k, S_{k+1}}^{A_k}}{\prod_{k=t}^{T-1} b(A_k \mid S_k) \mathcal{P}_{S_k, S_{k+1}}^{A_k}} = \prod_{k=t}^{T-1} \frac{\pi(A_k \mid S_k)}{b(A_k \mid S_k)}$$

> [!IMPORTANT]
> **The Magic of Ratio Cancellation:** Notice that the environment transition probabilities $\mathcal{P}_{S_k, S_{k+1}}^{A_k}$ appear identically in both the numerator and denominator, canceling out completely! We can compute the exact importance sampling ratio **without knowing anything about the environment physics**!

### Ordinary vs. Weighted Importance Sampling
Given $M$ episodes where state $s$ was visited at step $t(i)$ with return $G_i(s)$ and ratio $\rho_i$:

1. **Ordinary Importance Sampling:**
   $$V(s) = \frac{1}{M} \sum_{i=1}^M \rho_i G_i(s)$$
   - **Properties:** Strictly unbiased ($\mathbb{E}[V(s)] = v_\pi(s)$), but has potentially **infinite variance** if ratios $\rho_i$ compound to astronomical magnitudes over long trajectories.
2. **Weighted Importance Sampling:**
   $$V(s) = \frac{\sum_{i=1}^M \rho_i G_i(s)}{\sum_{i=1}^M \rho_i}$$
   - **Properties:** Biased (approaches zero bias as $M \to \infty$), but possesses **bounded variance**. Even if a single episode has a massive ratio $\rho_1 = 10^9$, it appears in both numerator and denominator, scaling the estimate stably.

---

## 11.5 The Tripartite Spectrum: DP vs. MC vs. TD

We can now organize all reinforcement learning algorithms along two fundamental orthogonal axes: **Bootstrapping** and **Sampling**.

```
                           THE REINFORCEMENT LEARNING SPECTRUM
               
               Bootstraps (Uses V(s'))           Does Not Bootstrap (Uses G_t)
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            â”‚                               â”‚                               â”‚
   Full     â”‚      DYNAMIC PROGRAMMING      â”‚       EXHAUSTIVE SEARCH       â”‚
   Expected â”‚   (Value / Policy Iteration)  â”‚    (Full Trajectory Trees)    â”‚
   Updates  â”‚  â€¢ Full transition model      â”‚  â€¢ Expands every branch       â”‚
   (Model)  â”‚  â€¢ Expected Bellman update    â”‚  â€¢ Breadth-first game trees   â”‚
            â”‚                               â”‚                               â”‚
            â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
            â”‚                               â”‚                               â”‚
   Sample   â”‚     TEMPORAL DIFFERENCE       â”‚          MONTE CARLO          â”‚
   Updates  â”‚   (TD(0), SARSA, Q-Learning)  â”‚      (First / Every Visit)    â”‚
   (Model-  â”‚  â€¢ Samples 1 transition       â”‚  â€¢ Samples entire trajectory  â”‚
   Free)    â”‚  â€¢ Bootstraps: V(s')          â”‚  â€¢ No bootstrapping          â”‚
            â”‚                               â”‚                               â”‚
            â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **Dynamic Programming (DP):** Bootstraps (uses $V(s')$ to update $V(s)$); does not sample (computes mathematical expectation across all next states). Requires a complete environment model.
2. **Monte Carlo (MC):** Samples (interacts directly with environment); does not bootstrap (must wait until episode termination to record cumulative return $G_t$). Zero bias, high variance, cannot learn online or in continuing tasks.
3. **Temporal Difference (TD):** Samples (draws single transitions $S_t \to S_{t+1}$); bootstraps (updates $V(S_t)$ immediately using $V(S_{t+1})$). Combines the model-free sampling of Monte Carlo with the online efficiency of Dynamic Programming.

---

## 11.6 Preview of Tabular Temporal Difference Learning

To set the stage for our production simulator, we state the three canonical Temporal Difference learning updates:

### 1. Tabular TD(0) (State-Value Prediction)
$$V(S_t) \leftarrow V(S_t) + \alpha \left[ R_{t+1} + \gamma V(S_{t+1}) - V(S_t) \right]$$
The bracketed term is the **TD Error** $\delta_t \doteq R_{t+1} + \gamma V(S_{t+1}) - V(S_t)$.

### 2. SARSA (On-Policy Control, Rummery & Niranjan 1994)
Updates state-action values using the tuple $(S_t, A_t, R_{t+1}, S_{t+1}, A_{t+1})$:
$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[ R_{t+1} + \gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t) \right]$$
where $A_{t+1}$ is chosen by the agent's current exploratory policy (e.g. $\epsilon$-greedy).

### 3. Q-Learning (Off-Policy Control, Watkins 1989)
Updates state-action values toward the Bellman optimality condition:
$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left[ R_{t+1} + \gamma \max_{a' \in \mathcal{A}(S_{t+1})} Q(S_{t+1}, a') - Q(S_t, A_t) \right]$$
Q-Learning is off-policy because the target uses $\max_{a'} Q(S_{t+1}, a')$ regardless of which exploratory action the behavior policy actually takes next.

---

## 11.7 Worked Examples: Monte Carlo & Importance Sampling

### Example 11.1: First-Visit vs Every-Visit Monte Carlo Calculation
An agent records two episodes in an MDP:
- Episode 1: $S_0 = s_1 \xrightarrow{R_1 = 2} S_1 = s_2 \xrightarrow{R_2 = 1} S_2 = s_1 \xrightarrow{R_3 = 4} S_3 = s_{\text{term}}$.
- Episode 2: $S_0 = s_2 \xrightarrow{R_1 = 3} S_1 = s_1 \xrightarrow{R_2 = 5} S_2 = s_{\text{term}}$.
Let $\gamma = 1.0$.

Calculate the estimated value $V(s_1)$ using:
1. First-Visit Monte Carlo.
2. Every-Visit Monte Carlo.

#### Solution:
**Step 1: Compute Returns from Each State Occurrence:**
- Episode 1:
  - Visit 1 to $s_1$ (at $t = 0$): $G = R_1 + R_2 + R_3 = 2 + 1 + 4 = 7.0$.
  - Visit 1 to $s_2$ (at $t = 1$): $G = R_2 + R_3 = 1 + 4 = 5.0$.
  - Visit 2 to $s_1$ (at $t = 2$): $G = R_3 = 4.0$.
- Episode 2:
  - Visit 1 to $s_2$ (at $t = 0$): $G = R_1 + R_2 = 3 + 5 = 8.0$.
  - Visit 1 to $s_1$ (at $t = 1$): $G = R_2 = 5.0$.

**Step 2: First-Visit MC Evaluation for $s_1$:**
- Episode 1 first-visit return: $G = 7.0$.
- Episode 2 first-visit return: $G = 5.0$.
$$V_{\text{First}}(s_1) = \frac{7.0 + 5.0}{2} = 6.0$$

**Step 3: Every-Visit MC Evaluation for $s_1$:**
All visits across both episodes: $[7.0, 4.0, 5.0]$.
$$V_{\text{Every}}(s_1) = \frac{7.0 + 4.0 + 5.0}{3} = \frac{16.0}{3} \approx 5.333$$

---

### Example 11.2: Importance Sampling Ratio Along a Path
An agent generates a 3-step trajectory under behavior policy $b$:
- At $t = 0$: $A_0 = a_1$. Under $\pi$, $\pi(a_1 \mid s_0) = 0.8$. Under $b$, $b(a_1 \mid s_0) = 0.4$.
- At $t = 1$: $A_1 = a_2$. Under $\pi$, $\pi(a_2 \mid s_1) = 0.9$. Under $b$, $b(a_2 \mid s_1) = 0.3$.
- At $t = 2$: $A_2 = a_1$. Under $\pi$, $\pi(a_1 \mid s_2) = 0.5$. Under $b$, $b(a_1 \mid s_2) = 0.5$.

1. Compute the importance sampling ratio $\rho_{0:2}$.
2. If the realized return was $G_0 = +10.0$, what is the weighted return $\rho_{0:2} G_0$ used in Ordinary Importance Sampling?

#### Solution:
**Step 1: Compute $\rho_{0:2}$:**
$$\rho_{0:2} = \left( \frac{\pi(a_1 \mid s_0)}{b(a_1 \mid s_0)} \right) \times \left( \frac{\pi(a_2 \mid s_1)}{b(a_2 \mid s_1)} \right) \times \left( \frac{\pi(a_1 \mid s_2)}{b(a_1 \mid s_2)} \right)$$
$$\rho_{0:2} = \left( \frac{0.8}{0.4} \right) \times \left( \frac{0.9}{0.3} \right) \times \left( \frac{0.5}{0.5} \right) = 2.0 \times 3.0 \times 1.0 = 6.0$$

**Step 2: Weighted Return:**
$$\text{Sample} = \rho_{0:2} G_0 = 6.0 \times 10.0 = +60.0$$
Because this sequence was 6 times more likely under $\pi$ than under $b$, its sample weight is scaled by 6.0.

---

### Example 11.3: Ordinary vs. Weighted Importance Sampling Numerical Comparison
An agent evaluates state $s$ using off-policy data from 3 episodes:
- Episode 1: $\rho_1 = 0.1, \quad G_1 = 10.0$.
- Episode 2: $\rho_2 = 10.0, \quad G_2 = 2.0$.
- Episode 3: $\rho_3 = 0.5, \quad G_3 = 8.0$.

Compute $V(s)$ using:
1. Ordinary Importance Sampling.
2. Weighted Importance Sampling.

#### Solution:
**1. Ordinary Importance Sampling:**
$$V_{\text{ord}}(s) = \frac{1}{3} \sum_{i=1}^3 \rho_i G_i = \frac{1}{3} \left[ (0.1)(10.0) + (10.0)(2.0) + (0.5)(8.0) \right]$$
$$= \frac{1}{3} [1.0 + 20.0 + 4.0] = \frac{25.0}{3} \approx 8.333$$

**2. Weighted Importance Sampling:**
Numerator:
$$\sum_{i=1}^3 \rho_i G_i = 1.0 + 20.0 + 4.0 = 25.0$$
Denominator:
$$\sum_{i=1}^3 \rho_i = 0.1 + 10.0 + 0.5 = 10.6$$
$$V_{\text{weighted}}(s) = \frac{25.0}{10.6} \approx 2.3585$$
Notice how Episode 2, which had return $2.0$ and a large weight $10.0$, heavily stabilizes the weighted average around $2.36$, whereas ordinary importance sampling shot up to $8.33$ due to the unnormalized magnitude.

---

### Example 11.4: Zero Ratio Collapse in Importance Sampling
Suppose target policy $\pi$ is deterministic: $\pi(a_1 \mid s) = 1.0$ and $\pi(a_2 \mid s) = 0.0$.
A behavior policy $b$ chooses $a_1$ and $a_2$ with equal probability $0.5$.
Suppose an episode of length 10 takes action $a_2$ at step $t = 8$.
What is the importance sampling ratio $\rho_{0:9}$ for this episode?

#### Solution:
The ratio is the product of factors:
$$\rho_{0:9} = \prod_{k=0}^9 \frac{\pi(A_k \mid S_k)}{b(A_k \mid S_k)}$$
At step $k = 8$, the realized action was $A_8 = a_2$.
The factor at step 8 is:
$$\frac{\pi(a_2 \mid S_8)}{b(a_2 \mid S_8)} = \frac{0.0}{0.5} = 0.0$$
Because one factor is zero, the entire product collapses to zero:
$$\rho_{0:9} = 0.0$$
Any episode where the behavior policy takes an action that the target policy would never have taken is completely discarded ($\rho = 0$).

---

### Example 11.5: Incremental Implementation of Monte Carlo Updates
Derive the incremental running average formula for updating a value estimate $V_N(s)$ given the $N$-th observed return $G_N$, without storing the historical array of past returns.

#### Solution:
By definition:
$$V_N = \frac{1}{N} \sum_{i=1}^N G_i = \frac{1}{N} \left( G_N + \sum_{i=1}^{N-1} G_i \right)$$
Recognize that $\sum_{i=1}^{N-1} G_i = (N - 1) V_{N-1}$:
$$V_N = \frac{1}{N} [G_N + (N - 1) V_{N-1}] = \frac{1}{N} G_N + \frac{N - 1}{N} V_{N-1} = \frac{1}{N} G_N + V_{N-1} - \frac{1}{N} V_{N-1}$$
Factoring:
$$V_N = V_{N-1} + \frac{1}{N} \left[ G_N - V_{N-1} \right]$$
This matches the universal reinforcement learning update form:
$$\text{NewEstimate} \leftarrow \text{OldEstimate} + \alpha [\text{Target} - \text{OldEstimate}]$$
where step size is $\alpha_N = \frac{1}{N}$.

---

### Example 11.6: Single TD(0) Step Trace
An agent in state $S_0$ has value estimate $V(S_0) = 10.0$.
It takes action $A_0$, observes reward $R_1 = +2.0$, and transitions to state $S_1$, whose value estimate is $V(S_1) = 15.0$.
Let $\gamma = 0.90$ and learning rate $\alpha = 0.10$.

1. Compute the TD target $R_1 + \gamma V(S_1)$.
2. Compute the TD error $\delta_0$.
3. Compute the updated value $V(S_0)$.

#### Solution:
**Step 1: TD Target:**
$$\text{Target} = R_1 + \gamma V(S_1) = 2.0 + 0.90(15.0) = 2.0 + 13.5 = 15.5$$

**Step 2: TD Error:**
$$\delta_0 = \text{Target} - V(S_0) = 15.5 - 10.0 = +5.5$$

**Step 3: Update:**
$$V(S_0) \leftarrow V(S_0) + \alpha \delta_0 = 10.0 + 0.10(+5.5) = 10.0 + 0.55 = 10.55$$

---

### Example 11.7: Single Tabular Q-Learning Step Trace
An agent has current Q-values:
$Q(s, a_1) = 5.0, \quad Q(s, a_2) = 2.0$.
In next state $s'$, the Q-values are:
$Q(s', a_1) = 8.0, \quad Q(s', a_2) = 12.0$.
The agent executed action $a_1$ from state $s$, earning reward $R = 1.0$.
Let $\gamma = 0.90$ and $\alpha = 0.20$.

Execute a single tabular Q-learning update for $Q(s, a_1)$.

#### Solution:
The Q-learning target is:
$$\text{Target} = R + \gamma \max_{a'} Q(s', a')$$
Compute the maximum Q-value in successor state $s'$:
$$\max(Q(s', a_1), Q(s', a_2)) = \max(8.0, 12.0) = 12.0$$
$$\text{Target} = 1.0 + 0.90(12.0) = 1.0 + 10.8 = 11.8$$
Compute TD error:
$$\delta = \text{Target} - Q(s, a_1) = 11.8 - 5.0 = 6.8$$
Update $Q(s, a_1)$:
$$Q(s, a_1) \leftarrow 5.0 + 0.20(6.8) = 5.0 + 1.36 = 6.36$$

---

### Example 11.8: SARSA vs Q-Learning Update Discrepancy
Continuing from Example 11.7, suppose the agent's exploratory behavior policy selects action $a_1$ in state $s'$ (the sub-optimal action, e.g. due to $\epsilon$-exploration).
Compute the SARSA update for $Q(s, a_1)$ and compare it to the Q-Learning update.

#### Solution:
In SARSA, the target uses the action actually selected by the policy:
$$\text{SARSA Target} = R + \gamma Q(s', A') = 1.0 + 0.90 Q(s', a_1) = 1.0 + 0.90(8.0) = 1.0 + 7.2 = 8.2$$
Compute SARSA TD error:
$$\delta_{\text{SARSA}} = 8.2 - 5.0 = 3.2$$
SARSA update:
$$Q(s, a_1) \leftarrow 5.0 + 0.20(3.2) = 5.0 + 0.64 = 5.64$$

**Comparison:**
- Q-Learning updated $Q(s, a_1) \to 6.36$ (optimistically assuming the agent will act optimally from $s'$).
- SARSA updated $Q(s, a_1) \to 5.64$ (realistically reflecting the cost of the exploratory mistake made in $s'$).

---

### Example 11.9: Robbins-Monro Conditions for Stochastic Convergence
For tabular Q-Learning to converge to $Q^*$ with probability 1.0, the step sizes $\alpha_t$ must satisfy the **Robbins-Monro conditions**:
1. $\sum_{t=1}^\infty \alpha_t = \infty$ (step sizes large enough to overcome arbitrary initial conditions).
2. $\sum_{t=1}^\infty \alpha_t^2 < \infty$ (step sizes small enough to ensure stochastic noise diminishes to zero).

Test whether the following learning rate schedules satisfy the conditions:
1. $\alpha_t = \frac{1}{t}$
2. $\alpha_t = 0.1$ (constant learning rate)
3. $\alpha_t = \frac{1}{t^2}$

#### Solution:
1. **$\alpha_t = \frac{1}{t}$:**
   - $\sum_{t=1}^\infty \frac{1}{t} = \infty$ (harmonic series diverges) $\checkmark$
   - $\sum_{t=1}^\infty \frac{1}{t^2} = \frac{\pi^2}{6} < \infty$ (p-series converges) $\checkmark$
   Satisfies both conditions! Guarantees asymptotic convergence to $Q^*$.
2. **$\alpha_t = 0.1$ (Constant):**
   - $\sum 0.1 = \infty$ $\checkmark$
   - $\sum (0.1)^2 = \sum 0.01 = \infty$ $\times$ (fails condition 2).
   Does not converge to a point; continues to fluctuate around the optimum, allowing tracking of non-stationary environments.
3. **$\alpha_t = \frac{1}{t^2}$:**
   - $\sum \frac{1}{t^2} = \frac{\pi^2}{6} < \infty$ $\times$ (fails condition 1).
   Step sizes shrink too quickly; estimates freeze before reaching the optimum.

---

### Example 11.10: Bias-Variance Trade-Off Between MC and TD
Contrast the statistical bias and variance of Monte Carlo vs Temporal Difference estimation.

#### Solution:
- **Monte Carlo:**
  - **Bias:** Zero (strictly unbiased). Return $G_t$ is an actual sample of the true future trajectory.
  - **Variance:** Very High. $G_t$ depends on many random transitions and actions compounded over hundreds of steps. Requires many samples to converge.
- **Temporal Difference (TD):**
  - **Bias:** Non-zero initially. The TD target $R_{t+1} + \gamma V(S_{t+1})$ uses the estimate $V(S_{t+1})$, which may be inaccurate early in training.
  - **Variance:** Low. The update depends only on a single step of environmental noise ($R_{t+1}, S_{t+1}$), making learning significantly faster and more data-efficient.

---

## 11.8 Solved Exercises

### Exercise 11.1: First-Visit Filtering
In an episode: $s_1 \to s_2 \to s_1 \to s_3 \to s_{\text{term}}$, with rewards $R_1 = 1, R_2 = 2, R_3 = 3$.
Under First-Visit MC with $\gamma = 1$, what return is attributed to $s_1$?

#### Solution:
Only the return from the first visit at $t = 0$ is recorded:
$$G = 1 + 2 + 3 = 6.0$$

---

### Exercise 11.2: Importance Sampling Ratio Evaluation
Behavior policy chooses between two actions uniformly: $b(a_1) = 0.5, b(a_2) = 0.5$.
Target policy is $\epsilon$-greedy with $\epsilon = 0.10$: $\pi(a_1) = 0.95, \pi(a_2) = 0.05$.
If action $a_2$ is chosen, what is the importance ratio $\frac{\pi(a_2)}{b(a_2)}$?

#### Solution:
$$\rho = \frac{0.05}{0.50} = 0.10$$

---

### Exercise 11.3: TD Error Calculation
Given $V(s) = 50.0, V(s') = 60.0, R = 4.0, \gamma = 0.90$.
Compute the TD error $\delta$.

#### Solution:
$$\delta = R + \gamma V(s') - V(s) = 4.0 + 0.90(60.0) - 50.0 = 4.0 + 54.0 - 50.0 = +8.0$$

---

### Exercise 11.4: Q-Learning Target vs Policy Action
Does Q-Learning require knowing which action the agent will actually take in state $S_{t+1}$ before executing the update?

#### Solution:
No. Q-Learning is off-policy: it targets the maximum available Q-value $\max_{a'} Q(S_{t+1}, a')$ directly from the table, independent of future action selection.

---

### Exercise 11.5: Offline vs Online Monte Carlo
Why can standard Monte Carlo methods not be used in continuing, non-terminating tasks?

#### Solution:
Because standard Monte Carlo requires computing the complete cumulative return $G_t = \sum_{k=0}^T \gamma^k R_{t+k+1}$ to episode termination. In a continuing task, episodes never terminate ($T = \infty$), so the agent would have to wait an infinite amount of time before performing its first update.

---

### Exercise 11.6: Exploring Starts Feasibility in Physical Systems
Why is the "Exploring Starts" assumption impossible to satisfy on a real physical robot in an outdoor environment?

#### Solution:
Because an outdoor physical robot cannot magically materialize inside arbitrary configurations (e.g. inverted upside down in a river or perched on a cliff ledge) at the start of an experiment; it must start from a physically feasible launch pad.

---

### Exercise 11.7: Step-Size Decay Schedule
Given step-size schedule $\alpha_k = \frac{10}{100 + k}$, verify if $\sum \alpha_k$ diverges.

#### Solution:
For large $k$, $\frac{10}{100 + k} \sim \frac{10}{k}$.
The series $\sum_{k=1}^\infty \frac{10}{k} = 10 \sum \frac{1}{k}$ is a multiple of the divergent harmonic series.
Thus $\sum \alpha_k = \infty$.

---

### Exercise 11.8: Bootstrapping in Human Cognition
Give an intuitive example of human cognitive bootstrapping.

#### Solution:
Estimating your arrival time on a drive: after 30 minutes of driving, rather than waiting until you reach your destination, you update your estimate of total travel time based on your current location and your current prediction of remaining travel time.

---

### Exercise 11.9: Off-Policy Target Policy Freedom
In off-policy learning, can the target policy $\pi$ be updated dynamically during training?

#### Solution:
Yes. This is precisely how Q-Learning works: the target policy is implicitly $\pi(s) = \arg\max_a Q(s, a)$, which changes continuously as Q-values are refined.

---

### Exercise 11.10: Monte Carlo vs Dynamic Programming on Transition Noise
If an environment has complex stochastic transitions with 10,000 potential outcomes per action, why does Monte Carlo avoid evaluating all 10,000 branches?

#### Solution:
Because Monte Carlo samples an outcome according to its true probability distribution, allowing the Law of Large Numbers to integrate over transition uncertainty empirically without ever enumerating the branches.


# Chapter 12: Production TypeScript MDP & Dynamic Programming Simulator and Grand Gauntlet

---

## 12.1 Engineering Philosophy: Zero-Dependency TypeScript RL Architecture

In this concluding chapter, we crystallize every mathematical concept developed across Chapters 1â€“11â€”Markov transition kernels, Bellman expectation systems, matrix resolvents, Banach contractions, Policy Iteration, Value Iteration, and Q-Learningâ€”into a self-contained, industrial-grade **TypeScript Discrete MDP Simulator**.

```
                   DISCRETE MDP SIMULATOR ARCHITECTURE
                                    â”‚
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
           â–¼                        â–¼                        â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  CORE MDP INTERFACES â”‚ â”‚   ANALYTICAL & DP    â”‚ â”‚   MODEL-FREE AGENT   â”‚
â”‚  â€¢ Generic State S   â”‚ â”‚   â€¢ Matrix Resolvent â”‚ â”‚   â€¢ Tabular Q-Learn  â”‚
â”‚  â€¢ Generic Action A  â”‚ â”‚   â€¢ Policy Iteration â”‚ â”‚   â€¢ Îµ-Greedy Decay   â”‚
â”‚  â€¢ Transition Kernel â”‚ â”‚   â€¢ Value Iteration  â”‚ â”‚   â€¢ TD Updates       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚
           â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
           â–¼                                                 â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚        4x4 GRIDWORLD BENCHMARK       â”‚  â”‚        CLIFF WALKING BENCHMARK       â”‚
â”‚  â€¢ Obstacles, Traps, Terminal Goal   â”‚  â”‚  â€¢ Stochastic Wind, Catastrophic Sea â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

The engine is engineered with strict adherence to three software axioms:
1. **Zero External Dependencies:** Built entirely on standard ECMAScript / TypeScript primitives. No external matrix libraries, no black boxes.
2. **Generic Type Abstraction:** The MDP solver operates over arbitrary state types `S extends string | number` and action types `A extends string | number`.
3. **Exact Mathematical Equivalence:** Iterative DP outputs are verified against exact linear algebraic solutions via Gaussian elimination.

---

## 12.2 Production Engine Architecture (`mdp-simulator.ts`)

The complete engine is implemented in [`mdp-simulator.ts`](file:///c:/Users/adzan/Desktop/tech%20tree/modules/computer-science/machine-learning/cs-reinforcement-learning-mdp/mdp-simulator.ts). Its primary components include:

### 1. Matrix Inversion via Gaussian Elimination
To solve $(\mathbf{I} - \gamma \mathbf{P}_\pi) \mathbf{v}_\pi = \mathbf{r}_\pi$ in closed form, the engine implements Gaussian elimination with partial pivoting:
```typescript
export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  // Augmented matrix clone
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    // Partial pivoting for numerical stability
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
    }
    const temp = M[i]; M[i] = M[maxRow]; M[maxRow] = temp;

    // Elimination
    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        M[k][j] -= factor * M[i][j];
      }
    }
  }

  // Back-substitution
  const x: number[] = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }
  return x;
}
```

### 2. The Discrete MDP State Machine
A discrete MDP model is represented by an interface specifying states, actions, transition probabilities $\mathcal{P}_{s, s'}^a$, and expected rewards $r(s, a)$:
```typescript
export interface Transition<S> {
  nextState: S;
  probability: number;
  reward: number;
}

export interface MDPModel<S extends string | number, A extends string | number> {
  states: S[];
  actions: A[];
  gamma: number;
  isTerminal: (s: S) => boolean;
  getTransitions: (s: S, a: A) => Transition<S>[];
}
```

### 3. Iterative Policy Evaluation
Implements the contraction operator $(T^\pi v)(s)$ with stopping threshold $\theta$:
```typescript
export function iterativePolicyEvaluation<S extends string | number, A extends string | number>(
  mdp: MDPModel<S, A>,
  policy: Record<S, A>,
  theta: number = 1e-7,
  maxIterations: number = 10000
): Record<S, number> {
  const V: Record<S, number> = {} as Record<S, number>;
  for (const s of mdp.states) V[s] = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    let delta = 0;
    for (const s of mdp.states) {
      if (mdp.isTerminal(s)) continue;
      const a = policy[s];
      let sum = 0;
      for (const t of mdp.getTransitions(s, a)) {
        sum += t.probability * (t.reward + mdp.gamma * V[t.nextState]);
      }
      delta = Math.max(delta, Math.abs(V[s] - sum));
      V[s] = sum;
    }
    if (delta < theta) break;
  }
  return V;
}
```

### 4. Policy Iteration and Value Iteration
Implements exact Policy Iteration (alternating policy evaluation and greedy policy improvement) and Value Iteration (contracting the Bellman optimality operator $T^*$ directly).

---

## 12.3 Grand Gauntlet: Deep Algorithmic Challenges

### Problem 12.1 (Grand Gauntlet): Automated Inventory Restocking Controller
An industrial electronics manufacturer manages stock for a specialized microchip. 
- State $s \in \{0, 1, 2, 3, 4, 5\}$ denotes the units in inventory at the start of the week.
- Capacity is $M = 5$ units.
- Action $a \in \{0, 1, \dots, 5 - s\}$: number of units ordered for overnight delivery ($a + s \le 5$).
- Ordering cost: $\$2$ fixed delivery fee if $a > 0$, plus $\$5$ per unit ordered: $C_{\text{order}}(a) = 2 \cdot \mathbb{I}(a > 0) + 5 a$.
- Customer demand $D$ follows a Poisson distribution with mean $\lambda = 2.0$, truncated at 5.
- Revenue: each customer sale earns $\$12$.
- Holding cost: holding unsold inventory over the weekend costs $\$1$ per unit remaining.
- Unmet demand is lost forever (zero revenue, zero penalty).
- Discount factor $\gamma = 0.95$.

Formulate the state transition probability matrix and reward function, and write the Bellman optimality equation for inventory state $s$.

#### Solution:
Let customer demand probability be $P(D = d) = \frac{\lambda^d e^{-\lambda}}{d!}$.
Given starting stock $s$ and order $a$, available stock for the week is $y = s + a \le 5$.
If demand is $d$:
- Sales realized: $\min(y, d)$.
- Stock remaining at end of week: $s' = \max(0, y - d)$.
- Revenue: $12 \min(y, d)$.
- Holding cost: $1 \cdot s'$.
- Net weekly profit given demand $d$:
  $$R(y, d) = 12 \min(y, d) - s' - C_{\text{order}}(a) = 12 \min(y, d) - \max(0, y - d) - [2 \cdot \mathbb{I}(a > 0) + 5a]$$
The expected reward is:
$$r(s, a) = \sum_{d=0}^\infty P(D = d) R(s+a, d)$$
The transition probability to next week's inventory $s'$ is:
$$\mathcal{P}_{s, s'}^a = \begin{cases} P(D = y - s') & \text{if } s' > 0 \\ \sum_{d = y}^\infty P(D = d) & \text{if } s' = 0 \end{cases}$$
The Bellman optimality equation is:
$$v^*(s) = \max_{0 \le a \le 5 - s} \left[ r(s, a) + \gamma \sum_{s'=0}^5 \mathcal{P}_{s, s'}^a v^*(s') \right]$$

---

### Problem 12.2 (Grand Gauntlet): Contraction Operator with Metric Perturbation
Suppose an agent evaluates states using an inexact transition model $\hat{\mathcal{P}}$ where $\|\hat{\mathcal{P}} - \mathcal{P}\|_\infty \le \epsilon_P$.
Prove that the error between the true value $v_\pi$ and the estimated fixed point $\hat{v}_\pi$ is bounded by:
$$\|v_\pi - \hat{v}_\pi\|_\infty \le \frac{\gamma \epsilon_P}{(1 - \gamma)^2} \|\mathbf{r}_\pi\|_\infty$$

#### Solution:
From the resolvent identity:
$$\mathbf{v}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi, \quad \hat{\mathbf{v}}_\pi = (\mathbf{I} - \gamma \hat{\mathbf{P}}_\pi)^{-1} \mathbf{r}_\pi$$
$$\mathbf{v}_\pi - \hat{\mathbf{v}}_\pi = \left[ (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} - (\mathbf{I} - \gamma \hat{\mathbf{P}}_\pi)^{-1} \right] \mathbf{r}_\pi$$
Using the algebraic resolvent identity $\mathbf{A}^{-1} - \mathbf{B}^{-1} = \mathbf{A}^{-1} (\mathbf{B} - \mathbf{A}) \mathbf{B}^{-1}$:
$$\mathbf{v}_\pi - \hat{\mathbf{v}}_\pi = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \left[ (\mathbf{I} - \gamma \hat{\mathbf{P}}_\pi) - (\mathbf{I} - \gamma \mathbf{P}_\pi) \right] (\mathbf{I} - \gamma \hat{\mathbf{P}}_\pi)^{-1} \mathbf{r}_\pi$$
$$= (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \left[ \gamma (\mathbf{P}_\pi - \hat{\mathbf{P}}_\pi) \right] \hat{\mathbf{v}}_\pi$$
Taking the supremum norm:
$$\|\mathbf{v}_\pi - \hat{\mathbf{v}}_\pi\|_\infty \le \|(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}\|_\infty \cdot \gamma \|\mathbf{P}_\pi - \hat{\mathbf{P}}_\pi\|_\infty \cdot \|\hat{\mathbf{v}}_\pi\|_\infty$$
Since $\|(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}\|_\infty \le \frac{1}{1 - \gamma}$, $\|\mathbf{P}_\pi - \hat{\mathbf{P}}_\pi\|_\infty \le \epsilon_P$, and $\|\hat{\mathbf{v}}_\pi\|_\infty \le \frac{\|\mathbf{r}_\pi\|_\infty}{1 - \gamma}$:
$$\|\mathbf{v}_\pi - \hat{\mathbf{v}}_\pi\|_\infty \le \left(\frac{1}{1 - \gamma}\right) \gamma \epsilon_P \left( \frac{\|\mathbf{r}_\pi\|_\infty}{1 - \gamma} \right) = \frac{\gamma \epsilon_P}{(1 - \gamma)^2} \|\mathbf{r}_\pi\|_\infty \quad \blacksquare$$

---

### Problem 12.3 (Grand Gauntlet): Optimal Gambling Thresholds on a Sub-Fair Coin
Consider the Gambler's Problem (Example 7.9) with win probability $p = 0.40$ and capital $s \in \{1, \dots, 99\}$.
Prove that for any capital $s = 25, 50, 75$, the optimal stake bets the entire distance to the nearest significant binary power.

#### Solution:
Because $p < 0.50$, the expected value of each wager is negative: $\mathbb{E}[\Delta s] = p(a) + (1-p)(-a) = (2p - 1)a = -0.2a < 0$.
By the Supermartingale Optional Stopping Theorem, playing many small bets maximizes the house edge, driving probability of ruin to 1. 
To reach 100 with maximum probability under an unfavorable game, the gambler must minimize the number of coin flips.
At $s = 50$, betting $a = 50$ wins in a single flip with probability $p = 0.40$. Any smaller bet requires a sequence of multiple wins, whose probability decays exponentially ($p^k \ll p$).
At $s = 25$, betting $a = 25$ reaches 50 with probability $0.40$, after which betting 50 reaches 100 with probability $0.40$ (total probability $0.16$).
Thus, the optimal policy forms a fractal "bold play" policy with spikes at binary intervals $\{25, 50, 75\}$.

---

### Problem 12.4 (Grand Gauntlet): Multi-Server Queuing System Control
A cloud datacenter operates $C = 3$ server clusters. 
- Incoming requests arrive according to a Poisson process with arrival rate $\lambda = 5$ jobs/sec.
- Queue buffer capacity is $B = 10$ jobs. Requests arriving when the buffer is full are dropped (penalty $-\$50$).
- The controller can dynamically activate $k \in \{1, 2, 3\}$ servers.
- Each active server processes $\mu = 2$ jobs/sec, but incurs electricity cost $\$2 \cdot k$ per second.
- Completed jobs earn $\$10$.

Discretize the system into time slices $\Delta t = 0.05\text{ s}$ and write the transition dynamics and reward function as a discrete MDP.

#### Solution:
Let state $s \in \{0, 1, \dots, 10\}$ be the number of queued jobs.
In interval $\Delta t = 0.05$:
- Probability of 1 job arrival: $p_{\text{arr}} = \lambda \Delta t = 5 \times 0.05 = 0.25$.
- Probability of 1 job departure given $k$ active servers: $p_{\text{dep}}(k) = k \mu \Delta t = k(2)(0.05) = 0.10 k$.
- Higher-order arrivals/departures have probability $O(\Delta t^2) \approx 0$.
The transitions from state $s$ under action $k \in \{1, 2, 3\}$:
- With prob $p_{\text{arr}} (1 - p_{\text{dep}}(k))$: state becomes $\min(10, s + 1)$. If $s = 10$, drop penalty $-\$50$ applies.
- With prob $p_{\text{dep}}(k) (1 - p_{\text{arr}})$: state becomes $\max(0, s - 1)$, earning completion revenue $+\$10$.
- With prob $1 - \text{above}$: state remains $s$.
The expected reward per slice is:
$$r(s, k) = 10 \cdot p_{\text{dep}}(k) \mathbb{I}(s > 0) - 50 \cdot p_{\text{arr}} \mathbb{I}(s = 10) - (2 k) \Delta t$$
The controller optimizes active server count $k$ to balance electricity cost against overflow risk.

---

### Problem 12.5 (Grand Gauntlet): Discount Factor Invariance Threshold
Let $\pi^*$ be optimal for discount factor $\gamma_1$. Prove that there exists a neighborhood $(\gamma_1 - \epsilon, \gamma_1 + \epsilon)$ over which $\pi^*$ remains strictly optimal.

#### Solution:
In a finite MDP, the number of deterministic policies is finite ($|\Pi| = |\mathcal{A}|^{|\mathcal{S}|}$).
For any policy $\pi$, its value function $v_\pi(\gamma) = (\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1} \mathbf{r}_\pi$ is a rational function of $\gamma$, hence real-analytic and continuous on $[0, 1)$.
The advantage gap between optimal policy $\pi^*$ and any sub-optimal policy $\pi$ is:
$$\Delta_{\pi^*, \pi}(s; \gamma) = v_{\pi^*}(s; \gamma) - v_\pi(s; \gamma)$$
If $\pi^*$ is uniquely optimal at $\gamma_1$, then for all $\pi \neq \pi^*$:
$$\min_{s \in \mathcal{S}} \Delta_{\pi^*, \pi}(s; \gamma_1) = c_\pi > 0$$
Since there are finitely many policies, let $c^* = \min_{\pi \neq \pi^*} c_\pi > 0$.
By the continuity of rational functions, there exists $\epsilon > 0$ such that for all $\gamma \in (\gamma_1 - \epsilon, \gamma_1 + \epsilon)$:
$$\Delta_{\pi^*, \pi}(s; \gamma) > \frac{c^*}{2} > 0, \quad \forall s \in \mathcal{S}, \pi \neq \pi^*$$
Thus, $\pi^*$ remains strictly optimal throughout the neighborhood.

---

### Problem 12.6 (Grand Gauntlet): Contraction Violation in Off-Policy Bootstrapping (The Deadly Triad)
Sutton & Barto proved that combining three elements causes value updates to diverge to infinity:
1. Function Approximation (e.g. linear features $\hat{v}(s) = \mathbf{w}^T \mathbf{x}(s)$).
2. Bootstrapping (DP or TD targets).
3. Off-Policy Learning.

Construct a minimal 2-state counterexample (Baird's Counterexample) showing divergence of linear off-policy TD.

#### Solution:
Let states be $s_1, s_2$ with parameter $w \in \mathbb{R}$.
Let features be $x(s_1) = 1, x(s_2) = 2$, so $V(s_1) = w, V(s_2) = 2w$.
All rewards are 0; $\gamma = 0.9$.
Behavior policy moves $s_1 \to s_2$ with prob 1.0.
Target policy requires staying in $s_1$.
The off-policy TD update for transition $s_1 \to s_2$ is:
$$\Delta w = \alpha \rho [R + \gamma V(s_2) - V(s_1)] x(s_1) = \alpha \rho [0 + 0.9(2w) - w](1) = \alpha \rho [1.8w - w] = \alpha \rho [0.8 w]$$
$$w_{k+1} = w_k + 0.8 \alpha \rho w_k = (1 + 0.8 \alpha \rho) w_k$$
Because $(1 + 0.8 \alpha \rho) > 1$, for any initial $w_0 \neq 0$:
$$\lim_{k \to \infty} w_k = \pm \infty$$
The weights explode exponentially to infinity! Without tabular storage, off-policy bootstrapping loses the contraction mapping guarantee.

---

### Problem 12.7 (Grand Gauntlet): Policy Iteration Under Weak Contractions ($\gamma \to 1$)
Prove that for an undiscounted episodic MDP ($\gamma = 1.0$), Policy Iteration converges in finite time if all policies are **proper** (reach a terminal state with probability 1 from all states).

#### Solution:
If all policies are proper, the transient transition sub-matrix $\mathbf{Q}_\pi$ satisfies $\rho(\mathbf{Q}_\pi) < 1$.
The fundamental matrix $\mathbf{N}_\pi = (\mathbf{I} - \mathbf{Q}_\pi)^{-1}$ exists, is non-negative, and has finite entries.
The Policy Improvement Theorem proof (Section 9.2) holds for $\gamma = 1$ because the tail term $\lim_{k \to \infty} \mathbb{E}_{\pi'} [v_\pi(S_{t+k}) \mid S_t = s] = 0$ vanishes as the probability of remaining in transient states decays exponentially to 0.
Monotonicity $v_{\pi_{k+1}} \ge v_{\pi_k}$ is preserved, and the finite number of deterministic policies guarantees finite termination.

---

### Problem 12.8 (Grand Gauntlet): Optimal Stop Problem as an MDP (The Secretary Problem)
An employer interviews $N = 100$ job candidates in random order.
- After each interview $t \in \{1, \dots, N\}$, the employer can **Hire** (terminating immediately) or **Reject** (moving to candidate $t+1$).
- Reward is $+1.0$ if the hired candidate is the absolute best candidate among all $N$, and $0$ otherwise.
- $\gamma = 1.0$.

Formulate this as a discrete MDP and prove that the optimal policy rejects the first $N/e \approx 37$ candidates and hires the first candidate thereafter who exceeds all previously seen candidates.

#### Solution:
Let the state at step $t$ be $S_t = 1$ if candidate $t$ is the best seen so far, and $S_t = 0$ otherwise.
If candidate $t$ is not the best so far ($S_t = 0$), hiring them yields 0 reward (they cannot be the overall best).
If $S_t = 1$, the probability that candidate $t$ remains the best among all $N$ is $\frac{t}{N}$.
If the employer rejects and continues, the value of continuing is $v(t+1)$.
The Bellman optimality equation at step $t$ when $S_t = 1$ is:
$$v^*(t) = \max \left\{ \frac{t}{N}, \sum_{k=t+1}^N \frac{t}{k(k-1)} v^*(k) \right\}$$
In continuous limit as $N \to \infty$, let $x = t/N$. The optimal stopping threshold $x^*$ satisfies:
$$x^* = -x^* \ln(x^*) \implies -\ln(x^*) = 1 \implies x^* = \frac{1}{e} \approx 0.3679$$
The employer observes the first $37\%$ to establish a quality benchmark, then hires the first candidate who beats the benchmark.

---

### Problem 12.9 (Grand Gauntlet): Multi-Armed Bandit as Gittins Index MDP
Show that an $N$-armed bandit with Markovian state transitions can be decomposed into $N$ independent scalar sub-problems using the **Gittins Index Theorem** (1974).

#### Solution:
In a general $N$-armed Markov bandit, the joint state space has size $|\mathcal{S}|^N$, suffering severe curse of dimensionality.
John C. Gittins proved that under geometric discounting $\gamma < 1$, the optimal policy computes a scalar index $\nu(s_i)$ for each arm independently:
$$\nu(s_i) = \sup_{\tau > 0} \frac{\mathbb{E} \left[ \sum_{t=0}^{\tau - 1} \gamma^t R_{t+1} \;\middle|\; S_0 = s_i \right]}{\mathbb{E} \left[ \sum_{t=0}^{\tau - 1} \gamma^t \;\middle|\; S_0 = s_i \right]}$$
where $\tau$ is a stopping time.
At each step, the optimal policy simply selects the arm with the highest Gittins index:
$$a^* = \arg\max_{i \in \{1, \dots, N\}} \nu(s_i)$$
This reduces an intractable $N$-dimensional joint optimization problem $O(|\mathcal{S}|^N)$ to $N$ separate 1-dimensional optimal stopping problems $O(N |\mathcal{S}|)$.

---

### Problem 12.10 (Grand Gauntlet): In-Place Value Iteration Convergence Proof
Prove that Gauss-Seidel in-place Value Iteration is a contraction mapping with contraction factor at least as fast as synchronous Value Iteration.

#### Solution:
Let states be ordered $1, 2, \dots, N$.
During an in-place sweep, the update for state $i$ is:
$$\tilde{v}(i) = \max_a \left[ r(i, a) + \gamma \sum_{j < i} \mathcal{P}_{i, j}^a \tilde{v}(j) + \gamma \sum_{j \ge i} \mathcal{P}_{i, j}^a v(j) \right]$$
Let $\mathbf{e}_k = \mathbf{v}_k - \mathbf{v}^*$ be the error vector.
For state 1:
$$|e_{k+1}(1)| \le \gamma \sum_j \mathcal{P}_{1, j} |e_k(j)| \le \gamma \|\mathbf{e}_k\|_\infty$$
For state $i$:
$$|e_{k+1}(i)| \le \gamma \sum_{j < i} \mathcal{P}_{i, j} |e_{k+1}(j)| + \gamma \sum_{j \ge i} \mathcal{P}_{i, j} |e_k(j)|$$
By induction, since $|e_{k+1}(j)| \le \gamma \|\mathbf{e}_k\|_\infty$ for all predecessors $j < i$:
$$|e_{k+1}(i)| \le \gamma \left[ \gamma \sum_{j < i} \mathcal{P}_{i, j} + \sum_{j \ge i} \mathcal{P}_{i, j} \right] \|\mathbf{e}_k\|_\infty \le \gamma \|\mathbf{e}_k\|_\infty$$
Furthermore, if $\sum_{j < i} \mathcal{P}_{i, j} > 0$, the effective multiplier is strictly smaller than $\gamma$.
Thus, Gauss-Seidel in-place updates contract at least as fast as synchronous updates:
$$\|\mathbf{e}_{k+1}\|_\infty \le \gamma \|\mathbf{e}_k\|_\infty \quad \blacksquare$$

---

## 12.4 Capstone Mastery: Theoretical Proofs & State Computations

### Problem 12.11 (Capstone): Analytical Proof of Bellman Residual Minimization
Prove that the solution to $\min_{\mathbf{v}} \|T^* \mathbf{v} - \mathbf{v}\|_\infty$ is uniquely $\mathbf{v}^*$.

#### Solution:
By the contraction property of $T^*$:
$$\|T^* \mathbf{v} - \mathbf{v}\|_\infty \ge \|\mathbf{v} - \mathbf{v}^*\|_\infty - \|T^* \mathbf{v} - T^* \mathbf{v}^*\|_\infty \ge \|\mathbf{v} - \mathbf{v}^*\|_\infty - \gamma \|\mathbf{v} - \mathbf{v}^*\|_\infty = (1 - \gamma) \|\mathbf{v} - \mathbf{v}^*\|_\infty$$
The norm $\|T^* \mathbf{v} - \mathbf{v}\|_\infty$ is bounded below by $(1 - \gamma) \|\mathbf{v} - \mathbf{v}^*\|_\infty \ge 0$.
The minimum possible value of a norm is 0, which occurs if and only if $T^* \mathbf{v} = \mathbf{v}$.
By the Banach theorem, $\mathbf{v}^*$ is the unique fixed point. Thus, the minimum is uniquely attained at $\mathbf{v} = \mathbf{v}^*$.

---

### Problem 12.12 (Capstone): Derivation of Discounted State Occupancy Resolvent
Prove that the expected discounted number of times state $s'$ is visited starting from state $s$ under policy $\pi$ equals the $(s, s')$ entry of $(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}$.

#### Solution:
Let $\mathbb{I}(S_t = s')$ be the indicator random variable.
Total discounted visits:
$$N(s') = \sum_{t=0}^\infty \gamma^t \mathbb{I}(S_t = s')$$
Conditioned on $S_0 = s$:
$$\mathbb{E}_\pi [N(s') \mid S_0 = s] = \sum_{t=0}^\infty \gamma^t \mathbb{E}_\pi [\mathbb{I}(S_t = s') \mid S_0 = s] = \sum_{t=0}^\infty \gamma^t \mathbb{P}(S_t = s' \mid S_0 = s)$$
In matrix notation, $\mathbb{P}(S_t = s' \mid S_0 = s) = (\mathbf{P}_\pi^t)_{s, s'}$.
Therefore:
$$\mathbb{E}_\pi [N(s') \mid S_0 = s] = \sum_{t=0}^\infty \gamma^t (\mathbf{P}_\pi^t)_{s, s'} = \left( \sum_{t=0}^\infty (\gamma \mathbf{P}_\pi)^t \right)_{s, s'} = [(\mathbf{I} - \gamma \mathbf{P}_\pi)^{-1}]_{s, s'} \quad \blacksquare$$

---

### Problem 12.13 (Capstone): Convergence Rate of TD(0) Under On-Policy Sampling
State the conditions under which TD(0) converges to $v_\pi$ with probability 1.

#### Solution:
By the Tsitsiklis & Van Roy theorem (1997), tabular TD(0) converges almost surely to $v_\pi$ if:
1. The MDP is finite and policy $\pi$ induces an ergodic Markov chain.
2. The step-size schedule satisfies Robbins-Monro: $\sum \alpha_t = \infty, \sum \alpha_t^2 < \infty$.
3. $\gamma \in [0, 1)$.

---

### Problem 12.14 (Capstone): Invariance of Q-Values Under Constant Potential Shaping
Andrew Ng et al. (1999) proved that reward shaping $R'_{t+1} = R_{t+1} + \gamma \Phi(S_{t+1}) - \Phi(S_t)$ preserves optimal policies for any potential function $\Phi: \mathcal{S} \to \mathbb{R}$.
Prove that the shaped action-value function satisfies $Q^*(s, a) = Q_{\text{orig}}^*(s, a) - \Phi(s)$.

#### Solution:
The return under shaped reward is:
$$G'_t = \sum_{k=0}^\infty \gamma^k R'_{t+k+1} = \sum_{k=0}^\infty \gamma^k [R_{t+k+1} + \gamma \Phi(S_{t+k+1}) - \Phi(S_{t+k})]$$
Expanding the telescoping series:
$$= \sum_{k=0}^\infty \gamma^k R_{t+k+1} + \sum_{k=0}^\infty \gamma^{k+1} \Phi(S_{t+k+1}) - \sum_{k=0}^\infty \gamma^k \Phi(S_{t+k})$$
All intermediate potential terms cancel out telescopically:
$$= G_t - \Phi(S_t)$$
Taking expectations conditioned on $S_t = s, A_t = a$:
$$Q^*(s, a) = \mathbb{E}[G'_t \mid s, a] = \mathbb{E}[G_t \mid s, a] - \Phi(s) = Q_{\text{orig}}^*(s, a) - \Phi(s)$$
Because $\Phi(s)$ is identical for all actions in state $s$:
$$\arg\max_a Q^*(s, a) = \arg\max_a [Q_{\text{orig}}^*(s, a) - \Phi(s)] = \arg\max_a Q_{\text{orig}}^*(s, a)$$
The optimal policy is strictly preserved.

---

### Problem 12.15 (Capstone): Q-Learning Maximization Bias Analysis
Explain why tabular Q-Learning exhibits positive maximization bias:
$$\mathbb{E}[\max_a Q(s, a)] \ge \max_a \mathbb{E}[Q(s, a)]$$

#### Solution:
Let $X_1, X_2, \dots, X_m$ be independent zero-mean random variables representing noisy Q-value estimates.
Even though $\mathbb{E}[X_i] = 0$ for all $i$ (unbiased individual estimates):
$$\mathbb{E}[\max(X_1, \dots, X_m)] > 0 \quad (\text{for } m > 1)$$
The maximum operator selects the largest positive estimation error, systematically overestimating state values. This motivated Hasselt (2010) to invent **Double Q-Learning**.

---

### Problem 12.16 (Capstone): Policy Iteration as Newton-Raphson Method
Show that Policy Iteration is mathematically equivalent to applying the Newton-Raphson method to the operator equation $T^* \mathbf{v} - \mathbf{v} = \mathbf{0}$.

#### Solution:
Let $F(\mathbf{v}) \doteq T^* \mathbf{v} - \mathbf{v}$.
At iterate $\mathbf{v}_k$, let $\pi_k$ be the greedy policy with respect to $\mathbf{v}_k$, so $T^* \mathbf{v}_k = T^{\pi_k} \mathbf{v}_k = \mathbf{r}_{\pi_k} + \gamma \mathbf{P}_{\pi_k} \mathbf{v}_k$.
The directional derivative (Jacobian) of $F$ at $\mathbf{v}_k$ is:
$$\mathbf{J}_F = \gamma \mathbf{P}_{\pi_k} - \mathbf{I} = -(\mathbf{I} - \gamma \mathbf{P}_{\pi_k})$$
The Newton-Raphson update step is:
$$\mathbf{v}_{k+1} = \mathbf{v}_k - \mathbf{J}_F^{-1} F(\mathbf{v}_k) = \mathbf{v}_k - [-(\mathbf{I} - \gamma \mathbf{P}_{\pi_k})]^{-1} [\mathbf{r}_{\pi_k} + \gamma \mathbf{P}_{\pi_k} \mathbf{v}_k - \mathbf{v}_k]$$
$$= \mathbf{v}_k + (\mathbf{I} - \gamma \mathbf{P}_{\pi_k})^{-1} [\mathbf{r}_{\pi_k} - (\mathbf{I} - \gamma \mathbf{P}_{\pi_k}) \mathbf{v}_k] = (\mathbf{I} - \gamma \mathbf{P}_{\pi_k})^{-1} \mathbf{r}_{\pi_k}$$
This is exactly the Policy Evaluation step $v_{\pi_k}$!
Thus, Policy Iteration is identical to Newton-Raphson root-finding on the Bellman residual, explaining its rapid quadratic convergence rate.

---

### Problem 12.17 (Capstone): Ergodic MDP Stationary Reward Formulation
Prove that in an ergodic continuing MDP, the average reward $r(\pi) = \lim_{T \to \infty} \frac{1}{T} \sum_{t=1}^T R_t$ is independent of the initial state $S_0$.

#### Solution:
In an ergodic Markov chain, the transition matrix $\mathbf{P}_\pi$ has a unique stationary distribution $\mathbf{d}_\pi$ such that $\lim_{t \to \infty} \mathcal{P}_{s, s'}^{(t)} = d^\pi(s')$ for all initial states $s$.
By the CesÃ ro-mean ergodic theorem:
$$\lim_{T \to \infty} \frac{1}{T} \sum_{t=1}^T \mathbb{E}[R_t \mid S_0 = s] = \sum_{s' \in \mathcal{S}} d^\pi(s') r_\pi(s') = r(\pi)$$
Because the limit is the inner product $\mathbf{d}_\pi \mathbf{r}_\pi$, all dependence on the initial state $s$ vanishes.

---

### Problem 12.18 (Capstone): Exact Q-Learning Bellman Fixed Point Equivalence
Prove that if tabular Q-Learning converges ($\Delta Q \to 0$), the converged table $Q_\infty$ satisfies the Bellman Optimality Equation.

#### Solution:
The expected Q-learning update at convergence satisfies:
$$\mathbb{E}[R_{t+1} + \gamma \max_{a'} Q(S_{t+1}, a') - Q(S_t, A_t)] = 0$$
$$\sum_{s'} \mathcal{P}_{s, s'}^a \left[ r(s, a, s') + \gamma \max_{a'} Q(s', a') \right] - Q(s, a) = 0$$
$$Q(s, a) = r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a \max_{a'} Q(s', a')$$
This is identical to the Bellman Optimality Equation for $q^*(s, a)$. By the uniqueness of the contraction fixed point, $Q_\infty = q^*$.

---

### Problem 12.19 (Capstone): Entropy-Regularized Soft Bellman Contraction Proof
Prove that the Soft-Max Bellman operator $(T_{\text{soft}} v)(s) = \max_a [r(s, a) + \gamma \sum_{s'} \mathcal{P}_{s, s'}^a v(s')] + \tau \mathcal{H}(\pi)$ is a $\gamma$-contraction mapping.

#### Solution:
Let $f(v) = \tau \ln \sum_a e^{q_v(s, a)/\tau}$.
By the mean value theorem, the Jacobian of $f$ with respect to $q$ is the Softmax distribution $\boldsymbol{\pi}_{\text{soft}}$.
Because $\sum_a \pi_{\text{soft}}(a) = 1$ and $\pi_{\text{soft}}(a) \ge 0$:
$$|f(u) - f(v)| \le \max_a |q_u(s, a) - q_v(s, a)| \le \gamma \|u - v\|_\infty$$
Thus, soft Bellman operators preserve the exact $\gamma$-contraction property under $\|\cdot\|_\infty$.

---

### Problem 12.20 (Capstone): The Complete Grand Synthesis
Synthesize the entire trajectory of this treatise: show how Andrei Markov's 1906 letter chain leads inexorably to Bellman's 1957 dynamic programming, Watkins' 1989 Q-learning, and 2026 autonomous agent architectures.

#### Solution:
1. **Markov (1906):** Established that a stochastic process can maintain causal consistency through state memorylessness without infinite historical tracking.
2. **Bellman (1957):** Leveraged the Markov property to collapse infinite-horizon planning into a 2-period recursive contractive operator $T^*$, overcoming combinatorial path explosions.
3. **Howard (1960):** Proved the Policy Improvement Theorem, establishing that greedy action selection monotonically improves value functions in finite steps.
4. **Sutton & Barto (1980s):** Combined animal trial-and-error with dynamic programming, inventing Temporal Difference learning to eliminate the requirement of an environmental model.
5. **Watkins (1989):** Proved that off-policy TD learning converges directly to Bellman optimality without human supervision.
6. **Modern Autonomous Agents (2020sâ€“2026):** Replaces tabular matrices with deep neural network representations, allowing simulated and robotic agents to solve high-dimensional perception, control, and multi-agent coordination problems.


