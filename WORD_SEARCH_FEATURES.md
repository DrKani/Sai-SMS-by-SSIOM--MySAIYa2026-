# Word Search: Features & Gamification

## 1. Game Modes
The platform offers two distinct play styles controlled via the header toggles.

### Quick Mode (Default)
**Philosophy**: Designed for learning and casual play.
**Features**:
- **Hints**: Players can reveal specific letters or entire words.
- **Visual Guides**: Interactive feedback is fully enabled.
- **Gamification**: While easier, it incurs Time Penalties for using assistance, balancing the difficulty for scoring.

### Challenge Mode
**Philosophy**: Designed for mastery and competitive ranking.
**Features**:
- **No Hints**: The Hint buttons in the toolbar are visually dimmed (opacity: 0.3) and unclickable (pointer-events: none).
- **Pure Skill**: Users must rely entirely on observation.
- **Visuals**: A tooltip on hover explicitly states: "No Hints • No Guides • Pure Skill".

---

## 2. Timer & Scoring Logic
The scoring system is a Time-Attack model with penalty logic to discourage spamming hints.

### The Timer
- **State**: Starts at 00:00 upon clicking the "Start" overlay.
- **Tracking**: It tracks `elapsedTime` (actual seconds passed) + `penaltyTime` (added by hints).
- **Pause Functionality**: Users can pause the game, which blurs the grid to prevent cheating while the timer stops.

### Scoring Algorithm
The final "Sai Score" is calculated using a subtraction formula derived from a base score.
- **Base Score**: 1000 Points.
- **Deduction**: -1 Point for every second of Total Time (Elapsed + Penalty).
- **Floor**: The score cannot drop below 100 points (to ensure a sense of completion reward).

**Formula**: 
`Math.max(100, 1000 - (elapsedTime + penaltyTime))`

**Quick Mode Scoring**:
Score = 1000 - (Actual Time + Penalty Time)

**Challenge Mode Scoring**:
Score = 1000 - Actual Time
*(Since hints are disabled, penalty time is always 0)*

---

## 3. Easy Mode (Architecture)
A toggle switch in the header modifies the complexity of the puzzle generation algorithm.

- **Logic**: It alters the directions array passed to the grid generator.
- **Easy ON**: Words are placed only **Horizontally** (Left-to-Right) and **Vertically** (Top-to-Bottom).
- **Easy OFF (Normal)**: Words can be placed in 8 directions, including diagonals and reverse orientations (Right-to-Left, Bottom-to-Top).
- **Snapping**: The input mechanic adjusts to this setting; in Easy mode, diagonal dragging is physically disabled/ignored by the selection logic.

---

## 4. Settings & Input Configuration
Located under the "Cog" icon, the settings menu manages accessibility regarding input styles.

### Input Method Toggle
- **Drag (Default)**: The standard word search interaction. Press/touch a letter and slide to the end.
- **Tap**: An accessibility-friendly mode. Tap the **Start Letter** (it highlights), then tap the **End Letter** to form the connection. This is useful for users who find holding a drag gesture difficult.

---

## 5. Onboarding (Interactive Tutorial)
A step-by-step "Walkthrough" overlay guides new users before they start playing.

- **Mechanism**: It uses a `steps` array to define a tour.
- **Spotlight Effect**: It adds a `.tutorial-highlight` class to specific DOM elements (Header, Grid, List, Toolbar) to bring them to the foreground (`z-index: 2001`) while darkening the rest of the screen.
- **Dynamic Positioning**: The tutorial box calculates its position (`getBoundingClientRect`) relative to the highlighted element to ensure it never overlaps the item it is explaining, regardless of screen size.

---

## 6. Interaction Mechanics
The core gameplay relies on a robust pointer-event system that unifies Mouse and Touch interactions.

### Smart Snapping (Anti-Frustration)
To prevent "wobbly" selections where a user accidentally selects the wrong diagonal:
1. **Vector Calculation**: The code calculates the difference between the start cell and the current finger position (`dr`, `dc`).
2. **Thresholding**:
   - If the movement is mostly horizontal (one axis is > 2.5x larger than the other), it forces the selection to be **perfectly horizontal**.
   - It only allows a diagonal selection if the user's movement is mathematically close to a 45-degree angle.
3. **Visuals**: The selection is rendered as a continuous block (`drawSel` function) rather than individual highlighted cells, providing a "highlighter pen" feel.

### Word Lists
- **Cockpit Layout**: On desktop, words are split into Left and Right sidebars to keep the grid central.
- **Dynamic Reveal**: The lists appear as "Locked" (blurred placeholders) until the game starts, preventing users from pre-reading the words before the timer begins.
- **Strike-through**: Finding a word triggers a `popIn` animation on the grid and grays out/strikes through the word in the sidebar list.
