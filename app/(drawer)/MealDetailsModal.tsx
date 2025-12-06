// app/(drawer)/MealDetailsModal.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

type MealDetails = {
  id: string;
  foodName: string;
  foodCategory?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitamins?: string[];
  minerals?: string[];
  servingSize?: string;
  healthRating?: number;
  healthNotes?: string;
  confidence?: number;
  createdAt?: any;
};

type Props = {
  visible: boolean;
  meal: MealDetails | null;
  onClose: () => void;
};

const NutrientRow = ({ label, value, unit, color }: { label: string; value: number | string; unit?: string; color?: string }) => (
  <View style={styles.nutrientRow}>
    <View style={styles.nutrientLeft}>
      <View style={[styles.nutrientDot, { backgroundColor: color || "#667eea" }]} />
      <Text style={styles.nutrientLabel}>{label}</Text>
    </View>
    <Text style={styles.nutrientValue}>
      {typeof value === 'number' ? value.toFixed(1) : value}{unit}
    </Text>
  </View>
);

export default function MealDetailsModal({ visible, meal, onClose }: Props) {
  if (!meal) return null;

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalHeader}
          >
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Ionicons name="restaurant" size={40} color="#fff" />
              <Text style={styles.modalTitle}>{meal.foodName}</Text>
              
              {meal.foodCategory && (
                <View style={styles.categoryBadge}>
                  <Ionicons name="pricetag" size={14} color="#fff" />
                  <Text style={styles.categoryText}>{meal.foodCategory}</Text>
                </View>
              )}
              
              {meal.createdAt && (
                <Text style={styles.modalSubtitle}>{formatTime(meal.createdAt)}</Text>
              )}
            </View>

            <View style={styles.caloriesBanner}>
              <Text style={styles.caloriesBannerValue}>{meal.calories}</Text>
              <Text style={styles.caloriesBannerLabel}>calories</Text>
            </View>
          </LinearGradient>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Health Rating Section */}
            {meal.healthRating && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Health Rating</Text>
                <View style={styles.sectionContent}>
                  <View style={styles.healthRatingRow}>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= (meal.healthRating || 0) ? "star" : "star-outline"}
                          size={32}
                          color={star <= (meal.healthRating || 0) ? "#fbbf24" : "#d1d5db"}
                        />
                      ))}
                    </View>
                    <Text style={styles.healthRatingText}>
                      {meal.healthRating === 5 ? "Very Healthy" :
                       meal.healthRating === 4 ? "Healthy" :
                       meal.healthRating === 3 ? "Moderate" :
                       meal.healthRating === 2 ? "Less Healthy" : "Unhealthy"}
                    </Text>
                  </View>
                  {meal.healthNotes && (
                    <View style={styles.healthNotesBox}>
                      <Ionicons name="information-circle" size={20} color="#667eea" />
                      <Text style={styles.healthNotesText}>{meal.healthNotes}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Macronutrients Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Macronutrients</Text>
              <View style={styles.sectionContent}>
                <NutrientRow label="Protein" value={meal.protein} unit="g" color="#4ade80" />
                <NutrientRow label="Carbohydrates" value={meal.carbs} unit="g" color="#60a5fa" />
                <NutrientRow label="Fat" value={meal.fat} unit="g" color="#fbbf24" />
                {meal.fiber !== undefined && (
                  <NutrientRow label="Fiber" value={meal.fiber} unit="g" color="#a78bfa" />
                )}
                {meal.sugar !== undefined && (
                  <NutrientRow label="Sugar" value={meal.sugar} unit="g" color="#f472b6" />
                )}
              </View>
            </View>

            {/* Micronutrients Section */}
            {meal.sodium !== undefined && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Minerals & Sodium</Text>
                <View style={styles.sectionContent}>
                  <NutrientRow label="Sodium" value={meal.sodium} unit="mg" color="#fb923c" />
                </View>
              </View>
            )}

            {/* Vitamins Section */}
            {meal.vitamins && meal.vitamins.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vitamins</Text>
                <View style={styles.pillsContainer}>
                  {meal.vitamins.map((vitamin, index) => (
                    <View key={index} style={[styles.pill, { backgroundColor: '#4ade8020' }]}>
                      <Ionicons name="fitness" size={14} color="#4ade80" />
                      <Text style={[styles.pillText, { color: '#16a34a' }]}>{vitamin}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Minerals Section */}
            {meal.minerals && meal.minerals.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Minerals</Text>
                <View style={styles.pillsContainer}>
                  {meal.minerals.map((mineral, index) => (
                    <View key={index} style={[styles.pill, { backgroundColor: '#60a5fa20' }]}>
                      <Ionicons name="diamond" size={14} color="#60a5fa" />
                      <Text style={[styles.pillText, { color: '#2563eb' }]}>{mineral}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Serving Info Section */}
            {meal.servingSize && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional Info</Text>
                <View style={styles.sectionContent}>
                  <View style={styles.infoRow}>
                    <Ionicons name="restaurant-outline" size={20} color="#667eea" />
                    <Text style={styles.infoLabel}>Serving Size</Text>
                    <Text style={styles.infoValue}>{meal.servingSize}</Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  backdropTouch: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 24,
    paddingTop: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  headerContent: {
    alignItems: "center",
    marginTop: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 12,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  caloriesBanner: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  caloriesBannerValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  caloriesBannerLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  healthRatingRow: {
    alignItems: "center",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  healthRatingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  healthNotesBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#667eea",
    gap: 10,
  },
  healthNotesText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  nutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  nutrientLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutrientDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  nutrientLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },
});
