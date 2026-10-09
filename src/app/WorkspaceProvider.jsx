import React, { useMemo } from 'react';
import { useWorkspaceData } from '../hooks/useWorkspaceData.js';
import { useWorkspacePreferences } from '../hooks/useWorkspacePreferences.js';
import { useWorkspaceNavigation } from '../hooks/useWorkspaceNavigation.js';
import { useWorkspaceViewState } from '../hooks/useWorkspaceViewState.js';
import { useRecordActions } from '../hooks/useRecordActions.js';
import { useCalendarSync } from '../hooks/useCalendarSync.js';
import { selectWorkspaceSummary } from '../lib/workspace.js';
import { StorageRecovery } from '../components/ui/StorageRecovery.jsx';
import {
  RecordsContext,
  PreferencesContext,
  NavigationContext,
  ViewContext,
  ActionsContext,
  CalendarContext,
} from './WorkspaceContext.js';

export function WorkspaceProvider({ children }) {
  const workspace = useWorkspaceData();
  const preferences = useWorkspacePreferences();
  const navigation = useWorkspaceNavigation();
  const view = useWorkspaceViewState(navigation.route, navigation.initialQuery);
  const calendar = useCalendarSync(workspace);
  const actions = useRecordActions(
    workspace,
    view,
    navigation.navigate,
    Boolean(calendar.status.connected && calendar.status.calendar),
  );
  const summary = useMemo(() => selectWorkspaceSummary(workspace.data), [workspace.data]);
  const records = useMemo(
    () => ({
      db: workspace.db,
      setDb: workspace.setDb,
      data: workspace.data,
      summary,
      storageError: workspace.storageError,
      retryStorage: workspace.retryStorage,
    }),
    [
      workspace.db,
      workspace.setDb,
      workspace.data,
      summary,
      workspace.storageError,
      workspace.retryStorage,
    ],
  );
  const preferenceValue = useMemo(
    () => preferences,
    [preferences.settings, preferences.setSettings, preferences.preferencesError],
  );
  if (workspace.recovery.error)
    return (
      <StorageRecovery
        recovery={workspace.recovery}
        retryLoad={workspace.retryLoad}
        startEmpty={workspace.startEmpty}
      />
    );
  return (
    <RecordsContext.Provider value={records}>
      <PreferencesContext.Provider value={preferenceValue}>
        <NavigationContext.Provider value={navigation}>
          <ViewContext.Provider value={view}>
            <ActionsContext.Provider value={actions}>
              <CalendarContext.Provider value={calendar}>{children}</CalendarContext.Provider>
            </ActionsContext.Provider>
          </ViewContext.Provider>
        </NavigationContext.Provider>
      </PreferencesContext.Provider>
    </RecordsContext.Provider>
  );
}
