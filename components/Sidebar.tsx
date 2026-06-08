"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Target, Activity, Settings, Zap, Calendar, Command, Folder, FileText, PanelLeftClose } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function Sidebar({ className }: { className?: string }) {
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
          <div className="w-8 h-8 bg-stone-900 rounded flex items-center justify-center text-[#FAF9F6]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-serif font-semibold tracking-tight text-xl text-stone-900">Agency OS</span>
        </div>
        <button onClick={toggleSidebar} className="p-1.5 text-stone-400 hover:bg-stone-200/50 hover:text-stone-700 rounded-md transition-colors hidden md:block">
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 mb-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 pl-2">Navigation</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#EAE8E3] text-stone-900" 
                  : "text-stone-500 hover:bg-[#EAE8E3]/50 hover:text-stone-800"
              )}
            >
              <item.icon className="w-4 h-4 opacity-70" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {mounted && identity && (
        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded bg-[#EAE8E3]/40 border border-stone-200/50">
            <div className="w-8 h-8 rounded bg-stone-200 flex items-center justify-center text-xs font-semibold text-stone-700 font-serif">
              {identity.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-sm truncate">
              <span className="font-medium text-stone-900 truncate">{identity.name}</span>
              <span className="text-xs text-stone-500 truncate">{identity.email}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
