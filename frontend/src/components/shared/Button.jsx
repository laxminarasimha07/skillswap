import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#111111] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#111111] text-white hover:bg-[#333333]',
    secondary: 'bg-[#F2F2F2] text-[#111111] hover:bg-[#E5E5E5]',
    outline: 'border border-[#E5E5E5] text-[#111111] hover:border-[#111111] bg-transparent',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'text-[#666666] hover:text-[#111111] hover:bg-[#F9F9F9]',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm gap-1.5',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2',
  };

  return (
    <button
      ref={ref}
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="opacity-0 w-0">Loading</span>
        </>
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
