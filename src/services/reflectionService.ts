import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Reflection } from '../types';

export function subscribeToApprovedReflections(
  onValue: (reflections: Reflection[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(collection(db, 'reflections'), orderBy('timestamp', 'desc')),
    (snapshot) => {
      onValue(
        snapshot.docs
          .map((reflectionDoc) => ({ id: reflectionDoc.id, ...reflectionDoc.data() } as Reflection))
          .filter((reflection) => reflection.status === 'approved')
          .slice(0, 3)
      );
    },
    (error) => onError?.(error)
  );
}

export async function fetchAllReflections(): Promise<Reflection[]> {
  const snapshot = await getDocs(collection(db, 'reflections'));
  return snapshot.docs
    .map((reflectionDoc) => ({ id: reflectionDoc.id, ...reflectionDoc.data() } as Reflection))
    .sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
}

export async function updateReflection(reflectionId: string, updates: Partial<Reflection>): Promise<void> {
  await updateDoc(doc(db, 'reflections', reflectionId), updates);
}

export async function createReflection(reflection: Omit<Reflection, 'id' | 'timestamp'> & { timestamp?: string }): Promise<void> {
  await addDoc(collection(db, 'reflections'), {
    ...reflection,
    timestamp: serverTimestamp()
  });
}
