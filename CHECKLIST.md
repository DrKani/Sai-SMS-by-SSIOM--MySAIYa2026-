# Deploy Verification Checklist & Guardrails

This checklist ensures the deployment meets all requirements, including RM0 cost controls.

## 1. Configuration Verification
- [ ] **Firestore Mode**: Confirm Native Mode enabled in Firebase Console -> Firestore.
- [ ] **Region**: Confirm `asia-southeast1` (Singapore) or `us-central1` selected.
- [ ] **Auth Providers**: 
  - [ ] Email/Password enabled.
  - [ ] Phone Auth (Optional/Disabled for now).

## 2. Security Rules Deployment
- [ ] **Firestore**: Rules set to `deny-by-default` (except admin pathways if configured).
- [ ] **Storage**: Rules set to `deny-by-default`, with public read for `book-club-assets`.
- [ ] **Verification**: Run `firebase deploy --only firestore:rules,storage`.

## 3. Cloud Functions & Scheduler
- [ ] **Deployment**: Run `firebase deploy --only functions`.
- [ ] **Scheduler Job**: Verify ONE job named `firebase-schedule-dailyOrchestrator-{region}` exists in Cloud Scheduler.
- [ ] **Schedule**: Job runs at `00:10` Asia/Kuala_Lumpur daily.
- [ ] **Resources**: Function memory set to 128MB/256MB (default minimal).

## 4. RM0 Guardrails (Cost Control)
- [ ] **Budgets**: Set budget alerts at $1, $3, and $5 in GCP Billing.
- [ ] **No Paid Sinks**: Verify Logging -> Router has no paid sinks.
- [ ] **No BigQuery**: Verify BigQuery export is NOT enabled in Firebase Integrations.
- [ ] **Single Scheduler**: Ensure only the one daily job exists.

## 5. Functional Verification (10-minute check)
- [ ] **Login**: Sign in with an email/password account.
- [ ] **Protected Routes**: Try accessing `/dashboard` without login (should redirect).
- [ ] **Offering Sync**: Submit a chant or sadhana entry. Verify it persists on reload.
- [ ] **Rollups**: Check if the dashboard stats update after submission.
- [ ] **Admin Tools**: Log in as admin (email in `ADMIN_CONFIG`) and access `/admin`.
