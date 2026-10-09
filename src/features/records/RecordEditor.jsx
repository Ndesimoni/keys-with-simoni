import { PropertyMediaEditor } from '../properties/PropertyMediaEditor.jsx';
import { RecordField } from './RecordField.jsx';
import { RecordReview } from './RecordReview.jsx';
import React, { useId, useMemo, useState } from 'react';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges.js';
import { useRecordFormSteps } from '../../hooks/useRecordFormSteps.js';
import { Drawer } from '../../components/ui/Drawer.jsx';
import { FormStepper } from '../../components/ui/FormStepper.jsx';
import { get } from '../../lib/records.js';
import { Icon } from '../../components/ui/Icon.jsx';
import { pad } from '../../lib/dates.js';
import { Button } from '../../components/ui/Button.jsx';
import { useNavigation } from '../../hooks/useWorkspace.js';

function RecordEditor({ drawer, data, onClose, onSave }) {
  const { module, original } = drawer;
  const { route } = useNavigation();
  const lead = module === 'Clients' && route === 'Leads';
  const [form, setForm] = useState({ ...drawer.record });
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const titleId = useId();
  const stepTitleId = useId();
  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(drawer.record),
    [form, drawer.record],
  );
  useUnsavedChanges(dirty, uploading);
  const {
    sections,
    steps,
    activeStep,
    accessibleStep,
    multiStep,
    review,
    errors,
    setErrors,
    bodyRef,
    headingRef,
    next,
    selectStep,
    validateAll,
    reportErrors,
  } = useRecordFormSteps({
    module,
    form,
    records: data[module],
    original,
    initialSection: drawer.initialSection,
    busy: uploading,
    data,
  });
  const change = (key, v) => {
    setErrors((previous) => ({ ...previous, [key]: '' }));
    setSaveError('');
    setForm((p) => ({
      ...p,
      [key]: v,
      ...(module === 'Follow-ups' && key === 'calendar_start' && v
        ? { due_date: v.slice(0, 10) }
        : {}),
      ...(module === 'Properties' && key === 'sale_rental'
        ? {
            price_basis:
              v === 'Holiday home' ? 'Nightly' : v === 'Rental' ? 'Annual' : 'Total price',
          }
        : {}),
    }));
  };
  const requestClose = () => {
    if (uploading) return;
    if (dirty && !confirm('Discard your unsaved changes?')) return;
    onClose();
  };
  const submit = (event) => {
    event.preventDefault();
    if (uploading) return;
    if (multiStep && !review) {
      next();
      return;
    }
    if (!validateAll()) return;
    const result = onSave(module, form, original);
    if (!result?.workspace) {
      reportErrors(result?.errors || {});
      setSaveError(result?.message || 'Check the highlighted fields.');
    }
  };
  const idField = sections[0].fields[0];
  const currentSection = sections[activeStep];

  return (
    <Drawer
      className={'editor-drawer' + (multiStep ? ' wizard-editor' : '')}
      size={module === 'Properties' ? 'wide' : 'standard'}
      titleId={titleId}
      onClose={requestClose}
    >
      <div className="drawer-top">
        <div>
          <div className="eyebrow">
            {(lead ? 'Leads' : module).toUpperCase()} · {original ? 'EDIT RECORD' : 'NEW ENTRY'}
          </div>
          <h2
            id={titleId}
            tabIndex={module === 'Properties' ? -1 : undefined}
            data-initial-focus={module === 'Properties' ? true : undefined}
          >
            {original
              ? 'Edit ' + get(original, idField.name)
              : 'New ' +
                (lead
                  ? 'lead'
                  : {
                      Properties: 'property',
                      'Client care': 'touchpoint',
                      'Interaction log': 'conversation',
                      Shortlist: 'match',
                      'Follow-ups': ['Call', 'Meeting'].includes(form.calendar_activity)
                        ? form.calendar_activity.toLowerCase()
                        : 'follow-up',
                    }[module] || module.toLowerCase().replace(/s$/, ''))}
          </h2>
          <p>
            {multiStep
              ? 'Complete each section, then review and save your record.'
              : 'Calculated fields update automatically.'}
          </p>
        </div>
        <button
          className="icon-btn"
          aria-label="Close record editor"
          disabled={uploading}
          onClick={requestClose}
        >
          <Icon name="close" size={21} />
        </button>
      </div>
      <form noValidate onSubmit={submit} className="drawer-form">
        {multiStep && (
          <FormStepper
            steps={steps}
            activeStep={activeStep}
            accessibleStep={accessibleStep}
            disabled={uploading}
            onSelect={selectStep}
          />
        )}
        <div className="drawer-body" ref={bodyRef}>
          {Object.values(errors).some(Boolean) && (
            <p className="field-error" role="alert">
              Please correct the highlighted fields before saving.
            </p>
          )}
          {saveError && (
            <p className="field-error" role="alert">
              {saveError}
            </p>
          )}
          <h3
            id={stepTitleId}
            className="form-heading form-step-title"
            tabIndex={-1}
            ref={headingRef}
          >
            <span>{pad(activeStep + 1)}</span>
            {steps[activeStep].title}
          </h3>
          {review ? (
            <RecordReview
              module={module}
              form={form}
              data={data}
              sections={sections}
              onEdit={selectStep}
            />
          ) : (
            <>
              <div className="form-intro">
                <Icon name="info" size={17} />
                <span>
                  Fields marked * are required. Related records should be created first for correct
                  linking.
                </span>
              </div>
              {currentSection.media && (
                <PropertyMediaEditor
                  form={form}
                  setForm={setForm}
                  uploading={uploading}
                  setUploading={setUploading}
                />
              )}
              {currentSection.id === 'schedule' && (
                <p className="form-intro">
                  Times use Dubai time (UTC+4). Date-only follow-ups appear as all-day reminders.
                  Enable sync to add this activity to your connected calendar. Invitations are sent
                  only when you choose Yes.
                </p>
              )}
              <section className="form-section" aria-labelledby={stepTitleId}>
                <div className="form-grid">
                  {currentSection.fields.map((field) => (
                    <RecordField
                      key={field.key}
                      field={field}
                      module={module}
                      data={data}
                      idField={idField}
                      value={form[field.key]}
                      error={errors[field.key]}
                      change={change}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
        <div className="drawer-footer">
          <Button variant="light" disabled={uploading} onClick={requestClose}>
            Cancel
          </Button>
          <div className="form-step-actions">
            {multiStep && activeStep > 0 && (
              <Button
                variant="light"
                disabled={uploading}
                onClick={() => selectStep(activeStep - 1)}
              >
                Back
              </Button>
            )}
            <Button
              icon={multiStep && !review ? 'arrow' : 'check'}
              type="submit"
              disabled={uploading}
            >
              {multiStep && !review ? 'Next' : original ? 'Save changes' : 'Create record'}
            </Button>
          </div>
        </div>
      </form>
    </Drawer>
  );
}

export { RecordEditor };
