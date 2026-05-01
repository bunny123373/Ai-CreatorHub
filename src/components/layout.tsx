'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 bg-white/10 dark:bg-black/10 backdrop-blur-md border-b border-white/20 p-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
