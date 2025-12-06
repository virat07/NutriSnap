import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { analyzeFoodImage, NutrientAnalysis } from "../../services/openai";
import { getAuthInstance, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
export default function DashboardScreen() {
  const [image, setImage] = useState<any>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutrientAnalysis, setNutrientAnalysis] =
    useState<NutrientAnalysis | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  // Mock data for missing fields
  const mockData = {
    calories: 2000,
    protein: 120,
    fats: 80,
    carbs: 220,
    weight: 75,
    targetWeight: 70,
    avatar: "",
  } as Record<string, any>;
  const [mockFields, setMockFields] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const auth = getAuthInstance();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && isMounted) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        let userData: Record<string, any> = {};

        if (userDoc.exists()) {
          userData = userDoc.data();
        } else {
          console.warn("No user doc found for UID:", firebaseUser.uid);
        }

        const missing: string[] = [];
        const filledUser: Record<string, any> = { ...userData };

        if (mockData) {
          Object.keys(mockData).forEach((key) => {
            if (!userData[key]) {
              filledUser[key] = mockData[key];
              missing.push(key);
            }
          });
        }

        if (!filledUser.avatar) {
          filledUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            filledUser.name || "User"
          )}`;
        }

        setUser(filledUser);
        setMockFields(missing);
      }

      if (isMounted) setLoadingProfile(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (loadingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#00b894"
          style={{ flex: 1, justifyContent: "center" }}
        />
      </SafeAreaView>
    );
  }

  const openCamera = async () => {
    console.log("open camera");

    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log("Camera result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        setImage(image);
        console.log("Image captured:", image.uri);
        setShowImagePreview(true);
      } else {
        console.log("User cancelled camera");
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera. Please check permissions.");
    }
  };

  const confirmImage = async () => {
    if (!image) return;

    setAnalyzing(true);
    setShowImagePreview(false);

    try {
      console.log("Using OpenAI API...");
      const analysis = await analyzeFoodImage(image.uri);
      setNutrientAnalysis(analysis);
      console.log("Nutrient analysis:", analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      Alert.alert(
        "Analysis Error",
        "Failed to analyze the food image. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setShowImagePreview(false);
    setNutrientAnalysis(null);
  };

  const closeAnalysis = () => {
    setNutrientAnalysis(null);
    setImage(null);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.welcome}>
          Welcome, {user.name || "User"}
          {mockFields.includes("name") && (
            <Text style={{ color: "orange" }}> (mock)</Text>
          )}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Stats</Text>
          <Text style={styles.stat}>
            Calories: {user.calories} kcal
            {mockFields.includes("calories") && (
              <Text style={{ color: "orange" }}> (mock)</Text>
            )}
          </Text>
          <Text style={styles.stat}>
            Protein: {user.protein} g
            {mockFields.includes("protein") && (
              <Text style={{ color: "orange" }}> (mock)</Text>
            )}
          </Text>
          <Text style={styles.stat}>
            Fats: {user.fats} g
            {mockFields.includes("fats") && (
              <Text style={{ color: "orange" }}> (mock)</Text>
            )}
          </Text>
          <Text style={styles.stat}>
            Carbs: {user.carbs} g
            {mockFields.includes("carbs") && (
              <Text style={{ color: "orange" }}> (mock)</Text>
            )}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <Text style={styles.stat}>
            Current Weight: {user.weight} kg
            {mockFields.includes("weight") && (
              <Text style={{ color: "orange" }}> (mock)</Text>
            )}
          </Text>
          <Text style={styles.stat}>
            Target Weight: {user.targetWeight} kg
            {mockFields.includes("targetWeight") && (
              <Text style={{ color: "orange" }}> (mock)</Text>
            )}
          </Text>
          {/* Here you can add a chart component for progress */}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => openCamera()}>
          <Text style={styles.buttonText}>Log a Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Track Activity</Text>
        </TouchableOpacity>

        {/* More sections can be added here */}
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal
        visible={showImagePreview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowImagePreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Review Your Photo</Text>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={retakePhoto}
              >
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmImage}
              >
                <Text style={styles.confirmButtonText}>Analyze Food</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Analysis Loading Modal */}
      <Modal visible={analyzing} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#00b894" />
            <Text style={styles.loadingText}>Analyzing your food...</Text>
            <Text style={styles.loadingSubtext}>
              This may take a few seconds
            </Text>
          </View>
        </View>
      </Modal>

      {/* Nutrient Analysis Modal */}
      <Modal
        visible={!!nutrientAnalysis}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAnalysis}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.analysisContent}>
            <Text style={styles.analysisTitle}>Nutrition Analysis</Text>
            {nutrientAnalysis && (
              <ScrollView style={styles.analysisScroll}>
                <Text style={styles.foodName}>{nutrientAnalysis.foodName}</Text>
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(nutrientAnalysis.confidence * 100)}%
                </Text>

                <View style={styles.nutrientSection}>
                  <Text style={styles.sectionTitle}>Macronutrients</Text>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Calories:</Text>
                    <Text style={styles.nutrientValue}>
                      {nutrientAnalysis.calories} kcal
                    </Text>
                  </View>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Protein:</Text>
                    <Text style={styles.nutrientValue}>
                      {nutrientAnalysis.protein}g
                    </Text>
                  </View>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Carbs:</Text>
                    <Text style={styles.nutrientValue}>
                      {nutrientAnalysis.carbs}g
                    </Text>
                  </View>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Fats:</Text>
                    <Text style={styles.nutrientValue}>
                      {nutrientAnalysis.fat}g
                    </Text>
                  </View>
                </View>

                <View style={styles.nutrientSection}>
                  <Text style={styles.sectionTitle}>Other Nutrients</Text>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Fiber:</Text>
                    <Text style={styles.nutrientValue}>
                      {nutrientAnalysis.fiber}g
                    </Text>
                  </View>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Sugar:</Text>
                    <Text style={styles.nutrientValue}>
                      {nutrientAnalysis.sugar}g
                    </Text>
                  </View>
                  <View style={styles.nutrientRow}>
                    <Text style={styles.nutrientLabel}>Sodium:</Text>
                    <Text style={styles.nutrientValue}>
                      {nutrientAnalysis.sodium}mg
                    </Text>
                  </View>
                </View>

                {nutrientAnalysis.vitamins.length > 0 && (
                  <View style={styles.nutrientSection}>
                    <Text style={styles.sectionTitle}>Vitamins</Text>
                    <Text style={styles.nutrientList}>
                      {nutrientAnalysis.vitamins.join(", ")}
                    </Text>
                  </View>
                )}

                {nutrientAnalysis.minerals.length > 0 && (
                  <View style={styles.nutrientSection}>
                    <Text style={styles.sectionTitle}>Minerals</Text>
                    <Text style={styles.nutrientList}>
                      {nutrientAnalysis.minerals.join(", ")}
                    </Text>
                  </View>
                )}

                <View style={styles.nutrientSection}>
                  <Text style={styles.sectionTitle}>Serving Size</Text>
                  <Text style={styles.servingSize}>
                    {nutrientAnalysis.servingSize}
                  </Text>
                </View>
              </ScrollView>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeAnalysis}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#00b894",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  welcome: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stat: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#00b894',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  retakeButton: {
    backgroundColor: "#ff6b6b",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  retakeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#00b894",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    color: "#333",
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  analysisContent: {
    backgroundColor: "white",
    borderRadius: 15,
    margin: 20,
    maxHeight: "80%",
    flex: 1,
  },
  analysisTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    color: "#333",
  },
  analysisScroll: {
    flex: 1,
    padding: 20,
  },
  foodName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00b894",
    textAlign: "center",
    marginBottom: 10,
  },
  confidenceText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  nutrientSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  nutrientLabel: {
    fontSize: 16,
    color: "#555",
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  nutrientList: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  servingSize: {
    fontSize: 16,
    color: "#555",
    fontStyle: "italic",
  },
  closeButton: {
    backgroundColor: "#00b894",
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
