import { initializeApp } from "firebase/app";
import { getFirestore, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGIJXX3MR1CxmIJbJHyVzbfRa0M0Sw6FQ",
  authDomain: "rajbiosis-central.firebaseapp.com",
  projectId: "rajbiosis-central",
  storageBucket: "rajbiosis-central.firebasestorage.app",
  messagingSenderId: "190335913620",
  appId: "1:190335913620:web:99a14edcbb528f06c1ee81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 ADD THESE LINES
export const db = getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);

// Simple client-side cache for document fetching
const clientCache = new Map();
export async function getCachedDoc(docRef) {
  const key = docRef.path;
  if (clientCache.has(key)) {
    return clientCache.get(key);
  }
  const snap = await getDoc(docRef);
  clientCache.set(key, snap);
  return snap;
}
