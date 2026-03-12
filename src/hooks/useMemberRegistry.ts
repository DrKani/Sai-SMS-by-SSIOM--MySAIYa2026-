import { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { subscribeToMemberProfile } from '../services/memberService';

interface UseMemberRegistryResult {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
}

export function useMemberRegistry(uid?: string | null): UseMemberRegistryResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(uid));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    return subscribeToMemberProfile(
      uid,
      (nextProfile) => {
        setProfile(nextProfile);
        setIsLoading(false);
      },
      (nextError) => {
        setError(nextError);
        setIsLoading(false);
      }
    );
  }, [uid]);

  return { profile, isLoading, error };
}
