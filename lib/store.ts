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
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  updateProjectCanvas: (id: string, content: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  
  // Assets
  addAsset: (projectId: string, url: string, type: Asset['type']) => Promise<void>;

  // Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;

  // Invoices
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => Promise<void>;
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  // Resources
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  
  // Actions
  logAction: (projectId: string, action: string, details: string) => Promise<void>;
  initFromFirebase: () => Promise<void>;
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
        if (!identity) return "";

        const newProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          userId: identity.uid,
          createdAt: new Date().toISOString(),
        };

        // Try external API
        await api.syncProject(newProject);

        set((state) => {
          if (state.projects.some(p => p.id === newProject.id)) return state;
          return { projects: [...state.projects, newProject] };
        });
        await get().logAction(newProject.id, 'Project Created', `Created project for ${newProject.client}`);
        return newProject.id;
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

      deleteProject: async (id) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
          tasks: state.tasks.filter(t => t.projectId !== id),
          logs: state.logs.filter(l => l.projectId !== id),
          assets: state.assets.filter(a => a.projectId !== id)
        }));
        await api.deleteProject(id);
      },

      addTask: async (taskData) => {
        const { identity } = get();
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          userId: identity?.uid,
          createdAt: new Date().toISOString(),
        };
        
        await api.syncTask(newTask);
        
        set((state) => {
          if (state.tasks.some(t => t.id === newTask.id)) return state;
          return { tasks: [...state.tasks, newTask] };
        });
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
        const { identity } = get();
        const newAsset: Asset = {
          id: crypto.randomUUID(),
          userId: identity?.uid,
          projectId,
          url,
          type,
          createdAt: new Date().toISOString(),
        };

        await api.syncAsset(newAsset);

        set((state) => {
          if (state.assets.some(a => a.id === newAsset.id)) return state;
          return { assets: [...state.assets, newAsset] };
        });
        await get().logAction(projectId, 'Asset Uploaded', 'New asset added to project');
      },

      addNote: async (noteData) => {
        const { identity } = get();
        const newNote: Note = {
          ...noteData,
          id: crypto.randomUUID(),
          userId: identity?.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await api.syncNote(newNote);
        set((state) => {
          if (state.notes.some(n => n.id === newNote.id)) return state;
          return { notes: [newNote, ...state.notes] };
        });
        return newNote.id;
      },

      updateNote: async (id, updates) => {
        set((state) => ({
          notes: state.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)
        }));
        const updated = get().notes.find(n => n.id === id);
        if (updated) await api.syncNote(updated);
      },

      deleteNote: async (id) => {
        await api.deleteNote(id);
        set((state) => ({ notes: state.notes.filter(n => n.id !== id) }));
      },

      addInvoice: async (invoiceData) => {
        const { identity } = get();
        const newInvoice: Invoice = {
          ...invoiceData,
          id: crypto.randomUUID(),
          userId: identity?.uid,
          createdAt: new Date().toISOString(),
        };
        await api.syncInvoice(newInvoice);
        set((state) => {
          if (state.invoices.some(i => i.id === newInvoice.id)) return state;
          return { invoices: [newInvoice, ...state.invoices] };
        });
      },

      updateInvoice: async (id, updates) => {
        set((state) => ({
          invoices: state.invoices.map(i => i.id === id ? { ...i, ...updates } : i)
        }));
        const updated = get().invoices.find(i => i.id === id);
        if (updated) await api.syncInvoice(updated);
      },

      deleteInvoice: async (id) => {
        await api.deleteInvoiceApi(id);
        set((state) => ({ invoices: state.invoices.filter(i => i.id !== id) }));
      },

      addResource: async (resourceData) => {
        const { identity } = get();
        const newResource: Resource = {
          ...resourceData,
          id: crypto.randomUUID(),
          userId: identity?.uid,
          createdAt: new Date().toISOString(),
        };
        await api.syncResource(newResource);
        set((state) => {
          if (state.resources.some(r => r.id === newResource.id)) return state;
          return { resources: [newResource, ...state.resources] };
        });
      },

      deleteResource: async (id) => {
        await api.deleteResourceApi(id);
        set((state) => ({ resources: state.resources.filter(r => r.id !== id) }));
      },

      logAction: async (projectId, action, details) => {
        const { identity } = get();
        if (!identity) return;

        const newLog: Log = {
          id: crypto.randomUUID(),
          userId: identity.uid,
          projectId,
          action,
          details,
          actor: identity.name,
          createdAt: new Date().toISOString(),
        };

        await api.syncLog(newLog);

        set((state) => {
          if (state.logs.some(l => l.id === newLog.id)) return state;
          return { logs: [newLog, ...state.logs] };
        });
      },

      initFromFirebase: async () => {
        const { identity } = get();
        if (!identity?.uid) return;
        const data = await api.fetchAllData(identity.uid);
        set((state) => ({
          projects: data.projects.length ? data.projects : state.projects,
          tasks: data.tasks.length ? data.tasks : state.tasks,
          logs: data.logs.length ? data.logs : state.logs,
          assets: data.assets.length ? data.assets : state.assets,
          notes: data.notes.length ? data.notes : state.notes,
          invoices: data.invoices.length ? data.invoices : state.invoices,
          resources: data.resources.length ? data.resources : state.resources,
        }));
      },
    }),
    {
      name: 'agency-os-storage',
    }
  )
);
