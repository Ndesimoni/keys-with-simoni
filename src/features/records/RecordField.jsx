import React from 'react';
import { get } from '../../lib/records.js';

export function RecordField({ field: f, module, data, idField, value, error, change }) {
  const relation = (f) => {
    if (f.key === idField.key) return null;
    if (
      f.name === 'Client ID' ||
      f.name === 'Referred by Client ID' ||
      f.name === 'Referred client ID'
    )
      return { data: data.Clients, id: 'Client ID', name: 'Full name' };
    if (f.name === 'Property ID' || f.name === 'Property ID optional')
      return { data: data.Properties, id: 'Property ID', name: 'Listing title' };
    if (f.name === 'Contact ID')
      return { data: data.Contacts, id: 'Contact ID', name: 'Full name' };
    if (f.name === 'Deal ID' || f.name === 'Deal ID optional')
      return { data: data.Deals, id: 'Deal ID', name: 'Deal ID' };
    return null;
  };
  const v = value ?? '';
  const rel = relation(f);
  const inputProps = {
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${f.key}-error` : undefined,
    required: f.key === idField.key,
    'data-initial-focus': f.key === idField.key ? true : undefined,
  };
  return (
    <div className={'field ' + (f.type === 'textarea' ? 'span-all' : '')} key={f.key}>
      <label htmlFor={f.key}>
        {module === 'Properties' && f.name === 'Price / annual rent AED'
          ? 'Asking price / rent AED'
          : f.name}
        {f.key === idField.key && <span className="required"> *</span>}
      </label>
      {rel ? (
        <select
          {...inputProps}
          id={f.key}
          value={v}
          onChange={(e) => change(f.key, e.target.value)}
        >
          <option value="">Select {f.name.toLowerCase()}</option>
          {v && !rel.data.some((row) => get(row, rel.id) === v) && (
            <option value={v}>{v} · Linked record unavailable</option>
          )}
          {rel.data.map((r) => (
            <option key={get(r, rel.id)} value={get(r, rel.id)}>
              {get(r, rel.id)} · {get(r, rel.name)}
            </option>
          ))}
        </select>
      ) : f.options ? (
        <select
          {...inputProps}
          id={f.key}
          value={v}
          onChange={(e) => change(f.key, e.target.value)}
        >
          <option value="">Select...</option>
          {v && !f.options.includes(v) && <option value={v}>{v}</option>}
          {f.options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : f.type === 'textarea' ? (
        <textarea
          {...inputProps}
          id={f.key}
          rows="3"
          value={v}
          onChange={(e) => change(f.key, e.target.value)}
          placeholder={`Enter ${f.name.toLowerCase()}...`}
        />
      ) : (
        <input
          {...inputProps}
          id={f.key}
          type={f.type}
          min={f.type === 'number' ? '0' : undefined}
          step={f.type === 'number' ? 'any' : undefined}
          value={v}
          onChange={(e) => change(f.key, e.target.value)}
          placeholder={f.type === 'number' ? '0' : `Enter ${f.name.toLowerCase()}...`}
        />
      )}
      {error && (
        <p id={`${f.key}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
