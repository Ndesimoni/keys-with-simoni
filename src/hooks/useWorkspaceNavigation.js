import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { labels } from '../config/navigation.js';
import { routeName, routePath } from '../config/routes.js';

export function useWorkspaceNavigation() {
  const { pathname, search } = useLocation();
  const go = useNavigate();
  const route = routeName(pathname);
  const initialQuery = new URLSearchParams(search).get('q') || '';
  const navigate = useCallback(
    (name, query = '') => {
      go(routePath(name) + (query ? '?q=' + encodeURIComponent(query) : ''));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [go],
  );
  useEffect(() => {
    document.title = `${labels[route] || route} · Keys with Simoni`;
  }, [route]);
  return useMemo(() => ({ route, navigate, initialQuery }), [route, navigate, initialQuery]);
}
