import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 text-white hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-500/25 focus:ring-2 focus:ring-purple-500/40',
    secondary: 'bg-[#1F2937] text-[#E5E7EB] border border-[#374151] hover:bg-[#374151] hover:scale-[1.02] focus:ring-2 focus:ring-[#374151]',
    outline: 'border border-[#374151] text-[#9CA3AF] hover:border-purple-500/60 hover:text-[#E5E7EB] hover:bg-purple-500/5 hover:scale-[1.02] focus:ring-2 focus:ring-purple-500/30',
    danger: 'bg-red-600/90 text-white hover:bg-red-500 hover:scale-[1.02] focus:ring-2 focus:ring-red-500/40',
    ghost: 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#1F2937] focus:ring-2 focus:ring-[#374151]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
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
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
