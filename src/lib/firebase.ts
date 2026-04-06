import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA8ruAfXOOTIry6j0z6ODL6JKc3pPWfbnw",
  authDomain: "editrealtime-2da19.firebaseapp.com",
  projectId: "editrealtime-2da19",
  storageBucket: "editrealtime-2da19.appspot.com",
  messagingSenderId: "50996894410",
  appId: "1:50996894410:web:2e8420230698c4ef0e3233",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let initialized = false;

const initFirebase = () => {
  if (initialized) return;
  
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    initialized = true;
  } catch (e) {
    console.error('Firebase init error:', e);
  }
};

// Initialize on import
initFirebase();

export { app, auth, db, storage };
export { firebaseConfig };
