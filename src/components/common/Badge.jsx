import React from 'react';

const Badge = ({ children, colorClass, className = '' }) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 justify-center shadow-sm ${colorClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
