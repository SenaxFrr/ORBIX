import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDR2Qg9WHRitRcEY6beFl9QbJle688qWd8",
  authDomain: "orbix-e3aa0.firebaseapp.com",
  databaseURL: "https://orbix-e3aa0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "orbix-e3aa0",
  storageBucket: "orbix-e3aa0.firebasestorage.app",
  messagingSenderId: "838391303952",
  appId: "1:838391303952:web:16c8d05c3c0051f6a45f95",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const rtdb = getDatabase(firebaseApp);

export const FIREBASE_SYNC_REV = 2;
