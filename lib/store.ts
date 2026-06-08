import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Identity, Project, Task, Log, Asset, Note, Invoice, Resource } from '@/types';
import * as api from './api';

interface AgencyState {
  sidebarOpen: boolean;
  identity: Identity | null;
  projects: Project[];
  tasks: Task[];
  logs: Log[];
  assets: Asset[];
  notes: Note[];
  invoices: Invoice[];
  resources: Resource[];
  
  toggleSidebar: () => void;
  setIdentity: (identity: Identity) => void;

  
  // Projects
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  updateProjectCanvas: (id: string, content: string) => Promise<void>;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  
  // Assets
  addAsset: (projectId: string, url: string, type: Asset['type']) => Promise<void>;

  // Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Invoices
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;

  // Resources
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  deleteResource: (id: string) => void;
  
  // Actions
  logAction: (projectId: string, action: string, details: string) => Promise<void>;
}

export const useStore = create<AgencyState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      identity: null,
      projects: [],
      tasks: [],
      logs: [],
      assets: [],
      notes: [],
      invoices: [],
      resources: [],

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setIdentity: (identity) => set({ identity }),

      addProject: async (projectData) => {
        const { identity } = get();
        if (!identity) return;

        const newProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };

        // Try external API
        await api.syncProject(newProject);

        set((state) => ({ projects: [...state.projects, newProject] }));
        await get().logAction(newProject.id, 'Project Created', `Created project for ${newProject.client}`);
      },

      updateProject: async (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
        const updated = get().projects.find(p => p.id === id);
        if (updated) await api.syncProject(updated);
      },

      updateProjectCanvas: async (id, content) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, canvasContent: content } : p)),
        }));
        const updated = get().projects.find(p => p.id === id);
        if (updated) await api.syncProject(updated); // Sync canvas state too
      },

      addTask: async (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        
        await api.syncTask(newTask);
        
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        await get().logAction(newTask.projectId, 'Task Added', `Added task: ${newTask.title}`);
      },

      updateTask: async (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        const updated = get().tasks.find(t => t.id === id);
        if (updated) {
          await api.syncTask(updated);
          await get().logAction(updated.projectId, 'Task Updated', `Moved task to ${updated.status}`);
        }
      },

      addAsset: async (projectId, url, type) => {
        const newAsset: Asset = {
          id: crypto.randomUUID(),
          projectId,
          url,
          type,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ assets: [...state.assets, newAsset] }));
        await get().logAction(projectId, 'Asset Uploaded', 'New asset added to project');
      },

      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)
        }));
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter(n => n.id !== id) }));
      },

      addInvoice: (invoiceData) => {
        const newInvoice: Invoice = {
          ...invoiceData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
      },

      updateInvoice: (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map(i => i.id === id ? { ...i, ...updates } : i)
        }));
      },

      addResource: (resourceData) => {
        const newResource: Resource = {
          ...resourceData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ resources: [newResource, ...state.resources] }));
      },

      deleteResource: (id) => {
        set((state) => ({ resources: state.resources.filter(r => r.id !== id) }));
      },

      logAction: async (projectId, action, details) => {
        const { identity } = get();
        if (!identity) return;

        const newLog: Log = {
          id: crypto.randomUUID(),
          projectId,
          action,
          details,
          actor: identity.name,
          createdAt: new Date().toISOString(),
        };

        await api.syncLog(newLog);

        set((state) => ({ logs: [newLog, ...state.logs] }));
      },
    }),
    {
      name: 'agency-os-storage',
    }
  )
);
