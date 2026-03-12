import { User as FirebaseUser } from 'firebase/auth';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Unsubscribe
} from 'firebase/firestore';
import { APP_CONFIG } from '../constants';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

type MemberProfileSource = Partial<UserProfile> | null | undefined;

interface BuildUserProfileOptions {
  isAdmin?: boolean;
}

export const getUserProfileRef = (uid: string) => doc(db, 'users', uid);

export function buildUserProfile(
  firebaseUser: FirebaseUser,
  profileData: MemberProfileSource,
  options: BuildUserProfileOptions = {}
): UserProfile {
  const safeProfile = profileData ?? {};

  return {
    uid: firebaseUser.uid,
    name: safeProfile.name || firebaseUser.displayName || 'Devotee',
    email: safeProfile.email || firebaseUser.email || '',
    photoURL: safeProfile.photoURL || firebaseUser.photoURL || APP_CONFIG.AVATAR_MALE,
    joinedAt: safeProfile.joinedAt || new Date().toISOString(),
    isGuest: firebaseUser.isAnonymous,
    isAdmin: !!options.isAdmin,
    onboardingDone: !!safeProfile.onboardingDone,
    onboardedApp: !!safeProfile.onboardedApp,
    state: safeProfile.state || '',
    centre: safeProfile.centre || '',
    ...safeProfile
  };
}

export async function fetchMemberProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(getUserProfileRef(uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfile;
}

export function subscribeToMemberProfile(
  uid: string,
  onValue: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    getUserProfileRef(uid),
    (snapshot) => {
      onValue(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
    },
    (error) => {
      onError?.(error);
    }
  );
}

export async function hasCompletedOnboarding(uid: string): Promise<boolean> {
  const profile = await fetchMemberProfile(uid);
  return !!profile?.onboardingDone;
}

export async function upsertMemberProfile(uid: string, profile: UserProfile): Promise<void> {
  await setDoc(
    getUserProfileRef(uid),
    {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
