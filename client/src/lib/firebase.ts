import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("Initializing Firebase with project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize collections for a new user
async function initializeUserCollections(uid: string) {
  try {
    const userRef = doc(collection(db, 'users'), uid);
    
    // Create or update user document
    await setDoc(userRef, {
      uid,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    }, { merge: true });

    // Initialize settings subcollection
    const settingsRef = doc(collection(db, `users/${uid}/settings`), 'preferences');
    await setDoc(settingsRef, {
      notifications: true,
      theme: 'light'
    }, { merge: true });

    // Create default proxy server
    const proxyServerRef = doc(collection(db, 'proxyServers'), 'default');
    await setDoc(proxyServerRef, {
      userId: uid,
      name: "Default Server",
      host: "0.0.0.0",
      port: 8080,
      location: "Local",
      isActive: false,
    }, { merge: true });

    console.log("Initialized collections for user:", uid);
  } catch (error) {
    console.error("Error initializing user collections:", error);
    throw error;
  }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.uid);
    initializeUserCollections(user.uid);
  } else {
    console.log("User is signed out");
  }
});

export async function signUpWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up successfully:", result.user.uid);
    await initializeUserCollections(result.user.uid);
    return result.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in successfully:", result.user.uid);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}