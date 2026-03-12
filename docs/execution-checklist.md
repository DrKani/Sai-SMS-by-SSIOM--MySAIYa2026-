# Sai SMS Execution Checklist

## In Progress

- Reconcile Firebase rules with the collections the app actually uses.
- Pick one canonical sadhana submission/streak model across app and functions.
- Introduce a shared data-access layer for user/profile/stats/cache hydration.
- Split `src/pages/AdminPage.tsx` into feature modules.
- Centralize event query/registration logic.
- Centralize auth/signup/onboarding/profile field definitions.
- Decide whether journal/reflections are local-first or Firestore-backed and make all consumers consistent.
- Move AI calls behind a backend boundary.
- Remove dead routes/code and document the actual collection schema in code, not only docs.

## Completed In This Pass

- Shared member/profile access added via `src/services/memberService.ts`.
- Shared onboarding registry map extracted to `src/constants/registry.ts`.
- `src/App.tsx` now hydrates auth/profile state from Firebase before trusting local cache.
- `users/{uid}` create rule constrained to the authenticated UID.
- Public/read-model Firestore rules aligned for `announcements`, `calendar`, `articles`, and `articleComments`.
- Avatar uploads now use `/users/{uid}/...` to match Storage rules.

## Remaining High-Risk Areas

- `src/pages/AdminPage.tsx`
- `src/App.tsx`
- `src/pages/BookClubPage.tsx`
- `src/pages/ChantingPage.tsx`
- `functions/src/index.ts`
- `src/lib/nationalStats.ts`
- `firestore.rules`
- `src/pages/DashboardPage.tsx`
