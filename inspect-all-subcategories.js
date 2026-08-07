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
  console.log("Total categories found:", categoriesSnap.size);
  
  let totalSubcategories = 0;
  let totalProducts = 0;

  for (const catDoc of categoriesSnap.docs) {
    const catData = catDoc.data();
    const subSnap = await catDoc.ref.collection("subcategories").get();
    
    if (subSnap.size > 0) {
      console.log(`Category: "${catDoc.id}" (${catData.category}) has ${subSnap.size} subcategories:`);
      totalSubcategories += subSnap.size;
      subSnap.forEach(subDoc => {
        const subData = subDoc.data();
        const pCount = (subData.products || []).length;
        totalProducts += pCount;
        console.log(`  Subcategory: "${subDoc.id}" (${subData.subCategory}) has ${pCount} products`);
      });
    }
  }

  console.log(`Summary:`);
  console.log(`  Total subcategories: ${totalSubcategories}`);
  console.log(`  Total products in subcategories: ${totalProducts}`);
}

run();
