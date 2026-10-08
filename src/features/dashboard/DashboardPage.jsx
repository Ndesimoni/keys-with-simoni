import { selectDashboard } from './selectors.js';
import { SUM, clName, get, prName } from '../../lib/records.js';
import { compactDate } from '../../lib/dates.js';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Metric } from '../../components/ui/Metric.jsx';
import { AED, N } from '../../lib/format.js';
import { TitleSection } from '../../components/ui/TitleSection.jsx';
import { isDue } from '../../lib/crm.js';
import { Empty } from '../../components/ui/Empty.jsx';
import { COLORS } from '../../config/theme.js';
import React from 'react';
import {
  useRecords,
  useNavigation,
  useWorkspaceView,
  useWorkspaceActions,
} from '../../hooks/useWorkspace.js';

function DashboardPage() {
  const { data, summary } = useRecords();
  const { navigate } = useNavigation();
  const { reportMonth, setReportMonth } = useWorkspaceView();
  const { add, dispatchRow } = useWorkspaceActions();

  const { completed, active, monthlyIncome, sources, maxSource, monthly, maxBar } = selectDashboard(
    data,
    summary,
    reportMonth,
  );
  const nameOfTask = (task) => clName(data, get(task, 'Client ID'));
  return (
    <div className="page-stack">
      <div className="welcome">
        <div className="welcome-copy">
          <div className="welcome-eyebrow">
            <span className="small-gold-line" /> YOUR REAL ESTATE COMMAND CENTRE
          </div>
          <h1>
            Make every connection <em>count.</em>
          </h1>
          <p>
            Relationships, opportunities, and everything in between — thoughtfully organized in one
            place.
          </p>
          <div className="welcome-actions">
            <Button icon="plus" onClick={() => add('Clients')}>
              Add new lead
            </Button>
            <Button icon="arrow" variant="outline-light" onClick={() => navigate('Client desk')}>
              Explore workspace
            </Button>
          </div>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-ring ring-one" />
          <div className="art-ring ring-two" />
          <div className="tower tower-a" />
          <div className="tower tower-b" />
          <div className="tower tower-c" />
          <div className="tower tower-d" />
          <div className="art-baseline" />
          <div className="art-stamp">K / S</div>
        </div>
      </div>
      <div className="subhead-row">
        <div>
          <h2>Your business, at a glance</h2>
          <p>Real-time figures from your CRM records</p>
        </div>
        <label className="date-select">
          <Icon name="calendar" size={16} />
          <input
            aria-label="Reporting month"
            type="month"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
          />
        </label>
      </div>
      <div className="metrics-grid">
        <Metric
          name="ACTIVE LEADS"
          icon="users"
          value={N(summary.openLeads.length)}
          sub={`${summary.hot.length} high-priority lead${summary.hot.length === 1 ? '' : 's'}`}
          accent="mint"
        />
        <Metric
          name="OPEN DEALS"
          icon="briefcase"
          value={N(active.length)}
          sub={`${completed.length} completed transactions`}
          accent="sky"
        />
        <Metric
          name="FOLLOW-UPS DUE"
          icon="bell"
          value={N(summary.dueTasks.length)}
          sub="Today & overdue"
          accent="rose"
        />
        <Metric
          name="FEES RECEIVED"
          icon="wallet"
          value={AED(monthlyIncome)}
          sub="Selected reporting month"
          accent="sand"
        />
      </div>
      <div className="split-main">
        <section className="panel revenue-panel">
          <TitleSection
            heading="Commission performance"
            caption="Fee receipts across the last six months"
            action={
              <button className="text-action" onClick={() => navigate('Performance')}>
                View reports <Icon name="arrow" size={15} />
              </button>
            }
          />
          <div className="chart-total">
            <strong>{AED(SUM(monthly, (x) => x.amount))}</strong>
            <span>Last 6 months · Excluding VAT</span>
          </div>
          <div className="column-chart">
            {monthly.map((x, i) => (
              <div className="column-group" key={x.month}>
                <div className="column-space">
                  <div
                    className={'column-bar ' + (i === monthly.length - 1 ? 'last' : '')}
                    style={{ height: Math.max(5, (x.amount / maxBar) * 100) + '%' }}
                    title={`${x.month}: ${AED(x.amount)}`}
                  />
                </div>
                <small>
                  {new Date(x.month + '-01').toLocaleDateString('en-AE', { month: 'short' })}
                </small>
              </div>
            ))}
          </div>
          <div className="mini-insights">
            <div>
              <span>Earned fees to date</span>
              <strong>{AED(summary.earned)}</strong>
            </div>
            <div>
              <span>Outstanding commission</span>
              <strong>{AED(summary.outstanding)}</strong>
            </div>
            <div>
              <span>Operating costs</span>
              <strong>{AED(summary.expenses)}</strong>
            </div>
          </div>
        </section>
        <section className="panel activity-panel">
          <TitleSection
            heading="Your priorities"
            caption="The next conversations worth having"
            action={
              <button className="text-action" onClick={() => navigate('Follow-ups')}>
                All tasks <Icon name="arrow" size={15} />
              </button>
            }
          />
          <div className="todo-list">
            {[...summary.dueTasks, ...summary.tasks.filter((r) => !isDue(r))]
              .slice(0, 5)
              .map((t, i) => (
                <button className="todo-row" key={i} onClick={() => dispatchRow('Follow-ups', t)}>
                  <span className={'todo-indicator ' + (isDue(t) ? 'overdue' : '')}>
                    <Icon name={isDue(t) ? 'bell' : 'check'} size={16} />
                  </span>
                  <div>
                    <strong>{get(t, 'Next action') || 'Contact client'}</strong>
                    <span>
                      {nameOfTask(t)} · {compactDate(get(t, 'Due date'))}
                    </span>
                  </div>
                  <Icon name="chevron" size={16} />
                </button>
              ))}
            {!summary.tasks.length && (
              <Empty
                title="You're all caught up"
                detail="No pending follow-ups. Add one to keep momentum going."
                icon="check"
              />
            )}
          </div>
          <button className="add-inline" onClick={() => add('Follow-ups')}>
            <Icon name="plus" size={16} /> Create follow-up
          </button>
        </section>
      </div>
      <div className="triple-grid">
        <section className="panel">
          <TitleSection heading="Deal pipeline" caption="Where your active opportunities stand" />
          <div className="pipeline-list">
            {['New', 'Negotiation', 'Documentation', 'Offer', 'Completed'].map((stage, i) => {
              const n = data.Deals.filter(
                (d) => String(get(d, 'Deal stage') || '').toLowerCase() === stage.toLowerCase(),
              ).length;
              return (
                <div key={stage} className="bar-row">
                  <div className="bar-label">
                    <span>{stage}</span>
                    <strong>{n}</strong>
                  </div>
                  <div className="bar-track">
                    <div
                      style={{
                        width: (n / Math.max(1, data.Deals.length)) * 100 + '%',
                        background: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <button className="panel-link" onClick={() => navigate('Deals')}>
            Manage deals <Icon name="arrow" size={16} />
          </button>
        </section>
        <section className="panel">
          <TitleSection
            heading="Where leads come from"
            caption="Top channels bringing clients in"
          />
          <div className="pipeline-list">
            {sources.slice(0, 5).map((src, i) => (
              <div className="bar-row" key={src.name}>
                <div className="bar-label">
                  <span>{src.name}</span>
                  <strong>{src.count}</strong>
                </div>
                <div className="bar-track">
                  <div
                    style={{
                      width: (src.count / maxSource) * 100 + '%',
                      background: COLORS[(i + 1) % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
            {!sources.length && <span className="muted">No lead sources recorded.</span>}
          </div>
          <button className="panel-link" onClick={() => navigate('CRM insights')}>
            Explore insights <Icon name="arrow" size={16} />
          </button>
        </section>
        <section className="panel next-viewings">
          <TitleSection heading="Upcoming viewings" caption="Your next scheduled appointments" />
          <div className="viewing-list">
            {summary.upcoming.slice(0, 3).map((v, i) => (
              <button key={i} onClick={() => dispatchRow('Viewings', v)} className="viewing-mini">
                <span className="date-chip">
                  <b>{new Date(get(v, 'Appointment date & time')).getDate()}</b>
                  <small>
                    {new Date(get(v, 'Appointment date & time')).toLocaleDateString('en-AE', {
                      month: 'short',
                    })}
                  </small>
                </span>
                <div>
                  <strong>{prName(data, get(v, 'Property ID'))}</strong>
                  <span>{clName(data, get(v, 'Client ID'))}</span>
                </div>
                <Icon name="chevron" size={16} />
              </button>
            ))}
            {!summary.upcoming.length && (
              <div className="mini-quiet">No upcoming viewings yet.</div>
            )}
          </div>
          <button className="panel-link" onClick={() => navigate('Viewings')}>
            Open calendar <Icon name="arrow" size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}

export { DashboardPage };
