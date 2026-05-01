import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ className, label, options, ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent',
          'text-gray-900 dark:text-white',
          'transition-all duration-200 appearance-none cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-800 text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
