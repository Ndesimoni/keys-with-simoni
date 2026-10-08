import { get } from '../../lib/records.js';

export const contactTabs = ['All', 'Landlords', 'Clients', 'Other contacts'];

/** Unknown and unclassified imported types remain accessible in Other contacts. */
export function matchesContactTab(record, tab) {
  const type = String(get(record, 'Contact type') ?? '')
    .trim()
    .toLowerCase();
  if (tab === 'Landlords') return type === 'landlord';
  if (tab === 'Clients') return type === 'client';
  if (tab === 'Other contacts') return type !== 'landlord' && type !== 'client';
  return true;
}
