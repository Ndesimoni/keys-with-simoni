import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesContactTab } from '../../src/features/contacts/selectors.js';
import { blank } from '../../src/lib/schema.js';
import { selectRecords } from '../../src/lib/workspace.js';

test('contact categories handle imported casing and keep unknown or unclassified contacts accessible', () => {
  const records = [
    { contact_id: 'CT-1', contact_type: ' Landlord ' },
    { contact_id: 'CT-2', contact_type: 'CLIENT' },
    ...['Owner', 'Developer', 'Broker', 'Partner', 'Supplier', 'Other', 'Referral source', ''].map(
      (contact_type, index) => ({ contact_id: `CT-${index + 3}`, contact_type }),
    ),
    { contact_id: 'CT-11' },
  ];
  const before = structuredClone(records);
  const inTab = (tab) => records.filter((record) => matchesContactTab(record, tab));
  assert.deepEqual(inTab('Landlords'), [records[0]]);
  assert.deepEqual(inTab('Clients'), [records[1]]);
  assert.deepEqual(inTab('Other contacts'), records.slice(2));
  assert.deepEqual(inTab('All'), records);
  assert.deepEqual(records, before);
});

test('contact categories combine with the existing search and sort without changing stored records', () => {
  const data = blank();
  data.Contacts = [
    { contact_id: 'CT-1', contact_type: 'Landlord', full_name: 'Zara', company: 'Harbour Homes' },
    { contact_id: 'CT-2', contact_type: 'Client', full_name: 'Amy', company: 'Harbour Homes' },
    { contact_id: 'CT-3', contact_type: 'Landlord', full_name: 'Ben', company: 'Harbour Homes' },
    { contact_id: 'CT-4', contact_type: 'Landlord', full_name: 'Cara', company: 'Other company' },
  ];
  const before = structuredClone(data);
  assert.deepEqual(
    selectRecords(data, 'Contacts', {
      query: ' HARBOUR ',
      sort: { key: 'full_name', direction: 'asc' },
      filter: (record) => matchesContactTab(record, 'Landlords'),
    }),
    [data.Contacts[2], data.Contacts[0]],
  );
  assert.deepEqual(data, before);
});
