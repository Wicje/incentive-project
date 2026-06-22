"use client";

import { useStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock, MoreVertical, Eye, FileImage, Trash2, Link2, ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@/components/Editor';
import { TaskStage, TaskStatus } from '@/types';
import { toast } from 'sonner';

export default function ProjectDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { projects, tasks, addTask, updateTask, updateProjectCanvas, addAsset, assets, deleteProject, resources, addResource, deleteResource } = useStore();
  const [mounted, setMounted] = useState(false);
  
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectAssets = assets.filter(a => a.projectId === id);
  const projectResources = resources.filter(r => r.projectId === id);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'canvas' | 'board' | 'assets' | 'resources'>('canvas');
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreatingResource, setIsCreatingResource] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', url: '', category: '' });

  const categories = Array.from(new Set(projectResources.map(r => r.category).filter(Boolean)));
  if (!categories.includes('Uncategorized')) {
    categories.push('Uncategorized');
  }

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.url) return;
    
    addResource({
      title: newResource.title,
      url: newResource.url,
      category: newResource.category || 'Uncategorized',
      projectId: id
    });
    setNewResource({ title: '', url: '', category: '' });
    setIsCreatingResource(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-12 text-stone-500 font-sans text-[14px]">Loading...</div>;

  if (!project) {
    return <div className="p-12 text-stone-500 font-sans text-[14px]">Project not found</div>;
  }

  const handleUpdateStatus = (newStatus: 'planning' | 'in-progress' | 'review' | 'completed') => {
    useStore.getState().updateProject(project.id, { status: newStatus });
    setIsStatusMenuOpen(false);
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>, stage: TaskStage) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    
    if (!title || !title.trim()) return;
    
    await addTask({
      projectId: project.id,
      title: title.trim(),
      stage,
      status: 'todo',
      // eslint-disable-next-line react-hooks/purity
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    // Reset the input specifically for this form
    e.currentTarget.reset();
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: TaskStatus) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    await updateTask(taskId, { status: newStatus });
  };

  const stages: {id: TaskStage, label: string}[] = [
    { id: 'research', label: 'Research' },
    { id: 'moodboard', label: 'Moodboard' },
    { id: 'design', label: 'Design' },
    { id: 'delivery', label: 'Delivery' }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="border-b border-[#EFEFEF] px-8 py-6 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white sticky top-0 z-10 shrink-0">
        <div>
          <Link href="/" className="inline-flex items-center text-[12px] font-medium text-stone-500 hover:text-stone-900 mb-3 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Workspace
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl tracking-tight font-bold text-stone-900">{project.name}</h1>
            <div className="relative">
              <button 
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="text-[12px] font-medium px-2 py-1 bg-stone-100 text-stone-600 rounded border border-[#EFEFEF] hover:bg-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {project.status.replace('-', ' ')}
                <MoreVertical className="w-3 h-3 -mr-1" />
              </button>
              {isStatusMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-[#EFEFEF] rounded-lg shadow-lg py-1 z-50">
                  {['planning', 'in-progress', 'review', 'completed'].map((s) => (
                    <button
                      key={s}
                      className={`w-full text-left px-4 py-2 text-[13px] font-medium hover:bg-stone-50 transition-colors ${project.status === s ? 'text-stone-900 bg-stone-50/50' : 'text-stone-500'}`}
                      onClick={() => handleUpdateStatus(s as any)}
                    >
                      {s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-stone-500 mt-2 font-medium text-[14px]">Prepared for <span className="text-stone-900 font-bold">{project.client}</span></p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-stone-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-stone-200 text-stone-600 hover:bg-stone-100"
            onClick={async () => {
              const completedTasks = projectTasks.filter(t => t.status === 'done');
              const pendingTasks = projectTasks.filter(t => t.status !== 'done');
              const report = `Project Update: ${project.name}
Client: ${project.client}
Status: ${project.status.toUpperCase()}

COMPLETED RECENTLY:
${completedTasks.length > 0 ? completedTasks.map(t => '✓ ' + t.title).join('\\n') : 'No completed tasks yet.'}

UPCOMING:
${pendingTasks.length > 0 ? pendingTasks.slice(0, 5).map(t => '☐ ' + t.title).join('\\n') : 'No pending tasks.'}

Please let me know if you have any questions!`;

              await navigator.clipboard.writeText(report);
              toast.success('Status Report copied to clipboard.');
            }}
          >
            Copy Status Report
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="bg-stone-900 text-white hover:bg-stone-800"
            onClick={() => {
              const url = window.location.origin;
              const subject = `Project Update: ${project.name}`;
              const completedTasks = projectTasks.filter(t => t.status === 'done');
              const pendingTasks = projectTasks.filter(t => t.status !== 'done');
              const body = `Hi ${project.client},

Here is the latest update for your project:

Status: ${project.status.toUpperCase()}

COMPLETED:
${completedTasks.length > 0 ? completedTasks.map(t => '✓ ' + t.title).join('%0D%0A') : 'None recently.'}

UPCOMING:
${pendingTasks.length > 0 ? pendingTasks.slice(0, 5).map(t => '☐ ' + t.title).join('%0D%0A') : 'None.'}

Best,
Your Agency`;
              window.location.assign(`mailto:?subject=${encodeURIComponent(subject)}&body=${body}`);
            }}
          >
            Draft Email Update
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 border-b border-[#EFEFEF] bg-white shrink-0">
        <nav className="flex gap-6">
          {(['canvas', 'board', 'assets', 'resources'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-[14px] font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-stone-900 text-stone-900' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Project {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Canvas View */}
          {activeTab === 'canvas' && (
            <div className="space-y-2">
              <div className="bg-white rounded-lg border border-[#EFEFEF] shadow-sm overflow-visible pb-4">
                <Editor 
                  initialContent={project.canvasContent || ''} 
                  onChange={(html) => updateProjectCanvas(project.id, html)} 
                />
              </div>
            </div>
          )}

          {/* Board View */}
          {activeTab === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {stages.map(stage => {
                const stageTasks = projectTasks.filter(t => t.stage === stage.id);
                return (
                  <div key={stage.id} className="bg-[#FAF9F6] rounded-xl p-3 border border-transparent">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="font-semibold text-stone-900 text-sm">{stage.label}</h3>
                      <span className="bg-[#EFEBE4] text-stone-600 text-[11px] py-[2px] px-2.5 rounded font-medium">{stageTasks.length}</span>
                    </div>
                    
                    <div className="space-y-2.5">
                      {stageTasks.map(task => (
                        <div key={task.id} className="bg-white p-3 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-stone-200/60 flex items-start gap-2 group">
                          <button 
                            className="mt-[3px] text-stone-300 group-hover:text-stone-500 transition-colors"
                            onClick={() => toggleTaskStatus(task.id, task.status)}
                          >
                            {task.status === 'done' ? (
                              <CheckCircle2 className="w-[18px] h-[18px] text-stone-900" />
                            ) : (
                              <Circle className="w-[18px] h-[18px]" />
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={`text-[13px] font-medium leading-normal ${task.status === 'done' ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                              {task.title}
                            </p>
                          </div>
                        </div>
                      ))}

                      <form 
                        onSubmit={(e) => handleAddTask(e, stage.id)}
                        className="mt-2"
                      >
                        <input 
                          type="text" 
                          name="title"
                          placeholder="Add a task..." 
                          className="w-full bg-white text-[13px] border border-stone-200/60 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 shadow-sm transition-all text-stone-700 placeholder:text-stone-400"
                        />
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Assets View */}
          {activeTab === 'assets' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-dashed border-stone-300">
                <div>
                  <h3 className="font-semibold text-stone-900 text-base mb-1">Files & Media</h3>
                  <p className="text-sm text-stone-500">Click on any asset to insert it directly into the canvas.</p>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const { uploadToCloudinary } = await import('@/lib/api');
                            const url = await uploadToCloudinary(file);
                            await addAsset(project.id, url, 'image');
                          } catch (err: any) {
                            alert(err.message || 'Upload failed');
                          }
                        }
                      }}
                    />
                    <Button variant="outline" className="border-stone-200 shadow-sm text-stone-700 hover:bg-stone-50">
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>

              {assets.length === 0 ? (
                <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-stone-200">
                  <FileImage className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500 font-medium">No assets available. Upload an image to start using it.</p>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-semibold tracking-wider uppercase text-stone-400 mb-4 px-1">Global & Project Assets</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {assets.map(asset => (
                      <div key={asset.id} className="relative group">
                        <button 
                          onClick={() => {
                            const imgHtml = `<img src="${asset.url}" alt="Asset" />`;
                            updateProjectCanvas(project.id, (project.canvasContent || '') + imgHtml);
                            toast.success('Image added to canvas!');
                          }}
                          className="w-full text-left rounded-2xl overflow-hidden border border-stone-200 aspect-square block bg-stone-100 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-stone-400"
                          title="Click to insert into Canvas"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={asset.url} alt="Asset" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-stone-800 text-xs font-semibold px-2 py-1 rounded shadow-sm">
                              Add to Canvas
                            </span>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Resources View */}
          {activeTab === 'resources' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-dashed border-stone-300">
                <div>
                  <h3 className="font-semibold text-stone-900 text-base mb-1">Resource Library</h3>
                  <p className="text-sm text-stone-500">Links, documents, and reference materials for this project.</p>
                </div>
                <Button onClick={() => setIsCreatingResource(!isCreatingResource)} variant="outline" className="border-stone-200 shadow-sm text-stone-700 hover:bg-stone-50">
                  <Plus className="w-4 h-4 mr-2" /> Add Link
                </Button>
              </div>

              {isCreatingResource && (
                <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
                  <h3 className="font-sans text-xl font-semibold text-stone-800 mb-6">New Resource Link</h3>
                  <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <Button type="submit" size="sm" className="bg-stone-900 hover:bg-stone-800 text-white border-none transition-colors">Save Resource</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setIsCreatingResource(false)}>Cancel</Button>
                    </div>
                  </form>
                </section>
              )}

              {projectResources.length === 0 ? (
                <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-stone-200">
                  <Link2 className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500 font-medium">No resources available. Add a link to get started.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {categories.map(category => {
                    const catResources = projectResources.filter(r => (r.category || 'Uncategorized') === category);
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
                                {/* Use simple custom date formatter to avoid missing import */}
                                Added {new Date(resource.createdAt).toLocaleDateString()}
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
          )}

        </div>
      </div>
      {isDeleteDialogOpen && (
        <>
          <div className="fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteDialogOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] bg-white rounded-xl shadow-xl border border-stone-200/60 p-6 w-[90%] max-w-md animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-sans text-xl font-bold text-stone-900 mb-2">Delete Project?</h3>
            <p className="text-sm text-stone-500 mb-6 font-medium leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-stone-700">&quot;{project.name}&quot;</span>? This action cannot be undone and will permanently remove all tasks, assets, and project data.
            </p>
            
            <div className="flex gap-3 justify-end mt-4">
              <Button type="button" variant="outline" className="text-stone-600 border-stone-200/60 shadow-sm" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                className="bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent" 
                onClick={async () => {
                  try {
                    await deleteProject(project.id);
                    router.push('/pipeline');
                  } catch (e) {
                    console.error("Delete failed", e);
                  } finally {
                    setIsDeleteDialogOpen(false);
                  }
                }}
              >
                Delete Project
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
