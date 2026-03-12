import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SmsEvent } from '../types';

export type EventDraft = Partial<SmsEvent> & {
  title: string;
  eventDate: string;
  location: string;
};

export function normalizeEvent(raw: any, id: string): SmsEvent {
  return {
    ...raw,
    eventId: id
  } as SmsEvent;
}

export function subscribeToEvents(
  onValue: (events: SmsEvent[]) => void,
  onError?: (error: Error) => void,
  direction: 'asc' | 'desc' = 'asc'
) {
  return onSnapshot(
    query(collection(db, 'calendar'), orderBy('eventDate', direction)),
    (snapshot) => {
      onValue(snapshot.docs.map((eventDoc) => normalizeEvent(eventDoc.data(), eventDoc.id)));
    },
    (error) => onError?.(error)
  );
}

export async function fetchEventById(eventId: string): Promise<SmsEvent | null> {
  const eventSnap = await getDoc(doc(db, 'calendar', eventId));
  if (!eventSnap.exists()) return null;
  return normalizeEvent(eventSnap.data(), eventSnap.id);
}

export async function registerForEvent(event: SmsEvent, userId: string): Promise<void> {
  await updateDoc(doc(db, 'calendar', event.eventId), {
    registeredUsers: arrayUnion(userId),
    registeredCount: (event.registeredCount || 0) + 1
  });
}

export async function saveEvent(eventDraft: EventDraft, createdBy: string, editingId?: string | null): Promise<void> {
  const eventData: Record<string, unknown> = {
    title: eventDraft.title,
    description: eventDraft.description || '',
    eventDate: Timestamp.fromDate(new Date(eventDraft.eventDate)),
    endDate: eventDraft.endDate ? Timestamp.fromDate(new Date(eventDraft.endDate as string)) : null,
    location: eventDraft.location,
    type: eventDraft.type || 'spiritual',
    maxAttendees: Number(eventDraft.maxAttendees) || 0,
    imageUrl: eventDraft.imageUrl || '',
    status: eventDraft.status || 'published'
  };

  if (editingId) {
    await updateDoc(doc(db, 'calendar', editingId), eventData);
    return;
  }

  await addDoc(collection(db, 'calendar'), {
    ...eventData,
    registeredCount: 0,
    registeredUsers: [],
    createdBy,
    createdAt: serverTimestamp()
  });
}

export async function deleteEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(db, 'calendar', eventId));
}
