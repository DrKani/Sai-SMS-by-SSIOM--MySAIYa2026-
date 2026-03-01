#!/bin/bash

# Configuration
PROJECT_ID="sai-sms-by-ssiom-mysaiya-2026"
REGION="asia-southeast1" # Confirm this preference

echo ">>> Verifying setup..."

# 1. Check for firebase-tools
if ! command -v firebase &> /dev/null
then
    echo "firebase-tools could not be found. Installing..."
    npm install -g firebase-tools
fi

echo ">>> Deploying Firestore Rules..."
firebase deploy --only firestore:rules

echo ">>> Deploying Storage Rules..."
firebase deploy --only storage

echo ">>> Deploying Cloud Functions..."
# This step creates the Scheduler job automatically
cd functions && npm install && npm run build && cd ..
firebase deploy --only functions

echo ">>> Verifying Scheduler Job..."
# List jobs via gcloud if available, or instruct user
echo "Please verify in GCP Console: Cloud Scheduler -> 'firebase-schedule-dailyOrchestrator-asia-southeast1'"
