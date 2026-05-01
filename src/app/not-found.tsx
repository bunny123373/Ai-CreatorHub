import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
      <h2 className="text-4xl font-bold text-gradient">404</h2>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Page Not Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
