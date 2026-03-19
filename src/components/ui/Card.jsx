import React from 'react';

export function Card({ children, className = '', id }) {
  return (
    <div className={`card ${className}`} id={id}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`ch ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <div className={`ct ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`cb ${className}`}>
      {children}
    </div>
  );
}
