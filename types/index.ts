export type ProjectStatus = 'planning' | 'in-progress' | 'review' | 'completed';
export type TaskStage = 'research' | 'moodboard' | 'design' | 'delivery';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Identity {
  name: string;
  email: string;
}

export interface Project {
  id: string;
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
  projectId: string;
  title: string;
  stage: TaskStage;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
}

export interface Log {
  id: string;
  projectId: string;
  action: string;
  details: string;
  actor: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  projectId: string;
  url: string;
  type: 'image' | 'video' | 'document';
  createdAt: string;
}
