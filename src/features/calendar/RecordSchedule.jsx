import React from 'react';
import { useCalendar } from '../../hooks/useWorkspace.js';
import { selectCalendarEntries } from './selectors.js';
import { CalendarStatus } from './CalendarStatus.jsx';

export function RecordSchedule({ module, record, data }) {
  const { status } = useCalendar();
  const entry = selectCalendarEntries(data).find(
    (item) => item.module === module && item.record === record,
  );
  if (!entry) return null;
  const item = status.items?.[entry.key];
  return (
    <section className="record-schedule" aria-label="Calendar schedule">
      <div className="calendar-row-heading">
        <h3>{entry.activity} schedule</h3>
        <CalendarStatus entry={entry} status={status} />
      </div>
      <p>
        {entry.day} · {entry.time} · Dubai time
        {entry.record.calendar_location ? ` · ${entry.record.calendar_location}` : ''}
      </p>
      <p>
        Reminder: {entry.record.calendar_reminder ?? 15} minutes before.{' '}
        {entry.record.calendar_invite === 'Yes'
          ? 'Client invitation enabled.'
          : 'No client invitation.'}
      </p>
      {item?.error && <p className="field-error">{item.error}</p>}
      {item?.url && item.state === 'synced' && (
        <a className="text-action" href={item.url} target="_blank" rel="noopener noreferrer">
          Open in Google Calendar
        </a>
      )}
    </section>
  );
}
