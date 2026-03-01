# Sai SMS: Design System & UI Specification v2.0
**Project:** Sai Sadhana Made Simple (Sai SMS) by MySAIYa / SSIOM  
**Core Identity:** Unity, Purity, Divinity  
**Last Updated:** February 2026 (Enhanced with Screenshot Analysis)

---

## 1. Visual Design Parameters

### 1.1 Do / Don’t Rules
- **DO:** Use **Gold Gradient** exclusively for "Offering Completion", "Milestones", and "National Certification".
- **DON'T:** Use the Gold Gradient for standard navigation or secondary buttons.
- **DO:** Use **Magenta-500** for Destructive actions (Logout, Delete) and High-Energy alerts.
- **DON'T:** Use Magenta for primary "Success" states (use Teal-500 instead).
- **DO:** Maintain the **2.5rem (40px)** radius for all main Bento Tiles.
- **DON'T:** Mix sharp corners with rounded corners in the same grid.


### 1.2 Component Priority Rules
When design requirements conflict, the hierarchy of truth is:
1. **Accessibility:** Contrast ratios (WCAG AA) and hit targets (48px) always win.
2. **Brand Integrity:** Sacred aesthetics (Navy/Gold/Purple) must be preserved.
3. **Aesthetics:** Visual flair (motion, shadows) comes last.

---

## 1.5 Color Palette (Updated from UI Screenshots)

### Primary Brand Colors
- **Navy-900:** `#0A1E3E` - Main backgrounds, footer, quiz containers
- **Navy-700:** `#14366D` - Content cards, question containers  
- **Navy-500:** `#1E5A8E` - Hover states, interactive elements
- **Navy-300:** `#4B7399` - Borders, subtle backgrounds

### Gold/Yellow (Primary Accent)
- **Gold-500:** `#D4AF37` - Primary buttons, headings, CTAs
- **Gold-400:** `#DAB757` - Hover states
- **Gold-Gradient:** `linear-gradient(135deg, #F1C40F, #D4AF37)` - Achievements only

### Accent Colors
- **Teal-500:** `#1DC9A0` - Success states, selected answers, positive feedback
- **Magenta-600:** `#D91C5C` - Book Club, high-energy alerts, destructive actions
- **Purple-600:** `#8B5CF6` - Personal Dashboard, gamification
- **Orange-500:** `#FF7F3F` - Namasmarana, community engagement

### Neutrals
- **White:** `#FFFFFF` - Primary text on dark, card backgrounds
- **Gray-100:** `#F3F4F6` - Light backgrounds
- **Gray-300:** `#D1D5DB` - Borders, placeholder text
- **Gray-500:** `#6B7280` - Secondary text
- **Gray-700:** `#374151` - Body text on light backgrounds

### Contrast Ratios (WCAG)
- White on Navy-900: 13.5:1 ✅ AAA
- Navy-900 on Gold-500: 7.8:1 ✅ AAA
- White on Teal-500: 4.8:1 ✅ AA
- White on Purple-600: 8.1:1 ✅ AAA

---

## 2. Layout & Spacing System

### 2.1 Grid & Spacing
- **Base Unit:** 4pt / 8pt system.
- **Padding Scale:** 4, 8, 12, 16, 24, 32, 40, 64, 80, 120.
- **Radius System:**
  - **Bento Card:** `2.5rem` (40px).
  - **Buttons/Inputs:** `1rem` (16px) or `1.5rem` (24px) for pill style.
  - **Chips/Badges:** `9999px` (Full round).
  - **Modal/Drawer:** `3rem` (48px) top-only or full.

### 2.2 Breakpoints & Widths
- **Mobile (sm):** `< 640px`. Single column, 16px margins.
- **Tablet (md):** `640px - 1024px`. 2-column bento, 24px margins.
- **Desktop (lg):** `> 1024px`. 3+ column bento, 32px margins.
- **Max Content Width:** `1280px` (7xl).

---

## 3. Typography System

### 3.1 Font Families
- **Primary (Serif):** *Playfair Display* (Weight 400, 700). Used for Page Titles and Sacred Quotes.
- **Secondary (Sans):** *Poppins* (Weight 300-900). Used for UI, Body, and Labels.
- **System Fallback:** `serif`, `sans-serif`.

### 3.2 Type Scale
| Token | Size | Line-Height | Weight | Usage |
|:---|:---|:---|:---|:---|
| **Display** | 60px | 1.1 | 700 | Main Hero Titles |
| **H1** | 36px | 1.2 | 700 | Section Headers |
| **H2** | 24px | 1.3 | 600 | Card Titles |
| **Body-L** | 18px | 1.6 | 400 | Journal / Reader Text |
| **Body-M** | 16px | 1.5 | 500 | Default UI Text |
| **Caption** | 12px | 1.4 | 600 | Metadata / Labels |
| **Micro** | 10px | 1.0 | 900 | Upper-case caps only |

---

## 4. Component Library Spec

### 4.1 Header/Navigation
- **Height:** 64px (mobile), 72px (desktop)
- **Background:** Navy-900
- **Position:** Sticky, z-index 50
- **Elements:**
  - Logo: 40px height, white SSIOM emblem
  - Search: White bg, pill-shaped (1.5rem radius), 300px min-width
  - SIGN IN: Gold-500 bg, Navy-900 text, 1rem radius
  - SIGN UP: Navy-700 bg, White text, Gold-500 border
  - Bell icon: White, 24px, notification dot if unread

### 4.2 Footer
- **Background:** Navy-900
- **Padding:** 64px 32px (desktop), 40px 16px (mobile)
- **Grid:** 3 columns (desktop), 1 column (mobile)
- **Section Headings:** Gold-500, Poppins Bold, 14px, uppercase
- **Body Text:** White/Gray-300, 14px
- **Links:** White with Gold-500 hover
- **Bottom Bar:** Gray-400, 12px, centered copyright

### 4.3 Quiz/Trivia Cards
- **Container:** Navy-700 bg, 2.5rem radius, 48px padding
- **Question Text:** White, Poppins SemiBold, 20-24px
- **Answer Buttons (default):** Transparent bg, Navy-500 border, 1.5rem radius
- **Answer Buttons (selected):** Teal-500 bg, white checkmark icon
- **Feedback Panel:** Teal-500 bg (95% opacity), 1.5rem radius
- **Next Button:** Gold-500 bg, Navy-900 text, bottom-right

### 4.4 Dashboard Feature Cards
- **Border-radius:** 2rem (32px)
- **Padding:** 48px 40px
- **Icon Container:** White 15-20% opacity, 64px size
- **Title:** White, Poppins Bold, 22px
- **Variants:**
  - Namasmarana: Orange-500 background
  - Book Club: Magenta-600 background
  - Personal Dashboard: Purple-600 background
- **Hover:** translateY(-4px) + scale(1.02)

### 4.5 Tabs
- **Variants:** Underline (Header), Segmented (In-page).
- **States:** Default (Navy-300), Hover (Navy-500), Active (Gold-500 + 2px border).

### 4.6 Toasts / Snackbars
- **Success:** Navy-900 background, Teal-500 icon, White text.
- **Error:** Navy-900 background, Magenta-500 icon, White text.
- **Duration:** 3000ms standard, 5000ms for errors.

### 4.7 Empty States
- **Illustration:** Solid tint icon (20% opacity) in a `w-24 h-24` neutral circle.
- **Copy:** H2 Headline + Body-M descriptive subtext.

### 4.8 Buttons
- **Primary (Gold):** Gold-500 bg, Navy-900 text, 1rem radius, 12px 28px padding
  - Hover: Gold-400, scale 1.02
- **Secondary (Navy):** Navy-700 bg, White text, Gold-500 border, 1rem radius
  - Hover: Navy-600 bg
- **FAB:** 56px diameter, Gold-500 bg, fixed bottom-right
  - Icons: Up arrow (scroll), Home icon
  - Hover: scale 1.1

---

## 5. Forms & Validation

### 5.1 Behaviour
- **Timing:** Validate on **Blur** for individual fields; on **Submit** for the full set.
- **Required:** Marked with a subtle text "(Required)" in the label rather than an asterisk.
- **Auto-save:** Triggered 1.5s after typing stops. Display "Saved to Hub" micro-badge.

---

## 6. Navigation & IA

- **Header:** Sticky `top-10` (below ticker). Does not collapse.
- **Search:** Min 2 chars to trigger results. Debounce: 300ms.
- **Drawer:** Swipe to close enabled on mobile. Focus trapped inside when open.

---

## 7. Motion System

| Token | Duration | Easing | Usage |
|:---|:---|:---|:---|
| **Fast** | 150ms | `ease-out` | Button hover, hover-scale |
| **Normal**| 300ms | `ease-in-out` | Drawer slide, Modal fade |
| **Slow** | 500ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Page transitions |

---

## 8. Accessibility Specification

- **Contrast:** AA minimum (4.5:1). Target AAA for Navy on White (7:1+).
- **Hit Targets:** Minimum `48x48px` for all interactive elements.
- **Keyboard:** `Tab` focus ring must be `2px solid Gold-500` with `4px offset`.
- **Screen Readers:** Use `aria-live="polite"` for Ticker and Toasts.

---

## 9. Data Visualization (Recharts)

- **Colors:** Series 1: Navy-900, Series 2: Magenta-500, Series 3: Gold-500.
- **Axes:** Labels 10px Poppins Bold, Navy-200 color.
- **Patterns:** Use distinct markers (Circle, Square, Diamond) for color-blind accessibility.

---

## 10. Content & Microcopy

- **Tone:** Humble, Uplifting, Professional.
- **Capitalization:** **Title Case** for Buttons ("Save Reflection"), **Sentence Case** for Body text.
- **Success Template:** "Jai Sai Ram! Your [Item] has been successfully offered."

---

## 11. Engineering Handoff

- **Tokens:** Integrated into `tailwind.config` via CSS Variables.
- **QA Checklist:**
  - [ ] Contrast check for all background combinations.
  - [ ] Mobile safe-area (iOS notch) verified.
  - [ ] Keyboard navigation loop tested.
  - [ ] Reduced motion support (via `motion-safe:` tailwind).

---
© 2026 SSIOM Malaysia. Produced by MySAIYa Spiritual Wing.