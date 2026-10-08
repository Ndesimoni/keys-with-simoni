import assert from 'node:assert/strict';
import test from 'node:test';
import { MODS, schema } from '../../src/lib/schema.js';
import { errorSectionIndex, recordFormSections } from '../../src/features/records/formSections.js';
import { validateRecordSection } from '../../src/features/records/validation.js';

test('form sections retain every editable workbook field exactly once and keep the ID first', () => {
  const longForms = ['Clients', 'Properties', 'Deals', 'Interaction log', 'Client care'];
  for (const module of Object.keys(MODS)) {
    const editable = schema(module).filter((field) => !field.calculated);
    const sections = recordFormSections(module);
    const fields = sections.flatMap((section) => section.fields);
    assert.deepEqual(
      fields.map((field) => field.key).sort(),
      editable.map((field) => field.key).sort(),
    );
    assert.equal(new Set(fields.map((field) => field.key)).size, fields.length);
    assert.equal(sections[0].fields[0].key, editable[0].key);
    assert.equal(sections.length > 1, longForms.includes(module));
  }
  assert.equal(recordFormSections('Properties').filter((section) => section.media).length, 1);
});

test('section validation checks duplicate IDs and current fields while deferring errors from later sections', () => {
  const sections = recordFormSections('Clients');
  const form = { client_id: 'CL-1', email: 'invalid', maximum_budget_aed: -1 };
  const errors = validateRecordSection(
    'Clients',
    form,
    [{ client_id: 'CL-1' }],
    null,
    sections[0].fields,
  );
  assert.ok(errors.client_id);
  assert.ok(errors.email);
  assert.equal(errors.maximum_budget_aed, undefined);
  assert.equal(errorSectionIndex(sections, errors), 0);
  const later = validateRecordSection('Clients', form, [], null, sections[2].fields);
  assert.ok(later.maximum_budget_aed);
  assert.equal(errorSectionIndex(sections, later), 2);
});

test('budget bounds are checked together and final errors locate their editable section', () => {
  const sections = recordFormSections('Clients');
  const form = { client_id: 'CL-1', minimum_budget_aed: 500, maximum_budget_aed: 100 };
  assert.deepEqual(validateRecordSection('Clients', form, [], null, sections[0].fields), {});
  const errors = validateRecordSection('Clients', form, [], null, sections[2].fields);
  assert.ok(errors.maximum_budget_aed);
  assert.equal(errorSectionIndex(sections, errors), 2);
  assert.equal(errorSectionIndex(sections, {}), -1);
  assert.equal(errorSectionIndex(recordFormSections('Properties'), { listing_url: 'Invalid' }), 4);
});
