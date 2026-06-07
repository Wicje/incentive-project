"use client";

import { useStore } from '@/lib/store';
import { useParams } from 'next/navigation';
import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock, MoreVertical, Eye, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@/components/Editor';
import { TaskStage, TaskStatus } from '@/types';

export default function ProjectDetail() {
  const { id } = useParams() as { id: string };
  const { projects, tasks, addTask, updateTask, updateProjectCanvas, addAsset, assets } = useStore();
  
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectAssets = assets.filter(a => a.projectId === id);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'board' | 'canvas' | 'assets'>('canvas');

  if (!project) {
    return <div className="p-12 text-stone-500 font-serif">Project not found</div>;
  }

  const handleAddTask = async (e: React.FormEvent, stage: TaskStage) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await addTask({
      projectId: project.id,
      title: newTaskTitle.trim(),
      stage,
      status: 'todo',
      // eslint-disable-next-line react-hooks/purity
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    setNewTaskTitle('');
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
    <div className="flex flex-col h-full bg-[#FAF9F6]">
      {/* Header */}
      <header className="border-b border-stone-200/60 px-8 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#FAF9F6] sticky top-0 z-10 shrink-0">
        <div>
          <Link href="/" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-stone-400 hover:text-stone-800 mb-6 transition-colors">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to Workspace
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-stone-900">{project.name}</h1>
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 bg-stone-100 text-stone-600 rounded border border-stone-200">
              {project.status.replace('-', ' ')}
            </span>
          </div>
          <p className="text-stone-500 mt-2 tracking-wide font-medium">Prepared for <span className="text-stone-900 font-bold">{project.client}</span></p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href={`/projects/${project.id}/client`} target="_blank">
            <Button variant="outline" size="sm" className="border-stone-200 text-stone-600 hover:bg-stone-100">
              <Eye className="w-4 h-4 mr-2" />
              Client Portal
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
                          placeholder="Add task..." 
                          className="w-full bg-white/80 text-sm border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 shadow-sm transition-all text-stone-700 placeholder:text-stone-400"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                              setNewTaskTitle(e.currentTarget.value);
                            }
                          }}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
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
                  <h3 className="font-semibold text-stone-900 text-base mb-1">Asset Library</h3>
                  <p className="text-sm text-stone-500">Assets are also synced automatically when dropped into the canvas.</p>
                </div>
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
                        } catch (err) {
                          alert('Upload failed');
                        }
                      }
                    }}
                  />
                  <Button variant="outline" className="border-stone-200 shadow-sm text-stone-700 hover:bg-stone-50">
                    Upload File
                  </Button>
                </div>
              </div>

              {projectAssets.length === 0 ? (
                <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-stone-200">
                  <FileImage className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                  <p className="text-stone-500 font-medium">No assets uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {projectAssets.map(asset => (
                    <a key={asset.id} href={asset.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl overflow-hidden border border-stone-200 aspect-square block bg-stone-100 relative shadow-sm hover:shadow-md transition-shadow cursor-zoom-in">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset.url} alt="Asset" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
