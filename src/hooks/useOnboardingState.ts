import { useEffect, useRef, useState } from 'react';
import { UserProfile } from '../types';

export function useOnboardingState(user: UserProfile | null) {
  const [showAppTutorial, setShowAppTutorial] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!user || user.isGuest || user.onboardedApp) {
      setShowAppTutorial(false);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      setShowAppTutorial(true);
    }, 1500);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [user?.uid, user?.isGuest, user?.onboardedApp]);

  return {
    showAppTutorial,
    openAppTutorial: () => setShowAppTutorial(true),
    closeAppTutorial: () => setShowAppTutorial(false)
  };
}
