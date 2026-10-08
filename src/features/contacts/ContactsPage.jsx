import React from 'react';
import { RecordsPage } from '../records/RecordsPage.jsx';
import { contactTabs, matchesContactTab } from './selectors.js';

export function ContactsPage() {
  return (
    <div className="contacts-page">
      <RecordsPage
        module="Contacts"
        tabs={contactTabs}
        matchesTab={matchesContactTab}
        emptyDetail="Try another search or choose All to show every contact."
      />
    </div>
  );
}
