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
    { name: 'Inbox', href: '/inbox', icon: Command },
    { name: 'Pipeline', href: '/pipeline', icon: Folder },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Finance', href: '/finance', icon: FileText },
    { name: 'Resources', href: '/resources', icon: Activity },
  ];

  return (
    <aside className={cn(className, "relative")}>
      <div className="p-6 pb-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 set-bg bg-zinc-900 rounded flex items-center justify-center text-zinc-50">
            <Zap className="w-4 h-4 fill-current text-zinc-50" />
          </div>
          <span className="font-serif font-bold tracking-tight text-xl text-zinc-900 truncate">WISCODE</span>
        </div>
        {!isMobileView ? (
          <button onClick={toggleSidebar} className="p-1.5 text-zinc-400 hover:bg-zinc-200/50 hover:text-zinc-700 rounded-md transition-colors hidden md:block">
            <PanelLeftClose className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:bg-zinc-200/50 hover:text-zinc-700 rounded-md transition-colors md:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4 mb-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 pl-2">Navigation</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group relative",
                isActive 
                  ? "bg-zinc-900 text-zinc-50 shadow-md" 
                  : "text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900"
              )}
            >
              <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-zinc-50 opacity-100" : "opacity-70 group-hover:opacity-100")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {mounted && identity && (
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-100 border border-zinc-200/60">
            <div className="w-9 h-9 rounded-md bg-zinc-300 flex items-center justify-center text-sm font-bold text-zinc-800 font-serif">
              {identity.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-sm truncate">
              <span className="font-bold text-zinc-900 truncate">{identity.name}</span>
              <span className="text-xs text-zinc-500 truncate font-mono">{identity.email}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
