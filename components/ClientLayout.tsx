"use client";

import Sidebar from '@/components/Sidebar';
import { useStore } from '@/lib/store';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebaseSync } from '@/hooks/useFirebaseSync';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useStore();
  useFirebaseSync();

  return (
    <div className="flex h-screen overflow-hidden w-full">
      {sidebarOpen && (
        <Sidebar className="hidden md:flex w-64 flex-col border-r border-stone-200/60 bg-[#F5F4F0] shrink-0" />
      )}
      <div className="flex-1 overflow-y-auto w-full relative flex flex-col">
        {!sidebarOpen && (
          <div className="absolute top-4 left-4 z-50">
            <Button variant="outline" size="icon" onClick={toggleSidebar} className="bg-white/80 backdrop-blur shadow-sm">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
