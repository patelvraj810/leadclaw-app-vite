import React from 'react';

export function Card({ children, className = '', id, ...props }) {
  return (
    <div className={`card ${className}`} id={id} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`ch ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <div className={`ct ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={`cb ${className}`} {...props}>
      {children}
    </div>
  );
}
