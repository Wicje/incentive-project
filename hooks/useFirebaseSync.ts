import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Task, Log, Asset, Note, Invoice, Resource } from '@/types';

export function useFirebaseSync() {
  useEffect(() => {
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const projects = snap.docs.map(doc => doc.data() as Project);
      useStore.setState({ projects });
    });

    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snap) => {
      const tasks = snap.docs.map(doc => doc.data() as Task);
      useStore.setState({ tasks });
    });

    const unsubLogs = onSnapshot(collection(db, 'logs'), (snap) => {
      const logs = snap.docs.map(doc => doc.data() as Log);
      useStore.setState({ logs });
    });

    const unsubAssets = onSnapshot(collection(db, 'assets'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Asset);
      useStore.setState({ assets: items });
    });

    const unsubNotes = onSnapshot(collection(db, 'notes'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Note);
      useStore.setState({ notes: items });
    });

    const unsubInvoices = onSnapshot(collection(db, 'invoices'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Invoice);
      useStore.setState({ invoices: items });
    });

    const unsubResources = onSnapshot(collection(db, 'resources'), (snap) => {
      const items = snap.docs.map(doc => doc.data() as Resource);
      useStore.setState({ resources: items });
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
