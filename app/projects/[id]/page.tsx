"use client";

import { useStore } from '@/lib/store';
import { useParams } from 'next/navigation';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock, MoreVertical, Eye, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@/components/Editor';
import { TaskStage, TaskStatus } from '@/types';

export default function ProjectDetail() {
  const { id } = useParams() as { id: string };
  const { projects, tasks, addTask, updateTask, updateProjectCanvas, addAsset, assets } = useStore();
  const [mounted, setMounted] = useState(false);
  
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectAssets = assets.filter(a => a.projectId === id);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'canvas' | 'board' | 'assets'>('canvas');
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-12 text-stone-500 font-serif">Loading...</div>;

  if (!project) {
    return <div className="p-12 text-stone-500 font-serif">Project not found</div>;
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
    <div className="flex flex-col h-full bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200/60 px-6 py-4 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-zinc-50 sticky top-0 z-10 shrink-0">
        <div>
          <Link href="/" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-zinc-800 mb-2 transition-colors">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to Workspace
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-zinc-900">{project.name}</h1>
            <div className="relative">
              <button 
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-stone-100 text-stone-600 rounded border border-stone-200 hover:bg-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {project.status.replace('-', ' ')}
                <MoreVertical className="w-3 h-3 -mr-1" />
              </button>
              {isStatusMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-50">
                  {['planning', 'in-progress', 'review', 'completed'].map((s) => (
                    <button
                      key={s}
                      className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-stone-50 ${project.status === s ? 'text-stone-900 bg-stone-50/50' : 'text-stone-500'}`}
                      onClick={() => handleUpdateStatus(s as any)}
                    >
                      {s.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-stone-500 mt-2 tracking-wide font-medium">Prepared for <span className="text-stone-900 font-bold">{project.client}</span></p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-stone-200 text-stone-600 hover:bg-stone-100"
            onClick={async () => {
              const url = window.location.origin + `/projects/${project.id}/client`;
              const subject = `Project Update: ${project.name}`;
              const body = `Hi ${project.client},\n\nYou can view the latest updates for your project here: ${url}\n\nBest,\nYour Agency`;
              const encodedSubject = encodeURIComponent(subject);
              const encodedBody = encodeURIComponent(body);
              
              const res = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: project.client, // This would normally be an email address if we captured it
                  subject,
                  text: body,
                })
              });
              if (!res.ok) {
                window.location.assign(`mailto:?subject=${encodedSubject}&body=${encodedBody}`);
              } else {
                alert('Project preview sent to client!');
              }
            }}
          >
            Email Client Link
          </Button>
          <Link href={`/projects/${project.id}/client`} target="_blank">
            <Button variant="default" size="sm" className="bg-stone-900 text-white hover:bg-stone-800">
              <Eye className="w-4 h-4 mr-2" />
              Client Preview
            </Button>
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-8 border-b border-stone-200/60 bg-[#FAF9F6] shrink-0">
        <nav className="flex gap-8">
          {(['canvas', 'board', 'assets'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === tab 
                  ? 'border-stone-900 text-stone-900' 
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Canvas View */}
          {activeTab === 'canvas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-semibold text-stone-800">Project Canvas</h2>
                <p className="text-xs font-medium tracking-wide text-stone-400">Drag & drop images anywhere into the editor</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden">
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
                  <div key={stage.id} className="bg-white/50 rounded-2xl p-4 border border-stone-200/60">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-semibold text-stone-800 text-sm tracking-wide">{stage.label}</h3>
                      <span className="bg-stone-100 text-stone-500 font-mono text-[10px] py-1 px-2 rounded font-bold shadow-sm">{stageTasks.length}</span>
                    </div>
                    
                    <div className="space-y-3">
                      {stageTasks.map(task => (
                        <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex items-start gap-3 group">
                          <button 
                            className="mt-0.5 text-stone-300 group-hover:text-stone-500 transition-colors"
                            onClick={() => toggleTaskStatus(task.id, task.status)}
                          >
                            {task.status === 'done' ? (
                              <CheckCircle2 className="w-5 h-5 text-stone-900" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                          <div className="flex-1 pt-0.5">
                            <p className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through text-stone-400' : 'text-stone-800'}`}>
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
                          placeholder="Add task..." 
                          className="w-full bg-white/80 text-sm border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 shadow-sm transition-all text-stone-700 placeholder:text-stone-400"
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
                            alert('Image added to canvas!');
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

        </div>
      </div>
    </div>
  );
}
