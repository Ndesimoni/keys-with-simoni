import { nav } from './navigation.js';

export const routes = nav.flatMap((group) =>
  group.items.map(([name]) => ({
    name,
    path: name === 'Dashboard' ? '/' : '/' + name.toLowerCase().replace(/\s+/g, '-'),
  })),
);

export const routePath = (name) => routes.find((route) => route.name === name)?.path || '/';
export const routeName = (path) =>
  routes.find(
    (route) => route.path === path.replace(/\/$/, '') || (route.path === '/' && path === '/'),
  )?.name || 'Page not found';
