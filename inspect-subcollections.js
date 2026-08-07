import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const app =
  getApps().length === 0
    ? initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
    : getApps()[0];

const adminDb = getFirestore(app);

async function run() {
  const docRef = adminDb.doc("websites/humanbiomedicalsin/pages/categoryproducts/categories/abbott");
  const subcollections = await docRef.listCollections();
  console.log("Subcollections for abbott category doc:");
  subcollections.forEach(col => {
    console.log(`  Collection ID: ${col.id}`);
  });

  // Let's also check if there's any document in them
  for (const col of subcollections) {
    const snap = await col.limit(5).get();
    console.log(`  Docs in ${col.id}:`, snap.size);
    snap.forEach(d => {
      console.log(`    Doc ID: ${d.id}`, d.data());
    });
  }
}

run();
