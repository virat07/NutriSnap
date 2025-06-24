import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  signOut as firebaseSignOut,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpDJtRrbE2fVHwKbyhnYU5nF5EvkBCBCE",
  authDomain: "nutrisnap-ead5d.firebaseapp.com",
  projectId: "nutrisnap-ead5d",
  storageBucket: "nutrisnap-ead5d.firebasestorage.app",
  messagingSenderId: "701312807135",
  appId: "1:701312807135:web:161094e92213eabcadf96a",
  measurementId: "G-SPPMVR3XW5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence (AsyncStorage)
let firebaseAuth: Auth | undefined;

export const getAuthInstance = () => {
  if (!firebaseAuth) {
    firebaseAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  return firebaseAuth;
};

// Firebase Firestore and Storage instances
export const db = getFirestore(app);
export const storage = getStorage(app);

// Sign-out function
export const signOutUser = async () => {
  try {
    const auth = getAuthInstance();
    await firebaseSignOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
