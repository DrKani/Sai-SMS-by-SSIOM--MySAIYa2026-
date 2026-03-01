# Auth Flow & UX Improvements - Implementation Plan

## ✅ Completed
1. **Sign In page "New Member" link** → Now goes to `/signup` page
2. **Guest warning modal** → Added to both LoginPage and SignupPage
3. **Modal text** → Updated to mention "Centre's count"
4. **Loading states** → "Signing in..." text added to Google button

## 🔄 In Progress / To Do

### 2. Guest Mode Header Banner
**Location**: `App.tsx` - Header section
**When**: User is logged in as guest (`user.isGuest === true`)
**Show**: Banner saying "You're in Guest Mode - [Sign Up](#/signup) to Save Progress"
**Style**: Gold/orange background, prominent but not intrusive

### 3. Homepage Guest Banner  
**Location**: `HomePage.tsx`
**When**: Guest user visits homepage
**Show**: "You're in Guest Mode. Sign Up to unlock full features."
**Style**: Top banner, dismissible

### 4. Success Messages with Bro/Sis
**Locations**: 
- `SetupPage.tsx` - After profile save
- `DashboardPage.tsx` - Welcome message
- `LoginPage.tsx` - After successful sign-in

**Format**:
- New user after setup: "Om Sai Ram, Bro/Sis [FirstName]. Welcome to Sai SMS! 🙏"
- Returning user: "Om Sai Ram, Bro/Sis [FirstName]. Welcome back!"
- Guest upgrade: "Congratulations Bro/Sis [FirstName]. Account created! Your progress is now being saved ✓"

### 5. Protected Feature Modal for Guests
**Location**: Create new component `ProtectedFeatureModal.tsx`
**Trigger**: When guest tries to access:
- `/namasmarana`
- `/book-club`
- `/dashboard`
- `/journal`
- `/games`

**Content**:
- Title: "This feature requires an account"
- Message: Brief explanation
- Button: "Sign Up with Google" (triggers auth)
- After auth: Return to original page with success message

### 6. Profile Completion Flow
**Location**: `SetupPage.tsx` and routing logic in `App.tsx`

**Checks**:
- If `auth.currentUser` exists but `onboardingDone === false`
- Redirect to `/setup`
- Show: "One more step! Complete your profile"
- Mark required fields clearly
- Block dashboard access until complete
- After save: "Om Sai Ram. Profile complete! Welcome to Sai SMS by SSIOM"

### 7. First-Time User Onboarding
**Location**: Create new component `FeatureHighlightsModal.tsx`
**Trigger**: After first successful profile setup
**Content**:
- Welcome message
- Feature highlights carousel:
  - "Submit your Mantra Count"
  - "Track your Sadhana Progress"
  - "Join Book Club Discussions"
  - "Earn Badges & Achievements"
- Show all homepage features
- "Get Started" button → Dashboard

### 8. Error Handling Enhancements
**Already implemented** in LoginPage and SignupPage:
- ✅ Popup blocked
- ✅ Network error
- ✅ User cancelled
- ✅ Unauthorized domain
- ✅ Operation not allowed

**Still needed**:
- Add to all other auth flows
- Consistent error toast styling

### 9. Loading State Improvements
**Current**: "Signing in..." on Google button
**Needed**:
- ✅ "Entering..." on Guest button (done)
- "Loading..." on all other action buttons
- Spinner icons where appropriate
- Disable buttons during loading

## Implementation Priority

### Phase 1 (Critical - Do Now)
1. Guest mode header banner
2. Success messages with Bro/Sis
3. Profile completion redirect logic

### Phase 2 (Important - Next)
4. Protected feature modal for guests
5. Homepage guest banner
6. First-time user onboarding

### Phase 3 (Polish - Final)
7. Comprehensive error handling review
8. Loading state audit
9. Testing & refinement

## Files to Modify

### Primary Files
- `src/App.tsx` - Header banner, routing logic
- `src/pages/DashboardPage.tsx` - Welcome messages
- `src/pages/SetupPage.tsx` - Success messages, completion flow
- `src/pages/HomePage.tsx` - Guest banner

### New Components
- `src/components/ProtectedFeatureModal.tsx`
- `src/components/FeatureHighlightsModal.tsx`
- `src/components/GuestBanner.tsx`

### Supporting Files
- `src/types.ts` - Add any new types if needed
- `src/constants.ts` - Feature highlights content
