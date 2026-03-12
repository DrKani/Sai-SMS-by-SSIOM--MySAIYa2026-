import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const getJournalEncouragementCallable = httpsCallable<{ content: string }, { text: string }>(
  functions,
  'getJournalEncouragement'
);

export async function getJournalEncouragement(content: string): Promise<string> {
  const result = await getJournalEncouragementCallable({ content });
  return result.data.text;
}
