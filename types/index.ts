export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed';
export type TaskStage = 'research' | 'moodboard' | 'design' | 'delivery';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Identity {
  uid: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  userId?: string;
  name: string;
  client: string;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  ownerName: string;
  ownerEmail: string;
  canvasContent?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId?: string;
  projectId: string;
  title: string;
  stage: TaskStage;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export interface Log {
  id: string;
  userId?: string;
  projectId: string;
  action: string;
  details: string;
  actor: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  userId?: string;
  projectId: string;
  url: string;
  type: 'image' | 'video' | 'document';
  createdAt: string;
}

export interface Note {
  id: string;
  userId?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface Invoice {
  id: string;
  userId?: string;
  projectId: string; // can be empty for standalone
  clientName: string;
  clientEmail: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid';
  dueDate: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface Resource {
  id: string;
  userId?: string;
  title: string;
  url: string;
  category: string;
  createdAt: string;
}
