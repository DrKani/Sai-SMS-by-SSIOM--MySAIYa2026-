
# Validates deployment readiness and guardrails
- [ ] Login works (Email/Password & Google)
- [ ] Protected routes redirect (Try accessing /dashboard safely)
- [ ] Offering sync works (Create a chant entry and verify persistence)
- [ ] Rollups update (Check dashboard stats)
- [ ] Admin tools load (Verify access to admin panel)

## Guardrails Verification (RM0)
- [ ] **Budgets/Alerts**: Verify alerts set at $1, $3, $5 in GCP Console.
- [ ] **Scheduler**: Verify only ONE job exists: `firebase-schedule-dailyOrchestrator-us-central1`.
- [ ] **BigQuery**: Ensure NO export is configured.
- [ ] **Sinks**: Ensure NO paid logging sinks active.
- [ ] **Firestore Mode**: Confirm Native Mode (Datastore mode is NOT used).
- [ ] **Region**: Confirm `asia-southeast1` (Singapore) or `us-central1` as designated.

## Deployment Commands
1. Login: `firebase login`
2. Init (if needed): `firebase init`
3. Deploy: `firebase deploy`
