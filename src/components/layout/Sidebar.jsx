import { BrandMark } from './BrandMark.jsx';
import { nav } from '../../config/navigation.js';
import { Icon } from '../ui/Icon.jsx';
import React from 'react';
import { useNavigation, useWorkspaceView } from '../../hooks/useWorkspace.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { Drawer } from '../ui/Drawer.jsx';

function Sidebar() {
  const { route, navigate } = useNavigation();
  const { mobileNav, setMobileNav } = useWorkspaceView();
  const isMobile = useMediaQuery('(max-width: 1050px)');
  const content = (
    <aside id="workspace-sidebar" className={'sidebar ' + (mobileNav ? 'sidebar-open' : '')}>
      {isMobile && (
        <button
          className="navigation-close"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        >
          <Icon name="close" size={20} />
        </button>
      )}
      <div className="brand">
        <BrandMark />
        <div>
          <strong>
            KEYS <i>WITH</i> SIMONI
          </strong>
          <span>REAL ESTATE STUDIO</span>
        </div>
      </div>
      <div className="sidebar-hairline" />
      <nav className="nav-groups" aria-label="CRM sections">
        {nav.map((g) => (
          <div key={g.header} className="nav-group">
            <div className="nav-label">{g.header}</div>
            {g.items.map(([name, ico]) => (
              <button
                key={name}
                className={'nav-item ' + (route === name ? 'active' : '')}
                aria-current={route === name ? 'page' : undefined}
                onClick={() => {
                  navigate(name);
                  setMobileNav(false);
                }}
              >
                <Icon name={ico} size={18} />
                <span>{name}</span>
                {route === name && <span className="nav-active-dot" />}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <div className="upgrade-icon">
            <Icon name="sparkle" size={18} />
          </div>
          <h4>Your CRM, your momentum.</h4>
          <p>Every record tells part of your success story.</p>
          <button onClick={() => navigate('Guide')}>
            Explore your guide <Icon name="arrow" size={14} />
          </button>
        </div>
        <div className="side-footer">
          <span className="footer-avatar">SC</span>
          <div>
            <strong>Keys with Simoni</strong>
            <small>Independent workspace</small>
          </div>
          <Icon name="shield" size={17} />
        </div>
      </div>
    </aside>
  );
  if (!isMobile) return content;
  return mobileNav ? (
    <Drawer
      className="navigation-drawer"
      placement="side"
      titleId="navigation-title"
      onClose={() => setMobileNav(false)}
    >
      <h2 className="sr-only" id="navigation-title">
        CRM navigation
      </h2>
      {content}
    </Drawer>
  ) : null;
}

export { Sidebar };
