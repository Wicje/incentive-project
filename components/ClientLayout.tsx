"use client";

import Sidebar from '@/components/Sidebar';
import { useStore } from '@/lib/store';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebaseSync } from '@/hooks/useFirebaseSync';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useStore();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  useFirebaseSync();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  }, [pathname, isMobile]);

  return (
    <div className="flex h-screen overflow-hidden w-full bg-zinc-50">
      {/* Desktop Sidebar */}
      {sidebarOpen && !isMobile && (
        <Sidebar className="hidden md:flex w-64 flex-col border-r border-zinc-200/60 bg-zinc-50 shrink-0 z-40" />
      )}
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && isMobile && (
         <div 
           className="md:hidden fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm transition-opacity"
           onClick={toggleSidebar}
         />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-zinc-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen && isMobile ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar className="flex h-full w-full flex-col border-r border-zinc-200/60" isMobileView={true} onClose={toggleSidebar} />
      </div>

      <div className="flex-1 w-full relative flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center h-14 border-b border-zinc-200/60 bg-zinc-50/95 backdrop-blur px-4 shrink-0 z-20 relative">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-3 -ml-2 text-zinc-600 hover:bg-zinc-200">
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-serif font-bold text-lg text-zinc-900 truncate tracking-tight">WISCODE</span>
        </div>

        {/* Main Scrolling Content Area */}
        <div className="flex-1 overflow-y-auto w-full relative flex flex-col">
          {!sidebarOpen && (
            <div className="absolute top-4 left-4 z-30 hidden md:block">
              <Button variant="outline" size="icon" onClick={toggleSidebar} className="bg-white/90 backdrop-blur-sm shadow-sm border-zinc-200/80 hover:bg-zinc-100 text-zinc-600">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
