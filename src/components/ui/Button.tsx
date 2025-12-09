// src/components/ui/Button.tsx
import React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'solid' | 'outline' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'solid',
  size = 'md',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses =
    variant === 'ghost'
      ? 'bg-transparent hover:bg-white/10'
      : variant === 'outline'
      ? 'border border-white/30 bg-transparent hover:bg-white/10'
      : 'bg-indigo-600 text-white hover:bg-indigo-500';

  const sizeClasses =
    size === 'xs'
      ? 'text-xs px-2 py-1'
      : size === 'sm'
      ? 'text-sm px-3 py-1.5'
      : 'text-sm px-4 py-2';

  return (
    <button
      className={cn(base, variantClasses, sizeClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
};
