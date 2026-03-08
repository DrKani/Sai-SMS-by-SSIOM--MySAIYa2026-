# Sai SMS by SSIOM: Component Specifications

**Source:** UI Screenshots Analysis (February 2026)  
**Purpose:** Detailed component styling guide for consistent implementation

---

## 1. Header/Navigation Bar

### Layout
- **Position:** Sticky, remains at top during scroll
- **Height:** `64px` (mobile), `72px` (desktop)
- **Background:** Navy-900 (`#0A1E3E`)
- **Z-index:** `50`
- **Padding:** `16px` horizontal (mobile), `32px` (desktop)

### Elements

#### Logo/Brand
- **Position:** Left-aligned
- **Size:** `40px` height
- **Type:** SSIOM emblem + "SAI SMS BY SSIOM" text
- **Text:**
  - Font: Poppins Bold
  - Size: `16px`
  - Color: White
  - Subtitle: "Sai Sadhana Made Simple by SSIOM" (smaller, `11px`)

#### Search Bar
- **Width:** Flexible, `300px` min on desktop, full width on mobile
- **Height:** `40px`
- **Background:** White
- **Border-radius:** `1.5rem` (24px) - pill shape
- **Placeholder:** Gray-500 text
- **Icon:** Search icon, Gray-400, left-aligned with 12px padding
- **Focus state:** 2px Gold-500 outline

#### Action Buttons
**SIGN IN Button:**
- Background: Gold-500 (`#D4AF37`)  
- Text: Navy-900, Poppins SemiBold, `14px`
- Icon: Login arrow icon
- Padding: `10px 20px`
- Border-radius: `1rem` (16px)
- Hover: Scale 1.02, Gold-400

**SIGN UP Button:**
- Background: Navy-700
- Text: White, Poppins SemiBold, `14px`
- Border: 2px solid Gold-500
- Icon: User-plus icon
- Padding: `10px 20px`
- Border-radius: `1rem` (16px)
- Hover: Background Navy-600

#### Notification Bell
- Icon: Bell outline, white
- Size: `24px`
- Background: Transparent circle on hover
- Indicator: Red dot for unread (top-right)

#### Mobile Menu
- Icon: Hamburger, white, `24px`
- Opens drawer from right

---

## 2. Updates/Announcement Banner

### Style
- **Height:** `32px`
- **Background:** Linear gradient Navy-600 → Purple-900
- **Text:** White, Poppins Medium, `12px`
- **Animation:** Horizontal scroll/marquee OR static with overflow
- **Content:** "DHANA MADE SIMPLE BY SSIOM • SUPPORTING MALAYSIAN SAI DEVOTEES IN THEIR SPIRITUAL JOURNEY."

---

## 3. Footer

### Layout
- **Background:** Navy-900 (`#0A1E3E`)
- **Padding:** `64px 32px 32px` (desktop), `40px 16px 24px` (mobile)
- **Grid:** 3 columns on desktop, 1 column on mobile

### Sections

#### Logo & Description (Left Column)
- SSIOM emblem (white, `80px`)
- Title: "Sai SMS by SSIOM" - Playfair Display, Gold-500, `32px`
- Description: Body-M, White/Gray-300, `16px`, line-height 1.6
- Max-width: `360px`

#### Contact SSIOM (Middle Column)
- Heading: "CONTACT SSIOM" - Gold-500, Poppins Bold, `14px`, uppercase
- Items:
  - Organization name (white text)
  - Address with location icon
  - Website with globe icon
  - Phone with phone icon
  - WhatsApp with message icon
- Icon color: Gold-500 or White
- Text: White, `14px`, line-height 1.8

#### Quick Links (Right Column)
- Heading: "QUICK LINKS" - Gold-500, Poppins Bold, `14px`, uppercase
- Links: White text, `14px`
  - HOME
  - NAMASMARANA COUNT
  - SSIOM SAI LIT CLUB
  - SAI SMS EVENTS
  - PLAY AND LEARN
  - ADMIN DASHBOARD ACCESS
- Hover: Gold-500 color transition

### Footer Bottom
- **Background:** Slightly darker Navy or same
- **Border-top:** 1px solid Navy-700
- **Text:** "© 2026 SSIOM MALAYSIA. ALL RIGHTS RESERVED."
- **Alignment:** Center
- **Color:** Gray-400, `12px`

---

## 4. Quiz/Trivia Cards

### Container
- **Background:** Navy-700 (`#14366D`)
- **Border-radius:** `2.5rem` (40px)
- **Padding:** `48px 40px`
- **Max-width:** `700px`
- **Shadow:** Large soft shadow

### Header
- "QUESTION X OF 10" - Gold-500/White, `12px`, uppercase
- Timer/Progress: Circular if animated, top-right
- Points display: "POINTS + BONUS" - Gold-500, top-right

### Question Text
- **Font:** Poppins SemiBold
- **Size:** `20px` (mobile), `24px` (desktop)
- **Color:** White
- **Line-height:** 1.4
- **Margin-bottom:** `32px`

### Answer Buttons (Default State)
- **Layout:** 2×2 grid
- **Background:** Transparent
- **Border:** 2px solid Navy-500/White (opacity 0.3)
- **Border-radius:** `1.5rem` (24px)
- **Padding:** `16px 24px`
- **Text:** White, Poppins Medium, `16px`
- **Hover:** 
  - Border color: White
  - Scale: 1.02
  - Background: Navy-600 (subtle)

### Answer Buttons (Selected/Correct State)
- **Background:** Teal-500 (`#1DC9A0`)
- **Border:** None or 2px solid Teal-400
- **Text:** White
- **Icon:** White checkmark circle, right-aligned
- **Animation:** Bounce in on selection

### Answer Buttons (Incorrect State)
- **Background:** Magenta-600 (if showing wrong answers)
- **Border:** 2px solid Magenta-500
- **Icon:** White X circle

### Feedback Panel (Correct Answer)
- **Background:** Teal-500 with 95% opacity
- **Border-radius:** `1.5rem`
- **Padding:** `20px`
- **Margin-top:** `24px`
- **Icon:** Checkmark circle, white
- **Heading:** "YOU ARE ABSOLUTELY RIGHT!" - White, Poppins Bold, `16px`
- **Explanation:** White text, `14px`, line-height 1.6

### Next Button
- **Background:** Gold-500
- **Text:** Navy-900, Poppins SemiBold, `16px`, "NEXT QUESTION"
- **Icon:** Arrow right
- **Padding:** `14px 32px`
- **Border-radius:** `1rem`
- **Position:** Bottom-right or centered
- **Hover:** Gold-400, scale 1.03

---

## 5. Dashboard Feature Cards

### Card Structure
- **Border-radius:** `2rem` (32px)
- **Padding:** `48px 40px`
- **Aspect-ratio:** Roughly 1:1 for 3-column grid
- **Shadow:** Medium elevation
- **Hover:** Lift effect, scale 1.02

### Icon Container
- **Shape:** Rounded square or circle
- **Background:** White with 15-20% opacity
- **Size:** `64px`
- **Icon size:** `32px`
- **Icon color:** White
- **Margin-bottom:** `24px`

### Title
- **Font:** Poppins Bold
- **Size:** `22px`
- **Color:** White
- **Margin-bottom:** `8px`

### Subtitle/Description
- **Font:** Poppins Medium
- **Size:** `14px`
- **Color:** White with 90% opacity
- **Max-width:** `90%`

### Variants by Type

**Namasmarana Card:**
- Background: Orange-500 (`#FF7F3F`)
- Icon: Microphone or prayer beads

**Book Club Card:**
- Background: Magenta-600 (`#D91C5C`)
- Icon: Book/reading icon

**Personal Dashboard Card:**
- Background: Purple-600 (`#8B5CF6`)
- Icon: Chart/dashboard icon

---

## 6. Welcome/Hero Section

### Container
- **Background:** Navy-700
- **Border:** 3px solid Gold-500
- **Border-radius:** `2rem` (32px)
- **Padding:** `40px`
- **Margin:** `32px auto`
- **Max-width:** `900px`

### Text Content
- "Om Sai Ram, Welcome to" - White, `18px`
- "Sai SMS by SSIOM" - Gold-500, Playfair Display Bold, inline
- Description text - White, `16px`, line-height 1.7
- **Alignment:** Center

---

## 7. Active Study Chapter Card

### Layout
- **Background:** Split design:
  - Left 40%: Gold-500
  - Right 60%: Navy-700
- **Border-radius:** `1.5rem` (24px)
- **Height:** `120px`
- **Shadow:** Medium
- **Hover:** Slight lift

### Left Section (Gold)
- Icon: Book stack icon, Navy-900, `24px`
- Label: "ACTIVE STUDY CHAPTER" - Navy-900, `10px`, uppercase
- Title: "The Solar Dynasty" - Navy-900, Playfair Display, `24px`
- Subtitle: "WEEK W92 • NATIONAL OFFERING" - Navy-900, `11px`

### Right Section (Navy)
- Quote text: White, italic, `15px`
- "READ NOW" button: Transparent with white border, white text, arrow icon
- Hover: White background, Navy text

---

## 8. Buttons & Interactive Elements

### Primary Button (Gold)
- Background: Gold-500
- Text: Navy-900, Poppins SemiBold, `14-16px`
- Padding: `12px 28px`
- Border-radius: `1rem`
- Hover: Gold-400, scale 1.02
- Active: Gold-600, scale 0.98
- Disabled: Gold-300, cursor not-allowed

### Secondary Button (Navy)
- Background: Navy-700
- Text: White, Poppins SemiBold  
- Border: 2px solid Gold-500 OR White
- Padding: `12px 28px`
- Border-radius: `1rem`
- Hover: Navy-600

### Text Link
- Color: White or Gold-500
- Underline: On hover
- Transition: Color 200ms

### Floating Action Button (FAB)
- **Size:** `56px` diameter
- **Background:** Gold-500
- **Icon:** Navy-900, `24px`
- **Position:** Fixed bottom-right
- **Bottom:** `24px`, Right: `24px`
- **Shadow:** Large elevation
- **Hover:** Scale 1.1, Gold-400
- **Icons used:** 
  - Up arrow (scroll to top)
  - Home icon

---

## 9. Cookie Consent Modal

### Container
- **Background:** White
- **Border-radius:** `1.5rem` (24px)
- **Padding:** `32px`
- **Max-width:** `460px`
- **Shadow:** Extra large
- **Position:** Fixed bottom-right (desktop), bottom-center (mobile)

### Elements
- Icon: Information circle, Teal-500, `32px`, top-left
- Heading: "We value your privacy" - Navy-900, Poppins Bold, `20px`
- Body: Navy-700, `14px`, line-height 1.6
- Link: "Cookies Policy" - Teal-500, underlined
- Button: "ALLOW ALL" - Navy-900 background, Gold-500 text, full width
- Button padding: `14px`
- Button border-radius: `1rem`

---

## 10. Form Inputs

### Text Input
- **Height:** `48px`
- **Background:** White (light themes), Navy-600 (dark themes)
- **Border:** 2px solid Gray-300 (default), Gold-500 (focus)
- **Border-radius:** `0.75rem` (12px)
- **Padding:** `12px 16px`
- **Text:** Navy-900 or White, `16px`
- **Placeholder:** Gray-500, `16px`
- **Focus:** Gold-500 border, 4px offset outline

### Textarea
- Similar to text input
- Min-height: `120px`
- Resize: vertical only

### Checkbox/Radio
- **Size:** `20px`
- **Border:** 2px solid Navy-500
- **Border-radius:** `4px` (checkbox), `50%` (radio)
- **Checked background:** Teal-500
- **Checkmark:** White

---

## 11. Shadows & Elevation

```css
/* Small */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

/* Medium */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);

/* Large */
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

/* Extra Large (Modals) */
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
```

---

## 12. Border Radius Reference

- **Small elements:** `0.5rem` (8px) - badges, chips
- **Medium elements:** `1rem` (16px) - buttons, inputs
- **Large elements:** `1.5rem` (24px) - quiz answers, smaller cards
- **Extra large elements:** `2rem` (32px) - dashboard cards
- **Bento tiles:** `2.5rem` (40px) - main content containers
- **Pill shape:** `9999px` or `50vh` - tags, pills
- **Modals:** `3rem` (48px) top corners

---

© 2026 SSIOM Malaysia • Component specifications for Sai SMS
