import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  const id = React.useId();
  
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          className={twMerge(
            'block w-full px-3.5 py-2.5 rounded-lg border text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-100',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
