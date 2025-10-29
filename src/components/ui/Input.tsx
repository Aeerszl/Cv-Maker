/**
 * Input Component
 * 
 * Professional form input with validation states and icons.
 * Accessible and follows React Hook Form best practices.
 * 
 * @module components/ui/Input
 */

import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Input Sizes
 */
type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input Props Interface
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  helperText?: string;
  
  /** Input size */
  inputSize?: InputSize;
  
  /** Left icon */
  leftIcon?: React.ReactNode;
  
  /** Right icon */
  rightIcon?: React.ReactNode;
  
  /** Full width */
  fullWidth?: boolean;
}

/**
 * Size Styles Map
 */
const sizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

/**
 * Input Component
 * 
 * Professional input field with built-in validation display,
 * password toggle, and icon support.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error={errors.email?.message}
 * />
 * 
 * <Input
 *   label="Password"
 *   type="password"
 *   leftIcon={<Lock size={18} />}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      inputSize = 'md',
      leftIcon,
      rightIcon,
      fullWidth = false,
      type = 'text',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    
    // Determine actual input type (handle password visibility)
    const actualType = type === 'password' && showPassword ? 'text' : type;
    
    // Computed Classes
    const baseStyles = 
      'w-full rounded-lg border transition-all duration-200 ' +
      'focus:outline-none focus:ring-2 focus:ring-offset-1 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed ' +
      'placeholder:text-gray-400';
    
    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400';
    
    const iconPadding = leftIcon ? 'pl-10' : '';
    const passwordPadding = type === 'password' || rightIcon ? 'pr-10' : '';
    
    const combinedClassName = cn(
      baseStyles,
      stateStyles,
      sizeStyles[inputSize],
      iconPadding,
      passwordPadding,
      className
    );

    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={combinedClassName}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          
          {/* Password Toggle or Right Icon */}
          {type === 'password' ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          ) : null}
        </div>
        
        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600 animate-slide-down"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {/* Helper Text */}
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1.5 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
