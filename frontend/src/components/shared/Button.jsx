import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef(({
  className, variant = 'primary', size = 'md', isLoading, children, ...props
}, ref) => {
  const base = [
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
    'transition-all duration-200 select-none shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-[0.98]'
  ].join(' ');

  const variants = {
    primary:   'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/50',
    outline:   'border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/50',
    ghost:     'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 shadow-none',
    danger:    'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
    success:   'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 shadow-none',
  };

  const sizes = {
    xs: 'h-7  px-2.5 text-xs',
    sm: 'h-8  px-3   text-sm',
    md: 'h-10 px-4   text-sm',
    lg: 'h-12 px-6   text-base',
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
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="opacity-0 absolute">Loading</span>
        </>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
