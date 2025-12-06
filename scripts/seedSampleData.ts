// scripts/seedSampleData.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "../services/firebase"; // Assuming firebaseConfig is exported

// Initialize Firebase (use same config as app)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data - replace URLs with actual image links if desired
const samplePhotos = [
  {
    url: "https://via.placeholder.com/300x300.png?text=Meal+1",
    calories: 350,
    userId: "sampleUser",
  },
  {
    url: "https://via.placeholder.com/300x300.png?text=Meal+2",
    calories: 420,
    userId: "sampleUser",
  },
  {
    url: "https://via.placeholder.com/300x300.png?text=Meal+3",
    calories: 280,
    userId: "sampleUser",
  },
];

async function seed() {
  try {
    const photosRef = collection(db, "photos");
    for (const photo of samplePhotos) {
      await addDoc(photosRef, photo);
      console.log("Added photo", photo);
    }
    console.log("Sample data seeded successfully.");
  } catch (e) {
    console.error("Error seeding data:", e);
  }
}

seed();
