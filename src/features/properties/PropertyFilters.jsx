import React, { useEffect, useId, useState } from 'react';
import { Icon } from '../../components/ui/Icon.jsx';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';

const fields = [
  ['Property type', 'type', 'Property type'],
  ['Emirate', 'emirate', 'Emirate'],
  ['Listing status', 'status', 'Listing status'],
  ['Completion', 'completion', 'Ready / off-plan'],
  ['Bedrooms', 'bedrooms', 'Bedrooms'],
];

export function PropertyFilters({ f, fieldValues, updateFilter, resetFilters, activeCount }) {
  const mobile = useMediaQuery('(max-width: 750px)');
  const [expanded, setExpanded] = useState(!mobile);
  const panelId = useId();
  useEffect(() => setExpanded(!mobile), [mobile]);
  return (
    <section className="inventory-filters" aria-label="Property filters">
      <div className="inventory-filter-heading">
        <button
          type="button"
          className="property-filter-toggle"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded(!expanded)}
        >
          <Icon name="filter" size={18} />
          Filter properties{activeCount > 0 && <span>{activeCount} active</span>}
          <Icon name="down" className="filter-toggle-chevron" size={14} />
        </button>
        <button
          type="button"
          className="inventory-reset"
          onClick={resetFilters}
          disabled={!activeCount && f.purpose === 'All'}
        >
          Clear all filters
        </button>
      </div>
      <div id={panelId} hidden={!expanded}>
        <div className="inventory-filter-grid">
          {fields.map(([label, key, source]) => (
            <label className="inventory-field" key={key}>
              <span>{label}</span>
              <select
                aria-label={label}
                value={f[key]}
                onChange={(event) => updateFilter(key, event.target.value)}
              >
                <option value="All">All {label.toLowerCase()}</option>
                {fieldValues(source).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label className="inventory-field">
            <span>Maximum price / rate (AED)</span>
            <input
              aria-label="Maximum price"
              type="number"
              min="0"
              value={f.maxPrice}
              placeholder="No maximum"
              onChange={(event) => updateFilter('maxPrice', event.target.value)}
            />
          </label>
        </div>
      </div>
    </section>
  );
}
