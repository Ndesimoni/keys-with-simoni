import { schema } from '../../lib/schema.js';
import { get } from '../../lib/records.js';
import { Icon } from '../../components/ui/Icon.jsx';
import { PropertyGallery } from '../properties/PropertyGallery.jsx';
import { mediaPlans } from '../../lib/media.js';
import { amenityList, propertyPrice } from '../../lib/properties.js';
import { Badge } from '../../components/ui/Badge.jsx';
import { formatValue } from '../../lib/crm.js';
import { Button } from '../../components/ui/Button.jsx';
import React, { useId } from 'react';
import { Drawer } from '../../components/ui/Drawer.jsx';
import { safeExternalUrl } from '../../lib/validation.js';
import { useNavigation } from '../../hooks/useWorkspace.js';
import { RecordSchedule } from '../calendar/RecordSchedule.jsx';

function RecordDetails({ detail, data, edit, remove, close }) {
  const { module, record: r } = detail;
  const { route } = useNavigation();
  const lead = module === 'Clients' && route === 'Leads';
  const fields = schema(module);
  const id = get(r, fields[0].name);
  const titleId = useId();
  return (
    <Drawer
      className="detail-drawer"
      size={module === 'Properties' ? 'wide' : 'standard'}
      titleId={titleId}
      onClose={close}
    >
      <div className="drawer-top">
        <div>
          <div className="eyebrow">{(lead ? 'Leads' : module).toUpperCase()} · RECORD DETAILS</div>
          <h2
            id={titleId}
            tabIndex={module === 'Properties' ? -1 : undefined}
            data-initial-focus={module === 'Properties' ? true : undefined}
          >
            {get(r, 'Full name') || get(r, 'Listing title') || get(r, 'Next action') || id}
          </h2>
          <p>
            {id} · {fields.length} available fields
          </p>
        </div>
        <button className="icon-btn" aria-label="Close record details" onClick={close}>
          <Icon name="close" size={21} />
        </button>
      </div>
      <div className="drawer-body">
        {['Follow-ups', 'Viewings'].includes(module) && (
          <RecordSchedule module={module} record={r} data={data} />
        )}
        {module === 'Properties' && (
          <div className="property-detail-studio">
            <PropertyGallery
              record={r}
              onEdit={() => {
                close();
                edit(module, r, 'presentation');
              }}
            />
            <div className="media-detail-block">
              <div className="detail-section-heading">
                <Icon name="layers" size={18} />
                <h3>Floor plans & virtual tours</h3>
              </div>
              <div className="floorplan-list">
                {mediaPlans(r).map((plan, i) => (
                  <a
                    key={i}
                    href={plan.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={plan.name}
                  >
                    <Icon name={plan.type === 'application/pdf' ? 'note' : 'image'} size={17} />
                    <span>{plan.name}</span>
                    <Icon name="external" size={15} />
                  </a>
                ))}
                {safeExternalUrl(get(r, 'Floor plan URL')) && (
                  <a
                    href={safeExternalUrl(get(r, 'Floor plan URL'))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open linked floor plan <Icon name="external" size={15} />
                  </a>
                )}
                {safeExternalUrl(get(r, 'Virtual tour URL')) && (
                  <a
                    href={safeExternalUrl(get(r, 'Virtual tour URL'))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View virtual tour <Icon name="external" size={15} />
                  </a>
                )}
                {!mediaPlans(r).length &&
                  !get(r, 'Floor plan URL') &&
                  !get(r, 'Virtual tour URL') && (
                    <p className="property-muted">No floor plans or tours added yet.</p>
                  )}
              </div>
            </div>
            <div className="media-detail-block">
              <div className="detail-section-heading">
                <Icon name="check" size={18} />
                <h3>Amenities & highlights</h3>
              </div>
              <div className="amenity-tags">
                {amenityList(r).length ? (
                  amenityList(r).map((a) => (
                    <span key={a}>
                      <Icon name="check" size={13} />
                      {a}
                    </span>
                  ))
                ) : (
                  <p className="property-muted">Amenities have not been added.</p>
                )}
              </div>
              {get(r, 'Key selling points') && (
                <p className="property-highlights">{get(r, 'Key selling points')}</p>
              )}
              {get(r, 'Property description') && (
                <p className="property-description">{get(r, 'Property description')}</p>
              )}
            </div>
          </div>
        )}
        <div className="detail-highlight">
          <span className="detail-watermark">
            <Icon name="briefcase" size={30} />
          </span>
          <div>
            <small>RECORD ID</small>
            <strong>{id}</strong>
          </div>
          <Badge>
            {get(r, 'Lead stage') ||
              get(r, 'Deal stage') ||
              get(r, 'Listing status') ||
              get(r, 'Task status') ||
              'Active'}
          </Badge>
        </div>
        <div className="details-grid">
          {fields.map((f) => (
            <div className={'detail-field ' + (f.type === 'textarea' ? 'wide' : '')} key={f.key}>
              <span>{f.name}</span>
              <strong>
                {module === 'Properties' && f.name === 'Price / annual rent AED'
                  ? propertyPrice(r)
                  : formatValue(data, module, r, f)}
              </strong>
            </div>
          ))}
        </div>
      </div>
      <div className="drawer-footer">
        <Button variant="danger-light" icon="trash" onClick={() => remove(module, r)}>
          Delete
        </Button>
        <Button
          icon="edit"
          onClick={() => {
            close();
            edit(module, r);
          }}
        >
          {lead ? 'Edit lead' : 'Edit record'}
        </Button>
      </div>
    </Drawer>
  );
}

export { RecordDetails };
