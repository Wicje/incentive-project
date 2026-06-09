import { Project, Task, Log, Asset, Note, Invoice, Resource } from '@/types';
import { db } from './firebase';
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

export async function fetchAllData() {
  const result: any = {
    projects: [], tasks: [], logs: [], assets: [], notes: [], invoices: [], resources: []
  };
  try {
    const pSnap = await getDocs(collection(db, 'projects'));
    pSnap.forEach(d => result.projects.push(d.data()));
    
    const tSnap = await getDocs(collection(db, 'tasks'));
    tSnap.forEach(d => result.tasks.push(d.data()));

    const lSnap = await getDocs(collection(db, 'logs'));
    lSnap.forEach(d => result.logs.push(d.data()));
    
    const aSnap = await getDocs(collection(db, 'assets'));
    aSnap.forEach(d => result.assets.push(d.data()));

    const nSnap = await getDocs(collection(db, 'notes'));
    nSnap.forEach(d => result.notes.push(d.data()));

    const iSnap = await getDocs(collection(db, 'invoices'));
    iSnap.forEach(d => result.invoices.push(d.data()));

    const rSnap = await getDocs(collection(db, 'resources'));
    rSnap.forEach(d => result.resources.push(d.data()));
  } catch (err) {
    console.error('Failed to fetch from Firebase', err);
  }
  return result;
}

export async function syncProject(project: Project) {
  try {
    await setDoc(doc(db, 'projects', project.id), project);
  } catch (err) {
    console.error('Failed to sync project to Firebase:', err);
  }
}

export async function deleteProject(id: string) {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (err) {
    console.error('Failed to delete project from Firebase:', err);
  }
}

export async function syncTask(task: Task) {
  try {
    await setDoc(doc(db, 'tasks', task.id), task);
  } catch (err) {
    console.error('Failed to sync task to Firebase:', err);
  }
}

export async function syncLog(log: Log) {
  try {
    await setDoc(doc(db, 'logs', log.id), log);
  } catch (err) {
    console.error('Failed to sync log to Firebase:', err);
  }
}

export async function syncAsset(asset: Asset) {
  try {
    await setDoc(doc(db, 'assets', asset.id), asset);
  } catch (err) {
    console.error('Failed to sync asset to Firebase:', err);
  }
}

export async function syncNote(note: Note) {
  try {
    await setDoc(doc(db, 'notes', note.id), note);
  } catch (err) {
    console.error('Failed to sync note to Firebase:', err);
  }
}

export async function deleteNote(id: string) {
  try {
    await deleteDoc(doc(db, 'notes', id));
  } catch (err) {
    console.error('Failed to delete note from Firebase:', err);
  }
}

export async function syncInvoice(invoice: Invoice) {
  try {
    await setDoc(doc(db, 'invoices', invoice.id), invoice);
  } catch (err) {
    console.error('Failed to sync invoice to Firebase:', err);
  }
}

export async function syncResource(resource: Resource) {
  try {
    await setDoc(doc(db, 'resources', resource.id), resource);
  } catch (err) {
    console.error('Failed to sync resource to Firebase:', err);
  }
}

export async function deleteResourceApi(id: string) {
  try {
    await deleteDoc(doc(db, 'resources', id));
  } catch (err) {
    console.error('Failed to delete resource from Firebase:', err);
  }
}

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
