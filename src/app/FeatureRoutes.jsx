import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from '../config/routes.js';
import { MODS } from '../lib/schema.js';
import { Button } from '../components/ui/Button.jsx';
import { useNavigation } from '../hooks/useWorkspace.js';

const page = (loader, name) => lazy(() => loader().then((module) => ({ default: module[name] })));
const screens = {
  Dashboard: page(() => import('../features/dashboard/DashboardPage.jsx'), 'DashboardPage'),
  'CRM insights': page(() => import('../features/insights/InsightsPage.jsx'), 'InsightsPage'),
  'Client desk': page(() => import('../features/clients/ClientDeskPage.jsx'), 'ClientDeskPage'),
  Leads: page(() => import('../features/leads/LeadsPage.jsx'), 'LeadsPage'),
  Contacts: page(() => import('../features/contacts/ContactsPage.jsx'), 'ContactsPage'),
  'Date search': page(() => import('../features/reports/DateSearchPage.jsx'), 'DateSearchPage'),
  Performance: page(() => import('../features/reports/PerformancePage.jsx'), 'PerformancePage'),
  Guide: page(() => import('../features/guide/GuidePage.jsx'), 'GuidePage'),
  Properties: page(
    () => import('../features/properties/PropertyDirectory.jsx'),
    'PropertyDirectory',
  ),
};
const RecordsPage = page(() => import('../features/records/RecordsPage.jsx'), 'RecordsPage');

function NotFound() {
  const { navigate } = useNavigation();
  return (
    <div className="empty">
      <h2>Page not found</h2>
      <p>Choose a CRM section from the navigation.</p>
      <Button onClick={() => navigate('Dashboard')}>Back to overview</Button>
    </div>
  );
}

export function FeatureRoutes() {
  return (
    <Suspense
      fallback={
        <div className="empty" role="status">
          Loading workspace…
        </div>
      }
    >
      <Routes>
        {routes.map(({ name, path }) => {
          const Screen = screens[name];
          return (
            <Route
              key={name}
              path={path}
              element={
                Screen ? (
                  <Screen />
                ) : MODS[name] ? (
                  <RecordsPage key={name} module={name} />
                ) : (
                  <NotFound />
                )
              }
            />
          );
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
