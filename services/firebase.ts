// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// ✅ Lazy load auth AFTER app is initialized
let firebaseAuth: Auth | undefined;

export const getAuthInstance = () => {
  if (!firebaseAuth) {
    firebaseAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  return firebaseAuth;
};

export const db = getFirestore(app);
export const storage = getStorage(app);