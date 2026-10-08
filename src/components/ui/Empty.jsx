import { Icon } from './Icon.jsx';
import React from 'react';

function Empty({
  title = 'Nothing here yet',
  detail = 'Create your first record to get started.',
  icon = 'note',
  action,
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name={icon} size={26} />
      </div>
      <h3>{title}</h3>
      <p>{detail}</p>
      {action}
    </div>
  );
}

export { Empty };
