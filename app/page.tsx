"use client";

import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import Link from 'next/link';
import { Plus, Folder, Calendar, Activity, Command, FileText, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { PROJECT_TEMPLATES, MOODBOARD_TEMPLATES } from '@/lib/templates';

export default function Dashboard() {
  const router = useRouter();
  const { projects, logs, tasks, identity, addProject, addTask } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', projectId: '' });
  const [newProject, setNewProject] = useState({ name: '', client: '', deadline: '', templateId: '' });
  const [projectTab, setProjectTab] = useState<'recent' | 'all'>('recent');

  if (!identity) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.client) return;

    let canvasTemplate = '';
    let defaultTasks: any[] = [];
    if (newProject.templateId) {
      const selected = MOODBOARD_TEMPLATES.find(t => t.id === newProject.templateId) || PROJECT_TEMPLATES.find(t => t.id === newProject.templateId);
      if (selected && 'content' in selected) {
        canvasTemplate = selected.content;
      } else if (selected && 'canvasTemplate' in selected) {
        canvasTemplate = selected.canvasTemplate;
      }

      const projectSelected = PROJECT_TEMPLATES.find(t => t.id === newProject.templateId);
      if (projectSelected && projectSelected.defaultTasks) {
        defaultTasks = projectSelected.defaultTasks;
      }
    }

    const newProjectId = await addProject({
      name: newProject.name,
      client: newProject.client,
      status: 'planning',
      startDate: new Date().toISOString(),
      deadline: newProject.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ownerName: identity.name,
      ownerEmail: identity.email,
      canvasContent: canvasTemplate
    });
    
    // Add default tasks
    if (newProjectId && defaultTasks.length > 0) {
      for (const t of defaultTasks) {
        await addTask({
          projectId: newProjectId,
          title: t.title,
          stage: t.stageId as any,
          status: 'todo',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }
    
    setNewProject({ name: '', client: '', deadline: '', templateId: '' });
    setIsCreating(false);
    toast.success('Workspace created successfully');
    
    if (newProjectId) {
      router.push(`/projects/${newProjectId}`);
    }
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
    toast.success('Task added successfully');
    router.push(`/projects/${newTask.projectId}`);
  };

  const activeTasks = tasks.filter(t => t.status !== 'done');

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      
      <header className="pt-8 pb-10 flex flex-col items-start justify-center gap-2">
        <h1 className="text-[32px] sm:text-[36px] font-sans font-bold tracking-tight text-stone-900 leading-tight">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {identity.name.split(' ')[0]}</h1>
        <p className="text-stone-500 font-medium text-[15px]">Here&apos;s what&apos;s happening in your workspace today.</p>
      </header>

      {/* Navigation / Domains Bento Grid */}
      <section className="space-y-4">
        <h2 className="text-[14px] font-medium tracking-tight text-stone-500 px-1 flex items-center gap-2">
          <Folder className="w-4 h-4 text-stone-400" />
          Quick Links
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Inbox & Ideas', icon: Command, color: 'text-stone-700', href: '/inbox' },
            { name: 'Client Pipeline', icon: Folder, color: 'text-stone-700', href: '/pipeline' },
            { name: 'Finance & Invoices', icon: FileText, color: 'text-stone-700', href: '/finance' },
            { name: 'Resource Library', icon: Activity, color: 'text-stone-700', href: '/resources' },
          ].map((domain, i) => (
            <Link href={domain.href} key={i}>
              <button className="w-full flex items-center gap-3 p-4 bg-stone-900 dark:bg-[#1a212c] text-white border border-transparent rounded-[10px] hover:bg-stone-800 dark:hover:bg-[#141a22] transition-colors shadow-sm text-left group h-full">
                <div className={`p-2 rounded-md bg-white/10 text-white transition-colors group-hover:bg-white/20`}>
                  <domain.icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-white text-[14px] tracking-tight">{domain.name}</span>
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* Action Bar */}
      <section className="flex items-center gap-2 pb-2">
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-[6px] hover:bg-stone-800 transition-colors shadow-sm text-[13px] font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          New Project
        </button>
        <button 
          onClick={() => { setIsCreatingTask(!isCreatingTask); setIsCreating(false); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-stone-700 border border-[#EFEFEF] rounded-[6px] hover:bg-[#F9F9F8] transition-colors shadow-sm text-[13px] font-medium"
        >
          <Plus className="w-3.5 h-3.5 text-stone-400" />
          Add Task
        </button>
      </section>

      {isCreating && (
        <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
            <h3 className="font-sans text-xl tracking-tight font-semibold text-stone-900">Initiate Project</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Template</label>
              <select 
                value={newProject.templateId}
                onChange={e => setNewProject({...newProject, templateId: e.target.value})}
                className="flex h-11 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 disabled:cursor-not-allowed disabled:opacity-50 text-stone-900"
              >
                <option value="">Blank Workspace</option>
                <optgroup label="Agency">
                  {PROJECT_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </optgroup>
                <optgroup label="Moodboards">
                  {MOODBOARD_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </optgroup>
              </select>
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
            <div className="md:col-span-4 pt-2">
              <Button type="submit" className="bg-stone-900 text-white w-full md:w-auto hover:bg-stone-800 border-none transition-colors hidden md:block">
                Create Workspace
              </Button>
              <Button type="submit" className="bg-stone-900 text-white w-full md:hidden">
                Create
              </Button>
            </div>
          </form>
        </section>
      )}

      {isCreatingTask && (
        <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
            <h3 className="font-sans text-xl tracking-tight font-semibold text-stone-900">New Task</h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Active Projects Container */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1 border-b border-stone-200 pb-2">
            <div className="flex gap-4">
              <button 
                onClick={() => setProjectTab('recent')}
                className={`text-[14px] font-medium tracking-tight flex items-center gap-2 ${projectTab === 'recent' ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 pb-2 -mb-[9px]' : 'text-stone-500 hover:text-stone-700 pb-2 -mb-[9px]'}`}
              >
                Recent
              </button>
              <button 
                onClick={() => setProjectTab('all')}
                className={`text-[14px] font-medium tracking-tight flex items-center gap-2 ${projectTab === 'all' ? 'text-stone-900 dark:text-stone-100 border-b-2 border-stone-900 dark:border-stone-100 pb-2 -mb-[9px]' : 'text-stone-500 hover:text-stone-700 pb-2 -mb-[9px]'}`}
              >
                All Projects
              </button>
            </div>
            <span className="text-[12px] text-stone-400 font-medium">COUNT {projects.length}</span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-stone-300">
              <Folder className="w-8 h-8 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 font-medium">No projects yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(projectTab === 'recent' ? [...projects].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3) : projects).map((project) => {
                const projectTasks = tasks.filter(t => t.projectId === project.id);
                const progress = projectTasks.length ? Math.round((projectTasks.filter(t => t.status === 'done').length / projectTasks.length) * 100) : 0;
                
                return (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div className="group border border-[#EFEFEF] rounded-[10px] p-5 hover:bg-[#F9F9F8] transition-colors bg-white cursor-pointer h-full flex flex-col shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 text-stone-600">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-[14px] font-medium text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 truncate">{project.name}</span>
                        </div>
                      </div>
                      <p className="text-[13px] text-stone-500 mb-6 pl-6">{project.client}</p>
                      
                      <div className="mt-auto space-y-2 pl-6">
                        <div className="flex items-center justify-between text-[12px] font-medium text-stone-500">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-[#EFEFEF] rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
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
            <h2 className="text-[14px] font-medium tracking-tight text-stone-500 px-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-stone-400" />
              Tasks today
            </h2>
            <div className="bg-white border border-[#EFEFEF] rounded-[10px] p-5 shadow-sm">
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
                          <Link href={`/projects/${task.projectId}`} className="hover:underline">
                            <p className="text-sm font-medium text-stone-800 dark:text-stone-100 leading-tight">{task.title}</p>
                          </Link>
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
            <h2 className="text-[14px] font-medium tracking-tight text-stone-500 px-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-stone-400" />
              Activity log
            </h2>
            <div className="bg-transparent">
              {logs.length === 0 ? (
                <p className="text-stone-400 text-sm py-4">No activity recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {logs.slice(0, 5).map((log) => {
                    const project = projects.find(p => p.id === log.projectId);
                    return (
                      <div key={log.id} className="flex gap-4 p-4 border border-[#EFEFEF] rounded-[10px] bg-white shadow-sm hover:bg-[#F9F9F8] transition-colors">
                        <div className="w-8 h-8 rounded shrink-0 border border-transparent bg-stone-50 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-stone-400" />
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
