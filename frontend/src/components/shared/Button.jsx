import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef(({
  className, variant = 'primary', size = 'md', isLoading, children, ...props
}, ref) => {
  const base = [
    'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg',
    'transition-all duration-150 select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
    'active:scale-[0.98]',
  ].join(' ');

  const variants = {
    primary:   'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/20',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 hover:border-slate-600',
    outline:   'border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-100 hover:bg-slate-800/50',
    ghost:     'text-slate-400 hover:text-slate-100 hover:bg-slate-800',
    danger:    'bg-red-600 text-white hover:bg-red-500 shadow-sm',
    success:   'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm',
  };

  const sizes = {
    xs: 'h-7  px-2.5 text-xs',
    sm: 'h-8  px-3   text-sm',
    md: 'h-9  px-4   text-sm',
    lg: 'h-11 px-6   text-base',
  };

  return (
    <button
      ref={ref}
      className={twMerge(base, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading…</span>
        </>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
