/**
 * Button Component
 * 
 * Reusable, accessible button component following SOLID principles.
 * Supports multiple variants, sizes, and states.
 * 
 * @module components/ui/Button
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Button Variants
 * Each variant has specific visual styling
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * Button Sizes
 * Predefined size options for consistency
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button Component Props Interface
 * Extends native button attributes for full HTML support
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  
  /** Size of the button */
  size?: ButtonSize;
  
  /** Loading state - shows spinner and disables interaction */
  isLoading?: boolean;
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Icon before text */
  leftIcon?: React.ReactNode;
  
  /** Icon after text */
  rightIcon?: React.ReactNode;
}

/**
 * Variant Styles Map
 * Single Responsibility: Manages variant-specific styling
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: 
    'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 ' +
    'shadow-sm hover:shadow-md transition-all',
  
  secondary: 
    'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 ' +
    'transition-colors',
  
  outline: 
    'border-2 border-gray-300 text-gray-700 hover:border-gray-900 ' +
    'hover:bg-gray-50 active:bg-gray-100 transition-all',
  
  ghost: 
    'text-gray-700 hover:bg-gray-100 active:bg-gray-200 ' +
    'transition-colors',
  
  danger: 
    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 ' +
    'shadow-sm hover:shadow-md transition-all',
};

/**
 * Size Styles Map
 * Single Responsibility: Manages size-specific styling
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg',
};

/**
 * Button Component
 * 
 * A polymorphic, accessible button component with multiple variants.
 * Implements best practices: accessibility, loading states, icons.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * 
 * <Button variant="outline" leftIcon={<Icon />} isLoading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Computed Classes
    const baseStyles = 
      'inline-flex items-center justify-center gap-2 ' +
      'font-medium transition-all duration-200 ' +
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
    
    const widthStyles = fullWidth ? 'w-full' : '';
    
    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      widthStyles,
      className
    );

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Left Icon */}
        {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        
        {/* Button Text */}
        <span>{children}</span>
        
        {/* Right Icon */}
        {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
