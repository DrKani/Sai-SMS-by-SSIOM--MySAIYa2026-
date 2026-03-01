
import { QuoteLevelConfig } from './QuoteGameData';

export interface LevelState {
    currentIndex: number;
    score: number;
    specials: {
        [key: string]: number; // e.g., 'hint': 2 (times used)
    };
    timer: {
        type: 'standard' | 'sprint';
        endsAt: number | null; // Timestamp when timer ends
        pausedAt: number | null; // Timestamp if paused
        remainingWhenPaused: number;
    };
    history: string[]; // IDs of solved quotes
    sessionQuotes?: any[]; // Snapshot of generated quotes for sprint/random levels
    isComplete: boolean;
}

export const getLevelKey = (levelId: number) => `sms_quotes_level_${levelId}_state`;

export const loadLevelState = (levelId: number): LevelState | null => {
    const data = localStorage.getItem(getLevelKey(levelId));
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse level state", e);
            return null;
        }
    }
    return null;
};

export const saveLevelState = (levelId: number, state: LevelState) => {
    localStorage.setItem(getLevelKey(levelId), JSON.stringify(state));
};

export const clearLevelState = (levelId: number) => {
    localStorage.removeItem(getLevelKey(levelId));
};

export const getBriefcaseQuotes = (): any[] => {
    const data = localStorage.getItem('sms_briefcase_quotes');
    return data ? JSON.parse(data) : [];
};

export const saveToBriefcase = (quote: any, levelId: number) => {
    const list = getBriefcaseQuotes();
    if (!list.some((q: any) => q.id === quote.id)) {
        list.push({
            id: quote.id,
            text: quote.text,
            level: levelId,
            savedAt: new Date().toISOString(),
            module: 'quotes'
        });
        localStorage.setItem('sms_briefcase_quotes', JSON.stringify(list));
        // Dispatch storage event for dashboard sync
        window.dispatchEvent(new Event('storage'));
        return true;
    }
    return false;
};

export const syncDashboardScore = () => {
    // Calculate total score from all levels
    let totalScore = 0;
    let levelsCompleted = 0;

    for (let i = 1; i <= 10; i++) {
        const state = loadLevelState(i);
        if (state) {
            totalScore += state.score;
            if (state.isComplete) levelsCompleted++;
        }
    }

    localStorage.setItem('sms_quotes_total_score', totalScore.toString());
    localStorage.setItem('sms_quotes_levels_completed', levelsCompleted.toString());
    window.dispatchEvent(new Event('storage'));
};
