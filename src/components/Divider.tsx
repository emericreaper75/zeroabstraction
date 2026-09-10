import React from 'react';

type DividerProps = React.HTMLAttributes<HTMLHRElement>;

export function Divider({ className = '', ...props }: DividerProps) {
  return <hr className={`border-0 ui-border-t ${className}`} {...props} />;
}
