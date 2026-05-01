import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <Sparkles className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Powered by Next.js 16 with React Compiler
          </p>
        </div>
      </div>
    </div>
  );
}
