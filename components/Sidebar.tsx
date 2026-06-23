"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Target, Activity, Settings, Zap, Calendar, Command, Folder, FileText, PanelLeftClose, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function Sidebar({ className, isMobileView, onClose }: { className?: string, isMobileView?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  const identity = useStore((state) => state.identity);
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const navItems = [
    { name: 'Workspace', href: '/', icon: LayoutDashboard },
    { name: 'Templates', href: '/templates', icon: Target },
    { name: 'Inbox', href: '/inbox', icon: Command },
    { name: 'Pipeline', href: '/pipeline', icon: Folder },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Finance', href: '/finance', icon: FileText },
    { name: 'Resources', href: '/resources', icon: Activity },
  ];

  return (
    <aside className={cn(className, "relative")}>
      <div className="p-4 pb-2 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 px-2 hover:bg-black/5 p-1 rounded-md cursor-pointer transition-colors w-full group">
          <div className="w-5 h-5 bg-stone-900 rounded-sm flex items-center justify-center text-white shrink-0">
            <span className="font-sans font-bold text-[10px]">W</span>
          </div>
          <span className="font-sans font-semibold tracking-tight text-[14px] text-stone-900 truncate">WISCODE's workspace</span>
        </div>
        {!isMobileView ? (
          <button onClick={toggleSidebar} className="p-1 text-stone-400 hover:bg-black/5 hover:text-stone-700 rounded transition-colors hidden md:block">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onClose} className="p-1 text-stone-400 hover:bg-black/5 hover:text-stone-700 rounded transition-colors md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[14px] font-medium transition-colors w-full",
                isActive 
                  ? "bg-black/5 text-stone-900" 
                  : "text-stone-600 hover:bg-black/5 hover:text-stone-900"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-stone-900" : "text-stone-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {mounted && identity && (
        <div className="p-3 mt-auto">
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer">
            <div className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center text-xs font-semibold text-stone-800">
              {identity.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-[13px] text-stone-900 truncate">{identity.name}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
