import { descriptions, labels } from '../../config/navigation.js';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import React, { useEffect, useRef } from 'react';
import {
  useRecords,
  useNavigation,
  useWorkspaceView,
  useWorkspaceActions,
} from '../../hooks/useWorkspace.js';

function PageHeading() {
  const menuRef = useRef(null);
  const { db } = useRecords();
  const { route } = useNavigation();
  const { setShowMenu, showMenu } = useWorkspaceView();
  const {
    exportWorkbook,
    uploadRef,
    downloadFullBackup,
    restoreRef,
    downloadRaw,
    clearDemo,
    restoreDemo,
  } = useWorkspaceActions();
  const datestr = new Date().toLocaleDateString('en-AE', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  useEffect(() => {
    if (!showMenu) return;
    menuRef.current?.querySelector('.dropdown button')?.focus();
    const closeOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) setShowMenu(false);
    };
    const escape = (event) => {
      if (event.key === 'Escape') {
        setShowMenu(false);
        menuRef.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', escape);
    };
  }, [showMenu, setShowMenu]);
  return (
    <div className="page-heading">
      <div className="heading-left">
        <div className="eyebrow">
          {route === 'Dashboard'
            ? 'WELCOME BACK'
            : route === 'Guide'
              ? 'WORKSPACE HANDBOOK'
              : 'YOUR BUSINESS, CONNECTED'}
        </div>
        <h1>{labels[route] || route}</h1>
        <p>
          {route === 'Dashboard'
            ? datestr
            : descriptions[route] ||
              {
                'CRM insights': 'Understand your pipeline and make smarter decisions.',
                Performance: 'Know your numbers and set meaningful business targets.',
                'Client desk': 'A complete relationship profile and matching workspace.',
                'Date search': 'Find activity and transactions by any date range.',
                Guide: 'Master every tool in your real estate workspace.',
              }[route]}
        </p>
      </div>
      <div className="heading-actions">
        {db.demo && (
          <span className="demo-pill">
            <span /> DEMO DATA
          </span>
        )}
        <div className="menu-anchor" ref={menuRef}>
          <Button
            variant="light"
            icon="download"
            aria-expanded={showMenu}
            aria-controls="data-export-options"
            onClick={() => setShowMenu(!showMenu)}
          >
            Data & export <Icon name="down" size={14} />
          </Button>
          {showMenu && (
            <div className="dropdown" id="data-export-options" aria-label="Data and export options">
              <button
                onClick={() => {
                  exportWorkbook();
                  setShowMenu(false);
                }}
              >
                <Icon name="download" size={16} /> Export 17-sheet Excel
              </button>
              <button
                onClick={() => {
                  uploadRef.current?.click();
                  setShowMenu(false);
                }}
              >
                <Icon name="upload" size={16} /> Import Excel workbook
              </button>
              <button
                onClick={() => {
                  downloadFullBackup();
                  setShowMenu(false);
                }}
              >
                <Icon name="download" size={16} /> Full backup with photos (JSON)
              </button>
              <button
                onClick={() => {
                  restoreRef.current?.click();
                  setShowMenu(false);
                }}
              >
                <Icon name="upload" size={16} /> Restore full backup (JSON)
              </button>
              <button
                onClick={() => {
                  downloadRaw();
                  setShowMenu(false);
                }}
              >
                <Icon name="note" size={16} /> Original Excel template
              </button>
              <div className="dropdown-divider" />
              <button
                onClick={() => {
                  clearDemo();
                  setShowMenu(false);
                }}
              >
                <Icon name="plus" size={16} /> Start with blank CRM
              </button>
              <button
                onClick={() => {
                  restoreDemo();
                  setShowMenu(false);
                }}
              >
                <Icon name="sparkle" size={16} /> Restore sample records
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { PageHeading };
