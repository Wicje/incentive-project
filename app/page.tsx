"use client";

import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import Link from 'next/link';
import { Plus, Folder, Calendar, Activity, Command, FileText, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
  const { projects, logs, tasks, identity, addProject, addTask } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', projectId: '' });
  const [newProject, setNewProject] = useState({ name: '', client: '', deadline: '' });

  if (!identity) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client) return;

    await addProject({
      name: newProject.name,
      client: newProject.client,
      status: 'planning',
      startDate: new Date().toISOString(),
      deadline: newProject.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ownerName: identity.name,
      ownerEmail: identity.email,
    });
    
    setNewProject({ name: '', client: '', deadline: '' });
    setIsCreating(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.projectId) return;

    await addTask({
      projectId: newTask.projectId,
      title: newTask.title,
      stage: 'research',
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    
    setNewTask({ title: '', projectId: '' });
    setIsCreatingTask(false);
  };

  const activeTasks = tasks.filter(t => t.status !== 'done');

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
        <div>
          <h1 className="text-4xl font-serif font-semibold tracking-tight text-stone-900 mb-2">Agency Dashboard</h1>
          <p className="text-stone-500 font-medium tracking-wide text-sm">Welcome back, {identity.name}. Here&apos;s the state of your agency.</p>
        </div>
      </header>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-semibold tracking-wider uppercase text-stone-400 mb-4 px-1">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm text-left group"
          >
            <div className="bg-stone-100 p-2 rounded group-hover:bg-white transition-colors border border-transparent group-hover:border-stone-200">
              <Plus className="w-4 h-4 text-stone-700" />
            </div>
            <span className="font-medium text-stone-700 text-sm">New Project</span>
          </button>
          
          <button 
            onClick={() => { setIsCreatingTask(!isCreatingTask); setIsCreating(false); }}
            className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm text-left group"
          >
            <div className="bg-stone-100 p-2 rounded group-hover:bg-white transition-colors border border-transparent group-hover:border-stone-200">
              <CheckCircle2 className="w-4 h-4 text-stone-700" />
            </div>
            <span className="font-medium text-stone-700 text-sm">New Task</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm text-left group cursor-not-allowed opacity-70">
            <div className="bg-stone-100 p-2 rounded border border-transparent">
              <FileText className="w-4 h-4 text-stone-700" />
            </div>
            <span className="font-medium text-stone-700 text-sm">New Resources</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm text-left group cursor-not-allowed opacity-70">
            <div className="bg-stone-100 p-2 rounded border border-transparent">
              <Command className="w-4 h-4 text-stone-700" />
            </div>
            <span className="font-medium text-stone-700 text-sm">Quick Draft</span>
          </button>
        </div>
      </section>

      {isCreating && (
        <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
            <h3 className="font-serif text-2xl font-semibold text-stone-800">Initiate Project</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Project Name</label>
              <Input 
                placeholder="e.g. Acme Rebrand" 
                value={newProject.name}
                onChange={e => setNewProject({...newProject, name: e.target.value})}
                required
                className="bg-stone-50 border-stone-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Client</label>
              <Input 
                placeholder="Client Name" 
                value={newProject.client}
                onChange={e => setNewProject({...newProject, client: e.target.value})}
                required
                className="bg-stone-50 border-stone-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Expected Deadline</label>
              <Input 
                type="date"
                value={newProject.deadline}
                onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                className="bg-stone-50 border-stone-200 h-11"
              />
            </div>
            <div className="md:col-span-3 pt-2">
              <Button type="submit" className="bg-stone-900 text-white w-full md:w-auto hover:bg-stone-800">
                Create Workspace
              </Button>
            </div>
          </form>
        </section>
      )}

      {isCreatingTask && (
        <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
            <h3 className="font-serif text-2xl font-semibold text-stone-800">New Task</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsCreatingTask(false)}>Cancel</Button>
          </div>
          <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Task Title</label>
              <Input 
                placeholder="What needs to be done?" 
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                required
                className="bg-stone-50 border-stone-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Project</label>
              <select 
                value={newTask.projectId}
                onChange={e => setNewTask({...newTask, projectId: e.target.value})}
                required
                className="flex h-11 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 disabled:cursor-not-allowed disabled:opacity-50 text-stone-900"
              >
                <option value="" disabled>Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 pt-2">
              <Button type="submit" className="bg-stone-900 text-white w-full md:w-auto hover:bg-stone-800">
                Add Task
              </Button>
            </div>
          </form>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Projects Container */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-stone-400">Project Boards</h2>
            <span className="text-xs text-stone-400 font-mono tracking-widest">COUNT {projects.length}</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-stone-300">
              <Folder className="w-8 h-8 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 font-medium">No projects yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const progress = projectTasks.length ? Math.round((projectTasks.filter(t => t.status === 'done').length / projectTasks.length) * 100) : 0;
                
                return (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div className="group border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-all hover:border-stone-300 bg-white cursor-pointer h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-stone-100 rounded-lg group-hover:bg-[#EAE8E3] transition-colors">
                          <Folder className="w-5 h-5 text-stone-600" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm border border-stone-200 text-stone-500 bg-stone-50 group-hover:bg-white inset-ring">
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1 mb-1">{project.name}</h3>
                      <p className="text-sm font-medium text-stone-500 mb-6">{project.client}</p>
                      
                      <div className="mt-auto space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                          <span>Progress</span>
                          <span className="font-mono">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-stone-800 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Sidebar Info Columns */}
        <div className="lg:col-span-4 space-y-8">

          {/* Active Tasks list */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-stone-400 px-1">Tasks Today</h2>
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              {activeTasks.length === 0 ? (
                <p className="text-stone-400 text-sm text-center py-6">All caught up.</p>
              ) : (
                <div className="space-y-3">
                  {activeTasks.slice(0, 6).map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    return (
                      <div key={task.id} className="flex gap-3 items-start group">
                        <div className="mt-0.5">
                          <Circle className="w-4 h-4 text-stone-300 group-hover:text-stone-400 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-800 leading-tight">{task.title}</p>
                          {project && <p className="text-[10px] uppercase tracking-wider text-stone-400 mt-0.5 font-semibold">{project.name}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-stone-400 px-1">Activity Log</h2>
            <div className="bg-transparent">
              {logs.length === 0 ? (
                <p className="text-stone-400 text-sm py-4">No activity recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {logs.slice(0, 5).map((log) => {
                    const project = projects.find(p => p.id === log.projectId);
                    return (
                      <div key={log.id} className="flex gap-4 p-4 border border-stone-200 rounded-xl bg-white shadow-sm hover:border-stone-300 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/60">
                          <Activity className="w-4 h-4 text-stone-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-800 truncate">{log.action}</p>
                          <p className="text-xs text-stone-500 truncate mt-0.5">{log.details}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-mono text-stone-400">{format(new Date(log.createdAt), 'MMM d, p')}</span>
                            {project && (
                              <>
                                <span className="text-stone-300 text-[10px]">•</span>
                                <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400">{project.client}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
