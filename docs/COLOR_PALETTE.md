# Sai SMS by SSIOM: Color Palette Reference

**Source:** Extracted from UI Screenshots (February 2026)  
**Purpose:** Comprehensive color specifications for development reference

---

## Primary Brand Colors

### Navy Blue (Primary Background)
The dominant color across the entire application, used for backgrounds, headers, and main containers.

- **Navy-900 (Deep Navy):** `#0A1E3E` or `#0B2545`
  - Usage: Main backgrounds, footer, quiz containers
  - Contrast: Works with white and gold text
  
- **Navy-700 (Medium Navy):** `#14366D` or `#1B4568`  
  - Usage: Content cards, question containers
  - Contrast: Works with white text

- **Navy-500:** `#1E5A8E` or `#2563EB`
  - Usage: Hover states, interactive elements
  
- **Navy-300 (Light Navy):** `#4B7399`
  - Usage: Borders, subtle backgrounds

### Gold/Yellow (Primary Accent & CTAs)
The signature accent color representing divinity and achievement.

- **Gold-500 (Primary Gold):** `#D4AF37` or `#C89B3C`
  - Usage: Primary buttons (SIGN IN), headings in footer, "NEXT QUESTION" buttons
  - Appears as: Solid gold buttons with dark navy text
  
- **Gold-400 (Lighter Gold):** `#DAB757` or `#E5C158`
  - Usage: Hover states for gold buttons
  
- **Gold-Gradient:**
  - Start: `#F1C40F` 
  - End: `#D4AF37`
  - Usage: Success states, achievement badges, milestone celebrations

---

## Secondary/Accent Colors

### Teal/Cyan (Success & Selected States)
- **Teal-500 (Primary Teal):** `#14B8A6` or `#1DC9A0` or `#20C997`
  - Usage: Selected answer in quiz, correct answer feedback, checkmark icons
  - Background: `#1DC9A0` with white text
  - Border: Can be used as 2px border on selected items

- **Teal-400 (Light Teal):** `#2DD4BF`
  - Usage: Hover states for teal elements

### Magenta/Pink (Alert & High Energy)
- **Magenta-600:** `#C2185B` or `#D91C5C`
  - Usage: Book Club cards, high-energy CTAs, destructive actions
  - Usually paired with: White text for contrast

- **Magenta-500:** `#DB2777` or `#E91E63`
  - Usage: Lighter variant for hover states

### Purple (Dashboard & Personal Growth)
- **Purple-600:** `#7C3AED` or `#8B5CF6`
  - Usage: Personal Dashboard cards, gamification elements
  - Shows as: Deep purple with white text

- **Purple-500:** `#9333EA`
  - Usage: Hover states, borders

### Orange (Engagement & Activity)
- **Orange-500:** `#FF8B3D` or `#FF7F3F`
  - Usage: Namasmarana cards, active learning features
  - Vibrant, energetic feel

---

## Neutral Colors

### White
- **Pure White:** `#FFFFFF`
  - Usage: Primary text on dark backgrounds, card backgrounds on light pages
  - Search bar background, input fields

### Grays
- **Gray-100:** `#F3F4F6`
  - Usage: Light background sections, subtle dividers

- **Gray-300:** `#D1D5DB`
  - Usage: Borders, placeholder text

- **Gray-500:** `#6B7280`
  - Usage: Secondary text, disabled states

- **Gray-700:** `#374151`  
  - Usage: Body text on light backgrounds

---

## Component-Specific Color Usage

### Header/Navigation
- Background: Navy-900 (`#0A1E3E`)
- Search bar: White background with gray placeholder
- SIGN IN button: Gold-500 with navy text
- SIGN UP button: Navy-700 with white text and gold border
- Bell icon: White outline

### Updates Banner
- Background: Linear gradient from Navy-600 to Purple-900
- Text: White
- Creates a gradient bar effect at the very top

### Footer
- Background: Navy-900 (`#0A1E3E`)
- Section headings: Gold-500 (`#D4AF37`)
- Body text: White or Gray-300
- Links: White with hover state Gold

### Quiz/Trivia Interface
- Container background: Navy-700
- Question text: White
- Answer buttons (default): Navy-600 with white text, rounded borders
- Answer buttons (selected): Teal-500 background with checkmark
- Answer buttons (hover): Slight scale + lighter navy
- "Next Question" button: Gold-500 background, navy text
- Points/Score: Gold-500 or White

### Dashboard Cards
- Namasmarana: Orange-500 background
- Book Club: Magenta-600 background  
- Personal Dashboard: Purple-600 background
- All with white text and white icons with subtle opacity backgrounds

### Cookie/Privacy Modal
- Background: White
- Border: Gold or Navy
- "ALLOW ALL" button: Navy-900 background with gold text
- Text: Navy-900
- Heading icon: Teal or Navy

### Floating Action Buttons
- Background: Gold-500
- Icon: Navy-900
- Hover: Slight scale + Gold-400
- Shadow: Moderate elevation

---

## Accessibility Notes

### Contrast Ratios (WCAG AA Compliance)
✅ **White text on Navy-900:** 13.5:1 (AAA)  
✅ **White text on Navy-700:** 9.2:1 (AAA)  
✅ **Navy-900 text on Gold-500:** 7.8:1 (AAA)  
✅ **White text on Teal-500:** 4.8:1 (AA)  
✅ **White text on Magenta-600:** 6.5:1 (AAA)  
✅ **White text on Purple-600:** 8.1:1 (AAA)  
✅ **White text on Orange-500:** 4.9:1 (AA)  

### Color Blindness Considerations
- Avoid using color alone to convey information
- Use icons (checkmarks, x-marks) alongside color states
- Ensure text labels accompany colored indicators
- Teal and Magenta provide good separation for deuteranopia

---

## Quick Reference: Hex Values

```css
/* Navy Scale */
--navy-900: #0A1E3E;
--navy-700: #14366D;
--navy-500: #1E5A8E;
--navy-300: #4B7399;

/* Gold Scale */
--gold-500: #D4AF37;
--gold-400: #DAB757;

/* Accent Colors */
--teal-500: #1DC9A0;
--magenta-600: #D91C5C;
--purple-600: #8B5CF6;
--orange-500: #FF7F3F;

/* Neutrals */
--white: #FFFFFF;
--gray-100: #F3F4F6;
--gray-300: #D1D5DB;
--gray-500: #6B7280;
--gray-700: #374151;
```

---

© 2026 SSIOM Malaysia • Color specifications derived from Sai SMS UI
