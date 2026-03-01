# Sai SMS by SSIOM: Visual Style Guide

**Purpose:** Quick visual reference for maintaining design consistency  
**Source:** UI Screenshots (February 2026)  
**Companion docs:** COLOR_PALETTE.md, COMPONENT_SPECIFICATIONS.md, DESIGN_SYSTEM.md

---

## 🎨 At-a-Glance Color Usage

### Primary Patterns

**Navy + Gold = Brand Foundation**
- Navy backgrounds with Gold accents is the core aesthetic
- Most interfaces use Navy-900 as base with Gold-500 for primary CTAs
- This combination represents tradition, divinity, and trust

**Accent Colors = Functional Categories**
- 🟠 **Orange:** Community engagement (Namasmarana)
- 🟣 **Purple:** Personal growth (Dashboard)
- 💗 **Magenta:** Learning & community (Book Club)
- 🟢 **Teal:** Success, correct answers, positive feedback

---

## 📐 Layout Patterns from Screenshots

### Header Structure
```
┌─────────────────────────────────────────────────────┐
│ [UPDATES BANNER - Gradient Navy→Purple]            │
├─────────────────────────────────────────────────────┤
│ [Logo] [Search........] [🔔] [SIGN IN] [SIGN UP] [≡]│
│  Navy-900 background, 64-72px height                │
└─────────────────────────────────────────────────────┘
```

### Homepage Card Layout
```
┌──────────────────────────────────────┐
│  Welcome Message Card                 │
│  Navy-700 bg, Gold border, centered  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  Active Study Chapter                 │
│  Split: Gold 40% | Navy-700 60%      │
└──────────────────────────────────────┘

┌──────────┬──────────┬──────────┐
│ Orange   │ Magenta  │ Purple   │
│ Namas... │ Book Club│ Dashboard│
└──────────┴──────────┴──────────┘
```

### Footer Structure
```
┌─────────────────────────────────────────┐
│  [Logo+Desc]  [Contact]  [Quick Links]  │
│              Navy-900 background         │
│  Gold headings, White body text         │
├─────────────────────────────────────────┤
│     © 2026 SSIOM MALAYSIA (centered)    │
└─────────────────────────────────────────┘
```

---

## 🎯 Component Style Matrix

| Component | Background | Text | Border | Radius |
|:----------|:-----------|:-----|:-------|:-------|
| **Header** | Navy-900 | White | None | 0 |
| **Primary Button** | Gold-500 | Navy-900 | None | 1rem |
| **Secondary Button** | Navy-700 | White | 2px Gold | 1rem |
| **Quiz Container** | Navy-700 | White | None | 2.5rem |
| **Answer (default)** | Transparent | White | 2px Navy-500 | 1.5rem |
| **Answer (selected)** | Teal-500 | White | None | 1.5rem |
| **Dashboard Card** | Orange/Magenta/Purple | White | None | 2rem |
| **Footer** | Navy-900 | White/Gold | None | 0 |
| **Modal** | White | Navy-900 | None | 1.5rem |
| **Input Field** | White | Navy-900 | 2px Gray | 0.75rem |
| **FAB** | Gold-500 | Navy-900 | None | 50% |

---

## 🔤 Typography Hierarchy in Practice

### From Screenshots

**Page Titles:**
- "Sai SMS by SSIOM"
- Font: Playfair Display Bold
- Size: 28-36px
- Color: Gold-500

**Section Headings:**
- "CONTACT SSIOM", "QUICK LINKS"  
- Font: Poppins Bold
- Size: 14px
- Style: UPPERCASE
- Color: Gold-500

**Body Text:**
- Mission description, quiz questions
- Font: Poppins Medium/Regular
- Size: 14-16px
- Color: White (on dark) or Navy-900 (on light)
- Line-height: 1.5-1.7

**Quiz Questions:**
- Font: Poppins SemiBold
- Size: 20-24px
- Color: White
- Line-height: 1.4

**Microcopy:**
- "QUESTION 1 OF 10", "WEEK W92"
- Font: Poppins Bold
- Size: 10-12px
- Style: UPPERCASE
- Color: Gold-500 or White with low opacity

---

## 🎭 Interactive States

### Button Hover Patterns

**Gold Primary Button:**
1. Default: Gold-500 background
2. Hover: Gold-400 + scale(1.02)
3. Active: Gold-600 + scale(0.98)
4. Focus: 2px Gold-500 outline, 4px offset

**Navy Secondary Button:**
1. Default: Navy-700 background, Gold border
2. Hover: Navy-600 background
3. Active: Navy-800
4. Focus: 2px Gold outline

### Card Hover States
- Transform: translateY(-4px) + scale(1.02)
- Shadow: Increase elevation
- Transition: 300ms ease-in-out

### Quiz Answer Selection
1. **Default:** Navy-500 border, transparent background
2. **Hover:** White border, Navy-600 subtle background
3. **Selected:** Teal-500 solid background, white checkmark appears
4. **Correct (feedback):** Remains Teal, shows explanation box below
5. **Incorrect (if shown):** Magenta-600 background, X icon

---

## 📱 Responsive Behavior

### Mobile Adaptations (< 640px)
- Header: Collapse to hamburger menu
- Search: Full width, moves to drawer
- Cards: Single column stack
- Footer: Single column, items stack
- Padding: Reduce to 16px
- Font sizes: Reduce by 10-15%

### Tablet (640px - 1024px)
- Header: Keep horizontal but compact
- Cards: 2-column grid
- Footer: 2 columns, Quick Links below
- Padding: 24px

### Desktop (> 1024px)
- Full layout as shown in screenshots
- 3-column grid for dashboard cards
- Footer: 3 columns side-by-side
- Max-width: 1280px, centered
- Padding: 32-40px

---

## 🌈 Color Combinations (Approved Pairings)

### High Contrast (WCAG AAA)
✅ White text on Navy-900: 13.5:1  
✅ Navy-900 text on Gold-500: 7.8:1  
✅ White text on Purple-600: 8.1:1

### Medium Contrast (WCAG AA)
✅ White text on Teal-500: 4.8:1  
✅ White text on Orange-500: 4.9:1

### Avoid These Combinations
❌ Navy-900 text on Navy-700 (insufficient contrast)  
❌ Gold-500 text on White (poor readability)  
❌ Teal-500 and Orange-500 adjacent (color clash)

---

## 🎨 Gradient Usage

### Updates Banner Gradient
```css
background: linear-gradient(90deg, 
  #1B4568 0%,    /* Navy-700 */
  #4A1E6B 100%   /* Purple-900 */
);
```

### Gold Achievement Gradient (Reserved for Milestones)
```css
background: linear-gradient(135deg,
  #F1C40F 0%,    /* Bright Gold */
  #D4AF37 100%   /* Royal Gold */
);
```

**Usage Rules:**
- Banner gradient: Always present on update ticker
- Gold gradient: ONLY for completion badges, milestones, certificates
- Do not create custom gradients outside these two

---

## 🔲 Spacing Scale Quick Reference

Based on 4pt/8pt system:

| Token | Value | Common Usage |
|:------|:------|:-------------|
| **xs** | 4px | Icon margins, tight spacing |
| **sm** | 8px | Element gaps within components |
| **md** | 12px | Input padding, small gaps |
| **lg** | 16px | Default padding, mobile margins |
| **xl** | 24px | Section spacing, card padding start |
| **2xl** | 32px | Large card padding, desktop margins |
| **3xl** | 40px | Main container padding |
| **4xl** | 48px | Section separators |
| **5xl** | 64px | Footer/header major padding |

---

## 🎬 Animation Timings

### Button/Link Interactions
- **Hover:** 150ms ease-out
- **Active:** 100ms ease-in
- **Focus:** Instant (0ms)

### Card/Modal Transitions
- **Slide in:** 300ms ease-in-out
- **Fade in:** 300ms ease-in-out
- **Scale:** 200ms ease-out

### Page Transitions
- **Route change:** 500ms cubic-bezier(0.4, 0, 0.2, 1)
- **Scroll to section:** 600ms ease-in-out

**Motion Safe:** Always wrap animations in `@media (prefers-reduced-motion: no-preference)`

---

## 💡 Quick Design Decisions

### When to Use Which Color?

**Gold-500:**
- Primary CTAs (SIGN IN, NEXT QUESTION)
- Section headings in footer
- Achievement/completion states
- Hover states for important links

**Teal-500:**
- Success feedback
- Selected quiz answers
- Positive status indicators
- Checkmarks and success icons

**Magenta-600:**
- Book Club category
- Destructive actions (logout, delete)
- High-energy alerts
- Error states (use sparingly)

**Purple-600:**
- Personal Dashboard category
- User-specific features
- Gamification elements

**Orange-500:**
- Namasmarana category
- Community engagement features
- Active/live indicators

---

## 🎨 Icon Style Guidelines

### Icon System
- **Library:** Heroicons or Lucide (outlined style)
- **Sizes:** 16px (small), 20px (medium), 24px (default), 32px (large)
- **Stroke width:** 2px standard
- **Color:** Inherit from parent or White/Gold-500

### Icon + Text Pairing
- Small gap: 8px between icon and text
- Vertical alignment: Center
- Icon position: Usually left of text (RTL aware)

### Icon-Only Buttons
- Minimum hit target: 48×48px
- Icon size: 24px within the target
- Tooltip: Always provide on hover

---

## 📋 Checklist for New Components

When creating a new component, verify:

- [ ] Uses colors from COLOR_PALETTE.md
- [ ] Border-radius matches component type (see matrix above)
- [ ] Padding follows 4pt/8pt scale
- [ ] Text uses Poppins or Playfair Display
- [ ] Has hover/focus states defined
- [ ] Works at mobile (320px) and desktop (1280px)
- [ ] Meets WCAG AA contrast minimum
- [ ] Has 48px minimum touch target for interactive elements
- [ ] Animation durations match the motion system
- [ ] Responsive behavior documented

---

© 2026 SSIOM Malaysia • Visual reference for Sai SMS development
