import { Icon } from '../ui/Icon.jsx';
import { labels } from '../../config/navigation.js';
import React from 'react';
import { UserAccount } from '../../features/auth/UserAccount.jsx';
import {
  useRecords,
  usePreferences,
  useNavigation,
  useWorkspaceView,
} from '../../hooks/useWorkspace.js';

function Header() {
  const { summary } = useRecords();
  const { settings, setSettings } = usePreferences();
  const { route, navigate } = useNavigation();
  const { setMobileNav, mobileNav, query, setQuery } = useWorkspaceView();
  return (
    <header className="topbar">
      <div className="top-left">
        <button
          className="hamburger"
          onClick={() => setMobileNav(!mobileNav)}
          aria-label="Toggle navigation"
          aria-expanded={mobileNav}
          aria-controls="workspace-sidebar"
        >
          <Icon name="menu" size={22} />
        </button>
        <div className="breadcrumbs">
          <span>Workspace</span>
          <Icon name="chevron" size={15} />
          <strong>{labels[route] || route}</strong>
        </div>
      </div>
      <div className="top-center">
        <Icon name="search" size={17} />
        <input
          id="global-search"
          aria-label="Search CRM records"
          placeholder="Search your workspace  ⌘ K"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query) {
              navigate('Client desk', e.currentTarget.value);
            }
          }}
        />
      </div>
      <div className="top-actions">
        <button
          className="theme-switch"
          type="button"
          aria-label={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={settings.theme === 'dark'}
          title={settings.theme === 'dark' ? 'Light mode' : 'Dark mode'}
          onClick={() =>
            setSettings((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))
          }
        >
          <Icon name={settings.theme === 'dark' ? 'sun' : 'moon'} size={18} />
          <span>{settings.theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <span className="local-tag">
          <span /> LOCAL WORKSPACE
        </span>
        <button
          aria-label="View due tasks"
          className="icon-btn notif"
          onClick={() => navigate('Follow-ups')}
        >
          <Icon name="bell" size={20} />
          {summary.dueTasks.length > 0 && <b />}
        </button>
        <UserAccount />
      </div>
    </header>
  );
}

export { Header };
