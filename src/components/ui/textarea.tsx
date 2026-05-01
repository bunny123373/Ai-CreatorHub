import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ className, label, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent',
          'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
          'transition-all duration-200 resize-none',
          className
        )}
        {...props}
      />
    </div>
  );
}
