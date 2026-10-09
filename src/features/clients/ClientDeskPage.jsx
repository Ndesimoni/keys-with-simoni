import { selectClientDesk, selectClientTimeline } from './selectors.js';
import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Empty } from '../../components/ui/Empty.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { OverflowList } from '../../components/ui/OverflowList.jsx';
import { LabelValue } from '../../components/ui/LabelValue.jsx';
import { TitleSection } from '../../components/ui/TitleSection.jsx';
import { useRecords, useWorkspaceView, useWorkspaceActions } from '../../hooks/useWorkspace.js';
import { deriveLeadScore, leadTier } from '../../lib/crm.js';
import { compactDate, today } from '../../lib/dates.js';
import { AED } from '../../lib/format.js';
import { get, initials } from '../../lib/records.js';
import { useSession } from '../../hooks/useSession.js';
import { MessagePreviewDialog } from '../messaging/MessagePreviewDialog.jsx';
import { validPhone } from '../team/model.js';
import { hasMessagingAccess, validEmail } from '../messaging/model.js';

function ClientDeskPage() {
  const { user } = useSession();
  const [messageChannel, setMessageChannel] = useState(null);
  const { data } = useRecords();
  const { query, selectedClient, setQuery, setSelectedClient } = useWorkspaceView();
  const { add, edit, startMessage } = useWorkspaceActions();

  const { clients, client, matches } = selectClientDesk(data, query, selectedClient);
  const timeline = selectClientTimeline(data, client);

  return (
    <div className="desk-layout">
      <section className="panel desk-list">
        <div className="desk-list-title">
          <h3>Find a client</h3>
          <span>{clients.length} contacts</span>
        </div>
        <div className="search-small desk-search">
          <Icon name="search" size={17} />
          <input
            aria-label="Search clients in client desk"
            placeholder="Name, phone or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <OverflowList
          mode="scroll"
          className="client-picker-list"
          key={query}
          items={clients}
          getKey={(c) => get(c, 'Client ID')}
          activeKey={client && get(client, 'Client ID')}
          label="Client desk contacts"
          listClassName="desk-clients"
          renderItem={(c, _index, { close }) => (
            <button
              type="button"
              className={
                'desk-client ' +
                (client && get(c, 'Client ID') === get(client, 'Client ID') ? 'selected' : '')
              }
              onClick={() => {
                setSelectedClient(get(c, 'Client ID'));
                close();
              }}
            >
              <span className="avatar">{initials(get(c, 'Full name'))}</span>
              <div>
                <strong>{get(c, 'Full name')}</strong>
                <small>{get(c, 'Preferred communities') || 'Location not selected'}</small>
              </div>
              <Icon name="chevron" size={16} />
            </button>
          )}
        />
        {!clients.length && <Empty title="No clients found" />}
        <Button variant="light" icon="plus" className="full-width" onClick={() => add('Clients')}>
          Add client
        </Button>
      </section>
      <div className="desk-body">
        {client ? (
          <>
            <section className="panel profile-hero">
              <div className="profile-head">
                <span className="big-avatar">{initials(get(client, 'Full name'))}</span>
                <div>
                  <span className="eyebrow">CLIENT PROFILE · {get(client, 'Client ID')}</span>
                  <h2>{get(client, 'Full name')}</h2>
                  <div className="profile-meta">
                    <Badge>{get(client, 'Lead stage')}</Badge>
                    <span>
                      <Icon name="pin" size={15} />
                      {get(client, 'Emirate') || 'UAE'}
                    </span>
                  </div>
                </div>
                <button className="btn btn-light" onClick={() => edit('Clients', client)}>
                  <Icon name="edit" size={16} /> Edit profile
                </button>
              </div>
              <div className="profile-stats">
                <LabelValue label="Interested in" value={get(client, 'Buy / rent')} />
                <LabelValue label="Budget up to" value={AED(get(client, 'Maximum budget AED'))} />
                <LabelValue label="Preferred area" value={get(client, 'Preferred communities')} />
                <LabelValue
                  label="Lead quality"
                  value={`${deriveLeadScore(client)}/100 · ${leadTier(client)}`}
                />
              </div>
            </section>
            <section className="panel client-message-tools">
              <TitleSection
                heading="Contact this client"
                caption="Channel access is assigned by your Super Admin. Sender accounts are not connected."
              />
              <div className="team-inline-actions">
                <Button
                  icon="chat"
                  disabled={!hasMessagingAccess(user)}
                  onClick={() => startMessage(client)}
                >
                  Start message
                </Button>
                <Button
                  variant="light"
                  icon="chat"
                  disabled={!user.channelAccess.whatsapp || !validPhone(client.phone)}
                  onClick={() => setMessageChannel('whatsapp')}
                >
                  Preview WhatsApp message
                </Button>
                <Button
                  variant="light"
                  icon="note"
                  disabled={!user.channelAccess.email || !validEmail(client.email)}
                  onClick={() => setMessageChannel('email')}
                >
                  Preview client email
                </Button>
              </div>
              <p className="team-muted">
                WhatsApp: {user.channelAccess.whatsapp ? 'Allowed' : 'Not allowed'} · Email:{' '}
                {user.channelAccess.email ? 'Allowed' : 'Not allowed'}. Previews do not send
                messages.
              </p>
            </section>
            {user.permissions.properties && (
              <>
                <section className="panel">
                  <TitleSection
                    heading="Curated property matches"
                    caption="Filtered by location, purpose and maximum budget"
                    action={<span className="mini-count">{matches.length} matches</span>}
                  />
                  {matches.length ? (
                    <OverflowList
                      mode="scroll"
                      className="match-results-list"
                      key={get(client, 'Client ID')}
                      items={matches}
                      getKey={(p) => get(p, 'Property ID')}
                      label="Matching properties"
                      listClassName="match-grid"
                      renderItem={(p, _index, { close }) => (
                        <div className="match-card">
                          <div className="match-top">
                            <span className="match-icon">
                              <Icon name="building" size={18} />
                            </span>
                            <Badge>{get(p, 'Listing status')}</Badge>
                          </div>
                          <h4>{get(p, 'Listing title')}</h4>
                          <div className="match-where">
                            <Icon name="pin" size={14} />
                            {get(p, 'Community')}
                          </div>
                          <div className="match-foot">
                            <strong>{AED(get(p, 'Price / annual rent AED'))}</strong>
                            <button
                              onClick={() => {
                                close();
                                add('Shortlist', {
                                  client_id: get(client, 'Client ID'),
                                  property_id: get(p, 'Property ID'),
                                  date_sent: today(),
                                  client_response: 'Pending',
                                });
                              }}
                            >
                              Shortlist <Icon name="plus" size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    />
                  ) : (
                    <Empty
                      title="No exact matches found"
                      detail="Adjust the client's budget or locations, or add more properties to your portfolio."
                      icon="home"
                    />
                  )}
                </section>
              </>
            )}
            {user.permissions.schedule && (
              <section className="panel">
                <TitleSection
                  heading="Relationship timeline"
                  caption="Recent calls, tasks and scheduled viewings"
                />
                <div className="timeline">
                  {timeline.map((item, i) => (
                    <div className="timeline-item" key={i}>
                      <span className="timeline-dot">
                        <Icon name={item.icon} size={15} />
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.detail || '—'}</p>
                      </div>
                      <time>{compactDate(item.date)}</time>
                    </div>
                  ))}
                  {!timeline.length && <div className="mini-quiet">No activity yet.</div>}
                </div>
              </section>
            )}
          </>
        ) : (
          <Empty
            title="Select a client"
            detail="Choose a client on the left to see profile details and property matches."
            icon="users"
          />
        )}
      </div>
      {messageChannel && client && (
        <MessagePreviewDialog
          channel={messageChannel}
          recipient={{
            name: client.full_name || 'Client',
            phone: client.phone,
            email: client.email,
          }}
          onClose={() => setMessageChannel(null)}
        />
      )}
    </div>
  );
}

export { ClientDeskPage };
