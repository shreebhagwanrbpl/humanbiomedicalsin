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
  const categoriesSnap = await adminDb.collection("websites/humanbiomedicalsin/pages/categoryproducts/categories").get();
  console.log(`Total categories: ${categoriesSnap.size}`);
  
  let totalSubcollectionProducts = 0;
  for (const doc of categoriesSnap.docs) {
    const productsSnap = await doc.ref.collection("products").get();
    if (productsSnap.size > 0) {
      console.log(`Category "${doc.id}" has ${productsSnap.size} products in subcollection`);
      totalSubcollectionProducts += productsSnap.size;
      const first = productsSnap.docs[0].data();
      console.log(`  First product: "${first.title}", subCategory: "${first.subCategory || first.subcategory || 'N/A'}"`);
    } else {
      console.log(`Category "${doc.id}" has 0 products in subcollection`);
    }
  }
  console.log(`Total products in all category subcollections: ${totalSubcollectionProducts}`);
}

run();
