import React from 'react';

export function Tag({ children, color = 'gray', className = '' }) {
  const colorMap = {
    green: 'tag-green',
    blue: 'tag-blue',
    amber: 'tag-amber',
    red: 'tag-red',
    gray: 'tag-gray',
  };

  return (
    <span className={`tag ${colorMap[color]} ${className}`}>
      {children}
    </span>
  );
}
