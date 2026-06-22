"use client";

import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link2, Plus, Type, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResourcesPage() {
  const { resources: allResources, addResource, deleteResource } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const resources = allResources.filter(r => !r.projectId);

  const [isCreating, setIsCreating] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', url: '', category: '' });

  if (!mounted) return null;

  const categories = Array.from(new Set(resources.map(r => r.category).filter(Boolean)));
  if (!categories.includes('Uncategorized')) {
    categories.push('Uncategorized');
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.url) return;
    
    addResource({
      title: newResource.title,
      url: newResource.url,
      category: newResource.category || 'Uncategorized'
    });
    setNewResource({ title: '', url: '', category: '' });
    setIsCreating(false);
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 bg-[#FAF9F6] min-h-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
        <div>
          <h1 className="text-4xl font-serif font-semibold tracking-tight text-stone-900 mb-2">Resource Library</h1>
          <p className="text-stone-500 font-medium tracking-wide text-sm">A centralized knowledge base and asset directory.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)} className="bg-stone-900 text-white hover:bg-stone-800">
          <Plus className="w-4 h-4 mr-2" /> Add Resource
        </Button>
      </header>

      {isCreating && (
        <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          <h3 className="font-serif text-xl font-semibold text-stone-800 mb-6">New Resource Link</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Title</label>
              <input required type="text" placeholder="Brand Guidelines PDF" className="w-full border border-stone-200 rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-stone-400 focus:outline-none" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">URL</label>
              <input required type="url" placeholder="https://..." className="w-full border border-stone-200 rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-stone-400 focus:outline-none" value={newResource.url} onChange={e => setNewResource({...newResource, url: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Category</label>
              <input type="text" list="categories-list" placeholder="Design, Strategy, etc." className="w-full border border-stone-200 rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-stone-400 focus:outline-none" value={newResource.category} onChange={e => setNewResource({...newResource, category: e.target.value})} />
              <datalist id="categories-list">
                {categories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="md:col-span-3 flex gap-3 pt-2">
              <Button type="submit" size="sm" className="bg-stone-900 text-white border-none">Save Resource</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </form>
        </section>
      )}

      {resources.length === 0 ? (
        <div className="p-12 text-center border font-medium border-dashed border-stone-300 rounded-2xl bg-white text-stone-500">
          Library is empty.
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map(category => {
            const catResources = resources.filter(r => (r.category || 'Uncategorized') === category);
            if (catResources.length === 0) return null;
            return (
              <div key={category} className="space-y-4">
                <h2 className="text-sm font-bold tracking-widest uppercase text-stone-400 px-1 border-b border-stone-200 pb-2">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catResources.map(resource => (
                    <div key={resource.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-stone-50 rounded text-stone-500 border border-stone-100 group-hover:bg-stone-100 transition-colors">
                          <Link2 className="w-4 h-4" />
                        </div>
                        <div className="flex gap-1">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded transition-colors hidden group-hover:block">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button onClick={() => deleteResource(resource.id)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-stone-50 rounded transition-colors hidden group-hover:block">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-stone-800 text-sm mb-1 line-clamp-1">{resource.title}</h3>
                      <p className="text-xs text-stone-400 font-mono truncate mb-4">{resource.url}</p>
                      
                      <div className="mt-auto text-[10px] uppercase font-bold tracking-wider text-stone-400">
                        Added {format(new Date(resource.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
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
