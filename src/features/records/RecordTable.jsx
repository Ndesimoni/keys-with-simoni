import { schema } from '../../lib/schema.js';
import { preferredCols } from '../../config/navigation.js';
import { Icon } from '../../components/ui/Icon.jsx';
import { get } from '../../lib/records.js';
import { Badge } from '../../components/ui/Badge.jsx';
import { formatValue } from '../../lib/crm.js';
import { Empty } from '../../components/ui/Empty.jsx';
import { Button } from '../../components/ui/Button.jsx';
import React, { useEffect } from 'react';
import { useRecords, useWorkspaceView, useWorkspaceActions } from '../../hooks/useWorkspace.js';
import { useSession } from '../../hooks/useSession.js';
import { hasMessagingAccess } from '../messaging/model.js';

function RecordTable({
  module,
  arr,
  limit = true,
  columnNames,
  tableLabel,
  emptyTitle = 'No matching records',
  emptyDetail,
  emptyAction,
}) {
  const { data } = useRecords();
  const { page, setSort, setPage, sort, query } = useWorkspaceView();
  const { dispatchRow, add, startMessage } = useWorkspaceActions();
  const { user } = useSession();

  const columns = schema(module);
  const pick = (columnNames || preferredCols[module] || [])
    .map((name) => columns.find((f) => f.name === name))
    .filter(Boolean);
  const perPage = limit ? 12 : 500;
  const currentPage = Math.min(page, Math.max(0, Math.ceil(arr.length / perPage) - 1));
  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage, setPage]);
  const start = currentPage * perPage;
  const current = arr.slice(start, start + perPage);
  return (
    <div className="table-shell">
      <div className="table-scroll">
        <table className="data-table" aria-label={tableLabel || `${module} records`}>
          <thead>
            <tr>
              {pick.map((f) => (
                <th
                  key={f.key}
                  scope="col"
                  aria-sort={
                    sort.key === f.key
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <button
                    className="table-sort"
                    onClick={() => {
                      setSort((s) => ({
                        key: f.key,
                        direction: s.key === f.key && s.direction === 'asc' ? 'desc' : 'asc',
                      }));
                      setPage(0);
                    }}
                  >
                    {f.name.replace(/ AED$/, '')}{' '}
                    {sort.key === f.key && (
                      <Icon name={sort.direction === 'asc' ? 'up' : 'down'} size={12} />
                    )}
                  </button>
                </th>
              ))}
              <th className="last-th">
                <span className="sr-only">Open record</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {current.map((r, i) => (
              <tr key={get(r, columns[0].name) || i} onClick={() => dispatchRow(module, r)}>
                {pick.map((f) => (
                  <td key={f.key}>
                    {/stage|status|tier|priority/i.test(f.name) ? (
                      <Badge>{formatValue(data, module, r, f)}</Badge>
                    ) : f === pick[0] ? (
                      <span className="mono id-link">{formatValue(data, module, r, f)}</span>
                    ) : /Full name|Listing title|Next action|Community/i.test(f.name) ? (
                      <span className="cell-strong">{formatValue(data, module, r, f)}</span>
                    ) : (
                      formatValue(data, module, r, f)
                    )}
                  </td>
                ))}
                <td>
                  {module === 'Clients' && (
                    <button
                      type="button"
                      className="row-link message-row-action"
                      aria-label={`Start message with ${r.full_name || r.client_id}`}
                      title="Start message"
                      disabled={!hasMessagingAccess(user)}
                      onClick={(event) => {
                        event.stopPropagation();
                        startMessage(r);
                      }}
                    >
                      <Icon name="chat" size={17} />
                    </button>
                  )}
                  <button
                    className="row-link"
                    aria-label={`Open record ${get(r, columns[0].name)}`}
                    title="Open record"
                  >
                    <Icon name="arrow" size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!arr.length && (
        <Empty
          title={emptyTitle}
          detail={
            emptyDetail ||
            (query
              ? 'Try another search or clear filters.'
              : 'Use Add record to start building your workspace.')
          }
          action={
            emptyAction ?? (
              <Button icon="plus" onClick={() => add(module)}>
                Add record
              </Button>
            )
          }
        />
      )}
      <div className="table-footer">
        <span>
          Showing {arr.length ? start + 1 : 0}–{Math.min(start + perPage, arr.length)} of{' '}
          {arr.length} records
        </span>
        <div className="pager">
          <button disabled={currentPage === 0} onClick={() => setPage((x) => Math.max(0, x - 1))}>
            Previous
          </button>
          <span>
            {currentPage + 1} / {Math.max(1, Math.ceil(arr.length / perPage))}
          </span>
          <button
            disabled={(currentPage + 1) * perPage >= arr.length}
            onClick={() => setPage((x) => x + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export { RecordTable };
