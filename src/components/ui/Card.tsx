/**
 * Card Component
 * 
 * Elegant card container component with hover effects and animations.
 * Follows composition pattern for maximum flexibility.
 * 
 * @module components/ui/Card
 */

import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Card Variants
 * Different visual styles for various use cases
 */
type CardVariant = 'elevated' | 'outlined' | 'flat';

/**
 * Card Component Props
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: CardVariant;
  
  /** Enable hover effect */
  hoverable?: boolean;
  
  /** Make card clickable */
  clickable?: boolean;
  
  /** Add padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Variant Styles Map
 */
const variantStyles: Record<CardVariant, string> = {
  elevated: 
    'bg-white border border-gray-200 shadow-md hover:shadow-lg',
  
  outlined: 
    'bg-white border-2 border-gray-200 hover:border-gray-300',
  
  flat: 
    'bg-gray-50 border border-transparent',
};

/**
 * Padding Styles Map
 */
const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Card Component
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" hoverable padding="md">
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'elevated',
      hoverable = false,
      clickable = false,
      padding = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-lg transition-all duration-200';
    const hoverStyles = hoverable ? 'transform hover:-translate-y-1' : '';
    const clickableStyles = clickable ? 'cursor-pointer active:scale-[0.98]' : '';
    
    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      paddingStyles[padding],
      hoverStyles,
      clickableStyles,
      className
    );

    return (
      <div
        ref={ref}
        className={combinedClassName}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Sub-Components
 * Composition pattern for better organization
 */

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';
