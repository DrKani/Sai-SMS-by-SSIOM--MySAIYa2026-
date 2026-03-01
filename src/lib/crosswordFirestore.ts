import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { recordSadhanaOffering } from "./nationalStats";

export interface CrosswordProgressData {
    id: string;
    bestScore: number;
    difficulty: string;
    attempts: number;
    hintsUsed: number;
    completed: boolean;
    date: string;
}

export const loadCrosswordProgressFromFirestore = async (userId: string) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.crosswordProgress || {};
        }
    } catch (error) {
        console.error("Error loading crossword progress:", error);
    }
    return null;
};

export const saveCrosswordProgressToFirestore = async (
    userId: string,
    puzzleId: string,
    score: number,
    difficulty: string,
    hintsUsed: number
) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        let progress: Record<string, CrosswordProgressData> = {};
        if (docSnap.exists() && docSnap.data().crosswordProgress) {
            progress = docSnap.data().crosswordProgress;
        }

        const current = progress[puzzleId] || { id: puzzleId, bestScore: 0, attempts: 0, completed: false, hintsUsed: 0 };

        progress[puzzleId] = {
            id: puzzleId,
            bestScore: Math.max(current.bestScore, score),
            difficulty,
            attempts: current.attempts + 1,
            hintsUsed: (current.hintsUsed || 0) + hintsUsed,
            completed: current.completed || score >= 400,
            date: new Date().toISOString()
        };

        await setDoc(docRef, { crosswordProgress: progress }, { merge: true });

        // Add 108 units to national counter if it's the first time they completed it
        if (!current.completed && score >= 400) {
            let userState = "Unknown";
            try {
                const userStr = localStorage.getItem("sms_user");
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.state) userState = user.state;
                }
            } catch (e) { }
            await recordSadhanaOffering(userId, userState, 108);
        }

    } catch (error) {
        console.error("Error saving crossword progress:", error);
    }
};

export const appendSaiInsight = async (userId: string, insight: any) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        let insights: any[] = [];
        if (docSnap.exists() && docSnap.data().saiInsights) {
            insights = docSnap.data().saiInsights;
        }

        if (!insights.some((i: any) => i.word === insight.word)) {
            insights.push({
                ...insight,
                discoveredAt: new Date().toISOString()
            });
            await setDoc(docRef, { saiInsights: insights }, { merge: true });
        }
    } catch (error) {
        console.error("Error appending sai insight:", error);
    }
};
