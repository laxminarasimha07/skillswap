import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ label, error, hint, className, ...props }, ref) => {
  const id = React.useId();
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-400 tracking-wide">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={twMerge(
          'block w-full h-9 px-3 rounded-lg text-sm',
          'bg-slate-900 border text-slate-100 placeholder-slate-600',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error
            ? 'border-red-500/60 focus:ring-red-500/60'
            : 'border-slate-700 hover:border-slate-600',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
