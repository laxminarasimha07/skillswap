import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  const id = React.useId();

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-[13px] font-medium text-[#666666]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          className={twMerge(
            'block w-full px-4 py-3 rounded-2xl border border-[#E5E5E5] bg-transparent text-[#111111] placeholder-[#A3A3A3] transition-all duration-200 focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] disabled:opacity-50 disabled:bg-[#F9F9F9] disabled:cursor-not-allowed text-sm',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
