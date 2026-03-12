import { collection, getDocs } from 'firebase/firestore';
import { ANNUAL_STUDY_PLAN } from '../constants';
import { db } from './firebase';
import { BookClubWeek } from '../types';

export const STUDY_PLAN_CACHE_KEY = 'sms_bookclub_weeks';
export const STUDY_PLAN_FIRESTORE_CACHE_KEY = 'sms_bookclub_fs_cache';
export const STUDY_PLAN_FIRESTORE_CACHE_TTL = 4 * 60 * 60 * 1000;

export function sanitizeBookClubWeek(week: any): BookClubWeek {
  return {
    ...week,
    questions: Array.isArray(week.questions) ? week.questions : [],
    learningOutcomes: Array.isArray(week.learningOutcomes) ? week.learningOutcomes : [],
    reflectionPrompts: Array.isArray(week.reflectionPrompts) ? week.reflectionPrompts : [],
  };
}

export function getCachedStudyPlanOverrides(): BookClubWeek[] {
  try {
    return JSON.parse(localStorage.getItem(STUDY_PLAN_CACHE_KEY) || '[]') as BookClubWeek[];
  } catch {
    return [];
  }
}

export function buildStudyPlanBaseline(dynamicWeeks = getCachedStudyPlanOverrides()): BookClubWeek[] {
  const merged = ANNUAL_STUDY_PLAN.map((week) => {
    const dynamicWeek = dynamicWeeks.find((entry) => entry.weekId === week.weekId);
    return sanitizeBookClubWeek(dynamicWeek ? { ...week, ...dynamicWeek } : week);
  });

  dynamicWeeks.forEach((dynamicWeek) => {
    if (!merged.find((week) => week.weekId === dynamicWeek.weekId)) {
      merged.push(sanitizeBookClubWeek(dynamicWeek));
    }
  });

  return merged.sort((a, b) => a.weekId.localeCompare(b.weekId));
}

export async function fetchStudyPlanOverrides(): Promise<Record<string, BookClubWeek>> {
  try {
    const raw = localStorage.getItem(STUDY_PLAN_FIRESTORE_CACHE_KEY);
    if (raw) {
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts < STUDY_PLAN_FIRESTORE_CACHE_TTL && data && Object.keys(data).length > 0) {
        return data;
      }
    }
  } catch {
    // Ignore corrupt cache and fall through to Firestore.
  }

  const snapshot = await getDocs(collection(db, 'bookclubWeeks'));
  const firestoreMap: Record<string, BookClubWeek> = {};
  snapshot.docs.forEach((entry) => {
    firestoreMap[entry.id] = sanitizeBookClubWeek(entry.data());
  });

  try {
    localStorage.setItem(
      STUDY_PLAN_FIRESTORE_CACHE_KEY,
      JSON.stringify({ data: firestoreMap, ts: Date.now() })
    );
  } catch {
    // Ignore storage quota issues.
  }

  return firestoreMap;
}
