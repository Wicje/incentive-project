"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useStore } from '@/lib/store';
import { FileText, Folder, Calendar, User, LayoutDashboard, Search } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { projects, notes, invoices } = useStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-stone-900/40 backdrop-blur-sm transition-opacity flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <Command label="Global Command Menu" className="w-full flex flex-col h-[400px]">
          <div className="flex items-center border-b border-stone-200 dark:border-stone-800 px-3">
            <Search className="w-5 h-5 text-stone-400 shrink-0" />
            <Command.Input 
              autoFocus
              placeholder="Search projects, notes, or invoices..." 
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-3 py-4 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>

          <Command.List className="flex-1 overflow-y-auto p-2 outline-none">
            <Command.Empty className="py-6 text-center text-sm text-stone-500">No results found.</Command.Empty>

            <Command.Group heading="Pages" className="text-xs font-medium text-stone-500 px-2 py-2">
              <Command.Item 
                onSelect={() => { router.push('/'); setOpen(false); }}
                className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm aria-selected:bg-stone-100 dark:aria-selected:bg-stone-800"
              >
                <LayoutDashboard className="w-4 h-4 text-stone-400" />
                Workspace
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push('/pipeline'); setOpen(false); }}
                className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm aria-selected:bg-stone-100 dark:aria-selected:bg-stone-800"
              >
                <Folder className="w-4 h-4 text-stone-400" />
                Pipeline
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push('/calendar'); setOpen(false); }}
                className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm aria-selected:bg-stone-100 dark:aria-selected:bg-stone-800"
              >
                <Calendar className="w-4 h-4 text-stone-400" />
                Calendar
              </Command.Item>
            </Command.Group>

            {projects.length > 0 && (
              <Command.Group heading="Projects" className="text-xs font-medium text-stone-500 px-2 py-2 mt-2">
                {projects.map(project => (
                  <Command.Item 
                    key={project.id}
                    onSelect={() => { router.push(`/projects/${project.id}`); setOpen(false); }}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm aria-selected:bg-stone-100 dark:aria-selected:bg-stone-800"
                  >
                    <Folder className="w-4 h-4 text-stone-400" />
                    {project.name} <span className="text-stone-400 text-xs ml-auto">{project.client}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {notes.length > 0 && (
              <Command.Group heading="Notes" className="text-xs font-medium text-stone-500 px-2 py-2 mt-2">
                {notes.map(note => (
                  <Command.Item 
                    key={note.id}
                    onSelect={() => { router.push(`/inbox?noteId=${note.id}`); setOpen(false); }}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm aria-selected:bg-stone-100 dark:aria-selected:bg-stone-800"
                  >
                    <FileText className="w-4 h-4 text-stone-400" />
                    {note.title || 'Untitled Note'}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {invoices.length > 0 && (
              <Command.Group heading="Invoices" className="text-xs font-medium text-stone-500 px-2 py-2 mt-2">
                {invoices.map(invoice => (
                  <Command.Item 
                    key={invoice.id}
                    onSelect={() => { router.push(`/invoices/${invoice.id}`); setOpen(false); }}
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-sm aria-selected:bg-stone-100 dark:aria-selected:bg-stone-800"
                  >
                    <FileText className="w-4 h-4 text-stone-400" />
                    {invoice.clientName} <span className="text-stone-400 text-xs ml-auto">₦{invoice.items.reduce((acc, curr) => acc + (curr.rate * curr.quantity), 0).toFixed(2)}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

          </Command.List>
        </Command>
      </div>
      
      {/* Background click to close */}
      <div className="absolute inset-0 z-[-1]" onClick={() => setOpen(false)} />
    </div>
  );
}
