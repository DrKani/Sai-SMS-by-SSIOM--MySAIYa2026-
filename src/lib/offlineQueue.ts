export interface OfflineSubmission {
    id?: number;
    userId: string;
    state: string;
    type: 'gayathri' | 'saiGayathri' | 'likitha';
    value: number;
    realChantCount: number;
    timestamp: number;
}

const DB_NAME = 'SaiSMS_OfflineDB';
const STORE_NAME = 'sadhana_submissions';

export const saveOfflineSubmission = async (submission: Omit<OfflineSubmission, 'id' | 'timestamp'>): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const addReq = store.add({ ...submission, timestamp: Date.now() });
            addReq.onsuccess = () => resolve();
            addReq.onerror = () => reject(addReq.error);
        };
        request.onerror = () => reject(request.error);
    });
};

export const getOfflineSubmissions = async (): Promise<OfflineSubmission[]> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                return resolve([]);
            }
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const getReq = store.getAll();
            getReq.onsuccess = () => resolve(getReq.result);
            getReq.onerror = () => reject(getReq.error);
        };
        request.onerror = () => reject(request.error);
    });
};

export const removeOfflineSubmission = async (id: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onsuccess = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                return resolve();
            }
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const delReq = store.delete(id);
            delReq.onsuccess = () => resolve();
            delReq.onerror = () => reject(delReq.error);
        };
        request.onerror = () => reject(request.error);
    });
};
