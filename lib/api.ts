import { Project, Task, Log, Asset, Note, Invoice, Resource } from '@/types';

export async function fetchAllData(userId: string | undefined) {
  const result: any = {
    projects: [], tasks: [], logs: [], assets: [], notes: [], invoices: [], resources: []
  };
  return result; // MOCKED
}

export async function syncProject(project: Project) {}
export async function deleteProject(id: string) {}
export async function syncTask(task: Task) {}
export async function syncLog(log: Log) {}
export async function syncAsset(asset: Asset) {}
export async function syncNote(note: Note) {}
export async function deleteNote(id: string) {}
export async function syncInvoice(invoice: Invoice) {}
export async function deleteInvoiceApi(id: string) {}
export async function syncResource(resource: Resource) {}
export async function deleteResourceApi(id: string) {}

export async function uploadToCloudinary(file: File): Promise<string> {
  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB limit
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 20MB limit.');
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.warn('[Mock Sync] Cloudinary. Resolving file as data URL.');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const data = await res.json();
  return data.secure_url;
}

