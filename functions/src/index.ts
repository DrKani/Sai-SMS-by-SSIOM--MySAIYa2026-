import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a YYYY-MM-DD string for a given Date in the MYT timezone (UTC+8). */
function toMYTDateString(date: Date): string {
    const myt = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return myt.toISOString().slice(0, 10);
}

// ─── Task 1: Aggregate National Chanting Stats ────────────────────────────────

/**
 * Reads every user document and sums up their chanting stats (gayathri,
 * saiGayathri, likitha, mantras). Writes the result to
 * `national_stats/2026` so the homepage can display the live national total
 * without scanning all users on every page load.
 */
async function aggregateNationalStats(): Promise<void> {
    const usersSnap = await db.collection("users").get();

    let gayathri = 0;
    let saiGayathri = 0;
    let likitha = 0;
    let mantras = 0;

    usersSnap.forEach((doc) => {
        const stats = doc.data()?.stats;
        if (stats) {
            gayathri += stats.gayathri || 0;
            saiGayathri += stats.saiGayathri || 0;
            likitha += stats.likitha || 0;
            mantras += stats.mantras || 0;
        }
    });

    const totalChants = gayathri + saiGayathri + likitha + mantras;

    await db.collection("national_stats").doc("2026").set(
        {
            gayathri,
            saiGayathri,
            likitha,
            mantras,
            totalChants,
            memberCount: usersSnap.size,
            lastAggregated: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    );

    console.log(`[aggregateNationalStats] Total chants: ${totalChants} across ${usersSnap.size} users.`);
}

// ─── Task 2: Update User Streaks ──────────────────────────────────────────────

/**
 * Checks each user's chanting activity for yesterday (MYT). If a user
 * submitted at least one chanting record yesterday their streak is incremented;
 * otherwise it is reset to 0. The `streakDays` field on each `users/{uid}`
 * document is updated accordingly.
 *
 * Chanting records are expected in the `chanting_records` collection with
 * documents that have the fields: `uid` (string) and `date` (string YYYY-MM-DD).
 */
async function updateUserStreaks(): Promise<void> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = toMYTDateString(yesterday);

    // Fetch all chanting records for yesterday in one query.
    const recordsSnap = await db
        .collection("chanting_records")
        .where("date", "==", yesterdayStr)
        .get();

    // Build a set of UIDs that submitted chants yesterday.
    const activeUIDs = new Set<string>();
    recordsSnap.forEach((doc) => {
        const uid = doc.data()?.uid as string | undefined;
        if (uid) activeUIDs.add(uid);
    });

    // Update every user's streak in batches (Firestore limit: 500 ops/batch).
    const usersSnap = await db.collection("users").get();
    const BATCH_SIZE = 400;
    let batch = db.batch();
    let opCount = 0;

    for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;
        const currentStreak: number = userDoc.data()?.streakDays || 0;

        const newStreak = activeUIDs.has(uid) ? currentStreak + 1 : 0;

        if (newStreak !== currentStreak) {
            batch.update(userDoc.ref, {
                streakDays: newStreak,
                lastStreakUpdate: yesterdayStr,
            });
            opCount++;

            if (opCount >= BATCH_SIZE) {
                await batch.commit();
                batch = db.batch();
                opCount = 0;
            }
        }
    }

    if (opCount > 0) {
        await batch.commit();
    }

    console.log(
        `[updateUserStreaks] ${activeUIDs.size} active users on ${yesterdayStr}. ` +
        `Processed ${usersSnap.size} users.`
    );
}

// ─── Task 3: Daily Health Log ─────────────────────────────────────────────────

/**
 * Writes a daily health snapshot to `system_logs`. Useful for monitoring
 * whether the orchestrator ran successfully each day.
 */
async function logDailyHealth(
    totalUsers: number,
    errors: string[]
): Promise<void> {
    await db.collection("system_logs").add({
        event: "daily_orchestration_complete",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        date: toMYTDateString(new Date()),
        totalUsers,
        errors,
        status: errors.length === 0 ? "ok" : "partial",
    });
}

// ─── Exported Cloud Function ──────────────────────────────────────────────────

/**
 * Daily Orchestrator
 * Triggered by Cloud Scheduler daily at 00:10 Asia/Kuala_Lumpur (MYT).
 * Runs three tasks in sequence; partial failures are caught so a single
 * failing task does not abort the others.
 */
export const dailyOrchestrator = functions.pubsub
    .schedule("10 0 * * *")
    .timeZone("Asia/Kuala_Lumpur")
    .onRun(async (_context: functions.EventContext) => {
        console.log("Daily Orchestrator started at:", new Date().toISOString());

        const errors: string[] = [];
        let totalUsers = 0;

        // Task 1 — Aggregate national chanting stats
        try {
            await aggregateNationalStats();
        } catch (err) {
            const msg = `aggregateNationalStats failed: ${(err as Error).message}`;
            console.error(msg);
            errors.push(msg);
        }

        // Task 2 — Update user streaks
        try {
            const snap = await db.collection("users").count().get();
            totalUsers = snap.data().count;
            await updateUserStreaks();
        } catch (err) {
            const msg = `updateUserStreaks failed: ${(err as Error).message}`;
            console.error(msg);
            errors.push(msg);
        }

        // Task 3 — Write health log
        try {
            await logDailyHealth(totalUsers, errors);
        } catch (err) {
            console.error("logDailyHealth failed:", (err as Error).message);
        }

        console.log(
            `Daily Orchestrator finished. Errors: ${errors.length === 0 ? "none" : errors.join(" | ")}`
        );
        return null;
    });
