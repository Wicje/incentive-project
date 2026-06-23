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
    if (window.innerWidth < 768) {
      if (useStore.getState().sidebarOpen) {
        useStore.getState().toggleSidebar();
      }
    }
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden w-full bg-white">
      {/* Desktop Sidebar */}
      {sidebarOpen && !isMobile && (
        <Sidebar className="hidden md:flex w-64 flex-col border-r border-stone-200 bg-stone-50 shrink-0 z-40 transition-all duration-300" />
      )}
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && isMobile && (
         <div 
           className="md:hidden fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm transition-opacity"
           onClick={toggleSidebar}
         />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-stone-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen && isMobile ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar className="flex h-full w-full flex-col border-r border-stone-200" isMobileView={true} onClose={toggleSidebar} />
      </div>

      <div className="flex-1 w-full relative flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center h-14 border-b border-stone-200 bg-stone-50/95 backdrop-blur px-4 shrink-0 z-20 relative">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-3 -ml-2 text-stone-600 hover:bg-stone-200">
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-sans font-bold text-lg text-stone-900 truncate tracking-tight">WISCODE</span>
        </div>

        {/* Main Scrolling Content Area */}
        <div className="flex-1 overflow-y-auto w-full relative flex flex-col">
          {!sidebarOpen && (
            <div className="absolute top-4 left-4 z-30 hidden md:block">
              <Button variant="outline" size="icon" onClick={toggleSidebar} className="bg-white/80 backdrop-blur-md shadow-sm border-stone-200 hover:bg-stone-100 text-stone-600">
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
