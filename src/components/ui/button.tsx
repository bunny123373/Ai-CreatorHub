import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm border border-white/20 text-white hover:from-blue-600/80 hover:to-purple-600/80',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-900 dark:text-white hover:bg-white/20',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-700 dark:text-gray-300'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
}
