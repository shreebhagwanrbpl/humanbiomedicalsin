import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export function getAdminDb() {
  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  try {
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

    return getFirestore(app);
  } catch (err) {
    console.error("Firebase Admin initialization error:", err);
    return null;
  }
}

export const adminDb = getAdminDb();