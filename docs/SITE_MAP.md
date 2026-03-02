# Sai SMS by SSIOM — Site Map
**App:** Sai Sadhana Made Simple (MySAIYa 2026)
**Base URL:** https://sms.ssiomya.org/
**Last Updated:** 2026-03-01

---

## 1. Route Table

| Path | Component | Access | Purpose |
|------|-----------|--------|---------|
| `/` | `HomePage` | Public | Landing page — intro, features, national chanting goal |
| `/signin` | `LoginPage` | Public | Email/password sign-in + Google OAuth |
| `/signup` | `SignupPage` | Public | Create new account |
| `/announcements` | `AnnouncementsPage` | Public | Community announcements (read-only) |
| `/calendar` | `CalendarPage` | Public | Upcoming events and programme calendar |
| `/terms` | `TermsOfUse` | Public | Terms of Use |
| `/privacy` | `PrivacyPolicy` | Public | Privacy Policy |
| `/cookies` | `CookiePolicy` | Public | Cookie Policy |
| `/copyright` | `Copyright` | Public | Copyright notice |
| `/community-guidelines` | `CommunityGuidelines` | Public | Community conduct guidelines |
| `/submission-guidelines` | `ContentSubmissionGuidelines` | Public | How to submit content |
| `/setup` | `SetupPage` | Member (new) | First-time onboarding — name, state, centre |
| `/dashboard` | `DashboardPage` | Member | Personal progress: streaks, chant count, quiz scores |
| `/namasmarana` | `ChantingPage` | Member | Log daily chants (Gayathri, Sai Gayathri, Likitha, etc.) |
| `/book-club` | `BookClubPage` | Member | Sai Lit Club — current week's reading |
| `/book-club/:weekId` | `BookClubPage` | Member | Deep link to a specific week (e.g. `/book-club/W01`) |
| `/games` | `GamesPage` | Member | Game hub — Parikshya quiz, Sacred Crossword, Word Search, Quote game |
| `/journal` | `JournalPage` | Member | Private spiritual journal entries |
| `/profile` | `ProfilePage` | Member | View/edit profile, avatar, social links, privacy settings |
| `/admin` | `AdminPage` | Admin | Admin dashboard — users, content, stats, branding |

---

## 2. Authentication Access Matrix

| Route | Public | Guest | Member | Admin |
|-------|:------:|:-----:|:------:|:-----:|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/signin` | ✅ | ✅ | → `/dashboard` | → `/dashboard` |
| `/signup` | ✅ | ✅ | → `/dashboard` | → `/dashboard` |
| `/announcements` | ✅ | ✅ | ✅ | ✅ |
| `/calendar` | ✅ | ✅ | ✅ | ✅ |
| Legal pages (6) | ✅ | ✅ | ✅ | ✅ |
| `/setup` | ❌ | ❌ | ✅ (new users only) | ✅ |
| `/dashboard` | ❌ | ❌ | ✅ | ✅ |
| `/namasmarana` | ❌ | 🟡 Limited | ✅ | ✅ |
| `/book-club` | ❌ | 🟡 Preview | ✅ | ✅ |
| `/book-club/:weekId` | ❌ | 🟡 Preview | ✅ | ✅ |
| `/games` | ❌ | 🟡 No save | ✅ | ✅ |
| `/journal` | ❌ | ❌ | ✅ | ✅ |
| `/profile` | ❌ | ❌ | ✅ | ✅ |
| `/admin` | ❌ | ❌ | ❌ | ✅ |

**Legend:** ✅ Full access · 🟡 Limited access · ❌ Redirects to `/signin`

---

## 3. Auth Levels

| Level | Who | Condition |
|-------|-----|-----------|
| **Public** | Everyone | No sign-in required |
| **Guest** | Anonymous users | Signed in via "Continue as Guest" — no data persistence |
| **Member** | Registered users | `auth.currentUser` exists + `onboardingDone = true` in Firestore |
| **Admin** | Designated admins | Member whose email is in `ADMIN_CONFIG.AUTHORIZED_EMAILS` OR `isAdmin = true` in Firestore |

### Onboarding Gate
```
New sign-up → /setup (collect name, state, centre) → /dashboard
```
If a signed-in user has `onboardingDone = false` they are force-redirected to `/setup` before accessing any member route.

---

## 4. Navigation Structure

### Top Header (all authenticated pages)
- Logo → `/`
- Ticker Bar — live announcements
- Enhanced Search — global content search
- Notification Bell + Drawer
- Profile Dropdown (settings, sign-out)

### Hamburger / Side Menu
Home · Namasmarana · Sai Lit Club · My Progress · Games · Journal · Announcements · Calendar · Profile · Admin *(admin only)*

### Bottom Navigation Bar (mobile — 4 tabs)
| Tab | Route |
|-----|-------|
| Home | `/` |
| Offer (chant) | `/namasmarana` |
| Lit Club | `/book-club` |
| My Stats | `/dashboard` |

### Footer
Legal links · About · Social (WhatsApp, YouTube, Instagram, Facebook) · Version

---

## 5. Deep Links & URL Parameters

| Pattern | Example | Description |
|---------|---------|-------------|
| `/book-club/:weekId` | `/book-club/W01` | Jump directly to Week 1 of the 52-week study plan |
| `/book-club/:weekId` | `/book-club/W52` | Jump to any week (W01–W52) |

---

## 6. Non-Route UI Components (overlays, drawers, modals)

| Component | Trigger |
|-----------|---------|
| `NotificationDrawer` | Bell icon click |
| `EnhancedSearchBar` | Search icon / bar focus |
| `CookieConsent` | First visit |
| `TutorialOverlay` | First login or manual replay from Profile |
| `ProfileDropdown` | Avatar click |
| `ProfileSettingsModal` | Settings option in dropdown |
| `BriefcaseDrawer` | Briefcase FAB button |
| `MultiFunctionFAB` | Floating action button (bottom-right) |
| `Toast` | System feedback (success, error, info) |
| `Skeleton` | Loading state for async content |

---

## 7. Page Count Summary

| Zone | Routes |
|------|--------|
| Public (unauthenticated) | 11 |
| Protected — Member | 8 (incl. `:weekId` deep link) |
| Admin | 1 |
| **Total** | **20** |
