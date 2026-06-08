"use client";

import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { Folder, MoreHorizontal, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PipelinePage() {
  const { projects } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Group by client
  const clients = Array.from(new Set(projects.map(p => p.client)));

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 bg-[#FAF9F6] min-h-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
        <div>
          <h1 className="text-4xl font-serif font-semibold tracking-tight text-stone-900 mb-2">Client Pipeline</h1>
          <p className="text-stone-500 font-medium tracking-wide text-sm">Active relational database of your clients and projects.</p>
        </div>
      </header>

      {clients.length === 0 ? (
        <div className="p-12 text-center border font-medium border-dashed border-stone-300 rounded-2xl bg-white text-stone-500">
          No clients yet. Create a project to start building your pipeline.
        </div>
      ) : (
        <div className="space-y-12">
          {clients.map(clientName => {
            const clientProjects = projects.filter(p => p.client === clientName);
            return (
              <div key={clientName} className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-stone-200 text-stone-800">
                  <div className="p-2 bg-stone-200 rounded text-stone-700">
                    <User className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">{clientName}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {clientProjects.map(project => (
                    <Link href={`/projects/${project.id}`} key={project.id}>
                      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow hover:border-stone-300 group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
                            <span className="font-semibold text-stone-800 line-clamp-1">{project.name}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-500 border border-stone-200 rounded font-bold uppercase tracking-wider">
                            {project.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 font-mono flex items-center justify-between">
                          <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                          <span>Due {format(new Date(project.deadline), 'MMM d')}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
