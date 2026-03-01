# Authentication Testing Checklist
**Sai SMS by SSIOM - Complete Test Suite**

## I. SIGN-IN FLOW TESTING

### A. Page Load & Initial State
- [ ] Sign-in page loads at URL `#/signin`
- [ ] Logo displays correctly
- [ ] "OM SAI RAM" heading is visible
- [ ] Subtitle "Your spiritual companion awaits" displays
- [ ] All buttons are clickable and properly styled
- [ ] No JavaScript console errors appear

### B. Continue with Google Button
- [ ] Button is clearly labeled "Continue with Google" with Google logo
- [ ] Clicking opens Google OAuth authentication dialog
- [ ] OAuth dialog displays correctly in new browser window/tab
- [ ] Google login flow completes without errors
- [ ] After successful Google login, redirects to appropriate page (dashboard if returning, setup if new)
- [ ] User profile displays in header after login

### C. Continue as Guest Button
- [ ] Button is properly styled and clickable
- [ ] Clicking opens modal dialog with warning message
- [ ] Modal displays title "Continue as Guest"
- [ ] Modal shows informative warning about data not being saved
- [ ] Modal states data won't be included in Centre's count
- [ ] Modal provides "Enter as Guest" and "Sign Up Now" buttons
- [ ] "Why sign up?" expandable section works
- [ ] Clicking "Enter as Guest" navigates to home page
- [ ] User is labeled with guest indicator in menu

### D. Navigation & Links
- [ ] "Sign Up with Google" link in "New Member?" section directs to `#/signup`
- [ ] Terms of Use link is clickable and functional
- [ ] Privacy Policy link is clickable and functional
- [ ] All footer links work correctly

### E. Sign-Out Functionality
- [ ] User profile menu accessible (click user avatar in header or menu)
- [ ] "Sign Out" button present in profile dropdown
- [ ] Clicking "Sign Out" redirects to `#/signin`
- [ ] Session is properly cleared after sign-out
- [ ] User data does not persist after sign-out

---

## II. SIGN-UP FLOW TESTING

### A. Page Load & Initial State
- [ ] Sign-up page loads at URL `#/signup`
- [ ] Heading "Om Sai Ram" displays
- [ ] Subtitle "Begin Your Spiritual Journey" shows
- [ ] Logo/app branding is visible
- [ ] No console errors on load

### B. Sign Up with Google Button
- [ ] Button is prominent (gold gradient button)
- [ ] Clicking triggers Google OAuth authentication
- [ ] Google authentication completes successfully
- [ ] After authentication, user is redirected to profile setup page (`#/setup`)
- [ ] Google auth data (email, name) is captured
- [ ] Loading state shows "Signing in..." during auth

### C. Profile Setup Page (`#/setup`)
- [ ] Page loads automatically after Google authentication
- [ ] Inspirational Baba quote displays
- [ ] "CHOOSE YOUR AVATAR" section shows male/female avatar options
- [ ] Avatar selection is clickable and shows selection state (ring highlight)
- [ ] Selected avatar shows gender label below
- [ ] Name field is pre-populated with Google account name
- [ ] Name field is editable
- [ ] "STATE / REGION" dropdown shows placeholder text
- [ ] Dropdown is clickable and shows region options
- [ ] Dropdown options populate correctly with all Malaysian states
- [ ] "Sai Centre/Locality" dropdown appears after state selection
- [ ] Centre dropdown shows relevant centres for selected state
- [ ] "Others" option available in centre dropdown
- [ ] Custom centre name field appears when "Others" selected

### D. Profile Completion
- [ ] "JOIN SAI SMS NOW" button is visible and clickable
- [ ] Button is properly styled (dark button with hover effect)
- [ ] Clicking button validates all required fields
- [ ] System shows error if required fields missing
- [ ] Loading state shows during submission
- [ ] System confirms account creation
- [ ] User is redirected to dashboard after successful save
- [ ] Welcome message appears on dashboard ("Om Sai Ram, Bro/Sis [Name]")

### E. Form Validation
- [ ] Avatar selection is required before submission
- [ ] Full Name field is required
- [ ] State/Region selection is required
- [ ] Centre selection is required
- [ ] Custom centre name required if "Others" selected
- [ ] Error messages display for missing required fields
- [ ] System prevents submission with incomplete data
- [ ] Validation messages are clear and helpful

### F. Navigation & Links
- [ ] Can navigate back to sign-in page
- [ ] System prevents bypassing profile setup (redirects to `/setup` if not complete)
- [ ] Cannot access dashboard until profile is complete

---

## III. GUEST FLOW TESTING

### A. Guest Access Entry
- [ ] "Continue as Guest" button accessible from `#/signin`
- [ ] "Continue as Guest" button accessible from `#/signup`
- [ ] Clicking button opens guest warning modal
- [ ] Modal displays clear warning about limitations

### B. Guest Modal Content
- [ ] Modal title "Continue as Guest" displays clearly
- [ ] Warning message explicitly states:
  - [ ] Sadhana progress will NOT be saved
  - [ ] Chanting records will NOT be saved
  - [ ] Badges will NOT be saved
  - [ ] Discussions will NOT be saved
  - [ ] Data not included in Centre's count
- [ ] Encouragement to create account is presented
- [ ] "WHY SIGN UP?" expandable section available
- [ ] Benefits list shows when expanded:
  - [ ] Save chanting records & streaks
  - [ ] Earn badges & track goals
  - [ ] Join reflections & book club progress
  - [ ] Access dashboard on any device

### C. Guest Access Experience
- [ ] "ENTER AS GUEST" button navigates to home page
- [ ] Side menu shows "Browsing as Guest" indicator with sign-up link
- [ ] Guest can view available content
- [ ] Home page loads without requiring authentication
- [ ] Navigation menu accessible

### D. Guest Limitations
- [ ] Dashboard redirects to sign-in page
- [ ] Namasmarana page redirects to sign-in page
- [ ] Book Club redirects to sign-in page
- [ ] Games page redirects to sign-in page
- [ ] Journal page redirects to sign-in page
- [ ] Profile page redirects to sign-in page
- [ ] Protected menu items show lock icon

### E. Guest to Registered User Conversion
- [ ] Guest can click "Sign up" link in guest indicator
- [ ] Signing up from guest mode preserves navigation context
- [ ] After sign-up, user has registered account
- [ ] Previous guest session is replaced

---

## IV. CROSS-FLOW TESTING

### A. URL Navigation
- [ ] Direct URL navigation to `#/signin` loads sign-in page
- [ ] Direct URL navigation to `#/signup` loads sign-up page
- [ ] Direct URL navigation to `#/setup` requires authentication
- [ ] Unauthenticated access to `#/setup` redirects to `#/signin`
- [ ] Unauthenticated users redirected to `#/signin` when accessing protected routes
- [ ] Authenticated users with incomplete profile redirected to `#/setup`
- [ ] Authenticated users with complete profile can access dashboard

### B. Session Persistence
- [ ] Authenticated user session persists on page refresh
- [ ] User profile displays correctly after refresh
- [ ] Guest session persists on page refresh
- [ ] Onboarding state persists correctly
- [ ] Browser back/forward buttons work correctly
- [ ] Closing and reopening browser maintains session

### C. Error Handling
- [ ] No unhandled JavaScript errors in console
- [ ] Google OAuth failures show appropriate error messages:
  - [ ] "Popup closed by user" → "Sign-in cancelled"
  - [ ] "Popup blocked" → "Pop-up blocked. Please allow pop-ups"
  - [ ] "Network request failed" → "Network error. Check your connection"
  - [ ] "Unauthorized domain" → "Domain not authorized"
- [ ] Network failures display gracefully
- [ ] Page gracefully handles slow/no internet
- [ ] Firestore permission errors show helpful message

### D. Responsive Design
- [ ] All flows work on mobile viewport (375px)
- [ ] All flows work on tablet viewport (768px)
- [ ] All flows work on desktop viewport (1440px)
- [ ] Buttons are touch-friendly on mobile (min 44px tap target)
- [ ] Modals display correctly on smaller screens
- [ ] Form fields are properly sized for input
- [ ] Text is readable on all screen sizes

### E. Accessibility
- [ ] Form labels are properly associated with inputs
- [ ] Tab navigation works through form fields
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Alt text present for images/icons
- [ ] Screen reader announcements for state changes
- [ ] ARIA labels on interactive elements

---

## V. NOTIFICATION & STATUS MESSAGES

### A. Sign-In Flow
- [ ] Loading state shows "Signing in..." during Google auth
- [ ] Success toast "Signed in successfully!" appears after auth
- [ ] Error toasts show specific error messages
- [ ] Toasts auto-dismiss after appropriate time
- [ ] Toasts are dismissible by clicking X

### B. Sign-Up Flow
- [ ] Loading state shows during Google authentication
- [ ] Success toast appears after authentication
- [ ] Profile setup shows loading during save
- [ ] Error messages clear if setup fails (with specific error code)
- [ ] Welcome message appears on dashboard after completion

### C. Guest Flow
- [ ] Modal confirmation displays before allowing guest access
- [ ] Warning message is prominent and clear
- [ ] Toast notification "Continuing as guest" appears
- [ ] Guest indicator visible in menu

---

## VI. SECURITY & PRIVACY TESTING

### A. Authentication Security
- [ ] Google OAuth uses proper redirect flow (no credentials in URL)
- [ ] HTTPS enforced for authentication (Firebase domain)
- [ ] OAuth state parameter present (CSRF protection)
- [ ] Access tokens not exposed in browser console
- [ ] No sensitive data in network tab responses

### B. Data Privacy
- [ ] Privacy Policy link accessible from sign-in/sign-up pages
- [ ] Google sign-in shows Google privacy consent
- [ ] No personally identifiable information in localStorage
- [ ] User data encrypted in Firestore
- [ ] Email addresses not exposed in client-side logs

### C. Session Security
- [ ] Sign-out properly clears session
- [ ] No user data visible in incognito after sign-out
- [ ] Session tokens not exposed in URLs
- [ ] Firebase auth token refreshes properly
- [ ] Expired sessions redirect to sign-in

---

## VII. BROWSER & COMPATIBILITY TESTING

### A. Desktop Browsers
- [ ] Chrome (latest) - all flows work
- [ ] Firefox (latest) - all flows work
- [ ] Safari (latest) - all flows work
- [ ] Edge (latest) - all flows work

### B. Mobile Browsers
- [ ] Mobile Safari (iOS) - all flows work
- [ ] Chrome Mobile (Android) - all flows work
- [ ] Samsung Internet - all flows work
- [ ] Firefox Mobile - all flows work

### C. OAuth Compatibility
- [ ] Google OAuth works in all browsers
- [ ] Pop-up/new tab behavior consistent
- [ ] Back button from OAuth returns correctly
- [ ] OAuth timeout handled gracefully
- [ ] Multiple OAuth attempts handled properly

---

## VIII. EDGE CASES & NEGATIVE TESTING

### A. Invalid/Empty Inputs
- [ ] Cannot submit profile setup without avatar selection
- [ ] Cannot submit without name
- [ ] Cannot submit without state selection
- [ ] Cannot submit without centre selection
- [ ] Name field handles special characters (accents, apostrophes)
- [ ] Form shows validation errors clearly
- [ ] Validation errors are user-friendly

### B. Network Issues
- [ ] Timeout during Google OAuth shows error
- [ ] Network disconnection during form submission shows message
- [ ] Retry mechanisms available for failed saves
- [ ] Offline state detected and communicated
- [ ] Network recovery allows continuation

### C. Already Logged In
- [ ] Logged-in user accessing `#/signin` redirects to dashboard
- [ ] Cannot re-authenticate while logged in
- [ ] Logged-in user accessing `#/signup` redirects to dashboard
- [ ] Profile complete users accessing `/setup` redirect to dashboard

### D. Multiple Browser Tabs
- [ ] Sign-out in one tab signs out in all tabs
- [ ] Session sync works across tabs
- [ ] No duplicate login issues
- [ ] Auth state updates propagate to all tabs

### E. Rapid Clicking / Race Conditions
- [ ] Rapid clicking on "Sign Up with Google" doesn't cause errors
- [ ] Double-submit prevention on profile save
- [ ] Concurrent auth attempts handled gracefully

---

## IX. FIRESTORE DATA VALIDATION

### A. User Profile Creation
- [ ] User document created in `/users/{uid}` collection
- [ ] User document contains all required fields:
  - [ ] uid
  - [ ] name
  - [ ] email
  - [ ] gender
  - [ ] state
  - [ ] centre
  - [ ] photoURL
  - [ ] joinedAt
  - [ ] isGuest (false for Google users)
  - [ ] isAdmin (false by default)
  - [ ] onboardingDone (true after setup)
- [ ] createdAt timestamp set
- [ ] updatedAt timestamp set

### B. Guest User Data
- [ ] Guest users have isGuest: true
- [ ] Guest users don't create Firestore documents
- [ ] Guest sessions are auth-only (no Firestore writes)

### C. Data Integrity
- [ ] Duplicate email addresses handled correctly
- [ ] User data matches Google profile data
- [ ] Profile updates save correctly
- [ ] No orphaned documents created

---

## X. PERFORMANCE TESTING

### A. Load Times
- [ ] Sign-in page loads in < 2 seconds
- [ ] Sign-up page loads in < 2 seconds
- [ ] Profile setup page loads in < 2 seconds
- [ ] Google OAuth popup opens in < 1 second
- [ ] Profile save completes in < 3 seconds

### B. Resource Usage
- [ ] No memory leaks during auth flows
- [ ] Network requests optimized (no redundant calls)
- [ ] Images optimized and load quickly
- [ ] No excessive Firebase reads/writes

---

## TESTING EXECUTION RECOMMENDATIONS

1. **Test Order**: Test each flow independently before testing cross-flow interactions
2. **Dev Tools**: Use browser dev tools (F12) to monitor console errors and network requests
3. **Real Devices**: Test on real mobile devices, not just desktop emulation
4. **Multiple Accounts**: Test with multiple Google accounts to simulate different user scenarios
5. **Incognito Mode**: Test in incognito mode to verify clean sessions
6. **Firebase Monitoring**: Monitor Firebase console for authentication and Firestore logs
7. **Session Testing**: Test with cleared cache, cookies, and local storage
8. **Documentation**: Document all bugs found with screenshots and console logs

---

## TEST REPORTING TEMPLATE

```markdown
**Test Case**: [e.g., Sign-In with Google]
**Status**: ✅ PASS / ❌ FAIL
**Browser**: [Chrome/Firefox/Safari/Edge]
**Device**: [Desktop/Mobile]
**Steps**:
1. [Step 1]
2. [Step 2]
**Expected Result**: [What should happen]
**Actual Result**: [What actually happened]
**Console Errors**: [Any errors from F12 console]
**Screenshots**: [Attach if applicable]
**Notes**: [Additional observations]
```
