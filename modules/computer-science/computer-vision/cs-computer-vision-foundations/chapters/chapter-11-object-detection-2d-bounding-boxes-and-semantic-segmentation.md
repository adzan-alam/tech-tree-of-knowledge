# Chapter 11: Object Detection, 2D Bounding Boxes, and Semantic Segmentation

---

## 11.1 The Object Localization Formulation and Multi-Task Loss

While image classification assigns a single global category label to an entire image, autonomous robotic systems (such as warehouse manipulators, autonomous vehicles, and surgical robots) must determine both **what** objects are present and **where** they are physically located.

```
                  THE TAXONOMY OF VISUAL UNDERSTANDING
                  
    Classification             Classification + Loc.           Object Detection           Semantic Segmentation
    ┌───────────────┐           ┌───────────────┐               ┌───────────────┐          ┌───────────────┐
    │               │           │    ┌─────┐    │               │ ┌───┐   ┌───┐ │          │   #####       │
    │      CAT      │           │    │ CAT │    │               │ │CAT│   │DOG│ │          │  #######      │
    │               │           │    └─────┘    │               │ └───┘   └───┘ │          │   ##### $$$$  │
    └───────────────┘           └───────────────┘               └───────────────┘          └───────────────┘
     Single Class Label          Single Object +                 Multiple Objects +         Dense Pixel-wise
                                 Bounding Box                    Multiple Boxes             Class Labels
```

### 2D Bounding Box Parameterizations
A 2D bounding box delineates the spatial footprint of an object in pixel coordinates. Two standard conventions exist:
1. **Corner Form ($xyxy$):**
   $$\mathbf{b} = [x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}]^\top$$
2. **Center-Size Form ($xywh$):**
   $$\mathbf{b} = [x_c, y_c, w, h]^\top$$
   where $x_c = \frac{x_{\text{min}} + x_{\text{max}}}{2}$, $y_c = \frac{y_{\text{min}} + y_{\text{max}}}{2}$, $w = x_{\text{max}} - x_{\text{min}}$, $h = y_{\text{max}} - y_{\text{min}}$.

### Multi-Task Objective Function
Object detection is inherently a **multi-task learning** problem: the neural network must simultaneously optimize a discrete classification loss $\mathcal{L}_{\text{cls}}$ over $K$ categories and a continuous regression loss $\mathcal{L}_{\text{box}}$ over 4 coordinate parameters:

$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{cls}}(\mathbf{p}, \mathbf{p}^*) + \lambda_{\text{reg}} \cdot \mathbb{I}[c^* \ge 1] \cdot \mathcal{L}_{\text{box}}(\mathbf{b}, \mathbf{b}^*)$$

where:
- $\mathbf{p} \in \mathbb{R}^{K+1}$ is the predicted probability distribution over $K$ object classes plus 1 background class.
- $\mathbf{b}$ is the predicted bounding box, and $\mathbf{b}^*$ is the ground-truth box.
- $\mathbb{I}[c^* \ge 1]$ is an indicator function that disables box regression when the anchor belongs to background ($c^* = 0$).
- $\lambda_{\text{reg}}$ is a balancing hyperparameter.

---

## 11.2 Bounding Box Metrics and Loss Functions

### 1. Intersection over Union (IoU / Jaccard Index)
The fundamental metric for evaluating bounding box overlap is the **Intersection over Union (IoU)**:

$$\text{IoU}(A, B) \triangleq \frac{\text{Area}(A \cap B)}{\text{Area}(A \cup B)} = \frac{\text{Area}(A \cap B)}{\text{Area}(A) + \text{Area}(B) - \text{Area}(A \cap B)}$$

```
                         INTERSECTION OVER UNION (IoU)
                         
          Bounding Box A                 Intersection (A ∩ B)               Union (A ∪ B)
         ┌───────────────┐                     ┌───┐                      ┌───────────────┐
         │               │                     │###│                      │               │
         │       ┌───────┼───────┐             └───┘                      │       ┌───────┼───────┐
         │       │       │       │                                        │       │       │       │
         └───────┼───────┘       │                                        └───────┼───────┘       │
                 │               │                                                │               │
                 └───────────────┘                                                └───────────────┘
                                           Area(A ∩ B)
                          IoU = ─────────────────────────────────
                                Area(A) + Area(B) - Area(A ∩ B)
```

- $\text{IoU} = 1.0$: Perfect spatial alignment.
- $\text{IoU} = 0.0$: Disjoint boxes (no overlap).
- Standard detection threshold: A predicted box is considered a **True Positive (TP)** if $\text{IoU}(B_{\text{pred}}, B_{\text{gt}}) \ge 0.50$ (or $0.75$ for high-precision benchmarks).

### 2. Smooth L1 Loss (Huber Loss)
Early detectors used standard $L_1$ or $L_2$ losses on box coordinate offsets. Ross Girshick (Fast R-CNN, 2015) introduced **Smooth $L_1$ Loss**, which behaves like $L_2$ near zero (smooth, continuous gradients) and $L_1$ for large errors (robust to extreme outliers):

$$\text{Smooth}_{L_1}(x) = \begin{cases} 0.5 x^2 & \text{if } |x| < 1 \\ |x| - 0.5 & \text{otherwise} \end{cases}$$

### 3. Direct IoU-Based Losses
While Smooth $L_1$ treats the four coordinates as independent variables, real bounding boxes exhibit strong coupling: an error in $w$ directly affects how $x$ influences overlap.
Modern detectors optimize the IoU metric directly:
- **IoU Loss:**
  $$\mathcal{L}_{\text{IoU}} = 1 - \text{IoU}$$
  *Flaw:* If two boxes do not overlap ($\text{IoU} = 0$), the gradient $\nabla \mathcal{L}_{\text{IoU}} = \mathbf{0}$, halting optimization.
- **Generalized IoU (GIoU) Loss (Rezatofighi et al., 2019):**
  Let $C$ be the smallest enclosing bounding box that completely covers both $A$ and $B$:
  $$\text{GIoU} = \text{IoU} - \frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)}$$
  $$\mathcal{L}_{\text{GIoU}} = 1 - \text{GIoU}$$
  When boxes do not overlap, GIoU penalizes the empty space in $C$, driving disjoint boxes toward each other!

---

## 11.3 Redundant Box Filtering: Non-Maximum Suppression (NMS)

Because modern detectors evaluate dense anchor grids across multiple scales, dozens of candidate boxes typically fire with high confidence on different parts of the same physical object.

```
                    NON-MAXIMUM SUPPRESSION (NMS) FILTERING
                    
        Raw Dense Candidate Boxes                       Post-NMS Filtered Box
        ┌───────────────────────┐                      ┌───────────────────────┐
        │       ┌─────┐         │                      │                       │
        │     ┌─┼───┐ │ 0.88    │                      │       ┌───────┐       │
        │     │ ┌───┼─┼───┐0.94 │   ───► NMS ────►     │       │  CAR  │ 0.94  │
        │     │ │CAR│ │   │     │                      │       │       │       │
        │     └─┼───┼─┘   │0.76 │                      │       └───────┘       │
        │       └───┴─────┘     │                      │                       │
        └───────────────────────┘                      └───────────────────────┘
        Multiple Overlapping Boxes                     Single Clean Detection
```

### The Greedy NMS Algorithm
1. **Input:** A list of candidate detections $\mathcal{B} = \{B_1, \dots, B_N\}$ with associated class confidence scores $\mathcal{S} = \{s_1, \dots, s_N\}$, and an IoU threshold $T_{\text{IoU}}$ (typically $0.45 - 0.50$).
2. **Output:** A pruned list of final detections $\mathcal{D}$.
3. Initialize $\mathcal{D} = \emptyset$.
4. **Loop:**
   - Find box $M \in \mathcal{B}$ with the maximum score: $M = \arg\max_{B_i} s_i$.
   - Move $M$ from $\mathcal{B}$ to $\mathcal{D}$.
   - For all remaining boxes $B_i \in \mathcal{B}$:
     Compute overlap $\text{IoU}(M, B_i)$.
     If $\text{IoU}(M, B_i) > T_{\text{IoU}}$, remove $B_i$ from $\mathcal{B}$.
5. Terminate when $\mathcal{B}$ is empty.

### Soft-NMS (Bodla et al., 2017)
In crowded scenes (e.g., pedestrians walking side-by-side), standard NMS can delete a true adjacent person whose box happens to overlap with the primary detection.
**Soft-NMS** does not delete overlapping boxes. Instead, it exponentially decays their confidence score:
$$s_i \leftarrow s_i \cdot \exp\left( -\frac{\text{IoU}(M, B_i)^2}{\sigma_{\text{nms}}} \right)$$
Boxes with high overlap are demoted, but adjacent objects retain enough confidence to survive final thresholding.

---

## 11.4 Two-Stage vs. One-Stage Detection Paradigms

```
                      TWO-STAGE VS. ONE-STAGE DETECTION
                      
    TWO-STAGE (Faster R-CNN)                   ONE-STAGE (YOLO, RetinaNet)
    
       Input Image                                Input Image
            │                                          │
            ▼                                          ▼
       Backbone (ResNet)                          Backbone (ResNet / CSPDarknet)
            │                                          │
            ▼                                          ▼
     Region Proposal Network (RPN)                 Dense Anchor Head
            │ (~2000 Candidate Boxes)                  │ (Single-shot Prediction)
            ▼                                          │
      RoI Align / Pooling                              ▼
            │                                     Focal Loss / GIoU Loss
            ▼                                          │
      Box Regression & Class Head                      ▼
            │                                    Pruned Detections (NMS)
            ▼
      Final Detections
```

### 1. Two-Stage Detectors: Faster R-CNN (Ren et al., 2015)
- **Stage 1 (Region Proposal):** The **Region Proposal Network (RPN)** slides across the convolutional feature map, predicting class-agnostic candidate proposals from multi-scale anchor boxes.
- **Stage 2 (Refinement):** **RoI Align** extracts fixed-size feature vectors (e.g., $7 \times 7$) for each proposal using bilinear interpolation without coordinate quantization. Fully connected heads output fine-grained class probabilities and precise coordinate deltas.
- *Advantage:* High localization accuracy; excels on small objects.
- *Disadvantage:* High latency ($\approx 10\text{ to } 20\text{ FPS}$), difficult to deploy on lightweight embedded robot hardware.

### 2. One-Stage Detectors: YOLO (Redmon et al., 2016)
- Treats object detection as a single, end-to-end continuous tensor regression problem.
- Partitions the input image into an $S \times S$ spatial grid. If an object's center falls into a grid cell, that cell is responsible for predicting its bounding box and class probabilities directly.
- *Advantage:* Blazing speed ($60\text{ to } 150+\text{ FPS}$), ideal for real-time mobile robot perception.

### 3. Focal Loss for Dense One-Stage Detection (Lin et al., 2017)
One-stage detectors evaluate tens of thousands of candidate boxes per frame, where $99.9\%$ contain background. In standard Cross-Entropy loss:
$$\text{CE}(p_t) = -\log(p_t)$$
Even though an easy background candidate has small error ($p_t \approx 0.99 \implies \text{loss} \approx 0.01$), summing over $100,000$ easy negatives completely overwhelms the gradient updates of the few true positive objects!

Tsung-Yi Lin et al. introduced **Focal Loss**, adding a dynamic modulating factor $(1 - p_t)^\gamma$:

$$\text{FL}(p_t) = - \alpha_t (1 - p_t)^\gamma \log(p_t)$$

- For easy examples ($p_t \to 1$): The modulating factor $(1 - p_t)^\gamma \to 0$, suppressing their loss contribution by up to $1000\times$.
- For hard examples ($p_t \to 0$): The modulating factor remains near $1$.
- Focal Loss enabled one-stage detectors (RetinaNet, YOLOv4/v5/v8) to match or exceed the accuracy of two-stage detectors while preserving real-time inference speed.

---

## 11.5 Semantic Segmentation: Fully Convolutional Networks and U-Net

While bounding boxes identify object extents via coarse rectangles, **semantic segmentation** performs dense pixel-wise classification, labeling every individual pixel $(y, x)$ with its semantic material category (e.g., road, sidewalk, obstacle, free space).

```
                         THE U-NET ARCHITECTURE
                         
    Input 512x512x3                                                Output 512x512xC
        ┌───┐                                                            ┌───┐
        │   │ ────────────────── Skip Connection ───────────────────────►│   │
        └───┘                                                            └───┘
          │ MaxPool                                                        ▲ Bilinear Up
          ▼                                                                │
        ┌───┐                                                            ┌───┐
        │   │ ────────────────── Skip Connection ───────────────────────►│   │
        └───┘                                                            └───┘
          │ MaxPool                                                        ▲ Bilinear Up
          ▼                                                                │
        ┌───┐                                                            ┌───┐
        │   │ ────────────────── Skip Connection ───────────────────────►│   │
        └───┘                                                            └───┘
          │                                                                ▲
          └──────────────────────── Bottleneck ────────────────────────────┘
                              (Deep Contextual Core)
```

### 1. Fully Convolutional Networks (FCNs)
In 2015, Jonathan Long, Evan Shelhamer, and Trevor Darrell showed that standard classification backbones (VGG, ResNet) can be converted into dense segmentation engines by **replacing dense fully connected layers with $1 \times 1$ convolutional layers**.
An FCN takes an image of arbitrary size and outputs a spatial heatmap of class logits:
$$\mathbf{Y} \in \mathbb{R}^{C_{\text{classes}} \times H \times W}$$

### 2. The U-Net Architecture (Ronneberger et al., 2015)
Standard pooling and strided convolutions downsample spatial resolution, destroying the precise boundary coordinates required for robotic grasping.

Olaf Ronneberger et al. introduced the **U-Net**, which pairs an **Encoder (Contracting Path)** with a symmetric **Decoder (Expanding Path)** linked by **Long-Range Skip Connections**:
1. **Encoder Path:** Captures high-level semantic context (identifying "what" objects are present) by successively convolving and downsampling.
2. **Decoder Path:** Upsamples low-resolution semantic feature maps back to the raw image resolution via bilinear upsampling or transposed convolutions.
3. **Skip Connections:** Concatenates fine-grained, high-resolution feature maps from early encoder layers directly into corresponding decoder stages.
   - Low-level edges, textures, and crisp boundary locations from early layers bypass the bottleneck, enabling the network to reconstruct razor-sharp object contours!

### 3. Segmentation Metrics: Mean IoU and Dice Coefficient
Given ground-truth binary mask $G$ and predicted binary mask $P$:
- **Intersection over Union (mIoU):**
  $$\text{IoU} = \frac{|P \cap G|}{|P \cup G|} = \frac{\text{TP}}{\text{TP} + \text{FP} + \text{FN}}$$
- **Dice Coefficient (F1 Score):**
  $$\text{Dice} = \frac{2 |P \cap G|}{|P| + |G|} = \frac{2 \text{TP}}{2 \text{TP} + \text{FP} + \text{FN}}$$

---

## 11.6 Lifting 2D Image Detections into 3D Physical Space for Robotics

A mobile robot cannot navigate or grasp an object using 2D pixel coordinates alone. It must compute the object's metric 3D position and orientation in physical world coordinates.

```
                  LIFTING 2D DETECTIONS INTO 3D WORLD SPACE
                  
       2D Detection Bounding Box                  3D Camera Viewing Frustum
            ┌───────────────┐                            ┌───────────────┐
            │   ┌───────┐   │                          ┌─┼─────────────┐ │
            │   │TOOLBOX│   │     ──► Ray Cast ──►    /  │   TOOLBOX   │ │
            │   └───────┘   │                        /   │    (3D)     │/
            └───────────────┘                       o────┴─────────────┘
          Pixel Coordinates (u, v)             Optical Center C (Ray Pyramid)
```

### 1. Frustum Ray Volume Generation
Given a 2D bounding box $\mathbf{b} = [u_{\text{min}}, v_{\text{min}}, u_{\text{max}}, v_{\text{max}}]$ and camera intrinsic matrix $\mathbf{K}$:
1. Back-project the four 2D corners into normalized camera ray directions:
   $$\mathbf{d}_i = \mathbf{K}^{-1} [u_i, v_i, 1]^\top \quad \text{for } i \in \{1, 2, 3, 4\}$$
2. In 3D space, these rays form the 4 boundary planes of a **3D viewing frustum** originating from camera center $\mathbf{C}$. The target object is guaranteed to lie within this 3D frustum volume.

### 2. Point Cloud Fusion (RGB-D / Stereo)
If depth measurements are available from a stereo disparity map or LiDAR:
1. Filter the 3D point cloud to retain only points falling inside the 3D viewing frustum.
2. Segment the foreground object cluster from the background table or floor plane using RANSAC plane fitting.
3. Compute the **3D Oriented Bounding Box (OBB)**:
   - 3D Centroid: $\mathbf{X}_c = [X_c, Y_c, Z_c]^\top \in \mathbb{R}^3$
   - 3D Dimensions: $[W, H, D] \in \mathbb{R}^3$
   - 3D Orientation: $\mathbf{R} \in \text{SO}(3)$ (or yaw angle $\theta_{\text{yaw}}$ around vertical axis).

The robot arm can now plan collision-free motion paths and position its end-effector to grasp the object in physical space!

---

## 11.7 Worked Examples

### Problem 11.1: Exact Intersection over Union (IoU) Calculation
**Statement:** Two bounding boxes are given in $[x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}]$ format:
- Ground-truth box $A = [50, 50, 150, 150]$
- Predicted box $B = [100, 100, 200, 200]$
1. Compute the area of box $A$ and box $B$.
2. Compute the coordinates and area of the intersection box $A \cap B$.
3. Compute the area of the union $A \cup B$ and the exact IoU.

**Step-by-step Solution:**
1. **Individual Box Areas:**
   $$\text{Width}_A = 150 - 50 = 100, \quad \text{Height}_A = 150 - 50 = 100 \implies \text{Area}(A) = 100 \times 100 = 10,000$$
   $$\text{Width}_B = 200 - 100 = 100, \quad \text{Height}_B = 200 - 100 = 100 \implies \text{Area}(B) = 100 \times 100 = 10,000$$
2. **Intersection Box ($A \cap B$):**
   $$x_{\text{min}}^{\cap} = \max(x_{\text{min}}^A, x_{\text{min}}^B) = \max(50, 100) = 100$$
   $$y_{\text{min}}^{\cap} = \max(y_{\text{min}}^A, y_{\text{min}}^B) = \max(50, 100) = 100$$
   $$x_{\text{max}}^{\cap} = \min(x_{\text{max}}^A, x_{\text{max}}^B) = \min(150, 200) = 150$$
   $$y_{\text{max}}^{\cap} = \min(y_{\text{max}}^A, y_{\text{max}}^B) = \min(150, 200) = 150$$
   Intersection dimensions:
   $$w_{\cap} = \max(0, 150 - 100) = 50, \quad h_{\cap} = \max(0, 150 - 100) = 50$$
   $$\text{Area}(A \cap B) = 50 \times 50 = 2,500$$
3. **Union Area and IoU:**
   $$\text{Area}(A \cup B) = \text{Area}(A) + \text{Area}(B) - \text{Area}(A \cap B) = 10,000 + 10,000 - 2,500 = 17,500$$
   $$\text{IoU} = \frac{\text{Area}(A \cap B)}{\text{Area}(A \cup B)} = \frac{2,500}{17,500} = \frac{25}{175} = \frac{1}{7} \approx 0.142857$$
   The IoU is exactly $\frac{1}{7} \approx 14.29\%$.

---

### Problem 11.2: Generalized IoU (GIoU) Evaluation
**Statement:** Compute the Generalized IoU (GIoU) between the two boxes in Problem 11.1 ($A = [50, 50, 150, 150]$ and $B = [100, 100, 200, 200]$).

**Step-by-step Solution:**
1. From Problem 11.1: $\text{IoU} = \frac{1}{7} \approx 0.142857$, $\text{Area}(A \cup B) = 17,500$.
2. Compute the smallest enclosing bounding box $C$:
   $$x_{\text{min}}^C = \min(x_{\text{min}}^A, x_{\text{min}}^B) = \min(50, 100) = 50$$
   $$y_{\text{min}}^C = \min(y_{\text{min}}^A, y_{\text{min}}^B) = \min(50, 100) = 50$$
   $$x_{\text{max}}^C = \max(x_{\text{max}}^A, x_{\text{max}}^B) = \max(150, 200) = 200$$
   $$y_{\text{max}}^C = \max(y_{\text{max}}^A, y_{\text{max}}^B) = \max(150, 200) = 200$$
   Dimensions of $C$:
   $$w_C = 200 - 50 = 150, \quad h_C = 200 - 50 = 150$$
   $$\text{Area}(C) = 150 \times 150 = 22,500$$
3. Compute the GIoU penalty:
   $$\frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)} = \frac{\text{Area}(C) - \text{Area}(A \cup B)}{\text{Area}(C)} = \frac{22,500 - 17,500}{22,500} = \frac{5,000}{22,500} = \frac{2}{9} \approx 0.222222$$
4. Compute GIoU:
   $$\text{GIoU} = \text{IoU} - \frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)} = \frac{1}{7} - \frac{2}{9} = \frac{9 - 14}{63} = -\frac{5}{63} \approx -0.079365$$
   The GIoU is negative ($-\frac{5}{63}$), accurately reflecting the substantial empty space in the enclosing box.

---

### Problem 11.3: Smooth L1 Loss vs. L2 Loss Comparison
**Statement:** A regression target has ground truth coordinate $y^* = 10.0$.
Compute the loss and derivative for predictions $y_1 = 10.5$ and $y_2 = 14.0$ under:
1. Mean Squared Error (MSE): $\mathcal{L}_{\text{MSE}} = 0.5 (y - y^*)^2$.
2. Smooth L1 Loss: $\mathcal{L}_{\text{Smooth}} = \text{Smooth}_{L_1}(y - y^*)$.

**Step-by-step Solution:**
1. **Case 1: Small Error ($e_1 = y_1 - y^* = 10.5 - 10.0 = 0.5$):**
   Here $|e_1| = 0.5 < 1$.
   - MSE:
     $$\mathcal{L}_{\text{MSE}} = 0.5 (0.5)^2 = 0.125, \quad \frac{d\mathcal{L}}{dy} = e_1 = 0.5$$
   - Smooth L1:
     $$\mathcal{L}_{\text{Smooth}} = 0.5 (0.5)^2 = 0.125, \quad \frac{d\mathcal{L}}{dy} = e_1 = 0.5$$
   For small errors, Smooth L1 is identical to MSE.

2. **Case 2: Large Error ($e_2 = y_2 - y^* = 14.0 - 10.0 = 4.0$):**
   Here $|e_2| = 4.0 \ge 1$.
   - MSE:
     $$\mathcal{L}_{\text{MSE}} = 0.5 (4.0)^2 = 8.0, \quad \frac{d\mathcal{L}}{dy} = e_2 = 4.0$$
   - Smooth L1:
     $$\mathcal{L}_{\text{Smooth}} = |e_2| - 0.5 = 4.0 - 0.5 = 3.5, \quad \frac{d\mathcal{L}}{dy} = \text{sign}(e_2) = +1.0$$
   Notice that for the large error, the MSE gradient explodes to $4.0$, whereas the Smooth L1 gradient is bounded at strictly $+1.0$. Smooth L1 prevents exploding gradients during training.

---

### Problem 11.4: Greedy Non-Maximum Suppression (NMS) Execution
**Statement:** A detector outputs 3 candidate boxes for the class "Pedestrian":
- Box 1: Score $s_1 = 0.90$, Area = $100$
- Box 2: Score $s_2 = 0.85$, Area = $100$, Overlap with Box 1 has $\text{IoU}(B_1, B_2) = 0.65$
- Box 3: Score $s_3 = 0.70$, Area = $100$, Overlap with Box 1 has $\text{IoU}(B_1, B_3) = 0.20$, Overlap with Box 2 has $\text{IoU}(B_2, B_3) = 0.30$
NMS threshold is $T_{\text{IoU}} = 0.50$.
Trace the NMS execution and state the final detections.

**Step-by-step Solution:**
1. Candidate list: $\mathcal{B} = \{B_1 (0.90), B_2 (0.85), B_3 (0.70)\}$. Sorted in descending order of score.
   Output list: $\mathcal{D} = \emptyset$.
2. **Iteration 1:**
   - Select highest score: $B_1$ ($s_1 = 0.90$).
   - Add $B_1$ to $\mathcal{D}$: $\mathcal{D} = \{B_1\}$.
   - Test remaining boxes against $B_1$:
     - For $B_2$: $\text{IoU}(B_1, B_2) = 0.65 > 0.50 \implies$ **Suppressed!** (Discard $B_2$).
     - For $B_3$: $\text{IoU}(B_1, B_3) = 0.20 \le 0.50 \implies$ Kept.
   - Updated candidate list: $\mathcal{B} = \{B_3\}$.
3. **Iteration 2:**
   - Select highest score from remaining: $B_3$ ($s_3 = 0.70$).
   - Add $B_3$ to $\mathcal{D}$: $\mathcal{D} = \{B_1, B_3\}$.
   - No remaining candidates.
4. **Final Output Detections:**
   $$\mathcal{D} = \{B_1, B_3\}$$
   Box 2 was suppressed because it was a redundant duplicate of Box 1.

---

### Problem 11.5: Focal Loss Numerical Evaluation
**Statement:** Compare standard Cross-Entropy Loss and Focal Loss ($\gamma = 2.0, \alpha = 1.0$) for:
1. An easy negative background example with $p_t = 0.95$.
2. A hard positive object example with $p_t = 0.20$.
Evaluate the ratio of losses between the two examples.

**Step-by-step Solution:**
Formula: $\text{CE}(p_t) = -\ln(p_t)$, $\text{FL}(p_t) = -(1 - p_t)^\gamma \ln(p_t)$.

1. **Easy Example ($p_t = 0.95$):**
   - Cross-Entropy:
     $$\text{CE} = -\ln(0.95) \approx 0.051293$$
   - Modulating factor: $(1 - 0.95)^2 = 0.05^2 = 0.0025$.
   - Focal Loss:
     $$\text{FL} = 0.0025 \times 0.051293 \approx 0.000128$$

2. **Hard Example ($p_t = 0.20$):**
   - Cross-Entropy:
     $$\text{CE} = -\ln(0.20) \approx 1.609438$$
   - Modulating factor: $(1 - 0.20)^2 = 0.80^2 = 0.64$.
   - Focal Loss:
     $$\text{FL} = 0.64 \times 1.609438 \approx 1.030040$$

3. **Loss Ratio ($\frac{\text{Hard Loss}}{\text{Easy Loss}}$):**
   - Under Cross-Entropy:
     $$\text{Ratio}_{\text{CE}} = \frac{1.609438}{0.051293} \approx 31.38$$
   - Under Focal Loss:
     $$\text{Ratio}_{\text{FL}} = \frac{1.030040}{0.000128} \approx 8,047.19$$
   Focal loss boosts the relative gradient emphasis on the hard example by over **$250\times$**, completely suppressing background noise!

---

### Problem 11.6: Mean IoU (mIoU) Calculation Across 3 Classes
**Statement:** A semantic segmentation network is evaluated on a test set. The confusion matrix of pixel counts is:
$$\mathbf{C} = \begin{bmatrix} 800 & 50 & 50 \\ 30 & 600 & 70 \\ 40 & 60 & 500 \end{bmatrix}$$
where rows represent ground-truth classes (Road, Vehicle, Pedestrian) and columns represent predicted classes.
Compute:
1. The IoU for each of the 3 classes.
2. The Mean IoU (mIoU) of the model.

**Step-by-step Solution:**
For class $k$: $\text{IoU}_k = \frac{C_{kk}}{\sum_j C_{kj} + \sum_i C_{ik} - C_{kk}} = \frac{\text{TP}_k}{\text{RowSum}_k + \text{ColSum}_k - \text{TP}_k}$.
1. **Class 1 (Road):**
   - $\text{TP}_1 = 800$
   - $\text{RowSum}_1 = 800 + 50 + 50 = 900$
   - $\text{ColSum}_1 = 800 + 30 + 40 = 870$
   - $\text{Union}_1 = 900 + 870 - 800 = 970$
   $$\text{IoU}_1 = \frac{800}{970} \approx 0.8247 \quad (82.47\%)$$

2. **Class 2 (Vehicle):**
   - $\text{TP}_2 = 600$
   - $\text{RowSum}_2 = 30 + 600 + 70 = 700$
   - $\text{ColSum}_2 = 50 + 600 + 60 = 710$
   - $\text{Union}_2 = 700 + 710 - 600 = 810$
   $$\text{IoU}_2 = \frac{600}{810} \approx 0.7407 \quad (74.07\%)$$

3. **Class 3 (Pedestrian):**
   - $\text{TP}_3 = 500$
   - $\text{RowSum}_3 = 40 + 60 + 500 = 600$
   - $\text{ColSum}_3 = 50 + 70 + 500 = 620$
   - $\text{Union}_3 = 600 + 620 - 500 = 720$
   $$\text{IoU}_3 = \frac{500}{720} \approx 0.6944 \quad (69.44\%)$$

4. **Mean IoU (mIoU):**
   $$\text{mIoU} = \frac{\text{IoU}_1 + \text{IoU}_2 + \text{IoU}_3}{3} = \frac{0.8247 + 0.7407 + 0.6944}{3} = \frac{2.2598}{3} \approx 0.7533 \quad (75.33\%)$$

---

### Problem 11.7: 3D Object Centroid from Bounding Box and Depth Map
**Statement:** A robot camera ($f_x = f_y = 1000, c_x = 500, c_y = 500$) detects a recycling bin. The 2D bounding box center is at $(u_c, v_c) = (650, 700)$.
The average depth of the segmented pixels within this box from an onboard LiDAR depth map is $Z = 3.0\text{ meters}$.
Compute the 3D metric coordinate $(X, Y, Z)$ of the bin's center in meters.

**Step-by-step Solution:**
1. Back-projection formulas:
   $$X = \frac{(u_c - c_x) Z}{f_x} = \frac{(650 - 500) \times 3.0}{1000} = \frac{150 \times 3.0}{1000} = \frac{450}{1000} = +0.45\text{ meters}$$
   $$Y = \frac{(v_c - c_y) Z}{f_y} = \frac{(700 - 500) \times 3.0}{1000} = \frac{200 \times 3.0}{1000} = \frac{600}{1000} = +0.60\text{ meters}$$
   $$Z = 3.0\text{ meters}$$
2. The 3D position is $\mathbf{X}_c = [0.45, 0.60, 3.0]^\top$ meters.

---

### Problem 11.8: Coordinate Conversion: xywh to xyxy
**Statement:** An anchor-based detector outputs bounding box center coordinates $[x_c, y_c, w, h] = [320, 240, 100, 60]$.
Convert this box into $[x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}]$ corner format.

**Step-by-step Solution:**
1. Compute half-widths:
   $$\frac{w}{2} = \frac{100}{2} = 50, \quad \frac{h}{2} = \frac{60}{2} = 30$$
2. Compute corners:
   $$x_{\text{min}} = x_c - \frac{w}{2} = 320 - 50 = 270$$
   $$y_{\text{min}} = y_c - \frac{h}{2} = 240 - 30 = 210$$
   $$x_{\text{max}} = x_c + \frac{w}{2} = 320 + 50 = 370$$
   $$y_{\text{max}} = y_c + \frac{h}{2} = 240 + 30 = 270$$
3. Assembled format:
   $$[x_{\text{min}}, y_{\text{min}}, x_{\text{max}}, y_{\text{max}}] = [270, 210, 370, 270]$$

---

### Problem 11.9: Anchor Box Parameterization Delta Inversion
**Statement:** In Faster R-CNN, bounding box predictions are parameterized relative to an anchor box $\mathbf{a} = [x_a, y_a, w_a, h_a]$ via coordinate deltas $(t_x, t_y, t_w, t_h)$:
$$x = w_a t_x + x_a, \quad y = h_a t_y + y_a, \quad w = w_a \exp(t_w), \quad h = h_a \exp(t_h)$$
Given anchor box $\mathbf{a} = [200, 150, 80, 80]$ and predicted deltas $(t_x, t_y, t_w, t_h) = [0.1, -0.2, \ln(1.5), \ln(0.8)]$:
Compute the refined bounding box $[x, y, w, h]$.

**Step-by-step Solution:**
1. Refined Center:
   $$x = w_a t_x + x_a = 80(0.1) + 200 = 8 + 200 = 208.0$$
   $$y = h_a t_y + y_a = 80(-0.2) + 150 = -16 + 150 = 134.0$$
2. Refined Dimensions:
   $$w = w_a \exp(\ln(1.5)) = 80 \times 1.5 = 120.0$$
   $$h = h_a \exp(\ln(0.8)) = 80 \times 0.8 = 64.0$$
3. Assembled refined box:
   $$[x, y, w, h] = [208.0, 134.0, 120.0, 64.0]$$

---

### Problem 11.10: Complete IoU (CIoU) Aspect Ratio Penalty
**Statement:** Complete IoU (CIoU) adds an aspect ratio consistency term $\alpha v$ to Distance-IoU:
$$v = \frac{4}{\pi^2} \left( \arctan\left(\frac{w_{\text{gt}}}{h_{\text{gt}}}\right) - \arctan\left(\frac{w}{h}\right) \right)^2$$
For a square ground-truth box ($w_{\text{gt}} = 100, h_{\text{gt}} = 100$) and predicted rectangular box ($w = 100, h = 50$), compute the value of $v$.

**Step-by-step Solution:**
1. Ground truth aspect ratio angle:
   $$\frac{w_{\text{gt}}}{h_{\text{gt}}} = \frac{100}{100} = 1.0 \implies \arctan(1.0) = \frac{\pi}{4} \approx 0.785398$$
2. Predicted aspect ratio angle:
   $$\frac{w}{h} = \frac{100}{50} = 2.0 \implies \arctan(2.0) \approx 1.107149$$
3. Difference:
   $$\arctan(1.0) - \arctan(2.0) = 0.785398 - 1.107149 = -0.321751$$
4. Squared difference:
   $$(-0.321751)^2 \approx 0.103524$$
5. Multiply by $\frac{4}{\pi^2}$:
   $$\frac{4}{\pi^2} \approx \frac{4}{9.8696} \approx 0.405285$$
   $$v = 0.405285 \times 0.103524 \approx 0.041956$$
   This aspect ratio penalty directly penalizes the distortion between square and rectangular geometries.

---

## 11.8 Solved Exercises

### Exercise 11.1: Upper and Lower Bounds of Generalized IoU
**Statement:** Prove that for any two 2D bounding boxes $A$ and $B$, the Generalized IoU metric satisfies:
$$-1 \le \text{GIoU}(A, B) \le 1$$

**Solution:**
1. Recall the definition:
   $$\text{GIoU} = \text{IoU} - \frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)}$$
   where $C$ is the smallest convex enclosing box containing both $A$ and $B$.
2. **Upper Bound:**
   Because areas are non-negative, $\text{Area}(C \setminus (A \cup B)) \ge 0$, and $\text{Area}(C) > 0$.
   Therefore, the penalty term $\frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)} \ge 0$.
   Since $\text{IoU}(A, B) \le 1$:
   $$\text{GIoU}(A, B) \le \text{IoU}(A, B) \le 1$$
   Equality $\text{GIoU} = 1$ is attained if and only if $A = B$ (perfect overlap).
3. **Lower Bound:**
   Since $A \cup B \subseteq C$, $\text{Area}(A \cup B) \le \text{Area}(C)$, so:
   $$\frac{\text{Area}(C \setminus (A \cup B))}{\text{Area}(C)} = 1 - \frac{\text{Area}(A \cup B)}{\text{Area}(C)} \le 1$$
   Since $\text{IoU}(A, B) \ge 0$:
   $$\text{GIoU}(A, B) \ge 0 - 1 = -1$$
   The lower bound $\text{GIoU} \to -1$ is approached in the limit as the distance between $A$ and $B$ approaches infinity relative to their sizes ($\text{Area}(C) \to \infty$ while $\text{Area}(A \cup B)$ remains finite).
   Therefore, $\text{GIoU} \in [-1, 1]$. $\blacksquare$

---

### Exercise 11.2: RoI Align vs. RoI Pooling Quantization
**Statement:** Explain why Fast R-CNN's RoI Pooling introduces spatial quantization misalignment ("harsh quantization"), and prove how Mask R-CNN's RoI Align eliminates this using bilinear sampling.

**Solution:**
1. **RoI Pooling Flaw:**
   - A candidate proposal of size $150 \times 150$ on an image with a feature stride of 16 maps to a float size of $\frac{150}{16} = 9.375$ on the feature map.
   - RoI Pooling applies integer rounding: $\lfloor 9.375 \rfloor = 9$.
   - When dividing this $9 \times 9$ region into a $7 \times 7$ output bin grid, bin sizes are $\frac{9}{7} \approx 1.285$, which is rounded again to $1$ or $2$ pixels.
   - These two rounding steps induce up to a 1-pixel shift on the feature map, which translates to a massive **$16$-pixel physical misalignment** on the original image, corrupting sub-pixel mask segmentation.
2. **RoI Align Solution:**
   - RoI Align avoids any rounding: the proposal boundary remains exact floating-point values ($9.375$).
   - Each $7 \times 7$ bin is partitioned into regular continuous sub-cells (e.g., 4 sampling points).
   - The feature values at these continuous sampling coordinates are evaluated strictly via **bilinear interpolation** from the four surrounding discrete feature pixels.
   - Zero quantization occurs, preserving exact spatial alignment. $\blacksquare$

---

### Exercise 11.3: Average Precision (AP) and Area Under PR Curve
**Statement:** Define the Precision-Recall (PR) curve, and show how the **11-point interpolated Average Precision (AP)** is calculated from the PR curve.

**Solution:**
1. For an object class $k$, sort all candidate predictions by confidence score.
2. At each rank threshold, compute:
   $$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}, \quad \text{Recall} = \frac{\text{TP}}{\text{Total Ground Truth}}$$
3. Plotting Precision versus Recall yields the PR curve $p(r)$.
4. The 11-point interpolated AP evaluates precision at 11 evenly spaced recall levels $r \in \{0.0, 0.1, 0.2, \dots, 1.0\}$:
   $$\text{AP}_{11} = \frac{1}{11} \sum_{r \in \{0, 0.1, \dots, 1.0\}} p_{\text{interp}}(r)$$
   where the interpolated precision $p_{\text{interp}}(r)$ is the maximum precision attained for any recall $r' \ge r$:
   $$p_{\text{interp}}(r) = \max_{r' \ge r} p(r')$$
   This reduces sensitivity to noise ripples in the ranking. $\blacksquare$

---

### Exercise 11.4: Cross-Entropy Loss with Label Smoothing
**Statement:** In modern segmentation networks, label smoothing replaces hard one-hot targets $y_k \in \{0, 1\}$ with smoothed targets $y_k^{\text{smooth}} = (1 - \epsilon) y_k + \frac{\epsilon}{K}$.
State the regularization benefit of label smoothing.

**Solution:**
1. Under hard one-hot targets, standard Cross-Entropy loss drives the pre-softmax logit $z_k \to +\infty$ and all non-target logits $z_j \to -\infty$ to achieve predicted probability $p_k = 1.0$.
2. This forces network weights to grow excessively large, causing overconfident predictions and poor calibration.
3. Label smoothing enforces an upper bound on target logit separation:
   $$z_k^* - z_j^* = \ln\left(\frac{1 - \epsilon + \epsilon/K}{\epsilon/K}\right) = \text{constant}$$
4. The network is penalized for becoming overconfident, improving generalization on ambiguous boundaries and noisy human annotations. $\blacksquare$

---

### Exercise 11.5: Dice Loss Gradient Derivation
**Statement:** Derive the analytical gradient of the Soft Dice Loss $\mathcal{L}_{\text{Dice}} = 1 - \frac{2 \sum p_i g_i + \epsilon}{\sum p_i^2 + \sum g_i^2 + \epsilon}$ with respect to predicted probability $p_j$.

**Solution:**
1. Let $U = 2 \sum p_i g_i + \epsilon$ and $V = \sum p_i^2 + \sum g_i^2 + \epsilon$.
   Then $\mathcal{L}_{\text{Dice}} = 1 - \frac{U}{V}$.
2. Differentiating with respect to $p_j$ using the quotient rule:
   $$\frac{\partial \mathcal{L}_{\text{Dice}}}{\partial p_j} = - \frac{\frac{\partial U}{\partial p_j} V - U \frac{\partial V}{\partial p_j}}{V^2}$$
3. Compute the partial derivatives:
   $$\frac{\partial U}{\partial p_j} = 2 g_j, \quad \frac{\partial V}{\partial p_j} = 2 p_j$$
4. Substitute into the quotient rule:
   $$\frac{\partial \mathcal{L}_{\text{Dice}}}{\partial p_j} = - \frac{2 g_j V - 2 p_j U}{V^2} = -2 \frac{g_j V - p_j U}{V^2} = 2 \left( \frac{p_j U - g_j V}{V^2} \right) \quad \blacksquare$$

---

### Exercise 11.6: Feature Pyramid Networks (FPN) Top-Down Architecture
**Statement:** Tsung-Yi Lin et al. (2017) introduced **Feature Pyramid Networks (FPN)**. Explain why bottom-up convolutional pyramids alone struggle with small objects, and how FPN's top-down pathway and lateral connections solve this.

**Solution:**
1. In a bottom-up CNN (ResNet), early high-resolution layers have small receptive fields and weak semantic features (edges, corners). Deep layers have rich semantic features but coarse spatial resolution (e.g., $32\times$ downsampled), completely losing tiny objects.
2. **FPN Architecture:**
   - **Top-Down Pathway:** Upsamples semantically strong deep features by $2\times$ nearest-neighbor interpolation.
   - **Lateral Connections:** Merges bottom-up features of the same spatial scale via a $1 \times 1$ convolution and element-wise addition.
3. This creates a multi-scale feature pyramid where **every single scale possesses both high spatial resolution and deep semantic strength**, allowing tiny objects to be detected on high-resolution layers with deep semantic context. $\blacksquare$

---

### Exercise 11.7: Class-Agnostic vs. Class-Specific Box Regression
**Statement:** Compare class-agnostic bounding box regression ($4$ output values per anchor) versus class-specific regression ($4 \times K$ output values per anchor).

**Solution:**
1. **Class-Specific Regression:**
   - The head outputs $4 \times K$ coordinates, maintaining an independent set of bounding box regression parameters for every object class $k \in \{1, \dots, K\}$.
   - *Advantage:* Can learn specialized shape adjustments tailored to specific aspect ratios (e.g., long horizontal buses vs tall vertical pedestrians).
   - *Disadvantage:* Linear increase in parameters with number of classes.
2. **Class-Agnostic Regression:**
   - The head outputs strictly $4$ coordinates $(t_x, t_y, t_w, t_h)$ shared across all classes.
   - *Advantage:* Parameter count is completely independent of $K$, preventing overfitting on classes with sparse training data. Used universally in modern high-speed detectors (YOLOv8, RetinaNet). $\blacksquare$

---

### Exercise 11.8: Hungarian Matching Algorithm in DETR
**Statement:** Nicolas Carion et al. (2020) introduced **DETR (DEtection TRansformer)**, eliminating anchors and NMS using the **Hungarian Algorithm**. Explain how bipartite matching enables set prediction.

**Solution:**
1. DETR queries a fixed set of $N = 100$ object slots through a Transformer decoder.
2. Let $y = \{y_1, \dots, y_M, \emptyset, \dots, \emptyset\}$ be the ground truth padded with empty "no-object" tokens to size $N$.
3. DETR finds an optimal **bipartite permutation** $\hat{\sigma} \in \mathfrak{S}_N$ that minimizes the global matching cost:
   $$\hat{\sigma} = \arg\min_{\sigma \in \mathfrak{S}_N} \sum_{i=1}^N \mathcal{L}_{\text{match}}(y_i, \hat{y}_{\sigma(i)})$$
   where $\mathcal{L}_{\text{match}}$ accounts for both classification probability and box IoU distance.
4. The global minimum is computed in polynomial time $\mathcal{O}(N^3)$ via the combinatorial **Hungarian algorithm**.
5. Because every ground-truth object is assigned to **exactly one unique prediction slot**, duplicate candidate boxes never occur, rendering Non-Maximum Suppression entirely obsolete! $\blacksquare$

---

### Exercise 11.9: PointNet Architecture for 3D Frustum Point Clouds
**Statement:** Charles Qi et al. (2017) introduced PointNet for processing raw unordered 3D point sets $\{ \mathbf{p}_1, \dots, \mathbf{p}_N \} \subset \mathbb{R}^3$. Explain how PointNet enforces permutation invariance.

**Solution:**
1. A point cloud is an unordered set: shuffling the indices of the $N$ points must not change the predicted 3D bounding box or classification label.
2. PointNet maps each 3D point $\mathbf{p}_i = [x_i, y_i, z_i]^\top$ into a high-dimensional feature space $\mathbb{R}^D$ ($D = 1024$) using shared Multi-Layer Perceptrons (MLPs):
   $$\mathbf{h}_i = \text{MLP}(\mathbf{p}_i)$$
3. To achieve mathematical permutation invariance, PointNet applies a **symmetric pooling function** across all $N$ point feature vectors:
   $$\mathbf{g} = \max_{i=1, \dots, N} \{ \mathbf{h}_i \} \quad (\text{Channel-wise Max Pooling})$$
4. Because the maximum operation is commutative and associative ($\max(a, b) = \max(b, a)$), the global signature $\mathbf{g}$ is strictly invariant to input point order. $\blacksquare$

---

### Exercise 11.10: Latency-Accuracy Pareto Frontier in Robotics
**Statement:** In an autonomous racecar traveling at $V = 50\text{ m/s}$ ($180\text{ km/h}$), a detector with $95\%$ mAP has an inference latency of $100\text{ ms}$ (10 FPS), while a lightweight detector with $88\%$ mAP has an inference latency of $10\text{ ms}$ (100 FPS).
Calculate the physical vehicle travel distance during perception latency and justify which model is safer.

**Solution:**
1. **Perception Reaction Distance:**
   $$d_{\text{travel}} = V \cdot \tau_{\text{latency}}$$
   - **Heavy Detector ($\tau = 100\text{ ms} = 0.10\text{ s}$):**
     $$d_{\text{travel}} = 50\text{ m/s} \times 0.10\text{ s} = 5.0\text{ meters}$$
     The vehicle travels $5.0\text{ meters}$ completely blind before the perception system finishes computing a single bounding box!
   - **Lightweight Detector ($\tau = 10\text{ ms} = 0.01\text{ s}$):**
     $$d_{\text{travel}} = 50\text{ m/s} \times 0.01\text{ s} = 0.5\text{ meters}$$
     The vehicle travels only $50\text{ centimeters}$ during perception.
2. **Safety Justification:**
   In high-speed physical robotics, an extra $4.5\text{ meters}$ of latency distance exceeds typical emergency braking margins. The $10\text{ ms}$ lightweight detector is substantially safer because low latency is required for high-bandwidth feedback control loops. $\blacksquare$
