import { Sidebar } from '../components/layout/Sidebar.jsx';
import { Header } from '../components/layout/Header.jsx';
import { PageHeading } from '../components/layout/PageHeading.jsx';
import { FeatureRoutes } from './FeatureRoutes.jsx';
import { ErrorBoundary } from '../components/ui/ErrorBoundary.jsx';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ErrorBoundaryFallback } from '../components/ui/ErrorBoundaryFallback.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { RecordDetails } from '../features/records/RecordDetails.jsx';
import { RecordEditor } from '../features/records/RecordEditor.jsx';
import React from 'react';
import { WorkspaceProvider } from './WorkspaceProvider.jsx';
import {
  useRecords,
  useNavigation,
  useWorkspaceView,
  useWorkspaceActions,
  usePreferences,
} from '../hooks/useWorkspace.js';

function WorkspaceLayout() {
  const { data, storageError, retryStorage } = useRecords();
  const { route } = useNavigation();
  const { toast, setToast, detail, setDetail, drawer, setDrawer } = useWorkspaceView();
  const {
    restoreRef,
    restoreFullBackup,
    uploadRef,
    onUpload,
    edit,
    deleteRecord,
    saveRecord,
    downloadFullBackup,
    fileBusy,
  } = useWorkspaceActions();
  const { preferencesError } = usePreferences();
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to main content
      </a>
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="main-content" id="main-content" tabIndex={-1}>
          <PageHeading />
          {storageError && (
            <div className="storage-banner" role="alert">
              <strong>Changes could not be saved.</strong>
              <span>{storageError}</span>
              <Button variant="light" onClick={downloadFullBackup}>
                Export full backup
              </Button>
              <Button variant="light" onClick={retryStorage}>
                Retry saving
              </Button>
            </div>
          )}
          {preferencesError && (
            <p className="storage-banner" role="status">
              {preferencesError}
            </p>
          )}
          <ErrorBoundary key={route}>
            <FeatureRoutes />
          </ErrorBoundary>
          <footer className="main-footer">
            <span>© {new Date().getFullYear()} Keys with Simoni · Real Estate Studio</span>
            <span>Built for focus, relationships & opportunity.</span>
          </footer>
        </main>
      </div>
      <input
        ref={restoreRef}
        className="sr-only"
        type="file"
        accept=".json,application/json"
        onChange={restoreFullBackup}
      />
      <input
        ref={uploadRef}
        className="sr-only"
        type="file"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={onUpload}
      />
      {fileBusy && (
        <div className="toast" role="status">
          Reading selected file…
        </div>
      )}
      {!fileBusy && toast && (
        <div className="toast" role="status">
          <Icon name="check" size={17} />
          {toast}
          <button aria-label="Dismiss notification" onClick={() => setToast('')}>
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
      {detail && (
        <RecordDetails
          detail={detail}
          data={data}
          edit={edit}
          remove={deleteRecord}
          close={() => setDetail(null)}
        />
      )}{' '}
      {drawer && (
        <RecordEditor
          drawer={drawer}
          data={data}
          onClose={() => setDrawer(null)}
          onSave={saveRecord}
        />
      )}
    </div>
  );
}

const router = createHashRouter([
  {
    path: '*',
    element: (
      <WorkspaceProvider>
        <WorkspaceLayout />
      </WorkspaceProvider>
    ),
    errorElement: <ErrorBoundaryFallback />,
  },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
