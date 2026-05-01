'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Image, 
  Music, 
  TrendingUp, 
  Tags, 
  FileText, 
  History, 
  Sun, 
  Moon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Thumbnail Generator', href: '/thumbnail', icon: Image },
  { name: 'Lyrics Studio', href: '/lyrics', icon: Music },
  { name: 'Viral Titles', href: '/titles', icon: TrendingUp },
  { name: 'SEO Tags', href: '/tags', icon: Tags },
  { name: 'Descriptions', href: '/description', icon: FileText },
  { name: 'History', href: '/history', icon: History },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-r border-white/20',
        'transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-2xl font-bold text-gradient">
              AI Creator Hub
            </Link>
          </div>

          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/10'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {mounted && (
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full justify-start"
            >
              {theme === 'dark' ? (
                <><Sun className="w-5 h-5 mr-3" /> Light Mode</>
              ) : (
                <><Moon className="w-5 h-5 mr-3" /> Dark Mode</>
              )}
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
