import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
  increment as firebaseIncrement,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { recordSadhanaOffering, toMantraType } from '../lib/nationalStats';
import { UserProfile } from '../types';

export type SadhanaType = 'gayathri' | 'saiGayathri' | 'likitha';

export interface SadhanaSubmissionInput {
  user: UserProfile;
  type: SadhanaType;
  amount: number;
  submittedAt?: Date;
}

export interface DuplicateSubmissionCheck {
  exists: boolean;
  date: string;
}

function assertAuthenticatedUser(user: UserProfile | null | undefined): asserts user is UserProfile {
  if (!user?.uid || user.isGuest) {
    throw new Error('AUTH_REQUIRED');
  }
}

function assertValidAmount(type: SadhanaType, amount: number): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('INVALID_AMOUNT');
  }

  if (type === 'likitha' && !Number.isInteger(amount)) {
    throw new Error('INVALID_AMOUNT');
  }
}

function toSubmissionDate(date: Date): string {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
}

export async function findDuplicateSubmission({
  userId,
  type,
  count,
  date,
}: {
  userId: string;
  type: SadhanaType;
  count: number;
  date: string;
}): Promise<DuplicateSubmissionCheck> {
  const dupQuery = query(
    collection(db, 'sadhanaDaily'),
    where('uid', '==', userId),
    where('type', '==', type),
    where('count', '==', count),
    where('date', '==', date),
    limit(1)
  );

  const duplicateSnap = await getDocs(dupQuery);
  return { exists: !duplicateSnap.empty, date };
}

export async function submitSadhanaOffering(input: SadhanaSubmissionInput): Promise<void> {
  assertAuthenticatedUser(input.user);
  assertValidAmount(input.type, input.amount);

  const submittedAt = input.submittedAt || new Date();
  const date = toSubmissionDate(submittedAt);
  const timestamp = submittedAt.toISOString();
  const user = input.user;
  const amount = input.amount;
  const chantCount = input.type === 'likitha' ? amount * 11 : amount;

  await recordSadhanaOffering(
    user.uid,
    user.state || 'Other',
    chantCount,
    toMantraType(input.type),
    user.centre || 'Unknown'
  );

  const userRef = doc(db, 'users', user.uid);
  const lastActivityStr = user.lastActivity ? toSubmissionDate(new Date(user.lastActivity)) : '';
  let streakUpdate: Record<string, number> = {};

  if (lastActivityStr !== date) {
    if (lastActivityStr) {
      const diffDays = Math.round(
        (new Date(date).getTime() - new Date(lastActivityStr).getTime()) / (1000 * 60 * 60 * 24)
      );
      streakUpdate = { streak: diffDays === 1 ? (user.streak || 0) + 1 : 1 };
    } else {
      streakUpdate = { streak: 1 };
    }
  }

  await setDoc(
    userRef,
    {
      stats: {
        [input.type]: firebaseIncrement(amount),
      },
      lastActivity: timestamp,
      ...streakUpdate,
      updatedAt: timestamp,
    },
    { merge: true }
  );

  const dailyRef = doc(db, 'sadhanaDaily', `${user.uid}-${date}`);
  await setDoc(
    dailyRef,
    {
      uid: user.uid,
      userId: user.uid,
      userName: user.name,
      state: user.state || 'Other',
      centre: user.centre || 'SSIOM',
      type: input.type,
      count: firebaseIncrement(chantCount),
      units: firebaseIncrement(amount),
      timestamp,
      date,
      publicLeaderboard: user.publicLeaderboard ?? true,
      aggregatePending: true,
      updatedAt: timestamp,
    },
    { merge: true }
  );
}
