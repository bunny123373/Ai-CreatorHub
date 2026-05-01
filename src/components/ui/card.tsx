import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300',
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardProps) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}
