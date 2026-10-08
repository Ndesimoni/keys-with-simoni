import { defaultPropertyFilters, propertyFieldValues, selectProperties } from './selectors.js';
import {
  isCommercialProperty,
  listingIntent,
  propertyMatchesPurpose,
  propertyPrice,
} from '../../lib/properties.js';
import { get } from '../../lib/records.js';
import { Icon } from '../../components/ui/Icon.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { propertyListingTags } from '../../config/properties.js';
import { N } from '../../lib/format.js';
import { RecordTable } from '../records/RecordTable.jsx';
import { mediaPhotos } from '../../lib/media.js';
import { Badge } from '../../components/ui/Badge.jsx';
import { Empty } from '../../components/ui/Empty.jsx';
import React from 'react';
import { useRecords, useWorkspaceView, useWorkspaceActions } from '../../hooks/useWorkspace.js';

function PropertyDirectory() {
  const { data } = useRecords();
  const {
    query,
    setPropertyFilters,
    setPage,
    setQuery,
    propertyFilters,
    sort,
    viewMode,
    setViewMode,
  } = useWorkspaceView();
  const { add, dispatchRow } = useWorkspaceActions();

  const all = data.Properties || [];
  const queryText = query.trim().toLowerCase();
  const countByPurpose = (key) => all.filter((p) => propertyMatchesPurpose(p, key)).length;
  const fieldValues = (label) => propertyFieldValues(all, label);
  const updateFilter = (name, value) => {
    setPropertyFilters((previous) => ({ ...previous, [name]: value }));
    setPage(0);
  };
  const resetFilters = () => {
    setPropertyFilters(defaultPropertyFilters());
    setQuery('');
    setPage(0);
  };
  const f = propertyFilters;
  const result = selectProperties(data, { filters: f, query, sort });
  const activeCount =
    Object.entries(f).filter(([k, v]) => k !== 'purpose' && v !== '' && v !== 'All').length +
    (queryText ? 1 : 0);
  const filterSelect = (label, key, options) => (
    <label className="inventory-field">
      <span>{label}</span>
      <select aria-label={label} value={f[key]} onChange={(e) => updateFilter(key, e.target.value)}>
        <option value="All">All {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <div className="page-stack inventory-page">
      <div className="inventory-hero">
        <div>
          <span className="inventory-overline">
            <Icon name="building" size={14} /> PROPERTY COLLECTION
          </span>
          <h2>
            The right space. <em>Every detail.</em>
          </h2>
          <p>
            Curate a standout portfolio with photos, floor plans, amenities and accurate listing
            details.
          </p>
        </div>
        <div className="inventory-hero-right">
          <span>PORTFOLIO INVENTORY</span>
          <strong>{String(all.length).padStart(2, '0')}</strong>
          <small>properties in your workspace</small>
          <Button icon="plus" onClick={() => add('Properties')}>
            Add property
          </Button>
        </div>
      </div>
      <div className="property-purpose-bar" role="group" aria-label="Filter by listing purpose">
        {propertyListingTags.map((item) => (
          <button
            key={item.key}
            className={'purpose-pill ' + (f.purpose === item.key ? 'selected' : '')}
            aria-pressed={f.purpose === item.key}
            onClick={() => updateFilter('purpose', item.key)}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
            <b>{countByPurpose(item.key)}</b>
          </button>
        ))}
      </div>
      <div className="inventory-filters">
        <div className="inventory-filter-heading">
          <div>
            <Icon name="filter" size={18} />
            <strong>Refine your properties</strong>
            <span>Find exactly what your client needs</span>
          </div>
          <button
            className="inventory-reset"
            onClick={resetFilters}
            disabled={!activeCount && f.purpose === 'All'}
          >
            Clear all filters
          </button>
        </div>
        <div className="inventory-filter-grid">
          {filterSelect('Property type', 'type', fieldValues('Property type'))}
          {filterSelect('Emirate', 'emirate', fieldValues('Emirate'))}
          {filterSelect('Listing status', 'status', fieldValues('Listing status'))}
          {filterSelect('Completion', 'completion', fieldValues('Ready / off-plan'))}
          {filterSelect('Bedrooms', 'bedrooms', fieldValues('Bedrooms'))}
          <label className="inventory-field">
            <span>Maximum asking price / rate (AED)</span>
            <input
              aria-label="Maximum price"
              type="number"
              min="0"
              value={f.maxPrice}
              placeholder="No maximum"
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="inventory-results-bar">
        <div>
          <strong>
            {N(result.length)} {result.length === 1 ? 'property' : 'properties'}
          </strong>
          <span>
            {f.purpose === 'All'
              ? 'across your collection'
              : propertyListingTags.find((t) => t.key === f.purpose)?.label || f.purpose}
            {activeCount ? ' · refined results' : ''}
          </span>
        </div>
        <div className="inventory-tools">
          <div className="search-small inventory-search">
            <Icon name="search" size={16} />
            <input
              aria-label="Search properties"
              placeholder="Search address, project, ID..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <div className="view-switch" role="group" aria-label="Property view mode">
            <button
              aria-label="Table view"
              aria-pressed={viewMode === 'table'}
              className={viewMode === 'table' ? 'on' : ''}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <Icon name="menu" size={17} />
            </button>
            <button
              aria-label="Card view"
              aria-pressed={viewMode === 'cards'}
              className={viewMode === 'cards' ? 'on' : ''}
              onClick={() => setViewMode('cards')}
              title="Card view"
            >
              <Icon name="grid" size={17} />
            </button>
          </div>
        </div>
      </div>
      {viewMode === 'table' ? (
        <RecordTable module="Properties" arr={result} />
      ) : (
        <div className="property-grid property-grid-refined">
          {result.map((p, i) => (
            <button
              className="property-card modern-property-card"
              key={get(p, 'Property ID') || i}
              onClick={() => dispatchRow('Properties', p)}
            >
              <div className={'property-photo variant-' + (i % 4)}>
                <>
                  {mediaPhotos(p).length ? (
                    <img
                      className="property-cover-img"
                      src={mediaPhotos(p)[0].src}
                      alt={`${get(p, 'Listing title') || 'Property'} cover`}
                    />
                  ) : (
                    <div className="building-graphic">
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </>
                <span className="property-intent-tag">
                  {listingIntent(p) === 'Holiday home'
                    ? 'HOLIDAY HOME'
                    : listingIntent(p) === 'Sale'
                      ? 'FOR SALE'
                      : 'FOR RENT'}
                </span>
                <span className="property-photo-status">
                  <Badge>{get(p, 'Listing status') || 'Unspecified'}</Badge>
                </span>
              </div>
              <div className="property-content">
                <div className="property-card-meta">
                  <span>{get(p, 'Property type') || 'Property'}</span>
                  <span>{get(p, 'Ready / off-plan') || 'Ready'}</span>
                  {mediaPhotos(p).length > 0 && (
                    <span className="photo-count">
                      <Icon name="image" size={12} /> {mediaPhotos(p).length}
                    </span>
                  )}
                </div>
                <h3>{get(p, 'Listing title') || 'Untitled listing'}</h3>
                <p>
                  <Icon name="pin" size={14} />
                  {get(p, 'Community') || 'Community not set'} · {get(p, 'Emirate') || 'UAE'}
                </p>
                <div className="property-card-facts">
                  <span>
                    <Icon name="bed" size={14} />
                    {isCommercialProperty(p) && Number(get(p, 'Bedrooms')) === 0
                      ? 'Commercial'
                      : `${get(p, 'Bedrooms') ?? '—'} beds`}
                  </span>
                  {get(p, 'Bathrooms') && (
                    <span>
                      <Icon name="bath" size={14} />
                      {get(p, 'Bathrooms')} baths
                    </span>
                  )}
                  <span>
                    <Icon name="grid" size={14} />
                    {get(p, 'Area sq ft') ? N(get(p, 'Area sq ft')) + ' sqft' : 'Area TBD'}
                  </span>
                  {listingIntent(p) === 'Holiday home' && get(p, 'Maximum guests') && (
                    <span>
                      <Icon name="users" size={14} />
                      {get(p, 'Maximum guests')} guests
                    </span>
                  )}
                </div>
                <div className="property-bottom">
                  <div>
                    <small>ASKING PRICE</small>
                    <strong>{propertyPrice(p)}</strong>
                  </div>
                  <Icon name="arrow" size={18} />
                </div>
              </div>
            </button>
          ))}
          {result.length === 0 && (
            <div className="inventory-empty">
              <Empty
                title="No properties match those filters"
                detail="Try another property type or clear your filters to see the full portfolio."
                icon="search"
                action={
                  <Button variant="light" onClick={resetFilters}>
                    Clear filters
                  </Button>
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { PropertyDirectory };
