# Comprehensive Testing & Acceptance Criteria
**Sai SMS by SSIOM - Production Readiness Testing**

**Version**: 1.0  
**Last Updated**: 2026-02-16

---

## Table of Contents
1. [Authentication & Onboarding (P0)](#1-authentication--onboarding-p0)
2. [Profile Setup (P0)](#2-profile-setup-p0)
3. [Namasmarana & Likitha (P0)](#3-namasmarana--likitha-p0)
4. [Personal Dashboard (P0)](#4-personal-dashboard-p0)
5. [National Dashboard (P0/P1)](#5-national-dashboard-p0p1)
6. [Book Club (P0)](#6-book-club-p0)
7. [Games (P1)](#7-games-p1)
8. [Journal (P0)](#8-journal-p0)
9. [Admin (P0)](#9-admin-p0)
10. [Performance & Security (P0)](#10-performance--security-p0)
11. [Evidence Templates](#11-evidence-templates)

---

## 1. Authentication & Onboarding (P0)

### AUTH-01: Google Sign Up from /signup
**Priority**: P0 - Critical  
**User Type**: New User

**Steps**:
1. Open `/signup` in incognito browser
2. Click "Sign Up with Google" button
3. Complete Google authentication in popup
4. Observe redirect behavior

**Expected Results**:
- Google OAuth popup opens immediately
- Loading state shows "Signing in..." on button
- After authentication success, toast appears: "Signed in successfully!"
- Automatic redirect to Profile Setup page (`/setup`)
- No password/email signup option visible on page

**Acceptance Criteria**:
- Google auth success triggers authenticated user session
- No routing loops or dead ends
- Firebase Auth shows user in console
- User is NOT redirected to dashboard (new users need profile setup)

**Evidence Required**:
- [ ] Screenshot of sign-up page
- [ ] Screenshot of Google OAuth popup
- [ ] Screenshot of loading state
- [ ] Screenshot of success toast
- [ ] Screenshot of profile setup page
- [ ] Browser console log showing no errors
- [ ] Firebase Auth console showing new user

---

### AUTH-02: Guest Entry from /signup
**Priority**: P0 - Critical  
**User Type**: Guest

**Steps**:
1. Open `/signup`
2. Click "Continue as Guest" button
3. Read modal content
4. Click "Enter as Guest"

**Expected Results**:
- Guest warning modal appears with content:
  ```
  "Your progress will NOT be saved, badges will NOT be saved,
  and your mantra count will NOT be included in your Centre's count"
  ```
- "Why sign up?" section expandable
- "Enter as Guest" and "Sign Up Now" buttons visible
- After clicking "Enter as Guest": redirect to homepage (`/`)
- Guest indicator shows in side menu: "Browsing as Guest" with sign-up link

**Acceptance Criteria**:
- `guestSession=true` flag set in localStorage or session
- Guest user clearly labeled in UI
- Limited dashboard behavior enforced (dashboard redirects to sign-in)

**Evidence Required**:
- [ ] Screenshot of guest modal
- [ ] Screenshot of "Why sign up?" expanded section
- [ ] Screenshot of homepage with guest session
- [ ] Screenshot of side menu showing guest indicator
- [ ] LocalStorage/SessionStorage showing guest flag
- [ ] Attempt to access `/dashboard` → redirects to `/signin`

---

### AUTH-03: Sign In from /signin (Returning User)
**Priority**: P0 - Critical  
**User Type**: Returning Member

**Steps**:
1. Open `/signin`
2. Click "Continue with Google"
3. Select existing Google account
4. Observe redirect behavior

**Expected Results**:
- If first-time user (no Firestore doc) → Profile Setup `/setup`
- If returning user with `onboardingDone=true` → Dashboard `/dashboard`
- Welcome message appears: "Om Sai Ram, Bro/Sis [FirstName]. Welcome back!"

**Acceptance Criteria**:
- Single Google handler used for both sign-in and sign-up
- Redirect logic based on `/users/{uid}.onboardingDone` field
- No manual checks in LoginPage or SignupPage (handled by App.tsx)

**Evidence Required**:
- [ ] Screenshot of sign-in page
- [ ] Firebase Firestore showing user document with `onboardingDone=true`
- [ ] Screenshot of dashboard with welcome message
- [ ] Console log showing redirect logic

---

### AUTH-04: "New Member?" Hyperlink Correctness
**Priority**: P1 - High  
**User Type**: New User

**Steps**:
1. On `/signin` page, locate "New Member?" section
2. Click "sign up with Google" hyperlink
3. Observe behavior

**Expected Results**:
- Hyperlink navigates to `/signup` page
- OR triggers same Google auth flow as primary button (no different code path)

**Acceptance Criteria**:
- Hyperlink action matches primary Google button functionality
- No broken links or dead routes

**Evidence Required**:
- [ ] Screenshot of "New Member?" section
- [ ] Navigation confirmation

---

### AUTH-05: Onboarding Tour First Run
**Priority**: P1 - High  
**User Type**: New Member

**Steps**:
1. Complete sign-up and profile setup as new user
2. Land on dashboard for first time
3. Observe tour behavior

**Expected Results**:
- Onboarding tour displays automatically
- Tour shows key features step-by-step
- User can skip or complete tour
- After tour completion, `onboardingDone=true` remains set

**Acceptance Criteria**:
- Tour displays once per user
- Firestore field confirms completion
- Tour is skippable without breaking flow

**Evidence Required**:
- [ ] Screenshot of tour steps
- [ ] Firestore document showing `onboardingDone=true`

---

### AUTH-06: Replay Onboarding
**Priority**: P2 - Medium  
**User Type**: Returning Member

**Steps**:
1. Navigate to `/profile` or Settings
2. Click "Replay Tutorial" button
3. Observe tour behavior

**Expected Results**:
- Tour appears again
- No changes to user data or progress
- Can close tour at any time

**Evidence Required**:
- [ ] Screenshot of replay button
- [ ] Screenshot of replayed tour

---

## 2. Profile Setup (P0)

### SETUP-01: Required Fields Validation
**Priority**: P0 - Critical  
**User Type**: New User

**Steps**:
1. Land on `/setup` after Google auth
2. Attempt to click "JOIN SAI SMS NOW" without filling fields
3. Fill each field one by one

**Expected Results**:
- Avatar selection required (male/female)
- Full name required (pre-populated from Google, but editable)
- State/Region dropdown required
- Sai Centre/Locality required (appears after state selection)
- "JOIN SAI SMS NOW" button disabled until all fields complete
- Validation errors shown for missing fields

**Acceptance Criteria**:
- Form prevents submission with incomplete data
- Error messages are clear and user-friendly
- State→Centre dependency works correctly

**Evidence Required**:
- [ ] Screenshot of empty form with disabled submit button
- [ ] Screenshot of validation errors
- [ ] Screenshot of completed form

---

### SETUP-02: Save Profile Writes to Firestore
**Priority**: P0 - Critical  
**User Type**: New User

**Steps**:
1. Complete all profile fields
2. Click "JOIN SAI SMS NOW"
3. Wait for loading state
4. Check Firestore console

**Expected Results**:
- Loading indicator appears
- Success toast (if implemented)
- Redirect to `/dashboard`
- Welcome message: "Om Sai Ram, Bro/Sis [FirstName]. Welcome to Sai SMS! 🙏"
- Firestore document created at `/users/{uid}` with all fields:
  - uid, name, email, gender, state, centre, photoURL
  - joinedAt (timestamp)
  - isGuest: false
  - isAdmin: false
  - onboardingDone: true
  - createdAt, updatedAt (server timestamps)

**Acceptance Criteria**:
- Document exists in Firestore
- All required fields present
- Data types match schema
- No duplicate or missing fields

**Evidence Required**:
- [ ] Screenshot of loading state
- [ ] Screenshot of dashboard after save
- [ ] Firestore console screenshot showing user document
- [ ] Browser console showing no errors during save

---

### SETUP-03: Edit Profile Later
**Priority**: P1 - High  
**User Type**: Returning Member

**Steps**:
1. Navigate to `/profile`
2. Change centre selection
3. Save changes

**Expected Results**:
- Changes save successfully
- Firestore document updated with new centre
- `updatedAt` timestamp refreshed
- No impact on `onboardingDone` flag

**Evidence Required**:
- [ ] Screenshot of profile edit page
- [ ] Firestore before/after comparison
- [ ] Confirmation toast

---

## 3. Namasmarana & Likitha (P0)

### NAMA-01: Gayathri / Sai Gayathri Counter Increments
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Navigate to `/namasmarana`
2. Tap + button
3. Tap - button
4. Use quick add (+11, +108, +1008)

**Expected Results**:
- Count changes immediately in UI (local state)
- No database write per tap (verified via Network tab)
- Counter persists in component state until offered

**Acceptance Criteria**:
- Batched sync only (see Firestore write audit in Performance section)
- UI responsive with no lag
- Count never goes negative

**Evidence Required**:
- [ ] Video of counter interaction
- [ ] Network tab showing no Firestore writes during tapping
- [ ] Console log confirming local state updates

---

### NAMA-02: Offer Chants Online
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Increment counter
2. Click "Offer Chants to Swami"
3. Observe success overlay

**Expected Results**:
- Success overlay appears: "Jai Sai Ram!"
- Writes to `/sadhanaDaily/{uid_YYYYMMDD}` in Firestore
- Dashboard updates without page refresh
- Counter resets to 0 after offering

**Acceptance Criteria**:
- Firestore write confirmed
- Dashboard shows today's count incremented
- Streak logic triggered if applicable

**Evidence Required**:
- [ ] Screenshot of success overlay
- [ ] Firestore document showing sadhana record
- [ ] Dashboard screenshot showing updated count
- [ ] Network tab showing Firestore write

---

### NAMA-03: Offer Chants Offline Queue
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Open DevTools → Network tab
2. Set "Offline" mode
3. Increment counter and offer chants
4. Observe "Queued" indicator
5. Resume network connection

**Expected Results**:
- "Queued" indicator shows: "2 pending offerings" (or similar)
- Entry saved to IndexedDB
- When back online, sync worker flushes to Firestore
- Success confirmation after sync
- Queue indicator disappears

**Acceptance Criteria**:
- Offline queue persists across page refresh
- Sync happens automatically on reconnection
- No data loss during offline→online transition

**Evidence Required**:
- [ ] Screenshot of offline indicator
- [ ] IndexedDB screenshot showing queued entry
- [ ] Screenshot of successful sync
- [ ] Firestore document created after sync

---

### NAMA-04: Guest Offering Behavior
**Priority**: P1 - High  
**User Type**: Guest

**Steps**:
1. Sign in as guest
2. Navigate to `/namasmarana`
3. Offer chants

**Expected Results**:
- Guest offerings update national general rollup anonymously
- No personal dashboard entry created (guest has no `/users/{uid}`)
- National count increments
- Guest sees confirmation but no personal streak/badge

**Acceptance Criteria**:
- Guest session active
- No `/users/{uid}` document created
- National rollup incremented (if designed to allow guest contributions)

**Evidence Required**:
- [ ] Screenshot of guest namasmarana page
- [ ] Firestore showing no guest user document
- [ ] National rollup count increment (if applicable)

---

### NAMA-05: Likitha 11-Row Validation
**Priority**: P1 - High  
**User Type**: Member

**Steps**:
1. Navigate to Likitha Japam section on `/namasmarana`
2. Type "Om Sai Ram" in rows
3. Fill only 10 rows, attempt submit
4. Fill all 11 rows, submit

**Expected Results**:
- Submit button disabled until 11/11 valid rows filled
- Each row validates "Om Sai Ram" (case-insensitive)
- After submission, Likitha units increment correctly
- Row count writes to sadhanaDaily with Likitha field

**Acceptance Criteria**:
- Validation logic enforces 11 rows
- Submission increments Likitha count in dashboard

**Evidence Required**:
- [ ] Screenshot of incomplete form (disabled submit)
- [ ] Screenshot of completed form
- [ ] Firestore sadhana document showing Likitha count

---

## 4. Personal Dashboard (P0)

### DASH-01: Today/Week/Month Summaries
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Navigate to `/dashboard`
2. View "Today" tab
3. Switch to "Week" tab
4. Switch to "Month" tab

**Expected Results**:
- **Today**: Shows `/sadhanaDaily/{uid_YYYYMMDD}` data for current day
- **Week**: Shows last 7 days' aggregated data (bounded query)
- **Month**: Shows month-to-date aggregated data (bounded query)
- Streak increments by day (consecutive days)
- Milestone animation triggers at 3, 7, 21, 30, 100 days

**Acceptance Criteria**:
- Queries use date-bounded reads (no full collection scans)
- Streak logic accurate
- Milestone celebrations trigger correctly

**Evidence Required**:
- [ ] Screenshot of Today view
- [ ] Screenshot of Week view
- [ ] Screenshot of Month view
- [ ] Firestore query showing bounded date range
- [ ] Video of milestone animation (if applicable)

---

### DASH-02: Guest Locked View
**Priority**: P1 - High  
**User Type**: Guest

**Steps**:
1. Sign in as guest
2. Attempt to access `/dashboard`

**Expected Results**:
- Redirect to `/signin`
- OR: Locked cards with CTA: "Sign up with Google to save progress"

**Acceptance Criteria**:
- Guest cannot see personal stats
- Clear sign-up CTA provided

**Evidence Required**:
- [ ] Screenshot of redirect or locked view
- [ ] Screenshot of CTA

---

## 5. National Dashboard (P0/P1)

### NAT-01: National Totals Read from Rollup Doc
**Priority**: P0 - Critical  
**User Type**: All

**Steps**:
1. Navigate to homepage `/`
2. View national stats section
3. Check Firestore for rollup document

**Expected Results**:
- Reads from `/nationalDaily/{YYYYMMDD}` OR `/rollups/{YYYYMMDD}`
- Displays total national count
- No individual user doc scans (performance optimization)

**Acceptance Criteria**:
- Single document read per day
- Data accurate and up-to-date

**Evidence Required**:
- [ ] Screenshot of national stats
- [ ] Firestore rollup document structure
- [ ] Network tab showing single read operation

---

### NAT-02: Top Centres/State Leaderboard
**Priority**: P1 - High  
**User Type**: All

**Steps**:
1. View leaderboard on homepage
2. Verify top centres/states displayed

**Expected Results**:
- Displays Top-N centres and states
- Data sourced from rollup document (pre-computed)
- No client-side aggregation

**Acceptance Criteria**:
- Leaderboard updates daily
- Rollup document contains `byState` and `byCentre` maps

**Evidence Required**:
- [ ] Screenshot of leaderboard
- [ ] Firestore rollup structure showing leaderboard data

---

### NAT-03: Targets vs Achievements
**Priority**: P1 - High  
**User Type**: All

**Steps**:
1. Admin updates national goal
2. View homepage

**Expected Results**:
- National goal displayed
- Progress bar shows achievement percentage
- Homepage updates without code changes

**Acceptance Criteria**:
- Admin updates reflected in real-time
- No hardcoded targets in frontend

**Evidence Required**:
- [ ] Admin screenshot of goal update
- [ ] Homepage screenshot showing updated target

---

### NAT-04: Malaysia Map Visualization
**Priority**: P2 - Medium  
**User Type**: All

**Steps**:
1. View Malaysia map on homepage
2. Observe state colors

**Expected Results**:
- Map colors derive from rollup `byState` data
- Hover shows state totals
- Visual gradient represents participation levels

**Evidence Required**:
- [ ] Screenshot of Malaysia map
- [ ] Interactive hover demonstration

---

## 6. Book Club (P0)

### BOOK-01: Journey Map Lock/Unlock
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Navigate to `/book-club`
2. View journey map grid
3. Observe locked vs unlocked weeks

**Expected Results**:
- Weeks locked by `publishAt` timestamps
- Current week highlighted
- Future weeks grayed out with lock icon
- Past weeks accessible

**Acceptance Criteria**:
- Lock logic based on server timestamp comparison
- No client-side date manipulation vulnerabilities

**Evidence Required**:
- [ ] Screenshot of journey map showing locked/unlocked states
- [ ] Firestore week documents showing `publishAt` fields

---

### BOOK-02: Reader Scroll Gate
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Open current week's content
2. Scroll through reading material
3. Observe quiz unlock

**Expected Results**:
- Quiz button disabled initially
- Scroll threshold (e.g., 70%) unlocks quiz
- "Scroll to unlock quiz" indicator visible

**Acceptance Criteria**:
- Scroll tracking accurate
- Quiz unlocks at defined threshold
- No way to bypass scroll requirement

**Evidence Required**:
- [ ] Screenshot of locked quiz state
- [ ] Screenshot of unlocked quiz after scrolling
- [ ] Console log showing scroll percentage

---

### BOOK-03: Quiz Scoring Rules
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Complete reading and unlock quiz
2. Answer 4 MCQ questions
3. Use hints (if available)
4. Submit quiz

**Expected Results**:
- 4 MCQ questions presented
- Scoring system:
  - First attempt: full points
  - Second attempt (after hint): reduced points
  - Third attempt: minimal points
- Completion writes to user progress:
  - `/users/{uid}/bookClubProgress/{weekId}`
- Badge earned if score threshold met

**Acceptance Criteria**:
- Scoring algorithm documented and verified
- Firestore progress document updated
- Badge logic triggers correctly

**Evidence Required**:
- [ ] Screenshot of quiz questions
- [ ] Screenshot of hint usage
- [ ] Screenshot of final score
- [ ] Firestore progress document
- [ ] Badge unlock confirmation (if earned)

---

### BOOK-04: Reflection Private vs Public Moderation
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Write a reflection
2. Select "Private" or "Public"
3. Submit

**Expected Results**:
- **Private**: Saves immediately to `/reflections/{id}` with `isPublic: false`
- **Public**: Enters moderation queue with `status: pending`
- Admin can approve/reject public reflections
- Approved reflections visible in public feed

**Acceptance Criteria**:
- Private reflections never exposed
- Public reflections require admin approval
- Moderation queue functional

**Evidence Required**:
- [ ] Screenshot of private reflection save
- [ ] Screenshot of public reflection in moderation queue
- [ ] Admin screenshot of approval action
- [ ] Public feed showing approved reflection

---

## 7. Games (P1)

### GAME-01: Quote Unscramble
**Priority**: P1 - High  
**User Type**: Member

**Steps**:
1. Navigate to `/games`
2. Play quote unscramble
3. Use hint button
4. Complete puzzle

**Expected Results**:
- Scrambled quote displayed
- Hint reveals first word or letter
- Difficulty affects scoring
- Badge unlocked after N completions
- Progress saved to Firestore

**Evidence Required**:
- [ ] Screenshot of game interface
- [ ] Screenshot of hint usage
- [ ] Screenshot of badge unlock

---

### GAME-02: MCQ Quiz
**Priority**: P1 - High  
**User Type**: Member

**Steps**:
1. Start MCQ quiz
2. Answer questions
3. View score

**Expected Results**:
- Multiple choice questions on Sai teachings
- Scoring based on attempts
- Performance tracked
- Leaderboard (optional)

**Evidence Required**:
- [ ] Screenshot of quiz questions
- [ ] Screenshot of score screen

---

## 8. Journal (P0)

### JOUR-01: Save/Edit/Delete Personal Entries
**Priority**: P0 - Critical  
**User Type**: Member

**Steps**:
1. Navigate to `/journal`
2. Create new entry
3. Edit existing entry
4. Delete entry

**Expected Results**:
- Entries save to `/journals/{uid}`
- Only owner can read/write (Firestore rules)
- Edit updates timestamp
- Delete removes document

**Acceptance Criteria**:
- Privacy enforced by Firestore rules
- CRUD operations work correctly

**Evidence Required**:
- [ ] Screenshot of journal interface
- [ ] Firestore document showing journal entry
- [ ] Security rules verification

---

## 9. Admin (P0)

### ADM-01: Admin Access Control
**Priority**: P0 - Critical  
**User Type**: Admin

**Steps**:
1. Sign in as non-admin user
2. Attempt to access `/admin`
3. Sign in as admin user
4. Access `/admin`

**Expected Results**:
- Non-admin sees "Admin Access Only" message
- Admin sees full admin dashboard with modules

**Acceptance Criteria**:
- Role check: `users/{uid}.role == "admin"`
- No password-based admin access in UI

**Evidence Required**:
- [ ] Screenshot of blocked access (non-admin)
- [ ] Screenshot of admin dashboard
- [ ] Firestore user doc showing admin role

---

### ADM-02: Create Announcement
**Priority**: P0 - Critical  
**User Type**: Admin

**Steps**:
1. Navigate to Admin → Comms Center
2. Create new announcement
3. Publish

**Expected Results**:
- Announcement appears in `/announcements` collection
- Shows in announcements feed at `/announcements`
- Shows in notification bell drawer
- Confirmed via Firestore

**Evidence Required**:
- [ ] Screenshot of announcement creation form
- [ ] Screenshot of published announcement in feed
- [ ] Screenshot of notification drawer
- [ ] Firestore document showing announcement

---

### ADM-03: Upload Book Club Material
**Priority**: P0 - Critical  
**User Type**: Admin

**Steps**:
1. Navigate to Admin → Content Studio
2. Upload PDF for book club week
3. Save week configuration

**Expected Results**:
- PDF uploaded to Firebase Storage
- Week document updated with PDF URL
- Members can access PDF from reader view
- PDF URL works and displays correctly

**Evidence Required**:
- [ ] Screenshot of upload interface
- [ ] Screenshot of week configuration
- [ ] Firestore week document with PDF URL
- [ ] Storage console showing PDF file

---

### ADM-04: Moderate Reflection
**Priority**: P0 - Critical  
**User Type**: Admin

**Steps**:
1. Navigate to Admin → Reflection Queue
2. View pending reflections
3. Approve one reflection
4. Reject one reflection

**Expected Results**:
- Pending reflections listed
- Approve action:
  - Sets `status: approved`
  - Moves to public feed
- Reject action:
  - Sets `status: rejected`
  - Removes from queue, doesn't appear publicly

**Evidence Required**:
- [ ] Screenshot of moderation queue
- [ ] Screenshot of approval action
- [ ] Firestore before/after status change
- [ ] Public feed showing approved reflection

---

### ADM-05: Export CSV
**Priority**: P1 - High  
**User Type**: Admin

**Steps**:
1. Navigate to Admin → Export Tools
2. Select data type (rollups, reflections)
3. Set date range (last 30 days)
4. Export

**Expected Results**:
- CSV file downloads
- Contains bounded dataset (not entire database)
- Data accurate and formatted correctly

**Evidence Required**:
- [ ] Screenshot of export interface
- [ ] Sample CSV file
- [ ] Verification of data accuracy

---

## 10. Performance & Security (P0)

### PERF-01: Scheduler Job Count
**Priority**: P0 - Critical  
**User Type**: N/A (Backend)

**Steps**:
1. Open Firebase Console → Cloud Scheduler
2. Count active jobs

**Expected Results**:
- Exactly 1 Cloud Scheduler job exists: `dailyOrchestrator`
- Runs daily at configured time
- No duplicate jobs

**Evidence Required**:
- [ ] Screenshot of Cloud Scheduler console
- [ ] Job configuration details

---

### PERF-02: Firestore Write Rate
**Priority**: P0 - Critical  
**User Type**: N/A (Performance)

**Steps**:
1. Monitor Firestore writes during namasmarana counter usage
2. Tap counter 100 times
3. Observe write operations

**Expected Results**:
- No per-tap writes
- Only batched write on "Offer Chants" submission
- Single write per offering session

**Evidence Required**:
- [ ] Firestore usage metrics showing low write rate
- [ ] Browser Network tab showing no writes during tapping
- [ ] Console log confirming batched writes

---

### PERF-03: Storage Bandwidth Protection
**Priority**: P1 - High  
**User Type**: Member

**Steps**:
1. Open book club PDF
2. Close and reopen PDF
3. Monitor network requests

**Expected Results**:
- PDF cached locally or in browser
- Reopening doesn't trigger new download
- Storage bandwidth not wasted

**Evidence Required**:
- [ ] Network tab showing cached resource (304 Not Modified)
- [ ] Storage usage analytics

---

### SEC-01: Firestore Security Rules Audit
**Priority**: P0 - Critical  
**User Type**: N/A (Security)

**Steps**:
1. Review `firestore.rules` file
2. Test unauthorized access attempts
3. Verify deny-by-default principle

**Expected Results**:
- Deny-by-default enforced
- Users can only read/write own documents
- Admin collections protected
- Public collections read-only for non-admins

**Evidence Required**:
- [ ] Copy of firestore.rules file
- [ ] Test results showing unauthorized access denied
- [ ] Security audit report

---

## 11. Evidence Templates

### Test Evidence Template

```markdown
## Test Case: [TEST-ID] [TEST NAME]
**Date**: YYYY-MM-DD  
**Tester**: [Name]  
**Environment**: [Production/Staging/Local]  
**Browser**: [Chrome/Firefox/Safari]  
**Device**: [Desktop/Mobile]

### Status
✅ PASS / ❌ FAIL / ⚠️ PARTIAL

### Steps Executed
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Actual Results
- [What actually happened]

### Expected vs Actual
| Expected | Actual | Match |
|----------|--------|-------|
| [Expected 1] | [Actual 1] | ✅/❌ |

### Evidence
- Screenshot 1: [description]
- Screenshot 2: [description]
- Console log: [description]
- Firestore doc: [description]

### Notes
[Additional observations]

### Pass/Fail Rationale
[Why this test passed or failed]
```

---

### Acceptance Criteria Sign-Off Template

```markdown
## Acceptance Criteria: [CRITERIA ID]

**Feature**: [Feature Name]  
**Criteria**: [Acceptance Criteria Statement]

### Testing Summary
- [ ] Unit Tests Pass
- [ ] Integration Tests Pass
- [ ] Manual Tests Pass
- [ ] Performance Metrics Met
- [ ] Security Validated

### Sign-Off
| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| QA Lead | | | |

**Status**: ✅ ACCEPTED / ❌ REJECTED / ⚠️ CONDITIONAL

**Notes**: [Any conditions or follow-up items]
```

---

**Priority Legend**:
- **P0 - Critical**: Must work for production launch
- **P1 - High**: Important for full functionality
- **P2 - Medium**: Nice to have, can defer
- **P3 - Low**: Future enhancement

---

**End of Comprehensive Testing & Acceptance Criteria**
