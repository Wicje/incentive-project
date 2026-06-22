"use client";

import Link from 'next/link';
import { Target, PenTool, LayoutTemplate, Plus, FileText, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TemplatesPage() {
  const { customTemplates, addCustomTemplate, removeCustomTemplate } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', canvasTemplate: '' });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name) return;
    
    addCustomTemplate({
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      canvasTemplate: newTemplate.canvasTemplate
    });
    setNewTemplate({ name: '', description: '', canvasTemplate: '' });
    setIsCreating(false);
  };

  const templates = [
    {
      id: 'brand-architecture',
      title: 'Full Brand Architecture',
      description: 'A 22-step comprehensive branding framework for a complete identity system.',
      icon: LayoutTemplate,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      href: '/templates/brand-architecture'
    },
    {
      id: 'logo-architecture',
      title: 'Logo Architecture',
      description: 'A 15-step focused framework for professional logo design and delivery.',
      icon: PenTool,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      href: '/templates/logo-architecture'
    }
  ];

  if (!mounted) return null;

  return (
    <div className="flex h-full bg-[#FAF9F6] flex-col w-full overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full p-8 md:p-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-sans font-bold text-stone-900 tracking-tight flex items-center gap-3">
              <Target className="w-8 h-8 text-stone-700" />
              Template Library
            </h1>
            <p className="text-stone-500 font-medium mt-2">Standardize your workflow with proven frameworks and custom architectures.</p>
          </div>
          <Button onClick={() => setIsCreating(!isCreating)} className="bg-stone-900 text-white hover:bg-stone-800">
            <Plus className="w-4 h-4 mr-2" /> Create Template
          </Button>
        </header>

        {isCreating && (
          <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm mb-10">
            <h3 className="font-serif text-xl font-semibold text-stone-800 mb-6">New Custom Template</h3>
            <form onSubmit={handleAddTemplate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Template Name</label>
                  <Input required placeholder="E.g., Web Design Retainer" value={newTemplate.name} onChange={e => setNewTemplate({...newTemplate, name: e.target.value})} className="h-10" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Description</label>
                  <Input placeholder="What is this template for?" value={newTemplate.description} onChange={e => setNewTemplate({...newTemplate, description: e.target.value})} className="h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Initial Canvas Content (HTML)</label>
                <textarea 
                  placeholder="<h1>My Template</h1><p>Checklist goes here...</p>" 
                  value={newTemplate.canvasTemplate} 
                  onChange={e => setNewTemplate({...newTemplate, canvasTemplate: e.target.value})} 
                  className="w-full h-32 border border-stone-200 rounded-md p-3 text-sm font-mono focus:ring-1 focus:ring-stone-400 focus:outline-none" 
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" size="sm" className="bg-stone-900 text-white border-none">Save Template</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </form>
          </section>
        )}

        <div className="space-y-12">
          {customTemplates.length > 0 && (
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-stone-400 px-1 border-b border-stone-200 pb-2 mb-4">Custom Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customTemplates.map(template => (
                  <div key={template.id} className="group border border-[#EFEFEF] bg-white rounded-xl p-6 shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <button onClick={() => removeCustomTemplate(template.id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-xl font-bold font-sans text-stone-900 mb-2">{template.name}</h3>
                    <p className="text-[14px] text-stone-500 font-medium leading-relaxed flex-1">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-stone-400 px-1 border-b border-stone-200 pb-2 mb-4">Agency Frameworks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map(template => (
                <Link key={template.id} href={template.href}>
                  <div className="group border border-[#EFEFEF] bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-lg ${template.bg} ${template.color} flex items-center justify-center mb-6`}>
                      <template.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-sans text-stone-900 mb-2 group-hover:text-stone-700 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-[14px] text-stone-500 font-medium leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
