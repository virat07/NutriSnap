// app/(drawer)/dashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  listUserPhotos,
  getAuthInstance,
  addPhotoDocument,
} from "../../services/firebase";
import { analyzeFoodImage } from "../../services/openai";
import PhotoGrid from "./PhotoGrid";
import CaloriesSummary from "./CaloriesSummary";

// Lazy import for the native date picker (works on iOS & Android)
const DateTimePicker = Platform.OS === "web" ? null : require("@react-native-community/datetimepicker").default;

type PhotoEntry = {
  id: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  createdAt?: any;
};

export default function DashboardScreen() {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listUserPhotos();
      setPhotos(data);
    } catch (e) {
      console.error("Failed to load photos", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // -------------------------------------------------
  // Image picker & upload
  // -------------------------------------------------
  const pickImage = async () => {
    const { status } = await (await import("expo-image-picker")).requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access photos is required.");
      return;
    }
    const result = await (await import("expo-image-picker")).launchImageLibraryAsync({
      mediaTypes: (await import("expo-image-picker")).MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      await uploadAndSave(asset.uri);
    }
  };

  const uploadAndSave = async (uri: string) => {
    setUploading(true);
    try {
      const auth = getAuthInstance();
      const user = auth?.currentUser;
      if (!user) throw new Error("User not logged in");
      
      // Analyze the image directly (no upload needed)
      console.log("Analyzing food image...");
      const nutrition = await analyzeFoodImage(uri);
      console.log("Analysis result:", nutrition);
      
      // Store the nutrition data
      await addPhotoDocument(user.uid, nutrition);
      
      await fetchPhotos();
      alert(`Added: ${nutrition.calories} cal, ${nutrition.protein}g protein`);
    } catch (e) {
      console.error("Analysis failed", e);
      alert("Failed to analyze photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // -------------------------------------------------
  // Date picker handling
  // -------------------------------------------------
  const onChangeDate = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  // Filter photos by selected day (if any)
  const filteredPhotos = photos.filter((p) => {
    if (!selectedDate) return true;
    if (!p.createdAt) return false;
    // Firestore timestamp may be an object with seconds & nanoseconds
    const ts = p.createdAt.seconds ? new Date(p.createdAt.seconds * 1000) : new Date(p.createdAt);
    return ts.toDateString() === selectedDate.toDateString();
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Add Photo button and Calendar */}
      <View style={styles.header}>
        <Text style={styles.title}>My Meals</Text>
        <View style={styles.rightGroup}>
          <TouchableOpacity style={styles.dateButton} onPress={openPicker}>
            <Text style={styles.dateButtonText}>
              {selectedDate ? selectedDate.toDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={pickImage}
            disabled={uploading}
          >
            <Text style={styles.addButtonText}>
              {uploading ? "Analyzing…" : "+ Add Photo"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date picker modal (only on native platforms) */}
      {showPicker && DateTimePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <CaloriesSummary photos={filteredPhotos} />
      <PhotoGrid photos={filteredPhotos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateButtonText: {
    color: "#667eea",
    fontWeight: "600",
    fontSize: 13,
  },
  addButton: {
    backgroundColor: "#667eea",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
