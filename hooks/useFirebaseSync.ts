import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Task, Log, Asset, Note, Invoice, Resource } from '@/types';

export function useFirebaseSync() {
  const identity = useStore(state => state.identity);

  useEffect(() => {
    if (!identity?.uid) return;

    const uid = identity.uid;
    const qProjects = query(collection(db, 'projects'), where('userId', '==', uid));
    const unsubProjects = onSnapshot(qProjects, (snap) => {
      const items = snap.docs.map(doc => doc.data() as Project);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ projects: uniqueItems });
    }, (error) => console.error("Firebase Sync Error (projects):", error));

    const qTasks = query(collection(db, 'tasks'), where('userId', '==', uid));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
      const items = snap.docs.map(doc => doc.data() as Task);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ tasks: uniqueItems });
    }, (error) => console.error("Firebase Sync Error (tasks):", error));

    const qLogs = query(collection(db, 'logs'), where('userId', '==', uid));
    const unsubLogs = onSnapshot(qLogs, (snap) => {
      const items = snap.docs.map(doc => doc.data() as Log);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ logs: uniqueItems });
    }, (error) => console.error("Firebase Sync Error (logs):", error));

    const qAssets = query(collection(db, 'assets'), where('userId', '==', uid));
    const unsubAssets = onSnapshot(qAssets, (snap) => {
      const items = snap.docs.map(doc => doc.data() as Asset);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ assets: uniqueItems });
    }, (error) => console.error("Firebase Sync Error (assets):", error));

    const qNotes = query(collection(db, 'notes'), where('userId', '==', uid));
    const unsubNotes = onSnapshot(qNotes, (snap) => {
      const items = snap.docs.map(doc => doc.data() as Note);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ notes: uniqueItems });
    }, (error) => console.error("Firebase Sync Error (notes):", error));

    const qInvoices = query(collection(db, 'invoices'), where('userId', '==', uid));
    const unsubInvoices = onSnapshot(qInvoices, (snap) => {
      const items = snap.docs.map(doc => doc.data() as Invoice);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ invoices: uniqueItems });
    }, (error) => console.error("Firebase Sync Error (invoices):", error));

    const qResources = query(collection(db, 'resources'), where('userId', '==', uid));
    const unsubResources = onSnapshot(qResources, (snap) => {
      const items = snap.docs.map(doc => doc.data() as Resource);
      const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
      useStore.setState({ resources: uniqueItems });
    }, (error) => console.error("Firebase Sync Error (resources):", error));

    return () => {
      unsubProjects();
      unsubTasks();
      unsubLogs();
      unsubAssets();
      unsubNotes();
      unsubInvoices();
      unsubResources();
    };
  }, [identity?.uid]);
}
