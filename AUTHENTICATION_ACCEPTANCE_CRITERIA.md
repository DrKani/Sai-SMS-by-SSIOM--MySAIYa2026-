# Authentication Flows - Acceptance Criteria
**Sai SMS by SSIOM**

## Overview
This document defines the acceptance criteria for all authentication flows including Sign-In, Sign-Up, and Guest Access. All criteria must be met before the feature is considered production-ready.

---

## 1. SIGN-IN FLOW

### AC-1.1: Page Accessibility
**Given** a user navigates to the application  
**When** they access the sign-in page via URL `#/signin`  
**Then** the page should load within 2 seconds with no console errors

### AC-1.2: Google Authentication
**Given** a user is on the sign-in page  
**When** they click "Continue with Google"  
**Then** 
- Google OAuth popup opens immediately
- Loading state shows "Signing in..."
- After successful authentication, a success toast appears
- App automatically redirects to Dashboard (returning user) or Profile Setup (new user)

### AC-1.3: Guest Access Warning
**Given** a user clicks "Continue as Guest"  
**When** the guest modal appears  
**Then**
- Modal clearly states progress won't be saved
- Modal mentions data won't be included in Centre's count
- User can expand "Why sign up?" to see benefits
- User can proceed as guest or sign up

### AC-1.4: Error Handling
**Given** Google authentication fails  
**When** an error occurs (popup blocked, network error, user cancels)  
**Then** a specific, user-friendly error message appears in a toast

### AC-1.5: Returning User Experience
**Given** an authenticated user with complete profile  
**When** they sign in with Google  
**Then** they are redirected directly to Dashboard with welcome message

---

## 2. SIGN-UP FLOW

### AC-2.1: Page Accessibility
**Given** a new user wants to create an account  
**When** they navigate to `#/signup`  
**Then** the sign-up page loads with clear call-to-action

### AC-2.2: Google Sign-Up
**Given** a user clicks "Sign Up with Google"  
**When** they complete Google authentication  
**Then**
- Success toast "Signed in successfully!" appears
- User is automatically redirected to Profile Setup page (`#/setup`)
- Google name and email are captured

### AC-2.3: Profile Setup - Required Fields
**Given** a user is on the profile setup page  
**When** they attempt to submit the form  
**Then** the following fields are required and validated:
- Avatar selection (male/female)
- Full name
- State/Region
- Sai Centre/Locality

### AC-2.4: Profile Setup - Avatar Selection
**Given** a user is selecting their avatar  
**When** they click on male or female avatar  
**Then**
- Selected avatar shows visual highlight (ring)
- Gender label appears below selected avatar
- Other avatar becomes dimmed

### AC-2.5: Profile Setup - Centre Selection
**Given** a user selects a state/region  
**When** the dropdown value changes  
**Then**
- Centre dropdown populates with centres for that state
- If "Others" is selected, a text field appears for custom centre name
- Custom centre name becomes required

### AC-2.6: Profile Setup - Submission
**Given** a user completes all required profile fields  
**When** they click "JOIN SAI SMS NOW"  
**Then**
- Loading state appears
- Profile is saved to Firestore `/users/{uid}`
- User is redirected to Dashboard
- Welcome message appears: "Om Sai Ram, Bro/Sis [FirstName]. Welcome to Sai SMS! 🙏"

### AC-2.7: Profile Setup - Error Handling
**Given** profile save fails (network, permissions, etc.)  
**When** the error occurs  
**Then**
- Specific error message displays (not generic "Failed")
- Console logs detailed error information
- User can retry submission

### AC-2.8: Onboarding Persistence
**Given** a user with incomplete profile  
**When** they navigate to any protected route  
**Then** they are redirected to `/setup` to complete onboarding

---

## 3. GUEST FLOW

### AC-3.1: Guest Access Entry
**Given** a user wants to explore without creating an account  
**When** they click "Continue as Guest" from Sign-In or Sign-Up  
**Then** a warning modal appears before proceeding

### AC-3.2: Guest Warning Content
**Given** the guest modal is displayed  
**When** the user reads the content  
**Then** the modal clearly states:
- Sadhana progress will NOT be saved
- Chanting records will NOT be saved
- Badges will NOT be saved
- Discussions will NOT be saved
- Data will NOT be included in Centre's count

### AC-3.3: Guest Benefits Disclosure
**Given** the guest modal is displayed  
**When** the user clicks "Why sign up?"  
**Then** an expandable section shows:
- Save chanting records & streaks
- Earn badges & track goals
- Join reflections & book club progress
- Access dashboard on any device

### AC-3.4: Guest Navigation
**Given** a guest user clicks "Enter as Guest"  
**When** authentication completes  
**Then**
- User navigates to homepage
- Toast notification confirms guest mode
- Side menu shows "Browsing as Guest" indicator with sign-up link

### AC-3.5: Guest Limitations
**Given** a guest user attempts to access protected features  
**When** they try to navigate to Dashboard, Namasmarana, Book Club, Games, or Journal  
**Then** they are redirected to sign-in page

### AC-3.6: Guest to Registered Conversion
**Given** a guest user decides to create an account  
**When** they click "Sign up" in the guest indicator  
**Then**
- They are taken to sign-up page
- After completing sign-up, guest session is replaced with authenticated session

---

## 4. CROSS-FUNCTIONAL REQUIREMENTS

### AC-4.1: Session Persistence
**Given** an authenticated user refreshes the page  
**When** the page reloads  
**Then**
- User remains logged in
- Profile data loads correctly
- Onboarding state is maintained

### AC-4.2: Route Protection
**Given** an unauthenticated user tries to access a protected route  
**When** they navigate to `/dashboard`, `/profile`, `/namasmarana`, etc.  
**Then** they are redirected to `/signin`

### AC-4.3: Sign-Out Functionality
**Given** a logged-in user clicks "Sign Out"  
**When** sign-out completes  
**Then**
- User is redirected to `/signin`
- Session is cleared (localStorage, sessionStorage)
- All auth state is reset
- Multiple tabs reflect signed-out state

### AC-4.4: Error Messaging
**Given** any authentication or form submission error  
**When** the error occurs  
**Then**
- User sees a friendly, actionable error message
- Console logs detailed technical information
- User can take corrective action (retry, contact support, etc.)

### AC-4.5: Loading States
**Given** any async operation (auth, save, etc.)  
**When** the operation is in progress  
**Then**
- Appropriate loading indicator shows
- Button text changes to indicate action ("Signing in...", "Saving...", etc.)
- User cannot double-submit

---

## 5. RESPONSIVE DESIGN

### AC-5.1: Mobile Compatibility
**Given** a user accesses the app on mobile (viewport 375px)  
**When** they navigate through auth flows  
**Then**
- All forms are usable
- Buttons are touch-friendly (min 44px)
- Modals fit within viewport
- Text is readable without zooming

### AC-5.2: Tablet Compatibility
**Given** a user accesses the app on tablet (viewport 768px)  
**When** they navigate through auth flows  
**Then** all layouts adapt appropriately

### AC-5.3: Desktop Compatibility
**Given** a user accesses the app on desktop (viewport 1440px+)  
**When** they navigate through auth flows  
**Then** layout is optimized for larger screens

---

## 6. ACCESSIBILITY

### AC-6.1: Keyboard Navigation
**Given** a user navigates using only keyboard  
**When** they tab through form fields  
**Then**
- All interactive elements are reachable
- Focus indicators are visible
- Form submission works with Enter key

### AC-6.2: Screen Reader Support
**Given** a user with screen reader  
**When** they navigate auth flows  
**Then**
- Form labels are announced correctly
- Error messages are announced
- State changes are communicated

### AC-6.3: Color Contrast
**Given** any text or interactive element  
**When** evaluated for accessibility  
**Then** color contrast meets WCAG AA standard (4.5:1 minimum)

---

## 7. SECURITY & PRIVACY

### AC-7.1: OAuth Security
**Given** Google authentication is initiated  
**When** OAuth flow executes  
**Then**
- HTTPS is enforced
- State parameter is present (CSRF protection)
- No credentials appear in URL
- Tokens are not exposed in console or network tab

### AC-7.2: Data Privacy
**Given** user data is collected  
**When** stored in Firestore  **Then**
- Only authenticated user can read/write their own data
- Firestore rules enforced
- No PII in localStorage

### AC-7.3: Session Security
**Given** a user signs out  
**When** examining browser storage  
**Then**
- No user data remains in localStorage
- No session tokens visible
- Incognito mode shows no persisted data

---

## 8. PERFORMANCE

### AC-8.1: Page Load Performance
**Given** any auth page is accessed  
**When** load time is measured  
**Then** page loads in under 2 seconds on 3G connection

### AC-8.2: Authentication Response Time
**Given** Google authentication is triggered  
**When** timing the flow  
**Then** popup opens in < 1 second

### AC-8.3: Profile Save Performance
**Given** profile setup form is submitted  
**When** timing the operation  
**Then** save completes in < 3 seconds

---

## 9. BROWSER COMPATIBILITY

### AC-9.1: Desktop Browser Support
**Given** any desktop browser (Chrome, Firefox, Safari, Edge - latest versions)  
**When** user goes through any auth flow  
**Then** all functionality works without errors

### AC-9.2: Mobile Browser Support
**Given** any mobile browser (Mobile Safari, Chrome Mobile - latest versions)  
**When** user goes through any auth flow  
**Then** all functionality works without errors

### AC-9.3: OAuth Pop-up Handling
**Given** Google OAuth is triggered across different browsers  
**When** authentication popup appears  
**Then**
- Popup opens correctly in all browsers
- Popup blocking is detected and communicated
- Return flow from popup works correctly

---

## 10. DATA INTEGRITY

### AC-10.1: Firestore User Document
**Given** a user completes profile setup  
**When** checking Firestore  
**Then** a document exists at`/users/{uid}` with fields:
- uid (string)
- name (string)
- email (string)
- gender ('male' | 'female')
- state (string)
- centre (string)
- photoURL (string)
- joinedAt (ISO timestamp)
- isGuest (boolean, false)
- isAdmin (boolean, false by default)
- onboardingDone (boolean, true)
- createdAt (server timestamp)
- updatedAt (server timestamp)

### AC-10.2: Guest User Data
**Given** a guest user signs in anonymously  
**When** checking Firestore  
**Then**
- No user document is created in `/users` collection
- Firebase Auth shows anonymous user
- isGuest flag would be true if profile existed

### AC-10.3: Data Validation
**Given** user profile is saved  
**When** validating data  
**Then**
- All required fields are present
- Data types match schema
- No duplicate email addresses (handled by Firebase Auth)

---

## DEFINITION OF DONE

A feature is considered **DONE** when:
1. ✅ All acceptance criteria are met
2. ✅ All test cases pass in testing checklist
3. ✅ No critical or high-priority bugs remain
4. ✅ Code is reviewed and approved
5. ✅ Deployed to production
6. ✅ Performance metrics meet targets
7. ✅ Accessibility audit passes
8. ✅ Security review passes
9. ✅ Documentation is complete
10. ✅ Stakeholder sign-off obtained

---

## TEST EVIDENCE REQUIREMENTS

For each acceptance criterion, provide:
- **Test Case ID**: Reference to testing checklist
- **Status**: PASS/FAIL
- **Evidence**: Screenshots, console logs, video recordings
- **Environment**: Browser, device, network conditions
- **Tester**: Name and date
- **Notes**: Any additional observations

---

## PRIORITY MATRIX

| Priority | Criteria | Description |
|----------|----------|-------------|
| **P0 - Critical** | AC-1.2, AC-2.2, AC-2.6, AC-4.3 | Core auth flows must work |
| **P1 - High** | AC-1.3, AC-2.3, AC-3.1, AC-4.1 | Essential UX and security |
| **P2 - Medium** | AC-5.*, AC-6.*, AC-9.* | Responsive, accessible, compatible  |
| **P3 - Low** | AC-8.*, AC-10.3 | Performance optimizations |

---

## SIGN-OFF

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| QA Lead | | | |
| UX Designer | | | |
