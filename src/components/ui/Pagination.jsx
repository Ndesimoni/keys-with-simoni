import React from 'react';

export function Pagination({ total, page, pageSize = 12, label, itemLabel = 'records', onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages - 1);
  return (
    <nav className="collection-pagination" aria-label={label}>
      <span role="status">
        Showing {total ? current * pageSize + 1 : 0}–{Math.min((current + 1) * pageSize, total)} of{' '}
        {total} {itemLabel}
      </span>
      {pages > 1 && (
        <div className="pager">
          <button type="button" disabled={current === 0} onClick={() => onChange(current - 1)}>
            Previous
          </button>
          <span>
            Page {current + 1} of {pages}
          </span>
          <button
            type="button"
            disabled={current === pages - 1}
            onClick={() => onChange(current + 1)}
          >
            Next
          </button>
        </div>
      )}
    </nav>
  );
}
