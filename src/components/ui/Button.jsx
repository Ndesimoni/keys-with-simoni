import { Icon } from './Icon.jsx';
import React from 'react';

function Button({
  children,
  variant = 'primary',
  icon,
  onClick,
  disabled = false,
  title = '',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      title={title}
      className={'btn btn-' + variant + ' ' + className}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
    </button>
  );
}

export { Button };
