"use client";

import { useStore } from '@/lib/store';
import { useParams } from 'next/navigation';
import { ShieldAlert, Zap } from 'lucide-react';
import Editor from '@/components/Editor';

export default function ClientProjectView() {
  const { id } = useParams() as { id: string };
  const { projects } = useStore();
  
  const project = projects.find(p => p.id === id);

  if (!project) {
    return <div className="p-12 text-center text-stone-500 font-serif">Project not found or link has expired.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#EAE8E3]">
      <div className="max-w-4xl mx-auto py-16 px-8">
        
        <header className="mb-16 flex items-center justify-between border-b border-stone-200/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-stone-900 rounded flex items-center justify-center text-[#FAF9F6] shrink-0">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-serif font-semibold tracking-tight text-xl text-stone-900">Agency OS Portal</span>
          </div>

          <div className="flex items-center text-[10px] uppercase tracking-widest text-stone-600 bg-[#EAE8E3] px-3 py-1.5 rounded border border-stone-200/50 font-bold">
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Client View
          </div>
        </header>

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-serif font-bold tracking-tight text-stone-900 mb-4">{project.name}</h1>
          <p className="text-lg text-stone-500 font-medium">Prepared for <span className="text-stone-900 font-bold">{project.client}</span></p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden">
          <div className="bg-stone-50/50 border-b border-stone-100 px-8 py-6">
            <h2 className="font-semibold text-stone-800 tracking-wide">Project Presentation</h2>
          </div>
          <div className="p-8 pt-6">
            <Editor 
              initialContent={project.canvasContent || '<p>No presentation content has been added yet.</p>'} 
              readOnly={true} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
