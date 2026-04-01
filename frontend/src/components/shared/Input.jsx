import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ label, error, hint, className, ...props }, ref) => {
  const id = React.useId();
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={twMerge(
          'block w-full h-10 px-3.5 rounded-lg text-sm',
          'bg-slate-900 border text-slate-200 placeholder-slate-600',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-950',
          error
            ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500/50'
            : 'border-slate-800 hover:border-slate-700',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
