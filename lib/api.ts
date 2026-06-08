import { Project, Task, Log } from '@/types';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function syncProject(project: Project) {
  try {
    await setDoc(doc(db, 'projects', project.id), project);
  } catch (err) {
    console.error('Failed to sync project to Firebase:', err);
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
