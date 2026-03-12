import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { JournalEntry } from '../types';

export interface StoredJournalEntry extends JournalEntry {
  uid: string;
  userName?: string;
  isShared?: boolean;
  visibility?: 'private' | 'shared';
  createdAt?: unknown;
}

export function subscribeToUserJournalEntries(
  uid: string,
  onValue: (entries: StoredJournalEntry[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    query(collection(db, 'journals'), where('uid', '==', uid)),
    (snapshot) => {
      onValue(
        snapshot.docs
          .map((entryDoc) => ({ id: entryDoc.id, ...entryDoc.data() } as StoredJournalEntry))
          .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
      );
    },
    (error) => onError?.(error)
  );
}

export async function addJournalEntry(entry: StoredJournalEntry): Promise<void> {
  await addDoc(collection(db, 'journals'), {
    ...entry,
    visibility: entry.visibility || 'private',
    isShared: entry.isShared ?? false,
    createdAt: serverTimestamp()
  });
}

export async function deleteJournalEntry(entryId: string): Promise<void> {
  await deleteDoc(doc(db, 'journals', entryId));
}
