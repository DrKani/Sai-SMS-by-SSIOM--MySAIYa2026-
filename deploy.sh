#!/bin/bash
set -euo pipefail

# Configuration
PROJECT_ID="sai-sms-by-ssiom-mysaiya-2026"
REGION="asia-southeast1"

echo ">>> Verifying setup..."

# 1. Check for firebase-tools
if ! command -v firebase &> /dev/null
then
    echo "firebase-tools could not be found. Installing..."
    npm install -g firebase-tools
fi

# 2. Check authentication
if ! firebase projects:list &> /dev/null; then
    echo "ERROR: Not authenticated. Run 'firebase login' first."
    exit 1
fi

echo ">>> Deploying Firestore Rules..."
firebase deploy --only firestore:rules --project "$PROJECT_ID"

echo ">>> Deploying Storage Rules..."
firebase deploy --only storage --project "$PROJECT_ID"

echo ">>> Deploying Cloud Functions..."
cd functions && npm install && npm run build && cd ..
firebase deploy --only functions --project "$PROJECT_ID"

echo ">>> Building app for production..."
npm run build

echo ">>> Deploying to Firebase Hosting..."
firebase deploy --only hosting --project "$PROJECT_ID"

echo ">>> Verifying Scheduler Job..."
echo "Please verify in GCP Console: Cloud Scheduler -> 'firebase-schedule-dailyOrchestrator-asia-southeast1'"

echo ""
echo ">>> Deployment complete!"
echo ">>> Site: https://${PROJECT_ID}.web.app"
