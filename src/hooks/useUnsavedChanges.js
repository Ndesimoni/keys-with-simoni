import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

export function useUnsavedChanges(dirty, busy = false) {
  const blocker = useBlocker(dirty || busy);
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (busy) blocker.reset();
    else if (confirm('Discard your unsaved changes and leave this page?')) blocker.proceed();
    else blocker.reset();
  }, [blocker, busy]);
  useEffect(() => {
    if (!dirty && !busy) return;
    const beforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty, busy]);
}
