import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import config from './firebase-applet-config.json';

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  const collections = ['projects', 'tasks', 'logs', 'assets', 'notes', 'invoices', 'resources'];
  for (const c of collections) {
    const snap = await getDocs(collection(db, c));
    let counts: any = {};
    snap.docs.forEach(d => {
      const data = d.data();
      const id = data.id;
      if (!counts[id]) counts[id] = [];
      counts[id].push(d.id);
    });
    const dups = Object.keys(counts).filter(k => counts[k].length > 1);
    if (dups.length > 0) {
      console.log(`Duplicates in ${c}:`);
      for (const k of dups) {
        console.log(`ID ${k} found in doc IDs: ${counts[k].join(', ')}`);
        // Let's delete the duplicate (keep only the first)
        for (let i = 1; i < counts[k].length; i++) {
            const docToRemove = counts[k][i];
            console.log(`Deleting duplicate doc: ${docToRemove}`);
            await deleteDoc(doc(db, c, docToRemove));
        }
      }
    } else {
      console.log(`No dups in ${c}`);
    }
  }
}
check().catch(console.error);
