import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Task, Log } from '@/types';

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

    return () => {
      unsubProjects();
      unsubTasks();
      unsubLogs();
    };
  }, []);
}
