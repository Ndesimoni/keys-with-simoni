import React, { useCallback, useMemo, useState } from 'react';
import { SessionContext } from './SessionContext.js';
import { sessionRepository } from '../services/storage/sessionRepository.js';
import { signInDemo } from '../services/auth/demoAuth.js';

export function SessionProvider({ children, repository = sessionRepository }) {
  const [user, setUser] = useState(() => repository.load());
  const signIn = useCallback(
    (email, password) => {
      const profile = signInDemo(email, password);
      try {
        repository.save(profile.id);
      } catch {
        throw Error(
          'Your browser could not save the session. Allow browser storage and try again.',
        );
      }
      setUser(profile);
    },
    [repository],
  );
  const signOut = useCallback(() => {
    try {
      repository.clear();
    } catch {
      throw Error('Your browser could not clear the session. Please try signing out again.');
    }
    setUser(null);
  }, [repository]);
  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
