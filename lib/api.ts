import { Project, Task, Log } from '@/types';

/**
 * Handles communication with Google Apps Script and Cloudinary.
 * Falls back to console warnings if ENV vars are absent (enabling mock mode).
 */

const getAppsScriptUrl = () => process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

export async function syncProject(project: Project) {
  const url = getAppsScriptUrl();
  if (!url) {
    console.warn('[Mock Sync] Project:', project.name);
    return;
  }
  
  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action: 'sync_project', data: project }),
      mode: 'no-cors' // Google Apps Script typically needs no-cors from frontend if deployed as Web App
    });
  } catch (err) {
    console.error('Failed to sync project to Sheets:', err);
  }
}

export async function syncTask(task: Task) {
  const url = getAppsScriptUrl();
  if (!url) {
    console.warn('[Mock Sync] Task:', task.title);
    return;
  }
  
  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action: 'sync_task', data: task }),
      mode: 'no-cors'
    });
  } catch (err) {
    console.error('Failed to sync task to Sheets:', err);
  }
}

export async function syncLog(log: Log) {
  const url = getAppsScriptUrl();
  if (!url) {
    console.warn('[Mock Sync] Log:', log.action);
    return;
  }
  
  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ action: 'sync_log', data: log }),
      mode: 'no-cors'
    });
  } catch (err) {
    console.error('Failed to sync log to Sheets:', err);
  }
}

export async function uploadToCloudinary(file: File): Promise<string> {
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
