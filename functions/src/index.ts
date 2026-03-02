import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

/**
 * Daily Orchestrator Function
 * Triggered by Cloud Scheduler daily at 00:10 Asia/Kuala_Lumpur.
 * Handles daily maintenance tasks, notifications, and data rollups.
 */
export const dailyOrchestrator = functions.pubsub
    .schedule("10 0 * * *")
    .timeZone("Asia/Kuala_Lumpur")
    .onRun(async (context: functions.EventContext) => {
        console.log("Daily Orchestrator started at:", new Date().toISOString());

        try {
            await admin.firestore().collection("system_logs").add({
                event: "daily_orchestration_start",
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

            // Calculate active user streaks
            const usersRef = admin.firestore().collection("users");
            const snapshot = await usersRef.get(); // In a large app, we'd use a query or batching

            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;
            const TWO_DAYS = 48 * 60 * 60 * 1000;

            let resetCount = 0;
            let activeCount = 0;

            const batch = admin.firestore().batch();
            snapshot.forEach(doc => {
                const data = doc.data();
                const lastActivity = data.lastActivity ? new Date(data.lastActivity).getTime() : 0;

                // If last activity was more than 48 hours ago, reset streak
                if (data.streak > 0 && (now - lastActivity) > TWO_DAYS) {
                    batch.update(doc.ref, { streak: 0 });
                    resetCount++;
                } else if (data.streak > 0) {
                    activeCount++;
                }
            });

            if (resetCount > 0) {
                await batch.commit();
            }

            console.log(`Streak maintenance: Reset ${resetCount} streaks. ${activeCount} users kept their streaks.`);

            await admin.firestore().collection("system_logs").add({
                event: "daily_orchestration_complete",
                resetCount,
                activeCount,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log("Daily Orchestrator completed successfully.");
            return null;
        } catch (error) {
            console.error("Daily Orchestrator failed:", error);
            return null;
        }
    });

/**
 * Hourly Data Aggregation Function
 * Aggregates state-wise mantra counts and saves them to a national stats doc for quick loading.
 */
export const hourlyDataAggregation = functions.pubsub
    .schedule("0 * * * *")
    .timeZone("Asia/Kuala_Lumpur")
    .onRun(async () => {
        const db = admin.firestore();

        try {
            // Aggregate all namasmarana counts across states
            const snapshot = await db.collection("namasmarana").where("verified", "==", true).get();
            let totalSayings = 0;
            const stateTotals: Record<string, number> = {};

            snapshot.forEach(doc => {
                const data = doc.data();
                totalSayings += data.count || 0;

                const state = data.state || 'Unknown';
                stateTotals[state] = (stateTotals[state] || 0) + (data.count || 0);
            });

            await db.collection("aggregations").doc("national_counts").set({
                total: totalSayings,
                states: stateTotals,
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log("Hourly data aggregation completed successfully.");
        } catch (error) {
            console.error("Hourly aggregation failed:", error);
        }
    });

/**
 * Award Badges Cloud Function
 * Triggered when a new sadhana submission is created in 'sadhanaDaily' collection.
 */
export const awardBadges = functions.firestore
    .document('sadhanaDaily/{docId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        if (!data) return null;
        const uid = data.uid;

        const db = admin.firestore();

        // 1. Calculate total across all submissions in sadhanaDaily
        // NOTE: This can be heavy if there are thousands of submissions.
        // In production, we'd use a rolling total in the user doc.
        const userSubmissions = await db
            .collection('sadhanaDaily')
            .where('uid', '==', uid)
            .get();

        let totalCount = 0;
        userSubmissions.forEach(doc => {
            totalCount += doc.data().count || 0;
        });

        // 2. Fetch User Profile for streaks
        const userDocRef = db.doc(`users/${uid}`);
        const userSnap = await userDocRef.get();
        const userData = userSnap.data() || {};
        const currentStreak = userData.streak || 0;

        // 3. Define Badge Criteria
        const badgesToUnlock = [];
        if (totalCount >= 1) badgesToUnlock.push('first-offering');
        if (totalCount >= 10000) badgesToUnlock.push('dedicated-devotee');
        if (totalCount >= 50000) badgesToUnlock.push('spiritual-warrior');
        if (currentStreak >= 7) badgesToUnlock.push('consistent-sadhak');
        if (currentStreak >= 30) badgesToUnlock.push('marathon-meditator');

        // 4. Batch write to badges subcollection
        const batch = db.batch();
        for (const badgeId of badgesToUnlock) {
            const badgeRef = db.doc(`users/${uid}/badges/${badgeId}`);
            batch.set(badgeRef, {
                unlockedAt: admin.firestore.FieldValue.serverTimestamp(),
                badgeId,
                uid // for easier querying if needed
            }, { merge: true });
        }

        await batch.commit();
        console.log(`Updated badges for user ${uid}. Total count: ${totalCount}, Streak: ${currentStreak}`);
        return null;
    });
