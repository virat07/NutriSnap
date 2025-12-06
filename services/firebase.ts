import { initializeApp } from "firebase/app";
import { collection, query, where, getDocs, serverTimestamp, setDoc, doc, getFirestore } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable, getStorage } from "firebase/storage";
import {
  initializeAuth,
  getReactNativePersistence,
  signOut as firebaseSignOut,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


import { Auth } from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
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

// Helper to list user's uploaded photos with calorie info
export const listUserPhotos = async () => {
  const auth = getAuthInstance();
  const user = auth?.currentUser;
  if (!user) {
    console.warn("No authenticated user");
    return [];
  }
  const photosRef = collection(db, "photos");
  const q = query(photosRef, where("userId", "==", user.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    calories: doc.data().calories ?? 0,
    fat: doc.data().fat ?? 0,
    protein: doc.data().protein ?? 0,
    carbs: doc.data().carbs ?? 0,
    foodName: doc.data().foodName ?? "Unknown Food",
    foodCategory: doc.data().foodCategory,
    fiber: doc.data().fiber,
    sugar: doc.data().sugar,
    sodium: doc.data().sodium,
    vitamins: doc.data().vitamins ?? [],
    minerals: doc.data().minerals ?? [],
    servingSize: doc.data().servingSize,
    healthRating: doc.data().healthRating,
    healthNotes: doc.data().healthNotes,
    confidence: doc.data().confidence,
    createdAt: doc.data().createdAt,
  }));
};


// Helper to upload a photo to Firebase Storage and return its download URL
export const uploadPhoto = async (uri: string, uid: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = getStorage();
  const fileRef = ref(storageRef, `users/${uid}/${Date.now()}.jpg`);
  const uploadTask = uploadBytesResumable(fileRef, blob);
  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      () => resolve()
    );
  });
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

// Helper to add a nutrition entry document with timestamp
export const addPhotoDocument = async (
  uid: string,
  nutritionData: {
    calories: number;
    fat: number;
    protein: number;
    carbs: number;
    foodName?: string;
    foodCategory?: string;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    vitamins?: string[];
    minerals?: string[];
    servingSize?: string;
    healthRating?: number;
    healthNotes?: string;
    confidence?: number;
  }
) => {
  const photosRef = collection(db, "photos");
  const newDocRef = doc(photosRef);
  await setDoc(newDocRef, {
    userId: uid,
    calories: nutritionData.calories,
    fat: nutritionData.fat,
    protein: nutritionData.protein,
    carbs: nutritionData.carbs,
    foodName: nutritionData.foodName ?? "Unknown Food",
    foodCategory: nutritionData.foodCategory,
    fiber: nutritionData.fiber,
    sugar: nutritionData.sugar,
    sodium: nutritionData.sodium,
    vitamins: nutritionData.vitamins ?? [],
    minerals: nutritionData.minerals ?? [],
    servingSize: nutritionData.servingSize,
    healthRating: nutritionData.healthRating,
    healthNotes: nutritionData.healthNotes,
    confidence: nutritionData.confidence,
    createdAt: serverTimestamp(),
  });
};

// Update or create user profile
export const updateUserProfile = async (
  uid: string,
  profileData: Record<string, any>
) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, profileData, { merge: true });
};

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
