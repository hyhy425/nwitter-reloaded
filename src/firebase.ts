import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEXdGXY9-KBYJ598OxhGf4EcXbuRmZJGc",
  authDomain: "nwitter-reloaded-56f1c.firebaseapp.com",
  projectId: "nwitter-reloaded-56f1c",
  storageBucket: "nwitter-reloaded-56f1c.firebasestorage.app",
  messagingSenderId: "161974928854",
  appId: "1:161974928854:web:c18bfcf6e88d8816785077",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// export const storage = getStorage(app);

export const db = getFirestore(app);
