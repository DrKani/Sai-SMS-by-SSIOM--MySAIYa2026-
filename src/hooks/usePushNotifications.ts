import { useState, useEffect } from 'react';
import { getToken } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { messaging, db } from '../lib/firebase';
import { UserProfile } from '../types';

export const usePushNotifications = (user: UserProfile | null) => {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!user || user.isGuest) return false;
        if (!('Notification' in window)) {
            console.error('This browser does not support desktop notification');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission === 'granted' && messaging) {
                // Get registration token.
                const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
                if (!vapidKey || vapidKey === 'YOUR_VAPID_KEY_HERE') {
                    console.warn('VAPID key is missing; cannot get FCM token.');
                    return false;
                }
                const currentToken = await getToken(messaging, { vapidKey });

                if (currentToken) {
                    await updateDoc(doc(db, 'users', user.uid), {
                        fcmTokens: arrayUnion(currentToken),
                        notificationsEnabled: true
                    });

                    // Update local storage user slightly if necessary
                    const updatedUser = { ...user, notificationsEnabled: true };
                    localStorage.setItem('sms_user', JSON.stringify(updatedUser));
                    return true;
                } else {
                    console.warn('No registration token available. Request permission to generate one.');
                }
            }
        } catch (error) {
            console.error('An error occurred while retrieving token. ', error);
        }
        return false;
    };

    return { permissionStatus, requestPermission };
};
