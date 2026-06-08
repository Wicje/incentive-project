import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import config from './firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  const collections = ['projects', 'tasks', 'logs', 'assets', 'notes', 'invoices', 'resources'];
  for (const c of collections) {
    const snap = await getDocs(collection(db, c));
    let counts: any = {};
    snap.docs.forEach(doc => {
      const data = doc.data();
      const id = data.id;
      if (!counts[id]) counts[id] = [];
      counts[id].push(doc.id);
    });
    const dups = Object.keys(counts).filter(k => counts[k].length > 1);
    if (dups.length > 0) {
      console.log(`Duplicates in ${c}:`);
      for (const d of dups) {
        console.log(`ID ${d} found in doc IDs: ${counts[d].join(', ')}`);
      }
    } else {
      console.log(`No dups in ${c}`);
    }
  }
}
check().catch(console.error);
