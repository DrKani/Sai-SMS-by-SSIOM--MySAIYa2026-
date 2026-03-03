import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, Loader2, CheckCircle2 } from 'lucide-react';
import { getOfflineSubmissions, removeOfflineSubmission } from '../lib/offlineQueue';
import { recordSadhanaOffering } from '../lib/nationalStats';
import { doc, setDoc, increment as firebaseIncrement } from 'firebase/firestore';
import { db } from '../lib/firebase';

const OfflineBanner: React.FC = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [pendingCount, setPendingCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'' | 'success' | 'error'>('');

    const checkPending = async () => {
        try {
            const submissions = await getOfflineSubmissions();
            setPendingCount(submissions.length);
        } catch (e) {
            console.warn("Could not check offline queue:", e);
        }
    };

    useEffect(() => {
        checkPending();

        const handleOnline = () => {
            setIsOffline(false);
            triggerSync();
        };

        const handleOffline = () => {
            setIsOffline(true);
        };

        const handleNewSubmission = () => {
            checkPending();
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('offline_submission_added', handleNewSubmission);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('offline_submission_added', handleNewSubmission);
        };
    }, []);

    const triggerSync = async () => {
        const submissions = await getOfflineSubmissions();
        if (submissions.length === 0) return;

        setIsSyncing(true);
        setSyncStatus('');

        try {
            for (const sub of submissions) {
                // 1. Sync National Stats
                await recordSadhanaOffering(sub.userId, sub.state, sub.realChantCount);

                // 2. Sync Personal Stats
                const userRef = doc(db, 'users', sub.userId);
                await setDoc(userRef, {
                    stats: {
                        [sub.type]: firebaseIncrement(sub.value)
                    }
                }, { merge: true });

                // Remove from queue
                await removeOfflineSubmission(sub.id!);
            }

            setSyncStatus('success');
            setTimeout(() => setSyncStatus(''), 3000);
        } catch (error) {
            console.error("Sync failed:", error);
            setSyncStatus('error');
        } finally {
            setIsSyncing(false);
            checkPending(); // Refresh count
        }
    };

    if (!isOffline && pendingCount === 0 && !isSyncing && syncStatus === '') return null;

    return (
        <div className="fixed top-20 left-0 right-0 z-[40] flex justify-center p-2 pointer-events-none">
            <div className="bg-navy-900 border border-gold-500 rounded-2xl shadow-2xl p-4 max-w-sm w-full pointer-events-auto flex items-center justify-between gap-4 animate-in slide-in-from-top fade-in duration-300">

                <div className="flex items-center gap-3">
                    {isSyncing ? (
                        <Loader2 size={24} className="text-gold-500 animate-spin" />
                    ) : syncStatus === 'success' ? (
                        <CheckCircle2 size={24} className="text-teal-400" />
                    ) : isOffline ? (
                        <WifiOff size={24} className="text-red-400 animate-pulse" />
                    ) : (
                        <Wifi size={24} className="text-gold-500" />
                    )}

                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                            {isSyncing ? 'Syncing...' : syncStatus === 'success' ? 'Sync Complete' : isOffline ? 'Offline Mode' : 'Online'}
                        </span>
                        {pendingCount > 0 && !isSyncing && (
                            <span className="text-[10px] text-navy-200">
                                {pendingCount} offering{pendingCount !== 1 && 's'} pending
                            </span>
                        )}
                    </div>
                </div>

                {pendingCount > 0 && !isOffline && !isSyncing && (
                    <button
                        onClick={triggerSync}
                        className="px-4 py-2 bg-gold-gradient text-navy-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg"
                    >
                        Sync Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default OfflineBanner;
