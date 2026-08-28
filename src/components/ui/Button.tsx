import React, { forwardRef } from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon: Icon, children, disabled, type = 'button', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-blue-900 text-white hover:bg-blue-800 focus:ring-blue-900",
      secondary: "bg-blue-50 text-blue-900 hover:bg-blue-100 focus:ring-blue-200",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-3 gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="animate-spin w-4 h-4" />}
        {!loading && Icon && <Icon className={cn(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';