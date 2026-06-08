import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Task, Log, Asset, Note, Invoice, Resource } from '@/types';

export function useFirebaseSync() {
  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Project);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ projects: uniqueItems });
    });

    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Task);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ tasks: uniqueItems });
    });

    const unsubLogs = onSnapshot(collection(db, 'logs'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Log);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ logs: uniqueItems });
    });

    const unsubAssets = onSnapshot(collection(db, 'assets'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Asset);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ assets: uniqueItems });
    });

    const unsubNotes = onSnapshot(collection(db, 'notes'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Note);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ notes: uniqueItems });
    });

    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Invoice);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ invoices: uniqueItems });
    });

    const unsubResources = onSnapshot(collection(db, 'resources'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Resource);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ resources: uniqueItems });
    });

    return () => {
      unsubProjects();
      unsubTasks();
      unsubLogs();
      unsubAssets();
      unsubNotes();
      unsubInvoices();
      unsubResources();
    };
  }, []);
}
