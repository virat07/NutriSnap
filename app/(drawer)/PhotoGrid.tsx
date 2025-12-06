// app/(drawer)/PhotoGrid.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MealDetailsModal from "./MealDetailsModal";

type PhotoEntry = {
  id: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  foodName?: string;
  foodCategory?: string;
  createdAt?: any;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitamins?: string[];
  minerals?: string[];
  servingSize?: string;
  healthRating?: number;
  healthNotes?: string;
  confidence?: number;
};

type Props = {
  photos: PhotoEntry[];
};

const MacroBadge = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <View style={styles.macroBadge}>
    <View style={[styles.macroColorDot, { backgroundColor: color }]} />
    <Text style={styles.macroBadgeLabel}>{label}</Text>
    <Text style={styles.macroBadgeValue}>{value.toFixed(1)}g</Text>
  </View>
);

export default function PhotoGrid({ photos }: Props) {
  const [selectedMeal, setSelectedMeal] = useState<PhotoEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMealPress = (meal: PhotoEntry) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedMeal(null), 300);
  };

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="restaurant-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No meals logged yet</Text>
        <Text style={styles.emptySubtext}>Tap "+ Add Photo" to analyze your first meal</Text>
      </View>
    );
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Meals</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={[styles.card, { 
              transform: [{ scale: 1 }],
              opacity: 1 - (index * 0.05),
            }]}
            onPress={() => handleMealPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.mealInfo}>
                <Ionicons name="fast-food" size={20} color="#667eea" />
                <Text style={styles.foodName}>
                  {item.foodName || `Meal ${index + 1}`}
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={14} color="#888" />
                <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.caloriesRow}>
              <Text style={styles.caloriesValue}>{item.calories}</Text>
              <Text style={styles.caloriesLabel}>calories</Text>
            </View>

            <View style={styles.macrosGrid}>
              <MacroBadge label="Protein" value={item.protein} color="#4ade80" />
              <MacroBadge label="Carbs" value={item.carbs} color="#60a5fa" />
              <MacroBadge label="Fat" value={item.fat} color="#fbbf24" />
            </View>
            
            <View style={styles.tapHint}>
              <Ionicons name="chevron-forward" size={16} color="#aaa" />
            </View>
          </TouchableOpacity>
        )}
      />
      
      <MealDetailsModal 
        visible={modalVisible}
        meal={selectedMeal ? {
          ...selectedMeal,
          foodName: selectedMeal.foodName || "Unknown Food",
        } : null}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#888",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mealInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  caloriesRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#667eea",
    marginRight: 8,
  },
  caloriesLabel: {
    fontSize: 14,
    color: "#888",
  },
  macrosGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  macroBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  macroColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroBadgeLabel: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  macroBadgeValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    marginLeft: "auto",
  },
  tapHint: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -8,
  },
});
