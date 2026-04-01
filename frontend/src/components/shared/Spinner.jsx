import React from 'react';

const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 16, md: 24, lg: 36 };
  const s = sizes[size] || 24;
  return (
    <div className="flex items-center justify-center">
      <svg
        width={s} height={s}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin"
      >
        <circle cx="12" cy="12" r="10" stroke="#1e293b" strokeWidth="3" />
        <path d="M12 2a10 10 0 0110 10" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default Spinner;
