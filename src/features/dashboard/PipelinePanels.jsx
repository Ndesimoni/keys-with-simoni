import React from 'react';
import { get } from '../../lib/records.js';
import { COLORS } from '../../config/theme.js';
import { TitleSection } from '../../components/ui/TitleSection.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { useNavigation } from '../../hooks/useWorkspace.js';

export function PipelinePanels({ data, sources, maxSource }) {
  const { navigate } = useNavigation();
  return (
    <>
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
        <TitleSection heading="Where leads come from" caption="Top channels bringing clients in" />
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
    </>
  );
}
